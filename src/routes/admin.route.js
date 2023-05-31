import express from "express";
import { adminAuth } from "../middleware/index.js";
import { createAdmin, loginAdmin } from "../controllers/index.js";

const AdminRouter = express.Router();

AdminRouter.post("/signup", createAdmin);
AdminRouter.post("/login", loginAdmin); 

export { AdminRouter };
