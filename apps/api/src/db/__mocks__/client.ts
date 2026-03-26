export const db = {
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
