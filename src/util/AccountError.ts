import { CustomError } from "./CustomError";
import { ErrorCodes } from "./ErrorCodes";

export class AccountError extends CustomError {
  private constructor(message: string, code: ErrorCodes) {
    super(message, code);
    this.name = "AccountError";
  }

  static TokexExpired(): AccountError {
    return new AccountError("Password reset token is invalid or has expired.", ErrorCodes.TokenExpired);
  }

  static EmailAlreadyUsed(): AccountError {
    return new AccountError("There is already an account using this email address.", ErrorCodes.EmailAlreadyUsed);
  }

  static AlreadyLinked(provider: string): AccountError {
    return new AccountError(`There is already a linked account (${provider}) that belongs to you. Sign in with that account or delete it, then link it with your current account.`, ErrorCodes.AlreadyLinked);
  }

  static EmailNotFound(email: string): AccountError {
    return new AccountError(`Email ${email} not found.`, ErrorCodes.UserEmailNotFound);
  }
}