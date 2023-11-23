import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController.js";

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
router.post("/register", registerController);

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

// export
export default router;
