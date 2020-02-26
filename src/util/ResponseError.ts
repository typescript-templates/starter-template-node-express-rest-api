import { CustomError } from "./CustomError";
import { Response } from "express";
import { HttpStatusCode } from "./HttpStatusCodes";

export class ResponseError extends CustomError {
  private constructor(message: string, code: HttpStatusCode) {
    super(message, code as any);
    this.name = "ResponseError";
  }

  static UnauthorizedError(message?: string, res?: Response): ResponseError {
    if (res) {
      res.status(HttpStatusCode.UNAUTHORIZED).send(message);
    } else {
      return new ResponseError(message || "UNAUTHORIZED", HttpStatusCode.UNAUTHORIZED);
    }
  }

}