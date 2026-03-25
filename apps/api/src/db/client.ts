import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

let queryClient: postgres.Sql | null = null;
let drizzleClient: ReturnType<typeof drizzle<typeof schema>> | null = null;

function connectDatabase() {
  const databaseUrl =
    process.env.DATABASE_URL ??
    "postgresql://watch_user:watch_pass@localhost:5432/watch_brasil";

  if (!queryClient || !drizzleClient) {
    queryClient = postgres(databaseUrl, {
      max: 10,
      prepare: false,
    });
    drizzleClient = drizzle(queryClient, { schema });
  }

  return drizzleClient;
}

export const db = connectDatabase();
