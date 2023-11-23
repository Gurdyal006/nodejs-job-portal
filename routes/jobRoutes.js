import express from "express";
import userAuth from "../middlewares/authController.js";
import {
  createJobController,
  deleteJobController,
  getAllJobsController,
  jobStatsController,
  updateJobController,
} from "../controllers/jobController.js";

const router = express.Router();

// swagger routes
/**
 * @swagger
 * components:
 *  schemas:
 *    Job:
 *      type: object
 *      required:
 *        - company
 *        - position
 *      properties:
 *        company:
 *          type: string
 *          description: Company name
 *        position:
 *          type: string
 *          description: Position name
 *        status:
 *          type: string
 *          description: Status name
 *        workType:
 *          type: string
 *          description: WorkType name
 *        workLocation:
 *          type: string
 *          description: WorkLocation name
 *        createdBy:
 *          type: string
 *          description: Created By Id
 *
 */

/**
 *  @swagger
 *  tags:
 *    name: Jobs
 *    description: For Job apis
 */

/**
 * @swagger
 * /api/v1/jobs/create-job:
 *    post:
 *      summary: create new job
 *      tags: [Jobs]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *      responses:
 *        200:
 *          description: Job created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Job'
 *        500:
 *          description: internal serevr error
 */

// routes
// create job
router.post("/create-job", userAuth, createJobController);

/**
 * @swagger
 * /api/v1/jobs/get-jobs:
 *   get:
 *     summary: Get job data
 *     tags: [Jobs]
 *     description: Retrieve job data from the server.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: 'Job data retrieved successfully'
 */

// All jobs
router.get("/get-jobs", userAuth, getAllJobsController);

// update put || patch
router.patch("/update-job/:id", userAuth, updateJobController);

// delete
router.delete("/delete-job/:id", userAuth, deleteJobController);

// JObs stats filter || get
router.get("/job-stats", userAuth, jobStatsController);

export default router;
