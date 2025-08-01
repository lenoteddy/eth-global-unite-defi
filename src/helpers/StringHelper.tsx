const shortAddress = (address: string, startLength: number = 6, endLength: number = 4) => {
	if (!address || address.length < startLength + endLength + 2) return address;
	return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

const tokenAddressName = (address: string) => {
	const list: { [key: string]: string } = {
		"0xdac17f958d2ee523a2206206994597c13d831ec7": "USDT",
		"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USDC",
	};

	return list[address];
};

const tokenAddressValue = (address: string, amount: number) => {
	const list: { [key: string]: number } = {
		"0xdac17f958d2ee523a2206206994597c13d831ec7": 6,
		"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": 6,
	};

	return amount / Math.pow(10, list[address]);
};

const StringHelper = {
	shortAddress,
	tokenAddressName,
	tokenAddressValue,
};

export default StringHelper;
