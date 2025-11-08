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
    .mapResponse(async ({ responseValue, set, request, log }): Promise<Response | void> => {

        log.info({
            level: 30,
            time: Date.now(),
            msg: "HTTP Response",
            method: request.method,
            path: request.url,
            requestID: request.headers.get("X-Request-ID"),
            status: set.status,
            body: responseValue,
        });
    })
    .mount(auth.handler)
    .use(signUpController)
    .use(signInController)
    .listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
