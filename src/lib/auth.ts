import { db } from "@/db";
import * as authSchema from "@/db/schemas/auth.schema";
import { user } from "@/db/schemas/auth.schema";
import { UserType } from "@/types/user_type.type";
import { createErrorResponse } from "@/utils/api-response";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { openAPI, organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";

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
                defaultValue: "customer",
            },
        },
    },
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-in/email") {
                const email = ctx.body?.email;
                if (email) {
                    const [foundUser] = await db
                        .select()
                        .from(user)
                        .where(eq(user.email, email))
                        .limit(1);

                    if (foundUser && (foundUser.userType === UserType.DRIVER || foundUser.userType === UserType.SHOP)) {
                        return ctx.json(createErrorResponse("Email ou mot de passe incorrect"), {
                            status: 401,
                        });
                    }
                }
            }
        }),
    },
    plugins: [
        openAPI(),
        organization(),
    ],
});