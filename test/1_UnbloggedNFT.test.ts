import "dotenv/config";

import { Blob, File, NFTStorage } from "nft.storage";

import { BigNumber } from "ethers";
import MarkdownFileData from "../types/MarkdownFileData";
import { UnbloggedNFT } from "../typechain/contracts/UnbloggedNFT";
import { expect } from "chai";
import getValidMarkdownFilename from "../utils/getValidMarkdownFilename";

const { ethers, deployments } = require("hardhat");

const NFT_STORAGE_TOKEN: string = process.env.NFT_STORAGE_TOKEN
  ? process.env.NFT_STORAGE_TOKEN
  : "your-api-token";
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
const SAMPLE_TEXT = "Hello World";
let cid: string;

const storeMarkdown = async ({
  filename,
  markdown,
}: MarkdownFileData): Promise<string> => {
  const file = new File(
    [Buffer.from(markdown)],
    getValidMarkdownFilename(filename)
  );
  return await client.storeBlob(file);
};

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
      markdown: SAMPLE_TEXT,
    };
    cid = await storeMarkdown(markdownData);
    console.log("🚀 | cid", cid);
  });

  it("Should Mint", async function () {
    await unbloggedNFT.mint("Test Article", "Tag 1", "Tag 2", "Tag 3", cid);

    expect(await unbloggedNFT.balanceOf(owner.address)).to.equal(1);
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
