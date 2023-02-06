import Web3 from "web3";
require("dotenv").config({ path: ".env" });

async function initWeb3() {
  let localWeb3 = null;
  if (typeof window !== "undefined" && window.ethereum) {
    //We are in browser and metamask is running
    await window.ethereum.request({ method: "eth_requestAccounts" });
    localWeb3 = new Web3(window.ethereum);
  } else {
    //We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
      process.env.QUICKNODE_HTTP_URL
    );
    localWeb3 = new Web3(provider);
  }
  return localWeb3;
}

export const web3 = await initWeb3();
