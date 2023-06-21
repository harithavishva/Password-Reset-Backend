import nodemailer from 'nodemailer';


export async function sendMail(emailId, resetToken) {

    const link = `https://remarkable-pie-2f428a.netlify.app/resetPassword/${resetToken}`

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'harithasai@gmail.com',
            pass: process.env.GMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let mailOption = {
        from: 'Password Reset <harithasai@gmail.com>',
        cc: 'harithasai@gmail.com',
        to: emailId,
        subject: "Password Reset Email",
        html: '<p>This is the mail to reset your password</p></b><a href="' + link + '">' + link + '</a>',
    }

    await transporter.sendMail(mailOption)
}