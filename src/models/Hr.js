import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const HrSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 6) {
          throw new Error("Enter a strong password");
        }
      },
    },
    companyName: {
      type: String,
      required: true,
    }, 
    Employees: [
      {
        EmpId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
        }
      },
    ],
    tokens: [
      {
        token: {
          required: true,
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
HrSchema.methods.toJSON = function () {
  const hr = this;
  const hrObject = hr.toObject();

  delete hrObject.password;
  delete hrObject.tokens;

  return hrObject;
};

HrSchema.statics.findUsingCredentials = async (email, password) => {
  const lowercaseEmail = email.toLowerCase();
  const hr = await Hr.findOne({ email: lowercaseEmail });
  if (!hr) {
    throw new Error("teacher not found");
  }

  const isFound = await bcrypt.compare(password, hr.password);
  if (!isFound) {
    throw new Error("You have entered wrong password");
  }
  return hr;
};

HrSchema.methods.generateAuthToken = async function () {
  const hr = this; //user being generate
  const token = jwt.sign(
    { _id: hr._id.toString() },
    process.env.TOKEN_SECRET
  );
  hr.tokens = hr.tokens.concat({ token });
  await hr.save();
  return token;
};

HrSchema.pre("save", async function (next) { 
  const hr = this; //user which is being saved
  if (hr.isModified("password")) {
    hr.password = await bcrypt.hash(hr.password, 8);
  }
  next();
});

export const Hr = mongoose.model("Hr", HrSchema);
