import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
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
    age: {
      type: Number,
      required: true,
    },
    distanceFromHome: {
      type: Number,
      required: true,
    },
    environmentSatisfaction: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    jobInvolvement: {
      type: Number,
      required: true,
    },
    jobLevel: {
      type: Number,
      required: true,
    },
    jobSatisfaction: {
      type: Number,
      required: true,
    },
    monthlyIncome: {
      type: Number,
      required: true,
    },
    numCompaniesWorked: {
      type: Number,
      required: true,
    },
    overTime: {
      type: Number,
      required: true,
    },
    percentSalaryHike: {
      type: Number,
      required: true,
    }, 
    performanceRating: {
      type: Number,
      required: true,
    },
    relationshipSatisfaction: {
      type: Number,
      required: true,
    },
    stockOptionLevel: {
      type: Number,
      required: true,
    },
    totalWorkingYears: {
      type: Number,
      required: true,
    },
    trainingTimesLastYear: {
      type: Number,
      required: true,
    },
    workLifeBalance: {
      type: Number,
      required: true,
    },
    yearsAtCompany: {
      type: Number,
      required: true,
    },
    yearsInCurrentRole: {
      type: Number,
      required: true,
    },
    yearsSinceLastPromotion: {
      type: Number,
      required: true,
    },
    yearsWithCurrManager: {
      type: Number,
      required: true,
    },
    businessTravel: {
      type: String,
      required: true,
    },
    maritalStatus: {
      type: String,
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    currentLeaves: {
      type: Number,
      required: true,
    },
    risk: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
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
    throw new Error("employee not found");
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
