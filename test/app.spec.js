const app = require('../src/app.js');

describe('App', () => {
  it('GET / responds with 200 containing "Hello, noteful users!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, noteful users!');
  });
});