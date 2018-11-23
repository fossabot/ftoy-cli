import { watch } from "fs";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import * as KoaStatic from "koa-static";
import Open = require("opn");
import { join, posix } from "path";
import { getPortPromise } from "portfinder";
import { format } from "url";
import { Server } from "ws";
import { IComponent } from "../interface/IComponent";
import { Component } from "../utils/component";
import { Directory } from "../utils/directory";
import { Project } from "../utils/project";
import { generateTable } from "../utils/table";

export class MockRouter {
  public app = new Koa();
  public router = new KoaRouter();
  public koaPort: number = 0;
  public wsPort: number = 0;
  public url: string = "";

  public async bootstrap() {
    this.koaPort = await getPortPromise({ port: 8000 });
    this.wsPort = await getPortPromise({ port: 8080 });

    this.app.use(this.cors);
    this.route();
    this.app.use(KoaStatic("."));
    this.app.use(this.router.routes()).use(this.router.allowedMethods());

    await this.startKoaServer();
    this.initUrl();
    this.startWSServer();
  }

  public async cors(ctx: Koa.Context, next: () => Promise<any>) {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , compress",
    );
    ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");

    await next();
  }

  public route() {
    this.router.get("/component/list", async (ctx, next) => {
      const allComponents: IComponent[] = (await Component.getAllComponents())
        .filter((e) => Directory.exist(join(e.path, "bundle.js")))
        .map((e) =>
          Object.assign(e, {
            cdnpath: format({
              protocol: "http",
              hostname: "localhost",
              port: this.koaPort,
              pathname: posix.join(e.path, "bundle.js"),
            }),
          }),
        );
      ctx.body = allComponents;
    });
  }

  public startWSServer() {
    const wss = new Server(
      {
        port: this.wsPort,
        perMessageDeflate: false,
      },
      () => Open(this.url),
    );
    wss.on("connection", (ws) => {
      if (Directory.exist(Project.distDir)) {
        const watcher = watch(
          Project.distDir,
          {
            recursive: true,
            encoding: "utf8",
          },
          (event, name) => ws.send(name),
        );
        ws.on("close", () => watcher.close());
      }
    });
  }

  public startKoaServer() {
    return new Promise((resolve, reject) => {
      this.app
        .listen(this.koaPort, () => resolve())
        .on("error", (e) => reject(e));
    });
  }

  public initUrl() {
    this.url = `http://ftoy.58corp.com/#/editor/development?port=${
      this.koaPort
    }&wss=${this.wsPort}`;

    process.stdout.write(
      generateTable([
        ["服务启动成功", ""],
        ["服务端口", this.koaPort],
        ["监听端口", this.wsPort],
        ["访问地址", this.url],
      ]),
    );
  }
}

(async () => {
  await new MockRouter().bootstrap();
})();
