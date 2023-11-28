import errorHandler from "../middlewares/errorMiddleware.js";
import userModel from "../models/userModel.js";
// import createJwtTokenBYFeat from "../utils/features.js";
import bcrypt from "bcryptjs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { sendEmailSMTP } from "../utils/mail.js";

export const registerController = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    /// Logic register build
    if (
      [firstName, lastName, email, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      return errorHandler(res, 400, "All fields are required");
    }

    ////// Old techniques validation//
    // //validate
    // if (!firstName)
    //   // next("name is required");
    //   return errorHandler(res, 400, "name is required");

    // if (!email) {
    //   // next("email is required");
    //   return errorHandler(res, 400, "email is required");
    // }
    // if (!password) {
    //   // next("password is required");
    //   return errorHandler(res, 400, "password is required");
    // }

    // if (password.length < 4) {
    //   // next("password is required");
    //   return errorHandler(res, 400, "password too short");
    // }

    // const existUser = await userModel.findOne({ email });
    // if (existUser) {
    //   // next("email already exist");
    //   return errorHandler(res, 400, "email already exist");
    // }

    // upload image cloudinary
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath, "avatarLocalPath");
    if (!avatarLocalPath)
      return errorHandler(res, 400, "Avatar file is required");

    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const user = await userModel.create({
      firstName,
      lastName,
      avatar: avatar.url,
      email,
      password,
    });

    // token create
    const token = user.createJWT(); // user models
    // const token = await createJwtTokenBYFeat(user); // token by another folder

    // Send a confirmation email to the user
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Success Message",
      text: `Email User data has been created successfully.`,
      html: `<p>Hello ${firstName},</p><p>Your data has been created successfully.</p>`,
    };

    await sendEmailSMTP(mailOptions);

    if (user) {
      return res.status(201).json({
        success: true,
        message: "user created successfully",
        // hide password field manually
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          email: user.email,
          location: user.location,
        },
        token,
      });
    }
  } catch (error) {
    next(error);
  }
};

// login controller
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return errorHandler(res, 400, "all fields are required");

    // find user by email
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) return errorHandler(res, 400, "user not found");

    // check password compare
    const isMatch = await user.comparePassword(password); // user models methods
    // const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorHandler(res, 400, "user not found pass");

    // password hide when login
    user.password = undefined;

    // token create
    const token = user.createJWT();
    res.status(200).json({
      success: true,
      message: "login successfully",
      user,
      // user: {
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   email: user.email,
      // },
      token,
    });
  } catch (error) {
    return errorHandler(res, 500, error);
  }
};
