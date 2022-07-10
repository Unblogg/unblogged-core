import { GasLogger } from "../utils/helper";
import { ethers } from "hardhat";

require("dotenv").config();
const gasLogger = new GasLogger();

module.exports = async ({ getNamedAccounts, deployments, getChainId }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Config
  console.log(`Deploying UnbloggedNFT Contract... from ${deployer}`);
  let registry: string = "0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68";
  let defaultImage: string =
    "ipfs://bafkreicbxyxbbip2ustrh7vp6ce565jyt5wnsid3bmrnbor7ngsqpe7fqu";

  if (chainId === "80001") {
    registry = "0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68";
  } else {
    // Get locally deployed TablelandTables contract address
    registry = (await ethers.getContract("TablelandTables")).address;
  }
  console.log("🚀 | module.exports= | registry", registry);

  let unbloggedNFT = await deploy("UnbloggedNFT", {
    from: deployer,
    args: [registry, defaultImage],
  });

  gasLogger.addDeployment(unbloggedNFT);
};

module.exports.tags = ["UnbloggedNFT"];
