import { Response, Request, NextFunction } from "express"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.locals.errorMessage = err.message;

    // mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }

    // default to 500 server error
    // console.error(err);
    return res.status(500).json({ message: err.message });
}