import express from "express";
import { testPostController } from "../controllers/testController.js";
import userAuth from "../middlewares/authController.js";

// router object
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Test:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: User name
 *      example:
 *         name: John
 *
 */

/**
 *  @swagger
 *  tags:
 *    name: Testing
 *    description: For Testing purpose apis
 */

/**
 * @swagger
 * /api/v1/test-post:
 *  post:
 *    summary: test page
 *    tags: [Testing]
 *    security:
 *       - apiKey: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Test'
 *    responses:
 *      200:
 *        description: test create successfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Test'
 *      500:
 *        description: something went wrong
 */

//routes
router.post("/test-post", userAuth, testPostController);

// export
export default router;
