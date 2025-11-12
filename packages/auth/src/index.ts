import prisma from "@my-sso/db";
import argon2 from "argon2";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, customSession, jwt, username } from "better-auth/plugins";
import { sendEmail } from "./email";
import { getVerificationEmailTemplate } from "./email-templates";
import { ac, adminRole, hrAdminRole, userRole } from "./roles";

const ARGON2_MEMORY_COST = Number(process.env.ARGON2_MEMORY_COST ?? 2 ** 16);
const ARGON2_TIME_COST = Number(process.env.ARGON2_TIME_COST ?? 3);
const ARGON2_PARALLELISM = Number(process.env.ARGON2_PARALLELISM ?? 1);
const PASSWORD_PEPPER = process.env.PASSWORD_PEPPER ?? "";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		password: {
			hash: async (password) =>
				argon2.hash(password + PASSWORD_PEPPER, {
					type: argon2.argon2id,
					memoryCost: ARGON2_MEMORY_COST,
					timeCost: ARGON2_TIME_COST,
					parallelism: ARGON2_PARALLELISM,
				}),
			verify: async ({ password, hash }) =>
				argon2.verify(hash, password + PASSWORD_PEPPER),
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url, token }, request) => {
			try {
				const html = getVerificationEmailTemplate({
					userName: user.name,
					verificationUrl: url, // change callback on the client (front end)
					appName: "My SSO App",
				});

				await sendEmail({
					to: user.email,
					subject: "Verify your email address",
					html,
				});

				console.log(`Verification email sent to ${user.email}`);
			} catch (error) {
				console.error("Failed to send verification email:", error);
				throw error;
			}
		},
		afterEmailVerification: async (user, request) => {
			// Custom logic after successful email verification
			console.log(`✅ Email verified successfully for user: ${user.email}`);

			// Example implementations:

			// 1. Send welcome email
			// try {
			// 	const welcomeHtml = getWelcomeEmailTemplate({ userName: user.name });
			// 	await sendEmail({
			// 		to: user.email,
			// 		subject: "Welcome to My SSO App!",
			// 		html: welcomeHtml,
			// 	});
			// } catch (error) {
			// 	console.error("Failed to send welcome email:", error);
			// }

			// 2. Update user metadata or grant premium features
			// if (user.email.endsWith("@yourcompany.com")) {
			// 	await prisma.user.update({
			// 		where: { id: user.id },
			// 		data: {
			// 			role: "hr_admin", // Auto-promote company emails to HR admin
			// 		},
			// 	});
			// 	console.log(`🎉 Granted HR admin role to ${user.email}`);
			// }

			// 3. Log to analytics/monitoring
			// await analytics.track({
			// 	userId: user.id,
			// 	event: "email_verified",
			// 	properties: { email: user.email },
			// });
		},
		autoSignInAfterVerification: true,
		expiresIn: 60 * 60, // 1 hour
	},
	// session: {
	// 	expiresIn: 60 * 60 * 24 * 7, // 1 week
	// 	updateAge: 60 * 15, // 15 minutes
	// 	freshAge: 60 * 60, // 1 hour
	// 	cookieCache: {
	// 		enabled: true,
	// 		maxAge: 60 * 5, // 5 minutes
	// 	},
	// },
	//* 30 minutes session with 5 minutes update age
	session: {
		expiresIn: 60 * 30, // 30 minutes
		updateAge: 60 * 5, // refresh the session expiry every 5 minutes of activity
		freshAge: 60 * 60, // 1 hour
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5, // 5 minutes
		},
	},
	advanced: {
		cookiePrefix: process.env.BETTER_AUTH_COOKIE_PREFIX,
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	plugins: [
		customSession(async ({ user, session }) => {
			const userExtraData = await prisma.user.findUnique({
				where: {
					id: session.userId,
				},
				select: {
					role: true,
					banned: true,
					banExpires: true,
					banReason: true,
				},
			});

			return {
				user: {
					...user,
					role: userExtraData?.role,
					banned: userExtraData?.banned,
					banExpires: userExtraData?.banExpires,
					banReason: userExtraData?.banReason,
				},
				session,
			};
		}),
		admin({
			ac,
			roles: {
				admin: adminRole,
				user: userRole,
				hr_admin: hrAdminRole,
			},
			defaultBanExpiresIn: 60 * 60 * 24, // 1 day
			defaultBanReason: "Suspicious activity detected",
			defaultRole: "user",
			bannedUserMessage: "You have been banned for suspicious activity",
		}),
		jwt({
			jwt: {
				expirationTime: 60 * 5, // 5 minutes
			}
		}),
		username(),
	],
} satisfies BetterAuthOptions);
