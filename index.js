import dotenv from "dotenv";
import debug from "debug";
import drive from "./src/libs/google/drive.js";
import app from "./src/www/index.js";

dotenv.config();
debug.enable(process.env.DEBUG || "*");

const port = process.env.PORT || 3000;
const log = debug("app");

app.listen(port, () => {
  log("Server is listening on port:", port);

  drive.init().then(async (client) => {
    log("Google drive authorize:", client._clientId);
  });
});
