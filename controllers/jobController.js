import mongoose from "mongoose";
import errorHandler from "../middlewares/errorMiddleware.js";
import jobsModels from "../models/jobsModels.js";
import moment from "moment";

export const createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    if (!company || !position) {
      return errorHandler(res, 400, "all fields required!!!");
    }

    req.body.createdBy = req.user.userId; // login user check

    const job = await jobsModels.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "created successfully", job });
  } catch (error) {
    return errorHandler(res, 500, "something went wrong");
  }
};

// get all jobs
export const getAllJobsController = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;
  //conditons for searching filters
  const queryObject = {
    createdBy: req.user.userId,
  };
  //logic filters
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobsModels.find(queryObject);

  //sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "asc") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "desc") {
    queryResult = queryResult.sort("-position");
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  // jobs count
  const totalJobs = await jobsModels.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  //const jobs = await jobsModels.find({ createdBy: req.user.userId });
  if (jobs.length === 0) {
    return errorHandler(res, 400, "no data found");
  }

  res.status(200).json({
    // success: true,
    message: "All jobs",
    totalJobs,
    jobs,
    numOfPage,
  });
};

// update job
export const updateJobController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { company, position } = req.body;

    // validation
    if (!company || !position) {
      return errorHandler(res, 400, "all fields required!!!");
    }

    const job = await jobsModels.findOne({ _id: id });
    if (!job) {
      return errorHandler(res, 400, `no job found with this id ${id}`);
    }

    // update only who create job like admin
    if (!req.user.userId === job.createdBy.toString()) {
      return errorHandler(
        res,
        400,
        `you are not authorized to update this job`
      );
    }

    const updateJob = await jobsModels.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ updateJob });
  } catch (error) {
    return errorHandler(res, 500, error);
  }
};

export const deleteJobController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobsModels.findById({ _id: id });
    if (!job) {
      return errorHandler(res, 400, `no job found with this id ${id}`);
    }
    // update only who create job like admin
    if (!req.user.userId === job.createdBy.toString()) {
      return errorHandler(
        res,
        400,
        `you are not authorized to update this job`
      );
    }
    await jobsModels.deleteOne();

    res.status(200).json({ success: true, message: "delete succesfully" });
  } catch (error) {
    return errorHandler(res, 500, "something went wrong");
  }
};

/// job stats filter
export const jobStatsController = async (req, res) => {
  try {
    const stats = await jobsModels.aggregate([
      // search job by user
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      /// search by status count with pending reject interview
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // default stats
    const defaultStats = {
      pending: stats.pending || 0,
      reject: stats.reject || 0,
      interview: stats.interview || 0,
    };

    // monthly yearly stats
    let monthlyApplications = await jobsModels.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // set correct form date year and month wise count for charts
    monthlyApplications = monthlyApplications
      .map((item) => {
        const {
          _id: { year, month },
          count,
        } = item;
        const date = moment()
          .month(month - 1)
          .year(year)
          .format("MMM Y");
        return { date, count };
      })
      .reverse();

    res
      .status(200)
      .json({ totalJobs: stats.length, defaultStats, monthlyApplications });
  } catch (error) {
    return errorHandler(res, 500, error);
  }
};
