import { mock } from "bun:test";

export const testDb = {
  query: {
    usersTable: { findFirst: mock() },
    videosTable: { findFirst: mock(), findMany: mock() },
    commentsTable: { findFirst: mock(), findMany: mock() },
  },
  insert: mock(),
  update: mock(),
  delete: mock(),
  select: mock(),
};

function wireChains() {
  testDb.insert.mockImplementation(() => ({
    values: mock(() => Promise.resolve()),
  }));

  testDb.update.mockImplementation(() => ({
    set: mock(() => ({
      where: mock(() => Promise.resolve()),
    })),
  }));

  testDb.delete.mockImplementation(() => ({
    where: mock(() => {
      const p = Promise.resolve();
      return Object.assign(p, {
        returning: mock(() => Promise.resolve([])),
      });
    }),
  }));

  testDb.select.mockImplementation(() => ({
    from: mock(() => ({
      where: mock(() => Promise.resolve([{ value: "0" }])),
    })),
  }));
}

export function resetDbMock() {
  for (const table of Object.values(testDb.query)) {
    for (const fn of Object.values(table)) fn.mockReset();
  }
  testDb.insert.mockReset();
  testDb.update.mockReset();
  testDb.delete.mockReset();
  testDb.select.mockReset();
  wireChains();
}

export function wireUpdateReturning(rows: unknown[]) {
  testDb.update.mockImplementation(() => ({
    set: mock(() => ({
      where: mock(() => ({
        returning: mock(() => Promise.resolve(rows)),
      })),
    })),
  }));
}

export function wireDeleteReturning(rows: unknown[]) {
  testDb.delete.mockImplementation(() => ({
    where: mock(() => {
      const p = Promise.resolve();
      return Object.assign(p, {
        returning: mock(() => Promise.resolve(rows)),
      });
    }),
  }));
}

export function wireSelectTotal(total: number) {
  testDb.select.mockImplementation(() => ({
    from: mock(() => ({
      where: mock(() => Promise.resolve([{ value: String(total) }])),
    })),
  }));
}

wireChains();
