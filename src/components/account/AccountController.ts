import { Request, Response } from "express";
import "../../util/passport";
import AccountService from "./AccountService";
import { generateToken } from "../../services/JwtAuthenticator";
import { HttpStatusCode } from "../../util/HttpStatusCodes";
import { ResponseError } from "../../util/ResponseError";


export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    await AccountService.Logout(req.body.email);
    res.status(HttpStatusCode.OK).send();
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send();
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const user = await AccountService.Login(req.body.email, req.body.password);

  if (user) {
    user.apitoken = generateToken(user.id);
    await AccountService.UpdateAccount(user);
    res.status(HttpStatusCode.OK).send({
      "user": user.email,
      "token": user.apitoken
    });
  } else {
    ResponseError.UnauthorizedError("user not found", res);
  }
};

export const getAllAccounts = async (req: Request, res: Response): Promise<void> => {
  const users = await AccountService.GetAllUsers();
  res.json(users);
  // return users;
};

export const getAccount = async (req: Request, res: Response): Promise<void> => {
  const users = await AccountService.GetUser("email", req.params.email);
  res.json(users);
  // return users;
};

const AccountController = {
  login: login,
  logout: logout,
  getAllAccounts: getAllAccounts,
  getAccount: getAccount
};

export default AccountController;