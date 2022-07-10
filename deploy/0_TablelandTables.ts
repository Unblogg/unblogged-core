/**
 * Deploy Script for Tableland Tables (LOCAL TESTING ONLY)
 */

import { GasLogger } from "../utils/helper";
import { ethers } from "hardhat";

require("dotenv").config();
const gasLogger = new GasLogger();

module.exports = async ({ getNamedAccounts, deployments, getChainId }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Config
  console.log(`Deploying TablelandTables Contract... from ${deployer}`);

  let tableAndTables = await deploy("TablelandTables", {
    from: deployer,
    proxy: {
      owner: deployer,
      proxyContract: "OptimizedTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: ["http://localhost:8080/chain/31337/tables/"],
        },
      },
    },
  });

  gasLogger.addDeployment(tableAndTables);
};

module.exports.tags = ["TablelandTables"];
