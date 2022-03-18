import S from 'fluent-json-schema';
import errors from 'http-errors';
import SQL from '@nearform/sql';
import { Type, Static } from '@sinclair/typebox'
import { FastifyInstance, FastifyRequest } from 'fastify'

const BodySchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
})
// Generate type from JSON Schema
type BodySchema = Static<typeof BodySchema>

const ResponseSchema = Type.Object({
  token: Type.String(),
})
type ResponseSchema = Static<typeof ResponseSchema>

const schema = {
  body: BodySchema,
  response: {
    200: ResponseSchema,
  },
}

export default async function login(fastify: FastifyInstance) {
  fastify.post('/login', { schema }, async (req: FastifyRequest<{ Body: BodySchema }>): Promise<ResponseSchema> => {
    const { username, password } = req.body;

    if (username !== password) {
      throw new errors.Unauthorized()
    }
    const sql = SQL`
      SELECT id, username FROM users
      WHERE username = ${username}
    `
    const {
      rows: [user]
    } = await fastify.pg.query(sql);

    if (!user) throw new errors.Unauthorized()
    
    const token = fastify.jwt.sign({
      username,
    });
    return {
      token
    };
  });
}
