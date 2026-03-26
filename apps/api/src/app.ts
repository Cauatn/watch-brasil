import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { authRoute } from "./modules/auth/auth.route.js";
import { commentsRoute } from "./modules/comments/comments.route.js";
import { reportsRoute } from "./modules/reports/reports.route.js";
import { tasksRoute } from "./modules/tasks/tasks.route.js";
import { usersRoute } from "./modules/users/users.route.js";
import { videosRoute } from "./modules/videos/videos.route.js";
import { authGuardPlugin } from "./plugins/auth-guard.js";

export const app = Fastify({ logger: true });

//Config zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//Config cors basica para o projeto
app.register(cors, {
  origin: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
});

app.register(jwt, {
  secret: process.env.JWT_SECRET ?? "watch-brasil-dev-secret",
});
app.register(authGuardPlugin);

app.register(swagger, {
  openapi: {
    info: {
      title: "Watch Brasil API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
});

app.register(swaggerUi, { routePrefix: "/docs" });

app.register(async (api) => api.get("/health", async () => ({ status: "ok" })));

app.register(authRoute);
app.register(usersRoute);
app.register(videosRoute);
app.register(commentsRoute);
app.register(tasksRoute);
app.register(reportsRoute);

//Erros handling de schemas com zod
app.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: "Bad Request",
      message: "Request doesn't match the schema",
      details: error.validation,
    });
  }

  request.log.error(error);

  return reply.code(500).send({
    error: "Internal Server Error",
    message: "Unexpected error",
  });
});
