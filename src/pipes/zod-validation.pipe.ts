import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

// This custom pipe will validate the request body against a Zod schema.
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      try {
        this.schema.parse(value);
      } catch (error) {
        throw new BadRequestException(error.errors);
      }
    }
    return value;
  }
}
