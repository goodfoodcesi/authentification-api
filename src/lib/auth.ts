import { db } from "@/db";
import * as authSchema from "@/db/schemas/auth.schema";
import { UserType } from "@/types/user_type.type";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, organization } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: authSchema
    }),
    basePath: "/auth",
    trustedOrigins: ['*'],
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            userType: {
                type: "string",
                required: false,
                returned: true,
                defaultValue: UserType.CUSTOMER,
            },
        
        },
    },
    plugins: [
        openAPI(),
        organization(),
    ],
});