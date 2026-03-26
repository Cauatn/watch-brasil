import { jest } from "@jest/globals";

let registered = false;

export async function registerDbMock() {
  if (registered) return;
  await jest.unstable_mockModule("../db/client.js", async () => {
    const { testDb } = await import("./mocks/db-client.js");
    return { db: testDb };
  });
  registered = true;
}
