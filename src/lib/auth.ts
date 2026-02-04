import { db } from "@/db";
import * as authSchema from "@/db/schemas/auth.schema";
import { redis } from "@/lib/redis";
import { UserType } from "@/types/user_type.type";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, organization } from "better-auth/plugins";
import type { RedisKey } from "ioredis";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: authSchema
    }),
    secondaryStorage: {
        get: async (key) => await redis.get(key),
        set: async (key, value, ttl) => {
            await redis.setex(key as RedisKey, ttl ?? 0, value);
        },
        delete: async (key) => {
            await redis.del(key as RedisKey);
        },
    },
    session: {
        cookieCache: {

            enabled: true,
            maxAge: 5 * 60,
            refreshCache: false,
        },
    },
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