const nodemailer = require("nodemailer");
// require('dotenv').config();

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASSWORD,

    },

});



const sendBookingEmail = async({

        to,
        listingTitle,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        paymentId,
    }) => {

    const mailOptions = {

        from: process.env.EMAIL_USER,

        to,

        subject: `Booking Confirmed - ${listingTitle} 🎉`,

        html: `

            <h2>Booking Confirmed!</h2>

            <p>Your booking has been successfully confirmed.</p>

            <hr>

            <h3>${listingTitle}</h3>

            <p><b>Check-in:</b> ${new Date(checkIn).toLocaleDateString("en-IN")}</p>
            <p><b>Check-out:</b> ${new Date(checkOut).toLocaleDateString("en-IN")}</p>

            <p><b>Guests:</b> ${guests}</p>

            <p><b>Total Paid:</b> ₹${Number(totalPrice).toLocaleString("en-IN")}</p>

            <p><b>Booking Reference:</b> WS-${paymentId.slice(-8)}</p>

            <br>
            <p>
                If you have any special requests or need assistance before your arrival,
                please feel free to contact us at +91 7997760061 or 
                <a href="mailto:waandersphhere@gmail.com">
                        waandersphhere@gmail.com
                </a>
            </p>

            <p>
                We look forward to hosting you and making your stay a memorable experience.
            </p>

            <p>
                Thank you for choosing WanderSphere ❤️
            </p>

            <p>
                Kind regards,<br>
                The WanderSphere Team
            </p>


            <hr>

            <p style="font-size:12px;color:#666;">
                This is an automated booking confirmation email from WanderSphere.
                Please keep this email for your records.
            </p>

        `,

    };



    await transporter.sendMail(mailOptions);

};



module.exports = sendBookingEmail;