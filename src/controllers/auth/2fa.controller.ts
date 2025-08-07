import {Request, Response} from "express";
import User from "../../models/user.model";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import {
    errorApiResponse,
    successApiResponse,
    ApiResponseCode,
    errMessage,
} from "../../utils/apiResponse";
import {logger} from "../../utils/logger";
import * as argon2 from "argon2";



/**
 * @desc    Generate a new 2FA secret for the user
 * @route   POST /api/creative-verse/v1/profile/2fa/generate
 * @access  Private
 */
export const generateTwoFactorSecret = async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return errorApiResponse(res, "User not found", "Not Found", ApiResponseCode.NOT_FOUND);
        }

        // Generate a new secret
        const secret = speakeasy.generateSecret({
            name: `CreativityVerse (${user.email})`,
        });

        // Temporarily store the secret. It's not active until verified.
        // @ts-ignore
        user.security.two_factor.secret= secret;
        await user.save();

        // Generate a QR code from the otpauth_url
        qrcode.toDataURL(secret.otpauth_url!, (err, data_url) => {
            if (err) {
                logger.error("Error generating QR code", err);
                return errorApiResponse(
                    res,
                    "Could not generate QR code",
                    err,
                    ApiResponseCode.INTERNAL_ERROR
                );
            }

            return successApiResponse(
                res,
                "2FA secret generated. Please scan the QR code and verify.",
                {qrCodeUrl: data_url, secret: secret.base32} // Send base32 for manual entry
            );
        });


    } catch (error) {
        logger.error("Error generating 2FA secret", error);
        return errorApiResponse(
            res,
            "Server Error",
            error,
            ApiResponseCode.INTERNAL_ERROR
        );
    }
};

/**
 * @desc    Verify a 2FA token and enable 2FA for the user
 * @route   POST /api/creative-verse/v1/profile/2fa/verify
 * @access  Private
 */
export const verifyAndEnableTwoFactor = async (
    req: Request,
    res: Response
) => {
    const {token} = req.body;
    const userId = req.user?.userId;

    if (!token) {
        return errorApiResponse(
            res,
            "Token is required",
            errMessage.BAD_REQUEST,
            ApiResponseCode.BAD_REQUEST
        );
    }

    try {
        const user = await User.findById(userId);
        if (!user || !user.security?.two_factor?.secret?.base32) {
            return errorApiResponse(
                res,
                "2FA secret not found. Please generate one first.",
                "Not Found",
                ApiResponseCode.NOT_FOUND
            );
        }

        const isVerified = speakeasy.totp.verify({
            secret: user.security.two_factor.secret.base32,
            encoding: "base32",
            token,
            window: 1, // Allow a 30-second window for clock drift
        });

        if (!isVerified) {
            return errorApiResponse(
                res,
                "Invalid 2FA token",
                "Unauthorized",
                ApiResponseCode.UNAUTHORIZED
            );
        }

        // If verified, enable 2FA
        user.security.two_factor.enabled = true;
        await user.save();

        return successApiResponse(res, "2FA has been enabled successfully.", {});
    } catch (error) {
        logger.error("Error verifying 2FA token", error);
        return errorApiResponse(
            res,
            "Server Error",
            error,
            ApiResponseCode.INTERNAL_ERROR
        );
    }
};

/**
 * @desc    Disable 2FA for the user
 * @route   POST /api/creative-verse/v1/profile/2fa/disable
 * @access  Private
 */
export const disableTwoFactor = async (
    req: Request,
    res: Response
) => {
    const {password} = req.body;
    const userId = req.user?.userId;

    if (!password) {
        return errorApiResponse(
            res,
            "Password is required to disable 2FA",
            errMessage.BAD_REQUEST,
            ApiResponseCode.BAD_REQUEST
        );
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return errorApiResponse(res, "User not found", "Not Found", 404);
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return errorApiResponse(
                res,
                "Invalid password",
                errMessage.UNAUTHORIZED,
                ApiResponseCode.UNAUTHORIZED
            );
        }

        // Disable 2FA
        // @ts-ignore
        user.security.two_factor.enabled = false;
        // @ts-ignore
        user.security.two_factor.secret = undefined;
        await user.save();

        return successApiResponse(res, "2FA has been disabled successfully.", {});
    } catch (error) {
        logger.error("Error disabling 2FA", error);
        return errorApiResponse(
            res,
            "Server Error",
            error,
            ApiResponseCode.INTERNAL_ERROR
        );
    }
};
