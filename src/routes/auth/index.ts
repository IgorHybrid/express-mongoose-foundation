import express from "express";
import { authController } from '../../controllers'

const router = express.Router();

router.route('/register').post(authController.register);

export default router;