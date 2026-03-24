import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

let sdk: NodeSDK | null = null;
let started = false;

function isEnabled() {
  return process.env.OTEL_ENABLED !== "false";
}

function buildTracesEndpoint() {
  const base =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://localhost:4318";
  return `${base.replace(/\/$/, "")}/v1/traces`;
}

export async function startTelemetry() {
  if (!isEnabled() || started) {
    return;
  }

  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      "service.name": process.env.OTEL_SERVICE_NAME ?? "watch-brasil-api",
      "deployment.environment": process.env.NODE_ENV ?? "development",
    }),
    traceExporter: new OTLPTraceExporter({
      url: buildTracesEndpoint(),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  await sdk.start();
  started = true;

  const shutdown = async () => {
    if (!sdk) {
      return;
    }
    await sdk.shutdown();
    sdk = null;
    started = false;
  };

  process.once("SIGTERM", () => {
    shutdown().catch(() => undefined);
  });

  process.once("SIGINT", () => {
    shutdown().catch(() => undefined);
  });
}
