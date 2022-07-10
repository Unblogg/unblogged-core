import { BigNumber } from "ethers";
import { UnbloggedNFT } from "../typechain/contracts/UnbloggedNFT";
import { expect } from "chai";

const { ethers, deployments } = require("hardhat");

describe("UnbloggedNFT", function () {
  let owner: any;
  let unbloggedNFT: UnbloggedNFT;

  before(async function () {
    // Get Signers
    [owner] = await ethers.getSigners();

    // Setup Test
    await deployments.fixture(["TablelandTables", "UnbloggedNFT"]);
    unbloggedNFT = await ethers.getContract("UnbloggedNFT", owner);
  });

  it("Should Mint", async function () {});

  it("Should return metadataURI", async function () {});

  it("Should return tokenURI", async function () {});
});
