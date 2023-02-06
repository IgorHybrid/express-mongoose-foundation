import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validate =
    (schema: Record<string,any>) =>
    (req: Request, res: Response, next: NextFunction):void => {
        const { value, error } = Joi.compile(schema)
        .prefs({ errors: { label: 'key' } })
        .validate(req.body);

        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            return next({name: 'ValidationError', message: errorMessage});
        }

        Object.assign(req, value);
        return next();
    };