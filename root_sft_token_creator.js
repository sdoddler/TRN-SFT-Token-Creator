const { Keyring } = require("@polkadot/keyring");
const { hexToU8a } = require("@polkadot/util");

const { ApiPromise } = require("@polkadot/api");
const { getApiOptions, getPublicProvider } = require("@therootnetwork/api");



const SFT_CREATOR_KEY = "YOUR HEX BASED KEY HERE";
const SFT_COLLECTION_ID = 57444;// ;
// 57444; -- MAINNET ITEMS

const SFT_TOKENS_INFO = [{"0":"EMPTY TOKEN"},{"1":"Iron Sword - Rare"},{"2":"Enchanted Iron Sword - epic"},{"3":"Bone Sword - Rare"},{"4":"Broken Iron Sword - Uncommon"},{"5":"Rusty Iron Sword - Common"},{"6":"Bronze Sword - Uncommon"},{"7":"Wooden Training Sword - Common"},{"8":"Iron Dagger - Rare"},{"9":"Enchanted Iron Dagger - Epic"},{"10":"Bone Dagger - Uncommon"},{"11":"Bronze Dagger - Uncommon"},{"12":"Rusty Iron Dagger - Common"},{"13":"Wooden Buckler - Common"},{"14":"Iron Buckler - Uncommon"},{"15":"Studded Iron Buckler - Rare"},{"16":"Enchanted Studded Iron Buckler - Epic"},{"17":"Bronze Buckler - Uncommon"},{"18":"Combat Bow - Rare"},{"19":"Engchanted Combat Bow - Epic"},{"20":"Hunting Bow - Uncommon"},{"21":"Training Bow - Common"},{"22":"Long Bow - Uncommon"},{"23":"Wooden Tower Shield - Uncommon"},{"24":"Iron Knight's Shield - Uncommon"},{"25":"Studded Knight's Shield - Rare"},{"26":"Enchanted Knight's Shield - Epic"},{"27":"Bronze Tower Shield - Uncommon"},{"28":"Black Dress Tie - Common"},{"29":"Grey Tie - Uncommon"},{"30":"Golden Tie - Uncommon"},{"31":"Diamond Tie - Rare"},{"32":"Festive Tie - Epic"},{"33":"Four Leaf Clover - Common"},{"34":"Silver Four Leaf Clover - Uncommon"},{"35":"Golden Four Leaf Clover - Uncommon"},{"36":"Diamond Four Leaf Clover - Rare"},{"37":"Enchanted Four Leaf Clover - Epic"},{"38":"Wooden Walking Staff - Common"},{"39":"Emerald Staff - Uncommon"},{"40":"Emerald Combat Staff - Uncommon"},{"41":"Amethyst Staff - Rare"},{"42":"Enchanted Amethyst Staff - Epic"},{"43":"Leather Breastplate - Common"},{"44":"Bronze Breastplate - Uncommon"},{"45":"Iron Breastplate - Uncommon"},{"46":"Diamond Breastplate - Rare"},{"47":"Enchanted Diamond Breastplate - Epic"},{"48":"Dart - Common"},{"49":"Dart - Uncommon"},{"50":"Dart - Rare"},{"51":"Dart - Epic"},{"52":"Dart - Legendary"},{"53":"Wraith - Common"},{"54":"Wraith - Uncommon"},{"55":"Wraith - Rare"},{"56":"Wraith - Epic"},{"57":"Wraith - Legendary"},{"58":"Pathfinder - Common"},{"59":"Pathfinder - Uncommon"},{"60":"Pathfinder - Rare"},{"61":"Pathfinder - Epic"},{"62":"Pathfinder - Legendary"},{"63":"Guardian - Common"},{"64":"Guardian - Uncommon"},{"65":"Guardian - Rare"},{"66":"Guardian - Epic"},{"67":"Guardian - Legendary"},{"68":"Javelin - Common"},{"69":"Javelin - Uncommon"},{"70":"Javelin - Rare"},{"71":"Javelin - Epic"},{"72":"Javelin - Legendary"},{"73":"Scythe - Common"},{"74":"Scythe - Uncommon"},{"75":"Scythe - Rare"},{"76":"Scythe - Epic"},{"77":"Scythe - Legendary"},{"78":"Destroyer - Common"},{"79":"Destroyer - Uncommon"},{"80":"Destroyer - Rare"},{"81":"Destroyer - Epic"},{"82":"Destroyer - Legendary"},{"83":"Juggernaught - Common"},{"84":"Juggernaught - Uncommon"},{"85":"Juggernaught - Rare"},{"86":"Juggernaught - Epic"},{"87":"Juggernaught - Legendary"}];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  // Instantiate the API


  const api = await ApiPromise.create({
    ...getApiOptions(),
    ...getPublicProvider("root"),
  });

  // Construct the keyring after the API (crypto has an async init)
  const keyring = new Keyring({ type: "ethereum" });

  // Add Alice to our keyring
  const KEYRING_SFT_CREATOR = keyring.addFromSeed(hexToU8a(SFT_CREATOR_KEY));

  let array = [];

  SFT_TOKENS_INFO.forEach(async (element) => {
        var keys = Object.keys(element)
      console.log(keys[0])
      var values = Object.values(element)
      array.push(values[0])
  });

  const unsubscribe = await api.query.timestamp.now((moment) => {
    console.log(`The last block has a timestamp of ${moment}`);
  
    // unsubscribe(); call to stop receiving updates
  });

  let batchCalls = [];

  for (let i=0;i<array.length;i++){
var tokenName = array[i];
  
      
      // Collection ID, Token Name (e.g. Iron Sword - Rare), Initial Issuane, Max issuance, Token Owner (if initial Issuance is different from minter)
      const createToken = api.tx.sft.createToken(SFT_COLLECTION_ID,tokenName,0,null,null)

      batchCalls.push(createToken);

      continue;
      // Previous method, without Batching
      console.log(createToken.toHuman());
     // 
      let waiting = true;
     // let hash = null;
      let waitCount = 0;
      // Sign and send the transaction using our account
      const result = await createToken.signAndSend(KEYRING_SFT_CREATOR, ({ events = [], status, txHash }) => {
        console.log(`Current status is ${status.type}`);
    
        if (status.isFinalized) {
          console.log(`Transaction included at blockHash ${status.asFinalized}`);
          console.log(`Transaction hash ${txHash.toHex()}`);
          
         // hash = txHash.toHex();

          // Loop through Vec<EventRecord> to display all events
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
          });
          
          waiting = false;
          unsubscribe();
        }
      });
      console.log(tokenName +"\n--")
      while (waiting){
      await delay(100);
      waitCount ++;
      if (waitCount >= 400) waiting = false;
      }
      if (waitCount >= 400) break;
      //console.log("Tx sent with hash", hash);
      

      
  }

  let batchResult = await api.tx.utility.batch(batchCalls).signAndSend(KEYRING_SFT_CREATOR, ({ status }) => {
    if (status.isInBlock) {
      console.log(`included in ${status.asInBlock}`);
    }
  });

  await delay(40000);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
