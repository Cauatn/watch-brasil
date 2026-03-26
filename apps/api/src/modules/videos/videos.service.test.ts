import { describe, it, expect, beforeAll } from "@jest/globals";
import { dbMockHelpers, testDb } from "../../test/mocks/db-client.js";
import { registerDbMock } from "../../test/register-db-mock.js";

const userRow = {
  id: "u1",
  name: "Ana",
  email: "ana@test.com",
  password: "h",
  role: "user",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
};

const videoRow = {
  id: "v1",
  title: "Filme",
  description: null as string | null,
  url: "https://v.test/v.mp4",
  coverUrl: "https://v.test/c.jpg",
  mimeType: "video/mp4",
  sizeBytes: 0,
  status: "ready",
  uploadedById: "u1",
  createdAt: new Date("2024-02-01T00:00:00.000Z"),
};

describe("videosService", () => {
  let findVideoById: (typeof import("./videos.service.js"))["findVideoById"];
  let videosService: (typeof import("./videos.service.js"))["videosService"];

  beforeAll(async () => {
    await registerDbMock();
    const mod = await import("./videos.service.js");
    findVideoById = mod.findVideoById;
    videosService = mod.videosService;
  });

  describe("findVideoById", () => {
    it("mapeia createdAt para ISO string", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue(videoRow);

      const v = await findVideoById("v1");

      expect(v).toEqual({
        ...videoRow,
        createdAt: videoRow.createdAt.toISOString(),
      });
    });
  });

  describe("create", () => {
    it("insere video e inclui uploadedBy", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue(videoRow);
      testDb.query.usersTable.findFirst.mockResolvedValue(userRow);

      const out = await videosService.create({
        actorId: "u1",
        title: "Filme",
        url: "https://v.test/v.mp4",
        coverUrl: "https://v.test/c.jpg",
      });

      expect(out?.title).toBe("Filme");
      expect(out?.id).toBe(videoRow.id);
      expect(out?.uploadedBy).toEqual({
        id: "u1",
        name: "Ana",
        email: "ana@test.com",
        role: "user",
        createdAt: userRow.createdAt.toISOString(),
      });
      expect(testDb.insert).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("retorna null quando nao existe", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue(undefined);

      const out = await videosService.getById("x");

      expect(out).toBeNull();
    });

    it("anexa uploadedBy", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue(videoRow);
      testDb.query.usersTable.findFirst.mockResolvedValue(userRow);

      const out = await videosService.getById("v1");

      expect(out?.title).toBe("Filme");
      expect(out?.uploadedBy?.email).toBe("ana@test.com");
    });
  });

  describe("list", () => {
    it("retorna dados paginados", async () => {
      testDb.query.videosTable.findMany.mockResolvedValue([videoRow]);
      dbMockHelpers.wireSelectMock(1);

      const page = await videosService.list({
        page: 1,
        limit: 10,
      });

      expect(page.total).toBe(1);
      expect(page.data).toHaveLength(1);
      expect(page.data[0]?.title).toBe("Filme");
    });
  });

  describe("update", () => {
    it("negado quando nao e o dono", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue({
        ...videoRow,
        uploadedById: "outro",
      });

      const out = await videosService.update({
        videoId: "v1",
        actorId: "u1",
        title: "Novo",
      });

      expect(out).toEqual({ type: "forbidden" });
    });

    it("ok quando dono atualiza", async () => {
      const updatedRow = { ...videoRow, title: "Novo" };
      testDb.query.videosTable.findFirst.mockResolvedValue(videoRow);
      dbMockHelpers.wireUpdateReturningMock([updatedRow]);
      testDb.query.usersTable.findFirst.mockResolvedValue(userRow);

      const out = await videosService.update({
        videoId: "v1",
        actorId: "u1",
        title: "Novo",
      });

      expect(out).toEqual({
        type: "ok",
        video: {
          ...updatedRow,
          createdAt: updatedRow.createdAt.toISOString(),
          uploadedBy: {
            id: "u1",
            name: "Ana",
            email: "ana@test.com",
            role: "user",
            createdAt: userRow.createdAt.toISOString(),
          },
        },
      });
    });
  });

  describe("delete", () => {
    it("ok quando dono remove", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue(videoRow);

      const out = await videosService.delete({
        videoId: "v1",
        actorId: "u1",
      });

      expect(out).toEqual({ type: "ok" });
      expect(testDb.delete).toHaveBeenCalled();
    });
  });
});
