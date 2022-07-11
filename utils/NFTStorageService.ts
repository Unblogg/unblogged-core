import "dotenv/config";

import { Blob, File, NFTStorage } from "nft.storage";

import MarkdownFileData from "../types/MarkdownFileData";
import getValidMarkdownFilename from "./getValidMarkdownFilename";

const NFT_STORAGE_TOKEN: string = process.env.NFT_STORAGE_TOKEN
  ? process.env.NFT_STORAGE_TOKEN
  : "your-api-token";
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

export async function pinMarkdown({
  filename,
  markdown,
}: MarkdownFileData): Promise<string> {
  const file = new File(
    [Buffer.from(markdown)],
    getValidMarkdownFilename(filename)
  );
  return await client.storeBlob(file);
}
