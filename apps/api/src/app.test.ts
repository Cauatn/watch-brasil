jest.mock("./db/client.js");

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
