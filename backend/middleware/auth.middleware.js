import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        try {
          const user = await UserModel.findById(decodedToken.id);
          res.locals.user = user;
          next();
        } catch (error) {
          console.error(error);
          res.locals.user = null;
          res.cookie("jwt", "", { maxAge: 1 });
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    console.log("No token");
  }
};