import { ConnectKitButton } from "connectkit";
import Logo from "./assets/logo.webp";
import { useEffect, useMemo, useState } from "react";
import APIHelper from "./helpers/APIHelper";
import { useAccount } from "wagmi";
import StringHelper from "./helpers/StringHelper";
import { PDFViewer } from "@react-pdf/renderer";
import PDFDocument from "./components/PDFDocument";

type FeeLevel = {
	maxPriorityFeePerGas: string;
	maxFeePerGas: string;
};

type FeeData = {
	baseFee: string;
	low: FeeLevel;
	medium: FeeLevel;
	high: FeeLevel;
	instant: FeeLevel;
};

type InvoiceProps = {
	invoiceTimestamp: number;
	invoiceName: string;
	invoiceCustomerLabel: string;
	invoiceCustomerName: string;
	invoiceNumber: string;
	invoiceDate: string;
	invoiceDueDate: string;
	invoiceCurrency: string;
	invoiceWallet: string;
	invoiceItemDescription: string;
	invoiceItemPrice: number;
	invoiceItemQty: number;
};

const GasFeeInfo = ({ gasFee }: { gasFee: FeeData | undefined }) => {
	return (
		<div className="p-4 rounded-xl bg-white">
			<div className="pb-4 font-semibold">⛽️ Base Fee: {(Number(gasFee?.baseFee) / Math.pow(10, 9)).toFixed(3) + "gwei"}</div>
			<div className="flex items-center text-sm text-center font-bold">
				<div className="w-30">Gas option</div>
				<div className="w-40">Max fee</div>
			</div>
			<div className="mt-2 flex items-center text-sm">
				<div className="w-30">⚡️ Instant</div>
				<div className="w-40">
					<div>{(Number(gasFee?.instant?.maxFeePerGas) / Math.pow(10, 9)).toFixed(3) + "gwei"}</div>
					<div className="italic">Priority: {Number(gasFee?.instant?.maxPriorityFeePerGas) / Math.pow(10, 9) + "gwei"}</div>
				</div>
			</div>
			<div className="mt-2 flex items-center text-sm">
				<div className="w-30">🐢 Low</div>
				<div className="w-40">
					<div>{(Number(gasFee?.low?.maxFeePerGas) / Math.pow(10, 9)).toFixed(3) + "gwei"}</div>
					<div className="italic">Priority: {Number(gasFee?.low?.maxPriorityFeePerGas) / Math.pow(10, 9) + "gwei"}</div>
				</div>
			</div>
			<div className="mt-2 flex items-center text-sm">
				<div className="w-30">🦊 Medium</div>
				<div className="w-40">
					<div>{(Number(gasFee?.medium?.maxFeePerGas) / Math.pow(10, 9)).toFixed(3) + "gwei"}</div>
					<div className="italic">Priority: {Number(gasFee?.medium?.maxPriorityFeePerGas) / Math.pow(10, 9) + "gwei"}</div>
				</div>
			</div>
			<div className="mt-2 flex items-center text-sm">
				<div className="w-30">🦍 High</div>
				<div className="w-40">
					<div>{(Number(gasFee?.high?.maxFeePerGas) / Math.pow(10, 9)).toFixed(3) + "gwei"}</div>
					<div className="italic">Priority: {Number(gasFee?.high?.maxPriorityFeePerGas) / Math.pow(10, 9) + "gwei"}</div>
				</div>
			</div>
		</div>
	);
};

const DashboardMenu = ({ address }: { address: string | undefined }) => {
	const [balances, setBalances] = useState([]);

	// const
	useEffect(() => {
		if (address !== undefined) {
			(async () => {
				try {
					const { data } = await APIHelper.getWalletBalances({ address });
					setBalances(data);
				} catch (e) {
					console.error(e);
				}
			})();
		}
	}, [address]);

	return (
		<div>
			<h2 className="text-2xl font-semibold">Dashboard</h2>
			<p className="mt-2 mb-4 italic">
				Welcome to PaperMint!
				<br />
				It enable everyone to manage crypto invoicing easily, powered by 1inch 🚀
			</p>
			<div className="mt-2">
				<div>Token Balances:</div>
				<ul className="pl-4 list-disc">
					{Object.entries(balances).map(([key, val]) => (
						<li key={key}>
							{val / Math.pow(10, StringHelper.tokenAddressDecimal(key))} {StringHelper.tokenAddressName(key)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

const CreateInvoiceMenu = ({ address }: { address: string | undefined }) => {
	const [showInvoice, setShowInvoice] = useState(false);
	const [invoiceName, setInvoiceName] = useState("");
	const [invoiceCustomerName, setInvoiceCustomerName] = useState("");
	const [invoiceCustomerLabel, setInvoiceCustomerLabel] = useState("");
	const [invoiceNumber, setInvoiceNumber] = useState("");
	const [invoiceDate, setInvoiceDate] = useState("");
	const [invoiceDueDate, setInvoiceDueDate] = useState("");
	const [invoiceWallet, setInvoiceWallet] = useState("");
	const [invoiceCurrency, setInvoiceCurrency] = useState("");
	const [invoiceItemDescription, setInvoiceItemDescription] = useState("");
	const [invoiceItemPrice, setInvoiceItemPrice] = useState<number>(0);
	const [invoiceItemQty, setInvoiceItemQty] = useState<number>(0);
	const invoiceItemTotal = useMemo(() => {
		return invoiceItemPrice * invoiceItemQty;
	}, [invoiceItemPrice, invoiceItemQty]);

	const setSaveInvoice = () => {
		const currentTime = new Date().getTime();
		const invoice = {
			invoiceTimestamp: currentTime,
			invoiceName,
			invoiceCustomerName,
			invoiceCustomerLabel,
			invoiceNumber,
			invoiceDate,
			invoiceDueDate,
			invoiceWallet,
			invoiceCurrency,
			invoiceItemDescription,
			invoiceItemPrice,
			invoiceItemQty,
		};
		localStorage.setItem("invoiceData", JSON.stringify(invoice));
		alert("Invoice Data has been saved");
	};

	useEffect(() => {
		if (address) {
			setInvoiceWallet(address);
			const invoiceData = localStorage.getItem("invoiceData");
			if (invoiceData) {
				const invoice: InvoiceProps = JSON.parse(invoiceData);
				setInvoiceName(invoice.invoiceName);
				setInvoiceCustomerName(invoice.invoiceCustomerName);
				setInvoiceCustomerLabel(invoice.invoiceCustomerLabel);
				setInvoiceNumber(invoice.invoiceNumber);
				setInvoiceDate(invoice.invoiceDate);
				setInvoiceDueDate(invoice.invoiceDueDate);
				setInvoiceWallet(invoice.invoiceWallet);
				setInvoiceCurrency(invoice.invoiceCurrency);
				setInvoiceItemDescription(invoice.invoiceItemDescription);
				setInvoiceItemPrice(invoice.invoiceItemPrice);
				setInvoiceItemQty(invoice.invoiceItemQty);
			}
		}
	}, [address]);

	return (
		<div>
			<h2 className="mb-3 text-2xl font-semibold">Create Invoice</h2>
			<div className="mb-1 grid grid-cols-3 gap-4">
				<div>
					<label className="text-sm font-semibold">Your Name</label>
					<input type="text" className="w-full px-2 border-2 rounded-xl" placeholder="Your name..." value={invoiceName} onChange={(e) => setInvoiceName(e.target.value)} />
				</div>
				<div>
					<label className="text-sm font-semibold">Customer Name</label>
					<input
						type="text"
						className="w-full px-2 border-2 rounded-xl"
						placeholder="Customer name..."
						value={invoiceCustomerName}
						onChange={(e) => setInvoiceCustomerName(e.target.value)}
					/>
				</div>
				<div>
					<label className="text-sm font-semibold">Customer Label</label>
					<input
						type="text"
						className="w-full px-2 border-2 rounded-xl"
						placeholder="Customer label..."
						value={invoiceCustomerLabel}
						onChange={(e) => setInvoiceCustomerLabel(e.target.value)}
					/>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-4">
				<div>
					<label className="text-sm font-semibold">Invoice No</label>
					<input type="text" className="w-full px-2 border-2 rounded-xl" placeholder="Invoice no..." value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
				</div>
				<div>
					<label className="text-sm font-semibold">Invoice Date</label>
					<input type="date" className="w-full px-2 border-2 rounded-xl" placeholder="Invoice date..." value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
				</div>
				<div>
					<label className="text-sm font-semibold">Invoice Due Date</label>
					<input type="date" className="w-full px-2 border-2 rounded-xl" placeholder="Invoice due date..." value={invoiceDueDate} onChange={(e) => setInvoiceDueDate(e.target.value)} />
				</div>
			</div>
			<div className="grid grid-cols-3 gap-4">
				<div className="col-span-2">
					<label className="text-sm font-semibold">Your recipient address</label>
					<input type="text" className="w-full px-2 border-2 rounded-xl" placeholder="Your recipient address..." value={invoiceWallet} onChange={(e) => setInvoiceWallet(e.target.value)} />
				</div>
				<div>
					<label className="text-sm font-semibold">Payment token</label>
					<select className="w-full px-2 border-2 rounded-xl" value={invoiceCurrency} onChange={(e) => setInvoiceCurrency(e.target.value)}>
						<option>--Choose token--</option>
						<option value="0xdac17f958d2ee523a2206206994597c13d831ec7">USDT</option>
						<option value="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48">USDC</option>
					</select>
				</div>
			</div>
			<p className="mt-4 text-md font-bold">Item List</p>
			<div className="grid grid-cols-6 gap-4">
				<div className="col-span-3">
					<label className="text-sm font-semibold">Description</label>
					<input
						type="text"
						className="w-full px-2 border-2 rounded-xl text-left"
						placeholder="Your item description..."
						value={invoiceItemDescription}
						onChange={(e) => setInvoiceItemDescription(e.target.value)}
					/>
				</div>
				<div className="col-span-1">
					<label className="text-sm font-semibold">Price ($)</label>
					<input
						type="number"
						className="w-full px-2 border-2 rounded-xl text-center"
						placeholder="$..."
						value={invoiceItemPrice}
						onChange={(e) => setInvoiceItemPrice(Number(e.target.value))}
					/>
				</div>
				<div className="col-span-1">
					<label className="text-sm font-semibold">Qty</label>
					<input type="number" className="w-full px-2 border-2 rounded-xl text-center" placeholder="..." value={invoiceItemQty} onChange={(e) => setInvoiceItemQty(Number(e.target.value))} />
				</div>
				<div className="col-span-1">
					<label className="text-sm font-semibold">Total ($)</label>
					<input disabled type="text" className="w-full px-2 border-2 rounded-xl bg-gray-200 text-right" value={invoiceItemTotal} />
				</div>
			</div>
			<div className="mx-auto mb-4">
				<button
					className="mt-4 py-2 px-4 border-2 rounded-xl font-semibold bg-white border-gray-300 cursor-pointer transition-all ease-in hover:bg-gray-200"
					onClick={() => setShowInvoice(true)}
				>
					Generate Invoice
				</button>
			</div>
			{showInvoice && (
				<>
					<PDFViewer className="w-full min-h-screen">
						<PDFDocument
							invoiceName={invoiceName}
							invoiceCustomerLabel={invoiceCustomerLabel}
							invoiceCustomerName={invoiceCustomerName}
							invoiceNumber={invoiceNumber}
							invoiceDate={invoiceDate}
							invoiceDueDate={invoiceDueDate}
							invoiceWallet={invoiceWallet}
							invoiceCurrency={invoiceCurrency}
							invoiceItemDescription={invoiceItemDescription}
							invoiceItemPrice={invoiceItemPrice}
							invoiceItemQty={invoiceItemQty}
						/>
					</PDFViewer>
					<button
						className="mt-4 py-2 px-4 border-2 rounded-xl font-semibold bg-black text-white border-black cursor-pointer transition-all ease-in hover:bg-gray-700"
						onClick={setSaveInvoice}
					>
						Save Invoice
					</button>
				</>
			)}
		</div>
	);
};

const TrackInvoiceMenu = ({ address }: { address: string | undefined }) => {
	const [checkMsg, setCheckMsg] = useState("");
	const [txHash, setTxHash] = useState("");
	const [invoiceTimestamp, setInvoiceTimestamp] = useState(0);
	const [invoiceName, setInvoiceName] = useState("");
	const [invoiceCustomerName, setInvoiceCustomerName] = useState("");
	const [invoiceCustomerLabel, setInvoiceCustomerLabel] = useState("");
	const [invoiceNumber, setInvoiceNumber] = useState("");
	const [invoiceDate, setInvoiceDate] = useState("");
	const [invoiceDueDate, setInvoiceDueDate] = useState("");
	const [invoiceWallet, setInvoiceWallet] = useState("");
	const [invoiceCurrency, setInvoiceCurrency] = useState("");
	const [invoiceItemDescription, setInvoiceItemDescription] = useState("");
	const [invoiceItemPrice, setInvoiceItemPrice] = useState<number>(0);
	const [invoiceItemQty, setInvoiceItemQty] = useState<number>(0);
	const invoiceItemTotal = useMemo(() => {
		return invoiceItemPrice * invoiceItemQty;
	}, [invoiceItemPrice, invoiceItemQty]);

	const checkPayment = async () => {
		if (!address) {
			alert("");
			return;
		}
		const currentTime = new Date().getTime();
		const result = await APIHelper.getCheckPayment({ address, from: invoiceTimestamp, to: currentTime, token: invoiceCurrency });
		if (result.data.items) {
			const amount = invoiceItemTotal * Math.pow(10, StringHelper.tokenAddressDecimal(invoiceCurrency));
			result.data.items.map((val: { details: { tokenActions: { amount: number }[]; txHash: string } }) => {
				if (Number(val?.details?.tokenActions[0].amount) === Number(amount)) {
					setCheckMsg("Payment transaction found! Please check this txHash:");
					setTxHash(val?.details?.txHash);
					return;
				}
			});
			return;
		}
		setCheckMsg("No payment transaction found!");
	};

	useEffect(() => {
		if (address) {
			setInvoiceWallet(address);
			const invoiceData = localStorage.getItem("invoiceData");
			if (invoiceData) {
				const invoice: InvoiceProps = JSON.parse(invoiceData);
				setInvoiceTimestamp(invoice.invoiceTimestamp);
				setInvoiceName(invoice.invoiceName);
				setInvoiceCustomerName(invoice.invoiceCustomerName);
				setInvoiceCustomerLabel(invoice.invoiceCustomerLabel);
				setInvoiceNumber(invoice.invoiceNumber);
				setInvoiceDate(invoice.invoiceDate);
				setInvoiceDueDate(invoice.invoiceDueDate);
				setInvoiceWallet(invoice.invoiceWallet);
				setInvoiceCurrency(invoice.invoiceCurrency);
				setInvoiceItemDescription(invoice.invoiceItemDescription);
				setInvoiceItemPrice(invoice.invoiceItemPrice);
				setInvoiceItemQty(invoice.invoiceItemQty);
			}
		}
	}, [address]);

	return (
		<div>
			<h2 className="mb-3 text-2xl font-semibold">Track Invoice</h2>
			<div className="mb-4">
				<div>Recipient: {invoiceWallet}</div>
				<div>
					Amount: {invoiceItemTotal} ${StringHelper.tokenAddressName(invoiceCurrency)}
				</div>
				<button className="mt-1 py-2 px-4 border-2 rounded-xl font-semibold bg-black border-black text-white cursor-pointer transition-all ease-in hover:bg-gray-800" onClick={checkPayment}>
					Check Payment
				</button>
			</div>
			<div className="mb-4">
				{checkMsg && <div className="font-semibold">{checkMsg}</div>}
				<a href={"https://etherscan.io/tx/" + txHash} target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
					{txHash}
				</a>
			</div>
			<PDFViewer className="w-full min-h-screen">
				<PDFDocument
					invoiceName={invoiceName}
					invoiceCustomerLabel={invoiceCustomerLabel}
					invoiceCustomerName={invoiceCustomerName}
					invoiceNumber={invoiceNumber}
					invoiceDate={invoiceDate}
					invoiceDueDate={invoiceDueDate}
					invoiceWallet={invoiceWallet}
					invoiceCurrency={invoiceCurrency}
					invoiceItemDescription={invoiceItemDescription}
					invoiceItemPrice={invoiceItemPrice}
					invoiceItemQty={invoiceItemQty}
				/>
			</PDFViewer>
		</div>
	);
};

function App() {
	const { address } = useAccount();
	const [menu, setMenu] = useState("home");
	const [showGasFeeInfo, setShowGasFeeInfo] = useState(false);
	const [gasFee, setGasFee] = useState<FeeData>();

	useEffect(() => {
		(async () => {
			try {
				const { data } = await APIHelper.getNetworkGas();
				setGasFee(data);
			} catch (e) {
				console.error(e);
			}
		})();
	}, []);

	return (
		<div className="container min-h-screen mb-12">
			<div className={"overlay " + (showGasFeeInfo ? "active" : "")} onClick={() => setShowGasFeeInfo(false)}>
				<div className="overlay-content">
					<GasFeeInfo gasFee={gasFee} />
				</div>
			</div>
			<header className="py-6 flex justify-center items-center">
				<div className="flex items-center justify-between">
					<img src={Logo} alt="Logo" className="w-12 h-12 rounded-full" />
					<h1 className="ml-2 text-2xl font-semibold">PaperMint</h1>
				</div>
				<div className="ml-auto">
					<div className="flex items-center justify-between">
						<button
							className="text-sm mr-2 p-2 border-2 rounded-xl bg-white border-gray-300 cursor-pointer transition-all ease-in hover:bg-gray-200"
							onClick={() => setShowGasFeeInfo(true)}
						>
							⛽️ {gasFee?.baseFee ? (Number(gasFee?.baseFee) / Math.pow(10, 9)).toFixed(3) + "gwei" : "..."}
						</button>
						<ConnectKitButton />
					</div>
				</div>
			</header>
			<main className="grid grid-cols-1 gap-y-4 md:grid-cols-4 md:gap-4">
				<nav className="md:col-span-1">
					<ul className="flex items-center gap-x-2 md:block">
						<li className="pb-1">
							<button
								className={"menu w-full px-4 py-2 text-left font-semibold bg-gray-200 rounded-xl cursor-pointer " + (menu === "home" ? "active" : "")}
								onClick={() => setMenu("home")}
							>
								Dashboard
							</button>
						</li>
						<li className="pb-1">
							<button
								className={"menu w-full px-4 py-2 text-left font-semibold bg-gray-200 rounded-xl cursor-pointer " + (menu === "create" ? "active" : "")}
								onClick={() => setMenu("create")}
							>
								Create Invoice
							</button>
						</li>
						<li className="pb-1">
							<button
								className={"menu w-full px-4 py-2 text-left font-semibold bg-gray-200 rounded-xl cursor-pointer " + (menu === "track" ? "active" : "")}
								onClick={() => setMenu("track")}
							>
								Track Invoice
							</button>
						</li>
					</ul>
				</nav>
				<div className="p-4 md:col-span-3 border-2 border-gray-200 rounded-xl bg-white">
					{address ? (
						<>
							{menu === "home" && <DashboardMenu address={address} />}
							{menu === "create" && <CreateInvoiceMenu address={address} />}
							{menu === "track" && <TrackInvoiceMenu address={address} />}
						</>
					) : (
						<div className="mt-4 mx-auto text-center text-2xl font-bold"> Please connect your wallet to continue!</div>
					)}
				</div>
			</main>
			<footer>
				<div></div>
			</footer>
		</div>
	);
}

export default App;
