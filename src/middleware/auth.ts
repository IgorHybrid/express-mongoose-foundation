import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { User, IUser } from '../models/User';

export const jwtStrategy = new JwtStrategy(
    {
        secretOrKey: process.env.JWT_SECRET || 'json-secret',
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
        try {
            if (payload.type !== 'access') {
                throw new Error('Invalid token type');
            }

            const user = await User.findById(payload.sub);
            if(!user) {
                return done(null, false);
            }

            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
);

const verifyCallback =
  (req: Request, resolve: any, reject: any) =>
  async (err: Error, user: IUser, info: string) => {
    if (err || info || !user) {
        console.error(user);
        return reject({ name: "Unauthorized", message: "Authentication required" });
    }

    req.user = user;
    resolve();
  };


export const verifyToken = () =>
    async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
    })
    .then(() => next())
    .catch((err) => next(err));