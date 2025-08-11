"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = void 0;
// utils/invoicePdf.ts
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = require("../errorHelpers/AppError");
const generatePdf = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const doc = new pdfkit_1.default({ size: "A4", margin: 40 });
            const buffers = [];
            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", (err) => reject(err));
            // Load a font that supports ৳
            doc.registerFont("Regular", "fonts/NotoSans-Regular.ttf"); // put the font in /fonts folder
            const currency = (v) => `${new Intl.NumberFormat("en-BD", {
                minimumFractionDigits: 2,
            }).format(v)}tk`;
            const drawLine = (y) => {
                doc
                    .lineWidth(1)
                    .moveTo(40, y)
                    .lineTo(555, y)
                    .strokeColor("#E6E9EE")
                    .stroke();
            };
            // Header
            const company = (_a = invoiceData.company) !== null && _a !== void 0 ? _a : {
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
                .text(`${company.phone || ""} ${company.email ? "| " + company.email : ""}`, 40, 110);
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
                .text((_c = (_b = invoiceData.billingTo) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : invoiceData.userName, 40, 165)
                .text(((_d = invoiceData.billingTo) === null || _d === void 0 ? void 0 : _d.address) || "", 40, 180)
                .text((_g = (_f = (_e = invoiceData.billingTo) === null || _e === void 0 ? void 0 : _e.email) !== null && _f !== void 0 ? _f : invoiceData.userEmail) !== null && _g !== void 0 ? _g : "", 40, 195);
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
            const footerText = (_h = invoiceData.footerText) !== null && _h !== void 0 ? _h : "This invoice is valid for 2 minutes for payment verification.";
            doc
                .font("Helvetica")
                .fontSize(9)
                .fillColor("#6B7280")
                .text(footerText, 40, 760, { align: "center", width: 520 });
            doc
                .fontSize(8)
                .fillColor("#9CA3AF")
                .text(`Invoice ID: ${invoiceData.transactionId}`, 40, 780);
            doc.text(`Generated on ${new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")}`, 400, 780);
            doc.end();
        });
    }
    catch (error) {
        console.error("Pdf creation error", error);
        throw new AppError_1.AppError(500, "Pdf creation error");
    }
});
exports.generatePdf = generatePdf;
