import express from "express";

import contactController from "../controller/contactController.js";
import userController from "../controller/userController.js";
import { createContact, updatingContact, updateStatusContact, findUserByEmail, patchSubscription } from "../utilites/validation.js";
import authMid from "../utilites/authMid.js";
const contactsRouter = express.Router()
contactsRouter.get("/", authMid, contactController.getAll);

contactsRouter.get("/:contactId", contactController.getOne);

contactsRouter.post("/", authMid, createContact, contactController.post);

contactsRouter.delete("/:contactId", contactController.deleteContact);

contactsRouter.put("/:contactId", updatingContact, contactController.put);

contactsRouter.patch("/:contactId/favorite", updateStatusContact, contactController.patchFavorite);

const userRouter = express.Router();

userRouter.post("/signup", findUserByEmail, userController.register);
userRouter.post("/login", findUserByEmail, userController.login);
userRouter.get("/logout", authMid, userController.logout);
userRouter.get("/current", authMid, userController.getCurrent);
userRouter.patch(
    "/",
    authMid,
    userController.patchSubscription,
    patchSubscription
);

const router = express.Router();
router.use("/contacts", contactsRouter);
router.use("/users", userRouter);

export default router;