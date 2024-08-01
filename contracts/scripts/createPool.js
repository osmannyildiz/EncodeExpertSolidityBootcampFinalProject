const hre = require("hardhat");

// Replace with actual contract addresses
const factoryAddress = '0x36b58F5C1969B7b6591D752ea6F5486D069010AB';
const token1Address = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
const token2Address = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';

async function createPool() {
    const [deployer] = await hre.ethers.getSigners();
    const Factory = await hre.ethers.getContractAt("Factory", factoryAddress, deployer);

    const tx = await Factory.createPool(token1Address, token2Address);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log('Pool created successfully!', receipt);
}

createPool().catch((error) => {
    console.error('Error:', error);
});