import { describe, it, expect, beforeEach, mock } from "bun:test";
import {
  testDb,
  resetDbMock,
  wireUpdateReturning,
  wireSelectTotal,
} from "../../test/mocks/db-client";

mock.module("../../db/client", () => ({ db: testDb }));

import { findVideoById, videosService } from "./videos.service";

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
  beforeEach(() => resetDbMock());

  describe("findVideoById", () => {
    it("mapeia createdAt para ISO string", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue(videoRow);
      const v = await findVideoById("v1");
      expect(v?.createdAt).toBe(videoRow.createdAt.toISOString());
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
      expect(out?.uploadedBy?.email).toBe("ana@test.com");
      expect(testDb.insert).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("retorna null quando nao existe", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue(undefined);
      expect(await videosService.getById("x")).toBeNull();
    });

    it("anexa uploadedBy", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue(videoRow);
      testDb.query.usersTable.findFirst.mockResolvedValue(userRow);
      const out = await videosService.getById("v1");
      expect(out?.uploadedBy?.email).toBe("ana@test.com");
    });
  });

  describe("list", () => {
    it("retorna dados paginados", async () => {
      testDb.query.videosTable.findMany.mockResolvedValue([videoRow]);
      wireSelectTotal(1);

      const page = await videosService.list({ page: 1, limit: 10 });

      expect(page.total).toBe(1);
      expect(page.data).toHaveLength(1);
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
      testDb.query.videosTable.findFirst.mockResolvedValue(videoRow);
      wireUpdateReturning([{ ...videoRow, title: "Novo" }]);
      testDb.query.usersTable.findFirst.mockResolvedValue(userRow);

      const out = await videosService.update({
        videoId: "v1",
        actorId: "u1",
        title: "Novo",
      });

      expect(out.type).toBe("ok");
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
    });
  });
});
