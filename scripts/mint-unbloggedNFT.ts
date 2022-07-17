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
const SAMPLE_TEXT_1 =
  "Russia’s war on Ukraine continues to take an escalating toll on the country. More than 9.1 million people have fled across Ukraine’s borders and more than 7.1 million have been internally displaced since Russia launched a full-scale invasion of the country in early February.";
const SAMPLE_TEXT_2 =
  "This British study of the media's crime reporting traces the history of crime reporting, and discusses the news values and political ideology of the media, the changing relationship between police and other social control agencies, and the difference between free-world and Marxist-controlled media.";
const SAMPLE_TEXT_3 =
  "People’s trust in and views about the importance of the news media vary considerably by country. In general, people in Northern European countries – for example, Sweden and Germany – are more likely than people in Southern European countries, including France, to say the news media are very important and that they trust the news media.";
const SAMPLE_TEXT_4 =
  "The documents she took from the company were carefully and methodically explained - a window into the inner workings of Facebook. It was a stunning moment of theatre - her testimony reverberating around the world.";
let cid_1, cid_2, cid_3, cid_4;

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

  const markdownData_1: MarkdownFileData = {
    filename: "test_1.md",
    markdown: SAMPLE_TEXT_1,
  };
  const markdownData_2: MarkdownFileData = {
    filename: "test_2.md",
    markdown: SAMPLE_TEXT_2,
  };
  const markdownData_3: MarkdownFileData = {
    filename: "test_3.md",
    markdown: SAMPLE_TEXT_3,
  };
  const markdownData_4: MarkdownFileData = {
    filename: "test_4.md",
    markdown: SAMPLE_TEXT_4,
  };
  cid_1 = await storeMarkdown(markdownData_1);
  cid_2 = await storeMarkdown(markdownData_2);
  cid_3 = await storeMarkdown(markdownData_3);
  cid_4 = await storeMarkdown(markdownData_4);

  let tx = await (
    await unbloggedNFT.mint(
      "Test Article 1",
      "Journalism",
      "War",
      "Russia",
      cid_1
    )
  ).wait();

  tx = await (
    await unbloggedNFT.mint(
      "Test Article 2",
      "Journalism",
      "Crime",
      "United Kingdom",
      cid_2
    )
  ).wait();

  tx = await (
    await unbloggedNFT.mint(
      "Test Article 3",
      "Journalism",
      "Politics",
      "France",
      cid_3
    )
  ).wait();

  tx = await (
    await unbloggedNFT.mint(
      "Test Article 4",
      "Whistleblowing",
      "Technology",
      "United States",
      cid_4
    )
  ).wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
