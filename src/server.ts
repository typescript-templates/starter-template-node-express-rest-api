import express from "express";
import errorHandler from "errorhandler";
import AppConfig from "./config/AppConfig";
import { MyApp } from "./app";
import logger from "./util/logger";
import { Server } from "http";

process.on("unhandledRejection", (error: any) => {
  // Will print "unhandledRejection err is not defined"
  console.log("unhandledRejection", error.message);
});

/**
 * TODO:
 * -TypeORM: https://entwickler.de/online/javascript/typescript-server-579826585.html
 * -Swagger: https://medium.com/@sean_bradley/add-swagger-ui-to-existing-nodejs-typescript-api-882ca7aded90
 * -Restify: http://restify.com/docs/client-guide/
 */

// Create Express server
const app = express();

async function StartServer(): Promise<Server> {

  // Initialize app
  const myApp = new MyApp();
  await myApp.Initialize(app);

  // Error Handler. Provides full stack - remove for production
  app.use(errorHandler());

  // Start Express server.
  const info = `App is running at http://localhost:${AppConfig.PORT} in ${app.get("env")} mode`;

  logger.info(info);
  const server = app.listen(AppConfig.PORT, () => {
    console.log();
    console.log("  Press CTRL-C to stop\n");
  });

  return server;
}

const server = StartServer();
server
  .catch(e => {
    console.log("app start failed");
    console.log(e);
  })
  ;
export default app;
