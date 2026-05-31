const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (booking, listing, user) => {

    const invoiceName = `invoice-${booking._id}.pdf`;

    const invoicePath = path.join(__dirname, "..", "public", "invoices", invoiceName);

    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(invoicePath));

    doc.fontSize(22)
        .text(`${listing.title} Invoice`);

    doc.moveDown();

    doc.fontSize(14)
        .text(`Booking ID : ${booking._id}`);

    doc.text(`Guest : ${user.username.split('@')[0]}`);

    doc.text(`Listing : ${listing.title}`);

    doc.text(`Check-In : ${booking.checkIn.toDateString()}`);

    doc.text(`Check-Out : ${booking.checkOut.toDateString()}`);

    doc.text(`Guests : ${booking.guests}`);

    doc.text(`Total Paid: INR ${Number(booking.totalPrice).toLocaleString("en-IN")}`);

    doc.text(`Payment ID : ${booking.paymentId}`);

    doc.moveDown();

    doc.text("Thank you for booking with WanderSphere!");

    doc.end();

    return invoicePath;
};

module.exports = generateInvoice;