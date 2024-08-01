const hre = require("hardhat");

async function main() {
    // Deploying the MockERC20 contract
    const MockERC20 = await hre.ethers.getContractFactory("ERC20Mock");
    const [deployer] = await hre.ethers.getSigners();

    const token1 = await MockERC20.deploy("Token 1", "TKN1");
    await token1.waitForDeployment();

    const token2 = await MockERC20.deploy("Token 2", "TKN2");
    await token2.waitForDeployment();

    const token3 = await MockERC20.deploy("Token 3", "TKN3");
    await token3.waitForDeployment();

    const token4 = await MockERC20.deploy("Token 4", "TKN4");
    await token4.waitForDeployment();

    console.log("Tokens deployed:");
    console.log("Token 1:", token1.target);
    console.log("Token 2:", token2.target);
    console.log("Token 3:", token3.target);
    console.log("Token 4:", token4.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});