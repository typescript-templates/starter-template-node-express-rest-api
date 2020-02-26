import { AccountProfile } from "./AccountProfile";
import { LinkedAccount } from "../../models/LinkedAccount";

export class AccountModel {
  id?: string; // Virtual mongoose id
  email: string;
  password: string;
  apitoken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  profile?: AccountProfile;
  linkedAccounts?: LinkedAccount[];

}
