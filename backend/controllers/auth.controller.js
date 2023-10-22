import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  signUpErrors,
  signInErrors,
  signOutErrors,
} from "../utils/errors.utils.js";

// create a token
const maxAge = 3 * 24 * 60 * 60; // 3 days

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

export default createToken;

// registration
export const signUp = async (req, res) => {
  const {
    identifiant,
    nom,
    prenom,
    telephone,
    email,
    motDePasse,
    dateDeNaissance,
  } = req.body;

  if (motDePasse.length < 6) {
    const error = "Le mot de passe doit faire au moins 6 caractères";
    return res.status(400).json({ error });
  }

  const salt = await bcrypt.genSalt();
  const motDePasseHash = await bcrypt.hash(motDePasse, salt);
  const newUser = new UserModel({
    identifiant,
    nom,
    prenom,
    telephone,
    email,
    motDePasse: motDePasseHash,
    dateDeNaissance,
  });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    const errors = signUpErrors(error);
    res.status(200).json({ errors });
  }
};

// connection
export const login = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email is not valid." });
    }

    const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password is not valid." });
    }

    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    // Vous pouvez ajouter ici d'autres données liées à la connexion si nécessaire
    const responseData = {
      user: user._id,
      message: "User is connected.",
    };

    res.status(200).json(responseData);
  } catch (error) {
    const errors = signInErrors(error);
    res.status(200).json({ errors });
  }
};

// deconnection
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  } catch (error) {
    const errors = signOutErrors(error);
    res.status(500).json({ errors });
  }
};