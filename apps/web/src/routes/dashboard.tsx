import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
// import { createRemoteJWKSet, jwtVerify } from "jose";
import { getUser } from "@/functions/get-user";
import { useTRPC } from "@/utils/trpc";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const { session, jwtToken } = await getUser();

		// // the token should be sent by the fe to the other be then verified using this
		// if (jwtToken) {
		// 	const JWKS = createRemoteJWKSet(
		// 		new URL(`http://localhost:3000/api/auth/jwks`),
		// 	);
		// 	const { payload, protectedHeader, key } = await jwtVerify(
		// 		jwtToken,
		// 		JWKS,
		// 		{
		// 			issuer: import.meta.env.VITE_SSO_URL, // Should match your JWT issuer, which is the BASE_URL
		// 			audience: import.meta.env.VITE_SSO_URL, // Should match your JWT audience, which is the BASE_URL by default
		// 		},
		// 	);

		// 	console.log("JWT", { payload, protectedHeader, key });
		// }

		return { session, jwtToken };
	},
	loader: async ({ context }) => {
		if (!context.session) {
			throw redirect({
				to: "/login",
			});
		}
	},
});

function RouteComponent() {
	const { session, jwtToken } = Route.useRouteContext();

	const trpc = useTRPC();
	const privateData = useQuery(trpc.privateData.queryOptions());

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session?.user.name}</p>
			<p>API: {privateData.data?.message}</p>
			<p>JWT: {jwtToken}</p>
		</div>
	);
}
