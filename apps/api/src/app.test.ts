import { describe, it, expect, afterAll, mock } from "bun:test";
import { testDb } from "./test/mocks/db-client";

mock.module("./db/client", () => ({ db: testDb }));

import { app } from "./app";

describe("app", () => {
  afterAll(() => app.close());

  it("GET /health retorna ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
});
