import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  running(): string {
    return `Hello champ, your app is running on port ${process.env.PORT}`;
  }
}
