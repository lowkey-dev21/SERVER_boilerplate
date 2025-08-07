import { Router } from "express";
import {
    disableTwoFactor,
    generateTwoFactorSecret,
    verifyAndEnableTwoFactor
} from "../controllers/auth/2fa.controller";
import { authMiddleware } from "../middlewares/auth/auth.middleware";

const route = Router()
route.use(authMiddleware)

// 2FA Management Routes
route.post("/2fa/generate", generateTwoFactorSecret);
route.post("/2fa/verify", verifyAndEnableTwoFactor);
route.post("/2fa/disable", disableTwoFactor);
export default route
