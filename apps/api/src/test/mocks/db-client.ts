import { jest } from "@jest/globals";

function deleteWhereChain(returningRows: unknown[] = []) {
  const base = Promise.resolve(undefined);
  return Object.assign(base, {
    returning: jest.fn().mockResolvedValue(returningRows),
  });
}

export const testDb = {
  query: {
    usersTable: { findFirst: jest.fn() },
    videosTable: { findFirst: jest.fn(), findMany: jest.fn() },
    commentsTable: { findFirst: jest.fn(), findMany: jest.fn() },
  },
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  select: jest.fn(),
};

function wireInsertMock() {
  testDb.insert.mockImplementation(() => ({
    values: jest.fn().mockResolvedValue(undefined),
  }));
}

function wireUpdateMock() {
  testDb.update.mockImplementation(() => ({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
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
      where: jest.fn().mockResolvedValue([{ value: String(totalValue) }]),
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
          returning: jest.fn().mockResolvedValue(rows),
        }),
      }),
    }));
  },
  wireDeleteMock,
  wireSelectMock,
};

resetDbMock();
