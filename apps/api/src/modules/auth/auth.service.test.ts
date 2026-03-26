import { describe, it, expect, beforeEach, mock } from "bun:test";
import { hash } from "bcryptjs";
import { testDb, resetDbMock } from "../../test/mocks/db-client";

mock.module("../../db/client", () => ({ db: testDb }));

import { authService } from "./auth.service";

describe("authService", () => {
  beforeEach(() => resetDbMock());

  describe("register", () => {
    it("cria usuario quando email esta livre", async () => {
      testDb.query.usersTable.findFirst.mockResolvedValue(undefined);

      const result = await authService.register({
        name: "Ana",
        email: "  Ana@Test.com ",
        password: "segredo-ok",
      });

      expect(result.conflict).toBe(false);
      if (result.conflict) return;
      expect(result.user.email).toBe("ana@test.com");
      expect(result.user.role).toBe("user");
      expect("password" in result.user).toBe(false);
      expect(testDb.insert).toHaveBeenCalled();
    });

    it("retorna conflito quando email ja existe", async () => {
      testDb.query.usersTable.findFirst.mockResolvedValue({
        id: "x",
        name: "B",
        email: "ana@test.com",
        password: "h",
        role: "user",
        createdAt: new Date(),
      });

      const result = await authService.register({
        name: "Ana",
        email: "ana@test.com",
        password: "segredo-ok",
      });

      expect(result.conflict).toBe(true);
      expect(testDb.insert).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("retorna payload quando senha confere", async () => {
      const pwd = await hash("certa", 4);
      testDb.query.usersTable.findFirst.mockResolvedValue({
        id: "u1",
        name: "Ana",
        email: "ana@test.com",
        password: pwd,
        role: "user",
        createdAt: new Date(),
      });

      const result = await authService.login({
        email: "ANA@Test.com",
        password: "certa",
      });

      expect(result).toEqual({ id: "u1", email: "ana@test.com", role: "user" });
    });

    it("retorna null quando usuario nao existe", async () => {
      testDb.query.usersTable.findFirst.mockResolvedValue(undefined);
      expect(
        await authService.login({ email: "x@x.com", password: "x" }),
      ).toBeNull();
    });

    it("retorna null quando senha errada", async () => {
      const pwd = await hash("certa", 4);
      testDb.query.usersTable.findFirst.mockResolvedValue({
        id: "u1",
        name: "Ana",
        email: "ana@test.com",
        password: pwd,
        role: "user",
        createdAt: new Date(),
      });

      expect(
        await authService.login({ email: "ana@test.com", password: "errada" }),
      ).toBeNull();
    });
  });
});
