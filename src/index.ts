import { OpenAPI } from "@/auth.openapi";
import { logger } from "@bogeychan/elysia-logger";
import type { ElysiaLoggerContext } from "@bogeychan/elysia-logger/types";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { requestID } from "elysia-requestid";
import { signInController } from './features/sign-in/controller';
import { signUpController } from './features/sign-up/controller';
import { auth } from './lib/auth';

new Elysia()
    .use(openapi({
        documentation: {
            components: await OpenAPI.components,
            paths: await OpenAPI.getPaths('/auth')
        },
    }))
    .use(requestID())
    .use(
        logger({
            autoLogging: false,
            customProps(ctx: ElysiaLoggerContext) {
                const requestID = ctx.requestID ?? ctx.set?.headers?.["X-Request-ID"];
                return { requestID };
            },
        }),
    )
    .onBeforeHandle(async (ctx) => {
        ctx.log.info({
            msg: "HTTP Request",
            method: ctx.request.method,
            path: ctx.request.url,
            requestID: ctx.request.headers.get("X-Request-ID"),
            body: ctx.body,
        });
    })
    .onAfterHandle(async (ctx) => {
        ctx.log.info({
            level: 30,
            time: Date.now(),
            msg: "HTTP Response",
            method: ctx.request.method,
            path: ctx.request.url,
            status: ctx.set.status,
            body: ctx.responseValue,
        });
    })
    .mount(auth.handler)
    .use(signUpController)
    .use(signInController)
    .listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
