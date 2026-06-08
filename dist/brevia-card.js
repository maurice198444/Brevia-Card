/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, st = F.ShadowRoot && (F.ShadyCSS === void 0 || F.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, nt = Symbol(), mt = /* @__PURE__ */ new WeakMap();
let Pt = class {
  constructor(t, i, a) {
    if (this._$cssResult$ = !0, a !== nt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (st && t === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (t = mt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && mt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const qt = (e) => new Pt(typeof e == "string" ? e : e + "", void 0, nt), _ = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((a, r, s) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[s + 1], e[0]);
  return new Pt(i, e, nt);
}, Wt = (e, t) => {
  if (st) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const a = document.createElement("style"), r = F.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = i.cssText, e.appendChild(a);
  }
}, vt = st ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const a of t.cssRules) i += a.cssText;
  return qt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ft, defineProperty: Yt, getOwnPropertyDescriptor: Kt, getOwnPropertyNames: Zt, getOwnPropertySymbols: Gt, getPrototypeOf: Xt } = Object, G = globalThis, bt = G.trustedTypes, Jt = bt ? bt.emptyScript : "", Qt = G.reactiveElementPolyfillSupport, L = (e, t) => e, Y = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Jt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, ot = (e, t) => !Ft(e, t), ft = { attribute: !0, type: String, converter: Y, reflect: !1, useDefault: !1, hasChanged: ot };
Symbol.metadata ??= Symbol("metadata"), G.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = ft) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const a = Symbol(), r = this.getPropertyDescriptor(t, a, i);
      r !== void 0 && Yt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, a) {
    const { get: r, set: s } = Kt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: r, set(n) {
      const o = r?.call(this);
      s?.call(this, n), this.requestUpdate(t, o, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ft;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const t = Xt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const i = this.properties, a = [...Zt(i), ...Gt(i)];
      for (const r of a) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [a, r] of i) this.elementProperties.set(a, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, a] of this.elementProperties) {
      const r = this._$Eu(i, a);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const r of a) i.unshift(vt(r));
    } else t !== void 0 && i.push(vt(t));
    return i;
  }
  static _$Eu(t, i) {
    const a = i.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const a of i.keys()) this.hasOwnProperty(a) && (t.set(a, this[a]), delete this[a]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Wt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, a) {
    this._$AK(t, a);
  }
  _$ET(t, i) {
    const a = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, a);
    if (r !== void 0 && a.reflect === !0) {
      const s = (a.converter?.toAttribute !== void 0 ? a.converter : Y).toAttribute(i, a.type);
      this._$Em = t, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const a = this.constructor, r = a._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const s = a.getPropertyOptions(r), n = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : Y;
      this._$Em = r;
      const o = n.fromAttribute(i, s.type);
      this[r] = o ?? this._$Ej?.get(r) ?? o, this._$Em = null;
    }
  }
  requestUpdate(t, i, a, r = !1, s) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (s = this[t]), a ??= n.getPropertyOptions(t), !((a.hasChanged ?? ot)(s, i) || a.useDefault && a.reflect && s === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, a)))) return;
      this.C(t, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: a, reflect: r, wrapped: s }, n) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? i ?? this[t]), s !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, s] of this._$Ep) this[r] = s;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [r, s] of a) {
        const { wrapped: n } = s, o = this[r];
        n !== !0 || this._$AL.has(r) || o === void 0 || this.C(r, void 0, s, o);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[L("elementProperties")] = /* @__PURE__ */ new Map(), S[L("finalized")] = /* @__PURE__ */ new Map(), Qt?.({ ReactiveElement: S }), (G.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt = globalThis, gt = (e) => e, K = lt.trustedTypes, _t = K ? K.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Tt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, Mt = "?" + g, te = `<${Mt}>`, A = document, N = () => A.createComment(""), V = (e) => e === null || typeof e != "object" && typeof e != "function", ct = Array.isArray, ee = (e) => ct(e) || typeof e?.[Symbol.iterator] == "function", it = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, yt = /-->/g, $t = />/g, w = RegExp(`>|${it}(?:([^\\s"'>=/]+)(${it}*=${it}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), wt = /'/g, xt = /"/g, Ut = /^(?:script|style|textarea|title)$/i, ie = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), u = ie(1), E = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), At = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function Ot(e, t) {
  if (!ct(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _t !== void 0 ? _t.createHTML(t) : t;
}
const ae = (e, t) => {
  const i = e.length - 1, a = [];
  let r, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = U;
  for (let o = 0; o < i; o++) {
    const l = e[o];
    let d, p, c = -1, m = 0;
    for (; m < l.length && (n.lastIndex = m, p = n.exec(l), p !== null); ) m = n.lastIndex, n === U ? p[1] === "!--" ? n = yt : p[1] !== void 0 ? n = $t : p[2] !== void 0 ? (Ut.test(p[2]) && (r = RegExp("</" + p[2], "g")), n = w) : p[3] !== void 0 && (n = w) : n === w ? p[0] === ">" ? (n = r ?? U, c = -1) : p[1] === void 0 ? c = -2 : (c = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? w : p[3] === '"' ? xt : wt) : n === xt || n === wt ? n = w : n === yt || n === $t ? n = U : (n = w, r = void 0);
    const b = n === w && e[o + 1].startsWith("/>") ? " " : "";
    s += n === U ? l + te : c >= 0 ? (a.push(d), l.slice(0, c) + Tt + l.slice(c) + g + b) : l + g + (c === -2 ? o : b);
  }
  return [Ot(e, s + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class R {
  constructor({ strings: t, _$litType$: i }, a) {
    let r;
    this.parts = [];
    let s = 0, n = 0;
    const o = t.length - 1, l = this.parts, [d, p] = ae(t, i);
    if (this.el = R.createElement(d, a), x.currentNode = this.el.content, i === 2 || i === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = x.nextNode()) !== null && l.length < o; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(Tt)) {
          const m = p[n++], b = r.getAttribute(c).split(g), v = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: s, name: v[2], strings: b, ctor: v[1] === "." ? se : v[1] === "?" ? ne : v[1] === "@" ? oe : X }), r.removeAttribute(c);
        } else c.startsWith(g) && (l.push({ type: 6, index: s }), r.removeAttribute(c));
        if (Ut.test(r.tagName)) {
          const c = r.textContent.split(g), m = c.length - 1;
          if (m > 0) {
            r.textContent = K ? K.emptyScript : "";
            for (let b = 0; b < m; b++) r.append(c[b], N()), x.nextNode(), l.push({ type: 2, index: ++s });
            r.append(c[m], N());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Mt) l.push({ type: 2, index: s });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(g, c + 1)) !== -1; ) l.push({ type: 7, index: s }), c += g.length - 1;
      }
      s++;
    }
  }
  static createElement(t, i) {
    const a = A.createElement("template");
    return a.innerHTML = t, a;
  }
}
function C(e, t, i = e, a) {
  if (t === E) return t;
  let r = a !== void 0 ? i._$Co?.[a] : i._$Cl;
  const s = V(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== s && (r?._$AO?.(!1), s === void 0 ? r = void 0 : (r = new s(e), r._$AT(e, i, a)), a !== void 0 ? (i._$Co ??= [])[a] = r : i._$Cl = r), r !== void 0 && (t = C(e, r._$AS(e, t.values), r, a)), t;
}
class re {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: a } = this._$AD, r = (t?.creationScope ?? A).importNode(i, !0);
    x.currentNode = r;
    let s = x.nextNode(), n = 0, o = 0, l = a[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let d;
        l.type === 2 ? d = new z(s, s.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(s, l.name, l.strings, this, t) : l.type === 6 && (d = new le(s, this, t)), this._$AV.push(d), l = a[++o];
      }
      n !== l?.index && (s = x.nextNode(), n++);
    }
    return x.currentNode = A, r;
  }
  p(t) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, i), i += a.strings.length - 2) : a._$AI(t[i])), i++;
  }
}
class z {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, a, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = a, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = C(this, t, i), V(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ee(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && V(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: a } = t, r = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = R.createElement(Ot(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const s = new re(r, this), n = s.u(this.options);
      s.p(i), this.T(n), this._$AH = s;
    }
  }
  _$AC(t) {
    let i = At.get(t.strings);
    return i === void 0 && At.set(t.strings, i = new R(t)), i;
  }
  k(t) {
    ct(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, r = 0;
    for (const s of t) r === i.length ? i.push(a = new z(this.O(N()), this.O(N()), this, this.options)) : a = i[r], a._$AI(s), r++;
    r < i.length && (this._$AR(a && a._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const a = gt(t).nextSibling;
      gt(t).remove(), t = a;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class X {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, a, r, s) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = s, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = h;
  }
  _$AI(t, i = this, a, r) {
    const s = this.strings;
    let n = !1;
    if (s === void 0) t = C(this, t, i, 0), n = !V(t) || t !== this._$AH && t !== E, n && (this._$AH = t);
    else {
      const o = t;
      let l, d;
      for (t = s[0], l = 0; l < s.length - 1; l++) d = C(this, o[a + l], i, l), d === E && (d = this._$AH[l]), n ||= !V(d) || d !== this._$AH[l], d === h ? t = h : t !== h && (t += (d ?? "") + s[l + 1]), this._$AH[l] = d;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class se extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class ne extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class oe extends X {
  constructor(t, i, a, r, s) {
    super(t, i, a, r, s), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = C(this, t, i, 0) ?? h) === E) return;
    const a = this._$AH, r = t === h && a !== h || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, s = t !== h && (a === h || r);
    r && this.element.removeEventListener(this.name, this, a), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
let le = class {
  constructor(t, i, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
};
const ce = lt.litHtmlPolyfillSupport;
ce?.(R, z), (lt.litHtmlVersions ??= []).push("3.3.3");
const de = (e, t, i) => {
  const a = i?.renderBefore ?? t;
  let r = a._$litPart$;
  if (r === void 0) {
    const s = i?.renderBefore ?? null;
    a._$litPart$ = r = new z(t.insertBefore(N(), s), s, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = globalThis;
let k = class extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = de(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return E;
  }
};
k._$litElement$ = !0, k.finalized = !0, dt.litElementHydrateSupport?.({ LitElement: k });
const he = dt.litElementPolyfillSupport;
he?.({ LitElement: k });
(dt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ht = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = { attribute: !0, type: String, converter: Y, reflect: !1, hasChanged: ot }, pe = (e = ue, t, i) => {
  const { kind: a, metadata: r } = i;
  let s = globalThis.litPropertyMetadata.get(r);
  if (s === void 0 && globalThis.litPropertyMetadata.set(r, s = /* @__PURE__ */ new Map()), a === "setter" && ((e = Object.create(e)).wrapped = !0), s.set(i.name, e), a === "accessor") {
    const { name: n } = i;
    return { set(o) {
      const l = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(n, l, e, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(n, void 0, e, o), o;
    } };
  }
  if (a === "setter") {
    const { name: n } = i;
    return function(o) {
      const l = this[n];
      t.call(this, o), this.requestUpdate(n, l, e, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function me(e) {
  return (t, i) => typeof i == "object" ? pe(e, t, i) : ((a, r, s) => {
    const n = r.hasOwnProperty(s);
    return r.constructor.createProperty(s, a), n ? Object.getOwnPropertyDescriptor(r, s) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function J(e) {
  return me({ ...e, state: !0, attribute: !1 });
}
var Et, St;
(function(e) {
  e.language = "language", e.system = "system", e.comma_decimal = "comma_decimal", e.decimal_comma = "decimal_comma", e.space_comma = "space_comma", e.none = "none";
})(Et || (Et = {})), function(e) {
  e.language = "language", e.system = "system", e.am_pm = "12", e.twenty_four = "24";
}(St || (St = {}));
function ve(e) {
  return e.substr(0, e.indexOf("."));
}
var be = ["closed", "locked", "off"], D = function(e, t, i, a) {
  a = a || {}, i = i ?? {};
  var r = new Event(t, { bubbles: a.bubbles === void 0 || a.bubbles, cancelable: !!a.cancelable, composed: a.composed === void 0 || a.composed });
  return r.detail = i, e.dispatchEvent(r), r;
}, j = function(e) {
  D(window, "haptic", e);
}, fe = function(e, t, i) {
  i === void 0 && (i = !1), i ? history.replaceState(null, "", t) : history.pushState(null, "", t), D(window, "location-changed", { replace: i });
}, ge = function(e, t, i) {
  i === void 0 && (i = !0);
  var a, r = ve(t), s = r === "group" ? "homeassistant" : r;
  switch (r) {
    case "lock":
      a = i ? "unlock" : "lock";
      break;
    case "cover":
      a = i ? "open_cover" : "close_cover";
      break;
    default:
      a = i ? "turn_on" : "turn_off";
  }
  return e.callService(s, a, { entity_id: t });
}, _e = function(e, t) {
  var i = be.includes(e.states[t].state);
  return ge(e, t, i);
}, ye = function(e, t, i, a) {
  if (a || (a = { action: "more-info" }), !a.confirmation || a.confirmation.exemptions && a.confirmation.exemptions.some(function(s) {
    return s.user === t.user.id;
  }) || (j("warning"), confirm(a.confirmation.text || "Are you sure you want to " + a.action + "?"))) switch (a.action) {
    case "more-info":
      (i.entity || i.camera_image) && D(e, "hass-more-info", { entityId: i.entity ? i.entity : i.camera_image });
      break;
    case "navigate":
      a.navigation_path && fe(0, a.navigation_path);
      break;
    case "url":
      a.url_path && window.open(a.url_path);
      break;
    case "toggle":
      i.entity && (_e(t, i.entity), j("success"));
      break;
    case "call-service":
      if (!a.service) return void j("failure");
      var r = a.service.split(".", 2);
      t.callService(r[0], r[1], a.service_data, a.target), j("success");
      break;
    case "fire-dom-event":
      D(e, "ll-custom", a);
  }
}, $e = function(e, t, i, a) {
  var r;
  a === "double_tap" && i.double_tap_action ? r = i.double_tap_action : a === "hold" && i.hold_action ? r = i.hold_action : a === "tap" && i.tap_action && (r = i.tap_action), ye(e, t, i, r);
};
function kt(e) {
  return e !== void 0 && e.action !== "none";
}
const Lt = [
  "light",
  "climate",
  "media_player",
  "sensor"
], Nt = [
  "compact-row",
  "single-large",
  "master-tiles"
], Vt = [
  "neumorph",
  "glass",
  "editorial",
  "minimal",
  "cyber"
];
function ht(e) {
  if (!e) return "";
  const t = e.indexOf(".");
  return t === -1 ? "" : e.slice(0, t);
}
function Ct(e) {
  switch (ht(e)) {
    case "light":
      return "light";
    case "climate":
      return "climate";
    case "media_player":
      return "media_player";
    case "sensor":
    case "binary_sensor":
      return "sensor";
    default:
      return;
  }
}
function P(e) {
  return !e || e.state === "unavailable" || e.state === "unknown";
}
function we(e) {
  if (!e || ht(e.entity_id) !== "light") return !1;
  const t = e.attributes.supported_color_modes;
  return t && t.length ? t.some((i) => i !== "onoff") : "brightness" in e.attributes;
}
function Q(e, t) {
  return t || (e ? e.attributes.friendly_name ?? e.entity_id : "Unknown");
}
function xe(e, t) {
  if (!t) return;
  if (/^(https?:)?\/\//.test(t) || t.startsWith("data:")) return t;
  const i = e?.hassUrl;
  return typeof i == "function" ? i(t) : t;
}
function Ae(e, t = 1) {
  return Number(e.toFixed(t)).toString();
}
function Ee(e, t) {
  const { state: i } = e, a = e.attributes.unit_of_measurement, r = e.attributes.device_class;
  if (i === "unavailable" || i === "unknown") return "—";
  if (r === "timestamp") {
    const o = new Date(i);
    if (!Number.isNaN(o.getTime()))
      try {
        return o.toLocaleString(t?.locale?.language);
      } catch {
        return o.toLocaleString();
      }
  }
  const s = Number(i);
  if (!Number.isNaN(s) && i.trim() !== "") {
    const o = Se(s, t);
    return a ? `${o} ${a}` : o;
  }
  const n = ke(i.replace(/_/g, " "));
  return a ? `${n} ${a}` : n;
}
function Se(e, t) {
  const i = t?.locale?.language;
  try {
    return e.toLocaleString(i, { maximumFractionDigits: 2 });
  } catch {
    return Ae(e, 2);
  }
}
function ke(e) {
  return e.length ? e.charAt(0).toUpperCase() + e.slice(1) : e;
}
function Ce(e) {
  return e == null ? 0 : Math.round(e / 255 * 100);
}
class Pe {
  constructor() {
    this.domain = "light";
  }
  buildViewModel(t, i, a, r) {
    const s = t.state === "on", n = we(t), o = Ce(t.attributes.brightness), l = s ? Me(t) : void 0, d = Q(t, a.name), p = a.icon ?? t.attributes.icon ?? "mdi:lightbulb", c = s ? n ? `${o}%` : "On" : "Off", m = {
      name: d,
      icon: p,
      active: s,
      unavailable: P(t),
      stateLabel: c,
      secondary: Te(t),
      accent: l,
      controls: [],
      masterVisual: "ring",
      masterValue: n ? String(s ? o : 0) : s ? "On" : "Off",
      masterUnit: n ? "%" : void 0
    };
    if (n) {
      const b = (v) => ({
        domain: "light",
        service: "turn_on",
        data: {
          entity_id: t.entity_id,
          brightness_pct: Math.round(v)
        }
      });
      m.slider = {
        value: s ? o : 0,
        label: `${Math.round(s ? o : 0)}%`,
        onInput: (v) => r.throttle.call(i, b(v)),
        onCommit: (v) => {
          r.throttle.call(i, b(v)), r.throttle.flush(i);
        }
      };
    }
    return m;
  }
  defaultTapAction() {
    return { action: "toggle" };
  }
  defaultHoldAction() {
    return { action: "more-info" };
  }
}
function Te(e) {
  if (e.state !== "on") return;
  const t = e.attributes.color_temp_kelvin, i = e.attributes.effect;
  if (i && i !== "None") return i;
  if (t) return `${t} K`;
}
function Me(e) {
  const t = e.attributes.rgb_color;
  if (t && t.length === 3) return `rgb(${t[0]}, ${t[1]}, ${t[2]})`;
}
const Ue = {
  off: "mdi:power",
  heat: "mdi:fire",
  cool: "mdi:snowflake",
  heat_cool: "mdi:autorenew",
  auto: "mdi:thermostat-auto",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan"
};
class Oe {
  constructor() {
    this.domain = "climate";
  }
  buildViewModel(t, i, a, r) {
    const s = t.attributes, n = s.min_temp ?? 7, o = s.max_temp ?? 35, l = s.target_temp_step ?? 0.5, d = s.temperature, p = s.current_temperature, c = i.config?.unit_system?.temperature ?? "°C", m = t.state !== "off" && !P(t), v = (s.hvac_modes ?? []).map(($) => ({
      key: $,
      icon: Ue[$] ?? "mdi:thermostat",
      label: B($),
      active: t.state === $,
      onClick: () => i.callService("climate", "set_hvac_mode", {
        entity_id: t.entity_id,
        hvac_mode: $
      })
    })), M = s.hvac_action ?? t.state, y = p != null ? `${O(p)} ${c}` : B(t.state), zt = d != null ? `Set ${O(d)} ${c} · ${B(M)}` : B(M), et = {
      name: Q(t, a.name),
      icon: a.icon ?? s.icon ?? "mdi:thermostat",
      active: m,
      unavailable: P(t),
      stateLabel: y,
      secondary: zt,
      controls: v,
      masterVisual: "knob",
      masterValue: d != null ? O(d) : "—",
      masterUnit: c.replace("C", "").replace("F", "") || "°"
    };
    if (d != null && t.state !== "off") {
      const $ = (f) => {
        const Bt = n + f / 100 * (o - n);
        return Math.round(Bt / l) * l;
      }, jt = (f) => (f - n) / (o - n) * 100, pt = (f) => ({
        domain: "climate",
        service: "set_temperature",
        data: { entity_id: t.entity_id, temperature: $(f) }
      });
      et.slider = {
        value: He(jt(d)),
        label: `${O(d)}${c.startsWith("°") ? c : " " + c}`,
        onInput: (f) => r.throttle.call(i, pt(f)),
        onCommit: (f) => {
          r.throttle.call(i, pt(f)), r.throttle.flush(i);
        }
      }, et.masterValue = O(d);
    }
    return et;
  }
  defaultTapAction() {
    return { action: "more-info" };
  }
  defaultHoldAction() {
    return { action: "more-info" };
  }
}
function O(e) {
  return Number.isInteger(e) ? String(e) : e.toFixed(1);
}
function B(e) {
  return e.split("_").map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
}
function He(e) {
  return Math.min(100, Math.max(0, e));
}
class Le {
  constructor() {
    this.domain = "media_player";
  }
  buildViewModel(t, i, a, r) {
    const s = t.attributes, n = t.state === "playing", o = ["playing", "paused", "buffering", "on"].includes(t.state), l = s.media_title ?? Ne(t.state), d = s.media_artist ?? s.media_series_title ?? s.app_name, p = xe(i, s.entity_picture), c = s.supported_features ?? 0, m = [];
    q(c, H.PREVIOUS) && m.push({
      key: "prev",
      icon: "mdi:skip-previous",
      onClick: () => this.call(i, t, "media_previous_track")
    }), q(c, H.PLAY | H.PAUSE) && m.push({
      key: "play",
      icon: n ? "mdi:pause" : "mdi:play",
      active: n,
      onClick: () => this.call(i, t, "media_play_pause")
    }), q(c, H.NEXT) && m.push({
      key: "next",
      icon: "mdi:skip-next",
      onClick: () => this.call(i, t, "media_next_track")
    });
    const b = {
      name: Q(t, a.name),
      icon: a.icon ?? s.icon ?? "mdi:speaker",
      active: o,
      unavailable: P(t),
      stateLabel: l,
      secondary: d,
      picture: p,
      controls: m,
      masterVisual: "none"
    }, v = s.volume_level;
    if (v != null && q(c, H.VOLUME_SET)) {
      const M = (y) => ({
        domain: "media_player",
        service: "volume_set",
        data: { entity_id: t.entity_id, volume_level: y / 100 }
      });
      b.slider = {
        value: Math.round(v * 100),
        label: `${Math.round(v * 100)}%`,
        onInput: (y) => r.throttle.call(i, M(y)),
        onCommit: (y) => {
          r.throttle.call(i, M(y)), r.throttle.flush(i);
        }
      };
    }
    return b;
  }
  call(t, i, a) {
    t.callService("media_player", a, { entity_id: i.entity_id });
  }
  defaultTapAction() {
    return { action: "more-info" };
  }
  defaultHoldAction() {
    return { action: "more-info" };
  }
}
const H = {
  PAUSE: 1,
  PREVIOUS: 16,
  NEXT: 32,
  VOLUME_SET: 4,
  PLAY: 16384
};
function q(e, t) {
  return (e & t) !== 0;
}
function Ne(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const Ve = {
  temperature: "mdi:thermometer",
  humidity: "mdi:water-percent",
  pressure: "mdi:gauge",
  power: "mdi:flash",
  energy: "mdi:lightning-bolt",
  battery: "mdi:battery",
  illuminance: "mdi:brightness-5",
  co2: "mdi:molecule-co2",
  pm25: "mdi:air-filter"
};
class Re {
  constructor() {
    this.domain = "sensor";
  }
  buildViewModel(t, i, a) {
    const r = t.attributes.device_class, s = Ee(t, i);
    return {
      name: Q(t, a.name),
      icon: a.icon ?? t.attributes.icon ?? (r ? Ve[r] : void 0) ?? "mdi:gauge",
      active: !P(t),
      unavailable: P(t),
      stateLabel: s,
      secondary: r ? r.charAt(0).toUpperCase() + r.slice(1) : void 0,
      controls: [],
      masterVisual: "none",
      masterValue: s
    };
  }
  defaultTapAction() {
    return { action: "more-info" };
  }
  defaultHoldAction() {
    return { action: "more-info" };
  }
}
const De = {
  light: new Pe(),
  climate: new Oe(),
  media_player: new Le(),
  sensor: new Re()
};
function at(e) {
  return De[e];
}
function ut(e) {
  return e.length ? u`
    <div class="controls">
      ${e.map(
    (t) => u`
          <button
            class="control-btn ${t.active ? "active" : ""}"
            ?disabled=${t.disabled}
            aria-label=${t.label ?? t.key}
            aria-pressed=${t.active ? "true" : "false"}
            @click=${(i) => {
      i.stopPropagation(), t.onClick();
    }}
          >
            ${t.icon ? u`<ha-icon icon=${t.icon}></ha-icon>` : h}
            ${t.label && !t.icon ? u`<span>${t.label}</span>` : h}
          </button>
        `
  )}
    </div>
  ` : h;
}
function Ie(e) {
  if (!e.vm.slider) return h;
  const t = e.sliderController("horizontal"), i = Math.round(e.sliderValue);
  return u`
    <div
      class="slider ${e.sliderActive ? "active" : ""}"
      role="slider"
      tabindex="0"
      aria-label="${e.vm.name} level"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${i}
      aria-valuetext=${e.vm.slider.label}
      @pointerdown=${t?.start}
      @keydown=${(a) => Rt(a, e)}
    >
      <div class="slider-fill" style="width:${i}%"></div>
      <div class="slider-label">${e.vm.slider.label}</div>
    </div>
  `;
}
function ze(e, t = "radial") {
  const i = e.vm, a = !!i.slider, r = Math.round(e.sliderValue), s = r / 100 * 270, n = `conic-gradient(from 225deg,
    var(--brevia-accent) 0deg ${s}deg,
    var(--brevia-track) ${s}deg 270deg,
    transparent 270deg 360deg)`, o = a ? e.sliderController(t) : void 0;
  return u`
    <div
      class="master-visual ${i.active ? "active" : ""} ${a ? "dimmable" : ""}"
      data-visual=${i.masterVisual}
      role=${a ? "slider" : "button"}
      tabindex="0"
      aria-label=${i.name}
      aria-valuenow=${a ? r : h}
      @keydown=${(l) => a && Rt(l, e)}
    >
      <div
        class="ring"
        style="background:${n}"
        @pointerdown=${o?.start}
      ></div>
      <div
        class="ring-core"
        @action=${e.primaryAction.onAction}
        .actionHandler=${e.primaryAction.handler}
      >
        ${i.masterValue ? u`<span class="ring-value">${i.masterValue}</span>
              ${i.masterUnit ? u`<span class="ring-unit">${i.masterUnit}</span>` : h}` : u`<ha-icon icon=${i.icon}></ha-icon>`}
      </div>
    </div>
  `;
}
function Rt(e, t) {
  const i = t.vm.slider;
  if (!i) return;
  let a;
  const r = t.sliderValue;
  switch (e.key) {
    case "ArrowRight":
    case "ArrowUp":
      a = Math.min(100, r + 5);
      break;
    case "ArrowLeft":
    case "ArrowDown":
      a = Math.max(0, r - 5);
      break;
    case "Home":
      a = 0;
      break;
    case "End":
      a = 100;
      break;
    default:
      return;
  }
  e.preventDefault(), i.onInput(a), i.onCommit(a);
}
const je = {
  render(e) {
    const t = e.vm, i = t.picture ? u`<img class="album-art" src=${t.picture} alt="" />` : u`<div
          class="icon-badge ${t.active ? "active" : ""}"
          style=${t.active && t.accent ? `color:${t.accent}` : ""}
          @action=${e.primaryAction.onAction}
          .actionHandler=${e.primaryAction.handler}
          role="button"
          tabindex="0"
          aria-label=${t.name}
        >
          <ha-icon icon=${t.icon}></ha-icon>
        </div>`;
    return u`
      <div class="layout-compact-row">
        ${i}
        <div class="body">
          <span class="name">${t.name}</span>
          ${t.secondary ? u`<span class="secondary">${t.secondary}</span>` : h}
        </div>
        <div class="trailing">
          ${t.controls.length ? ut(t.controls) : u`<span class="state">${t.stateLabel}</span>`}
        </div>
      </div>
    `;
  }
}, Be = {
  render(e) {
    const t = e.vm, i = t.picture ? u`<img class="album-art large" src=${t.picture} alt="" />` : u`<div
          class="icon-badge ${t.active ? "active" : ""}"
          style=${t.active && t.accent ? `color:${t.accent}` : ""}
          @action=${e.primaryAction.onAction}
          .actionHandler=${e.primaryAction.handler}
          role="button"
          tabindex="0"
          aria-label=${t.name}
        >
          <ha-icon icon=${t.icon}></ha-icon>
        </div>`;
    return u`
      <div class="layout-single-large">
        <div class="header">
          ${i}
          <div class="body">
            <span class="name">${t.name}</span>
            ${t.secondary ? u`<span class="secondary">${t.secondary}</span>` : h}
          </div>
          <span class="state">${t.stateLabel}</span>
        </div>
        ${t.slider ? Ie(e) : h}
        ${ut(t.controls)}
      </div>
    `;
  }
}, qe = {
  render(e) {
    const t = e.vm, i = e.tiles(), a = t.masterVisual === "none" ? u`<div class="header">
              <div
                class="icon-badge ${t.active ? "active" : ""}"
                @action=${e.primaryAction.onAction}
                .actionHandler=${e.primaryAction.handler}
                role="button"
                tabindex="0"
                aria-label=${t.name}
              >
                <ha-icon icon=${t.icon}></ha-icon>
              </div>
              <div class="body">
                <span class="name">${t.name}</span>
                <span class="secondary">${t.stateLabel}</span>
              </div>
            </div>` : u`${ze(e)}
            <div class="body">
              <span class="name">${t.name}</span>
              ${t.secondary ? u`<span class="secondary">${t.secondary}</span>` : h}
            </div>`;
    return u`
      <div class="layout-master-tiles">
        <div class="master">${a} ${ut(t.controls)}</div>
        ${i.length ? u`<div class="tile-grid">
              ${i.map(
      (r) => u`
                  <div
                    class="tile ${r.vm.active ? "active" : ""}"
                    style=${r.vm.active && r.vm.accent ? `color:${r.vm.accent}` : ""}
                    @action=${r.action.onAction}
                    .actionHandler=${r.action.handler}
                    role="button"
                    tabindex="0"
                    aria-label=${r.vm.name}
                  >
                    <ha-icon icon=${r.vm.icon}></ha-icon>
                    <span class="tile-name">${r.vm.name}</span>
                  </div>
                `
    )}
            </div>` : h}
      </div>
    `;
  }
}, We = {
  "compact-row": je,
  "single-large": Be,
  "master-tiles": qe
};
function Fe(e) {
  return We[e];
}
class Ye {
  constructor(t = 150) {
    this.intervalMs = t, this.lastRun = 0;
  }
  /** Schedule a service call, throttled with a guaranteed trailing edge. */
  call(t, i) {
    this.pending = i;
    const r = Date.now() - this.lastRun;
    if (r >= this.intervalMs) {
      this.flush(t);
      return;
    }
    if (this.timer === void 0) {
      const s = this.intervalMs - r;
      this.timer = window.setTimeout(() => {
        this.timer = void 0, this.flush(t);
      }, s);
    }
  }
  /** Force-send the pending call immediately (e.g. on pointerup). */
  flush(t) {
    this.timer !== void 0 && (clearTimeout(this.timer), this.timer = void 0);
    const i = this.pending;
    this.pending = void 0, i && (this.lastRun = Date.now(), t.callService(i.domain, i.service, i.data));
  }
  /** Cancel any pending trailing call (e.g. on disconnect). */
  cancel() {
    this.timer !== void 0 && (clearTimeout(this.timer), this.timer = void 0), this.pending = void 0;
  }
}
class Ke {
  constructor(t) {
    this.options = t, this.lastValue = 0, this.move = (i) => this.handleMove(i), this.end = (i) => this.handleEnd(i), this.start = (i) => {
      if (i.button !== void 0 && i.button > 0) return;
      const a = i.currentTarget;
      i.preventDefault(), i.stopPropagation(), this.element = a, this.pointerId = i.pointerId, a.setPointerCapture(i.pointerId), a.addEventListener("pointermove", this.move), a.addEventListener("pointerup", this.end), a.addEventListener("pointercancel", this.end), this.options.onActiveChange?.(!0), this.emit(i, !1);
    };
  }
  handleMove(t) {
    t.pointerId === this.pointerId && (t.preventDefault(), this.emit(t, !1));
  }
  handleEnd(t) {
    t.pointerId === this.pointerId && (this.emit(t, !0), this.cleanup());
  }
  emit(t, i) {
    if (!this.element) return;
    const a = this.element.getBoundingClientRect(), r = Ze(this.options.computeValue(t, a));
    this.lastValue = r, this.options.onInput(r), i && this.options.onCommit?.(r);
  }
  cleanup() {
    const t = this.element;
    if (t && this.pointerId !== void 0) {
      try {
        t.releasePointerCapture(this.pointerId);
      } catch {
      }
      t.removeEventListener("pointermove", this.move), t.removeEventListener("pointerup", this.end), t.removeEventListener("pointercancel", this.end);
    }
    this.element = void 0, this.pointerId = void 0, this.options.onActiveChange?.(!1);
  }
  get value() {
    return this.lastValue;
  }
}
function Ze(e, t = 0, i = 100) {
  return Math.min(i, Math.max(t, e));
}
function Ge(e, t) {
  return (e.clientX - t.left) / t.width * 100;
}
function Xe(e, t) {
  const i = t.left + t.width / 2, a = t.top + t.height / 2, r = e.clientX - i, s = e.clientY - a;
  let n = Math.atan2(r, s) * (180 / Math.PI);
  n = (n % 360 + 360) % 360;
  const o = 45, l = 360 - 2 * o, d = n - o;
  return d <= 0 ? 0 : d >= l ? 100 : d / l * 100;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Je = { ELEMENT: 6 }, Qe = (e) => (...t) => ({ _$litDirective$: e, values: t });
class ti {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, i, a) {
    this._$Ct = t, this._$AM = i, this._$Ci = a;
  }
  _$AS(t, i) {
    return this.update(t, i);
  }
  update(t, i) {
    return this.render(...i);
  }
}
const ei = 500, ii = 250;
class ai extends HTMLElement {
  constructor() {
    super(...arguments), this.held = !1, this.clicks = 0, this.start = (t) => {
      const i = t.currentTarget;
      this.held = !1, this.timer !== void 0 && clearTimeout(this.timer), i.actionHandlerOptions?.hasHold && (this.timer = window.setTimeout(() => {
        this.held = !0;
      }, ei));
    }, this.end = (t) => {
      const i = t.currentTarget;
      this.timer !== void 0 && (clearTimeout(this.timer), this.timer = void 0);
      const a = i.actionHandlerOptions ?? {};
      if (this.held) {
        W(i, "hold");
        return;
      }
      a.hasDoubleClick ? this.clicks === 0 ? (this.clicks = 1, this.dblTimer = window.setTimeout(() => {
        this.clicks = 0, W(i, "tap");
      }, ii)) : (this.dblTimer !== void 0 && clearTimeout(this.dblTimer), this.clicks = 0, W(i, "double_tap")) : W(i, "tap");
    }, this.reset = () => {
      this.timer !== void 0 && (clearTimeout(this.timer), this.timer = void 0), this.held = !1;
    };
  }
  connectedCallback() {
    Object.assign(this.style, {
      position: "fixed",
      width: "0",
      height: "0",
      pointerEvents: "none"
    });
  }
  bind(t, i) {
    t.actionHandlerOptions = i, !t.actionHandlerBound && (t.actionHandlerBound = !0, t.addEventListener("pointerdown", this.start), t.addEventListener("pointerup", this.end), t.addEventListener("pointercancel", this.reset));
  }
}
function W(e, t) {
  e.dispatchEvent(
    new CustomEvent("action", {
      detail: { action: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const Z = "brevia-action-handler";
function ri() {
  let e = document.body.querySelector(Z);
  return e || (e = document.createElement(Z), document.body.appendChild(e)), e;
}
class si extends ti {
  constructor(t) {
    if (super(t), t.type !== Je.ELEMENT)
      throw new Error("actionHandler can only be bound to an element");
  }
  update(t, [i]) {
    return ri().bind(t.element, i ?? {}), this.render(i);
  }
  render(t) {
    return E;
  }
}
const ni = Qe(si);
customElements.get(Z) || customElements.define(Z, ai);
const oi = _`
  :host {
    /* ---- Look tokens (neumorph defaults) ---- */
    --brevia-accent: var(--primary-color, #5b8def);
    --brevia-radius: 22px;
    --brevia-shadow-intensity: 1;

    --brevia-bg: var(--card-background-color, #e8ebf2);
    --brevia-surface: var(--brevia-bg);
    --brevia-text: var(--primary-text-color, #1c2230);
    --brevia-text-dim: var(--secondary-text-color, #6b7280);
    --brevia-track: rgba(0, 0, 0, 0.08);

    /* Neumorphic dual shadow, scaled by intensity. */
    --brevia-shadow-light: rgba(255, 255, 255, 0.9);
    --brevia-shadow-dark: rgba(28, 34, 48, 0.18);
    --brevia-shadow-out: calc(6px * var(--brevia-shadow-intensity))
        calc(6px * var(--brevia-shadow-intensity))
        calc(14px * var(--brevia-shadow-intensity)) var(--brevia-shadow-dark),
      calc(-6px * var(--brevia-shadow-intensity))
        calc(-6px * var(--brevia-shadow-intensity))
        calc(14px * var(--brevia-shadow-intensity)) var(--brevia-shadow-light);
    --brevia-shadow-in: inset 4px 4px 8px var(--brevia-shadow-dark),
      inset -4px -4px 8px var(--brevia-shadow-light);

    /* ---- Spacing (density-aware) ---- */
    --brevia-gap: 14px;
    --brevia-pad: 18px;
    --brevia-tile-min: 64px;

    display: block;
  }

  /* Compact density tightens spacing globally. */
  :host([data-density='compact']) {
    --brevia-gap: 8px;
    --brevia-pad: 12px;
    --brevia-radius: 16px;
  }

  /* Dark token variant for the default look. Styles may override further. */
  :host([data-dark]) {
    --brevia-bg: #20242e;
    --brevia-text: #eef1f6;
    --brevia-text-dim: #9aa3b2;
    --brevia-track: rgba(255, 255, 255, 0.1);
    --brevia-shadow-light: rgba(255, 255, 255, 0.04);
    --brevia-shadow-dark: rgba(0, 0, 0, 0.5);
  }
`, li = _`
  ha-card {
    background: var(--brevia-bg);
    border-radius: var(--brevia-radius);
    color: var(--brevia-text);
    padding: var(--brevia-pad);
    border: none;
    box-shadow: none;
    overflow: hidden;
    transition: background 0.3s ease, box-shadow 0.3s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .unavailable {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--brevia-text-dim);
    font-size: 0.95rem;
  }

  ha-icon {
    --mdc-icon-size: 24px;
    color: var(--brevia-text);
  }

  /* ---------- shared atoms ---------- */
  .icon-badge {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--brevia-surface);
    box-shadow: var(--brevia-shadow-out);
    color: var(--brevia-text-dim);
    flex: 0 0 auto;
    transition: color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
    cursor: pointer;
  }
  .icon-badge.active {
    color: var(--brevia-accent);
    box-shadow: var(--brevia-shadow-in);
  }

  .name {
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.2;
    color: var(--brevia-text);
  }
  .secondary {
    font-size: 0.82rem;
    color: var(--brevia-text-dim);
    line-height: 1.2;
  }
  .state {
    font-variant-numeric: tabular-nums;
    color: var(--brevia-text-dim);
    font-size: 0.9rem;
  }

  /* ---------- slider (horizontal) ---------- */
  .slider {
    position: relative;
    height: 40px;
    border-radius: 999px;
    background: var(--brevia-track);
    box-shadow: var(--brevia-shadow-in);
    cursor: ew-resize;
    touch-action: none;
    overflow: hidden;
    user-select: none;
  }
  .slider-fill {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: 999px;
    background: var(--brevia-accent);
    opacity: 0.85;
    transition: width 0.08s linear;
  }
  .slider-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 14px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--brevia-text);
    mix-blend-mode: difference;
    pointer-events: none;
  }

  /* ---------- radial master visual (ring / knob) ---------- */
  .master-visual {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    margin: 4px auto;
    touch-action: none;
    user-select: none;
    cursor: pointer;
  }
  .master-visual.dimmable {
    cursor: pointer;
  }
  .ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    cursor: pointer;
    touch-action: none;
  }
  .ring-core {
    position: absolute;
    inset: 22px;
    border-radius: 50%;
    background: var(--brevia-bg);
    box-shadow: var(--brevia-shadow-out);
    display: grid;
    place-items: center;
    text-align: center;
    cursor: pointer;
  }
  .ring-core ha-icon {
    --mdc-icon-size: 30px;
    color: var(--brevia-text-dim);
  }
  .master-visual.active .ring-core ha-icon {
    color: var(--brevia-accent);
  }
  .ring-value {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--brevia-text);
    font-variant-numeric: tabular-nums;
  }
  .ring-unit {
    font-size: 0.8rem;
    color: var(--brevia-text-dim);
  }

  /* ---------- controls (transport / mode buttons) ---------- */
  .controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
  .control-btn {
    display: grid;
    place-items: center;
    min-width: 40px;
    height: 40px;
    padding: 0 10px;
    border-radius: 14px;
    background: var(--brevia-surface);
    box-shadow: var(--brevia-shadow-out);
    color: var(--brevia-text);
    border: none;
    cursor: pointer;
    font: inherit;
    font-size: 0.85rem;
    transition: box-shadow 0.15s ease, color 0.15s ease;
  }
  .control-btn:active {
    box-shadow: var(--brevia-shadow-in);
  }
  .control-btn.active {
    color: var(--brevia-accent);
    box-shadow: var(--brevia-shadow-in);
  }
  .control-btn:focus-visible {
    outline: 2px solid var(--brevia-accent);
    outline-offset: 2px;
  }

  /* ---------- album art ---------- */
  .album-art {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    object-fit: cover;
    background: var(--brevia-track);
    box-shadow: var(--brevia-shadow-out);
    flex: 0 0 auto;
  }
  .album-art.large {
    width: 120px;
    height: 120px;
    border-radius: 18px;
  }

  /* =================== LAYOUTS =================== */

  /* compact-row */
  .layout-compact-row {
    display: flex;
    align-items: center;
    gap: var(--brevia-gap);
  }
  .layout-compact-row .body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1 1 auto;
  }
  .layout-compact-row .name,
  .layout-compact-row .secondary {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .layout-compact-row .trailing {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* single-large */
  .layout-single-large {
    display: flex;
    flex-direction: column;
    gap: var(--brevia-gap);
  }
  .layout-single-large .header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .layout-single-large .header .body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .layout-single-large .header .state {
    margin-left: auto;
  }

  /* master-tiles */
  .layout-master-tiles {
    display: flex;
    flex-direction: column;
    gap: var(--brevia-gap);
  }
  .layout-master-tiles .master {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  .layout-master-tiles .master .body {
    text-align: center;
  }
  .tile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--brevia-tile-min), 1fr));
    gap: var(--brevia-gap);
  }
  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 6px;
    border-radius: var(--brevia-radius);
    background: var(--brevia-surface);
    box-shadow: var(--brevia-shadow-out);
    cursor: pointer;
    transition: box-shadow 0.2s ease, color 0.2s ease;
    text-align: center;
  }
  .tile.active {
    box-shadow: var(--brevia-shadow-in);
  }
  .tile.active ha-icon {
    color: var(--brevia-accent);
  }
  .tile .tile-name {
    font-size: 0.72rem;
    color: var(--brevia-text-dim);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  .tile:focus-visible {
    outline: 2px solid var(--brevia-accent);
    outline-offset: 2px;
  }

  /* Generic focus ring for keyboard users. */
  [tabindex]:focus-visible {
    outline: 2px solid var(--brevia-accent);
    outline-offset: 2px;
    border-radius: var(--brevia-radius);
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }
`, ci = _`
  ha-card[data-style='neumorph'] {
    --brevia-bg: var(--card-background-color, #e8ebf2);
    --brevia-surface: var(--brevia-bg);
    background: var(--brevia-bg);
  }

  :host([data-dark]) ha-card[data-style='neumorph'] {
    --brevia-bg: #20242e;
  }
`, di = _`
  ha-card[data-style='glass'] {
    --brevia-bg: transparent;
    --brevia-surface: rgba(255, 255, 255, 0.14);
    --brevia-text: var(--primary-text-color, #10131a);
    --brevia-text-dim: rgba(60, 66, 82, 0.75);
    --brevia-track: rgba(255, 255, 255, 0.18);
    --brevia-shadow-out: 0 8px 30px rgba(0, 0, 0, 0.18);
    --brevia-shadow-in: inset 0 1px 2px rgba(255, 255, 255, 0.4);

    background: rgba(255, 255, 255, 0.08);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.25);
  }

  :host([data-dark]) ha-card[data-style='glass'] {
    --brevia-surface: rgba(255, 255, 255, 0.08);
    --brevia-text: #f3f5fa;
    --brevia-text-dim: rgba(230, 234, 244, 0.7);
    --brevia-track: rgba(255, 255, 255, 0.1);
    background: rgba(20, 24, 34, 0.35);
    border-color: rgba(255, 255, 255, 0.12);
  }

  ha-card[data-style='glass'] .icon-badge,
  ha-card[data-style='glass'] .tile,
  ha-card[data-style='glass'] .control-btn {
    border: 1px solid rgba(255, 255, 255, 0.2);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }
`, hi = _`
  ha-card[data-style='editorial'] {
    --brevia-radius: 4px;
    --brevia-bg: var(--card-background-color, #fbfaf7);
    --brevia-surface: transparent;
    --brevia-text: var(--primary-text-color, #14110c);
    --brevia-text-dim: #8a8478;
    --brevia-track: rgba(20, 17, 12, 0.1);
    --brevia-accent: var(--primary-color, #b5462e);
    --brevia-shadow-out: none;
    --brevia-shadow-in: none;

    border: 1px solid var(--brevia-text);
    background: var(--brevia-bg);
  }

  ha-card[data-style='editorial'] .name {
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  ha-card[data-style='editorial'] .secondary,
  ha-card[data-style='editorial'] .tile-name {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.7rem;
  }
  ha-card[data-style='editorial'] .icon-badge,
  ha-card[data-style='editorial'] .tile,
  ha-card[data-style='editorial'] .control-btn,
  ha-card[data-style='editorial'] .album-art {
    border: 1px solid var(--brevia-text);
    border-radius: 2px;
  }
  ha-card[data-style='editorial'] .icon-badge {
    border-radius: 50%;
  }
  ha-card[data-style='editorial'] .slider {
    border: 1px solid var(--brevia-text);
  }

  :host([data-dark]) ha-card[data-style='editorial'] {
    --brevia-bg: #16140f;
    --brevia-text: #f3efe6;
    --brevia-text-dim: #9c958650;
    --brevia-track: rgba(243, 239, 230, 0.12);
  }
`, ui = _`
  ha-card[data-style='minimal'] {
    --brevia-radius: 12px;
    --brevia-bg: var(--card-background-color, #ffffff);
    --brevia-surface: var(--secondary-background-color, #f3f4f6);
    --brevia-text: var(--primary-text-color, #111827);
    --brevia-text-dim: var(--secondary-text-color, #9ca3af);
    --brevia-track: var(--secondary-background-color, #eceef1);
    --brevia-shadow-out: none;
    --brevia-shadow-in: none;

    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    background: var(--brevia-bg);
  }

  ha-card[data-style='minimal'] .name {
    font-weight: 500;
  }
  ha-card[data-style='minimal'] .icon-badge {
    background: transparent;
    width: 40px;
    height: 40px;
  }
  ha-card[data-style='minimal'] .icon-badge.active {
    background: color-mix(in srgb, var(--brevia-accent) 14%, transparent);
  }
  ha-card[data-style='minimal'] .tile,
  ha-card[data-style='minimal'] .control-btn {
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
  }
  ha-card[data-style='minimal'] .ring-core {
    box-shadow: none;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  :host([data-dark]) ha-card[data-style='minimal'] {
    --brevia-bg: #1b1e24;
    --brevia-surface: #262a32;
    --brevia-text: #f4f6fa;
    --brevia-text-dim: #8b93a1;
    --brevia-track: #2c313a;
  }
`, pi = _`
  ha-card[data-style='cyber'] {
    --brevia-radius: 10px;
    --brevia-bg: #0a0e16;
    --brevia-surface: #111726;
    --brevia-text: #e6f1ff;
    --brevia-text-dim: #5d7290;
    --brevia-track: #1a2336;
    --brevia-accent: var(--primary-color, #00f0ff);
    --brevia-shadow-out: 0 0 0 1px rgba(0, 240, 255, 0.18),
      0 0 14px rgba(0, 240, 255, 0.12);
    --brevia-shadow-in: inset 0 0 10px rgba(0, 240, 255, 0.2);

    background: var(--brevia-bg);
    border: 1px solid rgba(0, 240, 255, 0.25);
  }

  ha-card[data-style='cyber'] .state,
  ha-card[data-style='cyber'] .ring-value,
  ha-card[data-style='cyber'] .slider-label {
    font-family: 'SF Mono', 'Roboto Mono', ui-monospace, monospace;
    text-shadow: 0 0 8px var(--brevia-accent);
  }
  ha-card[data-style='cyber'] .name {
    letter-spacing: 0.04em;
  }
  ha-card[data-style='cyber'] .icon-badge.active,
  ha-card[data-style='cyber'] .tile.active ha-icon {
    color: var(--brevia-accent);
    filter: drop-shadow(0 0 6px var(--brevia-accent));
  }
  ha-card[data-style='cyber'] .slider-fill {
    box-shadow: 0 0 16px var(--brevia-accent);
    opacity: 1;
  }
`;
var mi = Object.defineProperty, vi = Object.getOwnPropertyDescriptor, tt = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? vi(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (r = (a ? n(t, i, r) : n(r)) || r);
  return a && r && mi(t, i, r), r;
};
const bi = "1.0.0";
console.info(
  `%c BREVIA-CARD %c v${bi} `,
  "color:#fff;background:#5b8def;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px",
  "color:#5b8def;background:#11131a;border-radius:0 4px 4px 0;padding:2px 6px"
);
let T = class extends k {
  constructor() {
    super(...arguments), this._optimistic = null, this._dragging = !1, this._throttle = new Ye(150);
  }
  // ---------------------------------------------------------------- editor
  static async getConfigElement() {
    return await Promise.resolve().then(() => $i), document.createElement("brevia-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:brevia-card",
      entity: "",
      layout: "single-large",
      style: "neumorph"
    };
  }
  // ----------------------------------------------------------------- config
  setConfig(e) {
    if (!e || typeof e != "object")
      throw new Error("Invalid configuration");
    if (e.layout && !Nt.includes(e.layout))
      throw new Error(`Unknown layout "${e.layout}"`);
    if (e.style && !Vt.includes(e.style))
      throw new Error(`Unknown style "${e.style}"`);
    if (e.domain && !Lt.includes(e.domain))
      throw new Error(`Unknown domain "${e.domain}"`);
    const t = e.master_entity ?? e.entity, i = e.domain ?? Ct(t) ?? "light", a = at(i);
    this._config = {
      ...e,
      domain: i,
      layout: e.layout ?? "single-large",
      style: e.style ?? "neumorph",
      overrides: e.overrides ?? {},
      tap_action: e.tap_action ?? a.defaultTapAction(),
      hold_action: e.hold_action ?? a.defaultHoldAction()
    };
  }
  // ------------------------------------------------------------------- hass
  set hass(e) {
    const t = this._hass;
    this._hass = e, this._config && (!t || this._relevantChanged(t, e)) && (this._dragging || (this._optimistic = null), this.requestUpdate());
  }
  get hass() {
    return this._hass;
  }
  _relevantChanged(e, t) {
    for (const i of this._trackedEntities())
      if (e.states[i] !== t.states[i]) return !0;
    return !1;
  }
  _trackedEntities() {
    const e = this._config;
    if (!e) return [];
    const t = [], i = e.master_entity ?? e.entity;
    i && t.push(i);
    for (const a of e.tile_entities ?? [])
      t.push(typeof a == "string" ? a : a.entity);
    return t;
  }
  // ------------------------------------------------------------ HA sizing
  getCardSize() {
    const e = this._config?.layout ?? "single-large";
    if (e === "compact-row") return 1;
    if (e === "master-tiles") {
      const t = this._config?.tile_entities?.length ?? 0;
      return 3 + Math.ceil(t / 3);
    }
    return 3;
  }
  /** Sections-view (12-column) sizing — without this the card grabs all 12. */
  getGridOptions() {
    switch (this._config?.layout ?? "single-large") {
      case "compact-row":
        return { rows: 1, columns: 6, min_rows: 1, min_columns: 4 };
      case "master-tiles": {
        const t = this._config?.tile_entities?.length ?? 0;
        return {
          rows: 3 + Math.ceil(t / 3),
          columns: 12,
          min_rows: 3,
          min_columns: 6
        };
      }
      case "single-large":
      default:
        return { rows: 3, columns: 6, min_rows: 2, min_columns: 4 };
    }
  }
  // ------------------------------------------------------------- lifecycle
  disconnectedCallback() {
    super.disconnectedCallback(), this._throttle.cancel();
  }
  willUpdate() {
    const e = this._config;
    if (!e) return;
    e.overrides.density === "compact" ? this.setAttribute("data-density", "compact") : this.removeAttribute("data-density");
    const t = e.overrides.dark ?? !!this._hass?.themes?.darkMode;
    this.toggleAttribute("data-dark", t), this._applyHostVar("--brevia-radius", e.overrides.radius != null ? `${e.overrides.radius}px` : null), this._applyHostVar(
      "--brevia-shadow-intensity",
      e.overrides.shadow_intensity != null ? String(e.overrides.shadow_intensity) : null
    );
  }
  _applyHostVar(e, t) {
    t == null ? this.style.removeProperty(e) : this.style.setProperty(e, t);
  }
  // ---------------------------------------------------------------- render
  render() {
    const e = this._config;
    if (!e) return u`<ha-card></ha-card>`;
    const t = this._hass, i = e.master_entity ?? e.entity, a = i ? t?.states[i] : void 0;
    if (!i)
      return this._shell(e, this._placeholder("mdi:gesture-tap", "Choose an entity"));
    if (!t)
      return this._shell(e, this._placeholder("mdi:loading", "Loading…"));
    if (!a)
      return this._shell(
        e,
        this._placeholder("mdi:alert-circle-outline", `Entity not found: ${i}`)
      );
    const s = at(e.domain).buildViewModel(a, t, e, {
      throttle: this._throttle
    });
    if (s.unavailable)
      return this._shell(e, this._placeholder("mdi:help-circle-outline", `${s.name} unavailable`));
    const n = e.overrides.accent ?? s.accent ?? "var(--brevia-accent)";
    this._applyHostVar(
      "--brevia-accent",
      e.overrides.accent ?? s.accent ?? null
    );
    const o = this._buildContext(e, t, s, n);
    return this._shell(e, Fe(e.layout).render(o));
  }
  _shell(e, t) {
    return u`<ha-card data-style=${e.style}>${t}</ha-card>`;
  }
  _placeholder(e, t) {
    return u`<div class="unavailable">
      <ha-icon icon=${e}></ha-icon><span>${t}</span>
    </div>`;
  }
  // ------------------------------------------------------- layout context
  _buildContext(e, t, i, a) {
    const r = this._optimistic ?? i.slider?.value ?? 0;
    return {
      hass: t,
      config: e,
      vm: i,
      accent: a,
      sliderValue: r,
      sliderActive: this._dragging,
      sliderController: (s) => this._makeSlider(i, s),
      primaryAction: this._actionBinding({
        entity: e.master_entity ?? e.entity,
        tap_action: e.tap_action,
        hold_action: e.hold_action,
        double_tap_action: e.double_tap_action
      }),
      tiles: () => this._buildTiles(e, t)
    };
  }
  _makeSlider(e, t) {
    const i = e.slider;
    if (!i) return;
    const a = t === "radial" ? Xe : Ge;
    return new Ke({
      computeValue: a,
      onInput: (r) => {
        this._optimistic = r, i.onInput(r), this.requestUpdate();
      },
      onCommit: (r) => {
        this._optimistic = r, i.onCommit(r);
      },
      onActiveChange: (r) => {
        this._dragging = r, this.requestUpdate();
      }
    });
  }
  _actionBinding(e) {
    return {
      handler: ni({
        hasHold: kt(e.hold_action),
        hasDoubleClick: kt(e.double_tap_action)
      }),
      onAction: (t) => {
        !this._hass || !t.detail?.action || $e(this, this._hass, e, t.detail.action);
      }
    };
  }
  _buildTiles(e, t) {
    const i = [];
    for (const a of e.tile_entities ?? []) {
      const r = fi(a), s = t.states[r.entity];
      if (!s) continue;
      const n = Ct(r.entity) ?? "sensor", l = at(n).buildViewModel(
        s,
        t,
        { ...e, entity: r.entity, name: r.name, icon: r.icon },
        { throttle: this._throttle }
      );
      i.push({
        entityId: r.entity,
        vm: l,
        action: this._actionBinding({
          entity: r.entity,
          tap_action: r.tap_action ?? gi(n, r.entity),
          hold_action: r.hold_action ?? { action: "more-info" }
        })
      });
    }
    return i;
  }
};
T.styles = [
  oi,
  li,
  ci,
  di,
  hi,
  ui,
  pi
];
tt([
  J()
], T.prototype, "_config", 2);
tt([
  J()
], T.prototype, "_optimistic", 2);
tt([
  J()
], T.prototype, "_dragging", 2);
T = tt([
  Ht("brevia-card")
], T);
function fi(e) {
  return typeof e == "string" ? { entity: e } : e;
}
function gi(e, t) {
  const i = ht(t);
  return e === "light" || ["light", "switch", "fan", "input_boolean", "media_player"].includes(i) ? { action: "toggle" } : { action: "more-info" };
}
window.customCards = window.customCards || [];
window.customCards.push({
  type: "brevia-card",
  name: "Brevia Card",
  description: "Premium multi-domain card (Domain × Layout × Style)",
  preview: !0,
  documentationURL: "https://github.com/maurice198444/brevia-card"
});
var _i = Object.defineProperty, yi = Object.getOwnPropertyDescriptor, Dt = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? yi(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (r = (a ? n(t, i, r) : n(r)) || r);
  return a && r && _i(t, i, r), r;
};
const rt = (e) => e.map((t) => ({ value: t, label: It(t) }));
function It(e) {
  return e.replace(/[-_]/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
}
let I = class extends k {
  constructor() {
    super(...arguments), this._computeLabel = (e) => It(e.name);
  }
  setConfig(e) {
    this._config = e;
  }
  get _schema() {
    return [
      { name: "entity", selector: { entity: {} } },
      {
        name: "domain",
        selector: { select: { options: rt(Lt), mode: "dropdown" } }
      },
      {
        name: "layout",
        selector: { select: { options: rt(Nt), mode: "dropdown" } }
      },
      {
        name: "style",
        selector: { select: { options: rt(Vt), mode: "dropdown" } }
      },
      { name: "name", selector: { text: {} } }
    ];
  }
  render() {
    return !this.hass || !this._config ? h : u`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
  _valueChanged(e) {
    e.stopPropagation();
    const t = e.detail.value;
    D(this, "config-changed", { config: t });
  }
};
I.styles = _`
    ha-form {
      display: block;
    }
  `;
Dt([
  J()
], I.prototype, "_config", 2);
I = Dt([
  Ht("brevia-card-editor")
], I);
const $i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BreviaCardEditor() {
    return I;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  T as BreviaCard
};
