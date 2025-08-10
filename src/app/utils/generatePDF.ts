// utils/invoicePdf.ts
import PDFDocument from "pdfkit";
import { AppError } from "../errorHelpers/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  userEmail?: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
  company?: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  billingTo?: {
    name: string;
    address?: string;
    email?: string;
  };
  footerText?: string;
}

export const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers: Uint8Array[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // Load a font that supports ৳
      doc.registerFont("Regular", "fonts/NotoSans-Regular.ttf"); // put the font in /fonts folder

      const currency = (v: number) =>
        `${new Intl.NumberFormat("en-BD", {
          minimumFractionDigits: 2,
        }).format(v)}tk`;

      const drawLine = (y: number) => {
        doc
          .lineWidth(1)
          .moveTo(40, y)
          .lineTo(555, y)
          .strokeColor("#E6E9EE")
          .stroke();
      };

      // Header
      const company = invoiceData.company ?? {
        name: "Your Company",
        address: "123 Example St, Dhaka, Bangladesh",
        phone: "+880 1712-345678",
        email: "hello@example.com",
      };

      doc
        .fontSize(20)
        .fillColor("#111827")
        .font("Helvetica-Bold")
        .text("INVOICE", 40, 50);

      doc
        .fontSize(10)
        .fillColor("#555")
        .font("Helvetica")
        .text(company.name, 40, 80)
        .text(company.address || "", 40, 95)
        .text(
          `${company.phone || ""} ${company.email ? "| " + company.email : ""}`,
          40,
          110
        );

      // Invoice Meta
      doc
        .fontSize(10)
        .fillColor("#666")
        .text(`Invoice #: ${invoiceData.transactionId}`, 400, 50, {
          align: "right",
        })
        .text(`Date: ${invoiceData.bookingDate.toISOString().slice(0, 10)}`, {
          align: "right",
        });

      drawLine(140);

      // Billing Info
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#111827")
        .text("Billed To:", 40, 150);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#374151")
        .text(invoiceData.billingTo?.name ?? invoiceData.userName, 40, 165)
        .text(invoiceData.billingTo?.address || "", 40, 180)
        .text(
          invoiceData.billingTo?.email ?? invoiceData.userEmail ?? "",
          40,
          195
        );

      // Tour Info
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#111827")
        .text("Tour Info", 340, 150);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#374151")
        .text(`Tour: ${invoiceData.tourTitle}`, 340, 165)
        .text(`Guests: ${invoiceData.guestCount}`, 340, 180);

      drawLine(220);

      // Total Section
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#111827")
        .text("Total Amount", 400, 240, { width: 200, align: "left" });

      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor("#16a34a")
        .text(currency(invoiceData.totalAmount), 500, 240, {
          width: 180,
          align: "left",
        });

      // Footer
      const footerText =
        invoiceData.footerText ??
        "This invoice is valid for 2 minutes for payment verification.";
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#6B7280")
        .text(footerText, 40, 760, { align: "center", width: 520 });

      doc
        .fontSize(8)
        .fillColor("#9CA3AF")
        .text(`Invoice ID: ${invoiceData.transactionId}`, 40, 780);
      doc.text(
        `Generated on ${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}`,
        400,
        780
      );

      doc.end();
    });
  } catch (error) {
    console.error("Pdf creation error", error);
    throw new AppError(500, "Pdf creation error");
  }
};
