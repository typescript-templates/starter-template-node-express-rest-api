import { AccountModel } from "../../src/components/account/AccountModel";

// declare module "express" {
//   interface Request {
//     user: AccountModel;
//     token: any;
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user: AccountModel;
      token: any;
    }
  }
}