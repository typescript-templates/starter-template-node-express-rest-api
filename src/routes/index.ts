import { Router } from "express";
import ApiRoutes from "./api";
import AccountController from "../components/account/AccountController";

const AppRoutes = Router();

AppRoutes.post("/login", AccountController.login);
AppRoutes.post("/logout", AccountController.logout);

// Account
AppRoutes.use("/api", ApiRoutes);

export default AppRoutes;