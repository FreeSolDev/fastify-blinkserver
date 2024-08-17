const web3 =require('@solana/web3.js');
const settings=require('../config')
const connection = new web3.Connection(settings.localhost?settings.devnet:settings.mainnet,'confirmed');
const blinkinfo={
  title:"template",
  domain:"https://blinkurl.com",
  description:"description of your blink",
  donation_amount:0.01,
  donation_destination:"a6LrgonoWkpfjWmpuX15Xdfnn48LZjnuJZnKVFmXiFo",
}
let TransActionBuilder={
      TRANSFER:{
        Sol:async (from,to,amount)=>{
          const PRIORITY_RATE = 100000;
          const TransferSol=new web3.Transaction()
          .add(web3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: PRIORITY_RATE}))
          .add(
            web3.SystemProgram.transfer({
                  fromPubkey: new web3.PublicKey(from),
                  toPubkey: new web3.PublicKey(to),
                  lamports:parseInt(((amount)* web3.LAMPORTS_PER_SOL)),
                })
              );
            TransferSol.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
            TransferSol.feePayer = new web3.PublicKey(from)
          return TransferSol.serialize({ requireAllSignatures: false, verifySignatures: true }).toString('base64')
        }
      }
  }
  
  
  module.exports={TransActionBuilder,blinkinfo}
  