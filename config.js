var os = require('os');
Array.prototype.forEachAsync = async function (fn) {
    for (let t of this) { await fn(t) }
  }
  
  Array.prototype.forEachAsyncParallel = async function (fn) {
    await Promise.all(this.map(fn));
  }
  Array.prototype.forEachAsyncParallel10 = async function (fn) {
    const promises = this.map(async (item, index) => {
      await fn(item, index);
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds (10 promises per second)
    });
    await Promise.all(promises);
  }
  global.filterArray = (array, fields, value) => {
    fields = Array.isArray(fields) ? fields : [fields];
    
    return array.filter((item) => fields.some((field) => item[field] === value))
  };
    global.waitforme=(ms)=> {
    return new Promise( resolve => { setTimeout(resolve, ms); });
  }
  global.UniversalProject=`ui0`
  global.jitotx=0
let settings={
    Host:os.hostname(),
    Port:os.hostname()=="freesoldev"?80:3002,
    localhost:os.hostname()=="freesoldev"?true:false,
    mainnet:"https://api.mainnet-beta.solana.com", 
    devnet:"https://api.devnet.solana.com",
}



module.exports=settings;
