import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    return !value.mimetype.startsWith('image/');
  }
}
