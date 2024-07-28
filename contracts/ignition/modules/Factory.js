const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FactoryModule", (m) => {
	const factory = m.contract("Factory");

	return { factory };
});
