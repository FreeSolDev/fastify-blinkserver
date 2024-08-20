const web3 =require('@solana/web3.js');
const settings=require('../config')
const connection = new web3.Connection(settings.localhost?settings.devnet:settings.mainnet,'confirmed');
const path = require('path');
const { createUmi }=require('@metaplex-foundation/umi-bundle-defaults')
const Umi=require("@metaplex-foundation/umi")
const ToolBox=require('@metaplex-foundation/mpl-toolbox')
const fs = require('fs');
const CheckerInterval=10
const blinkinfo={
  title:"template",
  domain:"https://blinkurl.com",
  description:"description of your blink",
  donation_amount:0.01,
  donation_destination:"a6LrgonoWkpfjWmpuX15Xdfnn48LZjnuJZnKVFmXiFo",
}

let InMemory={}
let TransActionBuilder={
      TRANSFER:{
        Sol:async (from,to,amount)=>{
          try{
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
          return {transaction:TransferSol.serialize({ requireAllSignatures: false, verifySignatures: true }).toString('base64'),message:`Succesfully Donated ${amount} sol to ${to}`}
            }catch(e){
              return {error:e.message}
            }
        }
      },
      UMITRANSFER:{
        Sol:async (from,to,amount)=>{
          try{
          let frontendsigner=createNoopSigner(Umi.publicKey(from))
          const umi = createUmi(settings.localhost?settings.devnet:settings.mainnet)
          umi.identity=frontendsigner
          umi.payer=frontendsigner
          let builder = Umi.transactionBuilder()
          builder=builder.add(ToolBox.transferSol(umi, {
            source: Umi.publicKey(from),
            destination: Umi.publicKey(to),
            amount: Umi.sol(amount),
          }))
          let builttx= await builder.buildWithLatestBlockhash(umi)
          console.log(builttx)
          const serialized = Buffer.from(umi.transactions.serialize(builttx)).toString('base64');
          return {transaction:serialized,message:`Succesfully Donated ${amount} sol to ${to}`}    

          }catch(e){
            return {error:e.message}
          }


        }
      }
  }
  
  function saveToDisk() {
    if(Object.keys(InMemory).length!==0){
      if((Utility.rightnow()-InMemory["lastupdate"])<CheckerInterval){
        fs.writeFile(path.join(__dirname,`../public/${blinkinfo.title}.txt`), JSON.stringify(InMemory, null, 2), (err) => {
          if (err) {
            console.error('Error saving data to disk:', err);
          } else {
            console.log('Data successfully saved to disk at', new Date());
          }
        });
      }
    }
  }
  function loadFromDisk() {
    if (fs.existsSync(path.join(__dirname,`../public/${blinkinfo.title}.txt`))) {
      try {
        const data = fs.readFileSync(path.join(__dirname,`../public/${blinkinfo.title}.txt`), 'utf-8');
        InMemory = JSON.parse(data);
      } catch (err) {
        console.error('Error loading data from disk:', err);
      }
    } else {
      console.log('No data file found, starting with an empty store.');
    }
  }
  loadFromDisk();
  
  setInterval(saveToDisk,(CheckerInterval*1000));
  module.exports={TransActionBuilder,blinkinfo,InMemory}
  