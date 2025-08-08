import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { AppError } from "../errorHelpers/AppError";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .split(".")[0]
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\./g, "-")
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9-\-\.]/g, "-");
      // const extension = file.originalname.split(".").pop();
      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName;
      // "." +
      // extension;
      return uniqueFileName;
    },
  },
});

export const deleteImageFromCloudinary = async (imageUrl: string) => {
  try {
    // eslint-disable-next-line no-useless-escape
    const regex = /\/upload\/v\d+\/([^\.]+)/;
    const match = imageUrl.match(regex);

    if (match && match[1]) {
      const publicId = match[1];
      await cloudinaryUpload.uploader.destroy(publicId);
      console.log(`File ${publicId} is deleted from cloudinary.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(401, "Cloudinary Image deletion error", error);
  }
};

export const multerUpload = multer({
  storage: storage,
});
