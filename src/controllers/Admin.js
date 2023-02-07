import { Admin } from "../models/index.js";

const createAdmin = async (req, res) => {
  const admin = new Admin(req.body); 
  try {
    await admin.save();
    const token = await admin.generateAuthToken(); 
    res.status(201).send({ admin, token });
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

const loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findUsingCredentials(
      req.body.email,
      req.body.password
    ); 
    const token = await admin.generateAuthToken(); 
    res.status(200).send({ admin, token });
  } catch (e) {
    res.status(400).send({ error: "Invalid Credentials" });
  }
};

export { createAdmin, loginAdmin };
