/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.trim();
    }

    if (Array.isArray(value)) {
      return value.map((v) =>
        typeof v === 'string' ? v.trim() : v,
      );
    }

    if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      }
    }

    return value;
  }
}