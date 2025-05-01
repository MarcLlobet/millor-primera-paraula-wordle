import express from "express";
import { millorEntrada } from "../logic";

export const app = express();

app.get("/api", (_, res) => res.json({ millorEntrada }));

if (!process.env["VITE"]) {
  const frontendFiles = process.cwd() + "/dist";
  app.use(express.static(frontendFiles));
  app.get("/*", (_, res) => {
    res.send(frontendFiles + "/index.html");
  });
  app.listen(process.env["PORT"]);
}
