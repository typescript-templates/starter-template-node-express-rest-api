import { SchemaFactory } from "@dotup/dotup-ts-mongoose";
import { AccountProfileSchema, LinkedAccountSchema } from "../../entities/SubSchemas";
import { AccountModel } from "./AccountModel";
import validator, { } from "validator";
const factory = new SchemaFactory<AccountModel>("Accounts");

factory
  // .addField("name", String, true, true)
  .addSchemaDefinition({
    "email": {
      type: String,
      required: true,
      unique: true,
      validate: (value: string): boolean => validator.isEmail(value)
    }
  })
  .addSchemaDefinition({
    "password": {
      type: String,
      minlength: 8,
      trim: true
    }
  })
  // .addField("ext", String)
  // .addField("password", String)
  // .addField("url", String)
  .addField("apitoken", String)
  .addField("passwordResetToken", String)
  .addField("passwordResetExpires", Date)
  // .addField("tokens", Schema.Types.Mixed)
  .addField("profile", AccountProfileSchema)
  .addField("linkedAccounts", [LinkedAccountSchema])
  ;

// factory.addSchemaDefinition({
//   "root": [{ type: Schema.Types.ObjectId, ref: "folders" }]
// });

export const UserEntity = factory.CreateModel();
