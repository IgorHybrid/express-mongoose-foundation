import express from "express";
import { authMiddleware } from "../../middleware";

const router = express.Router();

router.route('/').get(
    authMiddleware.verifyToken(),
    (req, res, next) => {
        try {
            res.send({message: "Ok"});
        } catch (error) {
            next(error);
        }
    }
);

export default router;