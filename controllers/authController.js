import errorHandler from "../middlewares/errorMiddleware.js";
import userModel from "../models/userModel.js";
// import createJwtTokenBYFeat from "../utils/features.js";
import bcrypt from "bcryptjs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { sendEmailSMTP } from "../utils/mail.js";
import otpModels from "../models/otpModels.js";
import crypto from "crypto";

export const registerController = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    /// Logic register build
    // if (
    //   [firstName, lastName, email, password].some(
    //     (field) => field?.trim() === ""
    //   )
    // ) {
    //   return errorHandler(res, 400, "All fields are required");
    // }

    ////// Old techniques validation//
    // //validate
    if (!firstName || !email || !password)
      // next("name is required");
      return errorHandler(res, 400, "All fields are required");

    if (password.length < 4) {
      // next("password is required");
      return errorHandler(res, 400, "password too short");
    }

    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return errorHandler(res, 400, "email already exist");
    }

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
      token,
    });
  } catch (error) {
    return errorHandler(res, 500, error);
  }
};

// create otp with email
export const userSendOtpController = async (req, res) => {
  const { email } = req.body;

  if (!email) return errorHandler(res, 400, "all fields are required");

  try {
    // find user by email in otp db
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorHandler(res, 400, "user not found");
    }

    if (user) {
      const OTP = Math.floor(100000 + Math.random() * 900000);

      const existEmail = await otpModels.findOne({ email });
      // update otp if email is exist
      if (existEmail) {
        const updateOtp = await otpModels.findByIdAndUpdate(
          { _id: existEmail._id },
          {
            otp: OTP,
          },
          { new: true }
        );
        await updateOtp.save();

        const mailOptions = {
          from: process.env.SMTP_FROM,
          to: email,
          subject: "Sending Email For update Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        await sendEmailSMTP(mailOptions);
        res.status(200).json({
          success: true,
          updateOtp,
          message: "Email sent  updated successfully!!",
        });
      } else {
        // create new otp
        const newOtp = new otpModels({ email, otp: OTP });
        await newOtp.save();

        const mailOptions = {
          from: process.env.SMTP_FROM,
          to: email,
          subject: "Sending Email For new Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        await sendEmailSMTP(mailOptions);
        res.status(200).json({
          success: true,
          newOtp,
          message: "Email sent  new  successfully!!",
        });
      }
    }
  } catch (error) {
    return errorHandler(res, 500, error);
  }
};

// login with otp
export const loginWithOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return errorHandler(res, 400, "All fields required!!");
  }

  try {
    const otpVerifyEmail = await otpModels.findOne({ email });
    if (!otpVerifyEmail) {
      return errorHandler(res, 400, "email not found in Otp db!!");
    }

    if (otpVerifyEmail.otp === otp) {
      // email check in user table
      const existEmail = await userModel.findOne({ email });
      if (!existEmail) {
        return errorHandler(res, 400, "email not found in User db!!");
      }

      // token generate
      const token = existEmail.createJWT();
      res.status(200).json({
        success: true,
        message: "Login Succesfully Done",
        user: existEmail,
        token,
      });
    } else {
      return errorHandler(res, 400, "Invalid Otp");
    }
  } catch (error) {
    return errorHandler(res, 400, error);
  }
};

// send email link for reset password
export const sendLinkPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return errorHandler(res, 400, "Fill all fields!!!");
  }

  try {
    // user find
    const existUser = await userModel.findOne({ email });
    if (!existUser) {
      return errorHandler(res, 400, "Email not found!!!");
    }

    // Get ResetPassword Token
    const resetToken = existUser.getResetPasswordToken();
    await existUser.save({ validateBeforeSave: false });

    const message = `your password reset token is: ${process.env.URL}/auth/forgot-password/${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Sending Email For Forget password Link",
      text: message,
    };

    await sendEmailSMTP(mailOptions);
    res.status(200).json({
      success: true,
      message: `Email sent to ${existUser.email} successfully`,
    });
  } catch (error) {
    existUser.resetPasswordToken = undefined;
    existUser.resetPasswordExpire = undefined;

    await existUser.save({ validateBeforeSave: false });

    return errorHandler(res, 400, error);
  }
};

// reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return errorHandler(res, 400, "token required");
  }

  try {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return errorHandler(
        res,
        400,
        "Reset Password Token is invalid or has been expired!!! "
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return errorHandler(res, 400, "password not matched");
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    res.status(200).json({
      success: true,
      message: "password update successfully",
    });

    await user.save();
  } catch (error) {
    return errorHandler(res, 400, error);
  }
};
