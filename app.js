const path = require('path')
const autoload = require('@fastify/autoload')
async function app(fastify){
    fastify.register(autoload,{
         dir: path.join(__dirname, 'rpc')
    })
    fastify.register(autoload,{
      dir: path.join(__dirname, 'processor')
    })
}
module.exports = app
