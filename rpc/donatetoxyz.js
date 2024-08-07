const Transactionbuilder=require("../processor/transactionbuilder")
async function routes(router){

  router.options('/blink/donatesoltoxyz', async (request, reply) => {
    reply
      .header('Access-Control-Allow-Origin', '*')
      .header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .header('Access-Control-Allow-Headers', 'Content-Type,accept-encoding,Authorization')
      .header('Content-Encoding', 'compress')
      .header('Content-Type','application/json')
      .send();
    });

    router.get('/blink/donatesoltoxyz', async(req, res) => {
      let json={
        "title": "Donate Sol to XYZ",
        "icon": "https://shdw-drive.genesysgo.net/CdQkmeEugcgq5xWiJvQMkq9umumvActkygX8zk2sHarQ/jusmntloading.gif",
        "description": "Donate 0.01 sol to xyz",
        "links": {
          "actions": [
            {
              "label": "Donate Now", 
              "href": "/blink/donatesoltoxyz"
            }
          ]
        }
      }
      res.send(json)
      })
            
      router.post('/blink/donatesoltoxyz', async(req, res,) => {

        const destination="a6LrgonoWkpfjWmpuX15Xdfnn48LZjnuJZnKVFmXiFo"

        const amount=0.01

        const results=await Transactionbuilder.TRANSFER.Sol(req.body.account,destination,amount)
        
        if(results===undefined){
          res.send({error:"Try Again"})

        }else if(results.error){

          res.send({error:results.error})

        }else{

          res.send({transaction:results,message:"Succesfully Donated 0.01 sol to xyz"})

        }
      })
   

      
 
}
module.exports = routes