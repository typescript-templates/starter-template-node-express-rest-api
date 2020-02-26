import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";

import AppConfig from "../config/AppConfig";
import { UserEntity } from "../components/account/AccountEntity";
import { ResponseError } from "../util/ResponseError";

const getTokenFromHeader = (req: Request): string => {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return undefined;
};

export const generateToken = (userId: string, expiresIn: string = "1d", subject: string = "apitoken"): string => {
  const token = jwt.sign({ _id: userId }, AppConfig.JWT_SECRET, {
    expiresIn: expiresIn,
    subject: subject
  });
  return token;
};

const JwtAuthenticator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = getTokenFromHeader(req);
    const decoded: any = jwt.verify(token, AppConfig.JWT_SECRET);

    const user = await UserEntity.findOne({ _id: decoded._id, "apitoken": token });

    if (user) {
      req.token = token;
      req.user = user;
      next();
    } else {
      ResponseError.UnauthorizedError("user not found", res);
    }
  } catch (error) {
    ResponseError.UnauthorizedError("Token required", res);
  }
};

export default JwtAuthenticator;