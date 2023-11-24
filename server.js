// swagger import
import swaggerUi, { serve } from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
import options from "./docs/docs.js";

// packages import
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";

// security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// files imports
import connectDb from "./config/db.js";

// routes import
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

// middleware error import
// import errorMiddleware from "./middlewares/errorMiddleware.js";

// config .env
// dotenv.config({path: './config'}) // if create folder for .env
dotenv.config();

//mongodb connection
connectDb();

// swagger configuration
const spec = swaggerDoc(options);

// rest objects
const app = express();

// middlewares

app.use(helmet()); // headers protection
app.use(xss()); // cross site scripting attack protection
app.use(mongoSanitize()); // database security inject query like
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/api/v1", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/jobs", jobRoutes);

// swagger homeroutes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// middleware errors
// app.use(errorMiddleware);

// port
const PORT = process.env.PORT || 8080;

/// listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running in ${process.env.DEV_MODE} Mode on port ${PORT}`.bgCyan
      .white
  );
});
