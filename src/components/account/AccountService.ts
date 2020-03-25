import crypto from "crypto";
import "../../util/passport";
import { UserEntity } from "./AccountEntity";
import { AccountProfile } from "./AccountProfile";
import { AsyncCallback, PropertyNamesOnly, ObjectTools } from "@dotup/dotup-ts-types";
import bcrypt from "bcrypt";
import { AccountError } from "../../util/AccountError";
import { getHash } from "../../util/helper";
import { AuthProvider } from "../../models/AuthProvider";
import { LinkedAccount } from "../../models/LinkedAccount";
import { AccountModel } from "./AccountModel";

/**
 * TODO: Validation
 * 
 */
class AccountService {

  async Login(email: string, password: string): Promise<AccountModel> {
    try {
      const user = await UserEntity.findOne({ email: email.toLowerCase() });

      if (user) {
        const okay = await AsyncCallback(password, user.password, bcrypt.compare);
        return okay === true ? user : undefined;
      } else {
        return undefined;
      }

    } catch{
      return undefined;
    }
  }

  async Logout(email: string): Promise<void> {

    const user = await UserEntity.findOne({ email: email.toLowerCase() });

    if (user) {
      user.apitoken = undefined;
      await user.save();
    } else {
      throw AccountError.EmailNotFound(email);
    }

  }

  async GetAllUsers(): Promise<AccountModel[]> {
    const result = await UserEntity.estimatedDocumentCount().find().lean();
    return result;
  }

  async GetUser<K extends PropertyNamesOnly<AccountModel>>(key: K, value: AccountModel[K]): Promise<AccountModel> {
    const result = await UserEntity.findOne({ [key]: value }).lean();
    return result;
  }

  async GetUserByPasswordResetToken(passwordResetToken: string): Promise<AccountModel> {
    const user = await UserEntity
      .findOne({ passwordResetToken: passwordResetToken })
      .where("passwordResetExpires").gt(Date.now())
      .exec();
    return user;
  }

  async UpdateAccount(account: AccountModel): Promise<AccountModel> {
    const newOne = await UserEntity.findByIdAndUpdate(account.id, account, { new: true });

    return newOne;
  }

  async  UpdateProfile(userId: string, profile: Partial<AccountProfile>): Promise<AccountModel> {

    const user = await UserEntity.findById(userId);

    const target: AccountProfile = {};
    ObjectTools.CopyEachSource(profile, target);
    user.profile.name = profile.name;
    user.profile.gender = profile.gender;
    user.profile.location = profile.location;
    user.profile.website = profile.website;
    await user.save();

    return user;
  }

  async UpdatePassword(userId: string, password: string): Promise<void> {
    const user = await UserEntity.findById(userId);
    user.password = await getHash(password);
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();
  }

  /**
   * POST /account/delete
   * Delete user account.
   */
  async DeleteAccount(userId: string): Promise<void> {
    await UserEntity.remove({ _id: userId });
  }

  /**
   * GET /account/unlink/:provider
   * Unlink OAuth provider.
   */
  async UnlinkOauth(userId: string, provider: string): Promise<void> {

    const user = await UserEntity.findById(userId);

    user.linkedAccounts = user.linkedAccounts.filter((account) => account.authProvider !== provider);
    await user.save();
  }

  /**
   * GET /reset/:token
   * Reset Password page.
   */
  async ResetPasswort(passwordResetToken: string, newPassword: string): Promise<AccountModel> {
    const user = await UserEntity
      .findOne({ passwordResetToken: passwordResetToken })
      .where("passwordResetExpires").gt(Date.now())
      .exec();

    if (user) {
      this.UpdatePassword(user._id, newPassword);
      return user;
    } else {
      throw AccountError.TokexExpired();
    }
  }

  /**
   * POST /forgot
   * Create a random token, then the send user an email with a reset link.
   */
  async PasswordResetRequest(host: string, email: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    // Find user
    const user = await UserEntity.findOne({ "email": email });

    if (user) {

      // Set passwort reset token
      const buffer = await AsyncCallback(16, crypto.randomBytes);
      const token = buffer.toString("hex");

      user.passwordResetToken = token;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

      await user.save();
      // await this.sendForgotPasswordEmail(host, token, user);

    } else {
      throw AccountError.EmailNotFound(email);
    }

  }

  // TODO: mode to another component
  // private async sendForgotPasswordEmail(host: string, token: string, user: AccountModel): Promise<void> {

  //   const transporter = nodemailer.createTransport({
  //     service: "SendGrid",
  //     auth: {
  //       user: AppConfig.SENDGRID_USER,
  //       pass: AppConfig.SENDGRID_PASSWORD
  //     }
  //   });

  //   const mailOptions = {
  //     to: user.email,
  //     from: AppConfig.CONTACT_MAIL_ADDRESS,
  //     subject: "Reset your password on Hackathon Starter",
  //     text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
  //           Please click on the following link, or paste this into your browser to complete the process:\n\n
  //           http://${host}/reset/${token}\n\n
  //           If you did not request this, please ignore this email and your password will remain unchanged.\n`
  //   };

  //   const result = await AsyncCallback(mailOptions, transporter.sendMail);
  //   console.log(result);

  // }

  /**
   * POST /signup
   * Create a new local account.
   */
  async CreateAccount(email: string, password: string): Promise<AccountModel> {

    await this.CanCreateAccount(email);

    const hash = await getHash(password);

    const user = await UserEntity.Create({
      email: email,
      password: hash,
      profile: {},
      linkedAccounts: []
    });

    await user.save();

    return user;
  }

  async LoginLinkedAccount(email: string, linkedAccount: LinkedAccount, profile: AccountProfile): Promise<AccountModel> {

    const linked = await this.GetLinkedAccount(linkedAccount.authProvider, linkedAccount.id);

    if (linked) {
      return linked;
    }

    await this.CanCreateAccount(linkedAccount);

    const user = await UserEntity.Create({
      email: email,
      password: undefined,
      profile: profile,
      linkedAccounts: [
        {
          authProvider: linkedAccount.authProvider,
          id: linkedAccount.id,
          token: linkedAccount.token
        }
      ]
    });

    await user.save();

    return user;
  }


  async GetLinkedAccount(authProvider: AuthProvider, id: string): Promise<AccountModel> {
    const result = await UserEntity.findOne({
      "linkedAccounts": { $elemMatch: { authProvider: authProvider, id: id } }
    });
    console.log(result);
    return result;
  }

  async LinkAccount(userId: string, linkedAccount: LinkedAccount, profile: AccountProfile): Promise<AccountModel> {
    const alreadyLinked = await UserEntity.findOne({
      "linkedAccounts": { $elemMatch: { id: linkedAccount.id } }
    });

    if (alreadyLinked) {
      throw AccountError.AlreadyLinked(linkedAccount.authProvider);
    }

    const user = await UserEntity.findById(userId);

    user.profile.name = user.profile.name || profile.name;
    user.profile.gender = user.profile.gender || profile.gender;
    user.profile.location = user.profile.location || profile.location;
    user.profile.website = user.profile.website || profile.website;

    const link = { ...linkedAccount };
    user.linkedAccounts.push(link);

    user.save();

    return user;
  }

  async CanCreateAccount(emailOrLinkedAccount: string | LinkedAccount): Promise<boolean> {
    let exists = undefined;

    if (typeof emailOrLinkedAccount === "string") {
      exists = await UserEntity.findOne({ email: emailOrLinkedAccount });
    } else {
      exists = await this.GetLinkedAccount(emailOrLinkedAccount.authProvider, emailOrLinkedAccount.id);
    }

    if (exists) {
      throw AccountError.EmailAlreadyUsed();
    }

    return true;
  }
}

export default new AccountService();
