
const net = require("net");
const settings=require('./config')
const cors=require('@fastify/cors')
const fastify = require('fastify')({
  logger:settings.localhost?true:false,
  trustProxy: settings.trustProxy
})
const Port=settings.Port
global.RequestAllowed=true

// work around a node v20 bug: https://github.com/nodejs/node/issues/47822#issuecomment-1564708870
if (net.setDefaultAutoSelectFamily) {
  net.setDefaultAutoSelectFamily(false);
}



fastify.register(cors,{
  origin: "*",
  methods: ['GET', 'POST','PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization',`Content-Encoding`,`Accept-Encoding`],
  preflight:false
})
fastify.addHook('onRequest', async(request, reply) => {
  if (!RequestAllowed) {
    reply.code(403).send({ error: 'Requests are not allowed at the moment' });
  }
})

fastify.register(require('@fastify/formbody'))

fastify.register(require('./app'))


const start = async () => {
    try {
      await fastify.listen({ port: Port });
      console.log(`Server is running on http://localhost:${Port}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  
start();



