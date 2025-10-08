import { pdf } from "@react-pdf/renderer";
import Invoice from "./Invoice";

async function handleDownload(invoice) {
  const blob = await pdf(<Invoice invoice={invoice} />).toBlob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${invoice.invoiceNo}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export default handleDownload;
