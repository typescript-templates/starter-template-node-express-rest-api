import dotenv from "dotenv";
import fs from "fs";
import { PropertyNamesOnly } from "@dotup/dotup-ts-types";

class AppConfig {

  PORT: number;
  NODE_ENV: string;
  APP_NAME: string;
  LOG_LEVEL: string; // "error" : "debug"
  SESSION_SECRET: string;
  FACEBOOK_ID: string;
  FACEBOOK_SECRET: string;
  MONGODB_URI: string;
  MONGODB_DB_NAME: string;
  SENDGRID_USER: string;
  SENDGRID_PASSWORD: string;
  CONTACT_MAIL_ADDRESS: string;
  JWT_SECRET: string;
  constructor(
  ) {
    console.info("Loading app configuration.");
    if (fs.existsSync(".env")) {
      console.debug("Using .env file to supply config environment variables");
      dotenv.config({ path: ".env" });
    } else {
      console.warn("No .env file found.");
    }

    this.setConfig("APP_NAME", "node-ts-starter");
    this.setConfig("PORT", 10002);
    this.setConfig("NODE_ENV", "dev");
    this.setConfig("LOG_LEVEL", "debug");
    this.setConfig("SESSION_SECRET", "kjfeK4Kl3ztcrj89z7T");
    this.setConfig("FACEBOOK_ID");
    this.setConfig("FACEBOOK_SECRET");
    this.setConfig("MONGODB_URI");
    this.setConfig("MONGODB_DB_NAME");
    this.setConfig("SENDGRID_USER");
    this.setConfig("SENDGRID_PASSWORD");
    this.setConfig("CONTACT_MAIL_ADDRESS");
    this.setConfig("JWT_SECRET");
  }

  setConfig<K extends keyof AppConfig>(key: PropertyNamesOnly<AppConfig>, value?: AppConfig[K]): void {
    // setConfig<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    //this[key] = value
    if (process.env[key]) {
      value = process.env[key] as AppConfig[K];
    }
    // this.write(this, key, value as any);
    (this[key] as any) = value;
  }

  write<K extends keyof AppConfig>(arg: AppConfig, key: K, value: AppConfig[K]): void {
    arg = this;
    arg[key] = value;
  }

}

export default new AppConfig();
