import { Express } from "express";
import AppConfig from "./config/AppConfig";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import passport from "passport";
import AppRoutes from "./routes/index";
import { MongoDb } from "@dotup/dotup-ts-mongoose";

export class MyApp {
  private db: MongoDb;

  async Initialize(app: Express): Promise<void> {
    // Configure express
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(lusca.xframe("SAMEORIGIN"));
    app.use(lusca.xssProtection(true));
    app.use(passport.initialize());
    app.use(passport.session());

    this.db = new MongoDb();
    await this.db.Connect(AppConfig.MONGODB_URI, AppConfig.MONGODB_DB_NAME, {
      useFindAndModify: false
    });

    // app routes.
    app.use(AppRoutes);
  }

}
