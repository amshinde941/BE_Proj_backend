import express from "express";
import { employeeAuth } from "../middleware/index.js";
import { addNewEmployee, updateRisk, createEmployee, loginEmployee, updateEmployeeProfile, getAllEmployees } from "../controllers/index.js";

const EmployeeRouter = express.Router();

EmployeeRouter.post("/signup", createEmployee);
EmployeeRouter.post("/login", loginEmployee);
EmployeeRouter.put("/update", employeeAuth, updateEmployeeProfile);

EmployeeRouter.post("/addnewemployee", addNewEmployee);
EmployeeRouter.post("/updaterisk", updateRisk);
EmployeeRouter.get("/getallemployees", getAllEmployees);

export { EmployeeRouter };
