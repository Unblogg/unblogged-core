import { Blob, File, NFTStorage } from "nft.storage";

import MarkdownFileData from "../types/MarkdownFileData";
import { UnbloggedNFT } from "../typechain/contracts/UnbloggedNFT";
import { ethers } from "hardhat";
import getValidMarkdownFilename from "../utils/getValidMarkdownFilename";

require("dotenv").config();
const NFT_STORAGE_TOKEN: string = process.env.NFT_STORAGE_TOKEN
  ? process.env.NFT_STORAGE_TOKEN
  : "your-api-token";

const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
const SAMPLE_TEXT = "Hello World 2";
let cid;

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
async function main() {
  // Just use Hardhat Environment
  const [signer] = await ethers.getSigners();
  const unbloggedNFT: UnbloggedNFT = await ethers.getContract(
    "UnbloggedNFT",
    signer
  );

  const markdownData: MarkdownFileData = {
    filename: "test.md",
    markdown: SAMPLE_TEXT,
  };
  cid = await storeMarkdown(markdownData);
  console.log("🚀 | cid", cid);

  let tx = await (
    await unbloggedNFT.mint("Test Article 2", "Tag 3", "Tag 4", "Tag 5", cid)
  ).wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
