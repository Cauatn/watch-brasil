import { beforeEach } from "@jest/globals";
import { resetDbMock } from "./mocks/db-client.js";

beforeEach(() => {
  resetDbMock();
});
