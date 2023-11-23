import errorHandler from "../middlewares/errorMiddleware.js";
import userModel from "../models/userModel.js";

export const updateUserController = async (req, res, next) => {
  //   const { firstName, lastName, email, location } = req.body;
  //   if (!firstName || !lastName || !email || !location) {
  //     return errorHandler(res, 400, "Please fill all fields");
  //   }
  //   const user = await userModel.findOne({ _id: req.userId });
  //   user.firstName = firstName;
  //   user.lastName = lastName;
  //   user.email = email;
  //   user.location = location;
  //   await user.save();

  const existUser = await userModel.findById(req.params.id);
  if (!existUser) {
    return errorHandler(res, 400, "User id not found");
  }

  const update = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    location: req.body.location,
  };

  const updateUser = await userModel.findByIdAndUpdate(req.params.id, update);

  res.status(200).json({
    success: true,
    message: "update data succfully",
    updateUser,
  });
};
