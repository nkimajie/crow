import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  /**
   * @description Returns the current date and time, optionally adjusted by a specified number of hours.
   * @param minusHour Optional number of hours to subtract from the current time.
   * @returns The adjusted Date object.
   */
  getCurrentDate(minusHour?: number): Date {
    const date = new Date();
    if (minusHour) {
      date.setHours(date?.getHours() + minusHour);
    }
    return date;
  }
}
