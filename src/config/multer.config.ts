import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';

export const multerCategoryStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(__dirname, '..', '..', 'uploads', 'categories');
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensures the folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
