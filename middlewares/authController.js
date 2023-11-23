import JWT from "jsonwebtoken";
import errorHandler from "./errorMiddleware.js";

// JWT with payload
const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return errorHandler(res, 500, "Auth failed!!");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    return errorHandler(res, 500, "Auth failed!!");
  }
};

export default userAuth;
