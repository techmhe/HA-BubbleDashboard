// node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, _ = g ? g.emptyScript : "", v = h.reactiveElementPolyfillSupport, y = (e, t) => e, b = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? _ : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, ee = (e, t) => !l(e, t), te = {
	attribute: !0,
	type: String,
	converter: b,
	reflect: !1,
	useDefault: !1,
	hasChanged: ee
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var ne = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = te) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? te;
	}
	static _$Ei() {
		if (this.hasOwnProperty(y("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(y("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(y("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? b : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? b : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ee)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
ne.elementStyles = [], ne.shadowRootOptions = { mode: "open" }, ne[y("elementProperties")] = /* @__PURE__ */ new Map(), ne[y("finalized")] = /* @__PURE__ */ new Map(), v?.({ ReactiveElement: ne }), (h.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var re = globalThis, ie = (e) => e, ae = re.trustedTypes, oe = ae ? ae.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, se = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, ce = "?" + x, le = `<${ce}>`, S = document, ue = () => S.createComment(""), de = (e) => e === null || typeof e != "object" && typeof e != "function", fe = Array.isArray, pe = (e) => fe(e) || typeof e?.[Symbol.iterator] == "function", me = "[ 	\n\f\r]", he = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, _e = />/g, ve = RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ye = /'/g, be = /"/g, xe = /^(?:script|style|textarea|title)$/i, Se = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), C = Se(1), w = Se(2), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), Ce = /* @__PURE__ */ new WeakMap(), we = S.createTreeWalker(S, 129);
function Te(e, t) {
	if (!fe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return oe === void 0 ? t : oe.createHTML(t);
}
var Ee = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = he;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === he ? c[1] === "!--" ? o = ge : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = ve) : (xe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = ve) : o = _e : o === ve ? c[0] === ">" ? (o = i ?? he, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? ve : c[3] === "\"" ? be : ye) : o === be || o === ye ? o = ve : o === ge || o === _e ? o = he : (o = ve, i = void 0);
		let d = o === ve && e[t + 1].startsWith("/>") ? " " : "";
		a += o === he ? n + le : l >= 0 ? (r.push(s), n.slice(0, l) + se + n.slice(l) + x + d) : n + x + (l === -2 ? t : d);
	}
	return [Te(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, De = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ee(t, n);
		if (this.el = e.createElement(l, r), we.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = we.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(se)) {
					let t = u[o++], n = i.getAttribute(e).split(x), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? je : r[1] === "?" ? Me : r[1] === "@" ? Ne : Ae
					}), i.removeAttribute(e);
				} else e.startsWith(x) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (xe.test(i.tagName)) {
					let e = i.textContent.split(x), t = e.length - 1;
					if (t > 0) {
						i.textContent = ae ? ae.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], ue()), we.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], ue());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ce) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(x, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += x.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = S.createElement("template");
		return n.innerHTML = e, n;
	}
};
function D(e, t, n = e, r) {
	if (t === T) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = de(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = D(e, i._$AS(e, t.values), i, r)), t;
}
var Oe = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? S).importNode(t, !0);
		we.currentNode = r;
		let i = we.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new ke(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Pe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = we.nextNode(), a++);
		}
		return we.currentNode = S, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, ke = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = D(this, e, t), de(e) ? e === E || e == null || e === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : e !== this._$AH && e !== T && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== E && de(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = De.createElement(Te(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Oe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ce.get(e.strings);
		return t === void 0 && Ce.set(e.strings, t = new De(e)), t;
	}
	k(t) {
		fe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(ue()), this.O(ue()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ie(e).nextSibling;
			ie(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Ae = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = E, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = E;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = D(this, e, t, 0), a = !de(e) || e !== this._$AH && e !== T, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = D(this, r[n + o], t, o), s === T && (s = this._$AH[o]), a ||= !de(s) || s !== this._$AH[o], s === E ? e = E : e !== E && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, je = class extends Ae {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === E ? void 0 : e;
	}
}, Me = class extends Ae {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== E);
	}
}, Ne = class extends Ae {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = D(this, e, t, 0) ?? E) === T) return;
		let n = this._$AH, r = e === E && n !== E || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== E && (n === E || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Pe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		D(this, e);
	}
}, Fe = {
	M: se,
	P: x,
	A: ce,
	C: 1,
	L: Ee,
	R: Oe,
	D: pe,
	V: D,
	I: ke,
	H: Ae,
	N: Me,
	U: Ne,
	B: je,
	F: Pe
}, Ie = re.litHtmlPolyfillSupport;
Ie?.(De, ke), (re.litHtmlVersions ??= []).push("3.3.3");
var Le = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new ke(t.insertBefore(ue(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Re = globalThis, ze = class extends ne {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Le(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return T;
	}
};
ze._$litElement$ = !0, ze.finalized = !0, Re.litElementHydrateSupport?.({ LitElement: ze });
var Be = Re.litElementPolyfillSupport;
Be?.({ LitElement: ze }), (Re.litElementVersions ??= []).push("4.2.2");
// src/icons.ts
var O = {
	home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
	thermo: "M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z",
	bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z",
	grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
	bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
	shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z",
	battery: "M3 8h15a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM21 11v2M5 11v2",
	wind: "M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8",
	storm: "M7 15a5 5 0 1 1 3-9 6 6 0 0 1 9 5 4 4 0 0 1-2 4M13 12l-3 5h4l-3 5",
	vacuum: "M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16M12 9.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5",
	trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
	desk: "M4 5h16v10H4zM9 19h6M12 15v4",
	bath: "M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V5a2 2 0 0 1 4 0",
	bed: "M3 18V7M3 13h18v5M7 13v-3h5v3",
	door: "M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16M14 12h.01",
	sofa: "M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2z",
	pot: "M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM2 10h2M20 10h2M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2",
	car: "M5 16l1.5-5h11L19 16M4 16h16v3H4zM7 19v1M17 19v1",
	moon: "M20 14a8 8 0 1 1-10-10 7 7 0 0 0 10 10z",
	power: "M12 3v9M6.3 6.3a8 8 0 1 0 11.4 0",
	close: "M6 6l12 12M18 6 6 18",
	check: "M5 12l5 5 9-10",
	window: "M5 3h14v18H5zM5 12h14M12 3v18",
	alert: "M12 3 2 20h20zM12 10v4M12 17h.01",
	filter: "M3 5h18l-7 8v6l-4 2v-8z",
	washer: "M5 3h14v18H5zM5 7h14M12 10a4 4 0 1 0 0 8a4 4 0 1 0 0-8",
	sun: "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
	cloud: "M7 18a5 5 0 1 1 3-9 6 6 0 0 1 9 5 4 4 0 0 1-2 4z",
	rain: "M7 15a5 5 0 1 1 3-9 6 6 0 0 1 9 5 4 4 0 0 1-2 4H7M8 18l-1 3M12 18l-1 3M16 18l-1 3",
	snow: "M7 15a5 5 0 1 1 3-9 6 6 0 0 1 9 5 4 4 0 0 1-2 4H7M8 19h.01M12 19h.01M16 19h.01M10 22h.01M14 22h.01",
	fog: "M4 10h16M3 14h18M6 18h12",
	tree: "M12 2l6 9h-3l4 6H5l4-6H6zM12 17v5",
	printer: "M4 3h16v4H4zM9 7v4l3 3 3-3V7M6 21h12M8 17h8",
	server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
	shieldOff: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM4 4l16 16",
	shieldOk: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
	wifi: "M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01",
	pause: "M7 5h4v14H7zM13 5h4v14h-4z",
	cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5",
	lock: "M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3",
	refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
	chevron: "M6 9l6 6 6-6",
	expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
};
function Ve(e, t) {
	if (t && t in O) return O[t];
	let n = e.toLowerCase();
	return /büro|arbeits/.test(n) ? O.desk : /bad|wc/.test(n) ? O.bath : /schlaf/.test(n) ? O.bed : /flur|diele|treppe/.test(n) ? O.door : /wohn/.test(n) ? O.sofa : /küche|kuche|ess/.test(n) ? O.pot : /garten|terrasse|balkon/.test(n) ? O.tree : O.home;
}
function He(e) {
	switch (e) {
		case "sunny": return O.sun;
		case "clear-night": return O.moon;
		case "rainy":
		case "pouring": return O.rain;
		case "lightning":
		case "lightning-rainy":
		case "windy":
		case "windy-variant": return O.storm;
		case "snowy":
		case "snowy-rainy":
		case "hail": return O.snow;
		case "fog": return O.fog;
		default: return O.cloud;
	}
}
var k = {
	flame: "M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1 1.5 2 3 2-1-3 0-5 0-7z",
	leaf: "M5 19c8 0 14-6 14-14-8 0-14 6-14 14zM5 19l7-7",
	snowflake: "M12 2v20M4 6l16 12M20 6 4 18",
	drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
	fan: "M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4M12 10c0-4 1-7 4-7 2 0 3 2 2 4l-4 3M14 12c4 0 7 1 7 4 0 2-2 3-4 2l-3-4M12 14c0 4-1 7-4 7-2 0-3-2-2-4l4-3M10 12c-4 0-7-1-7-4 0-2 2-3 4-2l3 4",
	tune: "M10 14.8V5a2 2 0 1 1 4 0v9.8a4 4 0 1 1-4 0zM17 6h4M19 4v4M17 12h4",
	back: "M15 5l-7 7 7 7",
	trend: "M3 17l5-5 4 4 8-8",
	power: "M12 3v8M6.4 6.4a8 8 0 1 0 11.2 0",
	scene: "M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9 5.5-.8z",
	plug: "M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5",
	clock: "M12 6v6l4 2M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18",
	play: "M7 4l13 8-13 8z",
	stop: "M6 6h12v12H6z"
}, Ue = {
	eco: k.leaf,
	comfort: O.sofa,
	boost: k.flame,
	frost: k.snowflake
}, A = {
	bulb: O.bulb,
	lamp: "M9 2h6l3 8H6zM12 10v11M8 21h8",
	strip: "M3 12h18M6 9v6M10 9v6M14 9v6M18 9v6",
	tv: "M3 6h18v12H3zM8 21h8",
	fan: k.fan,
	drop: k.drop,
	plug: "M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4",
	boiler: "M7 3h10v14a5 5 0 0 1-10 0zM10 21h4M12 8v4",
	dryer: "M4 3h16v18H4zM12 9a4 4 0 1 0 0 8a4 4 0 1 0 0-8M7 6h.01",
	brightness: "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
};
function We(e, t) {
	let n = `${e} ${t}`.toLowerCase();
	return e.startsWith("fan.") ? A.fan : e.startsWith("humidifier.") ? A.drop : e.startsWith("light.") ? /led|strip|sideboard|stimmung|couch|regal/.test(n) ? A.strip : /stehlampe|uhr|wandlampe/.test(n) ? A.lamp : A.bulb : /tv|fernseh|heimkino|kino/.test(n) ? A.tv : /brunnen|pumpe/.test(n) ? A.drop : /trockner|wasch/.test(n) ? A.dryer : /warmwasser|boiler/.test(n) ? A.boiler : /deckenlampe|lampe|licht/.test(n) ? A.bulb : A.plug;
}
// node_modules/lit-html/directive.js
var Ge = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Ke = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), qe = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
};
// src/logic/gestures.ts
function Je(e, t, n) {
	return e < 30 ? !1 : e >= Math.max(80, Math.min(140, n * .25)) || t >= .5;
}
function Ye(e) {
	return e >= 0 ? e : -Math.min(40, Math.round(-e * .15));
}
function Xe(e, t) {
	let n = 0, r = Infinity;
	return t.forEach((t, i) => {
		let a = e < t.left ? t.left - e : e > t.right ? e - t.right : 0;
		a < r && (r = a, n = i);
	}), n;
}
function Ze(e, t, n, r) {
	let i = Math.max(r, Math.min(n - r - t, e - t / 2));
	return {
		left: Math.round(i),
		width: t
	};
}
// src/components/swipe.ts
var Qe = ".grabber, .sheet-head", $e = /* @__PURE__ */ new WeakMap();
function et(e) {
	let t = e.previousElementSibling;
	return t instanceof HTMLElement && t.classList.contains("backdrop") ? t : null;
}
function tt(e, t) {
	e.style.setProperty("--drag", `${t}px`);
	let n = et(e);
	n && (n.style.opacity = String(Math.max(.15, 1 - Math.max(0, t) / (e.offsetHeight || 600))));
}
function nt(e) {
	e.style.removeProperty("--drag"), e.style.transition = "";
	let t = et(e);
	t && (t.style.opacity = "", t.style.transition = "");
}
function rt(e, t, n, r) {
	Object.assign(e, {
		startX: t,
		startY: n,
		active: !1,
		decided: !1,
		fromHead: r,
		samples: [{
			y: n,
			t: performance.now()
		}],
		dy: 0
	});
}
function it(e, t, n, r) {
	let i = r - t.startY, a = n - t.startX;
	if (!t.decided) {
		if (Math.abs(i) < 6 && Math.abs(a) < 6) return !1;
		if (t.decided = !0, t.active = Math.abs(i) > Math.abs(a) && i > 0 && (t.fromHead || e.scrollTop <= 0), t.active) {
			e.style.transition = "none";
			let t = et(e);
			t && (t.style.transition = "none");
		}
	}
	return t.active ? (t.dy = Ye(i), t.samples.push({
		y: r,
		t: performance.now()
	}), t.samples.length > 5 && t.samples.shift(), tt(e, t.dy), !0) : !1;
}
function at(e, t) {
	if (!t.active) return;
	t.active = !1;
	let n = t.samples[0], r = t.samples[t.samples.length - 1], i = r.t - n.t >= 16 ? (r.y - n.y) / (r.t - n.t) : 0, a = et(e);
	Je(t.dy, i, e.offsetHeight) ? (e.style.transition = "transform 0.2s ease-in", a && (a.style.transition = "opacity 0.2s ease-in"), tt(e, e.offsetHeight + 40), a && (a.style.opacity = "0"), window.setTimeout(() => {
		t.onClose(), nt(e);
	}, 190)) : (e.style.transition = "transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.15)", a && (a.style.transition = "opacity 0.3s ease-out"), tt(e, 0), a && (a.style.opacity = ""), window.setTimeout(() => nt(e), 340));
}
function ot(e) {
	let t = () => $e.get(e);
	e.addEventListener("touchstart", (e) => {
		if (e.touches.length !== 1) return;
		let n = e.touches[0], r = e.target;
		r.closest("start-dashboard-slider, input") || rt(t(), n.clientX, n.clientY, !!r.closest(Qe));
	}, { passive: !0 }), e.addEventListener("touchmove", (n) => {
		let r = n.touches[0];
		r && it(e, t(), r.clientX, r.clientY) && n.cancelable && n.preventDefault();
	}, { passive: !1 }), e.addEventListener("touchend", () => at(e, t())), e.addEventListener("touchcancel", () => at(e, t())), e.addEventListener("pointerdown", (n) => {
		if (n.pointerType !== "mouse" || n.button !== 0 || !n.target.closest(Qe)) return;
		rt(t(), n.clientX, n.clientY, !0);
		let r = (n) => it(e, t(), n.clientX, n.clientY), i = () => {
			window.removeEventListener("pointermove", r), window.removeEventListener("pointerup", i);
			let n = t().active;
			at(e, t()), n && e.addEventListener("click", (e) => e.stopPropagation(), {
				capture: !0,
				once: !0
			});
		};
		window.addEventListener("pointermove", r), window.addEventListener("pointerup", i);
	});
}
var st = Ke(class extends qe {
	constructor(e) {
		if (super(e), e.type !== Ge.ELEMENT) throw Error("swipeToClose() must be used as an element directive");
	}
	render(e) {
		return T;
	}
	update(e, [t]) {
		let n = e.element, r = $e.get(n);
		return r ? r.onClose = t : ($e.set(n, {
			onClose: t,
			startX: 0,
			startY: 0,
			active: !1,
			decided: !1,
			fromHead: !1,
			samples: [],
			dy: 0
		}), ot(n)), T;
	}
});
// src/components/ui.ts
function j(e, t, n, r = 2.2) {
	return C`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke=${n} stroke-width=${r}
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${e}></path></svg>`;
}
var ct = [
	"#ffb340",
	"#64d2ff",
	"#bf9bff",
	"#7ee8a0",
	"#ff9f0a",
	"#ff6b5e"
];
function lt(e, t, n, r = 18) {
	return e && customElements.get("ha-icon") ? C`<ha-icon .icon=${e} style="--mdc-icon-size:${r}px;color:${n}"></ha-icon>` : j(t, r - 2, n, 2.1);
}
function M(e) {
	let t = e.onBack ?? e.onClose;
	return C`
    <div class="backdrop" @click=${t}></div>
    <section class="sheet" role="dialog" aria-modal="true" aria-label=${e.title}
      style="background-image: radial-gradient(100% 30% at 50% 0%, ${e.glow}, transparent 70%)"
      ${st(t)}
      @keydown=${(e) => e.key === "Escape" && t()}>
      <div class="grabber" aria-hidden="true"></div>
      <header class="sheet-head">
        ${e.onBack ? C`<button class="close back" aria-label="Zurück" @click=${e.onBack}>${j("M15 5l-7 7 7 7", 18, "#fff", 2.4)}</button>` : C`<span class="circle" style="width:44px;height:44px;background:${e.color}">${e.iconTemplate ?? j(e.iconPath, 20, e.iconStroke ?? "#141008", 2)}</span>`}
        <span class="sheet-title">
          <h1 class="ellipsis">${e.title}</h1>
          ${e.subtitle ? C`<span class="sheet-sub">${e.subtitle}</span>` : ""}
        </span>
        ${e.headerExtra ?? ""}
        ${e.noClose ? "" : C`<button class="close" aria-label="Schließen" @click=${e.onClose}>${j(O.close, 16, "#fff", 2.4)}</button>`}
      </header>
      ${e.body}
    </section>
  `;
}
function ut(e) {
	return M({
		title: e.title,
		color: e.color,
		glow: e.color + "33",
		iconPath: e.iconPath,
		onClose: e.onClose,
		body: C`
      <p class="confirm-text">${e.text}</p>
      <div class="confirm-row">
        <button class="btn" @click=${e.onClose}>Abbrechen</button>
        <button class="btn primary" style="background:${e.color}" @click=${() => {
			e.onConfirm(), e.onClose();
		}}>${e.confirm}</button>
      </div>
    `
	});
}
var dt = o`
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    background: rgba(0, 0, 0, 0.55);
    animation: fade 0.2s ease-out;
  }
  .sheet {
    position: fixed;
    z-index: 21;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, var(--drag, 0px));
    width: min(100%, 480px);
    max-height: calc(100% - 44px);
    overflow-y: auto;
    overscroll-behavior: contain;
    border-radius: 42px 42px 0 0;
    background-color: var(--sd-sheet);
    padding: 8px 14px calc(24px + env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: rise 0.28s cubic-bezier(0.2, 0.9, 0.3, 1);
  }
  /* Stacked sheets: the one underneath shrinks back and dims, like iOS. */
  .layer {
    display: contents;
  }
  .layer.under .sheet {
    transform: translate(-50%, -12px) scale(0.93);
    transform-origin: 50% 0;
    filter: brightness(0.6);
    transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.3s;
  }
  .layer .sheet {
    transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.3s;
  }
  .layer.stacked .backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  .grabber {
    position: relative;
    cursor: grab;
    align-self: center;
    width: 40px;
    height: 5px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.25);
  }
  .grabber::before {
    content: '';
    position: absolute;
    inset: -12px -60px -8px;
  }
  .sheet-head {
    cursor: grab;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 60px;
    padding: 0 6px 0 8px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.08);
  }
  .sheet-title {
    flex: 1;
    min-width: 0;
  }
  .sheet-title h1 {
    font-size: 18px;
    font-weight: 700;
  }
  .sheet-sub {
    display: block;
    font-size: 12px;
    color: var(--sd-muted);
  }
  .close {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: var(--sd-fill-2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .close.back {
    width: 44px;
    height: 44px;
    border-radius: 22px;
  }
  .confirm-text {
    margin: 6px 10px;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.85);
  }
  .confirm-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .btn {
    height: 52px;
    border-radius: 26px;
    background: var(--sd-fill-2);
    font-size: 15px;
    font-weight: 700;
    text-align: center;
  }
  .btn.primary {
    color: #101010;
  }
  @keyframes rise {
    from {
      transform: translate(-50%, 100%);
    }
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .sheet,
    .backdrop {
      animation: none;
    }
  }
`, ft = {
	weather: "weather.musterstadt",
	precipitation: "sensor.musterstadt_niederschlag",
	alarm: "alarm_control_panel.alarmo",
	vacuum: "vacuum.robby",
	vacuum_status: "sensor.robby_status",
	vacuum_quick: "button.robby_eg_saugen",
	front_door: "binary_sensor.fenstersensor_haustur_contact",
	grid_import: "sensor.stromverbrauch_shelly_messung",
	grid_export: "sensor.ruckeinspeisung_shelly_messung",
	waste: "sensor.naechster_abfalltermin",
	heating: "input_boolean.heizbetrieb",
	outdoor_temp: "sensor.aussen_temperature",
	outdoor_dew: "sensor.aussen_taupunkt_messung",
	ac: "climate.flur_1_og_klimaanlage",
	ac_power: "sensor.klimaanlage_power",
	airing_timer: "timer.luften",
	airing_duration: "sensor.stossluften_dauer",
	airing_start: "script.luften_starten",
	window_snooze: "input_text.fenster_ignorieren",
	preset_all: "script.heizung_preset_alle",
	all_rooms_apply: "script.alle_raume_anwenden",
	all_rooms_temperature: "input_number.alle_raume_temperatur",
	all_rooms_selection: "input_text.alle_raume_auswahl",
	all_rooms_duration: "input_select.alle_raume_dauer",
	delayed_off: "script.gerat_verzogert_ausschalten",
	house_power: "sensor.hausverbrauch",
	pv_power: "sensor.solar_total_power",
	battery_power: "sensor.marstek_venus_a_ac_leistung",
	battery_soc: "sensor.marstek_venus_a_batterie_ladezustand",
	pv_today: "sensor.pv_heute",
	import_today: "sensor.netzbezug_heute",
	export_today: "sensor.einspeisung_heute",
	untracked_power: "sensor.stromverbrauch_nicht_erfasst",
	camera: "camera.doorbell01",
	camera_motion: "binary_sensor.doorbell01_bewegung",
	camera_person: "binary_sensor.doorbell01_person",
	vacuum_battery: "sensor.robby_batterie",
	vacuum_error: "sensor.robby_staubsauger_fehler",
	vacuum_map: "select.robby_ausgewahlte_karte",
	vacuum_mode: "select.flur_eg_robby_reinigungsmodus",
	vacuum_mop: "select.robby_wischmopp_intensiat",
	vacuum_selection: "input_text.robby_raumauswahl",
	vacuum_passes: "input_number.robby_durchgange",
	vacuum_map_script: "script.robby_karte_wahlen",
	vacuum_room_script: "script.robby_raum_umschalten",
	vacuum_clean_script: "script.robby_auswahl_reinigen"
}, pt = ["binary_sensor.flur_1_og_klimaanlage_filteralarm", "binary_sensor.klima_eg_filter_cleaning_reminder"], mt = {
	weather: "weather",
	alarm: "alarm",
	vacuum: "vacuum",
	front_door: "front_door",
	ac: "ac"
};
function N(e, t) {
	let n = e.entities?.[t];
	if (typeof n == "string" && n) return n;
	let r = mt[t], i = r ? e[r] : void 0;
	return typeof i == "string" && i ? i : ft[t];
}
function ht(e) {
	return e.entities?.filter_alarms ?? pt;
}
function gt(e) {
	let [t, n] = e.split(".");
	return [t, n];
}
// src/logic/util.ts
function P(e, t) {
	if (!t) return null;
	let n = e.states[t]?.state;
	if (n === void 0 || n === "" || n === "unknown" || n === "unavailable") return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function F(e, t) {
	return t ? e.states[t]?.state : void 0;
}
function I(e, t = 0) {
	return e.toLocaleString("de-DE", {
		minimumFractionDigits: t,
		maximumFractionDigits: t
	});
}
function L(e, t) {
	let n = e.entities[t];
	if (n) return n.area_id ? n.area_id : (n.device_id ? e.devices[n.device_id] : void 0)?.area_id ?? void 0;
}
function _t(e, t) {
	let n = e.entities[t], r = n?.device_id ? e.devices[n.device_id] : void 0;
	return r && (r.name_by_user || r.name) || void 0;
}
function R(e, t, n) {
	return n?.[t] ? n[t] : e.states[t]?.attributes.friendly_name ?? t.split(".")[1];
}
function vt(e, t, n) {
	let r = e.states[t]?.last_changed;
	return r ? Math.max(0, Math.floor((n.getTime() - new Date(r).getTime()) / 6e4)) : 0;
}
function z(e) {
	if (e < 60) return `${e} min`;
	let t = Math.floor(e / 60), n = e % 60;
	return n ? `${t} h ${n} min` : `${t} h`;
}
// src/logic/weather.ts
var yt = {
	"clear-night": "Klar",
	cloudy: "Bewölkt",
	exceptional: "Unwetter",
	fog: "Nebel",
	hail: "Hagel",
	lightning: "Gewitter",
	"lightning-rainy": "Gewitter",
	partlycloudy: "Teils bewölkt",
	pouring: "Starkregen",
	rainy: "Regen",
	snowy: "Schnee",
	"snowy-rainy": "Schneeregen",
	sunny: "Sonnig",
	windy: "Windig",
	"windy-variant": "Windig"
}, bt = [
	"N",
	"NO",
	"O",
	"SO",
	"S",
	"SW",
	"W",
	"NW"
];
function xt(e) {
	return bt[Math.round((e % 360 + 360) % 360 / 45) % 8];
}
var St = (e, t) => e.toDateString() === t.toDateString(), Ct = (e) => I(e, 1);
function wt(e, t, n, r = /* @__PURE__ */ new Date()) {
	let i = e.states[N(t, "precipitation")]?.state;
	if (i !== void 0 && i !== "" && Number.isFinite(Number(i))) return Number(i);
	let a = new Date(r);
	a.setMinutes(0, 0, 0);
	let o = n.find((e) => new Date(e.datetime).getTime() === a.getTime());
	return o?.precipitation === void 0 ? null : o.precipitation;
}
function Tt(e, t, n, r = /* @__PURE__ */ new Date(), i = []) {
	let a = e.states[N(t, "weather")], o = a?.attributes ?? {}, s = Number(o.temperature), c = n[0], l = c && St(new Date(c.datetime), r) ? c : void 0, u = "";
	l?.temperature !== void 0 && (u = `heute ${l.templow === void 0 ? "" : `${Math.round(l.templow)}° – `}${Math.round(l.temperature)}°${l.precipitation ? ` · ${Ct(l.precipitation)} mm` : ""}`);
	let d = o.latest_update ? new Date(o.latest_update) : void 0, f = [/DWD|Deutscher Wetterdienst/.test(String(o.attribution ?? "")) ? "DWD" : "", d && !Number.isNaN(d.getTime()) ? `Stand ${d.getHours()} Uhr` : ""].filter(Boolean).join(" · "), p = [], m = (e) => o[e] !== void 0 && o[e] !== null && Number.isFinite(Number(o[e])), h = wt(e, t, i, r);
	h !== null && p.push({
		key: "precipitation",
		label: `Regen ${Ct(h)} mm/h`
	}), m("humidity") && p.push({
		key: "humidity",
		label: `Feuchte ${Math.round(o.humidity)} %`
	}), m("wind_speed") && p.push({
		key: "wind",
		label: `Wind ${Math.round(o.wind_speed)} ${o.wind_speed_unit ?? "km/h"}${m("wind_bearing") ? ` ${xt(Number(o.wind_bearing))}` : ""}`
	}), m("pressure") && p.push({
		key: "pressure",
		label: `${Math.round(o.pressure)} ${o.pressure_unit ?? "hPa"}`
	}), m("uv_index") && p.push({
		key: "uv",
		label: `UV ${Math.round(o.uv_index)}`
	}), m("visibility") && p.push({
		key: "visibility",
		label: `Sicht ${Math.round(o.visibility)} ${o.visibility_unit ?? "km"}`
	});
	let g = a?.state ?? "";
	return {
		temp: Number.isFinite(s) ? `${Math.round(s)}°` : "–",
		label: yt[g] ?? g,
		condition: g,
		today: u,
		source: f,
		chips: p
	};
}
function Et(e, t, n = 6, r = 2) {
	let i = new Date(t);
	return i.setMinutes(0, 0, 0), e.filter((e) => new Date(e.datetime).getTime() >= i.getTime()).filter((e, t) => t % r === 0).slice(0, n).map((e) => ({
		t: String(new Date(e.datetime).getHours()).padStart(2, "0"),
		temp: e.temperature === void 0 ? null : Math.round(e.temperature),
		rain: e.precipitation === void 0 ? "" : Ct(e.precipitation),
		condition: e.condition ?? ""
	}));
}
var Dt = (e) => Math.round(e * 100) / 100;
function Ot(e, t = 7) {
	let n = e.slice(0, t).filter((e) => e.temperature !== void 0), r = n.map((e) => e.templow ?? e.temperature), i = Math.min(...r), a = Math.max(...n.map((e) => e.temperature)) - i || 1;
	return n.map((e, t) => {
		let n = Math.round(r[t]), o = Math.round(e.temperature);
		return {
			date: e.datetime,
			day: new Date(e.datetime).toLocaleDateString("de-DE", { weekday: "short" }).replace(".", ""),
			min: n,
			max: o,
			rain: e.precipitation ? `${Ct(e.precipitation)} mm` : "",
			condition: e.condition ?? "",
			left: Dt((r[t] - i) / a * 100),
			width: Dt(Math.max((e.temperature - r[t]) / a * 100, 4))
		};
	});
}
function kt(e, t) {
	let n = new Date(e.datetime), r = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime(), i = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1).getTime(), a = t.filter((e) => {
		let t = new Date(e.datetime).getTime();
		return t >= r && t < i;
	}), o = [];
	if (e.precipitation !== void 0 && o.push({
		key: "rain",
		label: `Regen ${Ct(e.precipitation)} mm`
	}), e.sun_duration !== void 0 && o.push({
		key: "sun",
		label: `Sonne ${I(e.sun_duration / 3600, 1)} h`
	}), e.wind_speed !== void 0) {
		let t = e.wind_bearing === void 0 ? "" : ` ${xt(e.wind_bearing)}`, n = e.wind_gust_speed === void 0 ? "" : ` · Böen ${Math.round(e.wind_gust_speed)}`;
		o.push({
			key: "wind",
			label: `Wind ${Math.round(e.wind_speed)} km/h${t}${n}`
		});
	}
	return e.humidity !== void 0 && o.push({
		key: "humidity",
		label: `Feuchte ${Math.round(e.humidity)} %`
	}), e.uv_index !== void 0 && o.push({
		key: "uv",
		label: `UV ${Math.round(e.uv_index)}`
	}), {
		title: n.toLocaleDateString("de-DE", {
			weekday: "long",
			day: "numeric",
			month: "long"
		}),
		label: yt[e.condition ?? ""] ?? e.condition ?? "",
		condition: e.condition ?? "",
		max: e.temperature === void 0 ? null : Math.round(e.temperature),
		min: e.templow === void 0 ? null : Math.round(e.templow),
		facts: o,
		hours: a.filter((e) => new Date(e.datetime).getHours() % 3 == 0).map((e) => ({
			t: String(new Date(e.datetime).getHours()).padStart(2, "0"),
			temp: e.temperature === void 0 ? null : Math.round(e.temperature),
			rain: e.precipitation ? Ct(e.precipitation) : "",
			condition: e.condition ?? ""
		})),
		temps: a.filter((e) => e.temperature !== void 0).map((e) => ({
			t: new Date(e.datetime).getTime(),
			v: e.temperature
		})),
		rain: a.filter((e) => e.precipitation !== void 0).map((e) => ({
			t: new Date(e.datetime).getTime(),
			v: e.precipitation
		})),
		start: r,
		end: i
	};
}
function At(e, t) {
	let n = (t.pollen ?? Object.keys(e.states).filter((e) => e.startsWith("sensor.pollenflug_"))).map((t) => ({
		name: String(e.states[t]?.attributes.friendly_name ?? t.split(".")[1]),
		v: P(e, t)
	})).filter((e) => e.v !== null);
	if (!n.length) return null;
	let r = n.filter((e) => e.v > 0).sort((e, t) => t.v - e.v);
	return r.length ? {
		level: r[0].v,
		title: "Pollenflug",
		text: r.map((e) => `${e.name} ${I(e.v, e.v % 1 ? 1 : 0)}`).join(" · ")
	} : {
		level: 0,
		title: "Kein Pollenflug",
		text: `alle ${n.length} Pollenarten 0`
	};
}
var jt = /_(current_warning_level|advance_warning_level|aktuelle_warnstufe|vorwarnstufe)$/, Mt = [
	"#7ee8a0",
	"#ffd60a",
	"#ff9f0a",
	"#ff453a",
	"#bf5af2"
];
function Nt(e, t) {
	return t.warnings ? t.warnings : Object.keys(e.states).filter((t) => t.startsWith("sensor.") && (e.entities[t]?.platform === "dwd_weather_warnings" || jt.test(t)));
}
function Pt(e, t) {
	if (St(e, t)) return "heute";
	let n = new Date(t);
	return n.setDate(t.getDate() + 1), St(e, n) ? "morgen" : e.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
}
var Ft = (e) => e.toLocaleTimeString("de-DE", {
	hour: "2-digit",
	minute: "2-digit"
});
function It(e, t, n, r) {
	if (n || e && e <= r) return t ? St(t, r) ? `bis ${Ft(t)}` : `bis ${Pt(t, r)} ${Ft(t)}` : "jetzt";
	if (!e) return "";
	let i = `${Pt(e, r)} ${Ft(e)}`;
	return t ? St(e, t) ? `${i} – ${Ft(t)}` : `${i} – ${Pt(t, r)} ${Ft(t)}` : `ab ${i}`;
}
var Lt = (e) => e.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (e, t, n) => t + n.toUpperCase());
function Rt(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let i of Nt(e, t)) {
		let t = e.states[i]?.attributes;
		if (!t) continue;
		let a = !/advance|vorwarn/.test(i), o = Number(t.warning_count) || 0;
		for (let e = 0; e <= o; e++) {
			let i = (n) => t[`warning_${e}_${n}`];
			if (!i("headline") && !i("name")) continue;
			let o = Number(i("level")) || 0;
			if (o < 1) continue;
			let s = i("start") ? new Date(String(i("start"))) : null, c = i("end") ? new Date(String(i("end"))) : null;
			if (c && c < n) continue;
			let l = {
				title: i("name") ? Lt(String(i("name"))) : String(i("headline")),
				headline: String(i("headline") ?? i("name")),
				text: String(i("description") ?? ""),
				level: o,
				color: typeof i("color") == "string" && i("color") ? String(i("color")) : Mt[Math.min(o, 4)],
				current: a,
				from: s,
				to: c
			}, u = `${a}|${l.title}`, d = r.get(u);
			if (!d) {
				r.set(u, l);
				continue;
			}
			let f = {
				from: d.from && l.from ? l.from < d.from ? l.from : d.from : null,
				to: d.to && l.to ? l.to > d.to ? l.to : d.to : null
			};
			r.set(u, {
				...l.level > d.level ? l : d,
				...f
			});
		}
	}
	return [...r.values()].map(({ from: e, to: t, ...r }) => ({
		...r,
		when: It(e, t, r.current, n),
		start: e?.toISOString()
	})).sort((e, t) => Number(t.current) - Number(e.current) || t.level - e.level);
}
var zt = {
	humidity: {
		name: "Luftfeuchte",
		unit: "%",
		color: "#5ac8fa",
		attr: "humidity",
		digits: 0,
		snap: 5
	},
	wind: {
		name: "Wind",
		unit: "km/h",
		color: "#7ee8a0",
		attr: "wind_speed",
		digits: 0,
		snap: 5
	},
	pressure: {
		name: "Luftdruck",
		unit: "hPa",
		color: "#bf9bff",
		attr: "pressure",
		digits: 0,
		snap: 2
	},
	uv: {
		name: "UV-Index",
		unit: "",
		color: "#ffd60a",
		attr: "uv_index",
		digits: 0,
		snap: 1
	},
	visibility: {
		name: "Sicht",
		unit: "km",
		color: "#8fd0ff",
		attr: "visibility",
		digits: 0,
		snap: 5
	}
};
function Bt(e, t, n) {
	let r = zt[e].attr;
	return {
		past: t.map((e) => ({
			t: Math.round(e.lu * 1e3),
			v: Number(e.a?.[r])
		})).filter((e) => Vt(e.v)),
		future: n.map((t) => {
			let n = Number(t[r]);
			return e === "visibility" && n > 200 && (n /= 1e3), {
				t: Date.parse(t.datetime),
				v: n
			};
		}).filter((e) => Vt(e.v) && Number.isFinite(e.t))
	};
}
var Vt = (e) => Number.isFinite(e), Ht = 10, Ut = /zurucksetzen|zuruecksetzen|reset/;
function Wt(e, t) {
	let n = e.entities[t]?.device_id;
	return n ? Object.values(e.entities).filter((e) => e.device_id === n).map((e) => e.entity_id) : [];
}
function Gt(e, t, n) {
	return Wt(e, t).find((e) => e.startsWith("button.") && n.test(e));
}
function Kt(e) {
	return Yn(e).map((t) => {
		let n = Wt(e, t.id).find((e) => e.startsWith("sensor.") && e.endsWith("_battery_type")), r = n ? F(e, n) : void 0, i = r && ![
			"unknown",
			"unavailable",
			""
		].includes(r);
		return {
			id: t.id,
			name: t.name,
			detail: i ? `${I(t.level)} % · ${r}` : `${I(t.level)} %`,
			reset: Gt(e, t.id, /_battery_replaced$/)
		};
	});
}
function qt(e, t) {
	let n = [], r = (t) => _t(e, t) ?? R(e, t), i = (t) => Gt(e, t, RegExp(`filter.*(${Ut.source})|(${Ut.source}).*filter`));
	for (let a of ht(t)) F(e, a) === "on" && n.push({
		id: a,
		name: r(a),
		detail: "Filter reinigen",
		reset: i(a)
	});
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.endsWith("filter_life")) continue;
		let a = P(e, t);
		a !== null && a < Ht && n.push({
			id: t,
			name: r(t),
			detail: `Filter ${I(a)} %`,
			reset: i(t)
		});
	}
	return n;
}
// src/logic/robby.ts
var Jt = {
	charging: "Lädt",
	charging_complete: "Geladen",
	cleaning: "Reinigt",
	segment_cleaning: "Reinigt",
	zoned_cleaning: "Reinigt",
	spot_cleaning: "Reinigt",
	room_clean: "Reinigt",
	returning: "Fährt zur Station",
	returning_home: "Fährt zur Station",
	idle: "Bereit",
	paused: "Pausiert",
	error: "Fehler",
	docked: "Angedockt",
	sleeping: "Schläft",
	emptying_the_bin: "Leert Behälter",
	washing_the_mop: "Wäscht Mopp",
	going_to_wash_the_mop: "Fährt zum Waschen",
	remote_control: "Fernsteuerung",
	manual_mode: "Manuell",
	updating: "Update"
};
function Yt(e, t) {
	let n = e.states[N(t, "vacuum")], r = F(e, N(t, "vacuum_status")) ?? n?.state ?? "unavailable", i = P(e, N(t, "vacuum_battery")) ?? (Number.isFinite(Number(n?.attributes.battery_level)) ? Number(n.attributes.battery_level) : null), a = F(e, N(t, "vacuum_error")), o = n?.state === "error" || r === "error" || !!a && ![
		"none",
		"unknown",
		"unavailable",
		""
	].includes(a), s = r === "unavailable" ? "Offline" : r === "charging" && i !== null && i >= 100 ? "Geladen" : Jt[r] ?? r;
	return {
		label: i === null ? s : `${s} · ${Math.round(i)} %`,
		battery: i,
		cleaning: n?.state === "cleaning" || /cleaning/.test(r),
		docked: n?.state === "docked",
		error: o
	};
}
var Xt = [
	[
		/filter/,
		"Filter",
		/filter/
	],
	[
		/sensor(?!_robby)|sensorzeit/,
		"Sensoren",
		/_sensor_/
	],
	[
		/haupt/,
		"Hauptbürste",
		/haupt/
	],
	[
		/seiten/,
		"Seitenbürste",
		/seiten/
	]
];
function Zt(e, t) {
	let n = N(t, "vacuum"), r = n.split(".")[1], i = [];
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.includes(r) || !t.endsWith("_minutes")) continue;
		let a = t.slice(7).replace(/^sensor_/, ""), o = Xt.find(([e]) => e.test(a)), s = o?.[1];
		if (!o || !s || i.some((e) => e.name === s)) continue;
		let c = P(e, t);
		c !== null && i.push({
			id: t,
			name: s,
			due: c <= 0,
			value: c <= 0 ? "fällig" : `${Math.round(c / 60)} h`,
			reset: Gt(e, n, RegExp(`${o[2].source}.*(${Ut.source})`))
		});
	}
	let a = Xt.map(([, e]) => e);
	return i.sort((e, t) => a.indexOf(e.name) - a.indexOf(t.name));
}
var Qt = {
	EG: {
		16: "Küche",
		17: "Wohnen",
		18: "Flur",
		19: "Essen"
	},
	OG: {
		16: "Büro 1",
		17: "Büro 2",
		18: "Flur",
		19: "WC",
		20: "Bad"
	},
	Schlafzimmer: { 0: "Schlafz." }
};
function $t(e, t) {
	let n = e.states[N(t, "vacuum_map")]?.attributes.options ?? Object.keys(Qt), r = t.vacuum_maps ?? Qt;
	return n.filter((e) => e !== "custom").map((e) => ({
		name: e,
		rooms: Object.entries(r[e] ?? {}).map(([e, t]) => ({
			segment: Number(e),
			name: t
		})).filter((e) => Number.isFinite(e.segment)).sort((e, t) => e.segment - t.segment)
	}));
}
function en(e, t) {
	return (F(e, N(t, "vacuum_selection")) ?? "").split(",").map((e) => e.trim()).filter((e) => /^\d+$/.test(e)).map(Number);
}
var tn = [
	{
		tag: "EG",
		name: "Saugen",
		color: "#64d2ff",
		button: "button.robby_eg_saugen"
	},
	{
		tag: "EG",
		name: "Saugen + Wischen",
		color: "#5ac8fa",
		button: "button.robby_eg_weekend"
	},
	{
		tag: "EG",
		name: "Täglich K/E/F",
		color: "#8fd8ff",
		button: "button.robby_eg_taglich"
	},
	{
		tag: "OG",
		name: "Saugen",
		color: "#bf9bff",
		button: "button.robby_og_saugen"
	},
	{
		tag: "SZ",
		name: "Schlafzimmer",
		color: "#ffb340",
		button: "button.robby_schlafzimmer"
	},
	{
		tag: "Alle",
		name: "Karte komplett",
		color: "#7ee8a0"
	}
];
function nn(e) {
	return e.vacuum_programs ?? tn;
}
function rn(e) {
	return e <= 0 ? "Raum wählen" : e === 1 ? "1 Raum starten" : `${e} Räume starten`;
}
var an = [
	{
		id: "vacuum",
		name: "Saugen"
	},
	{
		id: "vac_and_mop",
		name: "Saugen + Wischen"
	},
	{
		id: "mop",
		name: "Wischen"
	}
], on = [
	{
		id: "quiet",
		name: "Leise"
	},
	{
		id: "balanced",
		name: "Normal"
	},
	{
		id: "turbo",
		name: "Turbo"
	},
	{
		id: "max",
		name: "Max"
	},
	{
		id: "max_plus",
		name: "Max+"
	}
], sn = [
	{
		id: "mild",
		name: "Mild"
	},
	{
		id: "standard",
		name: "Standard"
	},
	{
		id: "intense",
		name: "Intensiv"
	}
], cn = {
	waschmaschine: "washer",
	trockner: "dryer",
	spulmaschine: "dishwasher"
};
function ln(e, t, n, r) {
	let i = (n.split(".")[1] ?? n).replace(/_fertig$/, "");
	return {
		slug: i,
		name: r ?? R(e, n).replace(/\s*fertig$/i, ""),
		power: t,
		done: n,
		kind: cn[i] ?? "other"
	};
}
function un(e, t) {
	return t.appliances ? t.appliances.map((t) => ln(e, t.power, t.done, t.name)) : Object.keys(e.states).map((e) => /^input_boolean\.(.+)_fertig$/.exec(e)).filter((t) => !!t && `sensor.${t[1]}_power` in e.states).map((t) => ln(e, `sensor.${t[1]}_power`, t[0]));
}
function dn(e, t, n, r) {
	let i = P(e, t.power) ?? 0;
	if (e.states[t.done]?.state === "on") return {
		running: !1,
		power: i
	};
	let a = e.states[t.done]?.last_changed, o = a ? new Date(a).getTime() : -Infinity, s = e.states[t.power]?.last_changed, c = s ? new Date(s).getTime() : n.getTime(), l = i >= 10 && c > o;
	if (!r) return l ? {
		running: !0,
		power: i
	} : {
		running: !1,
		power: i
	};
	let u = r.filter((e) => e.t > o);
	e.states[t.power] && c > o && (!u.length || c > u[u.length - 1].t) && u.push({
		t: c,
		w: i
	});
	let d, f;
	u.forEach((e, t) => {
		if (e.w < 10) return;
		let r = t + 1 < u.length ? u[t + 1].t : n.getTime();
		(f === void 0 || e.t - f >= 9e5) && (d = e.t), f = Math.max(f ?? r, r);
	});
	let p = l || f !== void 0 && n.getTime() - f < 9e5;
	return p ? {
		running: p,
		since: d,
		power: i
	} : {
		running: p,
		power: i
	};
}
function fn(e, t) {
	return e.kind === "overdue" ? "alert" : e.kind === "airing" ? "vent" : t ? "heat" : "";
}
function pn(e) {
	return e < 60 ? `${e} min` : `${Math.floor(e / 60)} h`;
}
function mn(e, t, n, r, i = {}) {
	let a = t.window ? e.states[t.window] : void 0, o = F(e, t.airing), s = {
		kind: o === "Jetzt lüften" ? "recommend" : "none",
		openMin: 0,
		remaining: 0
	};
	if (!a) return s;
	if (a.state === "unavailable") return i.snoozed ? s : {
		...s,
		kind: "stuck"
	};
	if (a.state !== "on") return s;
	let c = Math.max(0, Math.floor((r.getTime() - new Date(a.last_changed).getTime()) / 1e3)), l = Math.floor(c / 60), u = {
		openMin: l,
		remaining: 0
	};
	if (i.stuck) return {
		...u,
		kind: "stuck"
	};
	if (i.snoozed) return {
		...u,
		kind: "open"
	};
	let d = P(e, N(n, "airing_duration")) ?? 15;
	return o === "Nicht lüften" && l >= 5 ? {
		...u,
		kind: "overdue",
		reason: "bringt nichts"
	} : l >= d + 5 ? {
		...u,
		kind: "overdue",
		reason: "Zeit um"
	} : {
		...u,
		kind: "airing",
		remaining: Math.max(0, d * 60 - c)
	};
}
var hn = (e) => e.split(".").pop();
function gn(e) {
	let t = {};
	for (let n of (e ?? "").split(";")) {
		let [e, r] = n.split("@"), i = parseInt(r ?? "", 36);
		e && Number.isFinite(i) && (t[e] = i * 6e4);
	}
	return t;
}
function _n(e, t, n) {
	return (e[hn(t)] ?? 0) > n;
}
function vn(e, t, n, r) {
	let i = hn(t), a = [[i, n], ...Object.entries(gn(e)).filter(([e]) => e !== i)].filter(([, e]) => e > r).sort((e, t) => t[1] - e[1]).map(([e, t]) => `${e}@${Math.ceil(t / 6e4).toString(36)}`);
	for (; a.join(";").length > 255;) a.pop();
	return a.join(";");
}
function yn(e, t, n, r) {
	if (r === null || e.length < 4) return !1;
	let i = [...e].reverse().find((e) => e.t <= n) ?? e[0], a = e.filter((e) => e.t > n);
	if (!a.length || i.v - r < 3) return !1;
	let o = i.v - Math.min(...a.map((e) => e.v)), s = t.map((e) => e.v), c = s.length ? Math.max(...s) - Math.min(...s) : 0;
	return o < .3 && c < 3;
}
// src/logic/health.ts
function bn(e) {
	return e.user?.is_admin !== !1;
}
var xn = 3, Sn = {
	color: "#aeb4c0",
	tint: "rgba(255,255,255,0.12)"
}, Cn = {
	motion: "Bewegungsmelder prüfen",
	door: "Türsensor prüfen",
	window: "Fenstersensor prüfen",
	temperature: "Temperatursensor prüfen",
	other: "Sensor prüfen"
}, wn = {
	motion: O.alert,
	door: O.door,
	window: O.window,
	temperature: O.thermo,
	other: O.alert
};
function Tn(e, t) {
	let n = e.states[t]?.attributes.entity_id;
	return Array.isArray(n) ? n : [];
}
function En(e, t, n, r, i) {
	let a = N(t, "front_door"), o = new Map(i.filter((e) => e.enabled && e.type !== "tamper").map((e) => [e.entity_id, e.type])), s = /* @__PURE__ */ new Map();
	for (let e of o.keys()) s.set(e, "alarmo");
	for (let e of n) e.temperature && s.set(e.temperature, "temperature");
	a && s.set(a, "door");
	for (let e of t.health?.extra ?? []) s.has(e) || s.set(e, "alarmo");
	for (let e of t.health?.exclude ?? []) s.delete(e);
	let c = /* @__PURE__ */ new Set();
	for (let t of n) t.window && t.window !== a && (c.add(t.window), F(e, t.window) === "unavailable" && Tn(e, t.window).forEach((e) => c.add(e)));
	let l = N(t, "window_snooze"), u = gn(e.states[l]?.state), d = (t, n) => {
		if (n !== "alarmo") return n;
		let r = o.get(t);
		return r === "motion" ? "motion" : r === "window" ? "window" : r === "door" ? /t(ü|u)r/i.test(`${t} ${R(e, t)}`) ? "door" : "window" : "other";
	}, f = [];
	for (let [t, i] of s) {
		if (c.has(t) || F(e, t) !== "unavailable" || _n(u, t, r.getTime())) continue;
		let a = L(e, t), o = n.find((e) => e.temperature === t || e.window === t || !!a && e.areas.includes(a));
		f.push({
			id: t,
			kind: d(t, i),
			room: o,
			where: o?.name ?? (a && e.areas[a]?.name) ?? R(e, t)
		});
	}
	if (f.length > xn) return [{
		id: "health-many",
		title: `${f.length} Sensoren offline`,
		text: f.map((t) => R(e, t.id)).join(" · "),
		icon: O.alert,
		...Sn,
		tap: { moreInfo: f[0].id }
	}];
	let p = e.states;
	return f.map((e) => ({
		id: `health:${e.id.split(".").pop()}`,
		title: Cn[e.kind],
		text: `${e.where} · Sensor nicht erreichbar`,
		icon: wn[e.kind],
		...Sn,
		tap: e.room ? { room: e.room.slug } : { moreInfo: e.id },
		action: p[l] ? {
			kind: "service",
			label: "1 h ignorieren",
			domain: "input_text",
			service: "set_value",
			target: { entity_id: l },
			data: { value: vn(p[l].state, e.id, r.getTime() + 36e5, r.getTime()) }
		} : void 0
	}));
}
// src/logic/overview.ts
var Dn = "dashboard_gerat", On = 5, kn = 15, An = 10;
function jn(e) {
	let t = e.getHours();
	return t >= 5 && t < 11 ? "Guten Morgen" : t >= 11 && t < 18 ? "Guten Tag" : t >= 18 && t < 23 ? "Guten Abend" : "Gute Nacht";
}
function Mn(e) {
	return e.toLocaleDateString("de-DE", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
var Nn = {
	"clear-night": "Klar",
	cloudy: "Bewölkt",
	exceptional: "Unwetter",
	fog: "Nebel",
	hail: "Hagel",
	lightning: "Gewitter",
	"lightning-rainy": "Gewitter",
	partlycloudy: "Heiter",
	pouring: "Starkregen",
	rainy: "Regen",
	snowy: "Schnee",
	"snowy-rainy": "Schneeregen",
	sunny: "Sonnig",
	windy: "Windig",
	"windy-variant": "Windig"
};
function Pn(e, t) {
	let n = e.states[t], r = n ? Number(n.attributes.temperature) : NaN;
	return {
		temp: Number.isFinite(r) ? `${I(Math.round(r))}°` : "–",
		label: n ? Nn[n.state] ?? n.state : "Wetter",
		icon: He(n?.state ?? "")
	};
}
function Fn(e) {
	return {
		armed_away: O.car,
		armed_vacation: O.car,
		armed_home: O.home,
		armed_night: O.moon
	}[e] ?? O.shield;
}
var In = {
	docked: "Dockt",
	cleaning: "Saugt",
	returning: "Fährt heim",
	paused: "Pause",
	idle: "Bereit",
	error: "Fehler",
	unavailable: "Offline"
}, Ln = {
	disarmed: "Aus",
	armed_away: "Abwesend",
	armed_home: "Zuhause",
	armed_night: "Nacht",
	armed_vacation: "Urlaub",
	armed_custom_bypass: "Scharf",
	arming: "Wird scharf",
	pending: "Countdown",
	triggered: "Alarm!",
	unavailable: "Offline"
};
function Rn(e) {
	let t = Object.keys(e.states).filter((t) => t.startsWith("light.") && !Array.isArray(e.states[t].attributes.entity_id) && !e.entities[t]?.hidden), n = t.filter((t) => e.entities[t]?.labels?.includes(Dn));
	return n.length ? n : t;
}
function zn(e) {
	return Rn(e).filter((t) => e.states[t].state === "on");
}
function Bn(e, t) {
	let n = P(e, N(t, "grid_import")) ?? 0, r = P(e, N(t, "grid_export")) ?? 0;
	return r > n && r > 0 ? {
		value: `${I(Math.round(r))} W`,
		label: "Einspeisung"
	} : {
		value: `${I(Math.round(n))} W`,
		label: "Netzbezug"
	};
}
function Vn(e, t) {
	let n = F(e, N(t, "vacuum")) ?? "unavailable", r = F(e, N(t, "alarm")) ?? "unavailable", i = Bn(e, t);
	return [
		{
			key: "robby",
			value: n === "docked" && (Yt(e, t).battery ?? 0) >= 100 ? "Geladen" : In[n] ?? n,
			label: "Robby",
			icon: O.vacuum,
			color: n === "error" ? "#ff453a" : "#ffffff",
			wobble: n === "cleaning"
		},
		{
			key: "light",
			value: `${zn(e).length} an`,
			label: "Licht",
			icon: O.bulb,
			color: "#ffd60a"
		},
		{
			key: "energy",
			value: i.value,
			label: i.label,
			icon: O.bolt,
			color: i.label === "Einspeisung" ? "#30d158" : "#ff9f0a"
		},
		{
			key: "alarm",
			value: Ln[r] ?? r,
			label: "Alarm",
			icon: Fn(r),
			color: r === "triggered" ? "#ff453a" : "#bf9bff"
		}
	];
}
var B = {
	blue: ["#5ac8fa", "rgba(90,200,250,0.3)"],
	purple: ["#bf9bff", "rgba(191,155,255,0.26)"],
	orange: ["#ff9f0a", "rgba(255,159,10,0.26)"],
	green: ["#7ee8a0", "rgba(126,232,160,0.18)"],
	red: ["#ff453a", "rgba(255,69,58,0.3)"],
	yellow: ["#ffd60a", "rgba(255,214,10,0.22)"],
	grey: ["#aeb4c0", "rgba(255,255,255,0.12)"]
};
function V(e, t, n, r, i, a, o) {
	return {
		id: e,
		title: t,
		text: n,
		icon: r,
		color: i[0],
		tint: i[1],
		tap: a,
		action: o
	};
}
var Hn = (e, t) => !!t && F(e, t) === "on";
function Un(e, t, n, r, i = [], a = (n) => mn(e, n, t, r), o = [], s = {}) {
	let c = [], l = e.states, u = N(t, "front_door");
	if (F(e, N(t, "alarm")) === "triggered" && c.push(V("alarm", "Alarm ausgelöst", "Jetzt prüfen", O.shield, B.red, "alarm")), Hn(e, u) && vt(e, u, r) >= On && c.push(V("door", "Haustür offen", `seit ${z(vt(e, u, r))}`, O.door, B.red, { moreInfo: u })), i.length) {
		let e = i.map((e) => `${e.name} +${I(e.rise, 1)}°`).join(" · ");
		c.push(V("heat", "Heizung prüfen", `${e} in ${i[0].hours} h ohne Heizbedarf`, O.thermo, B.orange, { room: i[0].slug }));
	}
	let d = Rt(e, t, r).filter((e) => e.current);
	if (d.length) {
		let [e, ...t] = d, n = [e.when, ...t.map((e) => `${e.title} ${e.when}`)].filter(Boolean).join(" · ");
		c.push(V("warn", `${e.level >= 3 ? "Unwetterwarnung" : "Warnung"}: ${e.title}`, n, O.storm, [e.color, `${e.color}44`], "weather"));
	}
	let f = l[N(t, "airing_timer")];
	if (f && f.state === "active") {
		let i = dr(e, n, t, r), a = i.openWindows.map((e) => e.name), o = [`noch ${U(i.remaining)}`, a.length ? `${a.join(", ")} offen` : ""].filter(Boolean).join(" · ");
		c.push(V("airing", "Lüften läuft", o, O.wind, B.blue, "airing"));
	} else {
		let r = n.filter((t) => F(e, t.airing) === "Jetzt lüften");
		if (r.length) {
			let n = r.map((t) => {
				let n = P(e, t.humidity);
				return n === null ? t.name : `${t.name} ${I(Math.round(n))} %`;
			}), i = P(e, N(t, "airing_duration"));
			i !== null && n.push(`${I(Math.round(i))} min`), c.push(V("airing", "Jetzt lüften", n.join(" · "), O.wind, B.blue, "airing", {
				kind: "service",
				label: "Start",
				domain: gt(N(t, "airing_start"))[0],
				service: gt(N(t, "airing_start"))[1],
				data: {}
			}));
		}
	}
	let p = N(t, "window_snooze");
	for (let t of n) {
		if (!t.window || t.window === u) continue;
		let n = a(t);
		if (n.kind !== "overdue" && n.kind !== "stuck") continue;
		let i = l[p] ? {
			kind: "service",
			label: "1 h ignorieren",
			domain: "input_text",
			service: "set_value",
			target: { entity_id: p },
			data: { value: vn(l[p].state, t.window, r.getTime() + 36e5, r.getTime()) }
		} : void 0;
		if (n.kind === "overdue") c.push(V(`window:${t.slug}`, "Fenster schließen", `${t.name} · ${z(n.openMin)} · ${n.reason}`, O.window, B.red, { room: t.slug }, i));
		else {
			let n = F(e, t.window) === "unavailable" ? "Sensor nicht erreichbar" : "meldet offen, Raum bleibt gleich";
			c.push(V(`sensor:${t.slug}`, "Fenstersensor prüfen", `${t.name} · ${n}`, O.window, B.grey, { room: t.slug }, i));
		}
	}
	c.push(...En(e, t, n, r, o));
	for (let t of Object.keys(l).filter((e) => /^input_boolean\..+_fertig$/.test(e))) {
		if (l[t].state !== "on") continue;
		let n = R(e, t).replace(/\s*fertig$/i, "");
		c.push(V(t, `${n} fertig`, "Bitte ausräumen", O.washer, B.green, null, {
			kind: "service",
			label: "OK",
			domain: "input_boolean",
			service: "turn_off",
			data: {},
			target: { entity_id: t }
		}));
	}
	for (let n of un(e, t)) {
		let t = dn(e, n, r, s[n.power]);
		if (!t.running) continue;
		let i = `${I(t.power)} W`, a = t.since === void 0 ? i : `seit ${new Date(t.since).toLocaleTimeString("de-DE", {
			hour: "2-digit",
			minute: "2-digit"
		})} · ${i}`;
		c.push({
			...V(`appliance:${n.slug}`, `${n.name} läuft`, a, O.washer, B.blue, { moreInfo: n.power }),
			appliance: n.kind
		});
	}
	let m = N(t, "vacuum"), h = F(e, m), g = F(e, N(t, "vacuum_status"));
	if (h === "error" || g === "error") {
		let e = l[m]?.attributes.error ?? l[m]?.attributes.status ?? "Bitte prüfen";
		c.push(V("robby-error", "Robby: Fehler", String(e), O.vacuum, B.red, "robby"));
	}
	let _ = Gn(e, m);
	_.length && c.push(V("robby-due", "Robby: Wartung fällig", `${Wn(_)} reinigen`, O.vacuum, B.orange, "robby"));
	let v = qn(e, t, r);
	v && c.push(v);
	let y = Jn(e, t);
	y.length && c.push(V("filter", "Filter prüfen", y.join(" · "), O.filter, B.yellow, "care"));
	let b = Yn(e);
	return b.length && c.push(V("battery", b.length === 1 ? "Batterie schwach" : `${b.length} Batterien schwach`, b.map((e) => `${e.name} ${I(e.level)} %`).join(" · "), O.battery, B.orange, "care")), c;
}
function Wn(e) {
	return e.length <= 1 ? e.join("") : `${e.slice(0, -1).join(", ")} & ${e[e.length - 1]}`;
}
function Gn(e, t) {
	let n = t.split(".")[1], r = [
		[/filter/, "Filter"],
		[/sensor/, "Sensoren"],
		[/haupt/, "Hauptbürste"],
		[/seiten/, "Seitenbürste"]
	], i = [];
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.includes(n) || !t.endsWith("_minutes")) continue;
		let a = P(e, t);
		if (a === null || a > 0) continue;
		let o = t.slice(7).replace(/^sensor_/, ""), s = r.find(([e]) => e.test(o))?.[1] ?? R(e, t);
		i.includes(s) || i.push(s);
	}
	let a = [
		"Filter",
		"Sensoren",
		"Hauptbürste",
		"Seitenbürste"
	];
	return [...a.filter((e) => i.includes(e)), ...i.filter((e) => !a.includes(e))];
}
function Kn(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function qn(e, t, n) {
	let r = N(t, "waste"), i = e.states[r];
	if (!i) return null;
	let a = Number(i.attributes.daysTo);
	if (!Number.isFinite(a) || a < 0 || a > 1) return null;
	let o = new Date(n);
	o.setDate(o.getDate() + a);
	let s = i.attributes[Kn(o)];
	return V("waste", a === 0 ? "Müll heute" : "Müll morgen", typeof s == "string" ? s : "Abfuhr", O.trash, B.green, { moreInfo: r });
}
function Jn(e, t) {
	let n = [];
	for (let r of ht(t)) F(e, r) === "on" && n.push(_t(e, r) ?? R(e, r));
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.endsWith("filter_life")) continue;
		let r = P(e, t);
		r !== null && r < An && n.push(`${_t(e, t) ?? R(e, t)} ${I(r)} %`);
	}
	return n;
}
function Yn(e) {
	let t = [];
	for (let [n, r] of Object.entries(e.states)) {
		if (!n.startsWith("sensor.") || r.attributes.device_class !== "battery" || /robby|phone|iphone|handy|pixel|ipad|watch|_plus$/.test(n)) continue;
		let i = P(e, n);
		if (i === null || i >= kn) continue;
		let a = _t(e, n) ?? R(e, n).replace(/\s*(Batterie|Battery)$/i, "");
		t.push({
			id: n,
			name: a,
			level: i
		});
	}
	return t.sort((e, t) => e.level - t.level);
}
function Xn(e) {
	return e === null ? null : e <= 12 ? "#30d158" : e <= 35 ? "#ffd60a" : "#ff453a";
}
function Zn(e, t, n = (t) => mn(e, t, {}, /* @__PURE__ */ new Date())) {
	return t.map((t) => {
		let r = P(e, t.temperature) ?? (t.climate ? Number(e.states[t.climate]?.attributes.current_temperature) : NaN), i = P(e, t.humidity), a = !!t.climate && e.states[t.climate]?.attributes.hvac_action === "heating", o = F(e, t.airing) === "Jetzt lüften", s = n(t);
		return {
			room: t,
			icon: Ve(t.name, t.icon),
			temp: r !== null && Number.isFinite(r) ? I(r, 1) : "–",
			hum: i === null ? "–" : I(Math.round(i)),
			heating: a,
			vent: o,
			note: a && s.kind === "none" ? "heizt" : "",
			recommend: s.kind === "recommend",
			win: s,
			aq: t.pm25 ? Xn(P(e, t.pm25)) : null
		};
	});
}
var Qn = /* @__PURE__ */ new Set([
	"alarm",
	"door",
	"warn",
	"heat",
	"window",
	"sensor",
	"health",
	"health-many",
	"print",
	"print-done",
	"print-error",
	"services",
	"pihole",
	"backup"
]);
function $n(e) {
	let t = e.filter((e) => e.action || Qn.has(e.id.split(":")[0])), n = e.filter((e) => !t.includes(e));
	return [...t.map((e) => ({
		item: e,
		wide: !0
	})), ...n.map((e, t) => ({
		item: e,
		wide: n.length % 2 == 1 && t === n.length - 1
	}))];
}
// src/logic/climate.ts
var er = [
	{
		id: "eco",
		name: "Eco",
		color: "#30d158"
	},
	{
		id: "comfort",
		name: "Komfort",
		color: "#ff9f0a"
	},
	{
		id: "boost",
		name: "Boost",
		color: "#ff6b5e"
	},
	{
		id: "frost",
		name: "Frost",
		color: "#64d2ff"
	}
];
function tr(e) {
	let t = {};
	if (typeof e == "string") try {
		t = JSON.parse(e);
	} catch {
		t = {};
	}
	else e && typeof e == "object" && (t = e);
	let n = {};
	for (let e of er) {
		let r = Number(t[`${e.id}_temp`]);
		Number.isFinite(r) && r > 0 && (n[e.id] = r);
	}
	return n;
}
function nr(e, t, n) {
	let r = t.climate ? e.states[t.climate] : void 0, i = r?.attributes ?? {}, a = P(e, t.temperature) ?? (Number.isFinite(Number(i.current_temperature)) ? Number(i.current_temperature) : null), o = P(e, t.humidity) ?? (Number.isFinite(Number(i.current_humidity)) ? Number(i.current_humidity) : null), s = o === null ? null : Math.round(o), c = n ?? (Number.isFinite(Number(i.temperature)) ? Number(i.temperature) : null), l = !r || r.state === "off" || r.state === "unavailable", u = !l && i.hvac_action === "heating", d = !!t.window && F(e, t.window) === "on", f = F(e, t.airing), p = f === "Jetzt lüften", m = p || d, h = t.pm25 ? P(e, t.pm25) : null, g = Number.isFinite(Number(i.valve_open_percent)) ? Math.round(Number(i.valve_open_percent)) : null;
	return {
		cur: a,
		target: c,
		hum: s,
		dew: P(e, `sensor.${t.slug}_taupunkt`),
		heating: u,
		vent: m,
		recommend: p,
		off: l,
		valve: g,
		preset: typeof i.preset_mode == "string" && i.preset_mode !== "none" ? i.preset_mode : null,
		presetTemps: tr(i.preset_temperatures),
		min: Number(i.min_temp) || 7,
		max: Number(i.max_temp) || 30,
		step: Number(i.target_temp_step) || .5,
		pm25: h,
		aq: t.pm25 ? Xn(h) : null,
		fanOn: !!t.purifier && F(e, t.purifier) === "on",
		windowOpen: d,
		airing: f,
		label: l ? "Aus" : d ? "lüftet" : u ? "heizt" : "Soll erreicht"
	};
}
function rr(e, t, n, r, i = .5) {
	let a = Math.round((e + t) / i) * i;
	return Math.min(r, Math.max(n, Math.round(a * 10) / 10));
}
function H(e, t = 1) {
	return e === null ? "–" : I(e, t);
}
var ir = {
	OG: "Obergeschoss",
	EG: "Erdgeschoss",
	UG: "Untergeschoss",
	DG: "Dachgeschoss",
	KG: "Keller"
};
function ar(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.floor ?? "";
		n.has(t) || n.set(t, []), n.get(t).push(e);
	}
	let r = (t) => e.floors?.[t]?.level ?? -99;
	return [...n.entries()].sort(([e], [t]) => r(t) - r(e)).map(([t, n]) => {
		let r = e.floors?.[t]?.name ?? (t ? t.toUpperCase() : "Weitere");
		return {
			id: t,
			short: r,
			name: ir[r] ?? r,
			rooms: n
		};
	});
}
function or(e, t) {
	let n = L(e, t);
	return n ? e.areas[n]?.floor_id ?? void 0 : void 0;
}
function sr(e) {
	let t = e.filter((e) => e !== null);
	return t.length ? t.reduce((e, t) => e + t, 0) / t.length : null;
}
function cr(e, t) {
	let n = t.map((t) => nr(e, t)), r = n.filter((e) => e.heating).length, i = n.map((e) => e.pm25).filter((e) => e !== null), a = i.length ? Math.max(...i) : null, o = a === null ? "" : a <= 12 ? "Luft überall gut" : a <= 35 ? "Luft teils mäßig" : "Luft schlecht", s = r ? `${r} von ${t.length} Räumen heizen` : "Kein Raum heizt";
	return o ? `${s} · ${o}` : s;
}
function lr(e, t, n) {
	let r = N(n, "weather"), i = P(e, N(n, "outdoor_temp")) ?? (Number(e.states[r]?.attributes.temperature) || null), a = e.states[r]?.attributes.humidity, o = Number.isFinite(Number(a)) ? Number(a) : null, s = P(e, N(n, "outdoor_dew")), c = sr(t.map((t) => P(e, `sensor.${t.slug}_taupunkt`))), l = "";
	return s !== null && c !== null && (l = s < c - 1 ? "draußen trockener" : s > c + 1 ? "draußen feuchter" : "ähnlich feucht"), {
		title: [i === null ? "Außen" : `Außen ${I(i, 1)}°`, o === null ? "" : `${I(Math.round(o))} %`].filter(Boolean).join(" · "),
		sub: [s === null ? "" : `Taupunkt ${I(s, 1)}°`, l].filter(Boolean).join(" · "),
		minutes: P(e, N(n, "airing_duration"))
	};
}
function ur(e) {
	if (typeof e != "string") return 0;
	let t = e.split(":").map(Number);
	return t.some((e) => !Number.isFinite(e)) ? 0 : t.reduce((e, t) => e * 60 + t, 0);
}
function dr(e, t, n, r) {
	let i = e.states[N(n, "airing_timer")], a = P(e, N(n, "airing_duration")), o = ur(i?.attributes.duration) || (a ?? 15) * 60, s = a === null ? o : a * 60, c = i?.state === "active", l = i?.state === "paused";
	return c && i?.attributes.finishes_at ? s = Math.max(0, Math.round((new Date(i.attributes.finishes_at).getTime() - r.getTime()) / 1e3)) : l && (s = ur(i?.attributes.remaining)), {
		active: c,
		paused: l,
		remaining: s,
		duration: c || l ? o : s,
		openWindows: t.filter((t) => t.window && F(e, t.window) === "on"),
		recommended: t.filter((t) => F(e, t.airing) === "Jetzt lüften")
	};
}
function U(e) {
	let t = Math.floor(e / 60), n = e % 60;
	return `${t}:${String(n).padStart(2, "0")}`;
}
function fr(e, t) {
	let n = e.filter((e) => t.has(e.slug));
	return n.length === e.length ? "" : n.map((e) => e.climate?.replace(/^climate\.vtherm_/, "")).filter((e) => !!e && !e.includes(".")).join(",");
}
function pr(e, t, n, r) {
	let i = Math.ceil((n - t) / r), a = Array(i).fill(0), o = Array(i).fill(0);
	for (let n of e) {
		let e = Math.floor((n.t - t) / r);
		e < 0 || e >= i || (a[e] += n.v, o[e]++);
	}
	let s = [], c = null;
	for (let e = 0; e < i; e++) o[e] && (c = a[e] / o[e]), c !== null && s.push({
		t: t + e * r,
		v: c
	});
	return s;
}
function mr(e, t, n, r, i, a, o) {
	let s = e.map((e) => e.v), c = s.length ? Math.min(...s) : 0, l = s.length ? Math.max(...s) : 1, u = Math.floor((c - i) / o) * o, d = Math.ceil((l + a) / o) * o;
	d - u < o * 2 && (d = u + o * 2);
	let f = (e) => Math.round((r - (e - u) / (d - u) * (r - n)) * 10) / 10, p = e.map((n, r) => [Math.round(r / Math.max(1, e.length - 1) * t * 10) / 10, f(n.v)]), m = p.map((e) => `${e[0]},${e[1]}`).join(" "), h = p.length ? `${m} ${p[p.length - 1][0]},${r} 0,${r}` : "", g = p[p.length - 1];
	return {
		line: m,
		area: h,
		last: g ? {
			x: g[0],
			y: g[1]
		} : null,
		lo: u,
		hi: d,
		y: f
	};
}
function hr(e, t) {
	let n = null;
	for (let t = 0; t < e.length; t++) for (let r = t + 1; r <= Math.min(t + 3, e.length - 1); r++) {
		let i = e[t].v - e[r].v;
		i >= 4 && (!n || i > n.drop) && (n = {
			i: t,
			j: r,
			drop: i
		});
	}
	if (!n) return null;
	let r = new Date(e[n.i].t).getHours(), i = r < 11 ? "Vormittags" : r < 14 ? "Mittags" : r < 18 ? "Nachmittags" : r < 23 ? "Abends" : "Nachts", a = Math.round(e[n.i].v), o = Math.round(e[n.j].v), s = t.find((t) => t.t === e[n.i].t)?.v, c = t.filter((t) => t.t >= e[n.i].t && t.t <= e[n.j].t + 36e5).map((e) => e.v), l = c.length ? Math.min(...c) : null;
	return `${i} gelüftet: Feuchte ${a} → ${o} %${s !== void 0 && l !== null && s - l >= .5 ? `, Raum kurz auf ${I(l, 1)}° abgekühlt` : ""}.`;
}
function gr(e, t, n, r, i, a, o = {}) {
	let s = o.snap ?? 1, c = [...e.map((e) => e.v), ...o.extra ?? []], l = o.zero ? 0 : c.length ? Math.min(...c) : 0, u = c.length ? Math.max(...c) : 1, d = o.zero ? 0 : Math.floor((l - (o.padLo ?? 0)) / s) * s, f = Math.ceil((u + (o.padHi ?? 0)) / s) * s;
	f - d < s * 2 && (f = d + s * 2), o.max !== void 0 && (f = o.max);
	let p = (e) => Math.round(e * 10) / 10, m = (e) => p((e - t) / Math.max(1, n - t) * r), h = (e) => p(a - (e - d) / (f - d) * (a - i)), g = e.map((e) => [m(e.t), h(e.v)]), _ = g.map((e) => `${e[0]},${e[1]}`).join(" "), v = g.length ? `${_} ${g[g.length - 1][0]},${a} ${g[0][0]},${a}` : "", y = g[g.length - 1];
	return {
		line: _,
		area: v,
		last: y ? {
			x: y[0],
			y: y[1]
		} : null,
		lo: d,
		hi: f,
		x: m,
		y: h
	};
}
var _r = {
	"Jetzt lüften": "now",
	"Lüften möglich": "possible"
};
function vr(e, t, n) {
	let r = [...e].sort((e, t) => e.lu - t.lu), i = [];
	return r.forEach((e, a) => {
		let o = _r[e.s];
		if (!o) return;
		let s = Math.max(t, Math.round(e.lu * 1e3)), c = Math.min(n, a + 1 < r.length ? Math.round(r[a + 1].lu * 1e3) : n);
		if (c <= s) return;
		let l = i[i.length - 1];
		l && l.level === o && l.to === s ? l.to = c : i.push({
			from: s,
			to: c,
			level: o
		});
	}), i;
}
// src/logic/rooms.ts
var yr = /^sensor\.(.+)_luftung$/;
function br(e, t) {
	return (t.rooms?.length ? t.rooms : xr(e)).map((t) => Cr(e, t));
}
function xr(e) {
	return Object.keys(e.states).map((e) => yr.exec(e)?.[1]).filter((e) => !!e && !e.startsWith("aussen")).map((e) => ({ slug: e }));
}
function Sr(e, t, n, r) {
	if (n.length) return Object.keys(e.states).find((i) => i.startsWith(t + ".") && n.includes(L(e, i) ?? "") && r(i));
}
function Cr(e, t) {
	let n = e.states, r = t.areas?.length ? t.areas : e.areas[t.slug] ? [t.slug] : (() => {
		let n = L(e, `sensor.${t.slug}_temperature`);
		return n ? [n] : [];
	})(), i = (e) => n[e]?.attributes.device_class, a = t.climate ?? (n[`climate.vtherm_${t.slug}`] ? `climate.vtherm_${t.slug}` : void 0) ?? Sr(e, "climate", r, () => !0), o = r[0] ? e.areas[r[0]] : void 0, s = t.name ?? o?.name ?? String(n[`sensor.${t.slug}_luftung`]?.attributes.friendly_name ?? t.slug).replace(/\s*Lüftung$/i, "");
	return {
		...t,
		name: s,
		areas: r,
		climate: a,
		floor: t.floor ?? o?.floor_id ?? void 0,
		pm25: t.pm25 ?? Sr(e, "sensor", r, (e) => i(e) === "pm25"),
		purifier: t.purifier ?? Sr(e, "fan", r, () => !0),
		window: t.window ?? Sr(e, "binary_sensor", r, (e) => ["window", "opening"].includes(i(e))),
		temperature: `sensor.${t.slug}_temperature`,
		humidity: `sensor.${t.slug}_humidity`,
		airing: `sensor.${t.slug}_luftung`
	};
}
// src/styles.ts
var wr = o`
  :host {
    --sd-bg: #101218;
    --sd-sheet: #181a22;
    --sd-text: #ffffff;
    --sd-muted: rgba(255, 255, 255, 0.72);
    --sd-fill: rgba(255, 255, 255, 0.07);
    --sd-fill-2: rgba(255, 255, 255, 0.12);
    --sd-rule: rgba(255, 255, 255, 0.12);
    --sd-green: #30d158;
    --sd-yellow: #ffd60a;
    --sd-red: #ff453a;
    --sd-orange: #ff9f0a;
    --sd-blue: #5ac8fa;
    --sd-purple: #bf9bff;
    display: block;
    font-family: Rubik, system-ui, -apple-system, sans-serif;
    color: var(--sd-text);
    -webkit-tap-highlight-color: transparent;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  button {
    font-family: inherit;
    color: inherit;
    cursor: pointer;
    border: none;
    padding: 0;
    background: none;
    text-align: inherit;
    -webkit-user-select: none;
    user-select: none;
  }
  button:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 2px;
  }
  h1,
  h2 {
    margin: 0;
  }
  svg {
    display: block;
    flex-shrink: 0;
  }
  .circle {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  .section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .section-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 4px 6px 2px;
  }
  .section-head h2 {
    font-size: 15px;
    font-weight: 600;
  }
  .section-head .rule {
    flex: 1;
    height: 2px;
    border-radius: 1px;
    background: var(--sd-rule);
  }
  .section-head .meta {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 12px;
    color: var(--sd-muted);
  }
  .dot {
    flex-shrink: 0;
    width: 7px;
    height: 7px;
    border-radius: 4px;
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .grow {
    flex: 1;
    min-width: 0;
  }
  /* State-driven device motion (components/motion.ts). Only the moving part carries the class. */
  .spin,
  .tumble,
  .spray,
  .bob,
  .wobble,
  .breathe,
  .rain,
  .snow,
  .drift,
  .rays,
  .flash {
    transform-box: fill-box;
    transform-origin: center;
  }
  .spin {
    animation: spin 1.4s linear infinite;
  }
  .spin.s1 {
    animation-duration: 2.4s;
  }
  .spin.s2 {
    animation-duration: 1.4s;
  }
  .spin.s3 {
    animation-duration: 0.8s;
  }
  .tumble {
    animation: spin 1.2s linear infinite;
  }
  .spray {
    animation: spray 1.1s ease-in-out infinite;
  }
  .bob {
    animation: bob 1.6s ease-in-out infinite;
  }
  .wobble {
    animation: wobble 1.2s ease-in-out infinite;
  }
  .breathe {
    animation: breathe 3s ease-in-out infinite;
  }
  .rain {
    animation: fall 2s ease-in infinite;
  }
  .rain.late {
    animation-delay: -1s;
  }
  .snow {
    animation: fall 3.6s linear infinite;
  }
  .snow.late {
    animation-delay: -1.8s;
  }
  .drift {
    animation: drift 6s ease-in-out infinite;
  }
  .rays {
    animation: spin 20s linear infinite;
  }
  .flash {
    animation: flash 6s linear infinite;
  }
  @keyframes fall {
    0% {
      opacity: 0;
      transform: translateY(-4px);
    }
    25%,
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(4px);
    }
  }
  @keyframes drift {
    50% {
      transform: translateX(1.5px);
    }
  }
  @keyframes flash {
    0%,
    88%,
    100% {
      opacity: 0.3;
    }
    90%,
    94% {
      opacity: 1;
    }
    92% {
      opacity: 0.4;
    }
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes spray {
    50% {
      opacity: 0.25;
      transform: translateY(1.5px);
    }
  }
  @keyframes bob {
    50% {
      transform: translateY(1.5px);
    }
  }
  @keyframes wobble {
    25% {
      transform: rotate(-9deg);
    }
    75% {
      transform: rotate(9deg);
    }
  }
  @keyframes breathe {
    50% {
      box-shadow: 0 0 14px 3px rgba(255, 159, 10, 0.55);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .spin,
    .tumble,
    .spray,
    .bob,
    .wobble,
    .breathe,
    .rain,
    .snow,
    .drift,
    .rays,
    .flash {
      animation: none;
    }
  }
`, Tr = "hsd-dismissed", Er = 1728e5;
function Dr(e = Date.now()) {
	try {
		let t = JSON.parse(localStorage.getItem(Tr) ?? "{}");
		return Object.fromEntries(Object.entries(t).filter(([, t]) => typeof t == "number" && e - t < Er));
	} catch {
		return {};
	}
}
function Or(e) {
	try {
		localStorage.setItem(Tr, JSON.stringify(e));
	} catch {}
}
// src/logic/click-guard.ts
function kr(e, t = 400) {
	let n = !1, r, i = () => {
		n = !1, clearTimeout(r);
	};
	return e.addEventListener("click", (e) => {
		n && (e.preventDefault(), e.stopImmediatePropagation(), i());
	}, !0), {
		arm() {
			clearTimeout(r), n = !0;
		},
		release() {
			n && (clearTimeout(r), r = setTimeout(i, t));
		}
	};
}
// src/components/hold.ts
var Ar = 500, jr = 10, Mr = /* @__PURE__ */ new WeakMap(), Nr;
function Pr() {
	Nr ??= kr(window), Nr.arm();
	let e = () => {
		window.removeEventListener("pointerup", e, !0), window.removeEventListener("pointercancel", e, !0), Nr.release();
	};
	window.addEventListener("pointerup", e, !0), window.addEventListener("pointercancel", e, !0);
}
function Fr(e, t = "medium") {
	e.dispatchEvent(new CustomEvent("haptic", {
		detail: t,
		bubbles: !0,
		composed: !0
	}));
}
function Ir(e) {
	let t = () => Mr.get(e), n = () => {
		window.clearTimeout(t().timer), t().timer = void 0;
	};
	e.addEventListener("pointerdown", (n) => {
		let r = t();
		r.held = !1, !(!r.opts.hold || n.button > 0) && (r.x = n.clientX, r.y = n.clientY, r.timer = window.setTimeout(() => {
			r.held = !0, r.timer = void 0, Pr(), Fr(e), r.opts.hold?.();
		}, Ar));
	}), e.addEventListener("pointermove", (e) => {
		let r = t();
		r.timer && Math.hypot(e.clientX - r.x, e.clientY - r.y) > jr && n();
	}), e.addEventListener("pointerup", n), e.addEventListener("pointercancel", n), e.addEventListener("pointerleave", n), e.addEventListener("contextmenu", (e) => {
		t().opts.hold && e.preventDefault();
	}), e.addEventListener("click", (n) => {
		let r = t();
		r.held ? (r.held = !1, n.preventDefault(), n.stopPropagation()) : r.opts.tap && (Fr(e, "light"), r.opts.tap());
	});
}
var Lr = Ke(class extends qe {
	constructor(e) {
		if (super(e), e.type !== Ge.ELEMENT) throw Error("hold() must be used as an element directive");
	}
	render(e) {
		return T;
	}
	update(e, [t]) {
		let n = e.element, r = Mr.get(n);
		return r ? r.opts = t : (Mr.set(n, {
			opts: t,
			held: !1,
			x: 0,
			y: 0
		}), Ir(n)), T;
	}
}), { I: Rr } = Fe, zr = (e) => e, Br = () => document.createComment(""), Vr = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new Rr(r.insertBefore(Br(), i), r.insertBefore(Br(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = zr(e).nextSibling;
				zr(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, W = (e, t, n = e) => (e._$AI(t, n), e), Hr = {}, Ur = (e, t = Hr) => e._$AH = t, Wr = (e) => e._$AH, Gr = (e) => {
	e._$AR(), e._$AA.remove();
}, Kr = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, qr = Ke(class extends qe {
	constructor(e) {
		if (super(e), e.type !== Ge.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, t, n) {
		let r;
		n === void 0 ? n = t : t !== void 0 && (r = t);
		let i = [], a = [], o = 0;
		for (let t of e) i[o] = r ? r(t, o) : o, a[o] = n(t, o), o++;
		return {
			values: a,
			keys: i
		};
	}
	render(e, t, n) {
		return this.dt(e, t, n).values;
	}
	update(e, [t, n, r]) {
		let i = Wr(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = W(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = W(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = W(i[d], a[m]), Vr(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = W(i[f], a[p]), Vr(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Kr(o, p, m), u = Kr(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = Vr(e, i[d]);
					W(t, a[p]), c[p] = t;
				} else c[p] = W(n, a[p]), Vr(e, i[d], n), i[t] = null;
				p++;
			} else Gr(i[f]), f--;
		} else Gr(i[d]), d++;
		for (; p <= m;) {
			let t = Vr(e, c[m + 1]);
			W(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && Gr(e);
		}
		return this.ut = o, Ur(e, c), T;
	}
});
// src/logic/sheet-stack.ts
function Jr(e) {
	switch (e.id) {
		case "weatherMetric":
		case "weatherDay": return { id: "weather" };
		case "history":
		case "dew": return {
			id: "room",
			slug: e.slug
		};
		case "device":
		case "energyChart": return e.back ?? null;
		default: return null;
	}
}
function Yr(e) {
	switch (e.id) {
		case "room":
		case "history":
		case "dew": return `${e.id}:${e.slug}`;
		case "weatherMetric": return `${e.id}:${e.metric}`;
		case "weatherDay": return `${e.id}:${e.date}`;
		case "energyChart": return `${e.id}:${e.key}`;
		case "device": return `${e.id}:${e.entity}`;
		default: return e.id;
	}
}
// src/header.ts
var Xr = "ha-start-dashboard-header";
function Zr(e) {
	return e === "hide" ? "\n      .header { display: none !important; }\n      #view { padding-top: 0 !important; min-height: 100vh !important; }" : e === "blend" ? "\n      .header { background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: none !important; border: none !important; }\n      #view { padding-top: 0 !important; }" : "";
}
function Qr(e) {
	let t = e;
	for (; t;) {
		if (t instanceof HTMLElement && t.tagName === "HUI-ROOT") return t;
		t = t.parentNode ?? (t instanceof ShadowRoot ? t.host : null);
	}
	return null;
}
function $r(e, t) {
	let n = Qr(e), r = n?.shadowRoot;
	if (!n || !r) return !1;
	let i = n.lovelace?.editMode ? "" : Zr(t), a = r.getElementById(Xr);
	return i ? (a || (a = document.createElement("style"), a.id = Xr, r.appendChild(a)), a.textContent !== i && (a.textContent = i), !0) : (a?.remove(), !1);
}
function ei(e) {
	Qr(e)?.shadowRoot?.getElementById(Xr)?.remove();
}
function ti(e) {
	return e.toLowerCase().split(/[\s&,.\-_]+/).filter((e) => e.length > 1);
}
function ni(e, t, n, r) {
	if (r?.[t]) return r[t];
	let i = R(e, t);
	if (!n) return i;
	let a = /* @__PURE__ */ new Set([
		...ti(n.name),
		...n.areas.flatMap((t) => ti(e.areas[t]?.name ?? t)),
		...ti(n.slug)
	]);
	return i.split(/\s+/).filter((e) => !a.has(e.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""))).join(" ").replace(/^[\s\-–·]+|[\s\-–·]+$/g, "") || i;
}
function ri(e, t, n) {
	let r = e.entities[t];
	return r?.labels?.includes(n) ? !0 : !!(r?.device_id ? e.devices[r.device_id] : void 0)?.labels?.includes(n);
}
function ii(e, t) {
	let n = e.states[t]?.attributes ?? {};
	return t.startsWith("light.") ? di(n).brightness ? "light" : "switch" : t.startsWith("fan.") ? Array.isArray(n.preset_modes) && n.preset_modes.length ? "purifier" : "switch" : t.startsWith("humidifier.") ? "dehumidifier" : "switch";
}
var ai = /* @__PURE__ */ new WeakMap();
function oi(e) {
	let t = ai.get(e.entities);
	if (t) return t;
	let n = /* @__PURE__ */ new Map();
	for (let t of Object.values(e.entities)) t.device_id && t.entity_id.startsWith("sensor.") && /_power$/.test(t.entity_id) && (n.has(t.device_id) || n.set(t.device_id, []), n.get(t.device_id).push(t.entity_id));
	return ai.set(e.entities, n), n;
}
function si(e, t) {
	let n = e.states[t]?.state;
	if (n === void 0 || n === "" || n === "unknown" || n === "unavailable") return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function ci(e, t) {
	let n = e.entities[t]?.device_id, r = n ? (oi(e).get(n) ?? []).filter((t) => e.states[t]) : [];
	if (!r.length) {
		let n = `sensor.${t.split(".")[1]}_power`;
		e.states[n] && (r = [n]);
	}
	if (!r.length) return null;
	let i = r.filter((e) => !/_device_power$/.test(e)), a = i.find((t) => si(e, t) !== null) ?? i[0] ?? r[0];
	return {
		id: a,
		value: si(e, a)
	};
}
function G(e) {
	return `${I(e, e > 0 && e < 10 && e % 1 ? 1 : 0)} W`;
}
function li(e, t, n) {
	let r = e.states[t];
	if (!r || r.state === "unavailable" || r.state === "unknown") return "n. v.";
	if (r.state !== "on") return "Aus";
	let i = Number(r.attributes.brightness);
	return t.startsWith("light.") && r.attributes.brightness != null && Number.isFinite(i) ? `${Math.max(1, Math.round(i / 255 * 100))} %` : !t.startsWith("light.") && n?.value != null && n.value >= 1 ? G(n.value) : "An";
}
var ui = [
	"hs",
	"xy",
	"rgb",
	"rgbw",
	"rgbww"
];
function di(e) {
	let t = Array.isArray(e.supported_color_modes) ? e.supported_color_modes : [], n = t.includes("color_temp");
	return {
		brightness: t.some((e) => e !== "onoff"),
		colorTemp: n ? {
			min: Number(e.min_color_temp_kelvin) || 2e3,
			max: Number(e.max_color_temp_kelvin) || 6500
		} : null,
		color: t.some((e) => ui.includes(e)),
		effects: Array.isArray(e.effect_list) ? e.effect_list : []
	};
}
function fi(e) {
	if (ui.includes(e.color_mode)) return "farbig";
	if (e.color_mode !== "color_temp") return;
	let t = Number(e.color_temp_kelvin);
	if (Number.isFinite(t)) return t < 3300 ? "warmweiß" : t < 5e3 ? "neutralweiß" : "kaltweiß";
}
function pi(e) {
	if (!e.brightness) return [];
	let t = (t) => e.colorTemp ? { color_temp_kelvin: Math.min(e.colorTemp.max, Math.max(e.colorTemp.min, t)) } : {}, n = [{
		name: "Lesen",
		data: {
			brightness_pct: 100,
			...t(4e3)
		}
	}, {
		name: "Gemütlich",
		data: {
			brightness_pct: 40,
			...t(2700)
		}
	}];
	return e.effects.includes("colorloop") && n.push({
		name: "Farbschleife",
		data: { effect: "colorloop" }
	}), n;
}
function mi(e, t) {
	let n = Number(t.percentage_step) || 100 / 3, r = Math.max(1, Math.round(100 / n));
	if (e !== "on") return {
		mode: "off",
		level: null,
		levels: r
	};
	if (t.preset_mode === "auto" || t.preset_mode === "sleep") return {
		mode: t.preset_mode,
		level: null,
		levels: r
	};
	let i = Number(t.percentage);
	return {
		mode: "manual",
		level: Number.isFinite(i) && i > 0 ? Math.max(1, Math.round(i / n)) : null,
		levels: r
	};
}
var hi = {
	manual: "Manuell",
	continuous: "Dauer",
	auto: "Auto",
	clothes_dry: "Wäsche",
	shoes_dry: "Schuhe"
};
function gi(e, t) {
	let n = e.states[t];
	if (!n || n.state === "unavailable" || n.state === "unknown") return "Nicht erreichbar";
	if (n.state !== "on") return "Aus";
	let r = n.attributes;
	return t.startsWith("light.") && Number.isFinite(Number(r.brightness)) ? `An · ${Math.round(Number(r.brightness) / 255 * 100)} %` : t.startsWith("fan.") && r.preset_mode ? `An · ${String(r.preset_mode).toLowerCase()}` : t.startsWith("humidifier.") && Number.isFinite(Number(r.humidity)) ? `An · ${r.humidity} %` : "An";
}
function _i(e, t, n) {
	let r = Object.keys(e.states).filter((n) => ri(e, n, "dashboard_gerat") && t.areas.includes(L(e, n) ?? ""));
	return t.purifier && e.states[t.purifier] && !r.includes(t.purifier) && r.unshift(t.purifier), r.map((r) => {
		let i = r.split(".")[0], a = e.states[r]?.state, o = ci(e, r);
		return {
			tileState: li(e, r, o),
			power: o,
			sheet: ii(e, r),
			id: r,
			name: ni(e, r, t, n),
			on: a === "on",
			unavailable: !a || a === "unavailable" || a === "unknown",
			status: gi(e, r),
			kind: [
				"light",
				"fan",
				"humidifier",
				"switch"
			].includes(i) ? i : "other"
		};
	});
}
function vi(e, t) {
	return Object.keys(e.states).filter((n) => n.startsWith("scene.") && t.areas.includes(L(e, n) ?? "")).map((n) => {
		let r = /_off$|_aus$/.test(n);
		return {
			id: n,
			name: r ? "Alles aus" : ni(e, n, t),
			icon: e.states[n].attributes.icon,
			off: r
		};
	}).sort((e, t) => Number(e.off) - Number(t.off));
}
var yi = 13;
function bi(e, t, n, r) {
	let i = /* @__PURE__ */ new Set(), a = (t) => Date.parse(e.states[t]?.state ?? "");
	for (let r of t) {
		let t = n[r];
		if (!t) continue;
		let a = Object.entries(t).filter(([t]) => e.states[t]);
		a.length > 0 && a.every(([t, n]) => {
			let r = e.states[t];
			if (n.state && r.state !== n.state) return !1;
			let i = Number(r.attributes.brightness);
			return n.state === "on" && n.brightness !== void 0 && Number.isFinite(i) ? Math.abs(i - n.brightness) <= yi : !0;
		}) && i.add(r);
	}
	let o = t.filter((e) => Number.isFinite(a(e)) && a(e) <= r.getTime()).sort((e, t) => a(t) - a(e))[0];
	if (o && !n[o]) {
		let t = e.states[o].attributes.entity_id ?? [], n = a(o) + 1e4;
		t.length && t.every((t) => !e.states[t] || Date.parse(e.states[t].last_changed) <= n) && i.add(o);
	}
	return i;
}
var xi = (e) => Math.round(Math.min(255, Math.max(0, e)));
function Si(e) {
	let t = e / 100, n = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -.1332047592, r = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * (t - 60) ** -.0755148492, i = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
	return [
		xi(n),
		xi(r),
		xi(i)
	];
}
function Ci(e, t) {
	let n = (n) => {
		let r = (n + e / 60) % 6;
		return 255 * (1 - t / 100 * Math.max(0, Math.min(r, 4 - r, 1)));
	};
	return [
		xi(n(5)),
		xi(n(3)),
		xi(n(1))
	];
}
function wi(e) {
	if (ui.includes(e.color_mode)) return Array.isArray(e.rgb_color) && e.rgb_color.length === 3 ? e.rgb_color.map(Number) : Array.isArray(e.hs_color) ? Ci(Number(e.hs_color[0]), Number(e.hs_color[1])) : null;
	if (e.color_mode === "color_temp") {
		let t = Number(e.color_temp_kelvin);
		return Number.isFinite(t) && t > 0 ? Si(t) : null;
	}
	return null;
}
function Ti([e, t, n]) {
	let r = (.2126 * e + .7152 * t + .0722 * n) / 255;
	return {
		fill: `linear-gradient(90deg, rgba(${e},${t},${n},0.35), rgb(${e},${t},${n}))`,
		icon: r > .5 ? "#2b2200" : "#fff"
	};
}
function Ei(e) {
	let t = wi(e);
	if (!t) return {
		color: "#ffd60a",
		bg: "rgba(255,214,10,0.16)",
		text: "#ffe37a",
		icon: "#151005"
	};
	let [n, r, i] = t, a = (e) => Math.round((e + 255) / 2);
	return {
		color: `rgb(${n},${r},${i})`,
		bg: `rgba(${n},${r},${i},0.16)`,
		text: `rgb(${a(n)},${a(r)},${a(i)})`,
		icon: Ti(t).icon === "#fff" ? "#fff" : "#151005"
	};
}
// src/logic/rooms-page.ts
var Di = "raumverbrauch", Oi = "raumverbrauch_ignorieren";
function ki(e, t, n) {
	let r = new Set(n.flatMap((e) => e.areas)), i = [];
	for (let [t, n] of Object.entries(e.entities)) {
		if (!e.states[t] || !Ai(e, t, n.labels)) continue;
		let a = L(e, t);
		a && e.areas[a] && !r.has(a) && !i.includes(a) && i.push(a);
	}
	let a = [...n, ...i.map((t) => Cr(e, {
		slug: t,
		areas: [t]
	}))], o = (t) => (t.floor ? e.floors?.[t.floor]?.level : void 0) ?? -Infinity;
	return a.map((e, t) => ({
		r: e,
		i: t
	})).sort((e, t) => o(t.r) - o(e.r) || e.i - t.i).map((e) => e.r).map((n) => {
		let r = _i(e, n, t.names), i = r.filter((e) => e.on).length, a = r.filter((e) => e.on && e.kind === "light").length, o = n.floor ? e.floors?.[n.floor]?.name ?? n.floor.toUpperCase() : void 0, s = r.length ? i ? `${i} von ${r.length} an` : "alles aus" : "keine Geräte";
		return {
			room: n,
			devices: r,
			scenes: vi(e, n),
			onCount: i,
			lightsOn: a,
			sub: o ? `${o} · ${s}` : s,
			active: a > 0,
			power: ji(e, n),
			floorShort: o
		};
	});
}
function Ai(e, t, n) {
	if (n?.includes("dashboard_gerat")) return !0;
	let r = e.entities[t]?.device_id;
	return !!(r && e.devices[r]?.labels?.includes("dashboard_gerat"));
}
function ji(e, t) {
	let n = Mi(e, t).map((t) => P(e, t)).filter((e) => e !== null);
	return n.length ? n.reduce((e, t) => e + t, 0) : null;
}
function Mi(e, t) {
	let n = t.power;
	if (!n?.length) {
		let r = Ni(e), i = `sensor.${t.slug}_leistung`;
		if (r.has(i)) n = [i];
		else {
			let e = [...t.areas, ...t.slug.split("_").filter((e) => e.length > 3)];
			n = [...new Set(e.map((e) => `sensor.${e}_leistung`).filter((e) => r.has(e)))];
		}
	}
	return n;
}
function Ni(e) {
	let t = Object.keys(e.states).filter((e) => /^sensor\..+_leistung$/.test(e)), n = (t) => e.entities[t]?.labels ?? [], r = t.filter((e) => n(e).includes(Di));
	return new Set((r.length ? r : t).filter((e) => !n(e).includes(Oi)));
}
function Pi(e) {
	let t = e.reduce((e, t) => e + t.lightsOn, 0), n = e.reduce((e, t) => e + t.onCount - t.lightsOn, 0);
	if (!t && !n) return "Alles aus";
	let r = [];
	return t && r.push(`${t} ${t === 1 ? "Licht" : "Lichter"}`), n && r.push(`${n} ${n === 1 ? "Gerät" : "Geräte"}`), `${r.join(" · ")} an`;
}
function Fi(e, t) {
	let n = [...new Set(t.map((e) => e.room.floor).filter((e) => !!e))];
	return n.sort((t, n) => (e.floors?.[n]?.level ?? -99) - (e.floors?.[t]?.level ?? -99)), [
		{
			id: "all",
			label: "Alle"
		},
		{
			id: "on",
			label: "An"
		},
		...n.map((t) => ({
			id: t,
			label: e.floors?.[t]?.name ?? t.toUpperCase()
		}))
	];
}
function Ii(e, t) {
	return t === "all" ? e : t === "on" ? e.filter((e) => e.onCount > 0).map((e) => ({
		...e,
		devices: e.devices.filter((e) => e.on),
		scenes: e.scenes.filter((e) => e.off)
	})) : e.filter((e) => e.room.floor === t);
}
function Li(e, t) {
	let [n, r] = t.split(":").map(Number), i = new Date(e);
	i.setHours(n, r, 0, 0);
	let a = Math.round((i.getTime() - e.getTime()) / 6e4);
	return a <= 0 && (a += 1440), a;
}
// src/logic/energy.ts
var Ri = (e) => e ?? 0;
function zi(e) {
	let t = e.energy_sources ?? [], n = (e, n) => t.filter((t) => t.type === e && t[n]).map((e) => e[n]);
	return {
		solar: n("solar", "stat_energy_from"),
		import: n("grid", "stat_energy_from"),
		export: n("grid", "stat_energy_to"),
		solarRate: n("solar", "stat_rate")
	};
}
function Bi(e) {
	let t = (e.energy_sources ?? []).filter((e) => e.type === "battery");
	return {
		batteryOut: t.filter((e) => e.stat_energy_from).map((e) => e.stat_energy_from),
		batteryIn: t.filter((e) => e.stat_energy_to).map((e) => e.stat_energy_to)
	};
}
function Vi(e) {
	let t = (e.energy_sources ?? []).filter((e) => e.type === "grid"), n = t.length === 1 ? t[0] : void 0;
	return {
		importPrice: n?.number_energy_price ?? null,
		exportPrice: n?.number_energy_price_export ?? null,
		costStats: t.filter((e) => e.stat_cost || e.stat_energy_from).map((e) => e.stat_cost || `${e.stat_energy_from}_cost`),
		compensationStats: t.filter((e) => e.stat_compensation || e.stat_energy_to).map((e) => e.stat_compensation || `${e.stat_energy_to}_compensation`)
	};
}
function Hi(e, t, n) {
	let r = (e) => Math.round(e * 100) / 100, i = e.importPrice === null ? n?.cost : t.import * e.importPrice;
	if (i === void 0) return null;
	let a = e.exportPrice === null ? n?.compensation ?? 0 : t.export * e.exportPrice;
	return {
		cost: r(i),
		compensation: r(a),
		saved: e.importPrice === null ? null : r(t.local * e.importPrice),
		net: r(i - a)
	};
}
function Ui(e, t) {
	let n = [N(e, "pv_power"), ...t ? zi(t).solarRate : []];
	return [...new Set(n)];
}
function K(e, t) {
	return t.reduce((t, n) => t + (e[n] ?? []).reduce((e, t) => e + (Number(t.change) || 0), 0), 0);
}
function Wi(e, t, n) {
	let r = Ui(t, n).reduce((t, n) => t + Math.max(0, Ri(P(e, n))), 0), i = Math.max(0, Ri(P(e, N(t, "grid_import")))), a = Math.max(0, Ri(P(e, N(t, "grid_export")))), o = P(e, N(t, "battery_power")), s = P(e, N(t, "battery_soc")), c = o !== null || s !== null ? {
		soc: s,
		power: Ri(o)
	} : null;
	return {
		pv: r,
		house: P(e, N(t, "house_power")) ?? Math.max(0, r + i - a + Ri(c?.power ?? null)),
		import: i,
		export: a,
		battery: c
	};
}
function Gi(e) {
	let t = e.getHours();
	return t >= 5 && t < 11 ? "Morgen" : t >= 11 && t < 14 ? "Mittag" : t >= 14 && t < 18 ? "Nachmittag" : t >= 18 && t < 23 ? "Abend" : "Nacht";
}
function Ki(e, t) {
	let n;
	return n = t.pv > 50 && t.export > t.import ? "Sonne liefert, Überschuss geht ins Netz" : t.pv > 50 && t.import > 50 ? `PV deckt ${Math.min(99, Math.round(t.pv / Math.max(t.house, 1) * 100))} %, Rest aus dem Netz` : t.pv > 50 ? "PV deckt den Verbrauch" : (t.battery?.power ?? 0) > 50 && t.import < 50 ? "Akku versorgt das Haus" : "PV aus, Strom kommt aus dem Netz", `${Gi(e)} · ${n}`;
}
function qi(e, t) {
	let n = P(e, t);
	return n === null ? 0 : e.states[t]?.attributes.unit_of_measurement === "Wh" ? n / 1e3 : n;
}
function Ji(e, t, n, r = 0, i = 0) {
	let a = (e) => Math.round(e * 1e3) / 1e3, o = a(Math.max(0, e + t + r - n - i));
	return {
		consumed: o,
		local: a(Math.max(0, o - t))
	};
}
function Yi(e, t, n) {
	let r = n ? n.pv : qi(e, N(t, "pv_today")), i = n ? n.import : qi(e, N(t, "import_today")), a = n ? n.export : qi(e, N(t, "export_today")), { consumed: o, local: s } = Ji(r, i, a, n?.batteryOut, n?.batteryIn);
	return {
		pv: r,
		import: i,
		export: a,
		consumed: o,
		local: s,
		autarky: o > 0 ? Math.round(s / o * 100) : null,
		selfUse: r > 0 ? Math.round(Math.max(0, r - a) / r * 100) : null
	};
}
var Xi = /_phase_|_poe_|standby/;
function Zi(e, t) {
	let n = P(e, t);
	return n === null ? null : Math.abs(e.states[t]?.attributes.unit_of_measurement === "kW" ? n * 1e3 : n);
}
function Qi(e, t, n = 6, r) {
	let i = new Set(t.exclude?.consumers ?? []), a = new Set([...[
		"grid_import",
		"grid_export",
		"battery_power",
		"house_power"
	].map((e) => N(t, e)), ...Ui(t, r)].map((t) => e.entities[t]?.device_id).filter((e) => !!e)), o = /* @__PURE__ */ new Map();
	for (let t of Object.keys(e.states)) {
		if (!/^sensor\..+_power$/.test(t) || Xi.test(t) || i.has(t)) continue;
		let n = e.states[t].attributes;
		if (n.device_class !== "power" && !["W", "kW"].includes(n.unit_of_measurement)) continue;
		let r = e.entities[t];
		if (r?.platform && i.has(r.platform)) continue;
		let s = r?.labels ?? [];
		if (s.includes("raumverbrauch") || s.includes("raumverbrauch_ignorieren") || r?.device_id && a.has(r.device_id) || !L(e, t)) continue;
		let c = r?.device_id ?? t;
		o.has(c) || o.set(c, []), o.get(c).push(t);
	}
	let s = [];
	for (let [n, r] of o) {
		let i = r.filter((e) => !/_device_power$/.test(e)).find((t) => Zi(e, t) !== null) ?? r.find((t) => Zi(e, t) !== null);
		if (!i) continue;
		let a = Zi(e, i);
		if (a < 1) continue;
		let o = e.devices[n], c = t.names?.[i] || o?.name_by_user || o?.name || R(e, i).replace(/\s*(device\s+)?(power|leistung)$/i, "");
		s.push({
			id: i,
			name: c || i,
			value: a
		});
	}
	let c = N(t, "untracked_power"), l = Zi(e, c);
	return l !== null && l >= 1 && s.push({
		id: c,
		name: "Nicht erfasst",
		value: l,
		untracked: !0
	}), s.sort((e, t) => t.value - e.value).slice(0, n);
}
function $i(e, t) {
	let n = (e) => new Map(e.map((e) => [e.t, e.v])), r = n(t.import), i = n(t.export), a = n(t.pv), o = n(t.batteryOut ?? []), s = n(t.batteryIn ?? []), c = [.../* @__PURE__ */ new Set([
		...a.keys(),
		...r.keys(),
		...i.keys(),
		...o.keys(),
		...s.keys()
	])].sort((e, t) => e - t), l = (t, n, r, i, a) => {
		if (e === "selfuse") return t > .01 ? Math.max(0, t - r) / t : null;
		let { consumed: o, local: s } = Ji(t, n, r, i, a);
		return o > .01 ? s / o : null;
	}, u = [], d = 0, f = 0, p = 0, m = 0, h = 0;
	for (let e of c) {
		let t = a.get(e) ?? 0, n = r.get(e) ?? 0, c = i.get(e) ?? 0, g = o.get(e) ?? 0, _ = s.get(e) ?? 0;
		d += t, f += n, p += c, m += g, h += _;
		let v = l(t, n, c, g, _);
		v !== null && u.push({
			t: e,
			v: Math.round(Math.min(1, v) * 100)
		});
	}
	let g = l(d, f, p, m, h);
	return {
		points: u,
		total: g === null ? null : Math.round(Math.min(1, g) * 100)
	};
}
function ea(e) {
	let t = [
		e.pv,
		e.import,
		e.export,
		e.batteryOut ?? [],
		e.batteryIn ?? []
	].map((e) => new Map(e.map((e) => [e.t, e.v])));
	return [...new Set(t.flatMap((e) => [...e.keys()]))].sort((e, t) => e - t).map((e) => {
		let [n, r, i, a, o] = t.map((t) => t.get(e) ?? 0);
		return {
			t: e,
			v: Ji(n, r, i, a, o).consumed
		};
	});
}
function ta(e, t) {
	return e.reduce((e, n) => e + n.v * t / 36e5 / 1e3, 0);
}
function na(e, t) {
	return e.soc === null || Math.abs(e.power) > 10 ? null : t?.reserve !== void 0 && e.soc <= t.reserve ? "Reserve" : e.soc >= (t?.full ?? 100) ? "voll" : null;
}
// src/data/series.ts
var q = 36e5, ra = 24 * q, ia = (e) => typeof e == "number" ? e : Date.parse(e);
async function aa(e, t, n, r = Date.now()) {
	let i = Math.floor(r / q) * q;
	return t.length ? {
		start: i,
		rows: await e.callWS({
			type: "recorder/statistics_during_period",
			start_time: new Date(i).toISOString(),
			end_time: new Date(r).toISOString(),
			statistic_ids: t,
			period: "5minute",
			types: [n],
			...n === "change" ? { units: { energy: "kWh" } } : {}
		})
	} : {
		start: i,
		rows: {}
	};
}
function oa(e, t = Date.now()) {
	if (e === "4h") {
		let e = 3e5, n = Math.ceil(t / e) * e;
		return {
			start: n - 4 * q,
			end: n,
			period: "5minute",
			step: e
		};
	}
	if (e === "24h") {
		let e = Math.ceil(t / q) * q;
		return {
			start: e - 24 * q,
			end: e,
			period: "hour",
			step: q
		};
	}
	let n = new Date(t);
	n.setHours(0, 0, 0, 0);
	let r = e === "7d" ? 7 : 30, i = n.getTime() + ra;
	return {
		start: i - r * ra,
		end: i,
		period: "day",
		step: ra
	};
}
async function sa(e, t, n) {
	let r = oa(n), [i, a] = await Promise.all([e.callWS({
		type: "recorder/statistics_during_period",
		start_time: new Date(r.start).toISOString(),
		end_time: new Date(r.end).toISOString(),
		statistic_ids: t,
		period: r.period,
		types: ["change"],
		units: { energy: "kWh" }
	}), r.period === "5minute" ? null : aa(e, t, "change")]), o = /* @__PURE__ */ new Map();
	for (let e of t) for (let t of i[e] ?? []) {
		let e = ia(t.start);
		o.set(e, (o.get(e) ?? 0) + (Number(t.change) || 0));
	}
	if (a) {
		let e = r.period === "hour" ? a.start : r.end - r.step;
		r.period === "hour" && o.has(e) || o.set(e, (o.get(e) ?? 0) + K(a.rows, t));
	}
	let s = [];
	for (let e = r.start; e < r.end; e += r.step) s.push({
		t: e,
		v: Math.max(0, o.get(e) ?? 0)
	});
	return {
		past: s,
		start: r.start,
		end: r.end,
		step: r.step
	};
}
async function ca(e, t, n, r) {
	let i = () => Promise.resolve({
		past: [],
		start: 0,
		end: 0
	}), a = r === "autarky" ? [
		t.solar,
		t.import,
		t.export,
		t.batteryOut,
		t.batteryIn
	] : [
		t.solar,
		t.import,
		t.export
	], [o, s, c, l, u] = await Promise.all(a.map((t) => t.length ? sa(e, t, n) : i())), d = [
		o,
		s,
		c
	].find((e) => e.start) ?? o, f = $i(r, {
		pv: o.past,
		import: s.past,
		export: c.past,
		batteryOut: l?.past,
		batteryIn: u?.past
	});
	return {
		past: f.points,
		start: d.start,
		end: d.end,
		step: d.step,
		total: f.total
	};
}
async function la(e, t, n) {
	let r = () => Promise.resolve({
		past: [],
		start: 0,
		end: 0
	}), [i, a, o, s, c] = await Promise.all([
		t.solar,
		t.import,
		t.export,
		t.batteryOut,
		t.batteryIn
	].map((t) => t.length ? sa(e, t, n) : r())), l = [
		i,
		a,
		o
	].find((e) => e.start) ?? i;
	return {
		past: ea({
			pv: i.past,
			import: a.past,
			export: o.past,
			batteryOut: s.past,
			batteryIn: c.past
		}),
		start: l.start,
		end: l.end,
		step: l.step
	};
}
async function ua(e, t, n) {
	let r = Date.now(), i = n === "24h" ? q / 2 : q, a = Math.ceil(r / i) * i, o = a - (n === "24h" ? 1 : n === "3d" ? 3 : 7) * ra, s = [
		t.room,
		t.outdoor,
		t.airing
	].filter((e) => !!e), c = await e.callWS({
		type: "history/history_during_period",
		start_time: new Date(o).toISOString(),
		end_time: new Date(r).toISOString(),
		entity_ids: s,
		minimal_response: !0,
		no_attributes: !0,
		significant_changes_only: !1
	}), l = (e) => (e ? c[e] ?? [] : []).map((e) => ({
		t: Math.max(o, Math.round(e.lu * 1e3)),
		v: Number(e.s)
	})).filter((e) => Number.isFinite(e.v));
	return {
		past: pr(l(t.room), o, a, i),
		compare: t.outdoor ? pr(l(t.outdoor), o, a, i) : void 0,
		bands: t.airing ? vr(c[t.airing] ?? [], o, r) : void 0,
		start: o,
		end: a
	};
}
async function da(e, t, n) {
	let r = oa(n), [i, a] = await Promise.all([e.callWS({
		type: "recorder/statistics_during_period",
		start_time: new Date(r.start).toISOString(),
		end_time: new Date(r.end).toISOString(),
		statistic_ids: [t],
		period: r.period,
		types: ["mean"]
	}), r.period === "hour" ? aa(e, [t], "mean") : null]), o = (i[t] ?? []).map((e) => ({
		t: ia(e.start),
		v: Math.abs(Number(e.mean))
	})).filter((e) => Number.isFinite(e.v));
	if (a && !o.some((e) => e.t === a.start)) {
		let e = (a.rows[t] ?? []).map((e) => Math.abs(Number(e.mean))).filter(Number.isFinite);
		e.length && o.push({
			t: a.start,
			v: e.reduce((e, t) => e + t, 0) / e.length
		});
	}
	return {
		past: o,
		start: r.start,
		end: r.end,
		step: r.step
	};
}
async function fa(e, t, n) {
	let r = /* @__PURE__ */ new Date();
	r.setHours(0, 0, 0, 0);
	let i = n && n.importPrice === null ? n.costStats : [], a = n && n.exportPrice === null ? n.compensationStats : [], o = [
		...t.solar,
		...t.import,
		...t.export,
		...t.batteryOut,
		...t.batteryIn,
		...i,
		...a
	], [s, c] = await Promise.all([e.callWS({
		type: "recorder/statistics_during_period",
		start_time: r.toISOString(),
		statistic_ids: o,
		period: "hour",
		types: ["change"],
		units: { energy: "kWh" }
	}), aa(e, o, "change")]), l = {};
	for (let e of o) {
		let t = s[e] ?? [], n = t.some((e) => ia(e.start) === c.start) ? [] : c.rows[e] ?? [];
		(s[e] || c.rows[e]) && (l[e] = [...t, ...n]);
	}
	return {
		pv: K(l, t.solar),
		import: K(l, t.import),
		export: K(l, t.export),
		batteryOut: K(l, t.batteryOut),
		batteryIn: K(l, t.batteryIn),
		...i.some((e) => l[e]) ? {
			cost: K(l, i),
			compensation: K(l, a)
		} : {}
	};
}
async function pa(e, t, n, r) {
	let i = async (t, n, i) => {
		if (n !== null) {
			let i = await sa(e, t, r);
			return {
				...i,
				past: i.past.map((e) => ({
					t: e.t,
					v: e.v * n
				}))
			};
		}
		return sa(e, i, r);
	}, [a, o] = await Promise.all([i(n.import, t.importPrice, t.costStats), n.export.length || t.compensationStats.length ? i(n.export, t.exportPrice, t.compensationStats) : Promise.resolve({ past: [] })]), s = Math.round(o.past.reduce((e, t) => e + t.v, 0) * 100) / 100;
	return {
		...a,
		total: s
	};
}
async function ma(e, t, n) {
	let r = Date.now(), i = Math.floor(r / q) * q, a = Math.floor((r - 24 * q) / q) * q, o = i + 24 * q, s = t ? await e.callWS({
		type: "recorder/statistics_during_period",
		start_time: new Date(a).toISOString(),
		end_time: new Date(i).toISOString(),
		statistic_ids: [t],
		period: "hour",
		types: ["mean"]
	}) : {};
	return {
		past: (t ? s[t] ?? [] : []).map((e) => ({
			t: ia(e.start),
			v: Math.max(0, Number(e.mean))
		})).filter((e) => Number.isFinite(e.v) && e.t < i),
		future: n.map((e) => ({
			t: Date.parse(e.datetime),
			v: Number(e.precipitation)
		})).filter((e) => Number.isFinite(e.t) && Number.isFinite(e.v) && e.t >= i && e.t < o).slice(0, 24),
		start: a,
		end: o,
		step: q
	};
}
async function ha(e, t, n, r) {
	let i = Date.now(), a = Math.floor((i - 24 * q) / q) * q, o = a + 48 * q, { past: s, future: c } = Bt(n, (await e.callWS({
		type: "history/history_during_period",
		start_time: new Date(a).toISOString(),
		end_time: new Date(i).toISOString(),
		entity_ids: [t],
		minimal_response: !1,
		no_attributes: !1,
		significant_changes_only: !1
	}))[t] ?? [], r), l = pr(s, a, i, q), u = s.length ? [{
		t: i,
		v: s[s.length - 1].v
	}] : [];
	return {
		past: [...l, ...u],
		future: [...u, ...c.filter((e) => e.t > i && e.t <= o)],
		start: a,
		end: o
	};
}
async function ga(e, t, n = Date.now()) {
	let r = new Date(n);
	r.setDate(1), r.setHours(0, 0, 0, 0);
	let i = await e.callWS({
		type: "recorder/statistics_during_period",
		start_time: r.toISOString(),
		end_time: new Date(n).toISOString(),
		statistic_ids: [t],
		period: "month",
		types: ["change"],
		units: { energy: "kWh" }
	}), a = await aa(e, [t], "change", n), o = (e) => (e ?? []).reduce((e, t) => e + (t.change ?? 0), 0);
	return {
		past: [],
		start: r.getTime(),
		end: n,
		total: o(i[t]) + o(a.rows[t])
	};
}
// src/logic/heating-check.ts
var _a = {
	hours: 2,
	min_rise: 1,
	max_power: 150,
	max_pv: 300,
	max_hum_rise: 10
}, va = 6;
function ya(e, t, n = {}) {
	let r = {
		..._a,
		...n
	}, i = (e) => t > r.max_pv && (!r.sunny || r.sunny.includes(e)), a = [];
	for (let t of e) {
		if (i(t.slug) || t.temps.length < va || t.heated || t.windowOpened || t.power > r.max_power || !t.off && (t.cur === null || t.target === null || t.cur <= t.target)) continue;
		let e = t.temps[t.temps.length - 1].v, n = Math.min(...t.temps.slice(0, -1).map((e) => e.v)), o = Math.round((e - n) * 10) / 10;
		o < r.min_rise || t.hums.length && Math.max(...t.hums.map((e) => e.v)) - t.hums[0].v >= r.max_hum_rise || a.push({
			slug: t.slug,
			name: t.name,
			rise: o,
			hours: r.hours
		});
	}
	return a;
}
function ba(e) {
	return e.some((e) => e.a?.hvac_action === "heating");
}
function xa(e) {
	return e.some((e) => e.s === "on");
}
// src/data/heating-check.ts
var Sa = 36e5, Ca = Sa;
function wa(e, t) {
	let n = `sensor.${t.split(".")[1]}_power_percent`;
	return e.states[n] ? n : void 0;
}
async function Ta(e, t, n, r = {}, i = Date.now()) {
	let a = {
		..._a,
		...r
	}, o = t.filter((t) => t.climate && e.states[t.temperature]);
	if (!o.length) return [];
	let s = i - a.hours * Sa, c = new Map(o.map((t) => [t.slug, Mi(e, t)])), l = new Map(o.map((t) => [t.slug, wa(e, t.climate)])), u = [...new Set([...o.flatMap((e) => [
		e.temperature,
		e.humidity,
		...c.get(e.slug),
		l.get(e.slug) ?? ""
	]), ...n].filter((t) => t && e.states[t]))], d = o.flatMap((e) => e.window ? [e.window] : []), f = o.filter((e) => !l.get(e.slug)).map((e) => e.climate), p = (t, n) => t.length ? e.callWS({
		type: "history/history_during_period",
		start_time: (/* @__PURE__ */ new Date(s - Ca)).toISOString(),
		end_time: new Date(i).toISOString(),
		entity_ids: t,
		...n ? { significant_changes_only: !1 } : {
			minimal_response: !0,
			no_attributes: !0
		}
	}) : Promise.resolve({}), [m, h, g] = await Promise.all([
		e.callWS({
			type: "recorder/statistics_during_period",
			start_time: (/* @__PURE__ */ new Date(s - Ca)).toISOString(),
			end_time: new Date(i).toISOString(),
			statistic_ids: u,
			period: "5minute",
			types: ["mean", "max"]
		}),
		p(d, !1),
		p(f, !0)
	]), _ = (e, t = s) => (m[e] ?? []).map((e) => ({
		...e,
		t: typeof e.start == "number" ? e.start : Date.parse(e.start)
	})).filter((e) => e.t >= t), v = (e) => _(e).map((e) => ({
		t: e.t,
		v: Number(e.mean)
	})).filter((e) => Number.isFinite(e.v)), y = (e) => {
		let t = v(e);
		return t.length ? t.reduce((e, t) => e + t.v, 0) / t.length : 0;
	}, b = (e) => _(e, s - Ca).some((e) => Number(e.max ?? e.mean) > 0), ee = n.reduce((e, t) => e + Math.max(0, y(t)), 0);
	return ya(o.map((t) => {
		let n = nr(e, t), r = l.get(t.slug);
		return {
			slug: t.slug,
			name: t.name,
			temps: v(t.temperature),
			hums: v(t.humidity),
			power: c.get(t.slug).reduce((e, t) => e + Math.max(0, y(t)), 0),
			heated: n.heating || (r ? b(r) : ba(g[t.climate] ?? [])),
			windowOpened: n.windowOpen || !!t.window && xa(h[t.window] ?? []),
			off: n.off,
			cur: n.cur,
			target: n.target
		};
	}), ee, a);
}
// src/data/window-check.ts
var Ea = 9e5, Da = 216e5;
function Oa(e, t, n) {
	return t.filter((t) => {
		let r = t.window ? e.states[t.window] : void 0;
		return r?.state === "on" && n - new Date(r.last_changed).getTime() >= 18e5;
	});
}
async function ka(e, t, n, r = Date.now()) {
	let i = Oa(e, t, r), a = P(e, N(n, "outdoor_temp"));
	if (!i.length || a === null) return [];
	let o = (t) => new Date(e.states[t.window].last_changed).getTime(), s = Math.max(Math.min(...i.map(o)) - Ea, r - Da), c = await e.callWS({
		type: "recorder/statistics_during_period",
		start_time: new Date(s).toISOString(),
		end_time: new Date(r).toISOString(),
		statistic_ids: i.flatMap((e) => [e.temperature, e.humidity]),
		period: "5minute",
		types: ["mean"]
	}), l = (e, t) => (c[e] ?? []).map((e) => ({
		t: typeof e.start == "number" ? e.start : Date.parse(e.start),
		v: Number(e.mean)
	})).filter((e) => Number.isFinite(e.v) && e.t >= t);
	return i.filter((e) => {
		let t = o(e);
		return yn(l(e.temperature, t - Ea), l(e.humidity, t - Ea).filter((e) => e.t > t), t, a);
	}).map((e) => e.slug);
}
// src/components/motion.ts
function Aa(e, t) {
	let n = mi(e, t);
	return n.mode === "sleep" ? 1 : n.mode !== "manual" || n.level === null ? "auto" : Math.max(1, Math.min(3, Math.ceil(n.level / n.levels * 3)));
}
function J(e, t, n, r = 2.2) {
	return C`<svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke=${t} stroke-width=${r}
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n}</svg>`;
}
function ja(e, t, n, r, i = 2.2) {
	return J(n, r, e ? w`<path class="spin s${t === "auto" ? 1 : t}" d=${k.fan}></path>` : w`<path d=${k.fan}></path>`, i);
}
var Ma = "M12 10a4 4 0 1 0 0 8a4 4 0 1 0 0-8", Na = "M9.5 14h5", Pa = "M5 3h14v18H5zM5 7h14";
function Fa(e, t, n, r, i = 2.2) {
	return e === "dishwasher" ? J(n, r, w`<path d=${Pa}></path><path class=${t ? "spray" : ""} d=${"M9 12h.01M12 15h.01M15 12h.01M10.5 18h.01M13.5 18h.01"}></path>`, i) : e === "washer" || e === "dryer" ? J(n, r, w`<path d=${e === "washer" ? "M5 3h14v18H5zM5 7h14" : "M4 3h16v18H4zM7 6h.01"}></path><g class=${t ? "tumble" : ""}><path d=${Ma}></path><path d=${Na}></path></g>`, i) : J(n, r, w`<path d=${O.washer}></path>`, i);
}
function Ia(e, t, n, r = 2.2) {
	return J(t, n, w`<path class=${e ? "bob" : ""} d=${A.drop}></path>`, r);
}
function La(e, t, n, r, i = 2.2) {
	return e.kind === "fan" ? ja(e.on, Aa(e.on ? "on" : "off", t ?? {}), n, r, i) : e.kind === "humidifier" ? Ia(e.on, n, r, i) : j(We(e.id, e.name), n, r, i);
}
var Ra = "M7 15a5 5 0 1 1 3-9 6 6 0 0 1 9 5 4 4 0 0 1-2 4H7", za = "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8", Ba = "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4", Va = "M8 18l-1 3M12 18l-1 3M16 18l-1 3", Ha = "M10 18l-1 3M14 18l-1 3", Ua = "M8 19h.01M12 19h.01M16 19h.01", Wa = "M10 19h.01M14 19h.01", Ga = "M13 12l-3 5h4l-3 5", Ka = "M7 15a5 5 0 1 1 3-9 6 6 0 0 1 9 5 4 4 0 0 1-2 4";
function qa(e, t, n) {
	let r = (e, t, n) => w`<clipPath id="wx-under"><rect x="0" y="16.5" width="24" height="7.5"></rect></clipPath>
      <g clip-path="url(#wx-under)"><path class=${e} d=${t}></path><path class="${e} late" d=${n}></path></g>`;
	switch (e) {
		case "rainy":
		case "pouring": return J(t, n, w`<path d=${Ra}></path>${r("rain", Va, Ha)}`, 2);
		case "lightning-rainy": return J(t, n, w`<path d=${Ka}></path><path d=${Ga}></path>${r("rain", Va, Ha)}`, 2);
		case "snowy":
		case "snowy-rainy": return J(t, n, w`<path d=${Ra}></path>${r("snow", Ua, Wa)}`, 2);
		case "cloudy":
		case "partlycloudy": return J(t, n, w`<path class="drift" d=${O.cloud}></path>`, 2);
		case "sunny": return J(t, n, w`<path d=${za}></path><path class="rays" d=${Ba}></path>`, 2);
		case "lightning": return J(t, n, w`<path d=${Ka}></path><path class="flash" d=${Ga}></path>`, 2);
		default: return j(He(e), t, n, 2);
	}
}
// src/pages/climate.ts
function Ja(e) {
	let t = (e, t, n, r, i = "", a = 11) => C`<span class="winchip ${i}" style="background:${n}" title=${r} aria-label=${r}>${j(e, a, t, 2.6)}</span>`;
	switch (e.kind) {
		case "recommend": return t(O.wind, "#5ac8fa", "rgba(90,200,250,0.2)", "Lüften empfohlen", "", 12);
		case "airing": return t(O.window, "#5ac8fa", "rgba(90,200,250,0.2)", "Lüftet");
		case "overdue": return t(O.window, "#ff6b61", "rgba(255,69,58,0.24)", `Fenster offen seit ${e.openMin} min · ${e.reason}`);
		case "stuck": return t(O.window, "#aeb4c0", "transparent", "Fenstersensor prüfen", "doubt");
		case "open": return t(O.window, "#aeb4c0", "rgba(255,255,255,0.1)", "Fenster offen (ignoriert)");
		default: return E;
	}
}
function Ya(e) {
	switch (e.kind) {
		case "airing": return e.remaining > 0 ? `lüftet ${U(e.remaining)}` : "lüftet";
		case "overdue": return `offen ${pn(e.openMin)}`;
		case "stuck": return "Sensor?";
		case "open": return "offen";
		default: return null;
	}
}
function Xa(e, t) {
	let n = nr(e.hass, t, e.target(t.climate)), r = e.window(t), i = fn(r, n.heating), a = t.climate, o = e.heating().find((e) => e.slug === t.slug);
	return C`
    <div class="kroom ${i}">
      <button class="kroom-main" @click=${() => e.openSheet({
		id: "room",
		slug: t.slug
	})}>
        <span class="circle kroom-circle ${i === "heat" ? "breathe" : ""}">${j(Ve(t.name, t.icon), 19, i ? "#141008" : "#fff", 2)}</span>
        <span class="kroom-text">
          <span class="kroom-name">
            <span class="ellipsis">${t.name}</span>
            ${n.aq || n.fanOn ? C`<span class="aqchip" title=${n.pm25 === null ? "Luftreiniger an" : `PM2.5 ${I(n.pm25)} µg/m³`}
                  style="background:${n.aq ? n.aq + "2e" : "rgba(48,209,88,0.18)"}">
                  ${n.aq ? C`<span class="dot" style="width:6px;height:6px;background:${n.aq}"></span>` : E}
                  ${n.fanOn ? ja(!0, Aa("on", e.hass.states[t.purifier ?? ""]?.attributes ?? {}), 11, "#7ee8a0", 2.6) : E}
                </span>` : E}
            ${Ja(r)}
            ${o ? C`<span class="heatchip" title="Heizung prüfen: +${I(o.rise, 1)}° in ${o.hours} h ohne Heizbedarf"
                  aria-label="Heizung prüfen">${j(O.thermo, 11, "#ff9f0a", 2.6)}!</span>` : E}
          </span>
          <span class="kroom-sub">${H(n.cur)}° · ${n.hum ?? "–"} % · ${Ya(r) ?? n.label}</span>
        </span>
      </button>
      ${a ? C`<span class="stepper">
            <button class="step" aria-label="Soll senken" @click=${() => e.stepTarget(a, -.5)}>−</button>
            <span class="target">${H(n.target)}°</span>
            <button class="step" aria-label="Soll erhöhen" @click=${() => e.stepTarget(a, .5)}>+</button>
          </span>` : E}
    </div>
  `;
}
var Za = [
	{
		mode: "cool",
		name: "Kühlen",
		icon: k.snowflake,
		stroke: "#8fd8ff"
	},
	{
		mode: "dry",
		name: "Trocknen",
		icon: k.drop,
		stroke: "#fff"
	},
	{
		mode: "off",
		name: "Aus",
		icon: k.power,
		stroke: "#fff"
	}
], Qa = {
	off: "Aus",
	cool: "Kühlt",
	dry: "Trocknet",
	heat: "Heizt",
	fan_only: "Lüfter",
	auto: "Auto",
	heat_cool: "Auto"
};
function $a(e, t) {
	let n = e.hass.states[t];
	if (!n) return E;
	let r = n.attributes, i = [
		Qa[n.state] ?? n.state,
		r.current_temperature == null ? "" : `${I(Number(r.current_temperature), 1)}° innen`,
		r.temperature == null ? "" : `Soll ${I(Number(r.temperature), 1)}°`
	].filter(Boolean).join(" · ");
	return C`
    <div class="ac">
      <button class="ac-main" aria-label="Klimaanlage öffnen" @click=${() => e.openSheet({ id: "ac" })}>
        <span class="circle" style="width:44px;height:44px;background:rgba(100,210,255,0.18)">${j(k.snowflake, 19, "#8fd8ff", 2)}</span>
        <span><span class="t1">Klimaanlage</span><span class="t2">${i}</span></span>
      </button>
      <span class="ac-modes">
        ${Za.map((r) => {
		let i = n.state === r.mode;
		return C`<button class="ac-mode ${i ? "active" : ""}" aria-label=${r.name} title=${r.name} aria-pressed=${i}
            @click=${() => e.call("climate", "set_hvac_mode", { hvac_mode: r.mode }, { entity_id: t })}>
            ${j(r.icon, 16, i ? "#101218" : r.stroke, 2.2)}</button>`;
	})}
      </span>
    </div>
  `;
}
function eo(e, t, n, r) {
	let i = sr(t.rooms.map((t) => nr(e.hass, t).cur));
	return C`
    <section class="section">
      <div class="section-head" style="margin-top:8px">
        <h2>${t.name}</h2>
        <span class="rule" aria-hidden="true"></span>
        <span class="meta">${i === null ? "" : `Ø ${I(i, 1)}°`}</span>
      </div>
      ${t.rooms.map((t) => Xa(e, t))}
      ${r === t.id ? $a(e, n) : E}
    </section>
  `;
}
function to(e) {
	let { hass: t, rooms: n } = e, r = N(e.config, "heating"), i = F(t, r) === "on", a = lr(t, n, e.config), o = N(e.config, "ac"), s = t.states[o] ? or(t, o) : void 0, c = ar(t, n), l = t.states[N(e.config, "weather")]?.state ?? "", u = dr(t, n, e.config, e.now);
	return C`
    <div class="climate">
      <header class="khead">
        <div>
          <div class="date">${cr(t, n)}</div>
          <h1>Klima</h1>
        </div>
        ${t.states[r] ? C`<button class="heat-toggle ${i ? "on" : ""}" aria-pressed=${i}
              aria-label="Zentralheizung ${i ? "an" : "aus"}" title="Zentralheizung"
              @click=${() => e.call("input_boolean", "toggle", {}, { entity_id: r })}>
              <span class="track"><span class="knob">${j(k.flame, 14, i ? "#ff9f0a" : "#888", 2.6)}</span></span>
            </button>` : E}
      </header>

      <button class="pill outdoor" @click=${() => e.openSheet({ id: "airing" })}>
        <span class="circle" style="width:44px;height:44px;background:rgba(143,208,255,0.2)">${qa(l, 20, "#8fd0ff")}</span>
        <span class="grow"><span class="t1">${a.title}</span><span class="t2">${a.sub}</span></span>
        ${u.active ? C`<span class="air-badge running" aria-label="Lüften läuft, noch ${U(u.remaining)}">${j(O.wind, 14, "#06202c", 2.4)}${U(u.remaining)}</span>` : a.minutes === null ? E : C`<span class="air-badge">${j(O.wind, 14, "#06202c", 2.4)}${I(Math.round(a.minutes))} min</span>`}
      </button>

      <div class="pill allrooms">
        <span class="grow" style="font-size:14px;font-weight:600">Alle Räume</span>
        ${er.map((t) => C`
          <button class="preset" style="background:${t.color}" aria-label="Alle auf ${t.name}" title=${t.name}
            @click=${() => e.runScript(N(e.config, "preset_all"), { preset: t.id })}>
            ${j(Ue[t.id], 18, "#101010", 2.3)}
          </button>`)}
        <button class="preset" style="background:#fff" aria-label="Temperatur für alle Räume einstellen"
          @click=${() => e.openSheet({ id: "allRooms" })}>${j(k.tune, 18, "#101218", 2.3)}</button>
      </div>

      ${c.map((t) => eo(e, t, o, s))}
    </div>
  `;
}
var no = o`
  .climate {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .khead {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 6px 4px;
  }
  .khead h1 {
    margin-top: 2px;
    font-size: 30px;
    font-weight: 700;
  }
  .heat-toggle {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 6px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.08);
  }
  .heat-toggle.on {
    background: rgba(255, 159, 10, 0.2);
  }
  .track {
    position: relative;
    width: 52px;
    height: 32px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.2);
    transition: background 0.2s;
  }
  .heat-toggle.on .track {
    background: #ff9f0a;
  }
  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 26px;
    height: 26px;
    border-radius: 13px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: left 0.2s;
  }
  .heat-toggle.on .knob {
    left: 23px;
  }
  .pill {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 60px;
    padding: 0 8px;
    border-radius: 30px;
    background: var(--sd-fill);
    width: 100%;
  }
  .t1 {
    display: block;
    font-size: 15px;
    font-weight: 600;
  }
  .t2 {
    display: block;
    font-size: 12px;
    color: var(--sd-muted);
  }
  .air-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 34px;
    padding: 0 12px;
    border-radius: 17px;
    background: #5ac8fa;
    color: #06202c;
    font-size: 12px;
    font-weight: 700;
    margin-right: 4px;
    flex-shrink: 0;
  }
  .air-badge.running {
    font-variant-numeric: tabular-nums;
    animation: air-pulse 2s ease-in-out infinite;
  }
  @keyframes air-pulse {
    50% {
      box-shadow: 0 0 0 4px rgba(90, 200, 250, 0.28);
    }
  }
  .heatchip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 1px;
    height: 18px;
    padding: 0 6px 0 4px;
    border-radius: 9px;
    background: rgba(255, 159, 10, 0.22);
    color: #ff9f0a;
    font-size: 11px;
    font-weight: 800;
  }
  .winchip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: rgba(90, 200, 250, 0.2);
  }
  .allrooms {
    gap: 6px;
    padding: 0 8px 0 16px;
  }
  .preset {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .kroom {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 60px;
    padding: 0 6px 0 8px;
    border-radius: 30px;
    background: var(--sd-fill);
  }
  .kroom.heat {
    background: linear-gradient(90deg, rgba(255, 159, 10, 0.24), rgba(255, 255, 255, 0.06) 65%);
  }
  .kroom.alert {
    background: linear-gradient(90deg, rgba(255, 69, 58, 0.24), rgba(255, 255, 255, 0.06) 65%);
  }
  .kroom.alert .kroom-circle {
    background: #ff453a;
  }
  .kroom.alert .kroom-sub {
    color: #ff8a80;
  }
  .winchip.doubt {
    border: 1px dashed rgba(174, 180, 192, 0.8);
  }
  .kroom.vent {
    background: linear-gradient(90deg, rgba(90, 200, 250, 0.22), rgba(255, 255, 255, 0.06) 65%);
  }
  .kroom-main {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
    height: 100%;
  }
  .kroom-circle {
    width: 44px;
    height: 44px;
    background: var(--sd-fill-2);
  }
  .kroom.heat .kroom-circle {
    background: #ff9f0a;
  }
  .kroom.vent .kroom-circle {
    background: #5ac8fa;
  }
  .kroom-text {
    min-width: 0;
  }
  .kroom-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 600;
  }
  .aqchip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 3px;
    height: 18px;
    padding: 0 6px 0 5px;
    border-radius: 9px;
  }
  .kroom-sub {
    display: block;
    font-size: 12px;
    color: var(--sd-muted);
    white-space: nowrap;
  }
  .kroom.heat .kroom-sub {
    color: #ffc061;
  }
  .kroom.vent .kroom-sub {
    color: #8fd8ff;
  }
  .stepper {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }
  .step {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 18px;
    text-align: center;
    touch-action: manipulation;
  }
  .target {
    min-width: 46px;
    text-align: center;
    font-size: 15px;
    font-weight: 700;
  }
  .kroom.heat .target {
    color: #ffc061;
  }
  .ac {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 60px;
    padding: 0 6px 0 8px;
    border-radius: 30px;
    background: var(--sd-fill);
  }
  .ac-main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
  }
  .ac-modes {
    display: flex;
    gap: 4px;
  }
  .ac-mode {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ac-mode.active {
    background: #fff;
  }
`;
// src/logic/technik.ts
function Y(e) {
	return e.technik === !1 ? null : e.technik ?? {};
}
function ro(e, t) {
	let n = Y(t), r = e.user;
	if (!n || !r) return !1;
	if (!n.users) return !!r.is_admin;
	let i = [r.id, r.name].filter(Boolean).map((e) => e.toLowerCase());
	return n.users.some((e) => i.includes(String(e).toLowerCase()));
}
var io = { DNS: "^DNS\\b" };
function ao(e, t, n) {
	let r = new Set(Y(t)?.services_exclude ?? []), i = Object.values(e.entities).filter((e) => e.platform === "uptime_kuma"), a = [];
	for (let t of i) {
		if (t.translation_key !== "status") continue;
		let o = e.states[t.entity_id];
		if (!o) continue;
		let s = t.device_id ? e.devices[t.device_id] : void 0, c = s?.name_by_user || s?.name || R(e, t.entity_id).replace(/\s*Status$/, "");
		if (r.has(c)) continue;
		let l = i.find((e) => e.device_id && e.device_id === t.device_id && e.translation_key === "cert_days_remaining")?.entity_id, u = P(e, l) ?? void 0, d = vt(e, t.entity_id, n), f;
		f = o.state === "down" && d >= 3 ? {
			name: c,
			kind: "down",
			text: `down seit ${z(d)}`
		} : o.state === "down" || o.state === "pending" || o.state === "unavailable" || o.state === "unknown" ? {
			name: c,
			kind: "pending",
			text: "prüft …"
		} : o.state === "up" && u !== void 0 && u < 7 ? {
			name: c,
			kind: "cert",
			text: `Zertifikat ${I(Math.floor(u))} Tage`
		} : {
			name: c,
			kind: "ok",
			text: ""
		}, f.certDays = u, a.push(f);
	}
	return a;
}
var oo = {
	down: 0,
	pending: 1,
	cert: 2,
	ok: 3
};
function so(e) {
	let t = Y(e)?.service_groups ?? io, n = [];
	for (let [e, r] of Object.entries(t)) try {
		n.push([e, new RegExp(r)]);
	} catch {}
	return n;
}
function co(e, t, n) {
	let r = ao(e, t, n), i = so(t), a = [], o = /* @__PURE__ */ new Set();
	for (let [e, t] of i) {
		let n = r.filter((e) => !o.has(e) && t.test(e.name));
		if (!n.length) continue;
		n.forEach((e) => o.add(e));
		let i = n.filter((e) => e.kind === "down").length, s = n.reduce((e, t) => oo[t.kind] < oo[e.kind] ? t : e), c = s.kind === "down" ? `${i} von ${n.length} down` : s.text;
		a.push({
			name: e,
			kind: s.kind,
			text: c,
			members: n.length,
			down: i
		});
	}
	for (let e of r) o.has(e) || a.push({
		name: e.name,
		kind: e.kind,
		text: e.text
	});
	let s = (e, t) => e.name.localeCompare(t.name, "de"), c = a.filter((e) => e.kind !== "ok").sort((e, t) => oo[e.kind] - oo[t.kind] || s(e, t));
	return {
		problems: c,
		ok: a.filter((e) => e.kind === "ok").sort(s),
		okMonitors: r.filter((e) => e.kind === "ok").length,
		total: r.length,
		down: c.filter((e) => e.kind === "down")
	};
}
function lo(e, t) {
	return Object.values(e.entities).filter((e) => e.platform === t);
}
function uo(e, t) {
	let n = Y(t);
	if (n) return n.pihole ?? lo(e, "pi_hole").find((e) => e.entity_id.startsWith("switch."))?.entity_id;
}
function fo(e, t, n, r) {
	let i = uo(e, t), a = i ? e.states[i] : void 0;
	if (!i || !a || a.state !== "on" && a.state !== "off") return null;
	if (a.state === "on") {
		let t = lo(e, "pi_hole").find((e) => e.translation_key === "percent_ads_blocked")?.entity_id, n = P(e, t);
		return {
			entity: i,
			kind: "on",
			percent: n === null ? void 0 : n < 1 ? Math.round(n * 10) / 10 : Math.round(n),
			problem: !1
		};
	}
	return r && r > n.getTime() ? {
		entity: i,
		kind: "paused",
		remainingSec: Math.ceil((r - n.getTime()) / 1e3),
		problem: !1
	} : {
		entity: i,
		kind: "off",
		offSince: new Date(a.last_changed).getTime(),
		problem: vt(e, i, n) >= 70
	};
}
function po(e, t) {
	let n = Y(t);
	if (!n) return null;
	let r = lo(e, "unifi"), i = n.guest_wifi ?? r.find((e) => e.translation_key === "wlan_control" && e.entity_id.includes("guest"))?.entity_id ?? r.find((e) => e.translation_key === "wlan_control" && /gast|gaest|gäst/.test(e.entity_id))?.entity_id, a = i ? e.states[i] : void 0;
	if (!i || !a) return null;
	let o = e.entities[i]?.device_id, s = o ? Object.values(e.entities).filter((t) => t.device_id === o && e.states[t.entity_id]) : [], c = (e, t) => (s.find((t) => t.translation_key === e) ?? s.find((e) => e.entity_id.startsWith(`${t}.`)))?.entity_id, l = P(e, c("wlan_clients", "sensor"));
	return {
		entity: i,
		on: a.state === "on",
		clients: l === null ? void 0 : l,
		qr: c("qr_code", "image"),
		regenerate: c("regenerate_password", "button")
	};
}
function mo(e, t, n) {
	if (!Y(t)) return null;
	let r = t.entities?.backup_last ?? lo(e, "backup").find((e) => e.translation_key === "last_successful_automatic_backup")?.entity_id, i = r ? e.states[r] : void 0;
	if (!r || !i) return null;
	let a = Date.parse(i.state);
	if (Number.isNaN(a)) return null;
	let o = (n.getTime() - a) / 36e5;
	return {
		entity: r,
		at: a,
		ageH: o,
		stale: o > 36
	};
}
function ho(e, t) {
	let n = Y(t);
	return n ? !!n.printer || lo(e, "bambu_lab").some((e) => e.translation_key === "print_status") || !!uo(e, t) || !!po(e, t) || co(e, t, /* @__PURE__ */ new Date()).total > 0 : !1;
}
function go(e, t, n, r, i) {
	return co(e, t, n).down.length + +!!fo(e, t, n, i)?.problem + +!!r + +!!mo(e, t, n)?.stale;
}
var _o = [
	"print_status",
	"stage",
	"print_progress",
	"remaining_time",
	"end_time",
	"current_layer",
	"total_layers",
	"subtask_name",
	"print_weight",
	"speed_profile",
	"left_nozzle_temp",
	"right_nozzle_temp",
	"nozzle_temp",
	"bed_temp",
	"chamber_temp",
	"hms_errors",
	"print_error",
	"online",
	"door_open",
	"chamber_light",
	"cover_image"
];
function vo(e, t) {
	let n = Y(t);
	if (!n) return null;
	let r = Object.values(e.entities).filter((e) => e.platform === "bambu_lab"), i = n.printer ?? r.find((e) => e.translation_key === "print_status" && e.device_id)?.device_id ?? void 0;
	if (!i) return null;
	let a = r.filter((e) => e.device_id === i), o = {};
	for (let e of a) {
		let t = e.translation_key;
		t && _o.includes(t) && !o[t] && (o[t] = e.entity_id);
	}
	if (!o.print_status) return null;
	let s = r.find((e) => e.translation_key === "tray" && e.device_id)?.device_id ?? void 0, c = {};
	for (let e of a) {
		let t = e.translation_key ?? "";
		e.entity_id.startsWith("button.") ? /resume/.test(t) ? c.resume ??= e.entity_id : /pause/.test(t) ? c.pause ??= e.entity_id : /stop/.test(t) && (c.stop ??= e.entity_id) : e.entity_id.startsWith("camera.") && (c.camera ??= e.entity_id);
	}
	return {
		device: i,
		e: o,
		ams: s,
		plug: n.printer_plug,
		plugPower: n.printer_plug_power,
		plugEnergy: n.printer_plug_energy,
		controls: c
	};
}
var yo = /* @__PURE__ */ new Set([
	"running",
	"prepare",
	"init",
	"slicing",
	"pause"
]), bo = /* @__PURE__ */ new Set([
	"offline",
	"unavailable",
	"unknown"
]);
function xo(e, t) {
	let n = t ? e.states[t] : void 0;
	if (!n) return "";
	try {
		return e.formatEntityState?.(n) ?? n.state;
	} catch {
		return n.state;
	}
}
function So(e) {
	return !!e && e !== "unknown" && e !== "unavailable";
}
function Co(e, t) {
	let n = F(e, t.e.end_time);
	if (So(n) && Number.isFinite(Date.parse(n))) return {
		key: n,
		at: Date.parse(n)
	};
	let r = e.states[t.e.print_status]?.last_changed;
	return r ? {
		key: r,
		at: Date.parse(r)
	} : {};
}
function wo(e, t) {
	let n = (e.states[t.e.hms_errors ?? ""]?.attributes ?? {})["1-Error"];
	if (typeof n == "string" && n.trim()) return n.replace(/^[A-Z0-9_]+:\s*/, "").trim();
	let r = e.states[t.e.print_error ?? ""]?.attributes?.error;
	return typeof r == "string" && r.trim() ? r.trim() : "Fehler am Drucker";
}
function To(e, t, n, r) {
	let i = F(e, t.e.print_status), a = {
		paused: !1,
		failedOnly: !1
	}, o = t.plug ? F(e, t.plug) : void 0;
	if (o === "off") return {
		...a,
		kind: "off",
		status: "Aus"
	};
	if (!i || bo.has(i)) return o === "on" && vt(e, t.plug, n) < 5 ? {
		...a,
		kind: "starting",
		status: "startet …"
	} : {
		...a,
		kind: "disconnected",
		status: "nicht verbunden"
	};
	let s = Co(e, t), c = P(e, t.e.print_progress), l = {
		jobKey: s.key,
		progress: c === null ? void 0 : c / 100
	};
	if (F(e, t.e.hms_errors) === "on" || F(e, t.e.print_error) === "on") return {
		...a,
		...l,
		kind: "error",
		errorText: wo(e, t),
		status: "Fehler"
	};
	if (i === "failed") return s.at !== void 0 && n.getTime() - s.at < 432e5 && !r(`print-error:${s.key}`) ? {
		...a,
		...l,
		kind: "error",
		failedOnly: !0,
		errorText: wo(e, t),
		status: "Fehler"
	} : {
		...a,
		...l,
		kind: "idle",
		status: "Bereit"
	};
	if (yo.has(i)) {
		let n = i === "pause";
		return {
			...a,
			...l,
			kind: "printing",
			paused: n,
			status: `${n ? "Pausiert" : "Druckt"} · ${xo(e, t.e.stage)}`
		};
	}
	return i === "finish" ? {
		...a,
		...l,
		kind: "finished",
		status: "Fertig"
	} : {
		...a,
		...l,
		kind: "idle",
		status: "Bereit"
	};
}
function Eo(e, t) {
	let n = [
		t.e.left_nozzle_temp,
		t.e.right_nozzle_temp,
		t.e.nozzle_temp
	].map((t) => P(e, t)).filter((e) => e !== null);
	return n.length ? Math.max(...n) : null;
}
function Do(e, t, n) {
	return n.kind === "printing" || n.kind === "error" || (Eo(e, t) ?? 0) >= 50;
}
function Oo(e, t) {
	return t.ams ? Object.values(e.entities).filter((n) => n.device_id === t.ams && n.platform === "bambu_lab" && e.states[n.entity_id]) : [];
}
function ko(e, t) {
	let n = Oo(e, t).filter((e) => e.translation_key === "tray").map((t) => e.states[t.entity_id]);
	return n.sort((e, t) => (Number(e.attributes.slot) || 0) - (Number(t.attributes.slot) || 0) || e.entity_id.localeCompare(t.entity_id)), n.map((e) => {
		let t = e.attributes, n = t.empty === !0 || e.state === "Empty";
		return {
			color: typeof t.color == "string" && /^#[0-9a-f]{6}/i.test(t.color) && !n ? t.color.slice(0, 7) : void 0,
			type: n ? "" : String(t.type ?? ""),
			name: n ? "leer" : String(t.name ?? e.state),
			active: t.active === !0,
			empty: n,
			remain: !n && t.remain_enabled && Number.isFinite(Number(t.remain)) ? Number(t.remain) : void 0
		};
	});
}
function Ao(e, t) {
	let n = Oo(e, t), r = (e) => n.find((t) => t.translation_key === e)?.entity_id;
	if (F(e, r("drying")) === "on") {
		let t = P(e, r("remaining_drying_time"));
		return t === null ? "trocknet" : `trocknet · noch ${z(Math.round(t * 60))}`;
	}
	let i = P(e, r("humidity"));
	return i === null ? "" : `${I(Math.round(i))} % Feuchte`;
}
function jo(e) {
	let t = Math.max(0, Math.round(e * 60));
	return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")} h`;
}
function Mo(e) {
	if (!So(e)) return;
	let t = Date.parse(e);
	if (Number.isFinite(t)) return new Date(t).toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
// src/logic/technik-now.ts
var No = ["#bf9bff", "rgba(191,155,255,0.26)"], Po = ["#30d158", "rgba(48,209,88,0.24)"], Fo = ["#ff453a", "rgba(255,69,58,0.28)"];
function Io(e, t, n, r, i, a) {
	return {
		id: e,
		title: t,
		text: n,
		icon: r,
		color: i[0],
		tint: i[1],
		tap: a
	};
}
function Lo(e, t) {
	let n = new Date(e), r = n.toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	}), i = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(), a = Math.round((i(t) - i(n)) / 864e5);
	return a <= 0 ? r : a === 1 ? `gestern ${r}` : `${n.toLocaleDateString("de-DE", {
		day: "2-digit",
		month: "2-digit"
	})} ${r}`;
}
function Ro(e, t) {
	let n = new Date(e), r = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
	if (Math.round((r(t) - r(n)) / 864e5) <= 1) return Lo(e, t);
	let i = n.toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	});
	return `${n.getDate()}.${n.getMonth() + 1}. ${i}`;
}
function zo(e, t, n, r) {
	let i = vo(e, t);
	if (!i) return [];
	let a = To(e, i, n, r.dismissed), o = F(e, i.e.subtask_name), s = Bo(o) ? o : "3D-Druck", c = a.progress === void 0 ? "" : `${I(Math.round(a.progress * 100))} %`;
	if (a.kind === "printing") {
		let t = Mo(F(e, i.e.end_time)), n = P(e, i.e.remaining_time);
		return [{
			...Io("print", `3D-Druck${a.paused ? " pausiert" : ""}${c ? ` · ${c}` : ""}`, [s, t ? `fertig um ${t}` : ""].filter(Boolean).join(" · "), a.paused ? O.pause : O.printer, No, "printer"),
			progress: a.progress,
			value: n === null ? void 0 : jo(n)
		}];
	}
	if (a.kind === "error") {
		let e = Io("print-error", "3D-Druck angehalten", a.errorText ?? "Fehler am Drucker", O.alert, Fo, "printer");
		return a.failedOnly && a.jobKey && (e.dismiss = {
			label: "OK",
			key: `print-error:${a.jobKey}`
		}), [e];
	}
	if (a.kind === "finished") {
		let t = Co(e, i);
		if (t.at === void 0 || n.getTime() - t.at >= 432e5) return [];
		let a = `print-done:${t.key}`;
		if (r.dismissed(a)) return [];
		let o = P(e, i.e.bed_temp);
		return [{
			...Io("print-done", "3D-Druck fertig", `${s} · ${o !== null && o >= 35 ? `Bett ${I(Math.round(o))}°, noch abkühlen` : "kann entnommen werden"}`, O.check, Po, "printer"),
			dismiss: {
				label: "OK",
				key: a
			}
		}];
	}
	return [];
}
function Bo(e) {
	return !!e && e !== "unknown" && e !== "unavailable";
}
function Vo(e, t, n, r) {
	if (!ro(e, t)) return [];
	let i = zo(e, t, n, r), a = co(e, t, n).down;
	if (a.length === 1) {
		let e = a[0], t = e.members ? e.text : e.text.replace(/^down /, "");
		i.push(Io("services", `${e.name} nicht erreichbar`, t, O.server, Fo, "technik"));
	} else a.length > 1 && i.push(Io("services", `${a.length} Dienste nicht erreichbar`, a.map((e) => e.name).join(" · "), O.server, Fo, "technik"));
	let o = fo(e, t, n, r.pauseUntil);
	o?.problem && o.offSince !== void 0 && i.push({
		...Io("pihole", "Werbeblocker aus", `Pi-hole · seit ${Lo(o.offSince, n)}`, O.shieldOff, Fo, "technik"),
		action: {
			kind: "service",
			label: "Einschalten",
			domain: "switch",
			service: "turn_on",
			data: {},
			target: { entity_id: o.entity }
		}
	});
	let s = mo(e, t, n);
	return s?.stale && i.push(Io("backup", "Backup veraltet", `letztes erfolgreiches vor ${z(Math.round(s.ageH * 60))}`, O.alert, Fo, { moreInfo: s.entity })), i;
}
function Ho(e, t, n, r) {
	let i = vo(e, t);
	return go(e, t, n, !!i && To(e, i, n, r.dismissed).kind === "error", r.pauseUntil);
}
// src/pages/overview.ts
function Uo(e, t) {
	let { config: n } = e;
	switch (t.key) {
		case "robby": return {
			tap: () => e.openSheet({ id: "robby" }),
			hold: () => e.confirm({
				title: "Robby",
				text: "EG jetzt saugen?",
				confirm: "Starten",
				color: "#ffffff",
				iconPath: O.vacuum,
				onConfirm: () => e.call("button", "press", {}, { entity_id: N(n, "vacuum_quick") })
			})
		};
		case "light": return {
			tap: () => e.go("rooms", { roomsFilter: "on" }),
			hold: () => {
				let t = zn(e.hass);
				t.length && e.confirm({
					title: "Licht",
					text: `Alle ${t.length} Lichter ausschalten?`,
					confirm: "Alle aus",
					color: "#ffd60a",
					iconPath: O.bulb,
					onConfirm: () => e.call("light", "turn_off", {}, { entity_id: t })
				});
			}
		};
		case "energy": return { tap: () => e.go("energy") };
		case "alarm": return {
			tap: () => e.openSheet({ id: "alarm" }),
			hold: () => e.confirm({
				title: "Alarm",
				text: "Alarm scharf schalten (Abwesend)?",
				confirm: "Scharf",
				color: "#bf9bff",
				iconPath: O.shield,
				onConfirm: () => e.call("alarm_control_panel", "alarm_arm_away", {}, { entity_id: N(n, "alarm") })
			})
		};
	}
}
function Wo(e) {
	let t = (e, t, n, r = "") => C`<span class="room-air" style="color:${t}" title=${n} aria-label=${n}>${j(e, 13, t, 2.4)}${r}</span>`;
	switch (e.kind) {
		case "recommend": return t(O.wind, "#5ac8fa", "Lüften empfohlen");
		case "airing": return t(O.window, "#5ac8fa", "Lüftet", e.remaining > 0 ? U(e.remaining) : "");
		case "overdue": return t(O.window, "#ff6b61", `Fenster offen seit ${e.openMin} min`, e.openMin < 60 ? `${e.openMin}′` : pn(e.openMin));
		case "stuck": return t(O.window, "#aeb4c0", "Fenstersensor prüfen", "?");
		case "open": return t(O.window, "#aeb4c0", "Fenster offen");
		default: return E;
	}
}
function Go(e, t) {
	let n = t.tap;
	if (n) {
		if (typeof n == "object") return "room" in n ? () => e.openSheet({
			id: "room",
			slug: n.room
		}) : () => e.moreInfo(n.moreInfo);
		switch (n) {
			case "airing": return () => e.openSheet({ id: "airing" });
			case "weather": return () => e.openSheet({ id: "weather" });
			case "robby": return () => e.openSheet({ id: "robby" });
			case "alarm": return () => e.openSheet({ id: "alarm" });
			case "rooms": return () => e.go("rooms");
			case "care": return () => e.openSheet({ id: "care" });
			case "technik": return () => e.openSheet({ id: "technik" });
			case "printer": return () => e.openSheet({ id: "printer" });
		}
	}
}
function Ko(e, t, n = !0) {
	let r = Go(e, t), i = t.action;
	return C`
    <div class="now ${n ? "wide" : ""}" style="background: linear-gradient(90deg, ${t.tint}, rgba(255,255,255,0.05) ${n ? 75 : 100}%)">
      <button class="now-main" ?disabled=${!r} @click=${() => r?.()}>
        <span class="circle" style="width:34px;height:34px;background:${t.color}">${t.appliance ? Fa(t.appliance, !0, 16, "#101010") : j(t.icon, 16, "#101010")}</span>
        <span class="now-text">
          <span class="now-title ellipsis">${t.title}</span>
          <span class="now-sub ellipsis">${t.text}</span>
        </span>
        ${t.value ? C`<span class="now-value" style="color:${t.color}">${t.value}</span>` : E}
      </button>
      ${i ? C`<button class="now-action" style="background:${t.color}"
            @click=${() => e.call(i.domain, i.service, i.data, i.target)}>${i.label}</button>` : t.dismiss ? C`<button class="now-action" style="background:${t.color}" @click=${() => e.dismiss(t.dismiss.key)}>${t.dismiss.label}</button>` : E}
      ${t.progress === void 0 ? E : C`<span class="now-progress" style="width:calc((100% - 60px) * ${Math.max(0, Math.min(1, t.progress))});background:${t.color}"></span>`}
    </div>
  `;
}
function qo(e) {
	let { hass: t, config: n, now: r } = e, i = N(n, "weather"), a = Pn(t, i), o = Vn(t, n), s = [...Un(t, n, e.rooms, r, e.heating(), (t) => e.window(t), e.alarmoSensors?.() ?? [], e.applianceRuns?.() ?? {}), ...Vo(t, n, r, {
		dismissed: e.dismissed,
		pauseUntil: e.piholePause
	})], c = Zn(t, e.rooms, (t) => e.window(t)), l = ro(t, n) && ho(t, n), u = l && Ho(t, n, r, {
		dismissed: e.dismissed,
		pauseUntil: e.piholePause
	}) > 0;
	return C`
    <div class="overview">
      <header class="head">
        <div>
          <div class="date">${Mn(r)}</div>
          <h1>${jn(r)}</h1>
        </div>
        <span class="head-actions">
        ${l ? C`<button class="tech-btn" aria-label=${u ? "Technik öffnen, es gibt Meldungen" : "Technik öffnen"} @click=${() => e.openSheet({ id: "technik" })}>
              ${j(O.server, 20, "rgba(255,255,255,0.85)", 2)}${u ? C`<span class="tech-dot"></span>` : E}
            </button>` : E}
        <button class="weather" aria-label="Wetter öffnen" @click=${() => e.openSheet({ id: "weather" })}>
          <span class="circle" style="width:40px;height:40px;background:rgba(143,208,255,0.2)">${qa(t.states[i]?.state ?? "", 20, "#8fd0ff")}</span>
          <span>
            <span class="wp-temp">${a.temp}</span>
            <span class="wp-label">${a.label}</span>
          </span>
        </button>
        </span>
      </header>

      <div class="status">
        ${o.map((t) => C`
          <button class="bubble" aria-label="${t.label}: ${t.value}" ${Lr(Uo(e, t))}>
            <span class="circle ${t.wobble ? "wobble" : ""}" style="width:34px;height:34px;background:${t.color}">${j(t.icon, 17, "#111")}</span>
            <span class="b-value ellipsis">${t.value}</span>
            <span class="b-label ellipsis">${t.label}</span>
          </button>
        `)}
      </div>

      <section class="section" aria-labelledby="now-h">
        <div class="section-head">
          <h2 id="now-h">Aktuell</h2>
          <span class="rule" aria-hidden="true"></span>
          <span class="meta">${s.length || ""}</span>
        </div>
        ${s.length ? C`<div class="now-grid">${$n(s).map((t) => Ko(e, t.item, t.wide))}</div>` : C`
            <div class="now calm wide">
              <span class="circle" style="width:34px;height:34px;background:#30d158">${j(O.check, 16, "#101010", 2.4)}</span>
              <span class="now-text">
                <span class="now-title">Alles ruhig</span>
                <span class="now-sub">Gerade gibt es nichts zu tun</span>
              </span>
            </div>`}
      </section>

      <section class="section" aria-labelledby="rk-h">
        <div class="section-head">
          <h2 id="rk-h">Zusammenfassung</h2>
          <span class="rule" aria-hidden="true"></span>
          ${c.some((e) => e.aq) ? C`<span class="meta" style="font-size:11px">
                <span class="dot" style="background:#30d158"></span><span class="dot" style="background:#ffd60a"></span><span class="dot" style="background:#ff453a;margin-right:3px"></span>Luftqualität
              </span>` : E}
        </div>
        <div class="sum-grid">
          ${c.map((t) => {
		let n = fn(t.win, t.heating);
		return C`
              <button class="room ${n}" @click=${() => e.openSheet({
			id: "room",
			slug: t.room.slug
		})}
                aria-label="${t.room.name}: ${t.temp} Grad, ${t.hum} Prozent">
                <span class="circle room-circle">${j(t.icon, 16, n ? "#141008" : "#fff", 2)}</span>
                <span class="room-text">
                  <span class="room-name"><span class="ellipsis">${t.room.name}</span>${t.aq ? C`<span class="dot" style="background:${t.aq}"></span>` : E}</span>
                  <span class="room-sub">${t.hum} %${t.note ? ` · ${t.note}` : ""}${Wo(t.win)}</span>
                </span>
                <span class="room-temp">${t.temp}°</span>
              </button>
            `;
	})}
        </div>
      </section>
    </div>
  `;
}
var Jo = o`
  .overview {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px 0 6px;
  }
  .date {
    font-size: 14px;
    color: var(--sd-muted);
  }
  .head h1 {
    margin-top: 2px;
    font-size: 28px;
    font-weight: 700;
  }
  .head-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .tech-btn {
    position: relative;
    width: 52px;
    height: 52px;
    border-radius: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
  }
  .tech-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 11px;
    height: 11px;
    border-radius: 6px;
    background: #ff453a;
    box-shadow: 0 0 0 2.5px var(--sd-bg, #0e1016);
  }
  .weather {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 14px 0 6px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.08);
  }
  .wp-temp {
    display: block;
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
  }
  .wp-label {
    display: block;
    font-size: 11px;
    color: var(--sd-muted);
  }
  .status {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
  }
  .bubble {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 2px 8px;
    border-radius: 22px;
    background: var(--sd-fill);
    min-width: 0;
    touch-action: manipulation;
  }
  .bubble > span:not(.circle) {
    max-width: 100%;
  }
  .b-value {
    font-size: 13px;
    font-weight: 700;
  }
  .b-label {
    font-size: 11px;
    color: var(--sd-muted);
  }
  .now-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .now {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 50px;
    padding: 0 8px;
    border-radius: 25px;
    width: 100%;
    min-width: 0;
  }
  .now.wide {
    grid-column: 1 / -1;
  }
  .now {
    position: relative;
    overflow: hidden;
  }
  .now-value {
    flex-shrink: 0;
    font-size: 13px;
    font-weight: 700;
    margin-right: 8px;
    filter: brightness(1.25);
  }
  .now-progress {
    position: absolute;
    left: 42px;
    bottom: 0;
    height: 3px;
    border-radius: 2px;
  }
  .now-main {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
  }
  .now-main:disabled {
    cursor: default;
  }
  .now.calm {
    background: linear-gradient(90deg, rgba(48, 209, 88, 0.2), rgba(255, 255, 255, 0.05) 75%);
  }
  .now-text {
    flex: 1;
    min-width: 0;
  }
  .now-title {
    display: block;
    font-size: 13px;
    font-weight: 600;
  }
  /* Half-width tiles: smaller title so "Waschmaschine läuft" fits at 390 px. */
  .now:not(.wide) .now-title {
    font-size: 11px;
    letter-spacing: -0.1px;
  }
  .now-sub {
    display: block;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
  }
  .now-action {
    flex-shrink: 0;
    height: 32px;
    padding: 0 14px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    margin-right: 2px;
    color: #101010;
  }
  .sum-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .room {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 4px 0 5px;
    border-radius: 24px;
    background: var(--sd-fill);
    min-width: 0;
  }
  .room-circle {
    width: 36px;
    height: 36px;
    background: var(--sd-fill-2);
  }
  .room.heat {
    background: rgba(255, 159, 10, 0.12);
  }
  .room.heat .room-circle {
    background: #ff9f0a;
  }
  .room.vent {
    background: rgba(90, 200, 250, 0.14);
  }
  .room.vent .room-circle {
    background: #5ac8fa;
  }
  .room-text {
    flex: 1;
    min-width: 0;
  }
  .room-name {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600;
  }
  .room-air {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-left: 5px;
    vertical-align: -2px;
    font-weight: 700;
  }
  .room.alert {
    background: rgba(255, 69, 58, 0.14);
  }
  .room.alert .room-circle {
    background: #ff453a;
  }
  .room-sub {
    display: block;
    font-size: 11px;
    color: var(--sd-muted);
  }
  .room.heat .room-sub {
    color: #ffc061;
  }
  .room.vent .room-sub {
    color: #8fd8ff;
    font-weight: 600;
  }
  .room-temp {
    font-size: 15px;
    font-weight: 700;
    margin-right: 8px;
  }
`, Yo, Xo = class extends ze {
	constructor(...e) {
		super(...e), this.value = 0, this.min = 0, this.max = 100, this.step = 1, this.variant = "bubble", this.label = "", this.track = "rgba(255,255,255,0.08)", this.fill = "linear-gradient(90deg, rgba(255,214,10,0.35), #ffe37a)", this.format = (e) => String(e), this._local = null, this._localAt = 0, this._dragging = !1;
	}
	willUpdate(e) {
		e.has("value") && !this._dragging && this._local !== null && (this.value === this._local || Date.now() - this._localAt > 5e3) && (this._local = null);
	}
	get _shown() {
		return this._local ?? this.value;
	}
	_fromX(e) {
		let t = this.renderRoot.querySelector(".track").getBoundingClientRect(), n = Math.min(1, Math.max(0, (e - t.left) / t.width)), r = this.min + n * (this.max - this.min);
		return Math.min(this.max, Math.max(this.min, Math.round(r / this.step) * this.step));
	}
	_down(e) {
		this._dragging = !0, e.currentTarget.setPointerCapture(e.pointerId), this._set(this._fromX(e.clientX));
	}
	_move(e) {
		this._dragging && this._set(this._fromX(e.clientX));
	}
	_up() {
		this._dragging && (this._dragging = !1, this._commit());
	}
	_cancel() {
		this._dragging = !1, this._local = null;
	}
	_set(e) {
		this._local = e, this._localAt = Date.now();
	}
	_commit() {
		this._local !== null && this.dispatchEvent(new CustomEvent("slide-change", { detail: { value: this._local } }));
	}
	_key(e) {
		let t = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
		if (!t) return;
		e.preventDefault();
		let n = (this.max - this.min) / 20;
		this._set(Math.min(this.max, Math.max(this.min, this._shown + t * Math.max(this.step, Math.round(n / this.step) * this.step)))), this._commit();
	}
	render() {
		let e = this._shown, t = (e - this.min) / (this.max - this.min || 1);
		return C`
      <div class="head"><span class="lbl">${this.label}</span><span class="val">${this.format(e)}</span></div>
      <div class="track v-${this.variant}" role="slider" tabindex="0" aria-label=${this.label}
        aria-valuemin=${this.min} aria-valuemax=${this.max} aria-valuenow=${e} aria-valuetext=${this.format(e)}
        style="background:${this.track}"
        @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._up}
        @pointercancel=${this._cancel} @lostpointercapture=${this._up} @keydown=${this._key}>
        ${this.variant === "bubble" ? C`<span class="fill" style="width:max(64px, ${t * 100}%);background:${this.fill};opacity:${e <= this.min ? 0 : 1}"></span>
              <slot></slot>` : C`<span class="knob" style="left:calc(${t * 100}% - ${t * 44}px + 4px)"></span>`}
      </div>
    `;
	}
};
Yo = Xo, Yo.properties = {
	value: { type: Number },
	min: { type: Number },
	max: { type: Number },
	step: { type: Number },
	variant: { type: String },
	label: { type: String },
	track: { type: String },
	fill: { type: String },
	format: { attribute: !1 },
	_local: { state: !0 }
}, Yo.styles = o`
    :host {
      display: block;
      font-family: inherit;
      color: #fff;
    }
    .head {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 0 8px 6px;
    }
    .lbl {
      font-weight: 600;
    }
    .val {
      font-weight: 700;
    }
    .track {
      position: relative;
      overflow: hidden;
      touch-action: pan-y;
      cursor: pointer;
      outline: none;
    }
    .track:focus-visible {
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
    }
    .track.v-bubble {
      height: 64px;
      border-radius: 32px;
    }
    .track.v-knob {
      height: 44px;
      border-radius: 22px;
    }
    .fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border-radius: 32px;
      transition: width 0.08s linear;
    }
    ::slotted(*) {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
    }
    .knob {
      position: absolute;
      top: 4px;
      width: 36px;
      height: 36px;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      pointer-events: none;
    }
  `, customElements.get("start-dashboard-slider") || customElements.define("start-dashboard-slider", Xo);
// src/sheets/device.ts
var Zo = "#ffd60a", Qo = "#30d158", $o = "#5ac8fa", es = [
	[
		"Rot",
		"#ff453a",
		[3, 100]
	],
	[
		"Orange",
		"#ff9f0a",
		[35, 100]
	],
	[
		"Gelb",
		"#ffd60a",
		[50, 100]
	],
	[
		"Grün",
		"#30d158",
		[135, 90]
	],
	[
		"Türkis",
		"#64d2ff",
		[195, 80]
	],
	[
		"Blau",
		"#0a84ff",
		[215, 100]
	],
	[
		"Lila",
		"#bf5af2",
		[285, 80]
	]
];
function ts(e, t) {
	let n = e.hass.states[t]?.state;
	n && n !== "unavailable" && n !== "unknown" && (t.startsWith("light.") ? e.call("light", "toggle", {}, { entity_id: t }) : e.call("homeassistant", "toggle", {}, { entity_id: t }));
}
function ns(e, t) {
	let n = L(e.hass, t);
	return n ? e.rooms.find((e) => e.areas.includes(n)) : void 0;
}
function rs(e, t, n) {
	if (n) return n.name;
	let r = L(e.hass, t);
	return r ? e.hass.areas[r]?.name ?? r : "";
}
function is(e, t, n, r, i) {
	return C`<button class="tgl ${n ? "on" : ""}" aria-pressed=${n} aria-label="${i} ein/aus"
    style=${n ? `background:${r}` : ""} @click=${() => ts(e, t)}><span></span></button>`;
}
function as(e, t, n) {
	if (!e.hass.states[t]) return E;
	switch (ii(e.hass, t)) {
		case "light": return ss(e, t);
		case "purifier": return us(e, t);
		case "dehumidifier": return ds(e, t);
		default: return ls(e, t, n ?? {
			id: "device",
			entity: t
		});
	}
}
var os = "linear-gradient(90deg, rgba(255,214,10,0.35), #ffe37a)";
function ss(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = r.state === "on", o = ns(e, t), s = ni(n, t, o, e.config.names), c = di(i), l = a ? Math.max(1, Math.round(Number(i.brightness) / 255 * 100) || 100) : 0, u = a ? fi(i) : void 0, d = a ? wi(i) : null, f = d ? Ti(d) : {
		fill: os,
		icon: "#2b2200"
	}, p = c.colorTemp, m = Number(i.color_temp_kelvin), h = (n) => e.call("light", "turn_on", n, { entity_id: t });
	return M({
		title: s,
		subtitle: [rs(e, t, o), a ? u ?? "an" : r.state === "off" ? "aus" : "nicht erreichbar"].filter(Boolean).join(" · "),
		color: a ? Zo : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#2b2200" : "#fff",
		glow: a ? "rgba(255,240,200,0.18)" : "rgba(255,255,255,0.05)",
		iconPath: We(t, s),
		headerExtra: is(e, t, a, Zo, s),
		onClose: e.closeSheet,
		body: C`
      <start-dashboard-slider variant="bubble" label="Helligkeit" .min=${0} .max=${100} .step=${1} .value=${l}
        .fill=${f.fill} .format=${(e) => `${e} %`}
        @slide-change=${(n) => n.detail.value <= 0 ? e.call("light", "turn_off", {}, { entity_id: t }) : h({ brightness_pct: n.detail.value })}>
        ${j(A.brightness, 22, l > 8 ? f.icon : "#fff", 2.2)}
      </start-dashboard-slider>

      ${p ? C`<div>
            <start-dashboard-slider variant="knob" label="Farbtemperatur" .min=${p.min} .max=${p.max} .step=${50}
              .value=${Number.isFinite(m) ? m : Math.round((p.min + p.max) / 2)}
              .track=${"linear-gradient(90deg, #ffa94d, #fff1d6 50%, #d6ecff)"}
              .format=${(e) => `${I(e)} K`}
              @slide-change=${(e) => h({ color_temp_kelvin: e.detail.value })}></start-dashboard-slider>
            <div class="ends"><span>warm ${I(p.min)} K</span><span>kalt ${I(p.max)} K</span></div>
          </div>` : E}

      ${c.color ? C`<div>
            <div class="sublabel">Farbe</div>
            <div class="swatches">
              ${es.map(([e, t, n]) => C`<button class="swatch" aria-label=${e} style="background:${t}" @click=${() => h({ hs_color: n })}></button>`)}
            </div>
          </div>` : E}

      ${c.brightness ? C`<div class="grid3">
            ${pi(c).map((e) => C`<button class="dchip" @click=${() => h(e.data)}>${e.name}</button>`)}
          </div>` : E}
    `
	});
}
function cs(e, t, n) {
	let r = e.hass.states[t]?.state === "on", i = e.ui.timeInput === t, a = e.ui.offAt, o = (n) => {
		e.runScript(N(e.config, "delayed_off"), {
			entity: t,
			minutes: n
		}), e.setUi({
			offAt: {
				id: t,
				at: e.now.getTime() + n * 6e4
			},
			timeInput: void 0
		});
	}, s = a?.id === t && a.at > e.now.getTime() ? new Date(a.at) : void 0;
	return C`
    <div class="sublabel">Ausschalten in</div>
    <div class="grid4 ${r ? "" : "disabled"}">
      ${n.map(([e, t]) => C`<button class="dchip sm" ?disabled=${!r} @click=${() => o(t)}>${e}</button>`)}
      <button class="dchip sm ${i ? "sel" : ""}" ?disabled=${!r} aria-expanded=${i}
        @click=${() => e.setUi({ timeInput: i ? void 0 : t })}>Zeit…</button>
    </div>
    ${i && r ? C`<div class="timerow">
          <input type="time" class="time" aria-label="Ausschalten um" .value=${e.ui.timeValue ?? ""}
            @input=${(t) => e.setUi({ timeValue: t.target.value })} />
          <button class="dchip sm sel" ?disabled=${!e.ui.timeValue}
            @click=${() => e.ui.timeValue && o(Li(e.now, e.ui.timeValue))}>Starten</button>
        </div>` : E}
    ${s && r ? C`<div class="hint">${j(k.clock, 13, "rgba(255,255,255,0.6)", 2.2)}Schaltet um
          ${s.toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	})} Uhr aus</div>` : E}
  `;
}
function ls(e, t, n) {
	let { hass: r } = e, i = r.states[t], a = i.state === "on", o = ns(e, t), s = ni(r, t, o, e.config.names), c = t.startsWith("light.") ? Zo : Qo, l = ci(r, t), u = a ? "an" : i.state === "off" ? "aus" : "nicht erreichbar";
	return M({
		title: s,
		subtitle: [rs(e, t, o), u].filter(Boolean).join(" · "),
		color: a ? c : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#0b1a10" : "#fff",
		glow: a ? `${c}2e` : "rgba(255,255,255,0.05)",
		iconPath: We(t, s),
		headerExtra: is(e, t, a, c, s),
		onClose: e.closeSheet,
		body: C`
      ${l ? C`<button class="powerrow" aria-label="Leistung, Verlauf anzeigen"
            @click=${() => e.openSheet({
			id: "energyChart",
			key: l.id,
			range: "24h",
			name: s,
			back: n
		})}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffc061" aria-hidden="true"><path d=${O.bolt}></path></svg>
            <span class="grow">${l.value === null ? C`<span class="pr-lbl">Leistung nicht verfügbar</span>` : C`<span class="pr-val">${G(l.value)}</span><span class="pr-lbl">Leistung jetzt</span>`}</span>
            <span class="more">Verlauf ›</span>
          </button>` : E}
      ${cs(e, t, [
			["30 min", 30],
			["1 h", 60],
			["2 h", 120]
		])}
    `
	});
}
function us(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = ns(e, t), o = ni(n, t, a, e.config.names), s = mi(r.state, i), c = s.mode !== "off", l = i.preset_modes ?? [], u = 100 / s.levels, d = P(n, a?.pm25), f = {
		auto: "Auto",
		sleep: "Schlaf",
		manual: "Manuell",
		off: "aus"
	}[s.mode], p = [
		["auto", "Auto"],
		...l.includes("sleep") ? [["sleep", "Schlaf"]] : [],
		["manual", "Manuell"]
	], m = (n) => {
		n === "manual" ? e.call("fan", "set_percentage", { percentage: Math.round((s.level ?? 1) * u) }, { entity_id: t }) : e.call("fan", "set_preset_mode", { preset_mode: n }, { entity_id: t });
	};
	return M({
		title: o,
		subtitle: [rs(e, t, a), f].filter(Boolean).join(" · "),
		color: c ? Qo : "rgba(255,255,255,0.12)",
		iconStroke: c ? "#0b1a10" : "#fff",
		glow: c ? "rgba(48,209,88,0.16)" : "rgba(255,255,255,0.05)",
		iconPath: A.fan,
		headerExtra: C`
      ${d === null ? E : C`<span class="pmchip" style="background:${Xn(d)}2e;color:${Xn(d)}">
            <span class="dot" style="background:${Xn(d)}"></span>PM2.5 ${I(d)}</span>`}
      ${is(e, t, c, Qo, o)}`,
		onClose: e.closeSheet,
		body: C`
      <div class="grid3" role="radiogroup" aria-label="Modus">
        ${p.map(([e, t]) => {
			let n = s.mode === e;
			return C`<button class="dchip lg ${n ? "selg" : ""}" role="radio" aria-checked=${n} @click=${() => m(e)}>${t}</button>`;
		})}
      </div>
      <div class="levelrow">
        <span class="lvl">Stufe</span>
        <div class="levels ${s.mode === "manual" ? "" : "disabled"}" style="grid-template-columns: repeat(${s.levels}, minmax(0, 1fr))">
          ${Array.from({ length: s.levels }, (e, t) => t + 1).map((n) => C`
            <button class="dchip md ${s.mode === "manual" && s.level === n ? "selg" : ""}" ?disabled=${s.mode !== "manual"}
              aria-pressed=${s.level === n}
              @click=${() => e.call("fan", "set_percentage", { percentage: Math.round(n * u) }, { entity_id: t })}>${n}</button>`)}
        </div>
      </div>
      <div class="hint">Stufen nur im Modus „Manuell“ aktiv.</div>
    `
	});
}
function ds(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = r.state === "on", o = ns(e, t), s = ni(n, t, o, e.config.names), c = Number(i.min_humidity) || 35, l = Number(i.max_humidity) || 85, u = Number(i.target_humidity_step) || 5, d = e.pending(t, "humidity") ?? (Number(i.humidity) || c), f = Number(i.current_humidity), p = i.available_modes ?? Object.keys(hi), m = (n) => {
		let r = Math.min(l, Math.max(c, Math.round((d + n * u) / u) * u));
		e.setPending(t, "humidity", r, () => e.call("humidifier", "set_humidity", { humidity: r }, { entity_id: t }));
	};
	return M({
		title: s,
		subtitle: [
			rs(e, t, o),
			a ? "an" : "aus",
			Number.isFinite(f) ? `Gerät misst ${I(f)} %` : ""
		].filter(Boolean).join(" · "),
		color: a ? $o : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#06202c" : "#fff",
		glow: a ? "rgba(90,200,250,0.18)" : "rgba(255,255,255,0.05)",
		iconPath: A.drop,
		headerExtra: is(e, t, a, $o, s),
		onClose: e.closeSheet,
		body: C`
      <div class="humrow">
        <button class="hstep" aria-label="Zielfeuchte senken" ?disabled=${d <= c} @click=${() => m(-1)}>−</button>
        <span class="hval"><span class="big">${I(d)} %</span><span class="small">Zielfeuchte · ${c}–${l} %</span></span>
        <button class="hstep" aria-label="Zielfeuchte erhöhen" ?disabled=${d >= l} @click=${() => m(1)}>+</button>
      </div>
      <div class="modes" role="radiogroup" aria-label="Modus" style="grid-template-columns: repeat(${p.length}, minmax(0, 1fr))">
        ${p.map((n) => {
			let r = i.mode === n;
			return C`<button class="dchip sm ${r ? "selb" : ""}" role="radio" aria-checked=${r}
            @click=${() => e.call("humidifier", "set_mode", { mode: n }, { entity_id: t })}>${hi[n] ?? n}</button>`;
		})}
      </div>
      ${cs(e, t, [
			["1 h", 60],
			["2 h", 120],
			["4 h", 240]
		])}
    `
	});
}
var fs = o`
  .tgl {
    position: relative;
    flex-shrink: 0;
    width: 56px;
    height: 34px;
    border-radius: 17px;
    background: rgba(255, 255, 255, 0.18);
    transition: background 0.2s;
  }
  .tgl span {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 28px;
    height: 28px;
    border-radius: 14px;
    background: #fff;
    transition: left 0.2s;
  }
  .tgl.on span {
    left: 25px;
  }
  .ends {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    padding: 4px 8px 0;
  }
  .sublabel {
    font-size: 13px;
    font-weight: 600;
    padding: 2px 8px 0;
  }
  .swatches {
    display: flex;
    justify-content: space-between;
    padding: 6px 4px 0;
  }
  .swatch {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 2px solid rgba(255, 255, 255, 0.15);
  }
  .grid4 {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
  }
  .dchip {
    height: 44px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }
  .dchip.sm {
    height: 40px;
    border-radius: 20px;
  }
  .dchip.md {
    height: 36px;
    border-radius: 18px;
    font-weight: 700;
  }
  .dchip.lg {
    font-size: 13px;
    font-weight: 700;
  }
  .dchip.sel {
    background: rgba(255, 255, 255, 0.22);
  }
  .dchip.selg {
    background: rgba(48, 209, 88, 0.3);
    color: #d6f8e0;
  }
  .dchip.selb {
    background: rgba(90, 200, 250, 0.3);
    color: #dff2ff;
  }
  .dchip:disabled {
    cursor: default;
  }
  .disabled {
    opacity: 0.5;
  }
  .powerrow {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 52px;
    padding: 0 14px;
    border-radius: 26px;
    background: rgba(255, 159, 10, 0.12);
    font-size: 14px;
    font-weight: 600;
  }
  .pr-val {
    display: block;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.15;
  }
  .pr-lbl {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: var(--sd-muted);
  }
  .powerrow .more {
    font-size: 12px;
    font-weight: 400;
    color: var(--sd-muted);
  }
  .timerow {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 6px;
  }
  .timerow .dchip {
    padding: 0 18px;
  }
  .time {
    height: 40px;
    border-radius: 20px;
    border: none;
    padding: 0 14px;
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    font: 600 15px Rubik, system-ui, sans-serif;
    color-scheme: dark;
  }
  .hint {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
    padding: 0 8px;
  }
  .pmchip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    height: 30px;
    padding: 0 10px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 700;
  }
  .levelrow {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .lvl {
    width: 62px;
    font-size: 12px;
    font-weight: 600;
    padding-left: 8px;
    color: var(--sd-muted);
  }
  .levels {
    flex: 1;
    display: grid;
    gap: 4px;
  }
  .levels .dchip {
    background: rgba(255, 255, 255, 0.1);
  }
  .levels .dchip.selg {
    background: rgba(48, 209, 88, 0.3);
  }
  .humrow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 8px;
    border-radius: 32px;
    background: rgba(90, 200, 250, 0.1);
  }
  .hstep {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.12);
    font-size: 24px;
    text-align: center;
  }
  .hstep:disabled {
    opacity: 0.4;
  }
  .hval {
    text-align: center;
  }
  .hval .big {
    display: block;
    font-size: 26px;
    font-weight: 700;
    line-height: 1;
  }
  .hval .small {
    display: block;
    font-size: 11px;
    color: var(--sd-muted);
  }
  .modes {
    display: grid;
    gap: 4px;
  }
  .modes .dchip {
    font-size: 11px;
    font-weight: 700;
  }
`, ps = (e, t) => `width:${t}px;height:${t}px;background:${e}`;
function ms(e) {
	let { hass: t } = e, n = ki(t, e.config, e.rooms), r = Fi(t, n), i = r.some((t) => t.id === e.roomsFilter) ? e.roomsFilter : "all", a = Ii(n, i), o = n.flatMap((e) => e.devices.filter((e) => e.on && e.kind === "light").map((e) => e.id));
	return C`
    <div class="rooms">
      <header class="rhead">
        <div>
          <div class="date">${Pi(n)}</div>
          <h1>Räume</h1>
        </div>
        <button class="lightsoff" ?disabled=${!o.length}
          @click=${() => e.call("light", "turn_off", {}, { entity_id: o })}>
          ${j(k.power, 16, "#fff", 2.4)}Licht aus
        </button>
      </header>

      <div class="rfilter" role="tablist" aria-label="Filter" style="grid-template-columns: repeat(${r.length}, minmax(0, 1fr))">
        ${r.map((t) => C`<button role="tab" aria-selected=${t.id === i} class=${t.id === i ? "sel" : ""}
          @click=${() => e.setRoomsFilter(t.id)}>${t.label}</button>`)}
      </div>

      ${a.length ? a.map((t) => hs(e, t, i === "on")) : C`<div class="rempty">Gerade ist nichts an.</div>`}
    </div>
  `;
}
function hs(e, t, n = !1) {
	let r = bi(e.hass, t.scenes.map((e) => e.id), e.sceneConfigs(), e.now), { hass: i } = e, { room: a } = t, o = P(i, a.temperature), s = P(i, a.humidity), c = !!a.climate;
	return C`
    <article class="rcard ${t.active ? "active" : ""} ${n ? "compact" : ""}">
      <div class="rtop">
        <span class="circle" style=${ps(t.active ? "#ffd60a" : "rgba(255,255,255,0.12)", n ? 32 : 40)}>
          ${j(Ve(a.name, a.icon), 18, t.active ? "#2b2200" : "#fff", 2)}
        </span>
        <span class="rname">
          <h2 class="ellipsis">${a.name}</h2>
          <span class="rsub ellipsis">${t.sub}</span>
        </span>
        ${o !== null || t.power !== null ? C`<button class="rpill" ?disabled=${!c} aria-label="${a.name}: Raumkarte öffnen"
              @click=${() => c && e.openSheet({
		id: "room",
		slug: a.slug
	})}>
              ${o === null ? E : C`<span>${H(o)}°</span>`}
              ${s === null ? E : C`<span class="muted">${Math.round(s)} %</span>`}
              ${t.power === null ? E : C`<span class="pw"><svg width="11" height="11" viewBox="0 0 24 24" fill="#ffc061" aria-hidden="true"><path d=${O.bolt}></path></svg>${G(t.power)}</span>`}
            </button>` : E}
        ${n ? t.scenes.map((t) => C`<button class="roff" aria-label="${a.name}: alles aus" title="Alles aus"
              @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>${j(k.power, 15, "#fff", 2.3)}</button>`) : E}
      </div>

      ${n ? C`<div class="rgrid">${t.devices.map((t) => _s(e, t))}</div>` : C`${t.scenes.length ? C`<div class="rgrid" role="group" aria-label="Szenen ${a.name}">
                ${t.scenes.map((t, n) => gs(e, t, n, r))}
              </div>` : E}
          ${t.devices.length ? C`<div class="rgrid">${t.devices.map((t) => _s(e, t))}</div>` : E}`}
    </article>
  `;
}
function gs(e, t, n, r) {
	let i = t.off ? "rgba(255,255,255,0.14)" : ct[n % ct.length], a = t.off ? "#fff" : "#101010", o = r.has(t.id);
	return C`<button class="rscene" aria-pressed=${o} style=${o ? `background:${t.off ? "rgba(255,255,255,0.2)" : i + "33"};box-shadow:0 0 18px ${t.off ? "rgba(255,255,255,0.08)" : i + "40"}` : ""}
    @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>
    <span class="circle" style=${ps(i, 34)}>${t.off ? j(k.power, 16, a, 2.1) : lt(t.icon, k.scene, a)}</span>
    <span class="ellipsis">${t.off ? "Aus" : t.name}</span>
  </button>`;
}
function _s(e, t) {
	let n = t.kind === "light" ? Ei(e.hass.states[t.id]?.attributes ?? {}) : null, r = n ? n.color : "#30d158", i = n ? n.bg : "rgba(48,209,88,0.14)", a = t.on ? n ? n.icon : "#151005" : t.unavailable ? "rgba(255,255,255,0.45)" : "#fff";
	return C`<button class="rdev ${t.on ? "on" : ""} ${t.unavailable ? "na" : ""}" style=${t.on ? `background:${i}` : ""}
    aria-label="${t.name}: ${t.tileState}"
    ${Lr({
		tap: () => ts(e, t.id),
		hold: () => e.openSheet({
			id: "device",
			entity: t.id
		})
	})}>
    <span class="circle" style=${ps(t.on ? r : "rgba(255,255,255,0.1)", 32)}>${La(t, e.hass.states[t.id]?.attributes, 15, a, 2.2)}</span>
    <span class="rdtext">
      <span class="ellipsis rdname">${t.name}</span>
      <span class="rdstate" style="color:${t.on ? n ? n.text : "#9af0b5" : "rgba(255,255,255,0.55)"}">${t.tileState}</span>
    </span>
  </button>`;
}
var vs = o`
  .rooms {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .rhead {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 6px 4px;
  }
  .rhead h1 {
    margin-top: 2px;
    font-size: 30px;
    font-weight: 700;
  }
  .lightsoff {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 44px;
    padding: 0 16px 0 12px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 13px;
    font-weight: 700;
  }
  .lightsoff:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .rfilter {
    display: grid;
    gap: 4px;
    padding: 4px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.06);
  }
  .rfilter button {
    height: 36px;
    border-radius: 18px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .rfilter button.sel {
    background: #fff;
    color: #101218;
  }
  .rempty {
    padding: 18px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.05);
    font-size: 14px;
    color: var(--sd-muted);
    text-align: center;
  }
  .rcard {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.05);
  }
  .rcard.active {
    background: linear-gradient(160deg, rgba(255, 214, 10, 0.14), rgba(255, 255, 255, 0.05) 50%);
  }
  .rcard.compact {
    gap: 8px;
    padding: 8px;
    border-radius: 24px;
  }
  .rcard.compact .rsub {
    display: none;
  }
  .rcard.compact .rdev,
  .rcard.compact .rscene {
    height: 44px;
    border-radius: 22px;
  }
  .roff {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rtop {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .rname {
    flex: 1;
    min-width: 0;
  }
  .rname h2 {
    font-size: 15px;
    font-weight: 600;
  }
  .rsub {
    display: block;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.68);
  }
  .rpill {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 30px;
    padding: 0 10px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.09);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }
  .rpill:disabled {
    cursor: default;
  }
  .rpill .muted {
    color: rgba(255, 255, 255, 0.75);
  }
  .rpill .pw {
    display: flex;
    align-items: center;
    gap: 2px;
    color: #ffc061;
  }
  .rgrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .rscene {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    padding: 0 8px 0 5px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 600;
    min-width: 0;
  }
  .rdev {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 8px 0 6px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.06);
    min-width: 0;
    touch-action: manipulation;
    -webkit-touch-callout: none;
  }
  .rdev.na {
    background: transparent;
    border: 1px dashed rgba(255, 255, 255, 0.22);
  }
  .rdtext {
    min-width: 0;
    text-align: left;
  }
  .rdname {
    display: block;
    font-size: 12px;
    font-weight: 600;
  }
  .rdstate {
    display: block;
    font-size: 11px;
  }
`, ys = {
	pylon: "M12 2 6 22M12 2l6 20M8 9h8M7 14h10",
	server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
	question: "M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.5V14M12 18h.01",
	battery: "M3 8h15a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM21 11v2"
}, X = 5, bs = (e) => `${I(e, 1)} kWh`, xs = (e) => `${I(e, 2)} €`;
function Ss(e) {
	return e.untracked ? ys.question : /netzwerk|nas|server|router|switch|rack/i.test(e.name) ? ys.server : We(e.id, e.name);
}
function Cs(e, t) {
	return t ? C`<div class="vline live ${t}" style="--c:${e}" aria-hidden="true"><span class="arrow"></span></div>` : C`<div class="vline idle" style="border-color:${e}4d" aria-hidden="true"></div>`;
}
function ws(e, t) {
	return t ? C`<div class="fline live ${t}" style="--c:${e}" aria-hidden="true"><span class="arrow"></span></div>` : C`<div class="fline idle" style="border-color:${e}4d" aria-hidden="true"></div>`;
}
var Ts = 6;
function Es(e) {
	let { hass: t, config: n } = e, r = e.energy(), i = Wi(t, n, r.prefs), a = Yi(t, n, r.today), o = r.prefs ? Hi(Vi(r.prefs), a, r.today?.cost === void 0 ? void 0 : {
		cost: r.today.cost,
		compensation: r.today.compensation ?? 0
	}) : null, s = Qi(t, n, 100, r.prefs), c = e.consumersAll ? s : s.slice(0, Ts), l = (t, n) => e.openSheet({
		id: "energyChart",
		key: t,
		range: "24h",
		name: n
	}), u = Math.max(1, ...c.map((e) => e.value)), d = i.export > i.import, f = d ? i.export : i.import, p = d ? "#64d2ff" : "#ff9f0a", m = i.battery;
	return C`
    <div class="energy">
      <header class="ehead">
        <div class="date">${Ki(e.now, i)}</div>
        <h1>Energie</h1>
      </header>

      <div class="flow">
        <div class="frow">
          <button class="node" aria-label="PV ${G(i.pv)}, Verlauf anzeigen" @click=${() => l("pv")}>
            <span class="circle" style="width:48px;height:48px;background:rgba(255,214,10,${i.pv > X ? .32 : .18})">${j(O.sun, 22, "#ffd60a", 2)}</span>
            <span class="nv">${G(i.pv)}</span><span class="nl">PV</span>
          </button>
          ${ws("#ffd60a", i.pv > X ? "right" : null)}
          <button class="node" aria-label="Haus ${G(i.house)}, Verbrauch anzeigen" @click=${() => l("house")}>
            <span class="house">${j(O.home, 22, "#101218", 2.2)}<span>${G(i.house)}</span></span>
            <span class="nl">Haus</span>
          </button>
          ${ws(p, f > X ? d ? "right" : "left" : null)}
          <button class="node" aria-label="Netz ${G(f)}, Verlauf anzeigen" @click=${() => l(d ? "export" : "import")}>
            <span class="circle" style="width:48px;height:48px;background:${f > X ? p : "rgba(255,255,255,0.12)"}">${j(ys.pylon, 22, f > X ? "#1a1206" : "#fff", 2.2)}</span>
            <span class="nv">${G(f)}</span><span class="nl">${d ? "Einspeisung" : "Bezug"}</span>
          </button>
        </div>
        ${m ? C`<button class="bnode" aria-label="Akku, geladene und entladene Energie anzeigen" @click=${() => e.openSheet({
		id: "energyChart",
		key: "battery",
		range: "7d"
	})}>
              ${Cs("#30d158", m.power > X ? "up" : m.power < -5 ? "down" : null)}
              <span class="bring" style="--soc:${Math.max(0, Math.min(100, m.soc ?? 0))}%" role="img"
                aria-label="Akku${m.soc === null ? "" : ` ${I(m.soc)} %`}">
                <span class="circle" style="width:44px;height:44px;background:${Math.abs(m.power) > X ? "#30d158" : "#1d2a22"}">${j(ys.battery, 20, Math.abs(m.power) > X ? "#0b1a10" : "#7ee8a0", 2.2)}</span>
              </span>
              <span class="nv">${Math.abs(m.power) > X ? G(Math.abs(m.power)) : "0 W"}</span>
              <span class="nl">${m.power > X ? "Akku liefert" : m.power < -5 ? "Akku lädt" : "Akku"}${m.soc === null ? "" : ` · ${I(m.soc)} %`}${Math.abs(m.power) <= X && na(m, e.config.battery) ? ` · ${na(m, e.config.battery)}` : ""}</span>
            </button>` : E}
        <button class="elink" @click=${() => e.navigate("/energy")}>Energie-Dashboard ›</button>
      </div>

      <div class="section-head">
        <h2>Heute</h2><span class="rule" aria-hidden="true"></span>
        <span class="meta">ca. ${bs(a.consumed)} verbraucht</span>
      </div>
      <div class="tiles">
        ${[
		{
			k: "pv",
			v: a.pv,
			l: "PV erzeugt",
			c: "#ffd60a"
		},
		{
			k: "import",
			v: a.import,
			l: "Netzbezug",
			c: "#ff9f0a"
		},
		{
			k: "export",
			v: a.export,
			l: "Eingespeist",
			c: "#64d2ff"
		}
	].map((e) => C`<button class="tile" aria-label="${e.l} ${bs(e.v)}, Verlauf anzeigen" @click=${() => l(e.k)}>
          <span class="tdot" style="background:${e.c}"></span><span class="tv">${bs(e.v)}</span><span class="tl">${e.l}</span></button>`)}
      </div>
      ${o ? C`<div class="tiles">
            ${[
		{
			v: o.cost,
			l: "Stromkosten",
			c: "#ff9f0a"
		},
		{
			v: o.compensation,
			l: "Vergütung",
			c: "#64d2ff"
		},
		...o.saved === null ? [] : [{
			v: o.saved,
			l: "Gespart (PV & Akku)",
			c: "#7ee8a0"
		}]
	].map((e) => C`<button class="tile" aria-label="${e.l} ${xs(e.v)}, Verlauf anzeigen" @click=${() => l("cost")}>
              <span class="tdot" style="background:${e.c}"></span><span class="tv">${xs(e.v)}</span><span class="tl">${e.l}</span></button>`)}
          </div>` : E}

      ${a.consumed > 0 ? C`<div class="split">
            ${Ds("Woher kam der Strom?", a.autarky === null ? "" : `${a.autarky} % autark`, "#7ee8a0", [
		a.local,
		"#ffd60a",
		`PV & Akku ${bs(a.local)}`
	], [
		a.import,
		"#ff9f0a",
		`Netz ${bs(a.import)}`
	], () => l("autarky"))}
            ${a.pv > 0 ? Ds("Wohin ging der Solarstrom?", `${a.selfUse} % selbst genutzt`, "#ffe066", [
		Math.max(0, a.pv - a.export),
		"#ffd60a",
		`Haus ${bs(Math.max(0, a.pv - a.export))}`
	], [
		a.export,
		"#64d2ff",
		`Eingespeist ${bs(a.export)}`
	], () => l("selfuse")) : C`<div class="nopv">Heute noch kein Solarstrom.</div>`}
          </div>` : E}

      <div class="section-head"><h2>Aktuell</h2><span class="rule" aria-hidden="true"></span></div>
      ${c.length ? c.map((e) => C`
            <button class="cons" aria-label="${e.name} ${G(e.value)}, Verlauf anzeigen" @click=${() => l(e.id, e.name)}>
              <span class="cbar" style="width:${Math.round(e.value / u * 100)}%" aria-hidden="true"></span>
              <span class="circle" style="width:36px;height:36px;background:rgba(255,255,255,0.12)">${j(Ss(e), 16, "#fff", 2)}</span>
              <span class="cname ellipsis">${e.name}</span>
              <span class="cval">${G(e.value)}</span>
            </button>`) : C`<div class="nopv">Keine Messwerte.</div>`}
      ${s.length > Ts ? C`<button class="cmore" @click=${() => e.setConsumersAll(!e.consumersAll)}>
            ${e.consumersAll ? "Weniger anzeigen" : `Alle anzeigen (${s.length})`}</button>` : E}
    </div>
  `;
}
function Ds(e, t, n, r, i, a) {
	let o = r[0] + i[0] || 1, s = Math.round(r[0] / o * 100);
	return C`<button class="sbtn" aria-label="${e} ${t}, Verlauf anzeigen" @click=${a}>
    <div class="shead"><span>${e}</span><span style="color:${n}">${t}</span></div>
    <div class="sbar" role="img" aria-label="${r[2]}, ${i[2]}"><span style="width:${s}%;background:${r[1]}"></span><span style="width:${100 - s}%;background:${i[1]}"></span></div>
    <div class="slegend"><span>${r[2]}</span><span>${i[2]}</span></div>
  </button>`;
}
var Os = o`
  .energy {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ehead {
    padding: 0 6px 4px;
  }
  .ehead h1 {
    margin-top: 2px;
    font-size: 30px;
    font-weight: 700;
  }
  .flow {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 12px 12px;
    border-radius: 34px;
    background: rgba(255, 255, 255, 0.06);
  }
  .frow {
    display: grid;
    grid-template-columns: 70px minmax(0, 1fr) 86px minmax(0, 1fr) 70px;
    align-items: center;
  }
  .node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .nv {
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }
  .nl {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
  }
  .house {
    width: 78px;
    height: 78px;
    border-radius: 39px;
    background: #fff;
    color: #101218;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 700;
  }
  .fline {
    position: relative;
    margin: 0 4px 34px;
  }
  .fline.idle {
    height: 0;
    border-top: 3px dotted;
  }
  .fline.live {
    height: 4px;
    border-radius: 2px;
    background: repeating-linear-gradient(90deg, var(--c) 0 10px, transparent 10px 16px);
    animation: flow-right 0.8s linear infinite;
  }
  .fline.live.left {
    animation-name: flow-left;
  }
  .fline .arrow {
    position: absolute;
    top: -6px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }
  .fline.right .arrow {
    right: -2px;
    border-left: 10px solid var(--c);
  }
  .fline.left .arrow {
    left: -2px;
    border-right: 10px solid var(--c);
  }
  @keyframes flow-right {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 16px 0;
    }
  }
  @keyframes flow-left {
    from {
      background-position: 16px 0;
    }
    to {
      background-position: 0 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .fline.live {
      animation: none;
    }
  }
  .bnode {
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-top: -6px;
  }
  .bring {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    border-radius: 27px;
    background: conic-gradient(#30d158 var(--soc), rgba(255, 255, 255, 0.12) 0);
  }
  .vline {
    position: relative;
    width: 4px;
    height: 26px;
    margin-bottom: 4px;
  }
  .vline.idle {
    width: 0;
    border-left: 3px dotted;
  }
  .vline.live {
    border-radius: 2px;
    background: repeating-linear-gradient(180deg, var(--c) 0 8px, transparent 8px 13px);
    animation: flow-down 0.8s linear infinite;
  }
  .vline.live.up {
    animation-name: flow-up;
  }
  .vline .arrow {
    position: absolute;
    left: -6px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
  }
  .vline.up .arrow {
    top: -6px;
    border-bottom: 10px solid var(--c);
  }
  .vline.down .arrow {
    bottom: -6px;
    border-top: 10px solid var(--c);
  }
  @keyframes flow-down {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 0 13px;
    }
  }
  @keyframes flow-up {
    from {
      background-position: 0 13px;
    }
    to {
      background-position: 0 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .vline.live {
      animation: none;
    }
  }
  .cmore {
    align-self: center;
    height: 36px;
    padding: 0 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 13px;
    font-weight: 600;
  }
  .elink {
    align-self: flex-end;
    height: 32px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    padding-right: 6px;
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .tile {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.07);
  }
  .tdot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    margin-bottom: 4px;
  }
  .tv {
    font-size: 18px;
    font-weight: 700;
    white-space: nowrap;
  }
  .tl {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.72);
  }
  .split {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.06);
  }
  .sbtn {
    display: block;
    width: 100%;
    text-align: left;
  }
  .shead {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .sbar {
    display: flex;
    height: 14px;
    border-radius: 7px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.08);
  }
  .slegend {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.72);
    margin-top: 4px;
  }
  .nopv {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    padding: 0 4px;
  }
  .cons {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 14px 0 6px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.07);
    overflow: hidden;
  }
  .cbar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: rgba(255, 159, 10, 0.18);
    border-radius: 24px;
  }
  .cons .circle,
  .cname,
  .cval {
    position: relative;
  }
  .cname {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
  }
  .cval {
    font-size: 14px;
    font-weight: 700;
  }
`, ks = {
	home: "#30d158",
	zone: "#64d2ff",
	away: "#8e8e93",
	unknown: "#8e8e93"
}, As = "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", js = "M5 12h14M13 6l6 6-6 6";
function Ms(e, t = 40) {
	return C`<span class="pp-av ${e.place === "away" || e.place === "unknown" ? "out" : ""}" style="width:${t}px;height:${t}px" title="${e.name}: ${e.zoneName}">
    ${e.picture ? C`<img src=${e.picture} alt="" />` : C`<span class="pp-ini">${e.initials}</span>`}
    <span class="pp-zone" style="background:${ks[e.place]}">
      ${e.place === "away" ? j(js, 10, "#111", 2.6) : e.place === "unknown" ? j(As, 10, "#111", 2.4) : lt(e.zoneIcon, e.place === "home" ? O.home : As, "#111", 12)}
    </span>
  </span>`;
}
// src/logic/security.ts
var Ns = [
	{
		name: "Abwesend",
		icon: "car",
		service: "alarm_arm_away",
		state: "armed_away"
	},
	{
		name: "Zuhause",
		icon: "home",
		service: "alarm_arm_home",
		state: "armed_home"
	},
	{
		name: "Nacht",
		icon: "moon",
		service: "alarm_arm_night",
		state: "armed_night"
	},
	{
		name: "Aus",
		icon: "power",
		service: "alarm_disarm",
		state: "disarmed"
	}
];
function Ps(e) {
	return e === "disarmed" ? "Alarm unscharf" : e === "triggered" ? "Alarm ausgelöst!" : `Alarm: ${Ln[e] ?? e}`;
}
function Fs(e, t, n) {
	let r = N(t, "alarm"), i = e.states[r], a = i?.state ?? "unavailable", o = "", s = i?.attributes.last_triggered, c = s ? new Date(String(s).replace(" ", "T")) : void 0;
	if (c && !Number.isNaN(c.getTime())) o = `zuletzt ausgelöst ${c.toLocaleDateString("de-DE", {
		day: "numeric",
		month: "short"
	})}`;
	else if (i?.last_changed) {
		let e = new Date(i.last_changed);
		o = `seit ${e.toDateString() === n.toDateString() ? e.toLocaleTimeString("de-DE", {
			hour: "2-digit",
			minute: "2-digit"
		}) : e.toLocaleDateString("de-DE", {
			day: "numeric",
			month: "short"
		})}`;
	}
	return {
		id: r,
		state: a,
		label: Ps(a),
		sub: o
	};
}
var Is = [
	"window",
	"door",
	"opening",
	"garage_door"
], Ls = ["versatile_thermostat", "bambu_lab"], Rs = /^((fenster|tür|tur)sensor(en)?|sensor|contact|kontakt|fensterstatus|status)$/i;
function zs(e) {
	return e.toLowerCase().split(/[\s&,._\-]+/).filter(Boolean);
}
function Bs(e) {
	return e.charAt(0).toUpperCase() + e.slice(1);
}
function Vs(e, t, n, r) {
	let i = e.states[t]?.attributes.friendly_name ?? t.split(".")[1].split("_").map(Bs).join(" "), a = e.areas[n], o = /* @__PURE__ */ new Set([...zs(a?.name ?? ""), ...zs(n)]), s = (e) => {
		let t = zs(e);
		return t.length > 0 && t.every((e) => o.has(e));
	}, c = i.split(/\s+/).filter((e) => e && !Rs.test(e) && !s(e)).join(" ").trim();
	return !c || /^(fenster|tür|tur)$/i.test(c) ? r === "door" ? "Tür" : "Fenster" : c;
}
function Hs(e, t, n) {
	let r = /* @__PURE__ */ new Set([...Ls, ...t.exclude?.openings ?? []]), i = /* @__PURE__ */ new Map();
	for (let [t, n] of Object.entries(e.states)) {
		if (!t.startsWith("binary_sensor.") || !Is.includes(n.attributes.device_class) || Array.isArray(n.attributes.entity_id)) continue;
		let a = e.entities[t];
		if (r.has(t) || a?.platform && r.has(a.platform)) continue;
		let o = L(e, t);
		if (!o || !e.areas[o]) continue;
		let s = String(n.attributes.friendly_name ?? t), c = /t[üu]r|door|tor\b/i.test(s) || n.attributes.device_class === "garage_door" ? "door" : "window", l = n.state === "unavailable" || n.state === "unknown";
		i.has(o) || i.set(o, []), i.get(o).push({
			id: t,
			title: Vs(e, t, o, c),
			kind: c,
			open: n.state === "on",
			unavailable: l
		});
	}
	let a = n.flatMap((e) => e.areas), o = (e) => {
		let t = a.indexOf(e);
		return t < 0 ? a.length : t;
	}, s = /* @__PURE__ */ new Map();
	for (let t of [...i.keys()].sort((e, t) => o(e) - o(t))) {
		let r = e.areas[t]?.floor_id ?? "";
		s.has(r) || s.set(r, []);
		let a = n.find((e) => e.areas.length === 1 && e.areas[0] === t);
		s.get(r).push({
			id: t,
			name: a?.name ?? e.areas[t].name,
			items: i.get(t)
		});
	}
	let c = (t) => t ? e.floors?.[t]?.level ?? 50 : 99;
	return [...s.entries()].sort(([e], [t]) => c(e) - c(t)).map(([t, n]) => {
		let r = t ? e.floors?.[t]?.name ?? t.toUpperCase() : "Weitere";
		return {
			id: t,
			name: ir[r] ?? r,
			areas: n
		};
	});
}
function Us(e, t) {
	let n = e.flatMap((e) => e.areas.flatMap((e) => e.items)), r = n.filter((e) => e.open).length, i = `${n.length - r} von ${n.length} zu`;
	return t === "triggered" ? `Alarm ausgelöst! · ${i}` : r ? `${r} offen · ${i}` : `Alles ruhig · ${i}`;
}
// src/logic/persons.ts
function Ws(e, t) {
	let n = t.attributes.in_zones?.map((t) => e.states[t]).find(Boolean);
	if (n) return n;
	let r = t.state.trim();
	return Object.values(e.states).find((e) => e.entity_id.startsWith("zone.") && String(e.attributes.friendly_name ?? "").trim() === r);
}
function Gs(e, t) {
	return (t.persons ?? Object.keys(e.states).filter((t) => t.startsWith("person.") && (e.states[t].attributes.device_trackers?.length ?? 0) > 0).sort((t, n) => String(e.states[t].attributes.friendly_name ?? t).localeCompare(String(e.states[n].attributes.friendly_name ?? n), "de"))).flatMap((n) => {
		let r = e.states[n];
		if (!r) return [];
		let i = String(t.names?.[n] ?? r.attributes.friendly_name ?? n.split(".")[1]).trim().split(/\s+/), a = i.map((e) => e[0]).slice(0, 2).join("").toUpperCase(), o = {
			id: n,
			name: i[0],
			initials: a,
			picture: r.attributes.entity_picture
		};
		if (r.state === "home") return [{
			...o,
			place: "home",
			zoneName: "Zu Hause",
			zoneIcon: String(e.states["zone.home"]?.attributes.icon ?? "mdi:home")
		}];
		if (r.state === "not_home") return [{
			...o,
			place: "away",
			zoneName: "Unterwegs"
		}];
		if (r.state === "unknown" || r.state === "unavailable") return [{
			...o,
			place: "unknown",
			zoneName: "Unbekannt"
		}];
		let s = Ws(e, r);
		return [{
			...o,
			place: "zone",
			zoneName: String(s?.attributes.friendly_name ?? r.state).trim(),
			zoneIcon: s?.attributes.icon
		}];
	});
}
function Ks(e) {
	let t = e.filter((e) => e.place === "home").length;
	return t === e.length ? "Alle da" : t === 0 ? "Niemand da" : `${t} von ${e.length} da`;
}
function qs(e, t) {
	let n = new Date(e), r = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`, i = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(), a = Math.round((i(t) - i(n)) / 864e5);
	return a <= 0 ? `seit ${r}` : a < 7 ? `seit ${n.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")} ${r}` : `seit ${n.getDate()}.${n.getMonth() + 1}.`;
}
// src/pages/security.ts
var Js = {
	camera: "M3 7h12v10H3zM15 10l6-3v10l-6-3",
	muted: "M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6",
	sound: "M4 9h4l5-4v14l-5-4H4zM17 8a5 5 0 0 1 0 8M19.5 5.5a9 9 0 0 1 0 13",
	full: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
};
function Ys(e, t) {
	if (e.config.names?.[t]) return e.config.names[t];
	let n = R(e.hass, t);
	return /doorbell|klingel|haust/i.test(`${t} ${n}`) ? "Haustür" : n;
}
function Xs(e, t, n) {
	let r = t.currentTarget.closest(".cam");
	r?.requestFullscreen ? r.requestFullscreen().catch(() => e.moreInfo(n)) : e.moreInfo(n);
}
function Zs(e) {
	let { hass: t, config: n } = e, r = Fs(t, n, e.now), i = Hs(t, n, e.rooms), a = r.state === "triggered" ? "#ff453a" : "#bf9bff", o = N(n, "camera"), s = t.states[o], c = t.states[N(n, "camera_motion")], l = t.states[N(n, "camera_person")], u = e.ui.camSound !== !0, d = Gs(t, n), f = !!s && s.state !== "unavailable" && !!customElements.get("ha-camera-stream");
	return C`
    <div class="security">
      <header class="shead2">
        <div>
          <div class="date">${Us(i, r.state)}</div>
          <h1>Schutz</h1>
        </div>
        ${d.length ? C`<button class="pp-pill" aria-label="Personen: ${Ks(d)}, Karte öffnen"
              @click=${() => e.openSheet({ id: "persons" })}>
              ${d.map((e) => Ms(e))}
            </button>` : E}
      </header>

      ${t.states[r.id] ? C`<div class="alarmpill" style="background: linear-gradient(90deg, ${a}42, rgba(255,255,255,0.05) 70%)">
            <button class="circle abtn" style="width:48px;height:48px;background:${a}" aria-label="Alarm-Details"
              @click=${() => e.openSheet({ id: "alarm" })}>${j(Fn(r.state), 22, "#1d1030", 2.2)}</button>
            <span class="atext">
              <span class="atitle">${r.label}</span>
              ${r.sub ? C`<span class="asub">${r.sub}</span>` : E}
            </span>
            ${Ns.filter((e) => e.state !== r.state).map((t) => C`
              <button class="amode" aria-label=${t.name} title=${t.name}
                @click=${() => e.call("alarm_control_panel", t.service, {}, { entity_id: r.id })}>
                ${j(O[t.icon], 18, "#e2d3ff", 2.1)}
              </button>`)}
          </div>` : E}

      ${s ? C`<section class="camcard" aria-label="${Ys(e, o)}-Kamera">
            <div class="cam">
              ${f ? C`<ha-camera-stream class="stream" .hass=${t} .stateObj=${s} .muted=${u} .controls=${!1}
                    allow-exoplayer></ha-camera-stream>` : C`<span class="camph">${j(Js.camera, 40, "rgba(255,255,255,0.4)", 1.6)}</span>`}
              <span class="camlive"><span class="dot" style="background:${f ? "#ff453a" : "#888"}"></span>${f ? "Live" : "Offline"} · ${Ys(e, o)}</span>
              <span class="camtools">
                <button aria-label=${u ? "Ton an" : "Ton aus"} @click=${() => e.setUi({ camSound: u })}>${j(u ? Js.muted : Js.sound, 15, "#fff", 2.2)}</button>
                <button aria-label="Vollbild" @click=${(t) => Xs(e, t, o)}>${j(Js.full, 15, "#fff", 2.2)}</button>
              </span>
            </div>
            <div class="camchips">
              ${c ? C`<span class="cchip ${c.state === "on" ? "hot" : ""}">${c.state === "on" ? "Bewegung erkannt" : "Keine Bewegung"}</span>` : E}
              ${l ? C`<span class="cchip ${l.state === "on" ? "hot" : ""}">${l.state === "on" ? "Person erkannt" : "Keine Person"}</span>` : E}
              <span class="grow"></span>
              <button class="cchip btn2" @click=${() => e.moreInfo(c ? c.entity_id : o)}>Verlauf</button>
            </div>
          </section>` : E}

      ${i.length ? C`
            <div class="section-head">
              <h2>Fenster &amp; Türen</h2><span class="rule" aria-hidden="true"></span>
              <span class="meta legend"><span><span class="dot" style="background:#30d158"></span>zu</span><span><span class="dot" style="background:#ff453a"></span>offen</span></span>
            </div>
            ${i.map((t) => C`
              <div class="flabel">${t.name}</div>
              <div class="ogrid">
                ${t.areas.map((t) => C`
                  <div class="opill ${t.items.length > 3 ? "wide" : ""}">
                    <span class="ellipsis oname">${t.name}</span>
                    <span class="oicons">
                      ${t.items.map((t) => {
		let n = `${t.title} ${t.unavailable ? "nicht erreichbar" : t.open ? "offen" : "zu"}`;
		return C`<button class="oicon ${t.open ? "open" : ""} ${t.unavailable ? "na" : ""}" title=${n} aria-label=${n}
                          @click=${() => e.moreInfo(t.id)}>
                          ${j(t.kind === "door" ? O.door : O.window, 15, t.unavailable ? "rgba(255,255,255,0.45)" : t.open ? "#ffd1cf" : "#7ee8a0", 2.2)}
                        </button>`;
	})}
                    </span>
                  </div>`)}
              </div>`)}
          ` : E}
    </div>
  `;
}
var Qs = o`
  .security {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .shead2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 0 4px 4px 6px;
  }
  .pp-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 52px;
    padding: 0 6px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
  }
  .pp-av {
    display: block;
    position: relative;
    flex-shrink: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.14);
    box-shadow: 0 0 0 2px #1c1e24;
  }
  .pp-av img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
  .pp-av.out img,
  .pp-av.out .pp-ini {
    opacity: 0.5;
    filter: grayscale(1);
  }
  .pp-ini {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    font-size: 14px;
    font-weight: 700;
  }
  .pp-zone {
    position: absolute;
    right: -3px;
    bottom: -3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    box-shadow: 0 0 0 2px #1c1e24;
  }

  .shead2 h1 {
    margin-top: 2px;
    font-size: 30px;
    font-weight: 700;
  }
  .alarmpill {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 64px;
    padding: 0 8px;
    border-radius: 32px;
  }
  .atext {
    flex: 1;
    min-width: 0;
  }
  .atitle {
    display: block;
    font-size: 15px;
    font-weight: 700;
  }
  .asub {
    display: block;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.72);
  }
  .amode {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 21px;
    background: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .camcard {
    border-radius: 30px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.07);
  }
  .cam {
    position: relative;
    min-height: 200px;
    background: linear-gradient(160deg, #2a2d36, #15171d);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cam:fullscreen {
    background: #000;
  }
  .stream {
    display: block;
    width: 100%;
  }
  .camph {
    padding: 80px 0;
  }
  .camlive {
    position: absolute;
    left: 10px;
    top: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    height: 26px;
    padding: 0 10px;
    border-radius: 13px;
    background: rgba(0, 0, 0, 0.55);
    font-size: 11px;
    font-weight: 600;
  }
  .camtools {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    gap: 6px;
  }
  .camtools button {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .camchips {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px;
  }
  .cchip {
    height: 30px;
    padding: 0 12px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    font-size: 12px;
  }
  .cchip.hot {
    background: rgba(255, 159, 10, 0.24);
    color: #ffd29a;
  }
  .cchip.btn2 {
    background: rgba(255, 255, 255, 0.14);
    font-weight: 600;
  }
  .legend {
    gap: 8px;
    font-size: 11px;
  }
  .legend > span {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .flabel {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    margin: 2px 8px 0;
  }
  .ogrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .opill {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    min-height: 46px;
    padding: 0 6px 0 14px;
    border-radius: 23px;
    background: rgba(255, 255, 255, 0.07);
  }
  .opill.wide {
    grid-column: span 2;
  }
  .oname {
    font-size: 13px;
    font-weight: 600;
  }
  .oicons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 3px;
    padding: 6px 0;
  }
  .oicon {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(48, 209, 88, 0.18);
  }
  .oicon.open {
    background: #ff453a;
  }
  .oicon.na {
    background: transparent;
    border: 1px dashed rgba(255, 255, 255, 0.25);
  }
`, $s = {
	pause: "M7 4h3v16H7zM14 4h3v16h-3z",
	dock: "M3 10.5 12 3l9 7.5V21H3z",
	locate: "M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12zM12 7a2 2 0 1 0 0 4a2 2 0 1 0 0-4"
};
function ec(e, t, n, r) {
	let i = e === 0 ? "17px 6px 6px 17px" : e === n - 1 ? "6px 17px 17px 6px" : "6px";
	return e <= t ? `border-radius:${i};background:${r};opacity:${.55 + .45 * (e + 1) / n};color:#08121c` : `border-radius:${i};background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)`;
}
function tc(e) {
	let { hass: t, config: n } = e, r = N(n, "vacuum"), i = Yt(t, n), a = Zt(t, n), o = $t(t, n), s = F(t, N(n, "vacuum_map")) ?? o[0]?.name, c = o.find((e) => e.name === s) ?? o[0], l = en(t, n), u = c ? c.rooms.filter((e) => l.includes(e.segment)).length : 0, d = N(n, "vacuum_mode"), f = F(t, d) ?? "vacuum", p = String(t.states[r]?.attributes.fan_speed ?? ""), m = on.findIndex((e) => e.id === p), h = N(n, "vacuum_mop"), g = sn.findIndex((e) => e.id === F(t, h)), _ = N(n, "vacuum_passes"), v = Math.round(P(t, _) ?? 1), y = (t, n = {}) => e.call("vacuum", t, n, { entity_id: r }), b = (t, n) => e.call("select", "select_option", { option: n }, { entity_id: t }), ee = i.error ? "#ff453a" : i.cleaning ? "#64d2ff" : "#30d158";
	return M({
		title: "Robby",
		subtitle: i.label,
		color: "radial-gradient(circle at 40% 35%, #4a505c, #23262e)",
		glow: i.error ? "rgba(255,69,58,0.18)" : "rgba(48,209,88,0.1)",
		iconPath: O.vacuum,
		iconStroke: ee,
		onClose: e.closeSheet,
		headerExtra: C`
      ${i.cleaning ? C`<button class="rb-ctl" aria-label="Pause" title="Pause" @click=${() => y("pause")}>${j($s.pause, 16, "#fff", 2.2)}</button>` : C`<button class="rb-ctl" aria-label="Start" title="Start" @click=${() => y("start")}>${j(k.play, 16, "#fff", 2.2)}</button>`}
      <button class="rb-ctl" aria-label="Zur Station" title="Zur Station" @click=${() => y("return_to_base")}>${j($s.dock, 16, "#fff", 2.2)}</button>
      <button class="rb-ctl" aria-label="Orten" title="Orten" @click=${() => y("locate")}>${j($s.locate, 16, "#fff", 2.2)}</button>
    `,
		body: C`
      ${a.length ? C`<div class="rb-stats" style="grid-template-columns: repeat(${a.length}, minmax(0, 1fr))">
            ${a.map((t) => C`<button class="rb-stat ${t.due ? "due" : ""}" aria-label="${t.name}: ${t.value}${t.reset ? ", tippen zum Zurücksetzen" : ""}"
              @click=${() => t.reset ? e.confirm({
			title: t.name,
			text: `${t.name} gereinigt oder getauscht? Der Zähler wird zurückgesetzt.`,
			confirm: "Zurücksetzen",
			color: "#ff9f0a",
			iconPath: O.vacuum,
			onConfirm: () => e.call("button", "press", {}, { entity_id: t.reset })
		}) : e.moreInfo(t.id)}>
              <span class="rb-sv">${t.value}</span><span class="rb-sn">${t.name}</span>
            </button>`)}
          </div>` : E}

      <div class="section-head"><h2>Programme</h2><span class="rule" aria-hidden="true"></span><span class="meta">Tippen startet</span></div>
      <div class="rb-progs">
        ${nn(n).map((t) => C`
          <button class="rb-prog" @click=${() => t.button ? e.call("button", "press", {}, { entity_id: t.button }) : y("start")}>
            <span class="rb-tag" style="background:${t.color ?? "#7ee8a0"}">${t.tag}</span>
            <span class="rb-pn">${t.name}</span>
          </button>`)}
      </div>

      ${c ? C`
            <div class="section-head"><h2>Selbst auswählen</h2><span class="rule" aria-hidden="true"></span></div>
            <section class="rb-custom" aria-label="Individuelle Reinigung">
              <div class="rb-tabs" role="tablist" aria-label="Karte" style="grid-template-columns: repeat(${o.length}, minmax(0, 1fr))">
                ${o.map((t) => C`<button role="tab" aria-selected=${t.name === c.name} class=${t.name === c.name ? "sel" : ""}
                  @click=${() => t.name !== c.name && e.runScript(N(n, "vacuum_map_script"), { karte: t.name })}>${t.name}</button>`)}
              </div>
              ${c.rooms.length ? C`<div class="rb-rooms">
                    ${c.rooms.map((t) => {
			let r = l.includes(t.segment);
			return C`<button class="rb-room ${r ? "sel" : ""}" aria-pressed=${r}
                        @click=${() => e.runScript(N(n, "vacuum_room_script"), { segment: t.segment })}>${t.name}</button>`;
		})}
                  </div>` : E}

              <div class="rb-modes" role="radiogroup" aria-label="Modus">
                ${an.map((e) => {
			let t = f === e.id;
			return C`<button class="rb-mode ${t ? "sel" : ""}" role="radio" aria-checked=${t} @click=${() => b(d, e.id)}>
                    <span class="rb-mi">
                      ${e.id === "mop" ? E : j(k.fan, 18, "currentColor", 2.1)}
                      ${e.id === "vacuum" ? E : j(k.drop, 18, "currentColor", 2.1)}
                    </span>
                    <span class="rb-mn">${e.name}</span>
                  </button>`;
		})}
              </div>

              ${f === "mop" ? E : C`<div class="rb-slider">
                    <div class="rb-sh">${j(k.fan, 15, "#7ee8a0", 2.2)}<span>Saugkraft</span><span class="grow"></span>
                      <strong style="color:#9af0b5">${on[m]?.name ?? p}</strong></div>
                    <div class="rb-segs" role="radiogroup" aria-label="Saugkraft" style="grid-template-columns: repeat(${on.length}, minmax(0, 1fr))">
                      ${on.map((e, t) => C`<button role="radio" aria-checked=${t === m} aria-label=${e.name} title=${e.name}
                        style=${ec(t, m, on.length, "#30d158")} @click=${() => y("set_fan_speed", { fan_speed: e.id })}></button>`)}
                    </div>
                  </div>`}

              ${f === "vacuum" ? E : C`<div class="rb-slider">
                    <div class="rb-sh">${j(k.drop, 15, "#8fd8ff", 2.2)}<span>Wasser</span><span class="grow"></span>
                      <strong style="color:#bfe8ff">${sn[g]?.name ?? "–"}</strong></div>
                    <div class="rb-segs" role="radiogroup" aria-label="Wischintensität" style="grid-template-columns: repeat(${sn.length}, minmax(0, 1fr))">
                      ${sn.map((e, t) => C`<button role="radio" aria-checked=${t === g} aria-label=${e.name} title=${e.name}
                        style=${ec(t, g, sn.length, "#5ac8fa")} @click=${() => b(h, e.id)}>
                        ${Array.from({ length: t + 1 }, () => C`<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${k.drop}></path></svg>`)}
                      </button>`)}
                    </div>
                  </div>`}

              <div class="rb-start">
                <div class="rb-passes" role="radiogroup" aria-label="Durchgänge">
                  ${[1, 2].map((t) => C`<button role="radio" aria-checked=${v === t} class=${v === t ? "sel" : ""}
                    @click=${() => e.call("input_number", "set_value", { value: t }, { entity_id: _ })}>${t}×</button>`)}
                </div>
                <button class="rb-go" ?disabled=${u === 0} @click=${() => e.runScript(N(n, "vacuum_clean_script"))}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${k.play}></path></svg>${rn(u)}
                </button>
              </div>
            </section>` : E}
    `
	});
}
var nc = o`
  .rb-ctl {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rb-stats {
    display: grid;
    gap: 4px;
  }
  .rb-stat {
    padding: 7px 2px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.06);
    text-align: center;
  }
  .rb-stat.due {
    color: #ffc061;
    background: rgba(255, 159, 10, 0.18);
  }
  .rb-sv {
    display: block;
    font-size: 13px;
    font-weight: 700;
  }
  .rb-sn {
    display: block;
    font-size: 10px;
    opacity: 0.8;
  }
  .rb-progs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .rb-prog {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    height: 58px;
    padding: 6px 10px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.08);
    text-align: left;
  }
  .rb-tag {
    height: 20px;
    padding: 0 8px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    font-size: 11px;
    font-weight: 700;
    color: #101010;
  }
  .rb-pn {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.15;
  }
  .rb-custom {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    border-radius: 28px;
    border: 1px solid rgba(48, 209, 88, 0.35);
    background: rgba(48, 209, 88, 0.06);
  }
  .rb-tabs {
    display: grid;
    gap: 4px;
    padding: 3px;
    border-radius: 19px;
    background: rgba(0, 0, 0, 0.25);
  }
  .rb-tabs button {
    height: 34px;
    border-radius: 17px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
  }
  .rb-tabs button.sel {
    background: #fff;
    color: #101218;
  }
  .rb-rooms {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
  }
  .rb-room {
    height: 38px;
    padding: 0 2px;
    border-radius: 19px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.16);
  }
  .rb-room.sel {
    border-color: transparent;
    background: #30d158;
    color: #0b1a10;
  }
  .rb-modes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .rb-mode {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 60px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.07);
    text-align: center;
  }
  .rb-mode.sel {
    background: #30d158;
    color: #0b1a10;
  }
  .rb-mi {
    display: flex;
    gap: 2px;
  }
  .rb-mn {
    font-size: 12px;
    font-weight: 700;
  }
  .rb-slider {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .rb-sh {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    padding: 0 4px;
  }
  .rb-segs {
    display: grid;
    gap: 3px;
    height: 34px;
  }
  .rb-segs button {
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1px;
  }
  .rb-start {
    display: flex;
    gap: 6px;
    margin-top: 2px;
  }
  .rb-passes {
    display: flex;
    gap: 3px;
    padding: 3px;
    border-radius: 25px;
    background: rgba(0, 0, 0, 0.25);
  }
  .rb-passes button {
    width: 44px;
    height: 44px;
    border-radius: 22px;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .rb-passes button.sel {
    background: #fff;
    color: #101218;
  }
  .rb-go {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 50px;
    border-radius: 25px;
    background: #30d158;
    color: #0b1a10;
    font-size: 14px;
    font-weight: 700;
  }
  .rb-go:disabled {
    opacity: 0.45;
    cursor: default;
  }
`, rc = 36e5, ic = 24 * rc;
function ac(e, t) {
	let n = -1, r = Infinity;
	return e.forEach((e, i) => {
		let a = Math.abs(e - t);
		a < r && (r = a, n = i);
	}), n;
}
var oc = (e) => String(e.getHours()).padStart(2, "0"), sc = (e) => e.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
function cc(e, t) {
	let n = new Date(e);
	if ((t.step ?? 0) >= 828e5) return `${sc(n)} ${n.getDate()}.${n.getMonth() + 1}.`;
	let r = t.span > 1.5 * ic ? `${sc(n)} ` : "";
	return t.bars && t.step ? `${r}${oc(n)}–${oc(new Date(e + t.step))} Uhr` : `${r}${oc(n)}:${String(n.getMinutes()).padStart(2, "0")}`;
}
function lc(e) {
	let t = e.end - e.start, n = e.step ?? 0, r = Math.max(n, rc), i = e.compare ?? [], a = (e) => {
		let t = ac(i.map((e) => e.t), e);
		return t >= 0 && Math.abs(i[t].t - e) <= r ? i[t] : null;
	}, o = (r, i) => {
		let o = {
			x: e.bars && n ? (e.x(r.t) + e.x(r.t + n)) / 2 : e.x(r.t),
			y: e.y(r.v),
			time: cc(r.t, {
				step: n,
				bars: e.bars,
				span: t
			}),
			value: e.value(r.v)
		};
		if (i) o.extra = "Vorhersage";
		else if (e.compareName) {
			let t = a(r.t);
			t && (o.extra = `${e.compareName} ${e.value(t.v)}`);
		}
		let s = e.extra?.(r.t);
		return s && (o.extra = o.extra ? `${s} · ${o.extra}` : s), o;
	};
	return [...e.past.map((e) => o(e, !1)), ...(e.future ?? []).map((e) => o(e, !0))];
}
// src/components/scrub.ts
var uc = 1800, Z = /* @__PURE__ */ new WeakMap();
function dc(e) {
	return e.querySelector(":scope > .sc-layer");
}
function fc(e) {
	let t = Z.get(e);
	t && (t.index = -1), dc(e)?.classList.remove("on");
}
function pc(e, t) {
	let n = Z.get(e), r = dc(e);
	if (!n || !r || !n.cfg.points.length) return;
	let i = e.getBoundingClientRect();
	if (!i.width) return;
	let a = (t - i.left) / i.width * n.cfg.width, o = ac(n.cfg.points.map((e) => e.x), a);
	if (o < 0) return;
	o !== n.index && n.index >= 0 && Fr(e, "selection"), n.index = o;
	let s = n.cfg.points[o];
	r.firstChild || (r.innerHTML = "<div class=\"sc-line\"></div><div class=\"sc-dot\"></div><div class=\"sc-tip\"><span class=\"sc-t\"></span><span class=\"sc-v\"></span><span class=\"sc-e\"></span></div>");
	let c = s.x / n.cfg.width * i.width, l = s.y / n.cfg.height * i.height, [u, d, f] = Array.from(r.children);
	u.style.left = `${c}px`, d.style.left = `${c}px`, d.style.top = `${l}px`, d.style.background = n.cfg.color;
	let [p, m, h] = Array.from(f.children);
	p.textContent = s.time, m.textContent = s.value, m.style.color = n.cfg.color, h.textContent = s.extra ?? "", h.hidden = !s.extra, r.classList.add("on");
	let g = f.offsetWidth;
	f.style.left = `${Math.min(Math.max(0, c - g / 2), Math.max(0, i.width - g))}px`;
}
function mc(e) {
	let t = () => {
		let t = Z.get(e);
		t && (window.clearTimeout(t.timer), t.timer = window.setTimeout(() => fc(e), uc));
	};
	e.addEventListener("pointerdown", (t) => {
		let n = Z.get(e);
		n && (window.clearTimeout(n.timer), n.pressed = !0, pc(e, t.clientX));
	}), e.addEventListener("pointermove", (t) => {
		let n = Z.get(e);
		n && (n.pressed || t.pointerType === "mouse") && pc(e, t.clientX);
	});
	let n = () => {
		let n = Z.get(e);
		n && (n.pressed = !1, t());
	};
	e.addEventListener("pointerup", n), e.addEventListener("pointercancel", n), e.addEventListener("pointerleave", (t) => {
		t.pointerType === "mouse" ? fc(e) : n();
	});
}
var hc = Ke(class extends qe {
	constructor(e) {
		if (super(e), e.type !== Ge.ELEMENT) throw Error("scrub() must be used on an element");
	}
	render(e) {
		return T;
	}
	update(e, [t]) {
		let n = e.element, r = Z.get(n);
		return r ? (r.cfg = t, r.index >= t.points.length && fc(n)) : (Z.set(n, {
			cfg: t,
			index: -1,
			pressed: !1
		}), mc(n)), T;
	}
}), gc = o`
  .sc-wrap {
    position: relative;
    touch-action: pan-y;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
  .sc-wrap > svg {
    display: block;
  }
  .sc-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .sc-layer.on {
    opacity: 1;
  }
  .sc-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.45);
  }
  .sc-dot {
    position: absolute;
    width: 10px;
    height: 10px;
    margin: -5px 0 0 -5px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #181a22;
  }
  .sc-tip {
    position: absolute;
    top: -8px;
    transform: translateY(-100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 10px;
    border-radius: 12px;
    background: rgba(20, 22, 28, 0.92);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 6px 18px rgba(0, 0, 0, 0.4);
    white-space: nowrap;
    line-height: 1.25;
  }
  .sc-t {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.65);
  }
  .sc-v {
    font-size: 14px;
    font-weight: 700;
  }
  .sc-e {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.75);
  }
`, _c = 338, vc = 300, yc = 18, bc = 130, xc = "#5ac8fa";
function Sc(e) {
	let t = e.data, n = t.past ?? [], r = t.future ?? [], i = t.step ?? 0, a = t.compare ?? [], o = gr(n, t.start, t.end, vc, yc, bc, {
		snap: e.snap,
		zero: e.zero,
		max: e.max,
		padLo: e.snap / 2,
		padHi: e.snap / 2,
		extra: [...r, ...a].map((e) => e.v)
	}), s = a.length ? gr(a, t.start, t.end, vc, yc, bc, {
		snap: e.snap,
		zero: e.zero,
		max: e.max,
		padLo: e.snap / 2,
		padHi: e.snap / 2,
		extra: [...n, ...r].map((e) => e.v)
	}) : null, c = r.length ? gr(r, t.start, t.end, vc, yc, bc, {
		snap: e.snap,
		zero: e.zero,
		max: e.max,
		padLo: e.snap / 2,
		padHi: e.snap / 2,
		extra: n.map((e) => e.v)
	}) : null, l = e.unit ? ` ${e.unit}` : "", u = [
		o.hi,
		(o.lo + o.hi) / 2,
		o.lo
	], d = r.length ? o.x(r[0].t) : null, f = `${e.title}: ${e.caption ?? ""}`, p = (e.rain ?? []).filter((e) => e.v > 0), m = Math.max(2, ...p.map((e) => e.v)), h = (e) => bc - e / m * 50.400000000000006, g = new Map((e.rain ?? []).map((e) => [e.t, e.v])), _ = lc({
		past: n,
		future: r,
		compare: a,
		step: i,
		bars: !!(e.bars && i),
		start: t.start,
		end: t.end,
		x: o.x,
		y: o.y,
		value: (t) => `${I(t, e.digits)}${l}`,
		compareName: e.compareName,
		extra: e.rain ? (e) => {
			let t = g.get(e);
			return t ? `Regen ${I(t, 1)} mm` : void 0;
		} : void 0
	}), v = (e, t, n, r) => {
		let a = o.x(e.t), s = Math.max(1, o.x(e.t + (i || 36e5)) - a - 2), c = r(e.v);
		return w`<rect x=${a + 1} y=${c} width=${s} height=${Math.max(0, bc - c)} rx=${Math.min(3, s / 2)} fill=${t} opacity=${n}></rect>`;
	};
	return C`
    <figure class="tr-fig" style="background:${e.color}14">
      <figcaption>
        <span class="tr-title" style="color:${e.color}">${e.title}</span>
        ${e.caption ? C`<span class="tr-cap">${e.caption}</span>` : E}
      </figcaption>
      ${t.error && !n.length ? C`<div class="tr-msg">Keine Daten: ${t.error}</div>` : t.loading && !n.length ? C`<div class="tr-msg">Lade Verlauf …</div>` : C`
            <div class="sc-wrap" ${hc({
		points: _,
		width: _c,
		height: 150,
		color: e.color
	})}>
            <svg width="100%" viewBox="0 0 ${_c} 150" role="img" aria-label=${f}>
              ${u.map((e) => w`
                <line x1="0" y1=${o.y(e)} x2=${_c} y2=${o.y(e)} stroke="rgba(255,255,255,0.08)"></line>
                <text x=${334} y=${o.y(e) - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${I(e, e % 1 ? 1 : 0)}${l}</text>`)}
              ${(t.bands ?? []).map((t) => w`<rect x=${o.x(t.from)} y=${12} width=${Math.max(1, o.x(t.to) - o.x(t.from))}
                height=${118} fill=${e.bandColors?.[t.level] ?? "rgba(255,255,255,0.08)"}></rect>`)}
              ${s?.line ? w`<polyline points=${s.line} fill="none" stroke=${e.compareColor ?? "rgba(255,255,255,0.6)"} stroke-width="1.6" stroke-linejoin="round" opacity="0.9"></polyline>` : E}
              ${e.bars && i ? w`${n.map((t) => v(t, e.color, .85, o.y))}
                  ${r.map((t) => v(t, e.color, .4, o.y))}
                  ${d === null ? E : w`<line x1=${d} y1=${12} x2=${d} y2=${bc} stroke="rgba(255,255,255,0.35)" stroke-dasharray="2 3"></line>
                        <text x=${d + 4} y=${16} fill="rgba(255,255,255,0.7)" font-size="10">Vorhersage</text>`}` : w`
                  ${o.area ? w`<polygon points=${o.area} fill=${e.color} opacity="0.16"></polygon>` : E}
                  ${p.map((e) => v(e, xc, .7, h))}
                  ${o.line ? w`<polyline points=${o.line} fill="none" stroke=${e.color} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>` : E}
                  ${c?.line ? w`<polyline points=${c.line} fill="none" stroke=${e.color} stroke-width="2" stroke-dasharray="5 5" opacity="0.7"></polyline>` : E}
                  ${d === null ? E : w`<line x1=${d} y1=${12} x2=${d} y2=${bc} stroke="rgba(255,255,255,0.35)" stroke-dasharray="2 3"></line>
                        <text x=${d + 4} y=${16} fill="rgba(255,255,255,0.7)" font-size="10">Vorhersage</text>`}
                  ${o.last && e.dot !== !1 ? w`<circle cx=${o.last.x} cy=${o.last.y} r="4.5" fill=${e.color} stroke="#181a22" stroke-width="2"></circle>` : E}`}
            </svg>
            <div class="sc-layer"></div>
            </div>
            <div class="tr-x">${e.labels.map((e) => C`<span>${e}</span>`)}</div>`}
    </figure>
  `;
}
var Cc = o`
  .tr-fig {
    margin: 0;
    padding: 14px 12px 10px;
    border-radius: 28px;
  }
  .tr-fig figcaption {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    padding: 0 4px 6px;
  }
  .tr-title {
    font-size: 14px;
    font-weight: 600;
  }
  .tr-cap {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
    text-align: right;
  }
  .tr-x {
    display: flex;
    justify-content: space-between;
    padding: 2px 40px 0 0;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
  }
  .tr-msg {
    padding: 50px 10px;
    text-align: center;
    color: var(--sd-muted);
    font-size: 14px;
  }
`, Q = "#8fd0ff", wc = {
	precipitation: k.drop,
	humidity: k.drop,
	wind: O.wind,
	pressure: "M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16M12 12l4-3",
	uv: O.sun,
	visibility: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6"
}, Tc = {
	rain: k.drop,
	sun: O.sun,
	wind: O.wind,
	humidity: k.drop,
	uv: O.sun
}, Ec = "M6 9l6 6 6-6", Dc = [
	"rainy",
	"pouring",
	"snowy",
	"snowy-rainy",
	"hail",
	"lightning-rainy"
];
function Oc(e) {
	let { hass: t, config: n } = e, r = N(n, "weather"), i = e.forecast(), a = Tt(t, n, i.daily, e.now, i.hourly), o = Et(i.hourly, e.now), s = Ot(i.daily), c = Rt(t, n, e.now), l = At(t, n), u = !l || l.level === 0 ? "#7ee8a0" : l.level < 2 ? "#ffd60a" : "#ff9f0a";
	return M({
		title: String(t.states[r]?.attributes.friendly_name ?? "Wetter"),
		subtitle: a.source || void 0,
		color: Q,
		glow: "rgba(90,140,220,0.35)",
		iconPath: He(a.condition),
		iconTemplate: qa(a.condition, 20, "#0a1a2a"),
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		body: C`
      <div class="w-now">
        <span class="w-temp">${a.temp}</span>
        <span><span class="w-cond">${a.label}</span>${a.today ? C`<span class="w-today">${a.today}</span>` : E}</span>
      </div>
      ${a.chips.length ? C`<div class="w-chips">
            ${a.chips.map((t) => t.key in zt || t.key === "precipitation" ? C`<button class="w-chip" aria-label="${t.label}, Verlauf anzeigen"
                  @click=${() => e.openSheet(t.key === "precipitation" ? { id: "weatherRain" } : {
			id: "weatherMetric",
			metric: t.key
		})}>${j(wc[t.key], 14, Q, 2.2)}${t.label}</button>` : C`<span class="w-chip">${j(wc[t.key], 14, Q, 2.2)}${t.label}</span>`)}
          </div>` : E}

      ${c.map((t, n) => {
			let r = e.ui[`warn${n}`] === !0;
			return C`
          <button class="w-alert" aria-expanded=${r} ?disabled=${!t.text}
            style="border-color:${t.color}66;background:linear-gradient(90deg, ${t.color}38, ${t.color}0d)"
            @click=${() => e.setUi({ [`warn${n}`]: !r })}>
            <span class="w-ah">
              <span class="circle" style="width:32px;height:32px;background:${t.color}">${j(O.storm, 15, "#1d1030", 2.2)}</span>
              <span class="grow"><span class="w-wt">${t.current ? t.level >= 3 ? "Unwetterwarnung" : "Warnung" : "Vorabwarnung"}: ${t.title}</span>
                <span class="w-ws">${t.when} · Stufe ${t.level} von 4</span></span>
              ${t.text ? C`<span class="w-chev ${r ? "open" : ""}">${j(Ec, 16, "rgba(255,255,255,0.7)", 2.4)}</span>` : E}
            </span>
            ${r ? C`<span class="w-at">${t.text}</span>` : E}
          </button>`;
		})}

      ${i.loading && !i.hourly.length ? C`<div class="w-msg">Vorhersage wird geladen …</div>` : i.error && !i.hourly.length ? C`<div class="w-msg">Vorhersage nicht verfügbar.</div>` : E}

      ${o.length ? C`<div class="w-hours" style="grid-template-columns: repeat(${o.length}, minmax(0, 1fr))">
            ${o.map((e) => C`<div class="w-hour">
              <span class="w-ht">${e.t}</span>
              ${j(He(e.condition), 20, Dc.includes(e.condition) ? Q : "rgba(255,255,255,0.85)", 2)}
              <span class="w-hv">${e.temp ?? "–"}°</span>
              <span class="w-hr">${e.rain}</span>
            </div>`)}
          </div>` : E}

      ${s.length ? C`<div class="w-days">
            ${s.map((t) => C`<button class="w-day" aria-label="${t.day}, Details anzeigen"
              @click=${() => e.openSheet({
			id: "weatherDay",
			date: t.date
		})}>
              <span class="w-dn">${t.day}</span>
              ${j(He(t.condition), 20, Dc.includes(t.condition) ? Q : "rgba(255,255,255,0.8)", 2)}
              <span class="w-dr">${t.rain}</span>
              <span class="w-track">
                <span class="w-bar" style="left:${t.left}%;width:${t.width}%"></span>
                <span class="w-lo" style="left:${t.left}%">${t.min}°</span>
              </span>
              <span class="w-dmax">${t.max}°</span>
            </button>`)}
          </div>` : E}

      ${l ? C`<div class="w-pollen" style="background:${u}1f">
            ${j(k.leaf, 16, u, 2.2)}
            <span><strong>${l.title}</strong> · ${l.text}</span>
          </div>` : E}
    `
	});
}
var kc = 36e5;
function Ac(e, t) {
	let n = e.forecast(), r = n.daily.find((e) => e.datetime === t), i = () => e.openSheet({ id: "weather" });
	if (!r) return M({
		title: "Vorhersage",
		color: Q,
		glow: "rgba(90,140,220,0.35)",
		iconPath: O.sun,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: i,
		body: C`<div class="w-msg">${n.loading ? "Vorhersage wird geladen …" : "Für diesen Tag gibt es keine Vorhersage mehr."}</div>`
	});
	let a = kt(r, n.hourly), o = (e) => `${String(e).padStart(2, "0")} Uhr`;
	return M({
		title: a.title,
		subtitle: a.label || void 0,
		color: Q,
		glow: "rgba(90,140,220,0.35)",
		iconPath: He(a.condition),
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: i,
		body: C`
      <div class="w-now">
        <span class="w-temp">${a.max ?? "–"}°</span>
        <span><span class="w-cond">${a.label}</span>${a.min === null ? E : C`<span class="w-today">Tiefstwert ${a.min}°</span>`}</span>
      </div>
      ${a.facts.length ? C`<div class="w-chips">${a.facts.map((e) => C`<span class="w-chip">${j(Tc[e.key], 14, Q, 2.2)}${e.label}</span>`)}</div>` : E}
      ${a.hours.length ? C`<div class="w-hours" style="grid-template-columns: repeat(${a.hours.length}, minmax(0, 1fr))">
            ${a.hours.map((e) => C`<div class="w-hour">
              <span class="w-ht">${e.t}</span>
              ${j(He(e.condition), 20, Dc.includes(e.condition) ? Q : "rgba(255,255,255,0.85)", 2)}
              <span class="w-hv">${e.temp ?? "–"}°</span>
              <span class="w-hr">${e.rain}</span>
            </div>`)}
          </div>` : C`<div class="w-msg">Stündliche Werte gibt es erst näher am Tag.</div>`}
      ${a.temps.length > 1 ? Sc({
			title: "Temperatur",
			color: "#ffc061",
			unit: "°C",
			digits: 1,
			snap: 2,
			dot: !1,
			data: {
				loading: !1,
				past: a.temps,
				start: a.start,
				end: a.end
			},
			rain: a.rain,
			caption: `${I(Math.min(...a.temps.map((e) => e.v)), 1)} – ${I(Math.max(...a.temps.map((e) => e.v)), 1)} °C${jc(a.rain)}`,
			labels: [
				o(0),
				o(5),
				o(10),
				o(14),
				o(19)
			]
		}) : E}
    `
	});
}
var jc = (e) => {
	let t = e.reduce((e, t) => e + t.v, 0);
	return t > 0 ? ` · Regen ${I(t, 1)} mm` : "";
};
function Mc(e) {
	let t = N(e.config, "precipitation"), n = e.hass.states[t] ? t : void 0, r = e.forecast(), i = e.series(`weather:rain:${r.hourly.length ? r.at : 0}`, () => ma(e.hass, n, r.hourly), 6e5), a = wt(e.hass, e.config, r.hourly, e.now), o = (e) => I((e ?? []).reduce((e, t) => e + t.v, 0), 1), s = i.start ? `${a === null ? "" : `jetzt ${I(a, 1)} mm/h · `}${n ? `24 h ${o(i.past)} mm · ` : ""}nächste 24 h ${o(i.future)} mm` : void 0, c = (e) => `${String(new Date(i.start + e * kc).getHours()).padStart(2, "0")} Uhr`;
	return M({
		title: "Niederschlag",
		subtitle: n ? "24 h zurück · 24 h Vorhersage" : "24 h Vorhersage",
		color: Q,
		glow: "rgba(90,140,220,0.35)",
		iconPath: k.drop,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: () => e.openSheet({ id: "weather" }),
		body: C`${Sc({
			title: "Niederschlag",
			color: "#5ac8fa",
			unit: "mm",
			digits: 1,
			snap: .5,
			data: i,
			caption: s,
			zero: !0,
			bars: !0,
			labels: i.start ? [
				c(0),
				c(12),
				"jetzt",
				c(36),
				c(48)
			] : []
		})}`
	});
}
function Nc(e, t) {
	let n = zt[t], r = N(e.config, "weather"), i = e.forecast(), a = e.series(`weather:${t}:${i.hourly.length ? i.at : 0}`, () => ha(e.hass, r, t, i.hourly), 6e5), o = [...a.past, ...a.future ?? []].map((e) => e.v), s = Number(e.hass.states[r]?.attributes[n.attr]), c = n.unit ? ` ${n.unit}` : "", l = o.length ? `${Number.isFinite(s) ? `jetzt ${I(s, n.digits)}${c} · ` : ""}${I(Math.min(...o), n.digits)} – ${I(Math.max(...o), n.digits)}${c}` : void 0, u = (e) => {
		let t = new Date(a.start + e * kc);
		return `${String(t.getHours()).padStart(2, "0")} Uhr`;
	};
	return M({
		title: n.name,
		subtitle: "24 h zurück · 24 h Vorhersage",
		color: n.color,
		glow: `${n.color}33`,
		iconPath: wc[t],
		onClose: e.closeSheet,
		onBack: () => e.openSheet({ id: "weather" }),
		body: C`${Sc({
			title: n.name,
			color: n.color,
			unit: n.unit,
			digits: n.digits,
			snap: n.snap,
			data: a,
			caption: l,
			zero: t === "uv",
			labels: a.start ? [
				u(0),
				u(12),
				"jetzt",
				u(36),
				u(48)
			] : []
		})}`
	});
}
var Pc = o`
  .w-alert {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    padding: 6px 12px 6px 6px;
    border-radius: 24px;
    border: 1px solid;
    text-align: left;
  }
  .w-alert:disabled {
    opacity: 1;
  }
  .w-chev {
    display: flex;
    transition: transform 0.2s;
  }
  .w-chev.open {
    transform: rotate(180deg);
  }
  .w-ah {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .w-at {
    display: block;
    margin: 0;
    padding: 2px 6px 6px;
    font-size: 12px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.85);
  }
  .w-now {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 4px 10px;
  }
  .w-temp {
    font-size: 64px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1;
  }
  .w-cond {
    display: block;
    font-size: 18px;
    font-weight: 600;
  }
  .w-today {
    display: block;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
  }
  .w-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .w-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 12px 0 10px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 500;
  }
  button.w-chip {
    background: rgba(143, 208, 255, 0.14);
  }
  .w-warn {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 56px;
    padding: 0 8px;
    border-radius: 28px;
    background: linear-gradient(90deg, rgba(191, 155, 255, 0.32), rgba(191, 155, 255, 0.08));
    border: 1px solid rgba(191, 155, 255, 0.35);
  }
  .w-wt {
    display: block;
    font-size: 14px;
    font-weight: 600;
  }
  .w-ws {
    display: block;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.82);
  }
  .w-msg {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    padding: 6px 10px;
  }
  .w-hours {
    display: grid;
    gap: 4px;
    padding: 10px 6px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.06);
  }
  .w-hour {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .w-ht {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.72);
  }
  .w-hv {
    font-size: 15px;
    font-weight: 700;
  }
  .w-hr {
    font-size: 10px;
    color: #8fd0ff;
    min-height: 12px;
  }
  .w-days {
    display: flex;
    flex-direction: column;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.06);
    padding: 4px 14px;
  }
  .w-day {
    width: 100%;
    text-align: left;
    display: grid;
    grid-template-columns: 30px 24px 52px 1fr 30px;
    align-items: center;
    gap: 8px;
    height: 40px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .w-day:last-child {
    border-bottom: none;
  }
  .w-dn {
    font-size: 13px;
    font-weight: 600;
  }
  .w-dr {
    font-size: 11px;
    color: #8fd0ff;
    white-space: nowrap;
  }
  .w-track {
    position: relative;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
  }
  .w-bar {
    position: absolute;
    top: 0;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, #8fd0ff, #ffc061);
  }
  .w-lo {
    position: absolute;
    top: -16px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
  }
  .w-dmax {
    font-size: 13px;
    font-weight: 700;
    text-align: right;
  }
  .w-pollen {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 14px;
    border-radius: 22px;
    font-size: 13px;
  }
`, Fc = [
	{
		id: "24h",
		name: "24 h"
	},
	{
		id: "3d",
		name: "3 Tage"
	},
	{
		id: "7d",
		name: "7 Tage"
	}
], Ic = "#8fd8ff", Lc = "rgba(255,255,255,0.65)", Rc = {
	now: "rgba(48,209,88,0.28)",
	possible: "rgba(48,209,88,0.12)"
};
function zc(e, t, n) {
	return t ? Array.from({ length: 5 }, (r, i) => {
		let a = new Date(t + (n - t) * i / 5);
		return e === "24h" ? `${String(a.getHours()).padStart(2, "0")} Uhr` : `${a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")} ${String(a.getHours()).padStart(2, "0")}h`;
	}) : [];
}
function Bc(e, t, n) {
	let r = e.rooms.find((e) => e.slug === t);
	if (!r) return E;
	let i = `sensor.${t}_taupunkt`, a = N(e.config, "outdoor_dew"), o = e.series(`dew:${t}:${n}`, () => ua(e.hass, {
		room: i,
		outdoor: a,
		airing: r.airing
	}, n), 3e5), s = P(e.hass, i), c = P(e.hass, a), l = [s === null ? "" : `innen ${I(s, 1)}°`, c === null ? "" : `außen ${I(c, 1)}°`].filter(Boolean).join(" · ");
	return M({
		title: "Taupunkt",
		subtitle: r.name,
		color: Ic,
		glow: `${Ic}33`,
		iconPath: k.drop,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: () => e.openSheet({
			id: "room",
			slug: t
		}),
		body: C`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${Fc.map((r) => C`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "dew",
			slug: t,
			range: r.id
		})}>${r.name}</button>`)}
      </div>
      ${Sc({
			title: "Taupunkt",
			color: Ic,
			unit: "°C",
			digits: 1,
			snap: 2,
			data: o,
			caption: l || void 0,
			compareColor: Lc,
			compareName: "außen",
			bandColors: Rc,
			labels: zc(n, o.start, o.end)
		})}
      <div class="dw-legend">
        <span><i style="background:${Ic}"></i>innen</span>
        <span><i style="background:${Lc}"></i>außen</span>
        <span><i class="dw-box" style="background:${Rc.now}"></i>Jetzt lüften</span>
        <span><i class="dw-box" style="background:${Rc.possible}"></i>Lüften möglich</span>
      </div>
      <p class="dw-hint">${j(k.drop, 13, "rgba(255,255,255,0.6)", 2.2)}Lüften trocknet, wenn der Taupunkt draußen unter dem im Raum liegt.</p>
    `
	});
}
var Vc = o`
  .dw-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px 14px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
  }
  .dw-legend span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .dw-legend i {
    display: block;
    width: 14px;
    height: 3px;
    border-radius: 2px;
  }
  .dw-legend i.dw-box {
    height: 10px;
    border-radius: 3px;
  }
  .dw-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    padding: 0 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }
`, Hc = "#ff9f0a", Uc = "#ffd60a";
function Wc(e, t, n, r, i) {
	return C`
    <div class="cr-row">
      <button class="cr-main" @click=${() => e.moreInfo(t.id)}>
        <span class="circle" style="width:40px;height:40px;background:${r}">${j(n, 18, "#141008", 2.2)}</span>
        <span class="cr-text"><span class="cr-name ellipsis">${t.name}</span><span class="cr-detail">${t.detail}</span></span>
      </button>
      ${t.reset ? C`<button class="cr-act" style="background:${r}" @click=${() => e.confirm({
		title: t.name,
		text: i.text,
		confirm: i.button,
		color: r,
		iconPath: n,
		onConfirm: () => e.call("button", "press", {}, { entity_id: t.reset })
	})}>${i.button}</button>` : i.hint ? C`<span class="cr-hint">${i.hint}</span>` : E}
    </div>`;
}
function Gc(e) {
	let t = Kt(e.hass), n = qt(e.hass, e.config), r = t.length + n.length;
	return M({
		title: "Wartung",
		subtitle: r ? `${r} ${r === 1 ? "Gerät braucht" : "Geräte brauchen"} Aufmerksamkeit` : "Alles in Ordnung",
		color: Hc,
		glow: "rgba(255,159,10,0.22)",
		iconPath: O.battery,
		onClose: e.closeSheet,
		body: C`
      ${t.length ? C`<div class="section-head"><h2>Batterien</h2><span class="rule" aria-hidden="true"></span></div>
            ${t.map((t) => Wc(e, t, O.battery, Hc, {
			text: "Batterie getauscht? Das Datum wird in Battery Notes gespeichert.",
			button: "Getauscht"
		}))}` : E}
      ${n.length ? C`<div class="section-head"><h2>Filter</h2><span class="rule" aria-hidden="true"></span></div>
            ${n.map((t) => Wc(e, t, O.filter, Uc, {
			text: "Filter gereinigt oder getauscht? Der Zähler wird zurückgesetzt.",
			button: "Erledigt",
			hint: "am Gerät zurücksetzen"
		}))}` : E}
      ${r ? E : C`<p class="cr-empty">Keine schwachen Batterien und keine fälligen Filter.</p>`}
    `
	});
}
var Kc = o`
  .cr-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 56px;
    padding: 0 8px 0 6px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.07);
  }
  .cr-main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
  }
  .cr-text {
    min-width: 0;
  }
  .cr-name {
    display: block;
    font-size: 14px;
    font-weight: 600;
  }
  .cr-detail {
    display: block;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.72);
  }
  .cr-act {
    flex-shrink: 0;
    height: 36px;
    padding: 0 14px;
    border-radius: 18px;
    font-size: 13px;
    font-weight: 700;
    color: #141008;
  }
  .cr-hint {
    flex-shrink: 0;
    max-width: 84px;
    font-size: 11px;
    line-height: 1.25;
    text-align: right;
    color: rgba(255, 255, 255, 0.55);
    padding-right: 6px;
  }
  .cr-empty {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    padding: 4px 8px;
  }
`, qc = {
	cool: "Kühlen",
	dry: "Trocknen",
	fan_only: "Lüften",
	heat: "Heizen",
	auto: "Auto",
	heat_cool: "Auto",
	off: "Aus"
}, Jc = [
	"cool",
	"dry",
	"fan_only",
	"heat",
	"auto",
	"heat_cool",
	"off"
], Yc = {
	cool: "Kühlt",
	dry: "Trocknet",
	fan_only: "Lüftet",
	heat: "Heizt",
	auto: "Auto",
	heat_cool: "Auto",
	off: "Aus"
}, Xc = {
	auto: "Auto",
	silent: "Leise",
	quiet: "Leise",
	low: "Niedrig",
	medium: "Mittel",
	middle: "Mittel",
	high: "Hoch",
	max: "Max",
	full: "Max",
	turbo: "Turbo"
}, Zc = {
	none: "Normal",
	away: "Abwesend",
	sleep: "Schlafen",
	boost: "Boost",
	eco: "Eco",
	comfort: "Komfort"
}, Qc = /flust|fluest|silent|quiet|leise/;
function $c(e, t) {
	let n = N(t, "ac"), r = e.states[n];
	if (!r) return null;
	let i = r.attributes, a = Wt(e, n), o = _t(e, n) ?? "", s = (t) => {
		let n = String(e.states[t]?.attributes.friendly_name ?? t);
		return n.startsWith(o) && o ? n.slice(o.length).trim() : n;
	}, c = P(e, a.find((t) => t.startsWith("sensor.") && /aussen|outdoor/.test(t) && e.states[t]?.attributes.device_class === "temperature")), l = P(e, N(t, "ac_power")), u = Number(i.current_temperature), d = Number.isFinite(Number(i.temperature)) && i.temperature !== null ? Number(i.temperature) : null, f = r.state === "off" || d === null || ["dry", "fan_only"].includes(r.state) ? Yc[r.state] ?? r.state : `${Yc[r.state] ?? r.state} auf ${((e) => `${I(e, e % 1 ? 1 : 0)}°`)(d)}`, p = [
		r.state === "unavailable" ? "Offline" : f,
		Number.isFinite(u) ? `innen ${I(u, 1)}°` : "",
		c === null ? "" : `außen ${I(c, 1)}°`,
		l !== null && l >= 1 ? `${I(Math.round(l))} W` : ""
	].filter(Boolean).join(" · "), m = i.hvac_modes ?? [], h = i.fan_modes ?? [], g = i.swing_modes ?? [], _ = a.filter((t) => t.startsWith("switch.") && !e.entities[t]?.hidden).map((t) => ({
		id: t,
		name: s(t),
		on: e.states[t]?.state === "on"
	})).sort((e, t) => Number(Qc.test(t.id)) - Number(Qc.test(e.id)));
	return {
		id: n,
		state: r.state,
		status: p,
		target: d,
		min: Number(i.min_temp) || 16,
		max: Number(i.max_temp) || 30,
		step: Number(i.target_temp_step) || 1,
		modes: Jc.filter((e) => m.includes(e)).map((e) => ({
			id: e,
			name: qc[e]
		})),
		fans: [...h.filter((e) => e === "auto"), ...h.filter((e) => e !== "auto")].map((e) => ({
			id: e,
			name: Xc[e] ?? e
		})),
		fan: String(i.fan_mode ?? ""),
		presets: (i.preset_modes ?? []).map((e) => ({
			id: e,
			name: Zc[e] ?? e
		})),
		preset: String(i.preset_mode ?? ""),
		swing: g.length > 1 && g.includes("off") ? {
			on: !!i.swing_mode && i.swing_mode !== "off",
			onMode: g.find((e) => e !== "off")
		} : null,
		switches: _,
		selfClean: Gt(e, n, /reinigung|clean/)
	};
}
// src/sheets/ac.ts
var el = "#8fd8ff", tl = {
	cool: k.snowflake,
	dry: k.drop,
	fan_only: k.fan,
	heat: k.flame,
	auto: "M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M9 15l3-7 3 7M10 13h4",
	heat_cool: "M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0",
	off: k.power
};
function nl(e) {
	let t = $c(e.hass, e.config);
	if (!t) return E;
	let n = t.state !== "off" && t.state !== "unavailable", r = e.target(t.id) ?? t.target, i = (n, r) => e.call("climate", n, r, { entity_id: t.id }), a = (t, n) => e.call("switch", n ? "turn_off" : "turn_on", {}, { entity_id: t });
	return M({
		title: "Klimaanlage",
		subtitle: t.status,
		color: n ? el : "rgba(255,255,255,0.16)",
		glow: n ? "rgba(100,210,255,0.22)" : "rgba(255,255,255,0.06)",
		iconPath: k.snowflake,
		iconStroke: n ? "#08202c" : "#fff",
		onClose: e.closeSheet,
		body: C`
      <div class="tcard" style="background: linear-gradient(140deg, ${n ? "rgba(100,210,255,0.24)" : "rgba(255,255,255,0.1)"}, rgba(255,255,255,0.05) 70%)">
        <div class="tcontrol">
          <button class="bigstep" aria-label="Soll senken" ?disabled=${r === null} @click=${() => e.stepTarget(t.id, -t.step)}>−</button>
          <div class="tcenter">
            <div class="tstate">${n ? "Soll" : "Aus · Soll"}</div>
            <div class="tbig">${r === null ? "–" : `${H(r, t.step % 1 ? 1 : 0)}°`}</div>
            <div class="tsoll">${t.min}° – ${t.max}°</div>
          </div>
          <button class="bigstep" aria-label="Soll erhöhen" ?disabled=${r === null} @click=${() => e.stepTarget(t.id, t.step)}>+</button>
        </div>
      </div>

      <div class="acs-modes" role="group" aria-label="Betriebsart">
        ${t.modes.map((e) => {
			let n = t.state === e.id;
			return C`<button class="acs-mode ${n ? "active" : ""}" aria-pressed=${n} @click=${() => i("set_hvac_mode", { hvac_mode: e.id })}>
            ${j(tl[e.id] ?? k.power, 18, n ? "#08202c" : "#fff", 2.1)}<span>${e.name}</span>
          </button>`;
		})}
      </div>

      ${t.fans.length ? C`<div class="section-head"><h2>Lüfter</h2><span class="rule" aria-hidden="true"></span></div>
            <div class="acs-seg" role="group" aria-label="Lüfterstufe" style="grid-template-columns: repeat(${t.fans.length}, minmax(0, 1fr))">
              ${t.fans.map((e) => C`<button class=${t.fan === e.id ? "sel" : ""} aria-pressed=${t.fan === e.id}
                @click=${() => i("set_fan_mode", { fan_mode: e.id })}>${e.name}</button>`)}
            </div>` : E}

      ${t.presets.length ? C`<div class="acs-seg" role="group" aria-label="Modus" style="grid-template-columns: repeat(${t.presets.length}, minmax(0, 1fr))">
            ${t.presets.map((e) => C`<button class=${t.preset === e.id ? "sel" : ""} aria-pressed=${t.preset === e.id}
              @click=${() => i("set_preset_mode", { preset_mode: e.id })}>${e.name}</button>`)}
          </div>` : E}

      <div class="acs-toggles">
        ${t.swing ? C`<button class="acs-tog ${t.swing.on ? "on" : ""}" aria-pressed=${t.swing.on}
              @click=${() => i("set_swing_mode", { swing_mode: t.swing.on ? "off" : t.swing.onMode })}>
              <span class="acs-dot"></span><span class="ellipsis">Lamellen schwenken</span></button>` : E}
        ${t.switches.map((e) => C`<button class="acs-tog ${e.on ? "on" : ""}" aria-pressed=${e.on} @click=${() => a(e.id, e.on)}>
          <span class="acs-dot"></span><span class="ellipsis">${e.name}</span></button>`)}
      </div>

      <div class="confirm-row">
        ${t.selfClean ? C`<button class="btn" @click=${() => e.confirm({
			title: "Selbstreinigung",
			text: "Selbstreinigung jetzt starten? Das Gerät läuft dann eine Weile.",
			confirm: "Starten",
			color: el,
			iconPath: k.snowflake,
			onConfirm: () => e.call("button", "press", {}, { entity_id: t.selfClean })
		})}>Selbstreinigung</button>` : E}
        <button class="btn" @click=${() => {
			e.closeSheet(), e.moreInfo(t.id);
		}}>Details</button>
      </div>
    `
	});
}
var rl = o`
  .acs-modes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .acs-mode {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 46px;
    border-radius: 23px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 13px;
    font-weight: 600;
  }
  .acs-mode.active {
    background: #8fd8ff;
    color: #08202c;
  }
  .acs-seg {
    display: grid;
    gap: 4px;
    padding: 4px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.06);
  }
  .acs-seg button {
    height: 36px;
    border-radius: 18px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);
  }
  .acs-seg button.sel {
    background: #fff;
    color: #101218;
  }
  .acs-toggles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .acs-tog {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 46px;
    padding: 0 12px;
    border-radius: 23px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 600;
    text-align: left;
    min-width: 0;
  }
  .acs-tog.on {
    background: rgba(100, 210, 255, 0.2);
  }
  .acs-dot {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.25);
  }
  .acs-tog.on .acs-dot {
    background: #8fd8ff;
    box-shadow: 0 0 8px #8fd8ff;
  }
`, il = 36e5, al = [
	{
		id: "24h",
		name: "24 h"
	},
	{
		id: "7d",
		name: "7 Tage"
	},
	{
		id: "30d",
		name: "30 Tage"
	}
];
function ol(e) {
	return e === "W" ? [{
		id: "4h",
		name: "4 h"
	}, ...al] : al;
}
var sl = {
	pv: {
		name: "PV erzeugt",
		color: "#ffd60a",
		ids: "solar"
	},
	import: {
		name: "Netzbezug",
		color: "#ff9f0a",
		ids: "import"
	},
	export: {
		name: "Eingespeist",
		color: "#64d2ff",
		ids: "export"
	}
}, cl = {
	autarky: {
		name: "Autarkie",
		color: "#7ee8a0",
		kind: "autarky",
		total: "autark"
	},
	selfuse: {
		name: "Eigenverbrauch",
		color: "#ffe066",
		kind: "selfuse",
		total: "selbst genutzt"
	}
};
function ll(e, t, n) {
	if (!t) return [];
	let r = [];
	for (let i = 0; i < 5; i++) {
		let a = new Date(t + (n - t) * i / 5);
		e === "4h" ? r.push(`${String(a.getHours()).padStart(2, "0")}:${String(a.getMinutes()).padStart(2, "0")}`) : e === "24h" ? r.push(`${String(a.getHours()).padStart(2, "0")} Uhr`) : e === "7d" ? r.push(a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")) : r.push(`${a.getDate()}.${a.getMonth() + 1}.`);
	}
	return r;
}
function ul(e, t, n, r, i) {
	if (t === "battery") return fl(e, n);
	let { prefs: a } = e.energy(), o = sl[t], s = cl[t], c = a ? {
		...zi(a),
		...Bi(a)
	} : null, l = "kWh", u, d, f = null, p = !0;
	if (s) l = "share", u = s.name, d = s.color, c && (f = () => ca(e.hass, c, n, s.kind));
	else if (t === "cost") l = "€", u = "Stromkosten", d = "#ff9f0a", a && c && (f = () => pa(e.hass, Vi(a), c, n));
	else if (t === "house") u = "Hausverbrauch", d = "#ffffff", c && (f = () => la(e.hass, c, n));
	else if (o) {
		u = o.name, d = o.color;
		let t = c ? c[o.ids] : [];
		t.length && (f = () => sa(e.hass, t, n));
	} else u = r ?? e.config.names?.[t] ?? R(e.hass, t).replace(/\s*(device\s+)?(power|leistung)$/i, ""), d = "#ff9f0a", p = !1, l = "W", f = () => da(e.hass, t, n);
	let m = l === "share" ? "%" : l, h = f ? e.series(`energy:${t}:${n}:${l}`, f) : {
		loading: p && !a,
		error: a ? "nicht im Energie-Dashboard" : void 0,
		past: [],
		start: 0,
		end: 0
	}, g = h.past.reduce((e, t) => e + t.v, 0), _ = h.past.length ? l === "share" ? h.total == null ? void 0 : `gesamt ${h.total} % ${s.total}` : l === "€" ? `Summe ${I(g, 2)} €${h.total ? ` · Vergütung ${I(h.total, 2)} €` : ""}` : l === "kWh" ? `Summe ${I(g, g < 10 ? 2 : 1)} kWh` : `Ø ${I(g / h.past.length)} W · ${I(ta(h.past, h.step ?? il), 2)} kWh` : void 0, v = n === "4h" ? "5 Min" : n === "24h" ? "Stunde" : "Tag", y = {
		kWh: `kWh pro ${v}`,
		W: `mittlere Leistung pro ${v}`,
		share: `Anteil pro ${v}`,
		"€": `Netzbezug in € pro ${v}`
	}[l];
	return M({
		title: u,
		subtitle: y,
		color: d,
		glow: `${d}33`,
		iconPath: O.bolt,
		onClose: e.closeSheet,
		onBack: i ? () => e.openSheet(i) : void 0,
		body: C`
      <div class="tabs3" role="tablist" aria-label="Zeitraum" style=${`grid-template-columns:repeat(${ol(l).length},minmax(0,1fr))`}>
        ${ol(l).map((a) => C`<button role="tab" aria-selected=${a.id === n} class=${a.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "energyChart",
			key: t,
			range: a.id,
			name: r,
			back: i
		})}>${a.name}</button>`)}
      </div>
      ${Sc({
			title: u,
			color: d,
			unit: m,
			digits: l === "kWh" ? 1 : l === "€" ? 2 : 0,
			snap: l === "kWh" ? .5 : l === "€" ? .25 : m === "%" ? 25 : 10,
			data: h,
			caption: _,
			bars: l === "kWh" || l === "share" || l === "€",
			zero: !0,
			max: m === "%" ? 100 : void 0,
			labels: ll(n, h.start, h.end)
		})}
    `
	});
}
var dl = (e, t, n) => C`
  <div class="tabs3" role="tablist" aria-label="Zeitraum">
    ${al.map((r) => C`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
      @click=${() => e.openSheet({
	id: "energyChart",
	key: t,
	range: r.id
})}>${r.name}</button>`)}
  </div>`;
function fl(e, t) {
	let { prefs: n } = e.energy(), r = n ? Bi(n) : null, i = P(e.hass, N(e.config, "battery_soc")), a = (r, i) => r?.length ? e.series(`energy:battery-${i}:${t}`, () => sa(e.hass, r, t)) : {
		loading: !n,
		error: n ? "kein Akku im Energie-Dashboard" : void 0,
		past: [],
		start: 0,
		end: 0
	}, o = a(r?.batteryIn, "in"), s = a(r?.batteryOut, "out"), c = (e) => e.past.reduce((e, t) => e + t.v, 0), l = (e, n, r) => Sc({
		title: e,
		color: n,
		unit: "kWh",
		digits: 1,
		snap: .5,
		data: r,
		bars: !0,
		zero: !0,
		caption: r.past.length ? `Summe ${I(c(r), c(r) < 10 ? 2 : 1)} kWh` : void 0,
		labels: ll(t, r.start, r.end)
	});
	return M({
		title: "Akku",
		subtitle: `${i === null ? "" : `Ladestand ${I(i)} % · `}kWh pro ${t === "24h" ? "Stunde" : "Tag"}`,
		color: "#30d158",
		glow: "#30d15833",
		iconPath: O.bolt,
		onClose: e.closeSheet,
		body: C`
      ${dl(e, "battery", t)}
      ${l("Geladen", "#30d158", o)}
      ${l("Entladen", "#ffd60a", s)}
    `
	});
}
// src/sheets/airing.ts
function pl(e) {
	let { hass: t, now: n } = e, r = dr(t, e.rooms, e.config, n), i = () => e.runScript(N(e.config, "airing_start")), a = r.active || r.paused, o = a && r.duration ? Math.max(0, Math.min(100, r.remaining / r.duration * 100)) : 100, s = r.paused ? "pausiert" : r.active ? r.remaining > 0 ? "läuft" : "fertig" : "bereit", c = r.recommended.length === 1 ? r.recommended[0] : r.openWindows.length === 1 ? r.openWindows[0] : null;
	return M({
		title: c ? `Lüften · ${c.name}` : "Lüften",
		color: "#5ac8fa",
		glow: "rgba(90,200,250,0.24)",
		iconPath: O.wind,
		iconStroke: "#06202c",
		onClose: e.closeSheet,
		body: C`
      <div class="ringcard">
        <span class="ring" style="background: conic-gradient(#5ac8fa 0 ${o}%, rgba(255,255,255,0.1) ${o}% 100%)">
          <span class="ring-in">
            <span class="ring-time">${U(r.remaining)}</span>
            <span class="ring-status">${s}</span>
          </span>
        </span>
        <div class="ring-info">
          <span><span class="muted">Fenster offen</span> <strong>${r.openWindows.length || "keins"}</strong></span>
          <span><span class="muted">Empfohlen</span> <strong>${r.recommended.length ? `${r.recommended.length} ${r.recommended.length === 1 ? "Raum" : "Räume"}` : "keiner"}</strong></span>
        </div>
      </div>

      ${r.openWindows.length ? C`
          <div class="section-head"><h2>Offene Fenster</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${r.openWindows.map((e) => C`<span class="chip open">${j(O.window, 14, "#ff8a80", 2.4)}${e.name}
              <span class="chip-meta">${z(vt(t, e.window, n))}</span></span>`)}
          </div>` : E}

      ${r.recommended.length ? C`
          <div class="section-head"><h2>Lüften empfohlen</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${r.recommended.map((e) => {
			let n = P(t, e.humidity);
			return C`<span class="chip rec">${j(k.drop, 14, "#8fd8ff", 2.4)}${e.name}${n === null ? E : C`<span class="chip-meta">${I(Math.round(n))} %</span>`}</span>`;
		})}
          </div>` : E}

      ${a ? C`<div class="confirm-row" style="margin-top:4px">
            <button class="btn" @click=${i}>Neu starten</button>
            <button class="btn primary" style="background:#5ac8fa;color:#06202c"
              @click=${() => e.call("timer", "cancel", {}, { entity_id: N(e.config, "airing_timer") })}>Stopp</button>
          </div>` : C`<button class="btn primary" style="background:#5ac8fa;color:#06202c;margin-top:4px"
            @click=${i}>Lüften starten</button>`}
    `
	});
}
var ml = o`
  .ringcard {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 34px;
    background: rgba(90, 200, 250, 0.1);
  }
  .ring {
    flex-shrink: 0;
    width: 112px;
    height: 112px;
    border-radius: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ring-in {
    width: 92px;
    height: 92px;
    border-radius: 46px;
    background: var(--sd-sheet);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .ring-time {
    font-size: 26px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .ring-status {
    font-size: 11px;
    color: #8fd8ff;
  }
  .ring-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
  }
  .muted {
    color: var(--sd-muted);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 12px 0 10px;
    border-radius: 19px;
    font-size: 13px;
    font-weight: 600;
  }
  .chip.open {
    background: rgba(255, 69, 58, 0.16);
  }
  .chip.rec {
    background: rgba(90, 200, 250, 0.16);
  }
  .chip-meta {
    font-weight: 400;
    color: var(--sd-muted);
  }
`;
// src/sheets/alarm.ts
function hl(e) {
	let t = N(e.config, "alarm"), n = e.hass.states[t]?.state ?? "unavailable";
	return M({
		title: Ps(n),
		color: n === "triggered" ? "#ff453a" : "#bf9bff",
		glow: "rgba(191,155,255,0.22)",
		iconPath: Fn(n),
		iconStroke: "#1d1030",
		onClose: e.closeSheet,
		body: C`
      <div class="alarm-grid">
        ${Ns.map((r) => {
			let i = r.state === n;
			return C`
            <button class="alarm-mode ${i ? "active" : ""}" aria-pressed=${i}
              @click=${() => {
				e.call("alarm_control_panel", r.service, {}, { entity_id: t }), e.closeSheet();
			}}>
              <span class="circle" style="width:44px;height:44px;background:${i ? "#1d1030" : "rgba(255,255,255,0.12)"}">
                ${j(O[r.icon], 20, i ? "#bf9bff" : "#e2d3ff", 2.1)}
              </span>
              ${r.name}
            </button>
          `;
		})}
      </div>
      <button class="btn" @click=${() => {
			e.closeSheet(), e.moreInfo(t);
		}}>Details</button>
    `
	});
}
var gl = o`
  .alarm-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .alarm-mode {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 64px;
    padding: 0 10px;
    border-radius: 32px;
    background: var(--sd-fill);
    font-size: 15px;
    font-weight: 700;
  }
  .alarm-mode.active {
    background: #bf9bff;
    color: #1d1030;
  }
`, _l = "\n.maplibregl-ctrl-top-left .maplibregl-ctrl { margin: 10px 0 0 10px !important; }\n.maplibregl-ctrl-group {\n  background: none !important; box-shadow: none !important; border: none !important;\n  display: flex; flex-direction: column; gap: 6px;\n}\n.maplibregl-ctrl-group button {\n  width: 36px !important; height: 36px !important;\n  border: none !important; border-radius: 50% !important;\n  background: rgba(20, 22, 28, 0.72) !important;\n  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) !important;\n}\n.maplibregl-ctrl-group button + button { border-top: none !important; }\n.maplibregl-ctrl-group button .maplibregl-ctrl-icon { filter: brightness(0) invert(1); }\n.maplibregl-ctrl-group button:disabled .maplibregl-ctrl-icon { opacity: 0.35; }\n.maplibregl-ctrl-attrib {\n  background: rgba(20, 22, 28, 0.72) !important; color: rgba(255, 255, 255, 0.7) !important;\n  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n  border-radius: 14px !important; margin: 0 8px 8px 0 !important;\n}\n.maplibregl-ctrl-attrib a { color: rgba(255, 255, 255, 0.8) !important; }\n.maplibregl-ctrl-attrib-button { background-color: transparent !important; filter: brightness(0) invert(1); opacity: 0.7; }\n", vl = class extends HTMLElement {
	constructor(...e) {
		super(...e), this._entities = [];
	}
	set hass(e) {
		this._hass = e, this._map && (this._map.hass = e);
	}
	set entities(e) {
		this._entities = e, this._map && (this._map.entities = e);
	}
	connectedCallback() {
		this._map || (customElements.get("ha-map") ? this._render() : (this._placeholder("Karte wird geladen …"), this._load()));
	}
	async _load() {
		let e = await window.loadCardHelpers?.().catch(() => void 0);
		if (!e) return this._placeholder("Karte nicht verfügbar");
		e.createCardElement({
			type: "map",
			entities: ["zone.home"]
		}), await Promise.race([customElements.whenDefined("ha-map").then(() => !0), new Promise((e) => setTimeout(() => e(!1), 8e3))]) ? this._render() : this._placeholder("Karte nicht verfügbar");
	}
	_placeholder(e) {
		this.replaceChildren(Object.assign(document.createElement("div"), {
			className: "map-ph",
			textContent: e
		}));
	}
	_render() {
		let e = document.createElement("ha-map");
		Object.assign(e, {
			hass: this._hass,
			entities: this._entities,
			autoFit: !0,
			fitZones: !1,
			themeMode: "dark",
			zoom: 14
		}), e.style.cssText = "display:block;width:100%;height:100%", this._map = e, this.replaceChildren(e), this._styleControls(e);
	}
	async _styleControls(e) {
		await e.updateComplete;
		let t = e.shadowRoot;
		if (!t || t.querySelector("style.sd-map")) return;
		let n = document.createElement("style");
		n.className = "sd-map", n.textContent = _l, t.appendChild(n);
	}
};
customElements.get("start-dashboard-map") || customElements.define("start-dashboard-map", vl);
// src/sheets/persons.ts
var yl = "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0";
function bl(e) {
	let { hass: t } = e, n = Gs(t, e.config), r = Object.keys(t.states).filter((e) => e.startsWith("zone.")), i = [...n.map((e) => ({
		entity_id: e.id,
		color: ks[e.place],
		focus: !0
	})), ...r.map((e) => ({
		entity_id: e,
		focus: !1
	}))];
	return M({
		title: "Personen",
		subtitle: Ks(n),
		color: "#30d158",
		glow: "rgba(48,209,88,0.2)",
		iconPath: yl,
		iconStroke: "#0b1a10",
		onClose: e.closeSheet,
		body: C`
      <div class="ps-map"><start-dashboard-map .hass=${t} .entities=${i}></start-dashboard-map></div>
      <div class="ps-list">
        ${n.map((n) => {
			let r = t.states[n.id];
			return C`<div class="ps-row">
            ${Ms(n, 44)}
            <span class="ps-text">
              <span class="ps-name">${n.name}</span>
              <span class="ps-sub">${n.zoneName}${r ? ` · ${qs(r.last_changed, e.now)}` : ""}</span>
            </span>
          </div>`;
		})}
      </div>
    `
	});
}
var xl = o`
  .ps-map {
    height: 260px;
    border-radius: 22px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.06);
  }
  .ps-map start-dashboard-map {
    display: block;
    height: 100%;
  }
  .map-ph {
    display: grid;
    place-items: center;
    height: 100%;
    font-size: 13px;
    color: var(--sd-muted);
  }
  .ps-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }
  .ps-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 22px;
    background: var(--sd-fill);
  }
  .ps-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .ps-name {
    font-size: 15px;
    font-weight: 700;
  }
  .ps-sub {
    font-size: 12px;
    color: var(--sd-muted);
  }
`, Sl = [
	"Dauerhaft",
	"1 h",
	"2 h",
	"4 h"
], Cl = 7, wl = 25;
async function Tl(e) {
	let t = e.allRooms, n = e.config;
	await e.call("input_number", "set_value", { value: t.temp }, { entity_id: N(n, "all_rooms_temperature") }), await e.call("input_text", "set_value", { value: fr(e.rooms, t.selected) }, { entity_id: N(n, "all_rooms_selection") }), await e.call("input_select", "select_option", { option: t.duration }, { entity_id: N(n, "all_rooms_duration") }), await e.runScript(N(n, "all_rooms_apply"));
}
function El(e) {
	let t = e.allRooms, n = ar(e.hass, e.rooms), r = (n) => e.setAllRooms({ temp: Math.min(wl, Math.max(Cl, Math.round((t.temp + n) * 2) / 2)) }), i = (n) => {
		let r = new Set(t.selected);
		r.has(n) ? r.delete(n) : r.add(n), e.setAllRooms({ selected: r });
	}, a = t.selected.size;
	return M({
		title: "Alle Räume einstellen",
		color: "#ffffff",
		glow: "rgba(255,159,10,0.2)",
		iconPath: k.tune,
		iconStroke: "#101218",
		onClose: e.closeSheet,
		body: C`
      <div class="arcontrol">
        <button class="bigstep" aria-label="Senken" @click=${() => r(-.5)}>−</button>
        <div style="text-align:center">
          <div class="arbig">${I(t.temp, 1)}°</div>
          <div class="arsub">Soll für ${a} ${a === 1 ? "Raum" : "Räume"}</div>
        </div>
        <button class="bigstep" aria-label="Erhöhen" @click=${() => r(.5)}>+</button>
      </div>

      <div class="section-head">
        <h2 style="font-size:14px">Räume</h2>
        <span class="rule" aria-hidden="true"></span>
        ${n.filter((e) => e.id).map((t) => C`<button class="mini"
          @click=${() => e.setAllRooms({ selected: new Set(t.rooms.map((e) => e.slug)) })}>nur ${t.short}</button>`)}
        <button class="mini" @click=${() => e.setAllRooms({ selected: new Set(e.rooms.map((e) => e.slug)) })}>alle</button>
      </div>
      <div class="chips">
        ${e.rooms.map((e) => {
			let n = t.selected.has(e.slug);
			return C`<button class="rchip ${n ? "on" : ""}" aria-pressed=${n} @click=${() => i(e.slug)}>
            ${n ? j(O.check, 14, "#ffc061", 2.8) : ""}${e.name}</button>`;
		})}
      </div>

      <div class="section-head"><h2 style="font-size:14px">Wie lange</h2><span class="rule" aria-hidden="true"></span></div>
      <div class="durations" role="radiogroup" aria-label="Dauer">
        ${Sl.map((n) => C`<button role="radio" aria-checked=${t.duration === n} class=${t.duration === n ? "sel" : ""}
          @click=${() => e.setAllRooms({ duration: n })}>${n}</button>`)}
      </div>

      <button class="btn primary apply" ?disabled=${a === 0}
        @click=${async () => {
			await Tl(e), e.closeSheet();
		}}>Übernehmen</button>
    `
	});
}
var Dl = o`
  .arcontrol {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-radius: 34px;
    background: linear-gradient(140deg, rgba(255, 159, 10, 0.28), rgba(255, 255, 255, 0.05) 70%);
  }
  .arbig {
    font-size: 60px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .arsub {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 4px;
  }
  .mini {
    height: 28px;
    padding: 0 10px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 11px;
    font-weight: 600;
  }
  .rchip {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 12px;
    border-radius: 19px;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.75);
    font-size: 13px;
    font-weight: 600;
  }
  .rchip.on {
    padding-left: 8px;
    background: rgba(255, 159, 10, 0.22);
    color: #ffd29a;
  }
  .durations {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
  }
  .durations button {
    height: 44px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .durations button.sel {
    background: #fff;
    color: #101218;
  }
  .apply {
    height: 56px;
    border-radius: 28px;
    background: #ff9f0a;
    color: #1a1206;
    margin-top: 6px;
  }
  .apply:disabled {
    opacity: 0.4;
  }
`, Ol = 300, kl = 20, Al = 120, jl = [
	{
		id: "24h",
		name: "24 h"
	},
	{
		id: "7d",
		name: "7 Tage"
	},
	{
		id: "30d",
		name: "30 Tage"
	}
];
function Ml(e, t, n) {
	let r = [];
	for (let i = 0; i < 4; i++) {
		let a = new Date(t + (n - t) * i / 4);
		e === "24h" ? r.push(i === 0 ? `${a.getHours()} Uhr` : String(a.getHours()).padStart(2, "0")) : e === "7d" ? r.push(a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")) : r.push(`${a.getDate()}.${a.getMonth() + 1}.`);
	}
	return r.push("jetzt"), r;
}
function Nl(e, t, n) {
	let r = e === "temp", i = r ? "#ff9f0a" : "#5ac8fa", a = r ? mr(t, Ol, kl, Al, .3, .3, 1) : mr(t, Ol, kl, Al, 1, 1, 2), o = t.map((e) => e.v), s = o[o.length - 1], c = r ? "°" : " %", l = (e) => r ? I(e, 1) : I(Math.round(e)), u = o.length ? `${l(Math.min(...o))}${r ? "°" : ""} – ${l(Math.max(...o))}${c} · jetzt ${l(s)}${c}` : "keine Daten", d = (a.lo + a.hi) / 2, f = t.length > 1 ? t[t.length - 1].t - t[0].t : 0, p = n === "30d" ? 864e5 : 36e5, m = t.map((e, n) => ({
		x: Math.round(n / Math.max(1, t.length - 1) * Ol * 10) / 10,
		y: a.y(e.v),
		time: cc(e.t, {
			step: p,
			span: f
		}),
		value: `${l(e.v)}${c}`
	})), h = a.y(60), g = !r && 60 > a.lo && 60 < a.hi;
	return C`
    <figure class="fig" style="background:${r ? "rgba(255,159,10,0.08)" : "rgba(90,200,250,0.08)"}">
      <figcaption>
        <span style="font-size:14px;font-weight:600;color:${r ? "#ffc061" : "#8fd8ff"}">${r ? "Temperatur" : "Luftfeuchte"}</span>
        <span class="cap">${u}</span>
      </figcaption>
      <div class="sc-wrap" ${hc({
		points: m,
		width: 338,
		height: 140,
		color: i
	})}>
      <svg width="100%" viewBox="0 0 338 140" role="img" aria-label="${r ? "Temperaturverlauf" : "Luftfeuchteverlauf"}: ${u}">
        ${r ? w`${[
		a.hi,
		d,
		a.lo
	].map((e) => w`
              <line x1="0" y1=${a.y(e)} x2="338" y2=${a.y(e)} stroke="rgba(255,255,255,0.08)"></line>
              <text x="334" y=${a.y(e) - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${I(e, e % 1 ? 1 : 0)}°</text>`)}` : w`
              ${g ? w`
                <rect x="0" y=${kl} width="338" height=${Math.max(0, h - kl)} fill="rgba(255,255,255,0.04)"></rect>
                <line x1="0" y1=${h} x2="338" y2=${h} stroke="rgba(90,200,250,0.5)" stroke-dasharray="4 4"></line>
                <text x="4" y=${h - 4} fill="rgba(143,216,255,0.85)" font-size="10">60 % Lüftgrenze</text>` : E}
              <line x1="0" y1=${Al} x2="338" y2=${Al} stroke="rgba(255,255,255,0.08)"></line>
              <text x="334" y=${16} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${I(a.hi)} %</text>
              <text x="334" y=${116} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${I(a.lo)} %</text>`}
        ${a.area ? w`<polygon points=${a.area} fill=${r ? "rgba(255,159,10,0.16)" : "rgba(90,200,250,0.16)"}></polygon>` : E}
        ${a.line ? w`<polyline points=${a.line} fill="none" stroke=${i} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>` : E}
        ${a.last ? w`<circle cx=${a.last.x} cy=${a.last.y} r="4.5" fill=${i} stroke="#181a22" stroke-width="2"></circle>` : E}
      </svg>
      <div class="sc-layer"></div>
      </div>
    </figure>
  `;
}
function Pl(e, t, n) {
	let r = e.rooms.find((e) => e.slug === t);
	if (!r) return E;
	let i = e.history(t, n), a = n === "24h" && !i.loading ? hr(i.hum, i.temp) : null, o = Ml(n, i.start, i.end);
	return M({
		title: `${r.name} · Verlauf`,
		subtitle: n === "30d" ? "Tagesmittel" : "Stundenmittel",
		color: "#ff9f0a",
		glow: "rgba(255,159,10,0.12)",
		iconPath: O.thermo,
		onClose: e.closeSheet,
		onBack: () => e.openSheet({
			id: "room",
			slug: t
		}),
		body: C`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${jl.map((r) => C`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "history",
			slug: t,
			range: r.id
		})}>${r.name}</button>`)}
      </div>
      ${i.loading ? C`<div class="hist-msg">Lade Verlauf …</div>` : i.error ? C`<div class="hist-msg">Verlauf nicht verfügbar: ${i.error}</div>` : C`
            ${Nl("temp", i.temp, n)}
            <div>
              ${Nl("hum", i.hum, n)}
              <div class="xlabels">${o.map((e) => C`<span>${e}</span>`)}</div>
            </div>
            ${a ? C`<div class="insight">${j(O.wind, 16, "#8fd8ff", 2.2)}<span>${a}</span></div>` : E}`}
    `
	});
}
var Fl = o`
  .tabs3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
    padding: 4px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.06);
  }
  .tabs3 button {
    height: 38px;
    border-radius: 19px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .tabs3 button.sel {
    background: #fff;
    color: #101218;
  }
  .fig {
    margin: 0;
    padding: 14px 12px 10px;
    border-radius: 28px;
  }
  .fig figcaption {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0 4px 6px;
  }
  .cap {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
  }
  .xlabels {
    display: flex;
    justify-content: space-between;
    padding: 4px 16px 0;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
  }
  .insight {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    padding: 8px 14px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.06);
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
  }
  .hist-msg {
    padding: 40px 10px;
    text-align: center;
    color: var(--sd-muted);
    font-size: 14px;
  }
`;
// src/sheets/room.ts
function Il(e) {
	let t = (e, t, n) => ({
		value: e,
		label: "Fenster",
		icon: O.window,
		c: t,
		tint: n
	});
	switch (e.kind) {
		case "airing": return t(e.remaining > 0 ? `lüftet ${U(e.remaining)}` : "lüftet", "#5ac8fa", "rgba(90,200,250,0.14)");
		case "overdue": return t(`offen ${z(e.openMin)} · ${e.reason}`, "#ff6b61", "rgba(255,69,58,0.14)");
		case "stuck": return t("Sensor prüfen", "#aeb4c0", "rgba(255,255,255,0.07)");
		case "open": return t("offen (ignoriert)", "#aeb4c0", "rgba(255,255,255,0.07)");
		default: return t("zu", "#7ee8a0", "rgba(255,255,255,0.07)");
	}
}
function Ll(e, t) {
	let { hass: n } = e, r = e.rooms.find((e) => e.slug === t);
	if (!r) return E;
	let i = nr(n, r, e.target(r.climate)), a = r.climate, o = fn(r.window ? e.window(r) : {
		kind: "none",
		openMin: 0,
		remaining: 0
	}, i.heating), s = {
		alert: "#ff453a",
		vent: "#5ac8fa",
		heat: "#ff9f0a",
		"": "rgba(255,255,255,0.16)"
	}[o], c = {
		alert: "rgba(255,69,58,0.2)",
		vent: "rgba(90,200,250,0.2)",
		heat: "rgba(255,159,10,0.2)",
		"": "rgba(255,255,255,0.06)"
	}[o], l = e.heating().find((e) => e.slug === r.slug), u = l ? `Heizung prüfen · +${I(l.rise, 1)}° in ${l.hours} h ohne Heizbedarf` : i.off ? "Aus" : i.heating ? `heizt${i.valve === null ? "" : ` · Ventile ${i.valve} %`}` : "Soll erreicht", d = vi(n, r), f = bi(n, d.map((e) => e.id), e.sceneConfigs(), e.now), p = _i(n, r, e.config.names), m = P(n, N(e.config, "outdoor_dew")), h = F(n, N(e.config, "airing_timer")) === "active", g = [
		i.pm25 === null ? null : {
			value: I(i.pm25),
			label: "PM2.5",
			icon: k.leaf,
			c: i.aq,
			tint: i.aq + "1f"
		},
		i.dew === null ? null : {
			value: `${I(i.dew, 1)}°`,
			label: "Taupunkt",
			icon: k.drop,
			c: "#8fd8ff",
			tint: "rgba(143,216,255,0.12)",
			tap: () => e.openSheet({
				id: "dew",
				slug: t,
				range: "24h"
			})
		},
		r.window ? Il(e.window(r)) : null
	].filter((e) => !!e), _ = [i.dew === null ? "" : `Taupunkt ${I(i.dew, 1)}°`, m === null ? "" : `außen ${I(m, 1)}°`].filter(Boolean).join(" vs. ");
	return M({
		title: r.name,
		color: s,
		glow: c,
		iconPath: Ve(r.name, r.icon),
		iconStroke: o ? "#1a1206" : "#fff",
		onClose: e.closeSheet,
		headerExtra: C`
      <button class="histpill" aria-label="Verlauf Temperatur und Luftfeuchte"
        @click=${() => e.openSheet({
			id: "history",
			slug: t,
			range: "24h"
		})}>
        ${j(O.thermo, 14, "#ffc061", 2.4)}${H(i.cur)}°
        ${j(k.drop, 14, "#8fd8ff", 2.4)}${i.hum ?? "–"} %
        ${j(k.trend, 12, "rgba(255,255,255,0.7)", 2.6)}
      </button>`,
		body: C`
      <div class="tcard" style="background: linear-gradient(140deg, ${i.heating ? "rgba(255,159,10,0.3)" : "rgba(255,255,255,0.1)"}, rgba(255,255,255,0.05) 70%)">
        <div class="tcontrol">
          <button class="bigstep" aria-label="Soll senken" ?disabled=${!a} @click=${() => a && e.stepTarget(a, -.5)}>−</button>
          <div class="tcenter">
            <div class="tstate" style="color:${l ? "#ff9f0a" : i.heating ? "#ffd29a" : "rgba(255,255,255,0.75)"}">
              ${i.heating ? j(k.flame, 13, "#ffd29a", 2.4) : E}${u}
            </div>
            <div class="tbig" style="color:${i.heating ? "#ffc061" : "#fff"}">${H(i.target)}°</div>
            <div class="tsoll">Ist <strong>${H(i.cur)}°</strong></div>
          </div>
          <button class="bigstep" aria-label="Soll erhöhen" ?disabled=${!a} @click=${() => a && e.stepTarget(a, .5)}>+</button>
        </div>
        ${a ? C`<div class="presets" role="group" aria-label="Preset">
              ${er.map((t) => {
			let n = i.preset === t.id, r = i.presetTemps[t.id];
			return C`
                  <button class="rpreset ${n ? "active" : ""}" aria-pressed=${n}
                    @click=${() => e.call("climate", "set_preset_mode", { preset_mode: t.id }, { entity_id: a })}>
                    <span class="circle" style="width:32px;height:32px;background:${t.color}">${j(Ue[t.id], 16, "#101010", 2.3)}</span>
                    <span class="pname">${t.name}</span>
                    <span class="ptemp">${r === void 0 ? "–" : `${I(r, r % 1 ? 1 : 0)}°`}</span>
                  </button>`;
		})}
            </div>` : E}
      </div>

      ${d.length ? C`<div class="grid3" role="group" aria-label="Szenen">
            ${d.map((t, n) => {
			let r = t.off ? "rgba(255,255,255,0.14)" : ct[n % ct.length], i = t.off ? "#fff" : "#101010", a = f.has(t.id);
			return C`<button class="scene ${a ? "on" : ""}" aria-pressed=${a} style=${a ? `background:${t.off ? "rgba(255,255,255,0.2)" : r + "33"};box-shadow:0 0 18px ${t.off ? "rgba(255,255,255,0.08)" : r + "40"}` : ""}
                @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>
                <span class="circle" style="width:36px;height:36px;background:${r}">${t.off ? j(k.power, 16, i, 2.1) : lt(t.icon, k.scene, i)}</span>
                <span class="ellipsis">${t.name}</span>
              </button>`;
		})}
          </div>` : E}

      ${g.length ? C`<div class="facts" style="grid-template-columns: repeat(${g.length}, minmax(0, 1fr))">
            ${g.map((e) => {
			let t = C`${j(e.icon, 18, e.c, 2)}<span class="fv">${e.value}</span><span class="fl">${e.label}</span>`;
			return "tap" in e && e.tap ? C`<button class="fact" style="background:${e.tint}" aria-label="${e.label}, Verlauf anzeigen" @click=${e.tap}>${t}</button>` : C`<div class="fact" style="background:${e.tint}">${t}</div>`;
		})}
          </div>` : E}

      ${i.airing ? C`<div class="airrow">
            <span class="circle" style="width:40px;height:40px;background:rgba(90,200,250,0.25)">${j(O.wind, 18, "#8fd8ff", 2.2)}</span>
            <span class="grow"><span class="t1s">${h ? "Lüften läuft" : i.airing}</span><span class="t2s">${_}</span></span>
            ${h ? C`<button class="airbtn" @click=${() => e.openSheet({ id: "airing" })}>Ansehen</button>` : i.airing === "Nicht lüften" ? E : C`<button class="airbtn" @click=${() => {
			e.runScript(N(e.config, "airing_start")), e.openSheet({ id: "airing" });
		}}>Start</button>`}
          </div>` : E}

      ${p.length ? C`<div class="grid2">
            ${p.map((n) => {
			let r = n.kind === "light" ? Ei(e.hass.states[n.id]?.attributes ?? {}) : null, i = r ? r.color : "#30d158";
			return C`<button class="dev ${n.on ? "on" : ""} ${n.unavailable ? "na" : ""}" style=${n.on ? `background:${r ? r.bg : `${i}24`}` : ""}
                ${Lr({
				tap: () => ts(e, n.id),
				hold: () => e.openSheet({
					id: "device",
					entity: n.id,
					back: {
						id: "room",
						slug: t
					}
				})
			})}>
                <span class="circle" style="width:38px;height:38px;background:${n.on ? i : "rgba(255,255,255,0.12)"}">${La(n, e.hass.states[n.id]?.attributes, 16, n.on ? r ? r.icon : "#0b1a10" : "#fff", 2)}</span>
                <span class="devtext"><span class="t1s ellipsis">${n.name}</span><span class="t2s ellipsis">${n.status}</span></span>
              </button>`;
		})}
          </div>` : E}
    `
	});
}
var Rl = o`
  .histpill {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    height: 40px;
    padding: 0 12px;
    border-radius: 20px;
    background: var(--sd-fill-2);
    font-size: 13px;
    font-weight: 700;
  }
  .tcard {
    border-radius: 34px;
    padding: 18px 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .tcontrol {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bigstep {
    width: 56px;
    height: 56px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.14);
    font-size: 28px;
    text-align: center;
    touch-action: manipulation;
  }
  .bigstep:disabled {
    opacity: 0.4;
  }
  .tcenter {
    text-align: center;
  }
  .tstate {
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .tbig {
    font-size: 56px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.05;
  }
  .tsoll {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }
  .presets {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
  }
  .rpreset {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 2px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.1);
  }
  .rpreset.active {
    background: rgba(255, 255, 255, 0.28);
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);
  }
  .pname {
    font-size: 12px;
    font-weight: 600;
  }
  .ptemp {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.75);
  }
  .grid3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .grid2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .scene {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 8px 0 6px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 600;
    min-width: 0;
  }
  .facts {
    display: grid;
    gap: 6px;
  }
  .fact {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 2px;
    border-radius: 22px;
  }
  .fv {
    font-size: 13px;
    font-weight: 700;
  }
  .fl {
    font-size: 11px;
    color: var(--sd-muted);
  }
  .airrow {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 56px;
    padding: 0 8px;
    border-radius: 28px;
    background: rgba(90, 200, 250, 0.1);
    border: 1px solid rgba(90, 200, 250, 0.25);
  }
  .t1s {
    display: block;
    font-size: 14px;
    font-weight: 600;
  }
  .t2s {
    display: block;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
  }
  .airbtn {
    flex-shrink: 0;
    height: 36px;
    padding: 0 14px;
    border-radius: 18px;
    background: #5ac8fa;
    color: #06202c;
    font-size: 13px;
    font-weight: 700;
  }
  .dev {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 50px;
    padding: 0 6px;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.06);
    min-width: 0;
    touch-action: manipulation;
  }
  .dev.na {
    background: transparent;
    border: 1.5px dashed rgba(255, 255, 255, 0.2);
    opacity: 0.7;
  }
  .devtext {
    min-width: 0;
    text-align: left;
  }
`, zl = "#30d158", Bl = "#ff453a", Vl = "#ffd60a", Hl = "#ff9f0a";
function Ul(e) {
	return e ? {
		text: `${e} ${e === 1 ? "Meldung" : "Meldungen"}`,
		alert: !0
	} : {
		text: "alles in Ordnung",
		alert: !1
	};
}
function Wl(e) {
	let t = Math.max(0, Math.round(e));
	return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
function Gl(e, t) {
	let n = { entity_id: t.entity };
	if (t.kind === "paused") return C`
      <div class="tk-pause">
        ${j(k.clock, 18, Vl, 2)}
        <span class="tk-grow">Pausiert noch ${Wl(t.remainingSec ?? 0)} min</span>
        <button class="tk-btn" style="background:${Vl};color:#2b2200"
          @click=${() => {
		e.call("switch", "turn_on", {}, n), e.setPiholePause(void 0);
	}}>Fortsetzen</button>
      </div>`;
	if (t.kind === "off") return C`
      <div class="tk-row tk-alert">
        <span class="circle" style="width:42px;height:42px;background:${Bl}">${j(O.shieldOff, 18, "#1f0606", 2.2)}</span>
        <span class="tk-grow"><span class="tk-title">Werbeblocker aus</span>
          <span class="tk-sub">Pi-hole · seit ${Lo(t.offSince ?? e.now.getTime(), e.now)}</span></span>
        <button class="tk-btn" style="background:${Bl};color:#1f0606" @click=${() => e.call("switch", "turn_on", {}, n)}>Einschalten</button>
      </div>`;
	let r = (t, r) => () => {
		e.call("pi_hole", "disable", { duration: t }, n), e.setPiholePause(e.now.getTime() + r);
	};
	return C`
    <div class="tk-card tk-ok">
      <span class="tk-line">
        <span class="circle" style="width:40px;height:40px;background:${zl}">${j(O.shieldOk, 18, "#06200e", 2.2)}</span>
        <span class="tk-grow"><span class="tk-title">Werbeblocker an</span>
          <span class="tk-sub">${t.percent === void 0 ? "Pi-hole" : `heute ${I(t.percent, +(t.percent < 1))} % aller Anfragen blockiert`}</span></span>
      </span>
      <div class="tk-two">
        <button class="tk-btn soft" @click=${r("00:05:00", 3e5)}>5 min pausieren</button>
        <button class="tk-btn soft" @click=${r("01:00:00", 36e5)}>1 h pausieren</button>
      </div>
    </div>`;
}
var Kl = {
	down: [
		Bl,
		"rgba(255,69,58,0.25)",
		"#ff8a80"
	],
	pending: [
		Vl,
		"rgba(255,214,10,0.2)",
		"#ffe680"
	],
	cert: [
		Hl,
		"rgba(255,159,10,0.2)",
		"#ffc061"
	],
	ok: [
		zl,
		"rgba(48,209,88,0.18)",
		"rgba(255,255,255,0.6)"
	]
};
function ql(e) {
	let [t, n, r] = Kl[e.kind], i = e.kind === "ok" && e.members ? `${e.members} Monitore` : e.text;
	return C`
    <div class="tk-srv">
      <span class="tk-dot" style="background:${t};box-shadow:0 0 0 3px ${n}"></span>
      <span class="tk-sn ellipsis">${e.name}</span>
      <span class="tk-ss" style="color:${r}">${i}</span>
    </div>`;
}
function Jl(e, t) {
	let n = !!e.ui.servicesOpen, r = () => e.setUi({ servicesOpen: !n }), i = t.problems.length ? `${t.ok.length} weitere erreichbar` : `alle ${t.total} erreichbar`;
	return C`
    <div class="tk-card">
      <span class="tk-cardhead"><span class="tk-grow tk-h">Dienste</span><span class="tk-sub">${t.okMonitors} von ${t.total} ok · Uptime Kuma</span></span>
      ${t.problems.map(ql)}
      ${t.ok.length ? C`<button class="tk-srv tk-more" aria-expanded=${n ? "true" : "false"} @click=${r}>
            <span class="tk-dot" style="background:${zl};box-shadow:0 0 0 3px rgba(48,209,88,0.18)"></span>
            <span class="tk-sn ellipsis tk-dim">${i}</span>
            <span class="tk-chev ${n ? "open" : ""}">${j(O.chevron, 14, "rgba(255,255,255,0.5)", 2.4)}</span>
          </button>
          ${n ? t.ok.map(ql) : E}` : E}
    </div>`;
}
function Yl(e, t) {
	let n = t.qr ? e.hass.states[t.qr]?.attributes.entity_picture : void 0, r = { entity_id: t.entity }, i = t.clients === void 0 ? "" : ` · ${I(t.clients)} ${t.clients === 1 ? "Gerät" : "Geräte"}`;
	return C`
    <div class="tk-card tk-guest">
      ${n && t.on ? C`<img class="tk-qr" src=${n} alt="QR-Code Gäste-WLAN" data-entity=${t.qr} />` : E}
      <div class="tk-guest-main">
        <span class="tk-title">Gäste-WLAN</span>
        <span class="tk-state"><span class="tk-dot small" style="background:${t.on ? zl : "rgba(255,255,255,0.35)"}"></span>${t.on ? `an${i}` : "aus"}</span>
        ${n && t.on ? C`<span class="tk-sub">Code scannen zum Verbinden</span>` : E}
        <div class="tk-guest-act">
          <button class="tk-btn soft tk-grow" @click=${() => e.call("switch", t.on ? "turn_off" : "turn_on", {}, r)}>${t.on ? "Ausschalten" : "Einschalten"}</button>
          ${t.regenerate ? C`<button class="tk-btn soft tk-icon" aria-label="Neues Passwort erzeugen" @click=${() => e.confirm({
		title: "Neues WLAN-Passwort",
		text: "Das Gäste-WLAN bekommt ein neues Passwort. Verbundene Gäste müssen den neuen Code scannen.",
		confirm: "Erzeugen",
		color: zl,
		iconPath: O.wifi,
		onConfirm: () => e.call("button", "press", {}, { entity_id: t.regenerate })
	})}>${j(O.refresh, 16, "#fff", 2.2)}</button>` : E}
        </div>
      </div>
    </div>`;
}
function Xl(e, t, n, r = "") {
	if (!t.plug) return E;
	let i = F(e.hass, t.plug) === "on", a = i && Do(e.hass, t, n), o = { entity_id: t.plug };
	return C`
    <button class="tk-power ${r} ${a ? "locked" : ""} ${i ? "on" : "off"}" aria-label=${a ? "Ausschalten gesperrt" : i ? "Drucker ausschalten" : "Drucker einschalten"} ?disabled=${a} @click=${() => {
		if (!a) {
			if (!i) return e.call("switch", "turn_on", {}, o);
			e.confirm({
				title: "3D-Drucker ausschalten",
				text: "Die Steckdose des Druckers wird ausgeschaltet.",
				confirm: "Ausschalten",
				color: Bl,
				iconPath: O.power,
				onConfirm: () => e.call("switch", "turn_off", {}, o)
			});
		}
	}}>
      ${j(O.power, 16, a ? "rgba(255,255,255,0.4)" : i ? "#fff" : "#7ee8a0", 2.4)}
      ${a ? C`<span class="tk-lock">${j(O.lock, 10, "#ffc061", 2.4)}</span>` : E}
    </button>`;
}
function Zl(e, t) {
	let n = new Date(t.at).toDateString() === e.now.toDateString(), r = Ro(t.at, e.now), i = t.stale ? `letztes erfolgreiches vor ${z(Math.round(t.ageH * 60))}` : `letztes erfolgreiches ${n ? "heute " : ""}${r}`, a = t.stale ? Bl : zl;
	return C`
    <div class="tk-row ${t.stale ? "tk-alert" : ""}">
      <button class="tk-grow tk-line" @click=${() => e.moreInfo(t.entity)}>
        <span class="circle" style="width:40px;height:40px;background:${a}">${j(t.stale ? O.alert : O.check, 18, t.stale ? "#1f0606" : "#06200e", 2.2)}</span>
        <span class="tk-grow"><span class="tk-title">Backup</span><span class="tk-sub">${i}</span></span>
      </button>
    </div>`;
}
function Ql(e, t, n) {
	return C`
    <div class="tk-row tk-printer">
      <button class="tk-grow tk-line" @click=${() => e.openSheet({ id: "printer" })}>
        <span class="circle" style="width:40px;height:40px;background:rgba(255,255,255,0.12)">${j(O.printer, 18, "#fff", 2)}</span>
        <span class="tk-grow"><span class="tk-title">3D-Drucker</span><span class="tk-sub">${n.status}</span></span>
      </button>
      ${Xl(e, t, n)}
    </div>`;
}
function $l(e) {
	let { hass: t, config: n, now: r } = e;
	if (!ro(t, n)) return E;
	let i = Ul(Ho(t, n, r, {
		dismissed: e.dismissed,
		pauseUntil: e.piholePause
	})), a = fo(t, n, r, e.piholePause), o = co(t, n, r), s = po(t, n), c = mo(t, n, r), l = vo(t, n), u = l ? To(t, l, r, e.dismissed) : void 0;
	return M({
		title: "Technik",
		subtitle: i.text,
		color: i.alert ? Bl : zl,
		glow: i.alert ? "rgba(255,69,58,0.2)" : "rgba(48,209,88,0.16)",
		iconPath: O.server,
		iconStroke: i.alert ? "#1f0606" : "#06200e",
		onClose: e.closeSheet,
		body: C`
      ${a ? Gl(e, a) : E}
      ${o.total ? Jl(e, o) : E}
      ${s ? Yl(e, s) : E}
      ${c ? Zl(e, c) : E}
      ${l && u ? Ql(e, l, u) : E}
    `
	});
}
var eu = o`
  .tk-grow { flex: 1; min-width: 0; }
  .tk-title { display: block; font-size: 15px; font-weight: 700; }
  .tk-sub { display: block; font-size: 12px; color: rgba(255, 255, 255, 0.72); }
  .tk-h { font-size: 14px; font-weight: 600; }
  .tk-line { display: flex; align-items: center; gap: 10px; text-align: left; }
  .tk-row { display: flex; align-items: center; gap: 10px; min-height: 60px; padding: 0 8px; border-radius: 30px; background: rgba(255, 255, 255, 0.06); }
  .tk-alert { border: 1px solid rgba(255, 69, 58, 0.4); background: linear-gradient(90deg, rgba(255, 69, 58, 0.22), rgba(255, 69, 58, 0.05)); }
  .tk-card { display: flex; flex-direction: column; gap: 2px; padding: 12px 14px; border-radius: 28px; background: rgba(255, 255, 255, 0.06); }
  .tk-ok { gap: 10px; padding: 14px; background: linear-gradient(90deg, rgba(48, 209, 88, 0.18), rgba(255, 255, 255, 0.05) 80%); }
  .tk-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .tk-btn { height: 40px; padding: 0 14px; border-radius: 20px; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .tk-btn.soft { background: rgba(255, 255, 255, 0.12); color: #fff; }
  .tk-btn.tk-icon { width: 40px; padding: 0; display: flex; align-items: center; justify-content: center; }
  .tk-pause { display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 14px; border-radius: 26px; background: rgba(255, 214, 10, 0.1); font-size: 13px; }
  .tk-pause .tk-btn { height: 34px; }
  .tk-cardhead { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .tk-srv { display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 4px; width: 100%; text-align: left; }
  .tk-dot { width: 9px; height: 9px; border-radius: 5px; flex-shrink: 0; }
  .tk-dot.small { width: 8px; height: 8px; box-shadow: none; }
  .tk-sn { flex: 1; min-width: 0; font-size: 13px; font-weight: 600; }
  .tk-dim { font-weight: 500; color: rgba(255, 255, 255, 0.75); }
  .tk-ss { flex-shrink: 0; font-size: 12px; }
  .tk-chev { transition: transform 0.2s; }
  .tk-chev.open { transform: rotate(180deg); }
  .tk-guest { flex-direction: row; gap: 14px; align-items: stretch; padding: 14px; }
  .tk-qr { width: 116px; height: 116px; flex-shrink: 0; padding: 8px; border-radius: 16px; background: #fff; image-rendering: pixelated; }
  .tk-guest-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .tk-state { display: flex; align-items: center; gap: 6px; font-size: 13px; }
  .tk-guest-act { display: flex; gap: 6px; margin-top: auto; }
  .tk-guest-act .tk-btn { height: 36px; font-size: 12px; }
  .tk-printer { min-height: 56px; border-radius: 28px; }
  .tk-power { position: relative; width: 40px; height: 40px; flex-shrink: 0; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.12); }
  .tk-power.off { background: rgba(48, 209, 88, 0.18); }
  .tk-power.locked { background: rgba(255, 255, 255, 0.05); cursor: default; }
  .tk-lock { position: absolute; right: -1px; bottom: -1px; width: 16px; height: 16px; border-radius: 8px; background: #181a22; display: flex; align-items: center; justify-content: center; }
`, tu = "#bf9bff", nu = "#30d158", ru = "#ff453a", iu = "#ffd60a", au = "#ff9f0a", ou = "#ffb37a", su = {
	printing: [
		tu,
		"rgba(191,155,255,0.22)",
		"#1a0f2e"
	],
	finished: [
		nu,
		"rgba(48,209,88,0.18)",
		"#06200e"
	],
	error: [
		ru,
		"rgba(255,69,58,0.22)",
		"#1f0606"
	],
	idle: [
		"rgba(255,255,255,0.14)",
		"rgba(255,255,255,0.06)",
		"#fff"
	],
	off: [
		"rgba(255,255,255,0.14)",
		"rgba(255,255,255,0.05)",
		"#fff"
	],
	starting: [
		"rgba(255,255,255,0.14)",
		"rgba(255,255,255,0.05)",
		"#fff"
	],
	disconnected: [
		"rgba(255,255,255,0.14)",
		"rgba(255,255,255,0.05)",
		"#fff"
	]
};
function cu(e, t, n, r) {
	let i = (t - n) / 2, a = 2 * Math.PI * i, o = Math.max(0, Math.min(1, e));
	return C`<svg width=${t} height=${t} viewBox="0 0 ${t} ${t}" aria-hidden="true" style="transform:rotate(-90deg)">
    <circle cx=${t / 2} cy=${t / 2} r=${i} fill="none" stroke="rgba(255,255,255,0.1)" stroke-width=${n}></circle>
    <circle cx=${t / 2} cy=${t / 2} r=${i} fill="none" stroke=${r} stroke-width=${n} stroke-linecap="round"
      stroke-dasharray="${a * o} ${a}"></circle></svg>`;
}
function lu(e) {
	if (e === null) return;
	let t = Math.max(0, Math.round(e * 60));
	return t < 60 ? `noch ${t} min` : `noch ${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")} min`;
}
function uu(e, t) {
	let n = P(e.hass, t.e.print_weight);
	return n === null ? void 0 : `${I(Math.round(n))} g`;
}
function du(e, t) {
	let n = t.e.cover_image ? e.hass.states[t.e.cover_image]?.attributes.entity_picture : void 0;
	return C`<span class="pr-cover" aria-label="Titelbild des Drucks">
    ${n ? C`<img src=${n} alt="" />` : j(O.cube, 22, "rgba(255,255,255,0.7)", 1.8)}</span>`;
}
function fu(e, t, n = !1) {
	let r = t.e.chamber_light;
	if (!r || !e.hass.states[r]) return E;
	let i = F(e.hass, r) === "on", a = () => e.call("light", i ? "turn_off" : "turn_on", {}, { entity_id: r });
	return n ? C`<button class="pr-ctl" style="background:${i ? "rgba(255,214,10,0.16)" : ""}" @click=${a}>
      <span class="circle" style="width:34px;height:34px;background:${i ? iu : "rgba(255,255,255,0.12)"}">${j(O.bulb, 16, i ? "#2b2200" : "#fff", 2.2)}</span>${i ? "Licht an" : "Licht aus"}</button>` : C`<button class="pr-tile" style="background:${i ? "rgba(255,214,10,0.16)" : ""}" @click=${a}>
    <span class="circle" style="width:40px;height:40px;background:${i ? iu : "rgba(255,255,255,0.12)"}">${j(O.bulb, 18, i ? "#2b2200" : "#fff", 2.2)}</span>
    <span><span class="pr-t">Licht</span><span class="pr-s" style=${i ? "color:#ffe680" : ""}>${i ? "an" : "aus"}</span></span></button>`;
}
function pu(e, t, n, r = !1) {
	if (!t.plug) return E;
	let i = F(e.hass, t.plug) === "on", a = i && Do(e.hass, t, n), o = a ? "gesperrt" : i ? "ausschalten" : "einschalten", s = Xl(e, t, n, r ? "pr-power-grid" : "pr-power-tile");
	return r ? C`<span class="pr-ctl ${a ? "dim" : ""}">${s}Strom</span>` : C`<span class="pr-tile ${a ? "dim" : ""}">${s}<span><span class="pr-t">Strom</span><span class="pr-s">${o}</span></span></span>`;
}
function mu(e, t) {
	let n = [
		[t.e.left_nozzle_temp ?? t.e.nozzle_temp, t.e.left_nozzle_temp ? "Düse L" : "Düse"],
		[t.e.right_nozzle_temp, "Düse R"],
		[t.e.bed_temp, "Bett"],
		[t.e.chamber_temp, "Druckraum"]
	].filter(([t]) => P(e.hass, t) !== null);
	return n.length ? C`<div class="pr-grid" style="grid-template-columns:repeat(${n.length}, minmax(0, 1fr))">
    ${n.map(([t, n]) => {
		let r = P(e.hass, t);
		return C`<div class="pr-pill"><span class="pr-pv" style="color:${r >= 50 ? ou : "#fff"}">${I(Math.round(r))}°</span><span class="pr-pl">${n}</span></div>`;
	})}</div>` : E;
}
function hu(e, t) {
	let n = ko(e.hass, t);
	if (!n.length) return E;
	let r = Ao(e.hass, t);
	return C`<div class="pr-card pr-ams">
    <div class="pr-row"><span class="pr-h">AMS</span>${r ? C`<span class="pr-note">${r}</span>` : E}</div>
    <div class="pr-grid" style="grid-template-columns:repeat(${Math.max(4, n.length)}, minmax(0, 1fr))">
      ${n.map((e) => C`<div class="pr-slot">
        <span class="circle ${e.empty ? "empty" : ""}" style="width:40px;height:40px;background:${e.color ?? "transparent"};box-shadow:${e.active ? `0 0 0 3px #181a22, 0 0 0 5px ${tu}` : "inset 0 0 0 1px rgba(255,255,255,0.18)"}"></span>
        <span class="pr-st">${e.type || "–"}</span>
        <span class="pr-pl ellipsis">${e.name}</span>
        ${e.remain === void 0 ? E : C`<span class="pr-pl">${I(e.remain)} %</span>`}
      </div>`)}
    </div>
  </div>`;
}
function gu(e, t) {
	let n = P(e.hass, t.plugPower);
	return n === null ? E : C`<div class="pr-line">${j(O.power, 18, "rgba(255,255,255,0.7)", 2)}<span class="pr-grow pr-b">Steckdose · ${I(Math.round(n))} W</span></div>`;
}
function _u(e, t) {
	let n = t.plugEnergy;
	if (!n) return E;
	let r = e.series(`printer-month:${n}`, () => ga(e.hass, n, e.now.getTime()), 9e5), i = r.total;
	return C`<div class="pr-line">${j(O.bolt, 18, "rgba(255,255,255,0.7)", 2)}
    <span class="pr-grow pr-b">Diesen Monat</span>
    <span class="pr-v">${i == null ? r.loading ? "…" : "–" : `${I(i, 1)} kWh`}</span></div>`;
}
function vu(e, t) {
	let n = F(e.hass, t.e.subtask_name), r = F(e.hass, t.e.end_time);
	if (!n || n === "unknown" || n === "unavailable") return E;
	let i = Mo(r), a = "";
	if (i && r) {
		let t = new Date(Date.parse(r)), n = new Date(e.now);
		n.setHours(0, 0, 0, 0);
		let o = new Date(t);
		o.setHours(0, 0, 0, 0);
		let s = Math.round((n.getTime() - o.getTime()) / 864e5);
		a = s === 0 ? `heute ${i}` : s === 1 ? `gestern ${i}` : `${t.toLocaleDateString("de-DE", {
			day: "numeric",
			month: "numeric"
		})} ${i}`;
	}
	return C`<div class="pr-line">${j(O.cube, 18, "rgba(255,255,255,0.7)", 2)}
    <span class="pr-grow"><span class="pr-b ellipsis" style="display:block">Letzter Druck: ${n}</span>${a ? C`<span class="pr-pl">${a}</span>` : E}</span></div>`;
}
function yu(e, t) {
	let n = t.controls.camera, r = n ? e.hass.states[n] : void 0;
	return !r || r.state === "unavailable" || !customElements.get("ha-camera-stream") ? E : C`<div class="pr-cam"><ha-camera-stream .hass=${e.hass} .stateObj=${r} .muted=${!0} .controls=${!1}></ha-camera-stream>
    <span class="pr-chip"><span class="pr-dotl"></span>Live</span></div>`;
}
function bu(e, t, n) {
	let { hass: r } = e, i = Math.round((n.progress ?? 0) * 100), a = F(r, t.e.current_layer), o = F(r, t.e.total_layers), s = Mo(F(r, t.e.end_time)), c = lu(P(r, t.e.remaining_time)), l = F(r, t.e.subtask_name), u = uu(e, t), d = xo(r, t.e.speed_profile), { pause: f, resume: p, stop: m } = t.controls, h = n.paused ? p : f, g = [];
	h && g.push(C`<button class="pr-ctl" style="background:rgba(255,214,10,0.16)" @click=${() => e.call("button", "press", {}, { entity_id: h })}>
      <span class="circle" style="width:34px;height:34px;background:${iu}">${j(n.paused ? k.play : O.pause, 16, "#2b2200", 2.4)}</span>${n.paused ? "Fortsetzen" : "Pause"}</button>`), m && g.push(C`<button class="pr-ctl" style="background:rgba(255,69,58,0.14)" ${Lr({ hold: () => e.confirm({
		title: "Druck abbrechen",
		text: "Der laufende Druck wird abgebrochen und kann nicht fortgesetzt werden.",
		confirm: "Abbrechen",
		color: ru,
		iconPath: O.printer,
		onConfirm: () => e.call("button", "press", {}, { entity_id: m })
	}) })}>
      <span class="circle" style="width:34px;height:34px;background:${ru}">${j(k.stop, 16, "#1f0606", 2.4)}</span>Stopp</button>`);
	let _ = fu(e, t, !0), v = pu(e, t, n, !0), y = g.length + (_ === E ? 0 : 1) + (v === E ? 0 : 1);
	return C`
    ${yu(e, t)}
    <div class="pr-card pr-hero">
      <div class="pr-ring">${cu(n.progress ?? 0, 118, 10, n.paused ? iu : tu)}
        <span class="pr-ring-in"><span class="pr-big">${i} %</span>${a && o ? C`<span class="pr-pl">Schicht ${a}/${o}</span>` : E}</span>
      </div>
      <div class="pr-hero-main">
        <div class="pr-row">${du(e, t)}
          <span class="pr-grow"><span class="pr-b ellipsis" style="display:block">${l ?? ""}</span>${u ? C`<span class="pr-pl">${u}</span>` : E}</span></div>
        ${s ? C`<span><span class="pr-pl">fertig um</span><span class="pr-clock">${s}</span></span>` : E}
        ${c ? C`<span class="pr-remain">${c}</span>` : E}
      </div>
    </div>
    <div class="pr-status">
      <span class="pr-sdot" style="background:${n.paused ? iu : nu}"></span>
      <span class="pr-b">${n.paused ? "Pausiert" : "Druckt"}</span>
      <span class="pr-grow pr-dim ellipsis">· Arbeitsschritt: ${xo(r, t.e.stage)}</span>
      ${d ? C`<span class="pr-pl">${d}</span>` : E}
    </div>
    ${y ? C`<div class="pr-grid" style="grid-template-columns:repeat(${y}, minmax(0, 1fr))">${g}${_}${v}</div>` : E}
    ${t.plug ? C`<span class="pr-hint">${m ? "Stopp: halten zum Bestätigen · " : ""}Strom gesperrt während Druck und bis Düse &lt; ${50}°</span>` : E}
    ${mu(e, t)}
    ${hu(e, t)}
    ${gu(e, t)}`;
}
function xu(e, t, n) {
	let { hass: r } = e, i = Mo(F(r, t.e.end_time)), a = P(r, t.e.bed_temp), o = Eo(r, t), s = uu(e, t), c = !!t.plug && F(r, t.plug) === "on" && !Do(r, t, n), l = P(r, t.plugPower);
	return C`
    <div class="pr-card pr-hero" style="background:linear-gradient(160deg, rgba(48,209,88,0.2), rgba(255,255,255,0.05) 70%)">
      <div class="pr-ring" style="width:96px;height:96px">${cu(1, 96, 9, nu)}<span class="pr-ring-in">${j(O.check, 34, nu, 3)}</span></div>
      <div class="pr-hero-main" style="gap:4px">
        ${i ? C`<span class="pr-pl">fertig um</span><span class="pr-clock">${i}</span>` : C`<span class="pr-clock">Fertig</span>`}
        <span class="pr-b ellipsis">${F(r, t.e.subtask_name) ?? ""}</span>
        ${s ? C`<span class="pr-pl">${s}</span>` : E}
      </div>
    </div>
    ${a !== null && a >= 35 ? C`<div class="pr-bed"><span class="circle" style="width:40px;height:40px;background:${au}">${j(O.thermo, 18, "#2b1600", 2.2)}</span>
          <span class="pr-grow"><span class="pr-t">Druckbett ${I(Math.round(a))}°</span><span class="pr-s" style="color:#ffc061">noch abkühlen lassen · unter ${35}° entnehmen</span></span></div>` : E}
    <div class="pr-tiles">${fu(e, t)}${pu(e, t, n)}</div>
    ${c && o !== null ? C`<span class="pr-hint">Düse ist abgekühlt (${I(Math.round(o))}°) · Ausschalten frei${l === null ? "" : ` · Steckdose ${I(Math.round(l))} W`}</span>` : E}
    ${hu(e, t)}`;
}
function Su(e, t, n) {
	let { hass: r } = e, i = F(r, t.e.current_layer), a = F(r, t.e.total_layers), { resume: o, stop: s } = t.controls, c = Math.round((n.progress ?? 0) * 100);
	return C`
    <div class="pr-err">
      <span class="pr-row"><span class="circle" style="width:34px;height:34px;background:${ru}">${j(O.alert, 16, "#1f0606", 2.4)}</span>
        <span class="pr-t">${n.errorText ?? "Fehler am Drucker"}</span></span>
      ${o || s ? E : C`<span class="pr-s" style="color:rgba(255,255,255,0.85)">Am Drucker oder in Bambu Handy fortsetzen.</span>`}
    </div>
    <div class="pr-line" style="height:auto;padding:12px 14px">
      <span class="pr-ring" style="width:56px;height:56px">${cu(n.progress ?? 0, 56, 6, "rgba(255,255,255,0.45)")}<span class="pr-ring-in pr-b">${c} %</span></span>
      <span class="pr-grow"><span class="pr-b ellipsis" style="display:block">${F(r, t.e.subtask_name) ?? ""}</span>
        ${i && a ? C`<span class="pr-pl">Schicht ${i} von ${a} · angehalten</span>` : E}</span>
    </div>
    ${o || s ? C`<div class="pr-grid" style="grid-template-columns:repeat(${o && s ? 2 : 1}, minmax(0, 1fr))">
          ${o ? C`<button class="pr-big-btn" style="background:${nu};color:#06200e" @click=${() => e.call("button", "press", {}, { entity_id: o })}>Fortsetzen</button>` : E}
          ${s ? C`<button class="pr-big-btn" style="background:rgba(255,69,58,0.18);color:#ff8a80" @click=${() => e.confirm({
		title: "Druck abbrechen",
		text: "Der Druck wird abgebrochen.",
		confirm: "Abbrechen",
		color: ru,
		iconPath: O.printer,
		onConfirm: () => e.call("button", "press", {}, { entity_id: s })
	})}>Abbrechen</button>` : E}
        </div>` : E}
    <div class="pr-tiles">${fu(e, t)}${pu(e, t, n)}</div>`;
}
function Cu(e, t, n) {
	let r = {
		off: ["Steckdose aus", "Nach dem Einschalten braucht der Drucker etwa 1 min, bis er sich meldet."],
		starting: ["Startet …", "Drucker startet, das dauert etwa 1 min."],
		disconnected: ["Nicht verbunden", t.plug ? "Steckdose an, aber keine Verbindung zum Drucker." : "Keine Verbindung zum Drucker."]
	}[n.kind];
	return C`
    ${r ? C`<div class="pr-quiet">
          <span class="circle" style="width:56px;height:56px;background:rgba(255,255,255,0.08)">${j(O.printer, 26, "rgba(255,255,255,0.75)", 1.8)}</span>
          <span class="pr-qt">${r[0]}</span>
          <span class="pr-pl" style="max-width:260px">${r[1]}</span>
          ${n.kind === "off" && t.plug ? C`<button class="pr-on" @click=${() => e.call("switch", "turn_on", {}, { entity_id: t.plug })}>${j(O.power, 16, "#06200e", 2.4)}Einschalten</button>` : E}
        </div>` : E}
    ${n.kind === "idle" ? C`${mu(e, t)}${hu(e, t)}<div class="pr-tiles">${fu(e, t)}${pu(e, t, n)}</div>` : E}
    ${vu(e, t)}
    ${_u(e, t)}`;
}
function wu(e) {
	let { hass: t, config: n, now: r } = e;
	if (!ro(t, n)) return E;
	let i = vo(t, n);
	if (!i) return E;
	let a = To(t, i, r, e.dismissed), [o, s, c] = su[a.kind], l = a.kind === "printing" ? bu(e, i, a) : a.kind === "finished" ? xu(e, i, a) : a.kind === "error" ? Su(e, i, a) : Cu(e, i, a);
	return M({
		title: "3D-Drucker",
		subtitle: a.status,
		color: o,
		glow: s,
		iconPath: O.printer,
		iconStroke: c,
		onClose: e.closeSheet,
		body: C`${l}`
	});
}
var Tu = o`
  .pr-grow { flex: 1; min-width: 0; }
  .pr-row { display: flex; align-items: center; gap: 8px; }
  .pr-card { border-radius: 28px; background: rgba(255, 255, 255, 0.06); padding: 14px; }
  .pr-hero { display: flex; gap: 14px; align-items: center; background: linear-gradient(160deg, rgba(191, 155, 255, 0.18), rgba(255, 255, 255, 0.05) 70%); }
  .pr-ring { position: relative; width: 118px; height: 118px; flex-shrink: 0; }
  .pr-ring-in { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .pr-big { font-size: 30px; font-weight: 700; line-height: 1; }
  .pr-hero-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .pr-cover { width: 46px; height: 46px; border-radius: 12px; background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
  .pr-cover img { width: 100%; height: 100%; object-fit: cover; }
  .pr-clock { display: block; font-size: 26px; font-weight: 700; line-height: 1.05; }
  .pr-remain { font-size: 13px; color: #d6c4ff; font-weight: 600; }
  .pr-b { font-size: 14px; font-weight: 600; }
  .pr-t { display: block; font-size: 14px; font-weight: 600; }
  .pr-s { display: block; font-size: 12px; color: rgba(255, 255, 255, 0.72); }
  .pr-pl { display: block; font-size: 11px; color: rgba(255, 255, 255, 0.72); }
  .pr-dim { font-size: 13px; color: rgba(255, 255, 255, 0.72); }
  .pr-status { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; border-radius: 20px; background: rgba(255, 255, 255, 0.06); font-size: 13px; }
  .pr-sdot { width: 8px; height: 8px; border-radius: 4px; flex-shrink: 0; }
  .pr-grid { display: grid; gap: 6px; }
  .pr-ctl { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; height: 72px; border-radius: 24px; font-size: 12px; font-weight: 600; color: #fff; background: rgba(255, 255, 255, 0.07); }
  .pr-ctl.dim { color: rgba(255, 255, 255, 0.45); }
  .pr-ctl .tk-power { width: 34px; height: 34px; }
  .pr-hint { margin: -4px 8px 0; font-size: 11px; color: rgba(255, 255, 255, 0.72); }
  .pr-pill { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 4px; border-radius: 20px; background: rgba(255, 255, 255, 0.07); }
  .pr-pv { font-size: 15px; font-weight: 700; }
  .pr-ams { display: flex; flex-direction: column; gap: 12px; }
  .pr-h { flex: 1; font-size: 14px; font-weight: 600; }
  .pr-note { font-size: 12px; color: #7ee8a0; }
  .pr-slot { display: flex; flex-direction: column; align-items: center; gap: 3px; min-width: 0; text-align: center; }
  .pr-slot .circle.empty { border: 1.5px dashed rgba(255, 255, 255, 0.35); box-shadow: none !important; }
  .pr-slot .pr-pl { max-width: 100%; }
  .pr-st { font-size: 12px; font-weight: 600; }
  .pr-line { display: flex; align-items: center; gap: 12px; min-height: 52px; padding: 0 14px; border-radius: 26px; background: rgba(255, 255, 255, 0.06); }
  .pr-v { font-size: 13px; color: rgba(255, 255, 255, 0.85); }
  .pr-bed { display: flex; align-items: center; gap: 10px; height: 56px; padding: 0 8px; border-radius: 28px; background: rgba(255, 159, 10, 0.12); }
  .pr-tiles { display: flex; gap: 6px; }
  .pr-tile { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; height: 56px; padding: 0 8px; border-radius: 28px; color: #fff; text-align: left; background: rgba(255, 255, 255, 0.07); }
  .pr-tile.dim .pr-s { color: rgba(255, 255, 255, 0.5); }
  .pr-err { display: flex; flex-direction: column; gap: 6px; padding: 14px; border-radius: 24px; border: 1px solid rgba(255, 69, 58, 0.45); background: linear-gradient(90deg, rgba(255, 69, 58, 0.24), rgba(255, 69, 58, 0.06)); }
  .pr-err .pr-t { font-size: 15px; font-weight: 700; }
  .pr-big-btn { height: 48px; border-radius: 24px; font-size: 14px; font-weight: 700; }
  .pr-quiet { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px 16px; border-radius: 28px; background: rgba(255, 255, 255, 0.05); text-align: center; }
  .pr-quiet .pr-pl { font-size: 12px; }
  .pr-qt { font-size: 16px; font-weight: 600; }
  .pr-on { margin-top: 6px; height: 44px; padding: 0 22px; border-radius: 22px; font-size: 14px; font-weight: 700; background: #30d158; color: #06200e; display: flex; align-items: center; gap: 8px; }
  .pr-cam { position: relative; border-radius: 28px; overflow: hidden; background: #111116; }
  .pr-cam ha-camera-stream { display: block; width: 100%; }
  .pr-chip { position: absolute; left: 12px; top: 12px; display: flex; align-items: center; gap: 5px; height: 26px; padding: 0 10px; border-radius: 13px; font-size: 11px; font-weight: 600; background: rgba(0, 0, 0, 0.55); }
  .pr-dotl { width: 7px; height: 7px; border-radius: 4px; background: #ff453a; }
`, Eu, Du = "0.20.1", $ = [
	{
		id: "overview",
		name: "Übersicht",
		icon: O.home,
		milestone: 1
	},
	{
		id: "climate",
		name: "Klima",
		icon: O.thermo,
		milestone: 2
	},
	{
		id: "rooms",
		name: "Räume",
		icon: O.grid,
		milestone: 3
	},
	{
		id: "energy",
		name: "Energie",
		icon: O.bolt,
		milestone: 4
	},
	{
		id: "security",
		name: "Schutz",
		icon: O.shield,
		milestone: 4
	}
], Ou = {
	overview: "radial-gradient(100% 30% at 0% 0%, rgba(110,90,200,0.34), transparent 70%), radial-gradient(80% 30% at 100% 40%, rgba(90,200,250,0.12), transparent 70%)",
	climate: "radial-gradient(100% 30% at 50% 0%, rgba(255,140,60,0.26), transparent 70%), radial-gradient(80% 30% at 0% 55%, rgba(90,200,250,0.12), transparent 70%)",
	rooms: "radial-gradient(100% 28% at 50% 0%, rgba(255,214,10,0.18), transparent 70%)",
	energy: "radial-gradient(100% 28% at 50% 0%, rgba(48,209,88,0.2), transparent 70%)",
	security: "radial-gradient(100% 28% at 50% 0%, rgba(191,155,255,0.22), transparent 70%)"
}, ku = 36e5, Au = {
	"24h": {
		ms: 24 * ku,
		bucket: ku,
		period: "hour"
	},
	"7d": {
		ms: 168 * ku,
		bucket: ku,
		period: "hour"
	},
	"30d": {
		ms: 720 * ku,
		bucket: 24 * ku,
		period: "day"
	}
}, ju = 700, Mu = 15e3;
function Nu() {
	let e = "ha-start-dashboard-font";
	if (document.getElementById(e)) return;
	let t = document.createElement("link");
	t.id = e, t.rel = "stylesheet", t.href = "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap", document.head.appendChild(t);
}
var Pu = class extends ze {
	constructor(...e) {
		super(...e), this._page = "overview", this._sheet = null, this._confirm = null, this._now = /* @__PURE__ */ new Date(), this._roomsFilter = "all", this._consumersAll = !1, this._rooms = [], this._pending = {}, this._ui = {}, this._hdr = "", this._energy = {}, this._energyAt = 0, this._energyLoading = !1, this._series = {}, this._heating = {
			at: 0,
			loading: !1,
			alerts: []
		}, this._alarmo = {
			at: 0,
			loading: !1,
			sensors: []
		}, this._appliances = {
			loaded: !1,
			runs: {}
		}, this._stuck = {
			at: 0,
			key: "",
			loading: !1,
			slugs: []
		}, this._navDrag = null, this._scenes = null, this._forecast = {
			loading: !1,
			hourly: [],
			daily: [],
			at: 0
		}, this._debounce = {}, this._history = {}, this._allRooms = {
			temp: 19,
			selected: /* @__PURE__ */ new Set(),
			duration: "Dauerhaft"
		}, this._dismissed = Dr(), this._navDown = (e) => {
			if (e.button > 0) return;
			let t = e.currentTarget, n = t.getBoundingClientRect(), r = [...t.querySelectorAll(".tab")].map((e) => {
				let t = e.getBoundingClientRect();
				return {
					left: t.left - n.left,
					right: t.right - n.left
				};
			}), i = (n.width - 12 - ($.length - 1) * 4) / ($.length + 1);
			this._navStart = {
				x: e.clientX,
				id: e.pointerId,
				tabs: r,
				width: Math.round(i * 1.6),
				barWidth: n.width,
				navLeft: n.left
			};
		}, this._navMove = (e) => {
			let t = this._navStart;
			if (!t || e.pointerId !== t.id || !this._navDrag && Math.abs(e.clientX - t.x) < 8) return;
			let n = e.currentTarget;
			if (!this._navDrag) try {
				n.setPointerCapture(e.pointerId);
			} catch {}
			let r = e.clientX - t.navLeft, i = Xe(r, t.tabs);
			this._navDrag && i !== this._navDrag.hover && Fr(this, "selection"), this._navDrag = {
				...Ze(r, t.width, t.barWidth, 6),
				hover: i
			};
		}, this._navUp = (e) => {
			let t = this._navDrag;
			if (this._navStart = void 0, !t) return;
			let n = e.currentTarget;
			n.hasPointerCapture?.(e.pointerId) && n.releasePointerCapture(e.pointerId), this._navDrag = null, this._selectPage($[t.hover].id);
		}, this._navCancel = () => {
			this._navStart = void 0, this._navDrag = null;
		};
	}
	static getStubConfig() {
		return { page: "overview" };
	}
	setConfig(e) {
		if (!e) throw Error("Invalid configuration");
		if (e.page && !$.some((t) => t.id === e.page)) throw Error(`Unknown page "${e.page}" (use ${$.map((e) => e.id).join(", ")})`);
		this._config = e, this._page = e.page ?? "overview", this._roomsKey = void 0, e.load_font !== !1 && Nu();
	}
	getCardSize() {
		return 12;
	}
	getGridOptions() {
		return {
			columns: "full",
			rows: "auto"
		};
	}
	connectedCallback() {
		super.connectedCallback(), this._now = /* @__PURE__ */ new Date(), this._tick = window.setInterval(() => this._now = /* @__PURE__ */ new Date(), 3e4);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.clearInterval(this._tick), window.clearInterval(this._fastTick), this._fastTick = void 0, ei(this);
	}
	updated(e) {
		let t = this._config?.header ?? "hide", n = $r(this, t) ? t : "";
		if (n !== this._hdr && (this._hdr = n), e.has("_sheet") || e.has("hass") || e.has("_piholePause")) {
			let e = this.hass && this._config ? this.hass.states[N(this._config, "airing_timer")] : void 0, t = !!this._piholePause && this._piholePause > Date.now(), n = this._sheet?.id === "airing" || e?.state === "active" || this._sheet?.id === "technik" && t;
			n && !this._fastTick ? this._fastTick = window.setInterval(() => this._now = /* @__PURE__ */ new Date(), 1e3) : !n && this._fastTick && (window.clearInterval(this._fastTick), this._fastTick = void 0);
		}
	}
	willUpdate(e) {
		if (this.hass && this._config && (e.has("hass") || e.has("_config"))) {
			let e = [
				this.hass.areas,
				this.hass.entities,
				this.hass.devices,
				this._config
			], t = this._roomsKey;
			(!t || e.some((e, n) => e !== t[n])) && (this._rooms = br(this.hass, this._config), this._roomsKey = e);
		}
		if (this.hass && e.has("hass")) {
			let e = Date.now(), t = !1, n = { ...this._pending };
			for (let [r, i] of Object.entries(n)) {
				let [a, o] = r.split("|");
				(Number(this.hass.states[a]?.attributes[o]) === i.value && e - i.at > ju || e - i.at > Mu) && (delete n[r], t = !0);
			}
			t && (this._pending = n);
		}
	}
	_target(e) {
		if (!e) return;
		let t = this._pending[`${e}|temperature`];
		if (t) return t.value;
		let n = Number(this.hass?.states[e]?.attributes.temperature);
		return Number.isFinite(n) ? n : void 0;
	}
	_setPending(e, t, n, r) {
		let i = `${e}|${t}`;
		this._pending = {
			...this._pending,
			[i]: {
				value: n,
				at: Date.now()
			}
		}, window.clearTimeout(this._debounce[i]), this._debounce[i] = window.setTimeout(r, ju);
	}
	_stepTarget(e, t) {
		let n = this.hass?.states[e]?.attributes;
		if (!n) return;
		let r = rr(this._target(e) ?? 19, t, Number(n.min_temp) || 7, Number(n.max_temp) || 30, Number(n.target_temp_step) || .5);
		this._setPending(e, "temperature", r, () => this._call("climate", "set_temperature", { temperature: r }, { entity_id: e }));
	}
	async _call(e, t, n, r) {
		try {
			await this.hass.callService(e, t, n ?? {}, r);
		} catch (n) {
			console.error("[ha-start-dashboard]", e, t, n);
		}
	}
	_openSheet(e) {
		if (e.id === "allRooms" && this.hass) {
			let e = P(this.hass, N(this._config, "all_rooms_temperature")), t = this.hass.states[N(this._config, "all_rooms_duration")]?.state;
			this._allRooms = {
				temp: e !== null && e >= 7 ? e : 19,
				selected: new Set(this._rooms.map((e) => e.slug)),
				duration: t && Sl.includes(t) ? t : "Dauerhaft"
			};
		}
		this._ui = {}, this._sheet = e;
	}
	_closeSheet() {
		this._ui = {}, this._sheet = this._sheet?.id === "device" && this._sheet.back ? this._sheet.back : null;
	}
	_historyFor(e, t) {
		let n = `${e}:${t}`, r = this._history[n];
		if (r && (r.loading || Date.now() - r.end < 3e5)) return r;
		let i = Au[t], a = Date.now(), o = Math.floor((a - i.ms) / i.bucket) * i.bucket, s = {
			loading: !0,
			temp: [],
			hum: [],
			start: o,
			end: a
		};
		this._history = {
			...this._history,
			[n]: s
		};
		let c = this._rooms.find((t) => t.slug === e);
		return c && this._loadHistory(n, c, o, a, i).catch(() => void 0), s;
	}
	async _loadHistory(e, t, n, r, i) {
		let a = [t.temperature, t.humidity], o = (t, i, a) => {
			this._history = {
				...this._history,
				[e]: {
					loading: !1,
					temp: t,
					hum: i,
					start: n,
					end: r,
					error: a
				}
			};
		};
		try {
			let e = await this.hass.callWS({
				type: "recorder/statistics_during_period",
				start_time: new Date(n).toISOString(),
				end_time: new Date(r).toISOString(),
				statistic_ids: a,
				period: i.period,
				types: ["mean"]
			}), t = (t) => (e[t] ?? []).map((e) => ({
				t: typeof e.start == "number" ? e.start : Date.parse(e.start),
				v: Number(e.mean ?? e.state)
			})).filter((e) => Number.isFinite(e.v)), s = t(a[0]), c = t(a[1]);
			if (s.length < 2 || c.length < 2) {
				let e = await this.hass.callWS({
					type: "history/history_during_period",
					start_time: new Date(n).toISOString(),
					end_time: new Date(r).toISOString(),
					entity_ids: a,
					minimal_response: !0,
					no_attributes: !0
				}), t = (t) => (e[t] ?? []).map((e) => ({
					t: e.lu * 1e3,
					v: Number(e.s)
				})).filter((e) => Number.isFinite(e.v));
				s.length < 2 && (s = pr(t(a[0]), n, r, i.bucket)), c.length < 2 && (c = pr(t(a[1]), n, r, i.bucket));
			}
			o(s, c);
		} catch (e) {
			o([], [], e?.message ?? String(e));
		}
	}
	_forecastData() {
		let e = this._forecast;
		return !e.loading && Date.now() - e.at > 9e5 && (this._forecast = {
			...e,
			loading: !0
		}, this._loadForecast().catch(() => void 0)), this._forecast;
	}
	async _loadForecast() {
		let e = N(this._config, "weather"), t = async (t) => (await this.hass.callWS({
			type: "call_service",
			domain: "weather",
			service: "get_forecasts",
			service_data: { type: t },
			target: { entity_id: e },
			return_response: !0
		})).response?.[e]?.forecast ?? [];
		try {
			let [e, n] = await Promise.all([t("hourly"), t("daily")]);
			this._forecast = {
				loading: !1,
				hourly: e,
				daily: n,
				at: Date.now()
			};
		} catch (e) {
			this._forecast = {
				...this._forecast,
				loading: !1,
				at: Date.now() - 84e4,
				error: e?.message ?? String(e)
			};
		}
	}
	_heatingAlerts() {
		let e = this._config.heating_check;
		if (e === !1) return [];
		let t = this._heating;
		return !t.loading && Date.now() - t.at > 6e5 && (this._heating = {
			...t,
			loading: !0
		}, Ta(this.hass, br(this.hass, this._config), Ui(this._config, this._energy.prefs), e ?? {}).then((e) => this._heating = {
			at: Date.now(),
			loading: !1,
			alerts: e
		}).catch((e) => {
			console.warn("[ha-start-dashboard] heating check", e), this._heating = {
				...this._heating,
				loading: !1,
				at: Date.now()
			};
		})), t.alerts;
	}
	_alarmoSensors() {
		let e = this._alarmo;
		return !e.loading && Date.now() - e.at > 18e5 && !bn(this.hass) ? this._alarmo = {
			at: Date.now(),
			loading: !1,
			sensors: []
		} : !e.loading && Date.now() - e.at > 18e5 && (this._alarmo = {
			...e,
			loading: !0
		}, this.hass.callWS({ type: "alarmo/sensors" }).then((e) => Object.entries(e ?? {}).map(([e, t]) => ({
			entity_id: e,
			type: String(t?.type ?? ""),
			enabled: t?.enabled !== !1
		}))).catch(() => []).then((e) => this._alarmo = {
			at: Date.now(),
			loading: !1,
			sensors: e
		})), e.sensors;
	}
	_applianceRuns() {
		let e = this.hass, t = this._appliances, n = un(e, this._config).map((e) => e.power);
		if (!t.loaded && n.length) {
			t.loaded = !0;
			let r = (/* @__PURE__ */ new Date(Date.now() - 216e5)).toISOString();
			e.callWS({
				type: "history/history_during_period",
				start_time: r,
				entity_ids: n,
				minimal_response: !0,
				no_attributes: !0,
				significant_changes_only: !1
			}).then((e) => {
				for (let r of n) {
					let n = (e?.[r] ?? []).map((e) => ({
						t: (e.lu ?? e.lc ?? 0) * 1e3,
						w: Number(e.s)
					})).filter((e) => e.t > 0 && Number.isFinite(e.w));
					t.runs[r] = [...n, ...(t.runs[r] ?? []).filter((e) => !n.length || e.t > n[n.length - 1].t)];
				}
				this.requestUpdate();
			}).catch(() => void 0);
		}
		if (t.loaded) for (let r of n) {
			let n = e.states[r], i = Number(n?.state), a = n ? new Date(n.last_changed).getTime() : 0, o = t.runs[r];
			if (!o || !n || !Number.isFinite(i) || !Number.isFinite(a)) continue;
			(!o.length || a > o[o.length - 1].t) && o.push({
				t: a,
				w: i
			});
			let s = Date.now() - 216e5;
			for (; o.length > 1 && o[1].t < s;) o.shift();
		}
		return t.runs;
	}
	_windowState(e) {
		let t = this.hass, n = this._config, r = this._now, i = this._winMemo;
		if (!i || i.hass !== t || i.now !== r) {
			let e = br(t, n);
			i = this._winMemo = {
				hass: t,
				now: r,
				rooms: e,
				key: Oa(t, e, r.getTime()).map((e) => e.slug).join(",")
			};
		}
		let { rooms: a, key: o } = i, s = this._stuck;
		!s.loading && (s.key !== o || Date.now() - s.at > 6e5) && (this._stuck = {
			...s,
			key: o,
			loading: !0
		}, ka(t, a, n).then((e) => this._stuck = {
			at: Date.now(),
			key: o,
			loading: !1,
			slugs: e
		}).catch((e) => {
			console.warn("[ha-start-dashboard] window check", e), this._stuck = {
				...this._stuck,
				at: Date.now(),
				loading: !1
			};
		}));
		let c = gn(t.states[N(n, "window_snooze")]?.state);
		return mn(t, e, n, r, {
			stuck: o ? s.key === o && s.slugs.includes(e.slug) : !1,
			snoozed: !!e.window && _n(c, e.window, r.getTime())
		});
	}
	_energyInfo() {
		return !this._energyLoading && Date.now() - this._energyAt > 3e5 && (this._energyLoading = !0, this._loadEnergy().finally(() => {
			this._energyLoading = !1, this._energyAt = Date.now();
		})), this._energy;
	}
	async _loadEnergy() {
		try {
			let e = this._energy.prefs ?? await this.hass.callWS({ type: "energy/get_prefs" });
			this._energy = {
				...this._energy,
				prefs: e
			};
			let t = zi(e);
			if (t.solar.length + t.import.length + t.export.length) {
				let n = await fa(this.hass, {
					...t,
					...Bi(e)
				}, Vi(e));
				this._energy = {
					...this._energy,
					today: n
				};
			}
		} catch (e) {
			console.warn("[ha-start-dashboard] energy", e);
		}
	}
	_seriesData(e, t, n = 3e5) {
		let r = this._series[e];
		if (r && (r.loading || Date.now() - r.at < n)) return r;
		let i = {
			loading: !0,
			past: r?.past ?? [],
			future: r?.future,
			start: r?.start ?? 0,
			end: r?.end ?? 0,
			at: Date.now()
		};
		return this._series = {
			...this._series,
			[e]: i
		}, t().then((t) => this._series = {
			...this._series,
			[e]: {
				...t,
				loading: !1,
				at: Date.now()
			}
		}).catch((t) => this._series = {
			...this._series,
			[e]: {
				...i,
				loading: !1,
				at: Date.now() - n + 6e4,
				error: t?.message ?? String(t)
			}
		}), i;
	}
	_sceneConfigs() {
		if (this._scenes) return this._scenes;
		this._scenes = {};
		let e = this.hass;
		if (!e.callApi) return this._scenes;
		let t = Object.keys(e.states).filter((t) => t.startsWith("scene.") && e.states[t].attributes.id);
		return Promise.all(t.map(async (t) => {
			try {
				return [t, (await e.callApi("GET", `config/scene/config/${e.states[t].attributes.id}`)).entities];
			} catch {
				return [t, void 0];
			}
		})).then((e) => this._scenes = Object.fromEntries(e)), this._scenes;
	}
	_ctx() {
		return {
			hass: this.hass,
			config: this._config,
			rooms: this._rooms,
			now: this._now,
			go: (e, t) => {
				this._page = e, this._sheet = null, t?.roomsFilter && (this._roomsFilter = t.roomsFilter), this._scrollTop("instant");
			},
			moreInfo: (e) => {
				this.dispatchEvent(new CustomEvent("hass-more-info", {
					detail: { entityId: e },
					bubbles: !0,
					composed: !0
				}));
			},
			navigate: (e) => {
				history.pushState(null, "", e), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } }));
			},
			openSheet: (e) => this._openSheet(e),
			closeSheet: () => this._closeSheet(),
			confirm: (e) => this._confirm = e,
			call: (e, t, n, r) => this._call(e, t, n, r),
			runScript: (e, t) => this._call(...gt(e), t),
			target: (e) => this._target(e),
			stepTarget: (e, t) => this._stepTarget(e, t),
			history: (e, t) => this._historyFor(e, t),
			forecast: () => this._forecastData(),
			energy: () => this._energyInfo(),
			heating: () => this._heatingAlerts(),
			alarmoSensors: () => this._alarmoSensors(),
			applianceRuns: () => this._applianceRuns(),
			window: (e) => this._windowState(e),
			sceneConfigs: () => this._sceneConfigs(),
			series: (e, t, n) => this._seriesData(e, t, n),
			allRooms: this._allRooms,
			setAllRooms: (e) => this._allRooms = {
				...this._allRooms,
				...e
			},
			roomsFilter: this._roomsFilter,
			setRoomsFilter: (e) => this._roomsFilter = e,
			consumersAll: this._consumersAll,
			setConsumersAll: (e) => this._consumersAll = e,
			pending: (e, t) => this._pending[`${e}|${t}`]?.value,
			setPending: (e, t, n, r) => this._setPending(e, t, n, r),
			ui: this._ui,
			setUi: (e) => this._ui = {
				...this._ui,
				...e
			},
			dismissed: (e) => e in this._dismissed,
			dismiss: (e) => {
				this._dismissed = {
					...Dr(),
					...this._dismissed,
					[e]: Date.now()
				}, Or(this._dismissed);
			},
			piholePause: this._piholePause,
			setPiholePause: (e) => this._piholePause = e
		};
	}
	render() {
		if (!this.hass || !this._config) return E;
		let e = this._ctx(), t = this._config.nav !== !1;
		return C`
      <div class="wrap ${this._hdr ? `hdr-${this._hdr}` : ""}" style="background-image:${Ou[this._page]}">
        <main class="content">${this._renderPage(e)}</main>
        ${t ? this._renderNav() : E}
      </div>
      ${this._renderSheets(e)}
    `;
	}
	_renderPage(e) {
		if (this._page === "overview") return qo(e);
		if (this._page === "climate") return to(e);
		if (this._page === "rooms") return ms(e);
		if (this._page === "energy") return Es(e);
		if (this._page === "security") return Zs(e);
		let t = $.find((e) => e.id === this._page);
		return C`
      <header class="page-head">
        <div class="date">${Mn(e.now)}</div>
        <h1>${t.name}</h1>
      </header>
      <div class="todo">
        <span class="circle" style="width:42px;height:42px;background:rgba(255,255,255,0.12)">${j(t.icon, 18, "#fff")}</span>
        <span>Diese Seite kommt in Etappe ${t.milestone}.</span>
      </div>
    `;
	}
	_renderNav() {
		let e = $.length, t = Math.max(0, $.findIndex((e) => e.id === this._page)), n = this._navDrag, r = `((100% - 12px - ${(e - 1) * 4}px) / ${e + 1})`, i = n ? `left:${n.left}px;width:${n.width}px` : `left:calc(6px + ${t} * (${r} + 4px));width:calc(2 * ${r})`;
		return C`
      <nav class="nav ${n ? "dragging" : ""}" aria-label="Bereiche"
        @pointerdown=${this._navDown} @pointermove=${this._navMove} @pointerup=${this._navUp} @pointercancel=${this._navCancel}>
        <span class="lens" style=${i} aria-hidden="true"></span>
        ${$.map((e, t) => {
			let r = e.id === this._page, i = n?.hover === t;
			return C`
            <button class="tab ${r ? "active" : ""} ${i ? "hover" : ""}" aria-label=${e.name} aria-current=${r ? "page" : "false"}
              @click=${() => this._selectPage(e.id)}>
              ${j(e.icon, 20, "currentColor")}${r ? C`<span>${e.name}</span>` : E}
            </button>
          `;
		})}
      </nav>
    `;
	}
	_selectPage(e) {
		let t = e === this._page;
		this._page = e, e === "rooms" && !t && (this._roomsFilter = "all"), this._scrollTop(t ? "smooth" : "instant");
	}
	_scrollTop(e) {
		window.scrollTo({
			top: 0,
			behavior: e
		});
		for (let t = this; t; t = t.parentNode ?? t.host ?? null) t instanceof HTMLElement && t.scrollTop > 0 && t.scrollTo({
			top: 0,
			behavior: e
		});
	}
	_renderSheets(e) {
		let t = [], n = this._sheet;
		if (n) {
			let r = Jr(n);
			r && t.push({
				key: Yr(r),
				view: this._sheetView(e, r)
			}), t.push({
				key: Yr(n),
				view: this._sheetView(e, n)
			});
		}
		if (this._confirm && t.push({
			key: "confirm",
			view: ut({
				...this._confirm,
				onClose: () => this._confirm = null
			})
		}), !t.length) return E;
		let r = t.length - 1;
		return qr(t, (e) => e.key, (e, t) => C`
      <div class="layer ${t < r ? "under" : ""} ${t > 0 ? "stacked" : ""}" ?inert=${t < r}>${e.view}</div>`);
	}
	_sheetView(e, t) {
		switch (t.id) {
			case "persons": return bl(e);
			case "alarm": return hl(e);
			case "room": return Ll(e, t.slug);
			case "history": return Pl(e, t.slug, t.range);
			case "airing": return pl(e);
			case "allRooms": return El(e);
			case "device": return as(e, t.entity, t);
			case "robby": return tc(e);
			case "weather": return Oc(e);
			case "care": return Gc(e);
			case "ac": return nl(e);
			case "energyChart": return ul(e, t.key, t.range, t.name, t.back);
			case "weatherMetric": return Nc(e, t.metric);
			case "weatherRain": return Mc(e);
			case "dew": return Bc(e, t.slug, t.range);
			case "weatherDay": return Ac(e, t.date);
			case "technik": return $l(e);
			case "printer": return wu(e);
		}
	}
};
Eu = Pu, Eu.properties = {
	hass: { attribute: !1 },
	_config: { state: !0 },
	_page: { state: !0 },
	_sheet: { state: !0 },
	_confirm: { state: !0 },
	_now: { state: !0 },
	_roomsFilter: { state: !0 },
	_consumersAll: { state: !0 },
	_pending: { state: !0 },
	_history: { state: !0 },
	_allRooms: { state: !0 },
	_ui: { state: !0 },
	_forecast: { state: !0 },
	_hdr: { state: !0 },
	_energy: { state: !0 },
	_series: { state: !0 },
	_heating: { state: !0 },
	_stuck: { state: !0 },
	_scenes: { state: !0 },
	_navDrag: { state: !0 },
	_dismissed: { state: !0 },
	_piholePause: { state: !0 }
}, Eu.styles = [
	wr,
	dt,
	Jo,
	no,
	gl,
	xl,
	Rl,
	Fl,
	ml,
	Dl,
	vs,
	fs,
	Os,
	Qs,
	nc,
	Pc,
	Vc,
	Kc,
	rl,
	eu,
	Tu,
	Cc,
	gc,
	o`
      .wrap {
        position: relative;
        min-height: calc(100vh - var(--header-height, 56px));
        background-color: var(--sd-bg);
        background-repeat: no-repeat;
        /* iOS rubber-band scrolling shows what lies below the page (the HA theme background);
           a shadow paints the card background there without growing the scroll area. */
        box-shadow: 0 100vh 0 0 var(--sd-bg);
        display: flex;
        flex-direction: column;
      }
      .wrap.hdr-hide,
      .wrap.hdr-blend {
        min-height: 100vh;
        padding-top: env(safe-area-inset-top);
      }
      .wrap.hdr-blend {
        padding-top: calc(var(--header-height, 56px) + env(safe-area-inset-top));
      }
      .content {
        flex: 1;
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
        padding: 22px 14px 24px;
      }
      .nav {
        position: sticky;
        touch-action: pan-y;
        user-select: none;
        -webkit-user-select: none;
        bottom: calc(16px + env(safe-area-inset-bottom));
        z-index: 10;
        width: calc(100% - 28px);
        max-width: 452px;
        margin: 0 auto calc(16px + env(safe-area-inset-bottom));
        display: flex;
        gap: 4px;
        padding: 6px;
        border-radius: 34px;
        background: rgba(30, 32, 40, 0.88);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
      }
      .lens {
        position: absolute;
        top: 6px;
        bottom: 6px;
        border-radius: 23px;
        background: #fff;
        transition:
          left 0.42s cubic-bezier(0.25, 1.3, 0.4, 1),
          width 0.42s cubic-bezier(0.25, 1.3, 0.4, 1),
          background 0.2s ease,
          transform 0.2s ease;
        pointer-events: none;
      }
      .nav.dragging .lens {
        transition:
          background 0.2s ease,
          transform 0.2s ease;
        top: 2px;
        bottom: 2px;
        border-radius: 27px;
        background: rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(6px) saturate(1.8) brightness(1.15);
        -webkit-backdrop-filter: blur(6px) saturate(1.8) brightness(1.15);
        box-shadow:
          inset 0 1px 1px rgba(255, 255, 255, 0.7),
          inset 0 -1px 1px rgba(255, 255, 255, 0.25),
          0 6px 18px rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.35);
        transform: scale(1.06);
      }
      .tab {
        position: relative;
        color: rgba(255, 255, 255, 0.8);
        transition:
          flex 0.3s cubic-bezier(0.25, 1.2, 0.4, 1),
          color 0.2s ease,
          transform 0.2s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 46px;
        border-radius: 23px;
        font-size: 13px;
        font-weight: 700;
      }
      .tab.active {
        flex: 2;
        color: #101218;
      }
      .nav.dragging .tab.active {
        color: #fff;
      }
      .tab.hover {
        transform: scale(1.18);
        color: #fff;
      }
      @media (prefers-reduced-motion: reduce) {
        .lens,
        .tab {
          transition: none;
        }
      }
      .page-head {
        padding: 0 6px 12px;
      }
      .page-head h1 {
        margin-top: 2px;
        font-size: 30px;
        font-weight: 700;
      }
      .todo {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 58px;
        padding: 0 8px;
        border-radius: 29px;
        background: var(--sd-fill);
        font-size: 14px;
        color: var(--sd-muted);
      }
    `
], customElements.get("ha-start-dashboard") || customElements.define("ha-start-dashboard", Pu);
var Fu = window;
Fu.customCards = Fu.customCards ?? [], Fu.customCards.push({
	type: "ha-start-dashboard",
	name: "Start Dashboard",
	description: "Phone-first Start dashboard (Übersicht, Klima, Räume, Energie, Schutz) in one card.",
	preview: !1
}), console.info(`%c START-DASHBOARD %c ${Du} `, "background:#bf9bff;color:#1d1030;font-weight:700", "background:#181a22;color:#fff");
export { Pu as HaStartDashboard };
