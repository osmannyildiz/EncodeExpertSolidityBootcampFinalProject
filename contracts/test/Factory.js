const { expect } = require("chai");

describe("Factory and Pool", function () {
    let factory;
    let tokenA;
    let tokenB;
    let deployer;

    beforeEach(async function () {
        [deployer] = await ethers.getSigners();
        const Factory = await ethers.getContractFactory("Factory");
        factory = await Factory.connect(deployer).deploy();
        await factory.waitForDeployment();

        const Token = await ethers.getContractFactory("ERC20Mock");
        tokenA = await Token.connect(deployer).deploy("Token A", "TKA", 1000000);
        await tokenA.waitForDeployment();
        tokenB = await Token.connect(deployer).deploy("Token B", "TKB", 1000000);
        await tokenB.waitForDeployment();
    })

    it("should deploy the factory contract", async function () {
        expect(factory.target).to.be.properAddress;
    });

    it("should create a new pool", async function () {
        await factory.connect(deployer).createPool(tokenA.target, tokenB.target);
        const pools = await factory.getPools();
        expect(pools.length).to.equal(1);

        const poolAddress = await factory.poolsMap(tokenA.target, tokenB.target);
        expect(poolAddress).to.be.properAddress; 
    })
})