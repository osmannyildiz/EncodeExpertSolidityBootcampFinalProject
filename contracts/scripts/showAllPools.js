const hre = require("hardhat");

// Replace with actual contract addresses
const factoryAddress = '0x36b58F5C1969B7b6591D752ea6F5486D069010AB';

async function showAllPools() {
    const [deployer] = await hre.ethers.getSigners();
    const Factory = await hre.ethers.getContractAt("Factory", factoryAddress, deployer);

    const pools = await Factory.getPools();

    console.log(pools);
}

showAllPools().catch((error) => {
    console.error('Error:', error);
});