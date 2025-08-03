import axios from "axios";

const API_URL = "http://localhost:3000";

const getNetworkGas = async () => {
	const { data } = await axios.get(`${API_URL}/gas`);
	return data;
};

const getWalletBalances = async ({ address }: { address: string }) => {
	if (!address) return [];
	const { data } = await axios.post(`${API_URL}/balances/${address}`);
	return data;
};

const getCheckPayment = async ({ address, from, to, token }: { address: string; from: number; to: number; token: string }) => {
	if (!address) return [];
	const { data } = await axios.post(`${API_URL}/history/${address}`, { from, to, token });
	return data;
};

const APIHelper = {
	getNetworkGas,
	getWalletBalances,
	getCheckPayment,
};

export default APIHelper;
