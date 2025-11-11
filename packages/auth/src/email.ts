import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Create reusable transporter
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
	if (!transporter) {
		const emailHost = process.env.EMAIL_HOST;
		const emailPort = Number(process.env.EMAIL_PORT ?? 587);
		const emailUser = process.env.EMAIL_USER;
		const emailPassword = process.env.EMAIL_PASSWORD;

		if (!emailHost || !emailUser || !emailPassword) {
			throw new Error(
				"Missing email configuration. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in your .env file.",
			);
		}

		transporter = nodemailer.createTransport({
			host: emailHost,
			port: emailPort,
			secure: emailPort === 465, // true for 465, false for other ports
			auth: {
				user: emailUser,
				pass: emailPassword,
			},
		});
	}

	return transporter;
}

interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

export async function sendEmail({
	to,
	subject,
	html,
	text,
}: SendEmailOptions): Promise<void> {
	const transporter = getTransporter();
	const emailFrom = process.env.EMAIL_FROM ?? process.env.EMAIL_USER;

	try {
		await transporter.sendMail({
			from: emailFrom,
			to,
			subject,
			html,
			text: text ?? html.replace(/<[^>]*>/g, ""), // Strip HTML tags for text fallback
		});
	} catch (error) {
		console.error("Failed to send email:", error);
		throw new Error("Failed to send email");
	}
}
