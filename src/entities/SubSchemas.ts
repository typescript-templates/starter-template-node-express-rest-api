import { SchemaFactory } from "@dotup/dotup-ts-mongoose";
import { AccountProfile } from "../components/account/AccountProfile";
import { LinkedAccount } from "../models/LinkedAccount";

const factory = new SchemaFactory<AccountProfile>("AccountProfile");
factory
  .addField("name", String)
  .addField("gender", String)
  .addField("location", String)
  .addField("website", String)
  .addField("picture", String)
  ;

export const AccountProfileSchema = factory.CreateSchema();

const linkedAccountFactory = new SchemaFactory<LinkedAccount>("LinkedAccount");
linkedAccountFactory
  .addField("authProvider", String)
  .addField("id", String)
  .addField("token", String)
  ;

export const LinkedAccountSchema = linkedAccountFactory.CreateSchema();
