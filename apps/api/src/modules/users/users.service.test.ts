import { describe, it, expect, beforeAll } from "@jest/globals";
import { dbMockHelpers, testDb } from "../../test/mocks/db-client.js";
import { registerDbMock } from "../../test/register-db-mock.js";

describe("usersService", () => {
  let findUserById: (typeof import("./users.service.js"))["findUserById"];
  let usersService: (typeof import("./users.service.js"))["usersService"];

  beforeAll(async () => {
    await registerDbMock();
    const mod = await import("./users.service.js");
    findUserById = mod.findUserById;
    usersService = mod.usersService;
  });

  describe("findUserById", () => {
    it("mapeia usuario encontrado", async () => {
      const createdAt = new Date("2024-01-01T00:00:00.000Z");
      testDb.query.usersTable.findFirst.mockResolvedValue({
        id: "u1",
        name: "Ana",
        email: "ana@test.com",
        password: "hash",
        role: "user",
        createdAt,
      });

      const user = await findUserById("u1");

      expect(user).toEqual({
        id: "u1",
        name: "Ana",
        email: "ana@test.com",
        role: "user",
        createdAt: createdAt.toISOString(),
      });
    });

    it("retorna null quando nao existe", async () => {
      testDb.query.usersTable.findFirst.mockResolvedValue(undefined);

      const user = await findUserById("missing");

      expect(user).toBeNull();
    });
  });

  describe("updateMe", () => {
    it("atualiza e devolve usuario publico", async () => {
      const createdAt = new Date("2024-06-01T00:00:00.000Z");
      testDb.query.usersTable.findFirst.mockResolvedValue({
        id: "u1",
        name: "Nova",
        email: "a@b.com",
        password: "h",
        role: "user",
        createdAt,
      });

      const updated = await usersService.updateMe("u1", { name: "Nova" });

      expect(testDb.update).toHaveBeenCalled();
      expect(updated).toEqual({
        id: "u1",
        name: "Nova",
        email: "a@b.com",
        role: "user",
        createdAt: createdAt.toISOString(),
      });
    });
  });

  describe("deleteMe", () => {
    it("retorna true quando removeu", async () => {
      dbMockHelpers.wireDeleteMock([{ id: "u1" }]);

      const ok = await usersService.deleteMe("u1");

      expect(ok).toBe(true);
      expect(testDb.delete).toHaveBeenCalled();
    });

    it("retorna false quando nada foi removido", async () => {
      dbMockHelpers.wireDeleteMock([]);

      const ok = await usersService.deleteMe("u1");

      expect(ok).toBe(false);
    });
  });
});
