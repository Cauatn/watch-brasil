import awsLambdaFastify from "@fastify/aws-lambda";
import { startTelemetry } from "./telemetry.js";

await startTelemetry();
const { app } = await import("./app.js");

export const handler = awsLambdaFastify(app, {
  serializeLambdaArguments: true,
});
