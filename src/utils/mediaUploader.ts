import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit, { toFile } from '@imagekit/nodejs';

interface MediaFile {
  buffer: Buffer;
  originalname: string;
}

@Injectable()
export class MediaService {
  private readonly imageKit: ImageKit;

  constructor(private readonly configService: ConfigService) {
    this.imageKit = new ImageKit({
      privateKey: this.configService.getOrThrow<string>('IMAGEKIT_PRIVATE_KEY'),
    });
  }

  async uploadMedia(file: Express.Multer.File, folder = '/images') {
    const uploadableFile = await toFile(file.buffer, file.originalname);

    const result = await this.imageKit.files.upload({
      file: uploadableFile,
      fileName: file.originalname,
      folder,
      useUniqueFileName: true,
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    };
  }

  async deleteMedia(fileId: string) {
    return this.imageKit.files.delete(fileId);
  }
}

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';

export const imageUploadInterceptor = (fileName: string | "image") => {
  return FileInterceptor(fileName, {
    storage: memoryStorage(),

    limits: {
      fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, callback) => {
      console.log('file ==>', file);

      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ];

      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

      const extension = extname(file.originalname).toLowerCase();

      const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
      const isValidExtension = allowedExtensions.includes(extension);

      if (!isValidMimeType && !isValidExtension) {
        return callback(new Error('Only image files are allowed'), false);
      }

      callback(null, true);
    },
  });
};
