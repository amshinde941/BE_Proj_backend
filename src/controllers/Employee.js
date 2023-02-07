import { Employee } from "../models/index.js";

const createEmployee = async (req, res) => {
  const employee = new Employee(req.body); 
  try {
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

export { createEmployee, loginEmployee };
