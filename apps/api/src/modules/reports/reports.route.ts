import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { reportsService } from "./reports.service.js";

export async function reportsRoute(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get("/admin/reports/summary", {
    schema: {
      tags: ["Admin"],
      summary: "Relatorios agregados (dashboard admin)",
    },
    preHandler: app.authorize(["admin"]),
    handler: async (_request, reply) => {
      const summary = await reportsService.getAdminSummary();
      return reply.send(summary);
    },
  });
}
