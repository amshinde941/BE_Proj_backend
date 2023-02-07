import express from "express";
import { hrAuth } from "../middleware";
import { createHr, loginHr } from "../controllers";

const HrRouter = express.Router();

HrRouter.post("/signup", createHr);
HrRouter.post("/login", loginHr); 

export { HrRouter };
