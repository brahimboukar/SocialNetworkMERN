import UserModel from "../models/user.model.js";
import fs from "fs";
import { promisify } from "util";
import { pipeline as pipelineCallback } from "stream";
import { uploadErrors } from "../utils/errors.utils.js";


const pipeline = promisify(pipelineCallback);

export const uploadProfil = async (req, res) => {
  try {
    if (
      req.file.detectedMimeType != "image/jpg" &&
      req.file.detectedMimeType != "image/png" &&
      req.file.detectedMimeType != "image/jpeg"
    ) {
      throw Error("invalid file");
    }

    if (req.file.size > 500000) {
      throw Error("max size");
    }
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }

  const fileName = req.body.name + ".jpg";

  try {
    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../client/public/uploads/profil/${fileName}`
      )
    );

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: "./uploads/profil/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.send(updatedUser);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
