import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { Employee } from "../models/index.js";

const addNewEmployee = async (req, res) => {
  try {
    console.log("data ", req.body);

    const data = {
      ...req.body,
      password: "Admin@123",
    };

    const employee = new Employee(data);
    await employee.save();
    const token = await employee.generateAuthToken();
    res.status(201).send({ employee, token });
  } catch (e) {
    console.log(e);
    if (e.keyPattern?.email === 1) {
      res.status(400).send({
        error: "Email Already Exists",
      });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const updateRisk = async (req, res) => {
  try {
    const employee = await Employee.findById({ _id: req.body._id });

    const leavePer = req.body.leavePer;

    console.log("-> ", employee);

    if (leavePer >= 75) {
      employee.risk = "high";
      await employee.save()
    } else if (leavePer >= 50) {
      employee.risk = "medium";
      await employee.save()
    } else {
      employee.risk = "low";
      await employee.save()
    }

    res.status(200).send({ employee });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    res.status(200).send( employees );
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

const createEmployee = async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.body.token, process.env.TOKEN_SECRET);

    const data = {
      empId: decodedToken.empId,
      name: decodedToken.name,
      email: decodedToken.email,
      password: req.body.password,
      hrId: decodedToken.hrId,
    };

    const employee = new Employee(data);
    await employee.save();
    const token = await employee.generateAuthToken();
    res.status(201).send({ employee, token });
  } catch (e) {
    console.log(e);
    if (e.keyPattern?.email === 1) {
      res.status(400).send({
        error: "Email Already Exists",
      });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const employee = await Employee.findUsingCredentials(
      req.body.email,
      req.body.password
    );
    const token = await employee.generateAuthToken();
    res.status(200).send({ employee, token });
  } catch (e) {
    res.status(400).send({ error: "Invalid Credentials" });
  }
};

const updateEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id);

    res.status(200).send({ employee });
  } catch (e) {
    res.status(400).send({ error: "Invalid Credentials" });
  }
};

export {
  createEmployee,
  loginEmployee,
  updateEmployeeProfile,
  addNewEmployee,
  updateRisk,
  getAllEmployees
};
