class l extends Error {
  status;
  json;
  constructor(e, t) {
    super(`Error ${e} received from the API`), this.name = "APIError", this.status = e, this.json = t;
  }
}
const u = "0.0.0";
function p() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "360-plugin-client-sdk-version": u
  };
}
function c(o) {
  return {
    Authorization: `Bearer ${o}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    "360-api-version": "v2.0",
    "360-plugin-client-sdk-version": u
  };
}
const d = "plugin:connectionDetails", T = "plugin:requestConnectionDetails", f = 1e3 * 60;
async function E() {
  return new Promise((o, e) => {
    const t = setTimeout(a, f);
    window.addEventListener("message", n, !1), window.parent.postMessage({
      type: T,
      version: 1
    }, "*");
    function n(s) {
      s.data.version === 1 && s.data.type === d && (o({
        apiBaseUrl: s.data.apiBaseUrl,
        temporaryToken: s.data.token
      }), clearTimeout(t), window.removeEventListener("message", n));
    }
    function a() {
      window.removeEventListener("message", n), e();
    }
  });
}
const w = "api/v2/plugin/oauth2/client-token", A = 401;
class _ {
  accessToken = "";
  apiBaseUrl = "";
  async fetch(e, t = {}) {
    const n = this.buildApiUrl(e), a = h(t), s = await this.doFetch(n, a), r = await s.json();
    if (!s.ok)
      throw new l(s.status, r);
    return r;
    function h(i) {
      return "body" in i ? {
        ...i,
        body: JSON.stringify(i.body)
      } : i;
    }
  }
  getAccessToken() {
    return this.accessToken;
  }
  async init() {
    await this.authenticate();
  }
  async authenticate() {
    const { apiBaseUrl: e, temporaryToken: t } = await E();
    this.apiBaseUrl = e, await this.connect(t);
  }
  buildApiUrl(e) {
    return `${this.apiBaseUrl}/${e}`;
  }
  async connect(e) {
    const t = this.buildApiUrl(w), n = await y(t, e);
    this.accessToken = n;
  }
  async doFetch(e, t = {}) {
    const n = await fetch(e, {
      ...t,
      headers: c(this.accessToken)
    });
    return !n.ok && n.status === A ? (await this.authenticate(), fetch(e, {
      ...t,
      headers: c(this.accessToken)
    })) : n;
  }
}
async function y(o, e) {
  const t = await fetch(o, {
    method: "POST",
    headers: p(),
    body: JSON.stringify({ temporaryToken: e })
  });
  if (!t.ok)
    throw new Error("API authentication failed.");
  return (await t.json()).access_token;
}
function k() {
  return new _();
}
export {
  k as createSDK
};
