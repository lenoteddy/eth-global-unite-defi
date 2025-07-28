import { ConnectKitButton } from "connectkit";
import Logo from "./assets/logo.webp";

function App() {
	return (
		<div className="container">
			<header className="py-6 flex justify-center items-center">
				<div className="flex items-center justify-between">
					<img src={Logo} alt="Logo" className="w-12 h-12 rounded-full" />
					<h1 className="ml-2 text-2xl font-semibold">PaperMint</h1>
				</div>
				<div className="ml-auto ">
					<ConnectKitButton />
				</div>
			</header>
			<main>
				<div></div>
			</main>
			<footer>
				<div></div>
			</footer>
		</div>
	);
}

export default App;
