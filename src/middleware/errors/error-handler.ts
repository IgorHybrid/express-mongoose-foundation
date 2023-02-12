import { Response, Request, NextFunction } from "express";
import ApiError from "../../utils/error";

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const message: string = error.message || 'Server internal error';
        error = new ApiError(500, message, false, err.stack);
    }
    next(error);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = err;
    // if (process.env.env === 'production' && !err.isOperational) {
    //     statusCode = 500;
    //     message = 'Internal Server Error';
    // }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        stack: err.stack
    }

    // console.error(err);

    res.status(statusCode).send(response);
};