const { expect } = require("chai");

describe("Pool", function () {
    let pool;
    let factory;
    let appleToken;
    let bananaToken;
    let deployer, user1, user2;

    beforeEach(async function () {
        [deployer, user1, user2] = await ethers.getSigners();

        // Deploy mocks
        const Token = await ethers.getContractFactory("ERC20Mock");
        appleToken = await Token.connect(deployer).deploy("Apple Token", "APL");
        await appleToken.waitForDeployment();
        await appleToken.connect(deployer).mint(ethers.parseEther("1000000"));
        bananaToken = await Token.connect(deployer).deploy("Banana Token", "BNN");
        await bananaToken.waitForDeployment();
        await bananaToken.connect(deployer).mint(ethers.parseEther("1000000"));

        // Deploy factory
        const Factory = await ethers.getContractFactory("Factory");
        factory = await Factory.connect(deployer).deploy();
        await factory.waitForDeployment();

        // Create pool
        await factory.connect(deployer).createPool(appleToken.target, bananaToken.target);
        const poolAddress = await factory.poolsMap(appleToken.target, bananaToken.target);
        const Pool = await ethers.getContractFactory("Pool");
        pool = Pool.attach(poolAddress);

        // Approve tokens for pool
        await appleToken.connect(deployer).approve(pool.target, ethers.MaxUint256);
        await bananaToken.connect(deployer).approve(pool.target, ethers.MaxUint256);

        // Mint user tokens
        await appleToken.connect(user1).mint(ethers.parseEther("20"));
        await bananaToken.connect(user2).mint(ethers.parseEther("20"));
    });

    const addLiquidity = async (amountA, amountB) => {
        await appleToken.transfer(pool.target, amountA);
        await bananaToken.transfer(pool.target, amountB);
        await pool.mint(deployer.address);
    };

    describe("Minting", function () {
        it("should mint liquidity tokens", async function () {
            const amountA = ethers.parseEther("100");
            const amountB = ethers.parseEther("100");

            await addLiquidity(amountA, amountB);

            const liquidityBalance = await pool.balanceOf(deployer.address);
            expect(liquidityBalance).to.be.gt(0);
        });
    });

    describe("Burning", function () {
        it("should burn liquidity tokens and return underlying assets", async function () {
            // Mint some LP token
            const amountA = ethers.parseEther("100");
            const amountB = ethers.parseEther("100");
            await addLiquidity(amountA, amountB);

            const liquidityBalance = await pool.balanceOf(deployer.address);

            // Now burn users LP token
            await pool.transfer(pool.target, liquidityBalance);
            await pool.burn(deployer.address);

            const newLiquidityBalance = await pool.balanceOf(deployer.address);
            expect(newLiquidityBalance).to.equal(0);

            // Check if tokens were returned
            const tokenABalance = await appleToken.balanceOf(deployer.address);
            const tokenBBalance = await bananaToken.balanceOf(deployer.address);
            expect(tokenABalance).to.be.gt(0);
            expect(tokenBBalance).to.be.gt(0);
        });
    });

    describe("Swapping", function () {
        beforeEach(async function () {
            const amountA = ethers.parseEther("1000");
            const amountB = ethers.parseEther("1000");
            await addLiquidity(amountA, amountB);
        });

        it("should swap Apple for Banana", async function () {
            const swapAmount = ethers.parseEther("10");
            await appleToken.connect(user1).approve(pool.target, swapAmount);

            const initialBalanceB = await bananaToken.balanceOf(user1.address);

            await appleToken.connect(user1).transfer(pool.target, swapAmount);

            await pool.connect(user1).swap(0, ethers.parseEther("9"), user1.address);

            const finalBalanceB = await bananaToken.balanceOf(user1.address);
            expect(finalBalanceB).to.be.gt(initialBalanceB);
        });

        it("should swap Banana for Apple", async function () {
            const swapAmount = ethers.parseEther("10");
            await bananaToken.connect(user2).approve(pool.target, swapAmount);

            const initialBalanceA = await appleToken.balanceOf(user2.address);

            await bananaToken.connect(user2).transfer(pool.target, swapAmount);

            await pool.connect(user2).swap(ethers.parseEther("9"), 0, user2.address);

            const finalBalanceA = await appleToken.balanceOf(user2.address);
            expect(finalBalanceA).to.be.gt(initialBalanceA);
        });

        it("should revert when trying to swap more than reserves", async function () {
            const swapAmount = ethers.parseEther("1001");
            await appleToken.connect(user1).approve(pool.target, swapAmount);
            await appleToken.transfer(user1.address, swapAmount);

            await expect(pool.connect(user1).swap(0, swapAmount, user1.address))
                .to.be.revertedWithCustomError(pool, "Swap_InsufficientLiquidity");
        });

        it("should maintain the correct K value after swap", async function () {
            const swapAmount = ethers.parseEther("10");
            await appleToken.connect(user1).approve(pool.target, swapAmount);
            await appleToken.connect(user1).transfer(pool.target, swapAmount);
    
            const [initialReserve0, initialReserve1] = await pool.getReserves();
            const initialK = initialReserve0 * initialReserve1;
    
            await pool.connect(user1).swap(0, ethers.parseEther("9"), user1.address);
    
            const [finalReserve0, finalReserve1] = await pool.getReserves();
            const finalK = finalReserve0 * finalReserve1;
    
            expect(finalK).to.be.gte(initialK);
        });

        it("should revert on incorrect K value after swap", async function () {
            const swapAmount = ethers.parseEther("10");
            await appleToken.connect(user1).approve(pool.target, swapAmount);
            await appleToken.connect(user1).transfer(pool.target, swapAmount);
        
            const ExcessiveOutput = ethers.parseEther("11"); 
        
            await expect(
                pool.connect(user1).swap(0, ExcessiveOutput, user1.address)
            ).to.be.reverted;
        });
    });

    describe("Price Oracle", function () {
        it("should update price accumulators", async function () {
            const amountA = ethers.parseEther("1000");
            const amountB = ethers.parseEther("1000");
            await addLiquidity(amountA, amountB);

            const initialPrice0 = await pool.price0CumulativeLast();
            const initialPrice1 = await pool.price1CumulativeLast();

            // Simulate time passing
            await network.provider.send("evm_increaseTime", [3600]);
            await network.provider.send("evm_mine");

            // Call sync
            await pool.sync();

            const finalPrice0 = await pool.price0CumulativeLast();
            const finalPrice1 = await pool.price1CumulativeLast();

            expect(finalPrice0).to.be.gt(initialPrice0);
            expect(finalPrice1).to.be.gt(initialPrice1);
        });
    });
});
