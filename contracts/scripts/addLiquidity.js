const hre = require("hardhat");

// Replace with actual contract addresses
const poolAddress = '0xb2C364963022ef045Fb87C62B22d2D1932E46682';
const amountA = '1000';
const amountB = '1000';
const shouldMintFirst = true;

async function getTokenContract(tokenAddress, signer) {
    return await hre.ethers.getContractAt("ERC20Mock", tokenAddress, signer);
}

async function mintToken(token, amount) {
    const tx = await token.mint(hre.ethers.parseEther(amount));

    await tx.wait();

    console.log(`Minting token[${token.target}] complete`)
}

async function approve(token, poolAddress, amount) {
    const tx = await token.approve(poolAddress, hre.ethers.parseEther(amount));

    await tx.wait();

    console.log(`Approving token[${token.target}] complete`)
}

async function addLiquidity() {
    const [deployer] = await hre.ethers.getSigners();
    const Pool = await hre.ethers.getContractAt("Pool", poolAddress, deployer);

    const [token0Address, token1Address] = [await Pool.token0(), await Pool.token1()];

    const token0 = await getTokenContract(token0Address, deployer);
    const token1 = await getTokenContract(token1Address, deployer);

    if(shouldMintFirst) {
        await mintToken(token0, amountA);
        await mintToken(token1, amountB);
    }

    //await approve(token0, Pool.target, amountA);
    //await approve(token1, Pool.target, amountB);

    const [tx1, tx2] = [
        await token0.transfer(Pool.target, hre.ethers.parseEther(amountA)), 
        await token1.transfer(Pool.target, hre.ethers.parseEther(amountB))
    ];
    await Promise.all([tx1.wait(), tx2.wait()]);

    await Pool.mint(deployer.address);

    console.log('Liquidity added successfully!');
}

addLiquidity().catch((error) => {
    console.error('Error:', error);
});