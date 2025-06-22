import { upload, uploadToCloudinary } from "../utils/uploader";
import express from "express";
const router = express.Router();
import { Request, Response } from "express";
import {
  errorApiResponse,
  successApiResponse,
  ApiResponseCode,
} from "../utils/apiResponse";

router.post(
  "/single",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        errorApiResponse(
          res,
          "No file uploaded",
          "No file uploaded",
          ApiResponseCode.BAD_REQUEST,
          "error"
        );
        return;
      }
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      successApiResponse(
        res,
        "File uploaded successfully",
        { url: result.secure_url },
        ApiResponseCode.OK,
        "info"
      );
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      errorApiResponse(
        res,
        "Upload failed",
        "Upload failed",
        ApiResponseCode.INTERNAL_ERROR,
        "error"
      );
    }
  }
);

router.post(
  "/multiple",
  upload.array("files", 10),
  async (req: Request, res: Response) => {
    try {
      if (!req.files || req.files.length === 0) {
        errorApiResponse(
          res,
          "No files uploaded",
          "No files uploaded",
          ApiResponseCode.BAD_REQUEST,
          "error"
        );
        return;
      }
      const results = await Promise.all(
        (req.files as Express.Multer.File[]).map(file =>
          uploadToCloudinary(file.buffer, file.originalname)
        )
      );
      const urls = results.map(result => result.secure_url);
      successApiResponse(
        res,
        "Files uploaded successfully",
        { urls },
        ApiResponseCode.OK,
        "info"
      );
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      errorApiResponse(
        res,
        "Upload failed",
        "Upload failed",
        ApiResponseCode.INTERNAL_ERROR,
        "error"
      );
    }
  }
);

export default router;
