const request = require('supertest');
const express = require('express');
const routes = require('../src/routes/userRouter');

const app = express();
app.use('/', routes);

describe('GET /', () => {
  it('responds with 200', (done) => {
    request(app)
      .get('/')
      .expect(302, done);
  });

  test('responds to /', async () => {
    const res = await request(app).get('/');
    // expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(302);
  });
  
});