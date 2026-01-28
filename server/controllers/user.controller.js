import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

//signup
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        sucess: false,
        message: "All field are required",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        sucess: false,
        message: "user already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      sucess: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "Failed to register",
    });
  }
};


// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        sucess: false,
        message: "All field are required",
      });
    }

    const user = await User.findOne({ email });

    if(!user){
        return res.status(400).json({
        sucess: false,
        message: "Incorrect email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        return res.status(400).json({
        sucess: false,
        message: "Incorrect email or password",
      });
    }

    // JWT

    generateToken(res,user,`Welcome back ${user.name}`)


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "Failed to register",
    });
  }
};
