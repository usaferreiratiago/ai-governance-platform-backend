import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerGuard {
  canActivate(): boolean {
    return true;
  }
}
