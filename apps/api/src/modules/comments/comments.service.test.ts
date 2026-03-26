jest.mock("../../db/client.js");

import {
  testDb,
  resetDbMock,
  wireSelectTotal,
} from "../../test/mocks/db-client.js";
import { commentsService } from "./comments.service.js";

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
  status: "ready" as const,
  uploadedById: "u1",
  createdAt: new Date("2024-02-01T00:00:00.000Z"),
};

const commentRow = {
  id: "c1",
  videoId: "v1",
  authorId: "u1",
  content: "Otimo",
  createdAt: new Date("2024-03-01T00:00:00.000Z"),
};

describe("commentsService", () => {
  beforeEach(() => {
    resetDbMock();
    testDb.query.videosTable.findFirst.mockResolvedValue(videoRow);
  });

  describe("list", () => {
    it("video_not_found quando video nao existe", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue(undefined);

      const out = await commentsService.list({
        videoId: "x",
        page: 1,
        limit: 10,
      });

      expect(out).toEqual({ type: "video_not_found" });
    });

    it("retorna comentarios e autores", async () => {
      testDb.query.commentsTable.findMany.mockResolvedValue([commentRow]);
      wireSelectTotal(1);
      testDb.query.usersTable.findFirst.mockResolvedValue(userRow);

      const out = await commentsService.list({
        videoId: "v1",
        page: 1,
        limit: 10,
      });

      if (out.type !== "ok") throw new Error("expected ok");
      expect(out.data[0]?.content).toBe("Otimo");
      expect(out.data[0]?.author?.email).toBe("ana@test.com");
    });
  });

  describe("create", () => {
    it("video_not_found", async () => {
      testDb.query.videosTable.findFirst.mockResolvedValue(undefined);

      const out = await commentsService.create({
        videoId: "v1",
        actorId: "u1",
        content: "Oi",
      });

      expect(out).toEqual({ type: "video_not_found" });
    });

    it("cria e devolve autor", async () => {
      testDb.query.commentsTable.findFirst.mockResolvedValue(commentRow);
      testDb.query.usersTable.findFirst.mockResolvedValue(userRow);

      const out = await commentsService.create({
        videoId: "v1",
        actorId: "u1",
        content: "Oi",
      });

      if (out.type !== "ok") throw new Error("expected ok");
      expect(out.comment.author?.name).toBe("Ana");
      expect(testDb.insert).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("forbidden quando nao e o autor", async () => {
      testDb.query.commentsTable.findFirst.mockResolvedValue({
        ...commentRow,
        authorId: "outro",
      });

      const out = await commentsService.delete({
        videoId: "v1",
        commentId: "c1",
        actorId: "u1",
      });

      expect(out).toEqual({ type: "forbidden" });
    });

    it("ok quando autor remove", async () => {
      testDb.query.commentsTable.findFirst.mockResolvedValue(commentRow);

      const out = await commentsService.delete({
        videoId: "v1",
        commentId: "c1",
        actorId: "u1",
      });

      expect(out).toEqual({ type: "ok" });
    });
  });
});
