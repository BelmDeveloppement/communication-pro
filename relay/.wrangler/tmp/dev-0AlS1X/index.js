var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-t4BDD8/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/index.js
import { DurableObject as DurableObject2 } from "cloudflare:workers";

// src/hub.js
import { DurableObject } from "cloudflare:workers";
var MAX = 65536;
var KEEP = 1500;
var TOTAL = 9e5;
var TTL = 24 * 3600 * 1e3;
var Hub = class extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
  }
  async fetch(req) {
    if (req.method === "POST") {
      const t = new URL(req.url).searchParams.get("t") || "", body = await req.text();
      if (!/^[\w-]{1,60}$/.test(t) || !body || body.length > 4096)
        return new Response("Requ\xEAte invalide", { status: 400 });
      const n = await this.publish(t, body, null);
      return new Response(JSON.stringify({ ok: 1, n }), { status: 200, headers: { "content-type": "application/json" } });
    }
    if (req.headers.get("Upgrade") !== "websocket")
      return new Response("WebSocket attendu", { status: 426 });
    const pair = new WebSocketPair();
    const [cli, srv] = Object.values(pair);
    this.ctx.acceptWebSocket(srv);
    srv.serializeAttachment({ subs: [] });
    await this.ctx.storage.setAlarm(Date.now() + TTL);
    return new Response(null, { status: 101, webSocket: cli });
  }
  async load(t) {
    return await this.ctx.storage.get("t:" + t) || { seq: 0, list: [] };
  }
  async webSocketMessage(ws, raw) {
    if (typeof raw !== "string" || raw.length > MAX)
      return;
    let o;
    try {
      o = JSON.parse(raw);
    } catch (e) {
      return;
    }
    if (!o || typeof o.t !== "string" || !/^[\w-]{1,60}$/.test(o.t))
      return;
    const a = ws.deserializeAttachment() || { subs: [] };
    if (o.a === "sub") {
      if (!a.subs.includes(o.t)) {
        a.subs.push(o.t);
        ws.serializeAttachment(a);
      }
      const st = await this.load(o.t), since = Number.isFinite(+o.since) ? +o.since : 0;
      for (const x of st.list)
        if (x.id > since) {
          try {
            ws.send(JSON.stringify({ a: "msg", t: o.t, id: x.id, m: x.m, ts: x.ts }));
          } catch (e) {
          }
        }
      return;
    }
    if (o.a !== "pub" || typeof o.m !== "string")
      return;
    const n = await this.publish(o.t, o.m, ws);
    if (o.u) {
      try {
        ws.send(JSON.stringify({ a: "ack", u: o.u, n }));
      } catch (e) {
      }
    }
  }
  // Publie un message sur un sujet (WebSocket ou HTTP) ; renvoie le nombre d'abonnés atteints (hors l'émetteur `from`).
  async publish(t, m, from) {
    const st = await this.load(t);
    st.seq++;
    const item = { id: st.seq, m, ts: Date.now() };
    if (t.endsWith("h")) {
      let p = null;
      try {
        p = JSON.parse(m);
      } catch (e) {
      }
      if (p && p.v != null) {
        st.list = st.list.filter((x) => {
          try {
            const q = JSON.parse(x.m);
            return q.v >= p.v && !(q.v === p.v && q.i === p.i);
          } catch (e) {
            return false;
          }
        });
      }
    }
    st.list.push(item);
    if (t.endsWith("s"))
      st.list = st.list.slice(-1);
    while (st.list.length > KEEP || st.list.reduce((s, x) => s + x.m.length, 0) > TOTAL)
      st.list.shift();
    await this.ctx.storage.put("t:" + t, st);
    await this.ctx.storage.setAlarm(Date.now() + TTL);
    let n = 0;
    for (const w of this.ctx.getWebSockets()) {
      const s = w.deserializeAttachment() || { subs: [] };
      if (s.subs.includes(t)) {
        if (w !== from)
          n++;
        try {
          w.send(JSON.stringify({ a: "msg", t, id: item.id, m: item.m, ts: item.ts }));
        } catch (e) {
        }
      }
    }
    return n;
  }
  webSocketClose(ws) {
    try {
      ws.close();
    } catch (e) {
    }
  }
  webSocketError(ws) {
    this.webSocketClose(ws);
  }
  async alarm() {
    await this.ctx.storage.deleteAll();
  }
};
__name(Hub, "Hub");

// src/index.js
var ORIGINES = ["https://belmdeveloppement.github.io", "http://localhost:8765", "http://127.0.0.1:8765", "http://localhost:8787"];
var MAX2 = 65536;
var src_default = {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname !== "/ws" && url.pathname !== "/ps" && url.pathname !== "/pub")
      return new Response("Relais des JEUX : en service.", { status: 200 });
    const origin = req.headers.get("Origin");
    if (origin && !ORIGINES.includes(origin) && !String(env.ORIGINES_EXTRA || "").split(",").includes(origin))
      return new Response("Origine refus\xE9e", { status: 403 });
    if (url.pathname === "/pub") {
      if (req.method !== "POST")
        return new Response("POST attendu", { status: 405 });
      const code = (url.searchParams.get("room") || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 40);
      if (code.length < 6)
        return new Response("Param\xE8tres manquants", { status: 400 });
      return env.HUB.get(env.HUB.idFromName("ps:" + code)).fetch(new Request("https://hub/pub?t=" + encodeURIComponent(url.searchParams.get("t") || ""), { method: "POST", body: await req.text() }));
    }
    if (req.headers.get("Upgrade") !== "websocket")
      return new Response("WebSocket attendu", { status: 426 });
    if (url.pathname === "/ps") {
      const code = (url.searchParams.get("room") || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 40);
      if (code.length < 6)
        return new Response("Param\xE8tres manquants", { status: 400 });
      return env.HUB.get(env.HUB.idFromName("ps:" + code)).fetch(new Request("https://hub/ps", req));
    }
    const room = (url.searchParams.get("room") || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
    const role = url.searchParams.get("role") === "host" ? "host" : "client";
    const sid = (url.searchParams.get("sid") || "").replace(/[^\w-]/g, "").slice(0, 40);
    if (!room || role === "client" && !sid)
      return new Response("Param\xE8tres manquants", { status: 400 });
    const stub = env.ROOM.get(env.ROOM.idFromName(room));
    return stub.fetch(new Request("https://room/ws?role=" + role + "&sid=" + sid, req));
  }
};
var Room = class extends DurableObject2 {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
  }
  hosts() {
    return this.ctx.getWebSockets("h");
  }
  tell(list, up) {
    const m = JSON.stringify({ __ctl: "host", up });
    list.forEach((w) => {
      try {
        w.send(m);
      } catch (e) {
      }
    });
  }
  async fetch(req) {
    const url = new URL(req.url);
    const role = url.searchParams.get("role"), sid = url.searchParams.get("sid");
    const pair = new WebSocketPair();
    const [cli, srv] = Object.values(pair);
    if (role === "host") {
      this.hosts().forEach((w) => {
        try {
          w.close(4001, "remplac\xE9");
        } catch (e) {
        }
      });
      this.ctx.acceptWebSocket(srv, ["h"]);
      srv.serializeAttachment({ role });
      this.tell(this.ctx.getWebSockets().filter((w) => w.deserializeAttachment()?.role === "client"), true);
    } else {
      this.ctx.getWebSockets("c:" + sid).forEach((w) => {
        try {
          w.close(4001, "remplac\xE9");
        } catch (e) {
        }
      });
      this.ctx.acceptWebSocket(srv, ["c:" + sid]);
      srv.serializeAttachment({ role, sid });
      this.tell([srv], this.hosts().length > 0);
    }
    return new Response(null, { status: 101, webSocket: cli });
  }
  webSocketMessage(ws, msg) {
    if (typeof msg !== "string" || msg.length > MAX2)
      return;
    const a = ws.deserializeAttachment() || {};
    if (a.role === "client") {
      this.hosts().forEach((h) => {
        try {
          h.send(msg);
        } catch (e) {
        }
      });
      return;
    }
    let o;
    try {
      o = JSON.parse(msg);
    } catch (e) {
      return;
    }
    if (!o || typeof o.to !== "string")
      return;
    const m = JSON.stringify(o.m);
    this.ctx.getWebSockets("c:" + o.to).forEach((c) => {
      try {
        c.send(m);
      } catch (e) {
      }
    });
  }
  webSocketClose(ws) {
    try {
      ws.close();
    } catch (e) {
    }
    const a = ws.deserializeAttachment() || {};
    if (a.role === "host" && this.hosts().filter((w) => w !== ws).length === 0)
      this.tell(this.ctx.getWebSockets().filter((w) => w.deserializeAttachment()?.role === "client"), false);
  }
  webSocketError(ws) {
    this.webSocketClose(ws);
  }
};
__name(Room, "Room");

// ../../.npm/_npx/0eedb5afd4158ff3/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../.npm/_npx/0eedb5afd4158ff3/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-t4BDD8/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../.npm/_npx/0eedb5afd4158ff3/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-t4BDD8/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  Hub,
  Room,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
