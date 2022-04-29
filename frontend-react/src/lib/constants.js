const DERPIES_ADDRESS_LOCALHOST = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const DERPIES_ADDRESS_RINKEBY = "0x5A645382133432b61c2e069de386Bb1364E74aFe"; // old contract
// const DERPIES_ADDRESS_RINKEBY = "0xae454458411B5edc9BFf4293826A39433e1c1Fa2"; // old contract
const DERPIES_ADDRESS_RINKEBY = "0x102c9D7F69942aCD874Ff7da9554cE3F8C73BB68";
const DERPIES_ADDRESS_MAINNET = "0x833696cc64e68A7cf5A045256420bF7dF3bA8bB6";

const deploymentOptions = ["localhost", "rinkeby", "mainnet"];
const DEPLOY_TO = deploymentOptions[2]; // change this for localhost vs testnet vs mainnet

export let DERPIES_ADDRESS;
export let CORRECT_CHAIN_ID;
export let OPENSEA_URL;
export let ETHERSCAN_URL;
if (DEPLOY_TO === deploymentOptions[0]) {
  // localhost
  DERPIES_ADDRESS = DERPIES_ADDRESS_LOCALHOST;
  CORRECT_CHAIN_ID = "0x539"; // 1337
  OPENSEA_URL = "#";
  ETHERSCAN_URL = "#";
} else if (DEPLOY_TO === deploymentOptions[1]) {
  // rinkeby
  DERPIES_ADDRESS = DERPIES_ADDRESS_RINKEBY;
  CORRECT_CHAIN_ID = "0x4"; // 4
  OPENSEA_URL = "https://testnets.opensea.io";
  ETHERSCAN_URL = "https://rinkeby.etherscan.io";
} else if (DEPLOY_TO === deploymentOptions[2]) {
  // mainnet
  DERPIES_ADDRESS = DERPIES_ADDRESS_MAINNET;
  CORRECT_CHAIN_ID = "0x1"; // 1
  OPENSEA_URL = "https://opensea.io";
  ETHERSCAN_URL = "https://etherscan.io";
}

export const DERPIE_PRICE_IN_ETH = 0.01;

export const MESSAGE_DELAY_MS = 5000; // add css to show countdown
