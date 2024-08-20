const Transactionbuilder=require("../processor/transactionbuilder").TransActionBuilder
const blinkinfo=require("../processor/transactionbuilder").blinkinfo
async function routes(router){

  router.options(`/blink/${blinkinfo.title}`, async (request, reply) => {
    reply
      .header('Access-Control-Allow-Origin', '*')
      .header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .header('Access-Control-Allow-Headers', 'Content-Type,accept-encoding,Authorization')
      .header('Content-Encoding', 'compress')
      .header('Content-Type','application/json')
      .send();
    });

    router.get(`/blink/${blinkinfo.title}`, async(req, res) => {
      let json={
        "title": "Donate Sol to XYZ",
        "icon": "https://shdw-drive.genesysgo.net/CdQkmeEugcgq5xWiJvQMkq9umumvActkygX8zk2sHarQ/jusmntloading.gif",
        "description": `Donate ${blinkinfo.donation_amount} sol to ${blinkinfo.donation_destination}`,
        "links": {
          "actions": [
            {
              "label": "Donate Now", 
              "href": `/blink/${blinkinfo.title}`
            }
          ]
        }
      }
      res.send(json)
      })
            
      router.post(`/blink/${blinkinfo.title}`, async(req, res,) => {

        const results=await Transactionbuilder.TRANSFER.Sol(
          req.body.account,
          blinkinfo.donation_destination,
          blinkinfo.donation_amount)
        
        if(results===undefined){
          res.send({error:"Try Again"})
        }else{
          res.send(results)
        }
      })
      
      router.post(`/blink/${blinkinfo.title}-umi`, async(req, res,) => {

        const results=await Transactionbuilder.UMITRANSFER.Sol(
          req.body.account,
          blinkinfo.donation_destination,
          blinkinfo.donation_amount)
        
        if(results===undefined){
          res.send({error:"Try Again"})

        }else{
          res.send(results)
        }
      })

      
 
}
module.exports = routes