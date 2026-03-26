import { describe, it, expect, afterAll, vi } from "vitest";
import { testDb } from "./test/mocks/db-client.js";

vi.mock("./db/client.js", async () => {
  const { testDb } = await import("./test/mocks/db-client.js");
  return { db: testDb };
});

import { app } from "./app.js";

describe("app", () => {
  afterAll(async () => {
    await app.close();
  });

  it("GET /health retorna ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
});
