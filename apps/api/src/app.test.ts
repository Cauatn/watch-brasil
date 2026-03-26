import type { FastifyInstance } from "fastify";
import { afterAll, describe, it, expect, beforeAll } from "@jest/globals";
import { registerDbMock } from "./test/register-db-mock.js";

describe("app", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    await registerDbMock();
    ({ app } = await import("./app.js"));
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health retorna ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
});
