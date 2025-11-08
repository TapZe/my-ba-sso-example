import { createMiddleware } from "@tanstack/react-start";
import { authClient } from "@/lib/auth-client";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		let jwtToken = "";
		const session = await authClient.getSession({
			fetchOptions: {
				headers: request.headers,
				throw: true,
				onSuccess: (ctx) => {
					jwtToken = ctx.response.headers.get("set-auth-jwt") || "";
				}
			},
		});

		return next({
			context: { session, jwtToken },
		});
	},
);
