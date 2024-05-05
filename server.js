import Fastify from 'fastify'
import oauthPlugin from '@fastify/oauth2'
import cors from "@fastify/cors"
import dotenv from "dotenv"

dotenv.config()

const fastify = Fastify({
  logger: true
})

fastify.register(cors, {
    origin: "*" // allow all origins (BAD)
});

fastify.register(oauthPlugin, {
  name: 'githubOAuth2',
  credentials: {
    client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET
    },
    auth: oauthPlugin.GITHUB_CONFIGURATION
  },
  startRedirectPath: '/api/login/github',
  callbackUri: 'http://localhost:3000/api/login/github/callback'
})

fastify.get('/api/login/github/callback', async function (request, reply) {
  const { token } = await this.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

  console.log(token.access_token)

  // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

  reply.redirect("http://localhost:8000/?token=" + token.access_token)

})

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
