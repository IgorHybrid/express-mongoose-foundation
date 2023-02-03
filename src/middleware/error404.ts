import { Request, Response, NextFunction } from "express"

export const error404 = (req:Request, res:Response, next:NextFunction) => {
    res.status(404).send({message: 'Page not found'});
}