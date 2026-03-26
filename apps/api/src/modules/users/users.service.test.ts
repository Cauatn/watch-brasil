jest.mock("../../db/client.js");

import {
  testDb,
  resetDbMock,
  wireDeleteReturning,
} from "../../test/mocks/db-client.js";
import { findUserById, usersService } from "./users.service.js";

describe("usersService", () => {
  beforeEach(() => resetDbMock());

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

      expect(await findUserById("u1")).toEqual({
        id: "u1",
        name: "Ana",
        email: "ana@test.com",
        role: "user",
        createdAt: createdAt.toISOString(),
      });
    });

    it("retorna null quando nao existe", async () => {
      testDb.query.usersTable.findFirst.mockResolvedValue(undefined);
      expect(await findUserById("missing")).toBeNull();
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
      expect(updated?.name).toBe("Nova");
    });
  });

  describe("deleteMe", () => {
    it("retorna true quando removeu", async () => {
      wireDeleteReturning([{ id: "u1" }]);
      expect(await usersService.deleteMe("u1")).toBe(true);
    });

    it("retorna false quando nada foi removido", async () => {
      wireDeleteReturning([]);
      expect(await usersService.deleteMe("u1")).toBe(false);
    });
  });
});
