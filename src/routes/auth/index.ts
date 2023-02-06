import express from "express";
import { authController } from '../../controllers'
import * as validators from '../../middleware/validators/auth'
import { validate } from "../../middleware/validators";

const router = express.Router();

router.route('/register').post(validate(validators.register), authController.register);
router.route('/login').post(validate(validators.login), authController.login);
router.route('/logout').post(validate(validators.logout), authController.logout);
router.route('/refresh-token').post(validate(validators.refreshTokens), authController.refreshToken);

export default router;