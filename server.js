
const net = require("net");
const fastify = require('fastify')({
  logger:true,
  trustProxy: false
})
const settings=require('./config')
const Port=settings.Port
// work around a node v20 bug: https://github.com/nodejs/node/issues/47822#issuecomment-1564708870
if (net.setDefaultAutoSelectFamily) {
  net.setDefaultAutoSelectFamily(false);
}

const cors=require('@fastify/cors')

fastify.register(cors,{
  origin: "*",
  methods: ['GET', 'POST','PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization',`Content-Encoding`,`Accept-Encoding`],
  preflight:false
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



