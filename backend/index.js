require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 3000;
const { API_KEY, FO_URL } = process.env;

app.use(
	express.json(),
	express.urlencoded({ extended: true }),
	cors({
		origin: FO_URL || "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE,OPTIONS",
		allowedHeaders: "Content-Type,Authorization,x-app-token",
	})
);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

app.get("/gas", async (_, res) => {
	try {
		const url = "https://api.1inch.dev/gas-price/v1.6/1";
		const config = {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			params: {},
			paramsSerializer: {
				indexes: null,
			},
		};
		const response = await axios.get(url, config);
		res.json({ data: response.data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "error", message: "Internal server error!" });
	}
});

app.post("/balances/:address", async (req, res) => {
	try {
		const url = `https://api.1inch.dev/balance/v1.2/1/balances/${req.params.address}`;
		const config = {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			params: {},
			paramsSerializer: {
				indexes: null,
			},
		};
		const body = {
			tokens: ["0xdac17f958d2ee523a2206206994597c13d831ec7", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"], // USDC, USDT
		};
		const response = await axios.post(url, body, config);
		res.json({ data: response.data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "error", message: "Internal server error!" });
	}
});

app.post("/history/:address", async (req, res) => {
	try {
		const { from, to, token } = req.body;
		const url = `https://api.1inch.dev/history/v2.0/history/${req.params.address}/events`;
		const config = {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			params: {},
			paramsSerializer: {
				indexes: null,
			},
		};
		const body = {
			filter: {
				from_time_ms: from,
				to_time_ms: to,
				chain_ids: ["1"],
				transaction_types: ["Receive"],
				token_addresses: [token],
				limit: 100,
			},
		};
		const response = await axios.post(url, body, config);
		res.json({ data: response.data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "error", message: "Internal server error!" });
	}
});
