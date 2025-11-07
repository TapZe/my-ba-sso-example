import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements,
} as const

export const ac = createAccessControl(statement)

// Default roles
export const adminRole = ac.newRole({
    ...adminAc?.statements,
})

export const userRole = ac.newRole({
    session: [],
    user: [],
})

// Extra roles
export const hrAdminRole = ac.newRole({
    user: ["create", "list", "ban", "delete"],
    session: [],
})