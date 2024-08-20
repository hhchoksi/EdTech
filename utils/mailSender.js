import { createTransport } from 'nodemailer';

const mailSender = async(email, subject, body) => {
    try {
        let transporter = createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
        
        let info = await transporter.sendMail({
            from: `"No Reply" <${process.env.MAIL_USER}>`,
            to: email,
            subject: subject,
            html: body
        });
        return info;
    }
    catch (err) {
        console.error(`Error sending email: ${err.message}`);
        throw new Error('Failed to send email');
    }
};

export default mailSender;