import { UnbloggedNFT } from "../typechain/contracts/UnbloggedNFT";
import { ethers } from "hardhat";

require("dotenv").config();

async function main() {
  // Just use Hardhat Environment
  const [signer] = await ethers.getSigners();
  const unbloggedNFT: UnbloggedNFT = await ethers.getContract(
    "UnbloggedNFT",
    signer
  );

  let tx = await unbloggedNFT.metadataURI();
  console.log("🚀 | main | tx", tx);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
