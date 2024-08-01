const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockTokensModule", (m) => {
	const tokenA = m.contract("TokenA");
	const tokenB = m.contract("TokenB");
	const tokenC = m.contract("TokenC");

	return { tokenA, tokenB, tokenC };
});
