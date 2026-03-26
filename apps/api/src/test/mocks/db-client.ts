import { db } from "../../db/client.js";

export const testDb = db as Record<string, any>;

function wireChains() {
  testDb.insert.mockImplementation(() => ({
    values: jest.fn(() => Promise.resolve()),
  }));

  testDb.update.mockImplementation(() => ({
    set: jest.fn(() => ({
      where: jest.fn(() => Promise.resolve()),
    })),
  }));

  testDb.delete.mockImplementation(() => ({
    where: jest.fn(() => {
      const p = Promise.resolve();
      return Object.assign(p, {
        returning: jest.fn(() => Promise.resolve([])),
      });
    }),
  }));

  testDb.select.mockImplementation(() => ({
    from: jest.fn(() => ({
      where: jest.fn(() => Promise.resolve([{ value: "0" }])),
    })),
  }));
}

export function resetDbMock() {
  for (const table of Object.values(testDb.query)) {
    for (const fn of Object.values(table as Record<string, jest.Mock>))
      fn.mockReset();
  }
  testDb.insert.mockReset();
  testDb.update.mockReset();
  testDb.delete.mockReset();
  testDb.select.mockReset();
  wireChains();
}

export function wireUpdateReturning(rows: unknown[]) {
  testDb.update.mockImplementation(() => ({
    set: jest.fn(() => ({
      where: jest.fn(() => ({
        returning: jest.fn(() => Promise.resolve(rows)),
      })),
    })),
  }));
}

export function wireDeleteReturning(rows: unknown[]) {
  testDb.delete.mockImplementation(() => ({
    where: jest.fn(() => {
      const p = Promise.resolve();
      return Object.assign(p, {
        returning: jest.fn(() => Promise.resolve(rows)),
      });
    }),
  }));
}

export function wireSelectTotal(total: number) {
  testDb.select.mockImplementation(() => ({
    from: jest.fn(() => ({
      where: jest.fn(() => Promise.resolve([{ value: String(total) }])),
    })),
  }));
}

wireChains();
