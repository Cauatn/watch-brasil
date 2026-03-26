import { jest } from "@jest/globals";

type AsyncFnMock = jest.Mock<(...args: unknown[]) => Promise<unknown>>;

type SyncFnMock = jest.Mock<(...args: unknown[]) => unknown>;

function asyncMock(): AsyncFnMock {
  return jest.fn<(...args: unknown[]) => Promise<unknown>>();
}

function chainMock(): SyncFnMock {
  return jest.fn<(...args: unknown[]) => unknown>();
}

function deleteWhereChain(returningRows: unknown[] = []) {
  const base = Promise.resolve(undefined);
  const ret = jest.fn<(...args: unknown[]) => Promise<unknown>>();
  ret.mockResolvedValue(returningRows);
  return Object.assign(base, { returning: ret });
}

export const testDb = {
  query: {
    usersTable: { findFirst: asyncMock() },
    videosTable: { findFirst: asyncMock(), findMany: asyncMock() },
    commentsTable: { findFirst: asyncMock(), findMany: asyncMock() },
  },
  insert: chainMock(),
  update: chainMock(),
  delete: chainMock(),
  select: chainMock(),
};

function wireInsertMock() {
  testDb.insert.mockImplementation(() => ({
    values: jest
      .fn<(...args: unknown[]) => Promise<unknown>>()
      .mockResolvedValue(undefined),
  }));
}

function wireUpdateMock() {
  testDb.update.mockImplementation(() => ({
    set: jest.fn().mockReturnValue({
      where: jest
        .fn<(...args: unknown[]) => Promise<unknown>>()
        .mockResolvedValue(undefined),
    }),
  }));
}

function wireDeleteMock(returningDefault: unknown[] = []) {
  testDb.delete.mockImplementation(() => ({
    where: jest.fn().mockImplementation(() => deleteWhereChain(returningDefault)),
  }));
}

function wireSelectMock(totalValue = 0) {
  testDb.select.mockImplementation(() => ({
    from: jest.fn().mockReturnValue({
      where: jest
        .fn<(...args: unknown[]) => Promise<unknown>>()
        .mockResolvedValue([{ value: String(totalValue) }]),
    }),
  }));
}

export function resetDbMock() {
  jest.clearAllMocks();
  wireInsertMock();
  wireUpdateMock();
  wireDeleteMock([]);
  wireSelectMock(0);
}

export const dbMockHelpers = {
  deleteWhereChain,
  wireUpdateReturningMock(rows: unknown[]) {
    testDb.update.mockImplementation(() => ({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest
            .fn<(...args: unknown[]) => Promise<unknown>>()
            .mockResolvedValue(rows),
        }),
      }),
    }));
  },
  wireDeleteMock,
  wireSelectMock,
};

resetDbMock();
