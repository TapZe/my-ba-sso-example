import prisma from "@my-sso/db";
import argon2 from "argon2";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, customSession, jwt } from "better-auth/plugins";
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
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 1 week
		updateAge: 60 * 15, // 15 minutes
		freshAge: 60 * 60, // 1 hour
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},
	},
	advanced: {
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
		jwt(),
	],
} satisfies BetterAuthOptions);
