import t from 'tap';
import buildServer from '../index.js';

t.test('GET /users', async t => {
  t.test('returns users', async t => {
    const app = buildServer();
    const res = await app.inject({
      method: 'GET',
      url: '/users',
    });
    
    t.equal(res.statusCode, 200);
    t.same(await res.json(), [
      { username: 'alice' },
        { username: 'bob' },
      ]
    );
  });
});

