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

app.get("/balances/:address", async (req, res) => {
	console.log("Balances endpoint hit");
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
			tokens: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "0xdac17f958d2ee523a2206206994597c13d831ec7"], // USDC, USDT
		};
		const response = await axios.post(url, body, config);
		console.log(response.data);
		res.json({ data: response.data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "error", message: "Internal server error!" });
	}
});
