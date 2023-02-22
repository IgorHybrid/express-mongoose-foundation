import request from 'supertest';
import app from '../../src/app';

describe('Not Found routes', () => {
    describe('GET /invalid-route', () => {
        test('return 404 Not Found', async () => {
            const res = await request(app).get('/invalid-route').expect(404);

            expect(res.body).toMatchObject({
                code: 404,
                message: 'Page not found',
                stack: expect.anything()
            })
        });
    });
}); 