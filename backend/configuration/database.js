import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./configuration/.env" });

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_PASS}@cluster0.lqyfv5i.mongodb.net/mern`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));