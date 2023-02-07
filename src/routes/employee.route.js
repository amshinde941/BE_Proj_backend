import express from "express";
import { employeeAuth } from "../middleware";
import { createEmployee, loginEmployee } from "../controllers";

const EmployeeRouter = express.Router();

EmployeeRouter.post("/signup", createEmployee);
EmployeeRouter.post("/login", loginEmployee); 

export { EmployeeRouter };
