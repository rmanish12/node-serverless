import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";

export default handler => middy(handler) // wrapping with middy provides us a middy object where we can then use middlewares
    .use([
        httpJsonBodyParser(), // parse the stringify event.body automatically
        httpEventNormalizer(),
        httpErrorHandler() // help us handling error process clean and easy
    ]);