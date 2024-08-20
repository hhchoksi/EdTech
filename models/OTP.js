import mongoose from "mongoose";
import mailSender from "../utils/mailSender";

const otpSchema = new Schema({
    email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5 // The document will be automatically deleted after 5 minutes of its creation time
	}
});

async function sendVerificationEmail(email, otp) {
	try {
		const response = await mailSender(email, "Email Verification", `Your OTP is ${otp}`);
		console.log("Email sent successfully:", response);
	} 
	catch (error) {
		console.log("Error sending email:", error);
		throw new Error("Failed to send verification email");
	}
}

otpSchema.pre("save", async function(next) {
	try {
		await sendVerificationEmail(this.email, this.otp);
		next();
	} 
	catch (error) {
		next(error);
	}
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;