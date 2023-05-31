import express from "express";
import { hrAuth } from "../middleware/index.js";
import { createHr, loginHr, addEmployee } from "../controllers/index.js";

const HrRouter = express.Router();

HrRouter.post("/signup", createHr);
HrRouter.post("/login", loginHr);

HrRouter.post("/addemployee", hrAuth, addEmployee);

export { HrRouter };
