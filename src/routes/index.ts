import express, { Router } from 'express';
import authRoute from './auth';
import testRoute from './test';

const router = express.Router();

interface IRoute {
    path: string,
    route: Router
}

const defaultIRoute: IRoute[] = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/test',
        route: testRoute
    }
];

defaultIRoute.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;