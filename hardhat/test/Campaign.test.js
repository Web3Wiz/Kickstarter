const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../build/CampaignFactory.json");
const compiledCampaign = require("../build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1500000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1500000" });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaign", () => {
  it("deploys the CampaignFactory and Campaign contracts", async () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });
  it("allows people to contribute and marks them as approvers", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "200" });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });
  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ from: accounts[1], value: "50" });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Build website", 999999, accounts[2])
      .send({ from: accounts[0], gas: "1500000" });
    const request = await campaign.methods.requests(0).call();
    assert(request.description, "Build website");
  });
  it("processes requests", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "200" });
    assert.equal(await web3.eth.getBalance(campaign.options.address), "200");

    await campaign.methods
      .createRequest("Build website", "200", accounts[2])
      .send({ from: accounts[0], gas: "1500000" });
    let request = await campaign.methods.requests(0).call();
    assert.equal(request.description, "Build website");

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[1], gas: "1500000" });
    request = await campaign.methods.requests(0).call();
    assert.equal(request.approvalsCount, 1);

    let recepientOriginalBalance = await web3.eth.getBalance(accounts[2]);
    console.log("recepientOriginalBalance", recepientOriginalBalance);

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1500000" });

    let recepientFinalizedBalance = await web3.eth.getBalance(accounts[2]);
    console.log("recepientFinalizedBalance", recepientFinalizedBalance);

    assert.equal(
      parseInt(recepientFinalizedBalance),
      parseInt(recepientOriginalBalance) + 200
    );

    request = await campaign.methods.requests(0).call();
    assert(request.complete);
  });
});
