import express from "express";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./api/api.js";
import passport from "passport";

dotenv.config();


const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    message: `Use api on routes: 
    /api/users/signup - registration user { email, password},
    /api/users/login - login {email, password},
	/api/users/logout - logout,
	/api/users/current - current user,
	/api/users/ - to change subscription,
    /api/contacts - to get all users or post user,
	/api/contacts/:contactId - to get, delete or update user by ID,
	/api/contacts/:contactId/favorite - to add or remove user from favorites`,
    data: "Not found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

app.listen(3000, () => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("\nConnected to the database");
    console.log(new Date().toISOString());
    console.log("Listening on port 3000");
  }).catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });;
});