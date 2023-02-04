import { web3 } from "./web3";
import compiledFactory from "../../../hardhat/build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  compiledFactory.abi,
  "0x44B41b805eee631093dBBcA0CBA375294d3123a3"
);

export default instance;
