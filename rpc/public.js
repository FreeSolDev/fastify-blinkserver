const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const NodeCache = require('node-cache');
const fileCache = new NodeCache({ stdTTL: 600 });
const title=require("../processor/transactionbuilder").blinktitle

async function routes(router){

  router.get('/public/*', async (request, reply) => {
      const filePath = path.join(__dirname, '../public', request.params['*']);
      console.time("fileloading")
  
      if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          const lastModified = stats.mtimeMs;
          const cachedVersion = fileCache.get(filePath);
  
          if (cachedVersion && cachedVersion.lastModified >= lastModified) {
              reply.header('Content-Type', cachedVersion.mimeType);
              reply.header('Content-Disposition', 'inline');
              reply.send(cachedVersion.content);
              return reply;
          }
  
          const mimeType = mime.lookup(filePath) || 'application/octet-stream';
          const fileContent = fs.readFileSync(filePath);
  
          fileCache.set(filePath, {
              content: fileContent,
              mimeType: mimeType,
              lastModified: lastModified
          });
          reply.header('Content-Type', mimeType);
          reply.header('Content-Disposition', 'inline');
          reply.send(fileContent);
          return reply;
      } else {
          reply.status(404).send('File not found');
      }
  });
  router.get('/actions.json', async (req, reply) => {
    reply.type('application/json').send({
      "rules": [
        {
          "pathPattern": "/",
          "apiPath":`/blink/${title}`
        }
      ]
    });
  });
  router.options('/public/*', async (request, reply) => {
    reply
      .header('Access-Control-Allow-Origin', '*')
      .header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .header('Access-Control-Allow-Headers', 'Content-Type,accept-encoding,Authorization')
      .header('Content-Encoding', 'compress')
      .header('Content-Type','application/json')
      .send();
    });
  }
  module.exports = routes

