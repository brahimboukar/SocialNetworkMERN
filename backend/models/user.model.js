import mongoose, { isObjectIdOrHexString } from "mongoose";
import validator from "validator";
import { ObjectId } from "mongodb";

const UtilisateurSchema = mongoose.Schema(
  {
    identifiant: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    prenom: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    telephone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail],
      lowercase: true,
      trim: true,
    },
    motDePasse: {
      type: String,
      required: true,
      minlength: 6,
      max: 1024,
    },
    dateDeNaissance: {
      type: Date,
      required: true,
    },
    talent: {
      type: String,
    },
    pays: {
      type: String,
    },
    ville: {
      type: String,
    },
    photoDeProfile: {
      type: String,
      default: "./uploads/profile.png",
    },
    bio: {
      type: String,
      maxlength: 1024,
    },
    abonnés: {
      type: [String],
    },
    abonnements: {
      type: [String],
    },
    talentsRecherchés: {
      type: [ObjectId],
      ref: "talent",
    },
    publications: {
      type: [ObjectId],
      ref: "publication",
    },
    signal: {
      type: [ObjectId],
      ref: "signal",
    },
    evaluations: {
      type: [ObjectId],
      ref: "evaluation",
    },
    commentaires: {
      type: [ObjectId],
      ref: "commentaire",
    },
    badges: {
      type: [ObjectId],
      ref: "badge",
    },
    groupes: {
      type: [ObjectId],
      ref: "groupe",
    },
    conversations: {
      type: [ObjectId],
      ref: "conversation",
    },
    cours: {
      type: [ObjectId],
      ref: "cours",
    },
    competitions: {
      type: [ObjectId],
      ref: "competition",
    },
    notifications: {
      type: [ObjectId],
      ref: "notification",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("utilisateur", UtilisateurSchema);

export default UserModel;