import S from 'fluent-json-schema';
import SQL from '@nearform/sql';

const schema = {
  response: {
    200: S.array().items(
      S.object().prop('username', S.string().required())
        .prop('id', S.integer().required())
    )
  }
};

async function users(fastify) {
  fastify.get('/', 
  { onRequest: [fastify.authenticate], schema },
  async (request) => {
    request.log.info("Requesting users route");
    const sql = SQL`
      SELECT id, username FROM users
    `
    const { rows: users } = await fastify.pg.query(sql);
    return users;
  });
}

export default users;
