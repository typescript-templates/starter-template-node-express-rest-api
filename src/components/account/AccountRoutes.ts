import { Router } from "express";
import * as AccountController from "./AccountController";
import AccountService from "./AccountService";
import JwtAuthenticator from "../../services/JwtAuthenticator";

const AccountRoutes = Router();

// AccountRoutes.use(passportConfig.isAuthenticated);

// * Preloading parameter
// AccountRoutes.param("email", async (req, res, next, email: string): Promise<any> => {
//   const account = await AccountService.GetUser("email", email);

//   if (!account) {
//     return res.sendStatus(404);
//   }

//   req.user = account;

//   return next();
// });

// Public access
//   // Account get
AccountRoutes.get("/", AccountController.getAllAccounts);

// Enable authenticator
AccountRoutes.use(JwtAuthenticator);

// Restricted access
AccountRoutes.get("/:email", AccountController.getAccount);
// AccountRoutes.get("/:account/linked", AccountController.getAllLinkedAccounts);
// // AccountRoutes.get("/:account/linked/:provider", AccountController.getLinkedAccount);

// // Account put (update)
// AccountRoutes.put("/:account", AccountController.updateAccount);

// // Account post (insert)
// AccountRoutes.post("/", AccountController.createAccount);

// // Account delete
// AccountRoutes.delete("/:account", AccountController.deleteAccount);
// AccountRoutes.delete("/:account/linked/:provider", AccountController.deleteLinkedAccount);

// Account linked accounts

export default AccountRoutes;
