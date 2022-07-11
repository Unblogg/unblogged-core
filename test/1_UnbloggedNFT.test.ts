import "dotenv/config";

import MarkdownFileData from "../types/MarkdownFileData";
import { UnbloggedNFT } from "../typechain/contracts/UnbloggedNFT";
import { expect } from "chai";
import { pinMarkdown } from "../utils/NFTStorageService";

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

    // Publish Markdown
    const markdownData: MarkdownFileData = {
      filename: "test.md",
      markdown: "Hello World",
    };
    this.cid = await pinMarkdown(markdownData);
    console.log("🚀 | cid", this.cid);
  });

  it("Should Mint", async function () {
    await unbloggedNFT.mint(
      "Test Article",
      "Tag 1",
      "Tag 2",
      "Tag 3",
      this.cid
    );

    expect(await unbloggedNFT.balanceOf(owner.address)).to.equal(1);
  });

  it("Should Not Double Mint", async function () {
    await expect(
      unbloggedNFT.mint("Test Article", "Tag 1", "Tag 2", "Tag 3", this.cid)
    ).to.be.revertedWith("UnbloggedNFT: CID has already been minted!");
  });

  it("Should return metadataURI", async function () {
    let metadataURI = await unbloggedNFT.metadataURI();
    console.log("🚀 | metadataURI", metadataURI);
  });

  it("Should return tokenURI", async function () {
    let tokenURI = await unbloggedNFT.tokenURI(0);
    console.log("🚀 | tokenURI", tokenURI);
  });
});
