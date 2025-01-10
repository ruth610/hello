
import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileUploadService {
  getStorage() {
    return diskStorage({
      destination: './uploads', // Store images in the 'uploads' folder
      filename: (req, file, cb) => {
        const filename = `${Date.now()}${extname(file.originalname)}`;
        cb(null, filename);
      },
    });
  }
}
