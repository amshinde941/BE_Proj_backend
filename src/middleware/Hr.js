import jwt from "jsonwebtoken";
import { Hr } from "../models/index.js";

const hrAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const hr = await Hr.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });
    if (!hr) {
      throw new Error();
    }
    req.hr = hr;
    req.token = token;
    next();
  } catch (e) {
    // console.log(e);
    res.status(401).send({ error: "hr Authentication Failed" });
  }
};

export  {hrAuth};
