import JWT from "jsonwebtoken";

const createJwtTokenBYFeat = (_id) => {
  return JWT.sign({ _id }, process.env.JWT_SECRET);
};

export default createJwtTokenBYFeat;
