import { ErrorCodes } from "./ErrorCodes";

export class CustomError extends Error {
  code: ErrorCodes;
  constructor(message: string, code: ErrorCodes) {
    super(message);
    this.code = code;
    this.name = "CustomError";
  }
}