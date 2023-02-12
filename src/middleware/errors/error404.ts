import { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/error";

export const error404 = (req:Request, res:Response, next:NextFunction) => {
    next(new ApiError(404, 'Page not found'));
}