import jwt from "jsonwebtoken";
import { Employee } from "../models/index.js";

const employeeAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const employee = await Employee.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });

    if (!employee) {
      throw new Error();
    }

    req.employee = employee;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "employee Authentication Failed" });
  }
};

export  {employeeAuth};
