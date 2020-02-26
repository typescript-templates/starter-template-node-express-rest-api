import { Router } from "express";
import AccountRoutes from "../../components/account/AccountRoutes";

const ApiRoutes = Router();

// Account
ApiRoutes.use("/account", AccountRoutes);

export default ApiRoutes;