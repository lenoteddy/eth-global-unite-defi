import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
	textLeft: {
		textAlign: "left",
	},
	textCenter: {
		textAlign: "center",
	},
	textRight: {
		textAlign: "right",
	},
	textBold: {
		fontWeight: "bold",
	},
	page: {
		backgroundColor: "#ffffff",
		margin: 10,
		padding: 10,
	},
	header: {
		flexDirection: "row",
		height: 100,
	},
	main: {
		marginBottom: 20,
	},
	// footer: {
	// 	position: "absolute",
	// 	bottom: 30,
	// 	flexDirection: "row",
	// },
	section: {
		width: "50%",
		flexGrow: 1,
		paddingRight: 20,
	},
	titleTxt: {
		paddingBottom: 10,
		textAlign: "left",
	},
	titleInfoTxt: {
		fontSize: "0.8rem",
	},
	invoiceTxt: {
		textAlign: "right",
		fontSize: "1.5rem",
		fontWeight: "bold",
	},
	invoiceInfoTxt: {
		fontSize: "0.8rem",
	},
	colHeader: {
		width: "97%",
		flexDirection: "row",
		padding: 5,
		borderTop: 2,
		borderBottom: 2,
		textAlign: "center",
		fontWeight: "bold",
	},
	colBody: {
		width: "97%",
		flexDirection: "row",
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	colFooter: {
		width: "97%",
		flexDirection: "row",
		paddingHorizontal: 5,
		paddingVertical: 2,
	},
	colFooterLine: {
		borderTop: 2,
	},
	colDesc: {
		width: "50%",
		fontSize: ".8rem",
	},
	colQty: {
		width: "15%",
		fontSize: ".8rem",
	},
	colPrice: {
		width: "15%",
		fontSize: ".8rem",
	},
	colTotal: {
		width: "20%",
		fontSize: ".8rem",
	},
	colSubtotalLabel: {
		width: "80%",
		fontWeight: "bold",
		fontSize: ".8rem",
	},
	colSubtotalValue: {
		width: "20%",
		paddingRight: 5,
		fontWeight: "bold",
		fontSize: ".8rem",
		flexGrow: 1,
	},
	paymentText: {
		fontSize: ".8rem",
	},
});

type InvoiceProps = {
	invoiceName: string;
	invoiceCustomerLabel: string;
	invoiceCustomerName: string;
	invoiceNumber: string;
	invoiceDate: string;
	invoiceDueDate: string;
	invoiceWallet: string;
	invoiceItemDescription: string;
	invoiceItemPrice: number;
	invoiceItemQty: number;
};

// Create Document Component
const PDFDocument = (props: InvoiceProps) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.header}>
				<View style={styles.section}>
					<Text style={styles.titleTxt}>{props.invoiceName}</Text>
					<Text style={[styles.titleInfoTxt, styles.textLeft, styles.textBold]}>Issued to: </Text>
					<Text style={[styles.titleInfoTxt, styles.textLeft]}>{props.invoiceCustomerName}</Text>
					<Text style={[styles.titleInfoTxt, styles.textLeft]}>{props.invoiceCustomerLabel}</Text>
				</View>
				<View style={styles.section}>
					<Text style={styles.invoiceTxt}>INVOICE</Text>
					<Text style={[styles.invoiceInfoTxt, styles.textRight]}>No: {props.invoiceNumber}</Text>
					<Text style={[styles.invoiceInfoTxt, styles.textRight]}>Date: {props.invoiceDate}</Text>
					<Text style={[styles.invoiceInfoTxt, styles.textRight]}>Due Date: {props.invoiceDueDate}</Text>
				</View>
			</View>
			<View style={styles.main}>
				<View style={styles.colHeader}>
					<Text style={styles.colDesc}>Description</Text>
					<Text style={styles.colPrice}>Price</Text>
					<Text style={styles.colQty}>Qty</Text>
					<Text style={styles.colTotal}>Total</Text>
				</View>
				<View style={styles.colBody}>
					<Text style={[styles.colDesc, styles.textLeft]}>{props.invoiceItemDescription}</Text>
					<Text style={[styles.colPrice, styles.textCenter]}>{props.invoiceItemPrice}</Text>
					<Text style={[styles.colQty, styles.textCenter]}>{props.invoiceItemQty}</Text>
					<Text style={[styles.colTotal, styles.textRight]}>${props.invoiceItemPrice * props.invoiceItemQty}</Text>
				</View>
				<View style={[styles.colFooter, styles.colFooterLine]}>
					<Text style={[styles.colSubtotalLabel, styles.textLeft]}>Total</Text>
					<Text style={[styles.colSubtotalValue, styles.textRight]}>${props.invoiceItemPrice * props.invoiceItemQty}</Text>
				</View>
			</View>
			<View>
				<Text style={[styles.paymentText, styles.textBold]}>Please send your payment to:</Text>
				<Text style={styles.paymentText}>{props.invoiceWallet}</Text>
			</View>
		</Page>
	</Document>
);

export default PDFDocument;
