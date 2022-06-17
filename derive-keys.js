// derives keys from a new or existing (provided via ENV var) mnemonic
// usage: [MNEMONIC="abcd ..."] node derive-keys.js [offset]
//   If MNEMONIC is not set, a new mnemonic will be created and derived from
//   If BASEPATH is set, it's used instead of m/44'/60'/0'/0/

const Web3 = require("web3");
const bip39 = require("bip39");
const { hdkey } = require("ethereumjs-wallet");

const wallet_hdpath = process.env.BASEPATH || "m/44'/60'/0'/0/";
let mnemonic = process.env.MNEMONIC;

if (mnemonic === undefined) {
    console.log("!!! no mnemonic provided, generating a random one !!!");
    mnemonic = bip39.generateMnemonic();
}

const offset = process.argv[2] || 0;
console.log(`Using mnemonic: ${mnemonic}`);

(async function() {
if(!bip39.validateMnemonic(mnemonic)) throw new Error("Invalid mnemonic");
const seed = await bip39.mnemonicToSeed(mnemonic);
const hdwallet = hdkey.fromMasterSeed(seed);
for (let i = parseInt(offset); i < parseInt(offset) + 20; i++) {
    const path = wallet_hdpath + i;
    var wallet = hdwallet.derivePath(path).getWallet();
    var addr = '0x' + wallet.getAddress().toString('hex');
    console.log(i, path, addr, "0x" + wallet.getPrivateKey().toString('hex'));
}})()
