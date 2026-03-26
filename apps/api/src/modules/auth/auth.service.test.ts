import { describe, it, expect, beforeAll } from "@jest/globals";
import { hash } from "bcryptjs";
import { testDb } from "../../test/mocks/db-client.js";
import { registerDbMock } from "../../test/register-db-mock.js";

describe("authService", () => {
  let authService: typeof import("./auth.service.js").authService;

  beforeAll(async () => {
    await registerDbMock();
    ({ authService } = await import("./auth.service.js"));
  });

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
      expect(result.user.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
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

      expect(result).toEqual({
        id: "u1",
        email: "ana@test.com",
        role: "user",
      });
    });

    it("retorna null quando usuario nao existe", async () => {
      testDb.query.usersTable.findFirst.mockResolvedValue(undefined);

      const result = await authService.login({
        email: "nao@existe.com",
        password: "x",
      });

      expect(result).toBeNull();
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

      const result = await authService.login({
        email: "ana@test.com",
        password: "errada",
      });

      expect(result).toBeNull();
    });
  });
});
