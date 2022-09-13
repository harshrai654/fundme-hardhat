const { networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
	const { deploy, log, get } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId;

	let ethUsdPriceFeedAddress;

	if (networkConfig[chainId].priceFeedAddress) {
		ethUsdPriceFeedAddress = networkConfig[chainId].priceFeedAddress;
	} else {
		const ethUsdAggregator = await get("MockV3Aggregator");
		ethUsdPriceFeedAddress = ethUsdAggregator.address;
	}

	const args = [ethUsdPriceFeedAddress];
	const fundMe = await deploy("FundMe", {
		from: deployer,
		args,
		log: true,
		waitConfirmations: network.config.waitBlockConfirmation,
	});

	if (networkConfig[chainId].priceFeedAddress) {
		await verify(fundMe.address, args);
	}

	log("---------------------------------");
};

module.exports.tags = ["all", "fundme"];
