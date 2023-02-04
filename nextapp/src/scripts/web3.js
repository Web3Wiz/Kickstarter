import Web3 from "web3";
require("dotenv").config({ path: ".env" });

async function initWeb3() {
  let localWeb3 = null;
  console.log("1");
  if (typeof window !== "undefined" && window.ethereum) {
    //We are in browser and metamask is running
    console.log("2");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("3");
    localWeb3 = new Web3(window.ethereum);
    console.log("4");
  } else {
    console.log("5");
    //We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
      process.env.QUICKNODE_HTTP_URL
    );
    console.log("6");
    localWeb3 = new Web3(provider);
    console.log("7");
  }
  console.log("8");
  return localWeb3;
}

export const web3 = await initWeb3();
