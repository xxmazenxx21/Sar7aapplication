import multer from "multer";
import fs from "node:fs";
import path from "node:path";

export const cloudfileupload = ({ customPath = "general", validation = [] }) => {
  let basePath = `uploads/${customPath}`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.user?._id) basePath += `/${req.user._id}`;
      const fullPath = path.resolve(`./src/${basePath}`);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      cb(null, fullPath);
    },

    filename: (req, file, cb) => {
      const uniquefilename =
        Date.now() + "__" + Math.random() + "__" + file.originalname;

      file.finalPath = `/${basePath}/${uniquefilename}`;
      cb(null, uniquefilename);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid mimetype"), false);
    }
  };

  return multer({
    fileFilter,
    storage,
  });
};