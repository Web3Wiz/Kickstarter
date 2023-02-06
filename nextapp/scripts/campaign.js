import react from "react";
import compiledCampaign from "../../../hardhat/build/Campaign.json";
import { web3 } from "./web3";

export default (address) => {
  return new web3.eth.Contract(compiledCampaign.abi, address);
};
