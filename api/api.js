import express from "express";
import contactController from "../controller/contactController.js";
import userController from "../controller/userController.js";
import { createContact, updatingContact, updateStatusContact, findUserByEmail, patchSubscription, verifyEmail } from "../utilites/validation.js";
import authMid from "../utilites/authMid.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: "tmp/",
    filename: (req, file, cb) => cb(null, file.originalname),
    limits: { fileSize: 1048576 },
});
const mimeTypeAllowedList = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
];
const multerInstance = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const mimetype = file.mimetype;
        if (!mimeTypeAllowedList.includes(mimetype)) {
            return cb(null, false);
        }
        return cb(null, true);
    },
});

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
userRouter.patch(
    "/avatars",
    authMid,
    multerInstance.single("avatar"),
    userController.patchAvatar
);
userRouter.get("/verify/:verificationToken", userController.verifyEmail);
userRouter.post(
    "/verify",
    verifyEmail,
    userController.resendVerificationEmail
);

const router = express.Router();
router.use("/contacts", contactsRouter);
router.use("/users", userRouter);

export default router;