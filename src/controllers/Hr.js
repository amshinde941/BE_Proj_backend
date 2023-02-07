import { Hr } from "../models/index.js";

const createHr = async (req, res) => {
  const hr = new Hr(req.body); 
  try {
    await hr.save();
    const token = await hr.generateAuthToken(); 
    res.status(201).send({ hr, token });
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

const loginHr = async (req, res) => {
  try {
    const hr = await Hr.findUsingCredentials(
      req.body.email,
      req.body.password
    ); 
    const token = await hr.generateAuthToken(); 
    res.status(200).send({ hr, token });
  } catch (e) {
    res.status(400).send({ error: "Invalid Credentials" });
  }
};

export { createHr, loginHr };
