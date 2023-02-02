import morgan from 'morgan';
import { Request, Response } from 'express';

morgan.token('message', (_req: Request, res: Response) => res.locals.errorMessage || '');

const successResponseFormat = ':remote-addr - :method :url :status - :response-time ms';
const errorResponseFormat = ':remote-addr - :method :url :status - :response-time ms - message: :message';

const successHandler = morgan(successResponseFormat, {
    skip: (_req: Request, res: Response) => res.statusCode >= 400
});

const errorHandler = morgan(errorResponseFormat, {
    skip: (_req: Request, res: Response) => res.statusCode < 400
});

export default {
    successHandler,
    errorHandler
}