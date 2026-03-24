import cors from "@fastify/cors";
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
import { usersRoute } from "./modules/users/users.route.js";
import { videosRoute } from "./modules/videos/videos.route.js";

export const app = Fastify({ logger: true });

//Config zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, { origin: true });

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
