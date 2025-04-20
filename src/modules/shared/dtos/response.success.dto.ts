/**
 * @description describes success response
 */
export class SuccessResponse<T> {
  constructor(
    public message: string,
    public data?: T,
    public statusCode = 200,
    public success = true,
  ) {}
}
