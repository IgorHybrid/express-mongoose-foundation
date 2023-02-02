import express from "express";
import { authController } from '../../controllers'

const router = express.Router();

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

export default router;