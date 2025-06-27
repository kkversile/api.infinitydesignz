import {
  Controller,
  Post,
  Param,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { multerProductStorage } from '../../config/multerProductStorage';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post(':productId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'main_image', maxCount: 1 },
        { name: 'multiple_images', maxCount: 10 },
        { name: 'variant_1_images', maxCount: 10 },
        { name: 'variant_2_images', maxCount: 10 },
        { name: 'variant_3_images', maxCount: 10 },
      ],
      { storage: multerProductStorage }
    )
  )
  uploadProductImages(
    @Param('productId') productId: string,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>
  ) {
    return this.imagesService.saveImages(productId, files);
  }
}
