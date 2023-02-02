import express, { Router } from 'express';
import authRoute from './auth';

const router = express.Router();

interface IRoute {
    path: string,
    route: Router
}

const defaultIRoute: IRoute[] = [
    {
        path: '/auth',
        route: authRoute
    }
];

defaultIRoute.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;