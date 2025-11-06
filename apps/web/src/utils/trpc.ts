import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@my-sso/api/routers/index";

export const { TRPCProvider, useTRPC, useTRPCClient } =
	createTRPCContext<AppRouter>();
