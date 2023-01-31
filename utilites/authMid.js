import passport from "passport";

const authMid = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user) => {
        if (!user || error) {
            return res.status(401).json({ message: "Not authorized" });
        }
        req.user = user;
        next();
    })(req, res, next);
};

export default authMid;