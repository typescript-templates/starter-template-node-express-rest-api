import passport from "passport";
import passportLocal from "passport-local";
import { Request, Response, NextFunction } from "express-serve-static-core";
import AccountService from "../components/account/AccountService";
import { UserEntity } from "../components/account/AccountEntity";
import { AccountModel } from "../components/account/AccountModel";

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  UserEntity.findById(id, (err, user) => {
    done(err, user);
  });
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, async (email: string, password: string, done: Function) => {

  const user = await AccountService.Login(email, password);

  if (user) {
    return done(undefined, user);
  } else {
    return done(undefined, false, { message: "Invalid email or password." });

  }
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */


/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req: Request, res: Response, next: NextFunction): void => {
  const provider = req.path.split("/").slice(-1)[0];

  const user = req.user as AccountModel;
  const toki = user.linkedAccounts.find(x => x.authProvider === provider)?.token;
  if (toki) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
