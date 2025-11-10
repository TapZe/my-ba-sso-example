import type { auth } from "@my-sso/auth";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_SSO_URL,
	plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
});
