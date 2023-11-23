// error middleware || next fn called middleware

const errorHandler = (
  res,
  statusCode = 500,
  message = "Internal Server Error"
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;

// const errorMiddleware = (err, req, res, next) => {

//   res.status(500).json({
//     success: false,
//     message: "server error encountered",
//     err,
//   });
// };

// export default errorMiddleware;
