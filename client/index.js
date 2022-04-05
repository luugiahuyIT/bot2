const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const Coin = require('./contracts/Hannah.json');
const privateKey = "e574b1078d9299dbe809e344c1dcb03faaf286bed223722e1b9b745fb6dcbe58";
const address = "0xD2c92A80834f7f371b99ea4FA7b4Bde8d06d7227";
const bscUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/"
const nodeCron = require("node-cron");

let addresses = [
  { address: '0x03A44c35C7bE896EBDDb45C692b9E5BBF202e545', private_key: 'adef73f41d5057f07fe5c664b7d0b6713dd914205c517822a0c5e59430aecacb', isTransfer: false },
  { address: '0xc668c2078BF6e9BA9613b8C44F691C2D0a0296a2', private_key: 'dea02a0dd5344998c4e9a710fecb5dfcaf085e7a4945b2d33e11a3491a0f12f5', isTransfer: false },
  { address: '0xE04058d499EeBBE36d4750fA1950fC395A49a614', private_key: '30249d2de5789ad67f1c9dd8d8adda71d36c65907b3143d3d59ae0992b09cf52', isTransfer: false },
  { address: '0x73A84f2187DE6DD7672feeaF422EA6F160BADB40', private_key: 'b7dd62a530d186378aec4b387722540ce49523b1bf1d18d84b92af84d8821b43', isTransfer: false },
  { address: '0x2dF595a38A5Ee3F7fCA413bF8C1248893947056F', private_key: 'a25ac3806d2061babab33eac4710f58793ff4663115fe42da4abfbe9d3293226', isTransfer: false },
  { address: '0xe206F4bF543c5207ed7353F23363C366f9e96466', private_key: 'cd36216555b87579a137fe3070f67bd2f34547e5483e03016c4b6384a5b0c347', isTransfer: false },
  { address: '0xd590D8f678EE9d857e23C628CFFAe2B0dcBE3D95', private_key: '44a5d7c260ecdb70fda5911307450006ebd77d4b1a7cba1698e382bb6c1e51b4', isTransfer: false },
  { address: '0x64C9ae50625aBd0D0d54ba36AbCA63D17AB3cA23', private_key: '947f362a71a77b73928e37a16d1bcbf2c762787aa9c56585b5c27d54ab6099ea', isTransfer: false },
  { address: '0x2B6CcFb5Bc224994202F2CF0A43345336c24b139', private_key: '3bbc6cf544ae1e509b1f5b91f27315f0f89d8a1e09a67f433e190834866e2d4b', isTransfer: false },
  { address: '0xeFcBDd3ffB516Bb692e55C43dE465F6ADBf431Aa', private_key: '9580558a959c27755d4f054463ca1c9f6c545d1dd29f72aef43b0b42f6454887', isTransfer: false },
  { address: '0x25Aca51211bcAA266ce06FFb6cd315f38c1B37d6', private_key: '70100ce9e3be505227f9c8337fabbd9ee7991a9c953f10500bb69c18763edfba', isTransfer: false },
]

let i = 0;
let length = addresses.length;
const job = nodeCron.schedule("*/20 * * * * *", async () => {
  try {
    await (transfer(i))
    await (callMethod(i))
    i = i + 1
    if (i >= length) {
      job.stop()
    }
  } catch (err) {
    console.log(err)
  }
})

const providerMain = new Provider(privateKey, bscUrl);
const web3Main = new Web3(providerMain);

const transfer = async (i) => {
  let nonce = await web3Main.eth.getTransactionCount('0xa488d95f9F275869C156e58Ba96b0913557f7A9D', 'pending'); // nonce starts counting from 0
  let transaction = {
    'to': addresses[i].address,
    'value': 100000000000000000,
    'gas': 30000,
    'nonce': nonce,
  };
  let signedTx = await web3Main.eth.accounts.signTransaction(transaction, privateKey);
  await web3Main.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
    if (!error) {
      console.log(" The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
    } else {
      console.log("Something went wrong while submitting your transaction:", error)
    }
  });

}

const callMethod = async (i) => {
  try {
    let provider = new Provider(addresses[i].private_key, bscUrl);
    let web3 = new Web3(provider);
    const myContract = new web3.eth.Contract(
      Coin.abi,
      address
    )
    let res = await myContract.methods.setData(1).send({ from: addresses[i].address })
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

job.start()
