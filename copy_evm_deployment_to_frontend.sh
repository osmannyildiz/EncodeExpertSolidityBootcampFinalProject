rm ./frontend/src/evm-deployment/*

cp "./contracts/ignition/deployments/chain-31337/deployed_addresses.json" "./frontend/src/evm-deployment/deployed_addresses.json"

cp "./contracts/artifacts/contracts/Factory.sol/Factory.json" "./frontend/src/evm-deployment/Factory.json"

cp "./contracts/artifacts/contracts/Pool.sol/Pool.json" "./frontend/src/evm-deployment/Pool.json"

cp "./contracts/artifacts/contracts/ERC20Mock.sol/ERC20Mock.json" "./frontend/src/evm-deployment/ERC20Mock.json"
