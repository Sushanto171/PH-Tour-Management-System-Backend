/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import stream from "stream";
import { AppError } from "../errorHelpers/AppError";
import { envVars } from "./env";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const publicId = `pdf/${fileName}-${Date.now()}`;
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "pdf",
          resource_type: "auto",
          access_mode: "public",
          public_id: publicId,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
      bufferStream.pipe(uploadStream);
    });
  } catch (error: any) {
    console.log(`File uploading error:${error.message}`);
    throw new AppError(500, "File uploading error");
  }
};

export const cloudinaryUpload = cloudinary;
