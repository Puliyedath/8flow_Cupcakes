export enum ApiErrorCodes {
  Success = 200,
  ResourceCreated = 201,

  // 4xx Client Errors
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  ValidationError = 405,

  // 5xx Server Errors
  InternalServerError = 500,
}
