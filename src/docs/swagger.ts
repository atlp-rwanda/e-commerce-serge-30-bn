import { Application, Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce-Serge-30 API",
      version: "1.0.0",
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development Server',
      },
      {
        url: 'https://staging-e-commerce-serge-30-bn.onrender.com',
        description: 'Staging Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          description: "Bearer token authorization"
        },
      },
    },
  },
  apis: ["./src/docs/documentation.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application, port: number) {

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: `
          ${fs.readFileSync("./src/docs/swaggerDark.css")}
        `,
    })
  );
  
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;