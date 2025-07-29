import { ConnectKitButton } from "connectkit";
import Logo from "./assets/logo.webp";
import { useEffect, useState } from "react";
import APIHelper from "./helpers/APIHelper";
import { useAccount } from "wagmi";
import StringHelper from "./helpers/StringHelper";

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
			<div className="mt-2">
				<div>Token Balances:</div>
				<ul className="pl-4 list-disc">
					{Object.entries(balances).map(([key, val]) => (
						<li key={key}>
							{StringHelper.tokenAddressValue(key, val)} {StringHelper.tokenAddressName(key)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

function App() {
	const [menu, setMenu] = useState("home");
	const { address } = useAccount();

	return (
		<div className="container min-h-screen">
			<header className="py-6 flex justify-center items-center">
				<div className="flex items-center justify-between">
					<img src={Logo} alt="Logo" className="w-12 h-12 rounded-full" />
					<h1 className="ml-2 text-2xl font-semibold">PaperMint</h1>
				</div>
				<div className="ml-auto ">
					<ConnectKitButton />
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
								className={"menu w-full px-4 py-2 text-left font-semibold bg-gray-200 rounded-xl cursor-pointer " + (menu === "list" ? "active" : "")}
								onClick={() => setMenu("list")}
							>
								Track Invoice
							</button>
						</li>
					</ul>
				</nav>
				<div className="menu-box p-4 md:col-span-3 border-2 border-gray-200 rounded-xl bg-white">
					{menu === "home" && <DashboardMenu address={address} />}
					{menu === "create" && (
						<div>
							<h2 className="text-2xl font-semibold">Create Invoice</h2>
						</div>
					)}
					{menu === "list" && (
						<div>
							<h2 className="text-2xl font-semibold">Track Invoice</h2>
						</div>
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
