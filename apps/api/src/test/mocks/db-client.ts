import { vi } from "vitest";

export const testDb = {
  query: {
    usersTable: { findFirst: vi.fn() },
    videosTable: { findFirst: vi.fn(), findMany: vi.fn() },
    commentsTable: { findFirst: vi.fn(), findMany: vi.fn() },
  },
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  select: vi.fn(),
};

function wireChains() {
  testDb.insert.mockImplementation(() => ({
    values: vi.fn(() => Promise.resolve()),
  }));

  testDb.update.mockImplementation(() => ({
    set: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve()),
    })),
  }));

  testDb.delete.mockImplementation(() => ({
    where: vi.fn(() => {
      const p = Promise.resolve();
      return Object.assign(p, {
        returning: vi.fn(() => Promise.resolve([])),
      });
    }),
  }));

  testDb.select.mockImplementation(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve([{ value: "0" }])),
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
    set: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve(rows)),
      })),
    })),
  }));
}

export function wireDeleteReturning(rows: unknown[]) {
  testDb.delete.mockImplementation(() => ({
    where: vi.fn(() => {
      const p = Promise.resolve();
      return Object.assign(p, {
        returning: vi.fn(() => Promise.resolve(rows)),
      });
    }),
  }));
}

export function wireSelectTotal(total: number) {
  testDb.select.mockImplementation(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve([{ value: String(total) }])),
    })),
  }));
}

wireChains();
