import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const EmployeeSchema = new mongoose.Schema(
  {
    empId: {
      type: Number,
      required: true,
    },
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
      trim: true,
      validate(value) {
        if (value.length < 6) {
          throw new Error("Enter a strong password");
        }
      },
    }, 
    hrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hr",
      required: true,
    },
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

EmployeeSchema.methods.toJSON = function () {
  const employee = this;
  const employeeObject = employee.toObject();

  delete employeeObject.password;
  delete employeeObject.tokens;

  return employeeObject;
};

EmployeeSchema.statics.findUsingCredentials = async (email, password) => {
  const lowercaseEmail = email.toLowerCase();
  const employee = await Employee.findOne({ email: lowercaseEmail });
  if (!employee) {
    throw new Error("student not found");
  }

  const isFound = await bcrypt.compare(password, employee.password);
  if (!isFound) {
    throw new Error("You have entered wrong password");
  }
  return employee;
};

EmployeeSchema.methods.generateAuthToken = async function () {
  const employee = this; //user being generate
  const token = jwt.sign(
    { _id: employee._id.toString() },
    process.env.TOKEN_SECRET
  );
  employee.tokens = employee.tokens.concat({ token });
  await employee.save();
  return token;
};

EmployeeSchema.pre("save", async function (next) {
  const employee = this; //user which is being saved
  if (employee.isModified("password")) {
    employee.password = await bcrypt.hash(employee.password, 8);
  }
  next();
});

export const Employee = mongoose.model("Employee", EmployeeSchema);
