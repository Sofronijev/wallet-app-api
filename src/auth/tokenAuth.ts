import { verify } from "jsonwebtoken";
import { configDB } from "../config";


export const tokenAuthorization = (req, res, next) => {
  try {
    //"Bearer [token]"
    const token = req.headers.authorization.split(" ")[1];
    const decoded = verify(token, configDB.jwt_token);
    // Creates new prop in req to save user data, can be used in function after this middleware
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access!",
    });
  }
};
