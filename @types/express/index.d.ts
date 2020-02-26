import { AccountModel } from "../../src/components/account/AccountModel";

declare module "express-serve-static-core" {
  interface Request {
    user: AccountModel;
    token: any;
  }
}
