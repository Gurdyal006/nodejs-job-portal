import express from "express";
import {
  loginController,
  userSendOtpController,
  registerController,
  loginWithOtp,
  sendLinkPassword,
  resetPassword,
} from "../controllers/authController.js";

import { upload } from "../middlewares/multerMiddleware.js";

// router object
const router = express.Router();

// swagger routes
/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - firstName
 *        - lastName
 *        - email
 *        - password
 *      properties:
 *        id:
 *          type: string
 *          description: The Auto-generated id of user collection
 *          example: KDJH78R637843DKJSHDH
 *        firstName:
 *          type: string
 *          description: User first name
 *        lastName:
 *          type: string
 *          description: User Last name
 *        email:
 *          type: string
 *          description: User email
 *        password:
 *          type: string
 *          description: User password length more than 4
 *        location:
 *          type: string
 *          description: User location
 *      example:
 *         id: KDHIWUEHKJHKJ
 *         firstName: John
 *         lastName: Doe
 *         email: joh@gmail.com
 *         password: 123@123
 *         location: Pathankot
 *
 */

// api end points
/**
 *  @swagger
 *  tags:
 *    name: Auth
 *    description: authentication apis
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *    post:
 *      summary: register new user
 *      tags: [Auth]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: user created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: internal serevr error
 */

// Register routes || POST
router.post(
  "/register",
  // upload.single("avatar"), // single image
  upload.fields([{ name: "avatar", maxCount: 1 }]), // multi objects
  registerController
);

/**
 * @swagger
 * components:
 *  schemas:
 *    Login:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          description: User email
 *        password:
 *          type: string
 *          description: User password length more than 4
 *      example:
 *         email: joh@gmail.com
 *         password: 123@123
 *
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: login page
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Login'
 *    responses:
 *      200:
 *        description: login successfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *      500:
 *        description: something went wrong
 */

// Login routes || POST
router.post("/login", loginController);

/**
 *  @swagger
 *  tags:
 *    name: 2 Step Authentication
 *    description: login with otp authentication apis
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    OtpCreate:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 *          description: User email
 *      example:
 *         email: joh@gmail.com
 *
 */

/**
 * @swagger
 * /api/v1/auth/send-otp:
 *  post:
 *    summary: Send Otp page
 *    tags: [2 Step Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OtpCreate'
 *    responses:
 *      200:
 *        description: Otp create successfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OtpCreate'
 *      500:
 *        description: something went wrong
 */

// create otp routes with email|| POST
router.post("/send-otp", userSendOtpController);

/**
 * @swagger
 * components:
 *  schemas:
 *    otp:
 *      type: object
 *      required:
 *        - email
 *        - otp
 *      properties:
 *        email:
 *          type: string
 *          description: User email
 *        otp:
 *          type: string
 *      example:
 *         email: joh@gmail.com
 *         password: 123445
 *
 */

/**
 * @swagger
 * /api/v1/auth/login-otp:
 *  post:
 *    summary: Login Otp page
 *    tags: [2 Step Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/otp'
 *    responses:
 *      200:
 *        description: Login with Otp successfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/otp'
 *      500:
 *        description: something went wrong
 */

// login with otp
router.post("/login-otp", loginWithOtp);

// send password link with email
router.post("/forgot-password", sendLinkPassword);

// reset password link with email
router.put("/reset-password/:token", resetPassword);

// export
export default router;
