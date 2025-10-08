import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// ✅ Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    backgroundColor: "#fff",
    color: "#111",
  },
  row: { flexDirection: "row", alignItems: "center" },
  spaceBetween: { justifyContent: "space-between" },
  header: {
    marginBottom: 24,
    borderBottom: "2px solid #00BFA6",
    paddingBottom: 12,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00BFA6",
  },
  rightInfo: {
    textAlign: "right",
    fontSize: 9,
    color: "#555",
  },
  invoiceLabelBox: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 26,
    color: "#00BFA6",
    fontWeight: "bold",
  },
  balanceDue: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "bold",
  },
  invoiceNumber: { fontSize: 10, marginBottom: 12 },
  billSection: {
    backgroundColor: "#F4F6F8",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  billTo: { fontSize: 10, fontWeight: "bold", marginBottom: 4 },
  table: { marginTop: 16, width: "100%" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#00BFA6",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eee",
  },
  th: { flex: 1, padding: 8 },
  thPrice: { flex: 0.8 },
  thQty: { flex: 0.5 },
  thAmount: { flex: 1 },
  td: { flex: 1, padding: 8, fontSize: 9 },
  tdPrice: { flex: 0.8 },
  tdQty: { flex: 0.5 },
  tdAmount: { flex: 1 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  totalLabel: {
    padding: 8,
    fontWeight: "bold",
    flex: 2.3,
    textAlign: "right",
    color: "#111",
  },
  totalValue: {
    padding: 8,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
    backgroundColor: "#00BFA6",
    color: "#fff",
    borderRadius: 4,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 10,
    fontWeight: "bold",
    color: "#00BFA6",
    textTransform: "uppercase",
  },
  terms: {
    marginTop: 12,
    fontSize: 9,
    color: "#888",
  },
  signature: {
    marginTop: 40,
    textAlign: "right",
    fontSize: 10,
  },
});

// ✅ Format currency (Rupee + commas)
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "";
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};


// ✅ Format date (DD/MM/YYYY)
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// ✅ Component
export default function Invoice({ invoice }) {
  if (!invoice) {
    return (
      <Document>
        <Page>
          <Text>No invoice data</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.row, styles.spaceBetween, styles.header]}>
          <View>
            <Text style={styles.companyName}>Spark Construction</Text>
            <Text>Email: nasimkk27@gmail.com</Text>
            <Text>Phone: +91 9847272724</Text>
          </View>
          <View style={styles.rightInfo}>
            <Text>Othukkungal, Cherukunnu</Text>
            <Text>Kerala, India - 676528</Text>
          </View>
        </View>

        {/* Invoice Label */}
        <View style={styles.invoiceLabelBox}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>

        {/* Invoice Info */}
        <View style={[styles.row, styles.spaceBetween]}>
          <View style={styles.billSection}>
            <Text style={styles.billTo}>Billed To:</Text>
            <Text>{invoice.billTo}</Text>
            <Text>{invoice.billToAddress || ""}</Text>
          </View>
          <View style={styles.billSection}>
            <Text style={styles.billTo}>Invoice Date:</Text>
            <Text>{formatDate(invoice.invoiceDate)}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.th}>Description</Text>
            <Text style={[styles.th, styles.thPrice]}>Price</Text>
            <Text style={[styles.th, styles.thQty]}>Qty</Text>
            <Text style={[styles.th, styles.thAmount]}>Total</Text>
          </View>

          {invoice.items?.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.td}>{item.description}</Text>
              <Text style={[styles.td, styles.tdPrice]}>
                {formatCurrency(item.rate)}
              </Text>
              <Text style={[styles.td, styles.tdQty]}>{item.quantity}</Text>
              <Text style={[styles.td, styles.tdAmount]}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.subtotal)}
            </Text>
          </View>
        </View>

        {/* Terms & Conditions */}
        <Text style={styles.sectionTitle}>Terms & Conditions</Text>
        <View style={styles.terms}>
          <Text>1. Prices quoted are valid for 15 days from the proposal date.</Text>
          <Text>2. Any additional work or material change will be charged separately.</Text>
          <Text>3. Work commencement is subject to receipt of advance payment.</Text>
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <Text>_________________________</Text>
          <Text>Authorized Signature</Text>
        </View>
      </Page>
    </Document>
  );
}
