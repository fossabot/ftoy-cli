import { watch } from "fs";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import * as KoaStatic from "koa-static";
import { posix } from "path";
import { getPortPromise } from "portfinder";
import { format } from "url";
import { IComponent } from "../interface/IComponent";
import { Browser } from "../utils/browser";
import { Component } from "../utils/component";
import { Project } from "../utils/project";
import { generateTable } from "../utils/table";

export class MockRouter {
  public app = new Koa();
  public router = new KoaRouter();
  public port: number = 0;

  public async bootstrap() {
    this.port = await getPortPromise({ startPort: 8000 });

    this.app.use(this.cors);
    this.app.use(KoaStatic("."));
    this.route();
    this.app.use(this.router.routes()).use(this.router.allowedMethods());

    this.app.listen(this.port, () => {
      const url = `http://dev.58corp.com:8080/#/editor/development?port=${
        this.port
      }`;
      process.stdout.write(
        generateTable([
          ["服务启动成功", ""],
          ["服务端口", this.port],
          ["访问地址", url],
        ]),
      );
      Browser.open(url);
      watch(
        Project.distDir,
        {
          recursive: true,
          encoding: "utf8",
        },
        (event, name) => {
          // console.log(event, name);
        },
      );
    });
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
      const allComponents: IComponent[] = (await Component.getAllComponents()).map(
        (e) =>
          Object.assign(e, {
            cdnpath: format({
              protocol: "http",
              hostname: "localhost",
              port: this.port,
              pathname: posix.join(e.path, "bundle.js"),
            }),
          }),
      );
      ctx.body = allComponents;
    });
  }
}

(async () => {
  await new MockRouter().bootstrap();
})();
