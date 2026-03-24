import { usersRepository } from "./users.repository.js";

export const usersService = {
  getMe: (userId: string) => usersRepository.findById(userId),
  updateMe: (userId: string, input: { name?: string; password?: string }) =>
    usersRepository.update(userId, input),
  deleteMe: (userId: string) => usersRepository.delete(userId),
};
