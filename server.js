const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const adminRouter = require("./app/routes/admin.routes");
const serviceProviderRouter = require("./app/routes/serviceprovider.routes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const dbEmp = require("./database/database")
app.use(cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/update", (req, res) => {
  res.json({ message: "Welcome to sample application." });
});

app.get("/all",dbEmp.getEmployees)

app.use("/api/admin", adminRouter);
app.use("/api/serviceprovider", serviceProviderRouter);

const options = {
  "definition": {
    "openapi": "3.0.0",
    "info": {
      "title": "Express API with Swagger",
      "version": "0.1.0",
      "description": "This is a simple CRUD API application made with Express and documented with Swagger",
      "license": {
        "name": "MIT",
        "url": "https://spdx.org/licenses/MIT.html"
      },
      "contact": {
        "name": "Frank Gaston",
        "url": "https://github.com/vinhhung263",
        "email": "hungpv263@gmail.com"
      }
    },
    "components": {
      "securitySchemes": {
        "BearerAuth": {
          "type": "http",
          "scheme": "bearer"
        },
      },
    },
    "servers": [
      {
        // "url": "http://159.89.161.169:3008/api"
        "url": "http://localhost:3008/api"
      }
    ]
  },
  "apis": [
    "./app/routes/serviceprovider.routes.js"
  ]
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);


// set port, listen for requests
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
