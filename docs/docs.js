// options swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application Site",
      description: "Open APi Definition For Job Portal Application",
      version: 1.0,
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Developer Server",
      },
      {
        url: "http://prod/api",
        description: "Production Server",
      },
    ],
  },
  securityDefinitions: {
    apiKey: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },

  apis: ["./routes/*.js"],
  security: [{ apiKey: [] }],
};
export default options;
