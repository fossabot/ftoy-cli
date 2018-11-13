import * as Koa from "koa";
import { getPortPromise } from "portfinder";
import { Command } from "../utils/command";
import { Browser } from "../utils/browser";
import { Project } from "../utils/project";
import { IComponent } from "../interface/IComponent";
import { readdirSync, statSync } from "fs";
import { resolve, posix } from "path";
import { Directory } from "../utils/directory";
import { Git } from "../utils/git";
import { Component } from "../utils/component";

const app = new Koa();

app.use(async ctx => {
  const allComponents: IComponent[] = await Component.getAllComponents();

  ctx.body = allComponents;
});

getPortPromise({ startPort: 3000 }).then(port => {
  app.listen(port);
  Browser.open(`http://localhost:${port}`);
});
