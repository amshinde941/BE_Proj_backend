import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AdminSchema = new mongoose.Schema(
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

AdminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();

  delete adminObject.password;
  delete adminObject.tokens;

  return adminObject;
};

AdminSchema.statics.findUsingCredentials = async (email, password) => {
  const lowercaseEmail = email.toLowerCase();
  const admin = await Admin.findOne({ email: lowercaseEmail });

  if (!admin) {
    throw new Error("admin not found");
  }

  const isFound = await bcrypt.compare(password, admin.password);
  if (!isFound) {
    throw new Error("You have entered wrong password");
  }

  return admin;
};

AdminSchema.methods.generateAuthToken = async function () {
  const admin = this; //user being generate
  const token = jwt.sign(
    { _id: admin._id.toString() },
    process.env.TOKEN_SECRET
  );
  admin.tokens = admin.tokens.concat({ token });
  await admin.save();
  return token;
};

AdminSchema.pre("save", async function (next) {
  const admin = this; //user which is being saved
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

export const Admin = mongoose.model("Admin", AdminSchema);
