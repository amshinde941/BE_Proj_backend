import express from "express";
import { adminAuth } from "../middleware";
import { createAdmin, loginAdmin } from "../controllers";

const AdminRouter = express.Router();

AdminRouter.post("/signup", createAdmin);
AdminRouter.post("/login", loginAdmin); 

export { AdminRouter };
