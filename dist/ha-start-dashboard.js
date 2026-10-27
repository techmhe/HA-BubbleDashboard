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
var re = globalThis, ie = (e) => e, ae = re.trustedTypes, oe = ae ? ae.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, se = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, ce = "?" + x, le = `<${ce}>`, S = document, ue = () => S.createComment(""), de = (e) => e === null || typeof e != "object" && typeof e != "function", fe = Array.isArray, pe = (e) => fe(e) || typeof e?.[Symbol.iterator] == "function", me = "[ 	\n\f\r]", he = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, _e = />/g, C = RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ve = /'/g, ye = /"/g, be = /^(?:script|style|textarea|title)$/i, xe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), w = xe(1), T = xe(2), E = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), Ce = S.createTreeWalker(S, 129);
function we(e, t) {
	if (!fe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return oe === void 0 ? t : oe.createHTML(t);
}
var Te = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = he;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === he ? c[1] === "!--" ? o = ge : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = C) : (be.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = C) : o = _e : o === C ? c[0] === ">" ? (o = i ?? he, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? C : c[3] === "\"" ? ye : ve) : o === ye || o === ve ? o = C : o === ge || o === _e ? o = he : (o = C, i = void 0);
		let d = o === C && e[t + 1].startsWith("/>") ? " " : "";
		a += o === he ? n + le : l >= 0 ? (r.push(s), n.slice(0, l) + se + n.slice(l) + x + d) : n + x + (l === -2 ? t : d);
	}
	return [we(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Ee = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Te(t, n);
		if (this.el = e.createElement(l, r), Ce.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = Ce.nextNode()) !== null && c.length < s;) {
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
				if (be.test(i.tagName)) {
					let e = i.textContent.split(x), t = e.length - 1;
					if (t > 0) {
						i.textContent = ae ? ae.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], ue()), Ce.nextNode(), c.push({
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
function De(e, t, n = e, r) {
	if (t === E) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = de(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = De(e, i._$AS(e, t.values), i, r)), t;
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
		Ce.currentNode = r;
		let i = Ce.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new ke(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Pe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = Ce.nextNode(), a++);
		}
		return Ce.currentNode = S, r;
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
		this.type = 2, this._$AH = D, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = De(this, e, t), de(e) ? e === D || e == null || e === "" ? (this._$AH !== D && this._$AR(), this._$AH = D) : e !== this._$AH && e !== E && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== D && de(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ee.createElement(we(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Oe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Se.get(e.strings);
		return t === void 0 && Se.set(e.strings, t = new Ee(e)), t;
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
		this.type = 1, this._$AH = D, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = D;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = De(this, e, t, 0), a = !de(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = De(this, r[n + o], t, o), s === E && (s = this._$AH[o]), a ||= !de(s) || s !== this._$AH[o], s === D ? e = D : e !== D && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, je = class extends Ae {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === D ? void 0 : e;
	}
}, Me = class extends Ae {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== D);
	}
}, Ne = class extends Ae {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = De(this, e, t, 0) ?? D) === E) return;
		let n = this._$AH, r = e === D && n !== D || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== D && (n === D || r);
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
		De(this, e);
	}
}, Fe = {
	M: se,
	P: x,
	A: ce,
	C: 1,
	L: Te,
	R: Oe,
	D: pe,
	V: De,
	I: ke,
	H: Ae,
	N: Me,
	U: Ne,
	B: je,
	F: Pe
}, Ie = re.litHtmlPolyfillSupport;
Ie?.(Ee, ke), (re.litHtmlVersions ??= []).push("3.3.3");
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
		return E;
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
function k(e) {
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
var A = {
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
}, He = {
	eco: A.leaf,
	comfort: O.sofa,
	boost: A.flame,
	frost: A.snowflake
}, j = {
	bulb: O.bulb,
	lamp: "M9 2h6l3 8H6zM12 10v11M8 21h8",
	strip: "M3 12h18M6 9v6M10 9v6M14 9v6M18 9v6",
	tv: "M3 6h18v12H3zM8 21h8",
	fan: A.fan,
	drop: A.drop,
	plug: "M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4",
	boiler: "M7 3h10v14a5 5 0 0 1-10 0zM10 21h4M12 8v4",
	dryer: "M4 3h16v18H4zM12 9a4 4 0 1 0 0 8a4 4 0 1 0 0-8M7 6h.01",
	brightness: "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
};
function Ue(e, t) {
	let n = `${e} ${t}`.toLowerCase();
	return e.startsWith("fan.") ? j.fan : e.startsWith("humidifier.") ? j.drop : e.startsWith("light.") ? /led|strip|sideboard|stimmung|couch|regal/.test(n) ? j.strip : /stehlampe|uhr|wandlampe/.test(n) ? j.lamp : j.bulb : /tv|fernseh|heimkino|kino/.test(n) ? j.tv : /brunnen|pumpe/.test(n) ? j.drop : /trockner|wasch/.test(n) ? j.dryer : /warmwasser|boiler/.test(n) ? j.boiler : /deckenlampe|lampe|licht/.test(n) ? j.bulb : j.plug;
}
// node_modules/lit-html/directive.js
var We = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Ge = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Ke = class {
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
function qe(e, t, n) {
	return e < 30 ? !1 : e >= Math.max(80, Math.min(140, n * .25)) || t >= .5;
}
function Je(e) {
	return e >= 0 ? e : -Math.min(40, Math.round(-e * .15));
}
function Ye(e, t) {
	let n = 0, r = Infinity;
	return t.forEach((t, i) => {
		let a = e < t.left ? t.left - e : e > t.right ? e - t.right : 0;
		a < r && (r = a, n = i);
	}), n;
}
function Xe(e, t, n, r) {
	let i = Math.max(r, Math.min(n - r - t, e - t / 2));
	return {
		left: Math.round(i),
		width: t
	};
}
// src/components/swipe.ts
var Ze = ".grabber, .sheet-head", Qe = /* @__PURE__ */ new WeakMap();
function $e(e) {
	let t = e.previousElementSibling;
	return t instanceof HTMLElement && t.classList.contains("backdrop") ? t : null;
}
function et(e, t) {
	e.style.setProperty("--drag", `${t}px`);
	let n = $e(e);
	n && (n.style.opacity = String(Math.max(.15, 1 - Math.max(0, t) / (e.offsetHeight || 600))));
}
function tt(e) {
	e.style.removeProperty("--drag"), e.style.transition = "";
	let t = $e(e);
	t && (t.style.opacity = "", t.style.transition = "");
}
function nt(e, t, n, r) {
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
function rt(e, t, n, r) {
	let i = r - t.startY, a = n - t.startX;
	if (!t.decided) {
		if (Math.abs(i) < 6 && Math.abs(a) < 6) return !1;
		if (t.decided = !0, t.active = Math.abs(i) > Math.abs(a) && i > 0 && (t.fromHead || e.scrollTop <= 0), t.active) {
			e.style.transition = "none";
			let t = $e(e);
			t && (t.style.transition = "none");
		}
	}
	return t.active ? (t.dy = Je(i), t.samples.push({
		y: r,
		t: performance.now()
	}), t.samples.length > 5 && t.samples.shift(), et(e, t.dy), !0) : !1;
}
function it(e, t) {
	if (!t.active) return;
	t.active = !1;
	let n = t.samples[0], r = t.samples[t.samples.length - 1], i = r.t - n.t >= 16 ? (r.y - n.y) / (r.t - n.t) : 0, a = $e(e);
	qe(t.dy, i, e.offsetHeight) ? (e.style.transition = "transform 0.2s ease-in", a && (a.style.transition = "opacity 0.2s ease-in"), et(e, e.offsetHeight + 40), a && (a.style.opacity = "0"), window.setTimeout(() => {
		t.onClose(), tt(e);
	}, 190)) : (e.style.transition = "transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.15)", a && (a.style.transition = "opacity 0.3s ease-out"), et(e, 0), a && (a.style.opacity = ""), window.setTimeout(() => tt(e), 340));
}
function at(e) {
	let t = () => Qe.get(e);
	e.addEventListener("touchstart", (e) => {
		if (e.touches.length !== 1) return;
		let n = e.touches[0], r = e.target;
		r.closest("start-dashboard-slider, input") || nt(t(), n.clientX, n.clientY, !!r.closest(Ze));
	}, { passive: !0 }), e.addEventListener("touchmove", (n) => {
		let r = n.touches[0];
		r && rt(e, t(), r.clientX, r.clientY) && n.cancelable && n.preventDefault();
	}, { passive: !1 }), e.addEventListener("touchend", () => it(e, t())), e.addEventListener("touchcancel", () => it(e, t())), e.addEventListener("pointerdown", (n) => {
		if (n.pointerType !== "mouse" || n.button !== 0 || !n.target.closest(Ze)) return;
		nt(t(), n.clientX, n.clientY, !0);
		let r = (n) => rt(e, t(), n.clientX, n.clientY), i = () => {
			window.removeEventListener("pointermove", r), window.removeEventListener("pointerup", i);
			let n = t().active;
			it(e, t()), n && e.addEventListener("click", (e) => e.stopPropagation(), {
				capture: !0,
				once: !0
			});
		};
		window.addEventListener("pointermove", r), window.addEventListener("pointerup", i);
	});
}
var ot = Ge(class extends Ke {
	constructor(e) {
		if (super(e), e.type !== We.ELEMENT) throw Error("swipeToClose() must be used as an element directive");
	}
	render(e) {
		return E;
	}
	update(e, [t]) {
		let n = e.element, r = Qe.get(n);
		return r ? r.onClose = t : (Qe.set(n, {
			onClose: t,
			startX: 0,
			startY: 0,
			active: !1,
			decided: !1,
			fromHead: !1,
			samples: [],
			dy: 0
		}), at(n)), E;
	}
});
// src/components/ui.ts
function M(e, t, n, r = 2.2) {
	return w`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke=${n} stroke-width=${r}
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${e}></path></svg>`;
}
var st = [
	"#ffb340",
	"#64d2ff",
	"#bf9bff",
	"#7ee8a0",
	"#ff9f0a",
	"#ff6b5e"
];
function ct(e, t, n, r = 18) {
	return e && customElements.get("ha-icon") ? w`<ha-icon .icon=${e} style="--mdc-icon-size:${r}px;color:${n}"></ha-icon>` : M(t, r - 2, n, 2.1);
}
function N(e) {
	let t = e.onBack ?? e.onClose;
	return w`
    <div class="backdrop" @click=${t}></div>
    <section class="sheet" role="dialog" aria-modal="true" aria-label=${e.title}
      style="background-image: radial-gradient(100% 30% at 50% 0%, ${e.glow}, transparent 70%)"
      ${ot(t)}
      @keydown=${(e) => e.key === "Escape" && t()}>
      <div class="grabber" aria-hidden="true"></div>
      <header class="sheet-head">
        ${e.onBack ? w`<button class="close back" aria-label="Zurück" @click=${e.onBack}>${M("M15 5l-7 7 7 7", 18, "#fff", 2.4)}</button>` : w`<span class="circle" style="width:44px;height:44px;background:${e.color}">${e.iconTemplate ?? M(e.iconPath, 20, e.iconStroke ?? "#141008", 2)}</span>`}
        <span class="sheet-title">
          <h1 class="ellipsis">${e.title}</h1>
          ${e.subtitle ? w`<span class="sheet-sub">${e.subtitle}</span>` : ""}
        </span>
        ${e.headerExtra ?? ""}
        ${e.noClose ? "" : w`<button class="close" aria-label="Schließen" @click=${e.onClose}>${M(O.close, 16, "#fff", 2.4)}</button>`}
      </header>
      ${e.body}
    </section>
  `;
}
function lt(e) {
	return N({
		title: e.title,
		color: e.color,
		glow: e.color + "33",
		iconPath: e.iconPath,
		onClose: e.onClose,
		body: w`
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
var ut = o`
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
`, dt = {
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
}, ft = ["binary_sensor.flur_1_og_klimaanlage_filteralarm", "binary_sensor.klima_eg_filter_cleaning_reminder"], pt = {
	weather: "weather",
	alarm: "alarm",
	vacuum: "vacuum",
	front_door: "front_door",
	ac: "ac"
};
function P(e, t) {
	let n = e.entities?.[t];
	if (typeof n == "string" && n) return n;
	let r = pt[t], i = r ? e[r] : void 0;
	return typeof i == "string" && i ? i : dt[t];
}
function mt(e) {
	return e.entities?.filter_alarms ?? ft;
}
function ht(e) {
	let [t, n] = e.split(".");
	return [t, n];
}
// src/logic/util.ts
function F(e, t) {
	if (!t) return null;
	let n = e.states[t]?.state;
	if (n === void 0 || n === "" || n === "unknown" || n === "unavailable") return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function I(e, t) {
	return t ? e.states[t]?.state : void 0;
}
function L(e, t = 0) {
	return e.toLocaleString("de-DE", {
		minimumFractionDigits: t,
		maximumFractionDigits: t
	});
}
function R(e, t) {
	let n = e.entities[t];
	if (n) return n.area_id ? n.area_id : (n.device_id ? e.devices[n.device_id] : void 0)?.area_id ?? void 0;
}
function gt(e, t) {
	let n = e.entities[t], r = n?.device_id ? e.devices[n.device_id] : void 0;
	return r && (r.name_by_user || r.name) || void 0;
}
function z(e, t, n) {
	return n?.[t] ? n[t] : e.states[t]?.attributes.friendly_name ?? t.split(".")[1];
}
function _t(e, t, n) {
	let r = e.states[t]?.last_changed;
	return r ? Math.max(0, Math.floor((n.getTime() - new Date(r).getTime()) / 6e4)) : 0;
}
function B(e) {
	if (e < 60) return `${e} min`;
	let t = Math.floor(e / 60), n = e % 60;
	return n ? `${t} h ${n} min` : `${t} h`;
}
// src/logic/weather.ts
var vt = {
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
}, yt = [
	"N",
	"NO",
	"O",
	"SO",
	"S",
	"SW",
	"W",
	"NW"
];
function bt(e) {
	return yt[Math.round((e % 360 + 360) % 360 / 45) % 8];
}
var xt = (e, t) => e.toDateString() === t.toDateString(), St = (e) => L(e, 1);
function Ct(e, t, n, r = /* @__PURE__ */ new Date()) {
	let i = e.states[P(t, "precipitation")]?.state;
	if (i !== void 0 && i !== "" && Number.isFinite(Number(i))) return Number(i);
	let a = new Date(r);
	a.setMinutes(0, 0, 0);
	let o = n.find((e) => new Date(e.datetime).getTime() === a.getTime());
	return o?.precipitation === void 0 ? null : o.precipitation;
}
function wt(e, t, n, r = /* @__PURE__ */ new Date(), i = []) {
	let a = e.states[P(t, "weather")], o = a?.attributes ?? {}, s = Number(o.temperature), c = n[0], l = c && xt(new Date(c.datetime), r) ? c : void 0, u = "";
	l?.temperature !== void 0 && (u = `heute ${l.templow === void 0 ? "" : `${Math.round(l.templow)}° – `}${Math.round(l.temperature)}°${l.precipitation ? ` · ${St(l.precipitation)} mm` : ""}`);
	let d = o.latest_update ? new Date(o.latest_update) : void 0, f = [/DWD|Deutscher Wetterdienst/.test(String(o.attribution ?? "")) ? "DWD" : "", d && !Number.isNaN(d.getTime()) ? `Stand ${d.getHours()} Uhr` : ""].filter(Boolean).join(" · "), p = [], m = (e) => o[e] !== void 0 && o[e] !== null && Number.isFinite(Number(o[e])), h = Ct(e, t, i, r);
	h !== null && p.push({
		key: "precipitation",
		label: `Regen ${St(h)} mm/h`
	}), m("humidity") && p.push({
		key: "humidity",
		label: `Feuchte ${Math.round(o.humidity)} %`
	}), m("wind_speed") && p.push({
		key: "wind",
		label: `Wind ${Math.round(o.wind_speed)} ${o.wind_speed_unit ?? "km/h"}${m("wind_bearing") ? ` ${bt(Number(o.wind_bearing))}` : ""}`
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
		label: vt[g] ?? g,
		condition: g,
		today: u,
		source: f,
		chips: p
	};
}
function Tt(e, t, n = 6, r = 2) {
	let i = new Date(t);
	return i.setMinutes(0, 0, 0), e.filter((e) => new Date(e.datetime).getTime() >= i.getTime()).filter((e, t) => t % r === 0).slice(0, n).map((e) => ({
		t: String(new Date(e.datetime).getHours()).padStart(2, "0"),
		temp: e.temperature === void 0 ? null : Math.round(e.temperature),
		rain: e.precipitation === void 0 ? "" : St(e.precipitation),
		condition: e.condition ?? ""
	}));
}
var Et = (e) => Math.round(e * 100) / 100;
function Dt(e, t = 7) {
	let n = e.slice(0, t).filter((e) => e.temperature !== void 0), r = n.map((e) => e.templow ?? e.temperature), i = Math.min(...r), a = Math.max(...n.map((e) => e.temperature)) - i || 1;
	return n.map((e, t) => {
		let n = Math.round(r[t]), o = Math.round(e.temperature);
		return {
			date: e.datetime,
			day: new Date(e.datetime).toLocaleDateString("de-DE", { weekday: "short" }).replace(".", ""),
			min: n,
			max: o,
			rain: e.precipitation ? `${St(e.precipitation)} mm` : "",
			condition: e.condition ?? "",
			left: Et((r[t] - i) / a * 100),
			width: Et(Math.max((e.temperature - r[t]) / a * 100, 4))
		};
	});
}
function Ot(e, t) {
	let n = new Date(e.datetime), r = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime(), i = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1).getTime(), a = t.filter((e) => {
		let t = new Date(e.datetime).getTime();
		return t >= r && t < i;
	}), o = [];
	if (e.precipitation !== void 0 && o.push({
		key: "rain",
		label: `Regen ${St(e.precipitation)} mm`
	}), e.sun_duration !== void 0 && o.push({
		key: "sun",
		label: `Sonne ${L(e.sun_duration / 3600, 1)} h`
	}), e.wind_speed !== void 0) {
		let t = e.wind_bearing === void 0 ? "" : ` ${bt(e.wind_bearing)}`, n = e.wind_gust_speed === void 0 ? "" : ` · Böen ${Math.round(e.wind_gust_speed)}`;
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
		label: vt[e.condition ?? ""] ?? e.condition ?? "",
		condition: e.condition ?? "",
		max: e.temperature === void 0 ? null : Math.round(e.temperature),
		min: e.templow === void 0 ? null : Math.round(e.templow),
		facts: o,
		hours: a.filter((e) => new Date(e.datetime).getHours() % 3 == 0).map((e) => ({
			t: String(new Date(e.datetime).getHours()).padStart(2, "0"),
			temp: e.temperature === void 0 ? null : Math.round(e.temperature),
			rain: e.precipitation ? St(e.precipitation) : "",
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
function kt(e, t) {
	let n = (t.pollen ?? Object.keys(e.states).filter((e) => e.startsWith("sensor.pollenflug_"))).map((t) => ({
		name: String(e.states[t]?.attributes.friendly_name ?? t.split(".")[1]),
		v: F(e, t)
	})).filter((e) => e.v !== null);
	if (!n.length) return null;
	let r = n.filter((e) => e.v > 0).sort((e, t) => t.v - e.v);
	return r.length ? {
		level: r[0].v,
		title: "Pollenflug",
		text: r.map((e) => `${e.name} ${L(e.v, e.v % 1 ? 1 : 0)}`).join(" · ")
	} : {
		level: 0,
		title: "Kein Pollenflug",
		text: `alle ${n.length} Pollenarten 0`
	};
}
var At = /_(current_warning_level|advance_warning_level|aktuelle_warnstufe|vorwarnstufe)$/, jt = [
	"#7ee8a0",
	"#ffd60a",
	"#ff9f0a",
	"#ff453a",
	"#bf5af2"
];
function Mt(e, t) {
	return t.warnings ? t.warnings : Object.keys(e.states).filter((t) => t.startsWith("sensor.") && (e.entities[t]?.platform === "dwd_weather_warnings" || At.test(t)));
}
function Nt(e, t) {
	if (xt(e, t)) return "heute";
	let n = new Date(t);
	return n.setDate(t.getDate() + 1), xt(e, n) ? "morgen" : e.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
}
var Pt = (e) => e.toLocaleTimeString("de-DE", {
	hour: "2-digit",
	minute: "2-digit"
});
function Ft(e, t, n, r) {
	if (n || e && e <= r) return t ? xt(t, r) ? `bis ${Pt(t)}` : `bis ${Nt(t, r)} ${Pt(t)}` : "jetzt";
	if (!e) return "";
	let i = `${Nt(e, r)} ${Pt(e)}`;
	return t ? xt(e, t) ? `${i} – ${Pt(t)}` : `${i} – ${Nt(t, r)} ${Pt(t)}` : `ab ${i}`;
}
var It = (e) => e.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (e, t, n) => t + n.toUpperCase());
function Lt(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let i of Mt(e, t)) {
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
				title: i("name") ? It(String(i("name"))) : String(i("headline")),
				headline: String(i("headline") ?? i("name")),
				text: String(i("description") ?? ""),
				level: o,
				color: typeof i("color") == "string" && i("color") ? String(i("color")) : jt[Math.min(o, 4)],
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
		when: Ft(e, t, r.current, n),
		start: e?.toISOString()
	})).sort((e, t) => Number(t.current) - Number(e.current) || t.level - e.level);
}
var Rt = {
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
function zt(e, t, n) {
	let r = Rt[e].attr;
	return {
		past: t.map((e) => ({
			t: Math.round(e.lu * 1e3),
			v: Number(e.a?.[r])
		})).filter((e) => Bt(e.v)),
		future: n.map((t) => {
			let n = Number(t[r]);
			return e === "visibility" && n > 200 && (n /= 1e3), {
				t: Date.parse(t.datetime),
				v: n
			};
		}).filter((e) => Bt(e.v) && Number.isFinite(e.t))
	};
}
var Bt = (e) => Number.isFinite(e), Vt = 10, Ht = /zurucksetzen|zuruecksetzen|reset/;
function Ut(e, t) {
	let n = e.entities[t]?.device_id;
	return n ? Object.values(e.entities).filter((e) => e.device_id === n).map((e) => e.entity_id) : [];
}
function Wt(e, t, n) {
	return Ut(e, t).find((e) => e.startsWith("button.") && n.test(e));
}
function Gt(e) {
	return Jn(e).map((t) => {
		let n = Ut(e, t.id).find((e) => e.startsWith("sensor.") && e.endsWith("_battery_type")), r = n ? I(e, n) : void 0, i = r && ![
			"unknown",
			"unavailable",
			""
		].includes(r);
		return {
			id: t.id,
			name: t.name,
			detail: i ? `${L(t.level)} % · ${r}` : `${L(t.level)} %`,
			reset: Wt(e, t.id, /_battery_replaced$/)
		};
	});
}
function Kt(e, t) {
	let n = [], r = (t) => gt(e, t) ?? z(e, t), i = (t) => Wt(e, t, RegExp(`filter.*(${Ht.source})|(${Ht.source}).*filter`));
	for (let a of mt(t)) I(e, a) === "on" && n.push({
		id: a,
		name: r(a),
		detail: "Filter reinigen",
		reset: i(a)
	});
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.endsWith("filter_life")) continue;
		let a = F(e, t);
		a !== null && a < Vt && n.push({
			id: t,
			name: r(t),
			detail: `Filter ${L(a)} %`,
			reset: i(t)
		});
	}
	return n;
}
// src/logic/robby.ts
var qt = {
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
function Jt(e, t) {
	let n = e.states[P(t, "vacuum")], r = I(e, P(t, "vacuum_status")) ?? n?.state ?? "unavailable", i = F(e, P(t, "vacuum_battery")) ?? (Number.isFinite(Number(n?.attributes.battery_level)) ? Number(n.attributes.battery_level) : null), a = I(e, P(t, "vacuum_error")), o = n?.state === "error" || r === "error" || !!a && ![
		"none",
		"unknown",
		"unavailable",
		""
	].includes(a), s = r === "unavailable" ? "Offline" : r === "charging" && i !== null && i >= 100 ? "Geladen" : qt[r] ?? r;
	return {
		label: i === null ? s : `${s} · ${Math.round(i)} %`,
		battery: i,
		cleaning: n?.state === "cleaning" || /cleaning/.test(r),
		docked: n?.state === "docked",
		error: o
	};
}
var Yt = [
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
function Xt(e, t) {
	let n = P(t, "vacuum"), r = n.split(".")[1], i = [];
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.includes(r) || !t.endsWith("_minutes")) continue;
		let a = t.slice(7).replace(/^sensor_/, ""), o = Yt.find(([e]) => e.test(a)), s = o?.[1];
		if (!o || !s || i.some((e) => e.name === s)) continue;
		let c = F(e, t);
		c !== null && i.push({
			id: t,
			name: s,
			due: c <= 0,
			value: c <= 0 ? "fällig" : `${Math.round(c / 60)} h`,
			reset: Wt(e, n, RegExp(`${o[2].source}.*(${Ht.source})`))
		});
	}
	let a = Yt.map(([, e]) => e);
	return i.sort((e, t) => a.indexOf(e.name) - a.indexOf(t.name));
}
var Zt = {
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
function Qt(e, t) {
	let n = e.states[P(t, "vacuum_map")]?.attributes.options ?? Object.keys(Zt), r = t.vacuum_maps ?? Zt;
	return n.filter((e) => e !== "custom").map((e) => ({
		name: e,
		rooms: Object.entries(r[e] ?? {}).map(([e, t]) => ({
			segment: Number(e),
			name: t
		})).filter((e) => Number.isFinite(e.segment)).sort((e, t) => e.segment - t.segment)
	}));
}
function $t(e, t) {
	return (I(e, P(t, "vacuum_selection")) ?? "").split(",").map((e) => e.trim()).filter((e) => /^\d+$/.test(e)).map(Number);
}
var en = [
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
function tn(e) {
	return e.vacuum_programs ?? en;
}
function nn(e) {
	return e <= 0 ? "Raum wählen" : e === 1 ? "1 Raum starten" : `${e} Räume starten`;
}
var rn = [
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
], an = [
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
], on = [
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
], sn = {
	waschmaschine: "washer",
	trockner: "dryer",
	spulmaschine: "dishwasher"
};
function cn(e, t, n, r) {
	let i = (n.split(".")[1] ?? n).replace(/_fertig$/, "");
	return {
		slug: i,
		name: r ?? z(e, n).replace(/\s*fertig$/i, ""),
		power: t,
		done: n,
		kind: sn[i] ?? "other"
	};
}
function ln(e, t) {
	return t.appliances ? t.appliances.map((t) => cn(e, t.power, t.done, t.name)) : Object.keys(e.states).map((e) => /^input_boolean\.(.+)_fertig$/.exec(e)).filter((t) => !!t && `sensor.${t[1]}_power` in e.states).map((t) => cn(e, `sensor.${t[1]}_power`, t[0]));
}
function un(e, t, n, r) {
	let i = F(e, t.power) ?? 0;
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
function dn(e, t) {
	return e.kind === "overdue" ? "alert" : e.kind === "airing" ? "vent" : t ? "heat" : "";
}
function fn(e) {
	return e < 60 ? `${e} min` : `${Math.floor(e / 60)} h`;
}
function pn(e, t, n, r, i = {}) {
	let a = t.window ? e.states[t.window] : void 0, o = I(e, t.airing), s = {
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
	let d = F(e, P(n, "airing_duration")) ?? 15;
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
var mn = (e) => e.split(".").pop();
function hn(e) {
	let t = {};
	for (let n of (e ?? "").split(";")) {
		let [e, r] = n.split("@"), i = parseInt(r ?? "", 36);
		e && Number.isFinite(i) && (t[e] = i * 6e4);
	}
	return t;
}
function gn(e, t, n) {
	return (e[mn(t)] ?? 0) > n;
}
function _n(e, t, n, r) {
	let i = mn(t), a = [[i, n], ...Object.entries(hn(e)).filter(([e]) => e !== i)].filter(([, e]) => e > r).sort((e, t) => t[1] - e[1]).map(([e, t]) => `${e}@${Math.ceil(t / 6e4).toString(36)}`);
	for (; a.join(";").length > 255;) a.pop();
	return a.join(";");
}
function vn(e, t, n, r) {
	if (r === null || e.length < 4) return !1;
	let i = [...e].reverse().find((e) => e.t <= n) ?? e[0], a = e.filter((e) => e.t > n);
	if (!a.length || i.v - r < 3) return !1;
	let o = i.v - Math.min(...a.map((e) => e.v)), s = t.map((e) => e.v), c = s.length ? Math.max(...s) - Math.min(...s) : 0;
	return o < .3 && c < 3;
}
// src/logic/health.ts
function yn(e) {
	return e.user?.is_admin !== !1;
}
var bn = 3, xn = {
	color: "#aeb4c0",
	tint: "rgba(255,255,255,0.12)"
}, Sn = {
	motion: "Bewegungsmelder prüfen",
	door: "Türsensor prüfen",
	window: "Fenstersensor prüfen",
	temperature: "Temperatursensor prüfen",
	other: "Sensor prüfen"
}, Cn = {
	motion: O.alert,
	door: O.door,
	window: O.window,
	temperature: O.thermo,
	other: O.alert
};
function wn(e, t) {
	let n = e.states[t]?.attributes.entity_id;
	return Array.isArray(n) ? n : [];
}
function Tn(e, t, n, r, i) {
	let a = P(t, "front_door"), o = new Map(i.filter((e) => e.enabled && e.type !== "tamper").map((e) => [e.entity_id, e.type])), s = /* @__PURE__ */ new Map();
	for (let e of o.keys()) s.set(e, "alarmo");
	for (let e of n) e.temperature && s.set(e.temperature, "temperature");
	a && s.set(a, "door");
	for (let e of t.health?.extra ?? []) s.has(e) || s.set(e, "alarmo");
	for (let e of t.health?.exclude ?? []) s.delete(e);
	let c = /* @__PURE__ */ new Set();
	for (let t of n) t.window && t.window !== a && (c.add(t.window), I(e, t.window) === "unavailable" && wn(e, t.window).forEach((e) => c.add(e)));
	let l = P(t, "window_snooze"), u = hn(e.states[l]?.state), d = (t, n) => {
		if (n !== "alarmo") return n;
		let r = o.get(t);
		return r === "motion" ? "motion" : r === "window" ? "window" : r === "door" ? /t(ü|u)r/i.test(`${t} ${z(e, t)}`) ? "door" : "window" : "other";
	}, f = [];
	for (let [t, i] of s) {
		if (c.has(t) || I(e, t) !== "unavailable" || gn(u, t, r.getTime())) continue;
		let a = R(e, t), o = n.find((e) => e.temperature === t || e.window === t || !!a && e.areas.includes(a));
		f.push({
			id: t,
			kind: d(t, i),
			room: o,
			where: o?.name ?? (a && e.areas[a]?.name) ?? z(e, t)
		});
	}
	if (f.length > bn) return [{
		id: "health-many",
		title: `${f.length} Sensoren offline`,
		text: f.map((t) => z(e, t.id)).join(" · "),
		icon: O.alert,
		...xn,
		tap: { moreInfo: f[0].id }
	}];
	let p = e.states;
	return f.map((e) => ({
		id: `health:${e.id.split(".").pop()}`,
		title: Sn[e.kind],
		text: `${e.where} · Sensor nicht erreichbar`,
		icon: Cn[e.kind],
		...xn,
		tap: e.room ? { room: e.room.slug } : { moreInfo: e.id },
		action: p[l] ? {
			kind: "service",
			label: "1 h ignorieren",
			domain: "input_text",
			service: "set_value",
			target: { entity_id: l },
			data: { value: _n(p[l].state, e.id, r.getTime() + 36e5, r.getTime()) }
		} : void 0
	}));
}
// src/logic/overview.ts
var En = "dashboard_gerat", Dn = 5, On = 15, kn = 10;
function An(e) {
	let t = e.getHours();
	return t >= 5 && t < 11 ? "Guten Morgen" : t >= 11 && t < 18 ? "Guten Tag" : t >= 18 && t < 23 ? "Guten Abend" : "Gute Nacht";
}
function jn(e) {
	return e.toLocaleDateString("de-DE", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
var Mn = {
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
function Nn(e, t) {
	let n = e.states[t], r = n ? Number(n.attributes.temperature) : NaN;
	return {
		temp: Number.isFinite(r) ? `${L(Math.round(r))}°` : "–",
		label: n ? Mn[n.state] ?? n.state : "Wetter",
		icon: k(n?.state ?? "")
	};
}
function Pn(e) {
	return {
		armed_away: O.car,
		armed_vacation: O.car,
		armed_home: O.home,
		armed_night: O.moon
	}[e] ?? O.shield;
}
var Fn = {
	docked: "Dockt",
	cleaning: "Saugt",
	returning: "Fährt heim",
	paused: "Pause",
	idle: "Bereit",
	error: "Fehler",
	unavailable: "Offline"
}, In = {
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
function Ln(e) {
	let t = Object.keys(e.states).filter((t) => t.startsWith("light.") && !Array.isArray(e.states[t].attributes.entity_id) && !e.entities[t]?.hidden), n = t.filter((t) => e.entities[t]?.labels?.includes(En));
	return n.length ? n : t;
}
function Rn(e) {
	return Ln(e).filter((t) => e.states[t].state === "on");
}
function zn(e, t) {
	let n = F(e, P(t, "grid_import")) ?? 0, r = F(e, P(t, "grid_export")) ?? 0;
	return r > n && r > 0 ? {
		value: `${L(Math.round(r))} W`,
		label: "Einspeisung"
	} : {
		value: `${L(Math.round(n))} W`,
		label: "Netzbezug"
	};
}
function Bn(e, t) {
	let n = I(e, P(t, "vacuum")) ?? "unavailable", r = I(e, P(t, "alarm")) ?? "unavailable", i = zn(e, t);
	return [
		{
			key: "robby",
			value: n === "docked" && (Jt(e, t).battery ?? 0) >= 100 ? "Geladen" : Fn[n] ?? n,
			label: "Robby",
			icon: O.vacuum,
			color: n === "error" ? "#ff453a" : "#ffffff",
			wobble: n === "cleaning"
		},
		{
			key: "light",
			value: `${Rn(e).length} an`,
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
			value: In[r] ?? r,
			label: "Alarm",
			icon: Pn(r),
			color: r === "triggered" ? "#ff453a" : "#bf9bff"
		}
	];
}
var V = {
	blue: ["#5ac8fa", "rgba(90,200,250,0.3)"],
	purple: ["#bf9bff", "rgba(191,155,255,0.26)"],
	orange: ["#ff9f0a", "rgba(255,159,10,0.26)"],
	green: ["#7ee8a0", "rgba(126,232,160,0.18)"],
	red: ["#ff453a", "rgba(255,69,58,0.3)"],
	yellow: ["#ffd60a", "rgba(255,214,10,0.22)"],
	grey: ["#aeb4c0", "rgba(255,255,255,0.12)"]
};
function H(e, t, n, r, i, a, o) {
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
var Vn = (e, t) => !!t && I(e, t) === "on";
function Hn(e, t, n, r, i = [], a = (n) => pn(e, n, t, r), o = [], s = {}) {
	let c = [], l = e.states, u = P(t, "front_door");
	if (I(e, P(t, "alarm")) === "triggered" && c.push(H("alarm", "Alarm ausgelöst", "Jetzt prüfen", O.shield, V.red, "alarm")), Vn(e, u) && _t(e, u, r) >= Dn && c.push(H("door", "Haustür offen", `seit ${B(_t(e, u, r))}`, O.door, V.red, { moreInfo: u })), i.length) {
		let e = i.map((e) => `${e.name} +${L(e.rise, 1)}°`).join(" · ");
		c.push(H("heat", "Heizung prüfen", `${e} in ${i[0].hours} h ohne Heizbedarf`, O.thermo, V.orange, { room: i[0].slug }));
	}
	let d = Lt(e, t, r).filter((e) => e.current);
	if (d.length) {
		let [e, ...t] = d, n = [e.when, ...t.map((e) => `${e.title} ${e.when}`)].filter(Boolean).join(" · ");
		c.push(H("warn", `${e.level >= 3 ? "Unwetterwarnung" : "Warnung"}: ${e.title}`, n, O.storm, [e.color, `${e.color}44`], "weather"));
	}
	let f = l[P(t, "airing_timer")];
	if (f && f.state === "active") {
		let i = ur(e, n, t, r), a = i.openWindows.map((e) => e.name), o = [`noch ${dr(i.remaining)}`, a.length ? `${a.join(", ")} offen` : ""].filter(Boolean).join(" · ");
		c.push(H("airing", "Lüften läuft", o, O.wind, V.blue, "airing"));
	} else {
		let r = n.filter((t) => I(e, t.airing) === "Jetzt lüften");
		if (r.length) {
			let n = r.map((t) => {
				let n = F(e, t.humidity);
				return n === null ? t.name : `${t.name} ${L(Math.round(n))} %`;
			}), i = F(e, P(t, "airing_duration"));
			i !== null && n.push(`${L(Math.round(i))} min`), c.push(H("airing", "Jetzt lüften", n.join(" · "), O.wind, V.blue, "airing", {
				kind: "service",
				label: "Start",
				domain: ht(P(t, "airing_start"))[0],
				service: ht(P(t, "airing_start"))[1],
				data: {}
			}));
		}
	}
	let p = P(t, "window_snooze");
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
			data: { value: _n(l[p].state, t.window, r.getTime() + 36e5, r.getTime()) }
		} : void 0;
		if (n.kind === "overdue") c.push(H(`window:${t.slug}`, "Fenster schließen", `${t.name} · ${B(n.openMin)} · ${n.reason}`, O.window, V.red, { room: t.slug }, i));
		else {
			let n = I(e, t.window) === "unavailable" ? "Sensor nicht erreichbar" : "meldet offen, Raum bleibt gleich";
			c.push(H(`sensor:${t.slug}`, "Fenstersensor prüfen", `${t.name} · ${n}`, O.window, V.grey, { room: t.slug }, i));
		}
	}
	c.push(...Tn(e, t, n, r, o));
	for (let t of Object.keys(l).filter((e) => /^input_boolean\..+_fertig$/.test(e))) {
		if (l[t].state !== "on") continue;
		let n = z(e, t).replace(/\s*fertig$/i, "");
		c.push(H(t, `${n} fertig`, "Bitte ausräumen", O.washer, V.green, null, {
			kind: "service",
			label: "OK",
			domain: "input_boolean",
			service: "turn_off",
			data: {},
			target: { entity_id: t }
		}));
	}
	for (let n of ln(e, t)) {
		let t = un(e, n, r, s[n.power]);
		if (!t.running) continue;
		let i = `${L(t.power)} W`, a = t.since === void 0 ? i : `seit ${new Date(t.since).toLocaleTimeString("de-DE", {
			hour: "2-digit",
			minute: "2-digit"
		})} · ${i}`;
		c.push({
			...H(`appliance:${n.slug}`, `${n.name} läuft`, a, O.washer, V.blue, { moreInfo: n.power }),
			appliance: n.kind
		});
	}
	let m = P(t, "vacuum"), h = I(e, m), g = I(e, P(t, "vacuum_status"));
	if (h === "error" || g === "error") {
		let e = l[m]?.attributes.error ?? l[m]?.attributes.status ?? "Bitte prüfen";
		c.push(H("robby-error", "Robby: Fehler", String(e), O.vacuum, V.red, "robby"));
	}
	let _ = Wn(e, m);
	_.length && c.push(H("robby-due", "Robby: Wartung fällig", `${Un(_)} reinigen`, O.vacuum, V.orange, "robby"));
	let v = Kn(e, t, r);
	v && c.push(v);
	let y = qn(e, t);
	y.length && c.push(H("filter", "Filter prüfen", y.join(" · "), O.filter, V.yellow, "care"));
	let b = Jn(e);
	return b.length && c.push(H("battery", b.length === 1 ? "Batterie schwach" : `${b.length} Batterien schwach`, b.map((e) => `${e.name} ${L(e.level)} %`).join(" · "), O.battery, V.orange, "care")), c;
}
function Un(e) {
	return e.length <= 1 ? e.join("") : `${e.slice(0, -1).join(", ")} & ${e[e.length - 1]}`;
}
function Wn(e, t) {
	let n = t.split(".")[1], r = [
		[/filter/, "Filter"],
		[/sensor/, "Sensoren"],
		[/haupt/, "Hauptbürste"],
		[/seiten/, "Seitenbürste"]
	], i = [];
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.includes(n) || !t.endsWith("_minutes")) continue;
		let a = F(e, t);
		if (a === null || a > 0) continue;
		let o = t.slice(7).replace(/^sensor_/, ""), s = r.find(([e]) => e.test(o))?.[1] ?? z(e, t);
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
function Gn(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function Kn(e, t, n) {
	let r = P(t, "waste"), i = e.states[r];
	if (!i) return null;
	let a = Number(i.attributes.daysTo);
	if (!Number.isFinite(a) || a < 0 || a > 1) return null;
	let o = new Date(n);
	o.setDate(o.getDate() + a);
	let s = i.attributes[Gn(o)];
	return H("waste", a === 0 ? "Müll heute" : "Müll morgen", typeof s == "string" ? s : "Abfuhr", O.trash, V.green, { moreInfo: r });
}
function qn(e, t) {
	let n = [];
	for (let r of mt(t)) I(e, r) === "on" && n.push(gt(e, r) ?? z(e, r));
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.endsWith("filter_life")) continue;
		let r = F(e, t);
		r !== null && r < kn && n.push(`${gt(e, t) ?? z(e, t)} ${L(r)} %`);
	}
	return n;
}
function Jn(e) {
	let t = [];
	for (let [n, r] of Object.entries(e.states)) {
		if (!n.startsWith("sensor.") || r.attributes.device_class !== "battery" || /robby|phone|iphone|handy|pixel|ipad|watch|_plus$/.test(n)) continue;
		let i = F(e, n);
		if (i === null || i >= On) continue;
		let a = gt(e, n) ?? z(e, n).replace(/\s*(Batterie|Battery)$/i, "");
		t.push({
			id: n,
			name: a,
			level: i
		});
	}
	return t.sort((e, t) => e.level - t.level);
}
function Yn(e) {
	return e === null ? null : e <= 12 ? "#30d158" : e <= 35 ? "#ffd60a" : "#ff453a";
}
function Xn(e, t, n = (t) => pn(e, t, {}, /* @__PURE__ */ new Date())) {
	return t.map((t) => {
		let r = F(e, t.temperature) ?? (t.climate ? Number(e.states[t.climate]?.attributes.current_temperature) : NaN), i = F(e, t.humidity), a = !!t.climate && e.states[t.climate]?.attributes.hvac_action === "heating", o = I(e, t.airing) === "Jetzt lüften", s = n(t);
		return {
			room: t,
			icon: Ve(t.name, t.icon),
			temp: r !== null && Number.isFinite(r) ? L(r, 1) : "–",
			hum: i === null ? "–" : L(Math.round(i)),
			heating: a,
			vent: o,
			note: a && s.kind === "none" ? "heizt" : "",
			recommend: s.kind === "recommend",
			win: s,
			aq: t.pm25 ? Yn(F(e, t.pm25)) : null
		};
	});
}
var Zn = /* @__PURE__ */ new Set([
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
function Qn(e) {
	let t = e.filter((e) => e.action || Zn.has(e.id.split(":")[0])), n = e.filter((e) => !t.includes(e));
	return [...t.map((e) => ({
		item: e,
		wide: !0
	})), ...n.map((e, t) => ({
		item: e,
		wide: n.length % 2 == 1 && t === n.length - 1
	}))];
}
// src/logic/climate.ts
var $n = [
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
function er(e) {
	let t = {};
	if (typeof e == "string") try {
		t = JSON.parse(e);
	} catch {
		t = {};
	}
	else e && typeof e == "object" && (t = e);
	let n = {};
	for (let e of $n) {
		let r = Number(t[`${e.id}_temp`]);
		Number.isFinite(r) && r > 0 && (n[e.id] = r);
	}
	return n;
}
function tr(e, t, n) {
	let r = t.climate ? e.states[t.climate] : void 0, i = r?.attributes ?? {}, a = F(e, t.temperature) ?? (Number.isFinite(Number(i.current_temperature)) ? Number(i.current_temperature) : null), o = F(e, t.humidity) ?? (Number.isFinite(Number(i.current_humidity)) ? Number(i.current_humidity) : null), s = o === null ? null : Math.round(o), c = n ?? (Number.isFinite(Number(i.temperature)) ? Number(i.temperature) : null), l = !r || r.state === "off" || r.state === "unavailable", u = !l && i.hvac_action === "heating", d = !!t.window && I(e, t.window) === "on", f = I(e, t.airing), p = f === "Jetzt lüften", m = p || d, h = t.pm25 ? F(e, t.pm25) : null, g = Number.isFinite(Number(i.valve_open_percent)) ? Math.round(Number(i.valve_open_percent)) : null;
	return {
		cur: a,
		target: c,
		hum: s,
		dew: F(e, `sensor.${t.slug}_taupunkt`),
		heating: u,
		vent: m,
		recommend: p,
		off: l,
		valve: g,
		preset: typeof i.preset_mode == "string" && i.preset_mode !== "none" ? i.preset_mode : null,
		presetTemps: er(i.preset_temperatures),
		min: Number(i.min_temp) || 7,
		max: Number(i.max_temp) || 30,
		step: Number(i.target_temp_step) || .5,
		pm25: h,
		aq: t.pm25 ? Yn(h) : null,
		fanOn: !!t.purifier && I(e, t.purifier) === "on",
		windowOpen: d,
		airing: f,
		label: l ? "Aus" : d ? "lüftet" : u ? "heizt" : "Soll erreicht"
	};
}
function nr(e, t, n, r, i = .5) {
	let a = Math.round((e + t) / i) * i;
	return Math.min(r, Math.max(n, Math.round(a * 10) / 10));
}
function U(e, t = 1) {
	return e === null ? "–" : L(e, t);
}
var rr = {
	OG: "Obergeschoss",
	EG: "Erdgeschoss",
	UG: "Untergeschoss",
	DG: "Dachgeschoss",
	KG: "Keller"
};
function ir(e, t) {
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
			name: rr[r] ?? r,
			rooms: n
		};
	});
}
function ar(e, t) {
	let n = R(e, t);
	return n ? e.areas[n]?.floor_id ?? void 0 : void 0;
}
function or(e) {
	let t = e.filter((e) => e !== null);
	return t.length ? t.reduce((e, t) => e + t, 0) / t.length : null;
}
function sr(e, t) {
	let n = t.map((t) => tr(e, t)), r = n.filter((e) => e.heating).length, i = n.map((e) => e.pm25).filter((e) => e !== null), a = i.length ? Math.max(...i) : null, o = a === null ? "" : a <= 12 ? "Luft überall gut" : a <= 35 ? "Luft teils mäßig" : "Luft schlecht", s = r ? `${r} von ${t.length} Räumen heizen` : "Kein Raum heizt";
	return o ? `${s} · ${o}` : s;
}
function cr(e, t, n) {
	let r = P(n, "weather"), i = F(e, P(n, "outdoor_temp")) ?? (Number(e.states[r]?.attributes.temperature) || null), a = e.states[r]?.attributes.humidity, o = Number.isFinite(Number(a)) ? Number(a) : null, s = F(e, P(n, "outdoor_dew")), c = or(t.map((t) => F(e, `sensor.${t.slug}_taupunkt`))), l = "";
	return s !== null && c !== null && (l = s < c - 1 ? "draußen trockener" : s > c + 1 ? "draußen feuchter" : "ähnlich feucht"), {
		title: [i === null ? "Außen" : `Außen ${L(i, 1)}°`, o === null ? "" : `${L(Math.round(o))} %`].filter(Boolean).join(" · "),
		sub: [s === null ? "" : `Taupunkt ${L(s, 1)}°`, l].filter(Boolean).join(" · "),
		minutes: F(e, P(n, "airing_duration"))
	};
}
function lr(e) {
	if (typeof e != "string") return 0;
	let t = e.split(":").map(Number);
	return t.some((e) => !Number.isFinite(e)) ? 0 : t.reduce((e, t) => e * 60 + t, 0);
}
function ur(e, t, n, r) {
	let i = e.states[P(n, "airing_timer")], a = F(e, P(n, "airing_duration")), o = lr(i?.attributes.duration) || (a ?? 15) * 60, s = a === null ? o : a * 60, c = i?.state === "active", l = i?.state === "paused";
	return c && i?.attributes.finishes_at ? s = Math.max(0, Math.round((new Date(i.attributes.finishes_at).getTime() - r.getTime()) / 1e3)) : l && (s = lr(i?.attributes.remaining)), {
		active: c,
		paused: l,
		remaining: s,
		duration: c || l ? o : s,
		openWindows: t.filter((t) => t.window && I(e, t.window) === "on"),
		recommended: t.filter((t) => I(e, t.airing) === "Jetzt lüften")
	};
}
function dr(e) {
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
	return `${i} gelüftet: Feuchte ${a} → ${o} %${s !== void 0 && l !== null && s - l >= .5 ? `, Raum kurz auf ${L(l, 1)}° abgekühlt` : ""}.`;
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
	if (n.length) return Object.keys(e.states).find((i) => i.startsWith(t + ".") && n.includes(R(e, i) ?? "") && r(i));
}
function Cr(e, t) {
	let n = e.states, r = t.areas?.length ? t.areas : e.areas[t.slug] ? [t.slug] : (() => {
		let n = R(e, `sensor.${t.slug}_temperature`);
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
    animation: breathe 5s ease-in-out infinite;
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
var Lr = Ge(class extends Ke {
	constructor(e) {
		if (super(e), e.type !== We.ELEMENT) throw Error("hold() must be used as an element directive");
	}
	render(e) {
		return E;
	}
	update(e, [t]) {
		let n = e.element, r = Mr.get(n);
		return r ? r.opts = t : (Mr.set(n, {
			opts: t,
			held: !1,
			x: 0,
			y: 0
		}), Ir(n)), E;
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
}, Hr = (e, t, n = e) => (e._$AI(t, n), e), Ur = {}, Wr = (e, t = Ur) => e._$AH = t, Gr = (e) => e._$AH, Kr = (e) => {
	e._$AR(), e._$AA.remove();
}, qr = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Jr = Ge(class extends Ke {
	constructor(e) {
		if (super(e), e.type !== We.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = Gr(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = Hr(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = Hr(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = Hr(i[d], a[m]), Vr(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = Hr(i[f], a[p]), Vr(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = qr(o, p, m), u = qr(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = Vr(e, i[d]);
					Hr(t, a[p]), c[p] = t;
				} else c[p] = Hr(n, a[p]), Vr(e, i[d], n), i[t] = null;
				p++;
			} else Kr(i[f]), f--;
		} else Kr(i[d]), d++;
		for (; p <= m;) {
			let t = Vr(e, c[m + 1]);
			Hr(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && Kr(e);
		}
		return this.ut = o, Wr(e, c), E;
	}
});
// src/logic/sheet-stack.ts
function Yr(e) {
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
function Xr(e) {
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
var Zr = "ha-start-dashboard-header";
function Qr(e) {
	return e === "hide" ? "\n      .header { display: none !important; }\n      #view { padding-top: 0 !important; min-height: 100vh !important; }" : e === "blend" ? "\n      .header { background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: none !important; border: none !important; }\n      #view { padding-top: 0 !important; }" : "";
}
function $r(e) {
	let t = e;
	for (; t;) {
		if (t instanceof HTMLElement && t.tagName === "HUI-ROOT") return t;
		t = t.parentNode ?? (t instanceof ShadowRoot ? t.host : null);
	}
	return null;
}
function ei(e, t) {
	let n = $r(e), r = n?.shadowRoot;
	if (!n || !r) return !1;
	let i = n.lovelace?.editMode ? "" : Qr(t), a = r.getElementById(Zr);
	return i ? (a || (a = document.createElement("style"), a.id = Zr, r.appendChild(a)), a.textContent !== i && (a.textContent = i), !0) : (a?.remove(), !1);
}
function ti(e) {
	$r(e)?.shadowRoot?.getElementById(Zr)?.remove();
}
function ni(e) {
	return e.toLowerCase().split(/[\s&,.\-_]+/).filter((e) => e.length > 1);
}
function ri(e, t, n, r) {
	if (r?.[t]) return r[t];
	let i = z(e, t);
	if (!n) return i;
	let a = /* @__PURE__ */ new Set([
		...ni(n.name),
		...n.areas.flatMap((t) => ni(e.areas[t]?.name ?? t)),
		...ni(n.slug)
	]);
	return i.split(/\s+/).filter((e) => !a.has(e.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""))).join(" ").replace(/^[\s\-–·]+|[\s\-–·]+$/g, "") || i;
}
function ii(e, t, n) {
	let r = e.entities[t];
	return r?.labels?.includes(n) ? !0 : !!(r?.device_id ? e.devices[r.device_id] : void 0)?.labels?.includes(n);
}
function ai(e, t) {
	let n = e.states[t]?.attributes ?? {};
	return t.startsWith("light.") ? fi(n).brightness ? "light" : "switch" : t.startsWith("fan.") ? Array.isArray(n.preset_modes) && n.preset_modes.length ? "purifier" : "switch" : t.startsWith("humidifier.") ? "dehumidifier" : "switch";
}
var oi = /* @__PURE__ */ new WeakMap();
function si(e) {
	let t = oi.get(e.entities);
	if (t) return t;
	let n = /* @__PURE__ */ new Map();
	for (let t of Object.values(e.entities)) t.device_id && t.entity_id.startsWith("sensor.") && /_power$/.test(t.entity_id) && (n.has(t.device_id) || n.set(t.device_id, []), n.get(t.device_id).push(t.entity_id));
	return oi.set(e.entities, n), n;
}
function ci(e, t) {
	let n = e.states[t]?.state;
	if (n === void 0 || n === "" || n === "unknown" || n === "unavailable") return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function li(e, t) {
	let n = e.entities[t]?.device_id, r = n ? (si(e).get(n) ?? []).filter((t) => e.states[t]) : [];
	if (!r.length) {
		let n = `sensor.${t.split(".")[1]}_power`;
		e.states[n] && (r = [n]);
	}
	if (!r.length) return null;
	let i = r.filter((e) => !/_device_power$/.test(e)), a = i.find((t) => ci(e, t) !== null) ?? i[0] ?? r[0];
	return {
		id: a,
		value: ci(e, a)
	};
}
function W(e) {
	return `${L(e, e > 0 && e < 10 && e % 1 ? 1 : 0)} W`;
}
function ui(e, t, n) {
	let r = e.states[t];
	if (!r || r.state === "unavailable" || r.state === "unknown") return "n. v.";
	if (r.state !== "on") return "Aus";
	let i = Number(r.attributes.brightness);
	return t.startsWith("light.") && r.attributes.brightness != null && Number.isFinite(i) ? `${Math.max(1, Math.round(i / 255 * 100))} %` : !t.startsWith("light.") && n?.value != null && n.value >= 1 ? W(n.value) : "An";
}
var di = [
	"hs",
	"xy",
	"rgb",
	"rgbw",
	"rgbww"
];
function fi(e) {
	let t = Array.isArray(e.supported_color_modes) ? e.supported_color_modes : [], n = t.includes("color_temp");
	return {
		brightness: t.some((e) => e !== "onoff"),
		colorTemp: n ? {
			min: Number(e.min_color_temp_kelvin) || 2e3,
			max: Number(e.max_color_temp_kelvin) || 6500
		} : null,
		color: t.some((e) => di.includes(e)),
		effects: Array.isArray(e.effect_list) ? e.effect_list : []
	};
}
function pi(e) {
	if (di.includes(e.color_mode)) return "farbig";
	if (e.color_mode !== "color_temp") return;
	let t = Number(e.color_temp_kelvin);
	if (Number.isFinite(t)) return t < 3300 ? "warmweiß" : t < 5e3 ? "neutralweiß" : "kaltweiß";
}
function mi(e) {
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
function hi(e, t) {
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
var gi = {
	manual: "Manuell",
	continuous: "Dauer",
	auto: "Auto",
	clothes_dry: "Wäsche",
	shoes_dry: "Schuhe"
};
function _i(e, t) {
	let n = e.states[t];
	if (!n || n.state === "unavailable" || n.state === "unknown") return "Nicht erreichbar";
	if (n.state !== "on") return "Aus";
	let r = n.attributes;
	return t.startsWith("light.") && Number.isFinite(Number(r.brightness)) ? `An · ${Math.round(Number(r.brightness) / 255 * 100)} %` : t.startsWith("fan.") && r.preset_mode ? `An · ${String(r.preset_mode).toLowerCase()}` : t.startsWith("humidifier.") && Number.isFinite(Number(r.humidity)) ? `An · ${r.humidity} %` : "An";
}
function vi(e, t, n) {
	let r = Object.keys(e.states).filter((n) => ii(e, n, "dashboard_gerat") && t.areas.includes(R(e, n) ?? ""));
	return t.purifier && e.states[t.purifier] && !r.includes(t.purifier) && r.unshift(t.purifier), r.map((r) => {
		let i = r.split(".")[0], a = e.states[r]?.state, o = li(e, r);
		return {
			tileState: ui(e, r, o),
			power: o,
			sheet: ai(e, r),
			id: r,
			name: ri(e, r, t, n),
			on: a === "on",
			unavailable: !a || a === "unavailable" || a === "unknown",
			status: _i(e, r),
			kind: [
				"light",
				"fan",
				"humidifier",
				"switch"
			].includes(i) ? i : "other"
		};
	});
}
function yi(e, t) {
	return Object.keys(e.states).filter((n) => n.startsWith("scene.") && t.areas.includes(R(e, n) ?? "")).map((n) => {
		let r = /_off$|_aus$/.test(n);
		return {
			id: n,
			name: r ? "Alles aus" : ri(e, n, t),
			icon: e.states[n].attributes.icon,
			off: r
		};
	}).sort((e, t) => Number(e.off) - Number(t.off));
}
var bi = 13;
function xi(e, t, n, r) {
	let i = /* @__PURE__ */ new Set(), a = (t) => Date.parse(e.states[t]?.state ?? "");
	for (let r of t) {
		let t = n[r];
		if (!t) continue;
		let a = Object.entries(t).filter(([t]) => e.states[t]);
		a.length > 0 && a.every(([t, n]) => {
			let r = e.states[t];
			if (n.state && r.state !== n.state) return !1;
			let i = Number(r.attributes.brightness);
			return n.state === "on" && n.brightness !== void 0 && Number.isFinite(i) ? Math.abs(i - n.brightness) <= bi : !0;
		}) && i.add(r);
	}
	let o = t.filter((e) => Number.isFinite(a(e)) && a(e) <= r.getTime()).sort((e, t) => a(t) - a(e))[0];
	if (o && !n[o]) {
		let t = e.states[o].attributes.entity_id ?? [], n = a(o) + 1e4;
		t.length && t.every((t) => !e.states[t] || Date.parse(e.states[t].last_changed) <= n) && i.add(o);
	}
	return i;
}
var Si = (e) => Math.round(Math.min(255, Math.max(0, e)));
function Ci(e) {
	let t = e / 100, n = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -.1332047592, r = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * (t - 60) ** -.0755148492, i = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
	return [
		Si(n),
		Si(r),
		Si(i)
	];
}
function wi(e, t) {
	let n = (n) => {
		let r = (n + e / 60) % 6;
		return 255 * (1 - t / 100 * Math.max(0, Math.min(r, 4 - r, 1)));
	};
	return [
		Si(n(5)),
		Si(n(3)),
		Si(n(1))
	];
}
function Ti(e) {
	if (di.includes(e.color_mode)) return Array.isArray(e.rgb_color) && e.rgb_color.length === 3 ? e.rgb_color.map(Number) : Array.isArray(e.hs_color) ? wi(Number(e.hs_color[0]), Number(e.hs_color[1])) : null;
	if (e.color_mode === "color_temp") {
		let t = Number(e.color_temp_kelvin);
		return Number.isFinite(t) && t > 0 ? Ci(t) : null;
	}
	return null;
}
function Ei([e, t, n]) {
	let r = (.2126 * e + .7152 * t + .0722 * n) / 255;
	return {
		fill: `linear-gradient(90deg, rgba(${e},${t},${n},0.35), rgb(${e},${t},${n}))`,
		icon: r > .5 ? "#2b2200" : "#fff"
	};
}
function Di(e) {
	let t = Ti(e);
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
		icon: Ei(t).icon === "#fff" ? "#fff" : "#151005"
	};
}
// src/logic/rooms-page.ts
var Oi = "raumverbrauch", ki = "raumverbrauch_ignorieren";
function Ai(e, t, n) {
	let r = new Set(n.flatMap((e) => e.areas)), i = [];
	for (let [t, n] of Object.entries(e.entities)) {
		if (!e.states[t] || !ji(e, t, n.labels)) continue;
		let a = R(e, t);
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
		let r = vi(e, n, t.names), i = r.filter((e) => e.on).length, a = r.filter((e) => e.on && e.kind === "light").length, o = n.floor ? e.floors?.[n.floor]?.name ?? n.floor.toUpperCase() : void 0, s = r.length ? i ? `${i} von ${r.length} an` : "alles aus" : "keine Geräte";
		return {
			room: n,
			devices: r,
			scenes: yi(e, n),
			onCount: i,
			lightsOn: a,
			sub: o ? `${o} · ${s}` : s,
			active: a > 0,
			power: Mi(e, n),
			floorShort: o
		};
	});
}
function ji(e, t, n) {
	if (n?.includes("dashboard_gerat")) return !0;
	let r = e.entities[t]?.device_id;
	return !!(r && e.devices[r]?.labels?.includes("dashboard_gerat"));
}
function Mi(e, t) {
	let n = Ni(e, t).map((t) => F(e, t)).filter((e) => e !== null);
	return n.length ? n.reduce((e, t) => e + t, 0) : null;
}
function Ni(e, t) {
	let n = t.power;
	if (!n?.length) {
		let r = Pi(e), i = `sensor.${t.slug}_leistung`;
		if (r.has(i)) n = [i];
		else {
			let e = [...t.areas, ...t.slug.split("_").filter((e) => e.length > 3)];
			n = [...new Set(e.map((e) => `sensor.${e}_leistung`).filter((e) => r.has(e)))];
		}
	}
	return n;
}
function Pi(e) {
	let t = Object.keys(e.states).filter((e) => /^sensor\..+_leistung$/.test(e)), n = (t) => e.entities[t]?.labels ?? [], r = t.filter((e) => n(e).includes(Oi));
	return new Set((r.length ? r : t).filter((e) => !n(e).includes(ki)));
}
function Fi(e) {
	let t = e.reduce((e, t) => e + t.lightsOn, 0), n = e.reduce((e, t) => e + t.onCount - t.lightsOn, 0);
	if (!t && !n) return "Alles aus";
	let r = [];
	return t && r.push(`${t} ${t === 1 ? "Licht" : "Lichter"}`), n && r.push(`${n} ${n === 1 ? "Gerät" : "Geräte"}`), `${r.join(" · ")} an`;
}
function Ii(e, t) {
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
function Li(e, t) {
	return t === "all" ? e : t === "on" ? e.filter((e) => e.onCount > 0).map((e) => ({
		...e,
		devices: e.devices.filter((e) => e.on),
		scenes: e.scenes.filter((e) => e.off)
	})) : e.filter((e) => e.room.floor === t);
}
function Ri(e, t) {
	let [n, r] = t.split(":").map(Number), i = new Date(e);
	i.setHours(n, r, 0, 0);
	let a = Math.round((i.getTime() - e.getTime()) / 6e4);
	return a <= 0 && (a += 1440), a;
}
// src/logic/energy.ts
function zi(e, t) {
	let n = Math.max(0, t);
	return {
		pv: e,
		output: n,
		fromPv: Math.min(e, n),
		fromBattery: Math.max(0, n - e),
		charge: Math.max(0, e - n) + Math.max(0, -t)
	};
}
var Bi = (e) => e ?? 0;
function Vi(e) {
	let t = e.energy_sources ?? [], n = (e, n) => t.filter((t) => t.type === e && t[n]).map((e) => e[n]);
	return {
		solar: n("solar", "stat_energy_from"),
		import: n("grid", "stat_energy_from"),
		export: n("grid", "stat_energy_to"),
		solarRate: n("solar", "stat_rate")
	};
}
function Hi(e) {
	let t = (e.energy_sources ?? []).filter((e) => e.type === "battery");
	return {
		batteryOut: t.filter((e) => e.stat_energy_from).map((e) => e.stat_energy_from),
		batteryIn: t.filter((e) => e.stat_energy_to).map((e) => e.stat_energy_to)
	};
}
function Ui(e) {
	let t = (e.energy_sources ?? []).filter((e) => e.type === "grid"), n = t.length === 1 ? t[0] : void 0;
	return {
		importPrice: n?.number_energy_price ?? null,
		exportPrice: n?.number_energy_price_export ?? null,
		costStats: t.filter((e) => e.stat_cost || e.stat_energy_from).map((e) => e.stat_cost || `${e.stat_energy_from}_cost`),
		compensationStats: t.filter((e) => e.stat_compensation || e.stat_energy_to).map((e) => e.stat_compensation || `${e.stat_energy_to}_compensation`)
	};
}
function Wi(e, t, n) {
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
function Gi(e, t) {
	let n = [P(e, "pv_power"), ...t ? Vi(t).solarRate : []];
	return [...new Set(n)];
}
function G(e, t) {
	return t.reduce((t, n) => t + (e[n] ?? []).reduce((e, t) => e + (Number(t.change) || 0), 0), 0);
}
function Ki(e, t, n) {
	if (e.entities[t]?.device_id === n) return !0;
	let r = e.states[t]?.attributes.entity_id;
	return Array.isArray(r) && r.some((t) => e.entities[t]?.device_id === n);
}
function qi(e, t, n) {
	let r = (t) => t.reduce((t, n) => t + Math.max(0, Bi(F(e, n))), 0), i = Gi(t, n), a = r(i), o = Math.max(0, Bi(F(e, P(t, "grid_import")))), s = Math.max(0, Bi(F(e, P(t, "grid_export")))), c = P(t, "battery_power"), l = F(e, c), u = F(e, P(t, "battery_soc")), d = l !== null || u !== null ? {
		soc: u,
		power: Bi(l)
	} : null, f = t.battery?.pv_coupled, p = e.entities[c]?.device_id, m = f === !1 || !d ? [] : f === !0 ? i : i.filter((t) => !!p && Ki(e, t, p)), h = m.length ? zi(r(m), d.power) : void 0, g = a - (h?.pv ?? 0), _ = F(e, P(t, "house_power")) ?? Math.max(0, g + o - s + Bi(d?.power ?? null));
	return h ? {
		pv: a,
		house: _,
		import: o,
		export: s,
		battery: d,
		coupled: h
	} : {
		pv: a,
		house: _,
		import: o,
		export: s,
		battery: d
	};
}
function Ji(e) {
	let t = e.coupled ? e.pv - e.coupled.pv + e.coupled.fromPv : e.pv, n = e.coupled ? e.coupled.fromBattery : Math.max(0, e.battery?.power ?? 0), r = Math.min(t, e.house), i = Math.max(0, Math.min(n, e.house - r));
	return {
		pv: Math.round(r),
		battery: Math.round(i),
		grid: Math.round(e.import)
	};
}
function Yi(e) {
	let t = e.getHours();
	return t >= 5 && t < 11 ? "Morgen" : t >= 11 && t < 14 ? "Mittag" : t >= 14 && t < 18 ? "Nachmittag" : t >= 18 && t < 23 ? "Abend" : "Nacht";
}
function Xi(e, t) {
	let n = t.coupled ? t.pv - t.coupled.pv + t.coupled.fromPv : t.pv, r;
	return r = t.pv > 50 && t.export > t.import ? "Sonne liefert, Überschuss geht ins Netz" : t.coupled && t.pv > 50 && n <= 50 ? t.import > 50 ? "PV lädt den Akku, Strom aus dem Netz" : "PV lädt den Akku" : t.pv > 50 && t.import > 50 ? `PV deckt ${Math.min(99, Math.round(n / Math.max(t.house, 1) * 100))} %, Rest aus dem Netz` : t.pv > 50 ? "PV deckt den Verbrauch" : (t.battery?.power ?? 0) > 50 && t.import < 50 ? "Akku versorgt das Haus" : "PV aus, Strom kommt aus dem Netz", `${Yi(e)} · ${r}`;
}
function Zi(e, t) {
	let n = F(e, t);
	return n === null ? 0 : e.states[t]?.attributes.unit_of_measurement === "Wh" ? n / 1e3 : n;
}
function Qi(e, t, n, r = 0, i = 0) {
	let a = (e) => Math.round(e * 1e3) / 1e3, o = a(Math.max(0, e + t + r - n - i));
	return {
		consumed: o,
		local: a(Math.max(0, o - t))
	};
}
function $i(e, t, n) {
	let r = n ? n.pv : Zi(e, P(t, "pv_today")), i = n ? n.import : Zi(e, P(t, "import_today")), a = n ? n.export : Zi(e, P(t, "export_today")), { consumed: o, local: s } = Qi(r, i, a, n?.batteryOut, n?.batteryIn);
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
var ea = /_phase_|_poe_|standby/;
function ta(e, t) {
	let n = F(e, t);
	return n === null ? null : Math.abs(e.states[t]?.attributes.unit_of_measurement === "kW" ? n * 1e3 : n);
}
function na(e, t, n = 6, r) {
	let i = new Set(t.exclude?.consumers ?? []), a = new Set([...[
		"grid_import",
		"grid_export",
		"battery_power",
		"house_power"
	].map((e) => P(t, e)), ...Gi(t, r)].map((t) => e.entities[t]?.device_id).filter((e) => !!e)), o = /* @__PURE__ */ new Map();
	for (let t of Object.keys(e.states)) {
		if (!/^sensor\..+_power$/.test(t) || ea.test(t) || i.has(t)) continue;
		let n = e.states[t].attributes;
		if (n.device_class !== "power" && !["W", "kW"].includes(n.unit_of_measurement)) continue;
		let r = e.entities[t];
		if (r?.platform && i.has(r.platform)) continue;
		let s = r?.labels ?? [];
		if (s.includes("raumverbrauch") || s.includes("raumverbrauch_ignorieren") || r?.device_id && a.has(r.device_id) || !R(e, t)) continue;
		let c = r?.device_id ?? t;
		o.has(c) || o.set(c, []), o.get(c).push(t);
	}
	let s = [];
	for (let [n, r] of o) {
		let i = r.filter((e) => !/_device_power$/.test(e)).find((t) => ta(e, t) !== null) ?? r.find((t) => ta(e, t) !== null);
		if (!i) continue;
		let a = ta(e, i);
		if (a < 1) continue;
		let o = e.devices[n], c = t.names?.[i] || o?.name_by_user || o?.name || z(e, i).replace(/\s*(device\s+)?(power|leistung)$/i, "");
		s.push({
			id: i,
			name: c || i,
			value: a
		});
	}
	let c = P(t, "untracked_power"), l = ta(e, c);
	return l !== null && l >= 1 && s.push({
		id: c,
		name: "Nicht erfasst",
		value: l,
		untracked: !0
	}), s.sort((e, t) => t.value - e.value).slice(0, n);
}
function ra(e, t) {
	let n = (e) => new Map(e.map((e) => [e.t, e.v])), r = n(t.import), i = n(t.export), a = n(t.pv), o = n(t.batteryOut ?? []), s = n(t.batteryIn ?? []), c = [.../* @__PURE__ */ new Set([
		...a.keys(),
		...r.keys(),
		...i.keys(),
		...o.keys(),
		...s.keys()
	])].sort((e, t) => e - t), l = (t, n, r, i, a) => {
		if (e === "selfuse") return t > .01 ? Math.max(0, t - r) / t : null;
		let { consumed: o, local: s } = Qi(t, n, r, i, a);
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
function ia(e) {
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
			v: Qi(n, r, i, a, o).consumed
		};
	});
}
function aa(e, t) {
	return e.reduce((e, n) => e + n.v * t / 36e5 / 1e3, 0);
}
function oa(e, t) {
	return e.soc === null || Math.abs(e.power) > 10 ? null : t?.reserve !== void 0 && e.soc <= t.reserve ? "Reserve" : e.soc >= (t?.full ?? 100) ? "voll" : null;
}
// src/data/series.ts
var K = 36e5, sa = 24 * K, ca = (e) => typeof e == "number" ? e : Date.parse(e);
async function la(e, t, n, r = Date.now()) {
	let i = Math.floor(r / K) * K;
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
function ua(e, t = Date.now()) {
	if (e === "4h") {
		let e = 3e5, n = Math.ceil(t / e) * e;
		return {
			start: n - 4 * K,
			end: n,
			period: "5minute",
			step: e
		};
	}
	if (e === "24h") {
		let e = Math.ceil(t / K) * K;
		return {
			start: e - 24 * K,
			end: e,
			period: "hour",
			step: K
		};
	}
	let n = new Date(t);
	n.setHours(0, 0, 0, 0);
	let r = e === "7d" ? 7 : 30, i = n.getTime() + sa;
	return {
		start: i - r * sa,
		end: i,
		period: "day",
		step: sa
	};
}
async function da(e, t, n) {
	let r = ua(n), [i, a] = await Promise.all([e.callWS({
		type: "recorder/statistics_during_period",
		start_time: new Date(r.start).toISOString(),
		end_time: new Date(r.end).toISOString(),
		statistic_ids: t,
		period: r.period,
		types: ["change"],
		units: { energy: "kWh" }
	}), r.period === "5minute" ? null : la(e, t, "change")]), o = /* @__PURE__ */ new Map();
	for (let e of t) for (let t of i[e] ?? []) {
		let e = ca(t.start);
		o.set(e, (o.get(e) ?? 0) + (Number(t.change) || 0));
	}
	if (a) {
		let e = r.period === "hour" ? a.start : r.end - r.step;
		r.period === "hour" && o.has(e) || o.set(e, (o.get(e) ?? 0) + G(a.rows, t));
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
async function fa(e, t, n, r) {
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
	], [o, s, c, l, u] = await Promise.all(a.map((t) => t.length ? da(e, t, n) : i())), d = [
		o,
		s,
		c
	].find((e) => e.start) ?? o, f = ra(r, {
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
async function pa(e, t, n) {
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
	].map((t) => t.length ? da(e, t, n) : r())), l = [
		i,
		a,
		o
	].find((e) => e.start) ?? i;
	return {
		past: ia({
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
async function ma(e, t, n) {
	let r = Date.now(), i = n === "24h" ? K / 2 : K, a = Math.ceil(r / i) * i, o = a - (n === "24h" ? 1 : n === "3d" ? 3 : 7) * sa, s = [
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
async function ha(e, t, n) {
	let r = ua(n), [i, a] = await Promise.all([e.callWS({
		type: "recorder/statistics_during_period",
		start_time: new Date(r.start).toISOString(),
		end_time: new Date(r.end).toISOString(),
		statistic_ids: [t],
		period: r.period,
		types: ["mean"]
	}), r.period === "hour" ? la(e, [t], "mean") : null]), o = (i[t] ?? []).map((e) => ({
		t: ca(e.start),
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
async function ga(e, t, n) {
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
	}), la(e, o, "change")]), l = {};
	for (let e of o) {
		let t = s[e] ?? [], n = t.some((e) => ca(e.start) === c.start) ? [] : c.rows[e] ?? [];
		(s[e] || c.rows[e]) && (l[e] = [...t, ...n]);
	}
	return {
		pv: G(l, t.solar),
		import: G(l, t.import),
		export: G(l, t.export),
		batteryOut: G(l, t.batteryOut),
		batteryIn: G(l, t.batteryIn),
		...i.some((e) => l[e]) ? {
			cost: G(l, i),
			compensation: G(l, a)
		} : {}
	};
}
async function _a(e, t, n, r) {
	let i = async (t, n, i) => {
		if (n !== null) {
			let i = await da(e, t, r);
			return {
				...i,
				past: i.past.map((e) => ({
					t: e.t,
					v: e.v * n
				}))
			};
		}
		return da(e, i, r);
	}, [a, o] = await Promise.all([i(n.import, t.importPrice, t.costStats), n.export.length || t.compensationStats.length ? i(n.export, t.exportPrice, t.compensationStats) : Promise.resolve({ past: [] })]), s = Math.round(o.past.reduce((e, t) => e + t.v, 0) * 100) / 100;
	return {
		...a,
		total: s
	};
}
async function va(e, t, n) {
	let r = Date.now(), i = Math.floor(r / K) * K, a = Math.floor((r - 24 * K) / K) * K, o = i + 24 * K, s = t ? await e.callWS({
		type: "recorder/statistics_during_period",
		start_time: new Date(a).toISOString(),
		end_time: new Date(i).toISOString(),
		statistic_ids: [t],
		period: "hour",
		types: ["mean"]
	}) : {};
	return {
		past: (t ? s[t] ?? [] : []).map((e) => ({
			t: ca(e.start),
			v: Math.max(0, Number(e.mean))
		})).filter((e) => Number.isFinite(e.v) && e.t < i),
		future: n.map((e) => ({
			t: Date.parse(e.datetime),
			v: Number(e.precipitation)
		})).filter((e) => Number.isFinite(e.t) && Number.isFinite(e.v) && e.t >= i && e.t < o).slice(0, 24),
		start: a,
		end: o,
		step: K
	};
}
async function ya(e, t, n, r) {
	let i = Date.now(), a = Math.floor((i - 24 * K) / K) * K, o = a + 48 * K, { past: s, future: c } = zt(n, (await e.callWS({
		type: "history/history_during_period",
		start_time: new Date(a).toISOString(),
		end_time: new Date(i).toISOString(),
		entity_ids: [t],
		minimal_response: !1,
		no_attributes: !1,
		significant_changes_only: !1
	}))[t] ?? [], r), l = pr(s, a, i, K), u = s.length ? [{
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
async function ba(e, t, n = Date.now()) {
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
	}), a = await la(e, [t], "change", n), o = (e) => (e ?? []).reduce((e, t) => e + (t.change ?? 0), 0);
	return {
		past: [],
		start: r.getTime(),
		end: n,
		total: o(i[t]) + o(a.rows[t])
	};
}
// src/logic/heating-check.ts
var xa = {
	hours: 2,
	min_rise: 1,
	max_power: 150,
	max_pv: 300,
	max_hum_rise: 10
}, Sa = 6;
function Ca(e, t, n = {}) {
	let r = {
		...xa,
		...n
	}, i = (e) => t > r.max_pv && (!r.sunny || r.sunny.includes(e)), a = [];
	for (let t of e) {
		if (i(t.slug) || t.temps.length < Sa || t.heated || t.windowOpened || t.power > r.max_power || !t.off && (t.cur === null || t.target === null || t.cur <= t.target)) continue;
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
function wa(e) {
	return e.some((e) => e.a?.hvac_action === "heating");
}
function Ta(e) {
	return e.some((e) => e.s === "on");
}
// src/data/heating-check.ts
var Ea = 36e5, Da = Ea;
function Oa(e, t) {
	let n = `sensor.${t.split(".")[1]}_power_percent`;
	return e.states[n] ? n : void 0;
}
async function ka(e, t, n, r = {}, i = Date.now()) {
	let a = {
		...xa,
		...r
	}, o = t.filter((t) => t.climate && e.states[t.temperature]);
	if (!o.length) return [];
	let s = i - a.hours * Ea, c = new Map(o.map((t) => [t.slug, Ni(e, t)])), l = new Map(o.map((t) => [t.slug, Oa(e, t.climate)])), u = [...new Set([...o.flatMap((e) => [
		e.temperature,
		e.humidity,
		...c.get(e.slug),
		l.get(e.slug) ?? ""
	]), ...n].filter((t) => t && e.states[t]))], d = o.flatMap((e) => e.window ? [e.window] : []), f = o.filter((e) => !l.get(e.slug)).map((e) => e.climate), p = (t, n) => t.length ? e.callWS({
		type: "history/history_during_period",
		start_time: (/* @__PURE__ */ new Date(s - Da)).toISOString(),
		end_time: new Date(i).toISOString(),
		entity_ids: t,
		...n ? { significant_changes_only: !1 } : {
			minimal_response: !0,
			no_attributes: !0
		}
	}) : Promise.resolve({}), [m, h, g] = await Promise.all([
		e.callWS({
			type: "recorder/statistics_during_period",
			start_time: (/* @__PURE__ */ new Date(s - Da)).toISOString(),
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
	}, b = (e) => _(e, s - Da).some((e) => Number(e.max ?? e.mean) > 0), ee = n.reduce((e, t) => e + Math.max(0, y(t)), 0);
	return Ca(o.map((t) => {
		let n = tr(e, t), r = l.get(t.slug);
		return {
			slug: t.slug,
			name: t.name,
			temps: v(t.temperature),
			hums: v(t.humidity),
			power: c.get(t.slug).reduce((e, t) => e + Math.max(0, y(t)), 0),
			heated: n.heating || (r ? b(r) : wa(g[t.climate] ?? [])),
			windowOpened: n.windowOpen || !!t.window && Ta(h[t.window] ?? []),
			off: n.off,
			cur: n.cur,
			target: n.target
		};
	}), ee, a);
}
// src/data/window-check.ts
var Aa = 9e5, ja = 216e5;
function Ma(e, t, n) {
	return t.filter((t) => {
		let r = t.window ? e.states[t.window] : void 0;
		return r?.state === "on" && n - new Date(r.last_changed).getTime() >= 18e5;
	});
}
async function Na(e, t, n, r = Date.now()) {
	let i = Ma(e, t, r), a = F(e, P(n, "outdoor_temp"));
	if (!i.length || a === null) return [];
	let o = (t) => new Date(e.states[t.window].last_changed).getTime(), s = Math.max(Math.min(...i.map(o)) - Aa, r - ja), c = await e.callWS({
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
		return vn(l(e.temperature, t - Aa), l(e.humidity, t - Aa).filter((e) => e.t > t), t, a);
	}).map((e) => e.slug);
}
// src/components/motion.ts
function Pa(e, t) {
	let n = hi(e, t);
	return n.mode === "sleep" ? 1 : n.mode !== "manual" || n.level === null ? "auto" : Math.max(1, Math.min(3, Math.ceil(n.level / n.levels * 3)));
}
function q(e, t, n, r = 2.2) {
	return w`<svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke=${t} stroke-width=${r}
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n}</svg>`;
}
function Fa(e, t, n, r, i = 2.2) {
	return q(n, r, e ? T`<path class="spin s${t === "auto" ? 1 : t}" d=${A.fan}></path>` : T`<path d=${A.fan}></path>`, i);
}
var Ia = "M12 10a4 4 0 1 0 0 8a4 4 0 1 0 0-8", La = "M9.5 14h5", Ra = "M5 3h14v18H5zM5 7h14";
function za(e, t, n, r, i = 2.2) {
	return e === "dishwasher" ? q(n, r, T`<path d=${Ra}></path><path class=${t ? "spray" : ""} d=${"M9 12h.01M12 15h.01M15 12h.01M10.5 18h.01M13.5 18h.01"}></path>`, i) : e === "washer" || e === "dryer" ? q(n, r, T`<path d=${e === "washer" ? "M5 3h14v18H5zM5 7h14" : "M4 3h16v18H4zM7 6h.01"}></path><g class=${t ? "tumble" : ""}><path d=${Ia}></path><path d=${La}></path></g>`, i) : q(n, r, T`<path d=${O.washer}></path>`, i);
}
function Ba(e, t, n, r = 2.2) {
	return q(t, n, T`<path class=${e ? "bob" : ""} d=${j.drop}></path>`, r);
}
function Va(e, t, n, r, i = 2.2) {
	return e.kind === "fan" ? Fa(e.on, Pa(e.on ? "on" : "off", t ?? {}), n, r, i) : e.kind === "humidifier" ? Ba(e.on, n, r, i) : M(Ue(e.id, e.name), n, r, i);
}
var Ha = "M7 15a5 5 0 1 1 3-9 6 6 0 0 1 9 5 4 4 0 0 1-2 4H7", Ua = "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8", Wa = "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4", Ga = "M8 18l-1 3M12 18l-1 3M16 18l-1 3", Ka = "M10 18l-1 3M14 18l-1 3", qa = "M8 19h.01M12 19h.01M16 19h.01", Ja = "M10 19h.01M14 19h.01", Ya = "M13 12l-3 5h4l-3 5", Xa = "M7 15a5 5 0 1 1 3-9 6 6 0 0 1 9 5 4 4 0 0 1-2 4";
function Za(e, t, n) {
	let r = (e, t, n) => T`<clipPath id="wx-under"><rect x="0" y="16.5" width="24" height="7.5"></rect></clipPath>
      <g clip-path="url(#wx-under)"><path class=${e} d=${t}></path><path class="${e} late" d=${n}></path></g>`;
	switch (e) {
		case "rainy":
		case "pouring": return q(t, n, T`<path d=${Ha}></path>${r("rain", Ga, Ka)}`, 2);
		case "lightning-rainy": return q(t, n, T`<path d=${Xa}></path><path d=${Ya}></path>${r("rain", Ga, Ka)}`, 2);
		case "snowy":
		case "snowy-rainy": return q(t, n, T`<path d=${Ha}></path>${r("snow", qa, Ja)}`, 2);
		case "cloudy":
		case "partlycloudy": return q(t, n, T`<path class="drift" d=${O.cloud}></path>`, 2);
		case "sunny": return q(t, n, T`<path d=${Ua}></path><path class="rays" d=${Wa}></path>`, 2);
		case "lightning": return q(t, n, T`<path d=${Xa}></path><path class="flash" d=${Ya}></path>`, 2);
		default: return M(k(e), t, n, 2);
	}
}
// src/pages/climate.ts
function Qa(e) {
	let t = (e, t, n, r, i = "", a = 11) => w`<span class="winchip ${i}" style="background:${n}" title=${r} aria-label=${r}>${M(e, a, t, 2.6)}</span>`;
	switch (e.kind) {
		case "recommend": return t(O.wind, "#5ac8fa", "rgba(90,200,250,0.2)", "Lüften empfohlen", "", 12);
		case "airing": return t(O.window, "#5ac8fa", "rgba(90,200,250,0.2)", "Lüftet");
		case "overdue": return t(O.window, "#ff6b61", "rgba(255,69,58,0.24)", `Fenster offen seit ${e.openMin} min · ${e.reason}`);
		case "stuck": return t(O.window, "#aeb4c0", "transparent", "Fenstersensor prüfen", "doubt");
		case "open": return t(O.window, "#aeb4c0", "rgba(255,255,255,0.1)", "Fenster offen (ignoriert)");
		default: return D;
	}
}
function $a(e) {
	switch (e.kind) {
		case "airing": return e.remaining > 0 ? `lüftet ${dr(e.remaining)}` : "lüftet";
		case "overdue": return `offen ${fn(e.openMin)}`;
		case "stuck": return "Sensor?";
		case "open": return "offen";
		default: return null;
	}
}
function eo(e, t) {
	let n = tr(e.hass, t, e.target(t.climate)), r = e.window(t), i = dn(r, n.heating), a = t.climate, o = e.heating().find((e) => e.slug === t.slug);
	return w`
    <div class="kroom ${i}">
      <button class="kroom-main" @click=${() => e.openSheet({
		id: "room",
		slug: t.slug
	})}>
        <span class="circle kroom-circle ${i === "heat" ? "breathe" : ""}">${M(Ve(t.name, t.icon), 19, i ? "#141008" : "#fff", 2)}</span>
        <span class="kroom-text">
          <span class="kroom-name">
            <span class="ellipsis">${t.name}</span>
            ${n.aq || n.fanOn ? w`<span class="aqchip" title=${n.pm25 === null ? "Luftreiniger an" : `PM2.5 ${L(n.pm25)} µg/m³`}
                  style="background:${n.aq ? n.aq + "2e" : "rgba(48,209,88,0.18)"}">
                  ${n.aq ? w`<span class="dot" style="width:6px;height:6px;background:${n.aq}"></span>` : D}
                  ${n.fanOn ? Fa(!0, Pa("on", e.hass.states[t.purifier ?? ""]?.attributes ?? {}), 11, "#7ee8a0", 2.6) : D}
                </span>` : D}
            ${Qa(r)}
            ${o ? w`<span class="heatchip" title="Heizung prüfen: +${L(o.rise, 1)}° in ${o.hours} h ohne Heizbedarf"
                  aria-label="Heizung prüfen">${M(O.thermo, 11, "#ff9f0a", 2.6)}!</span>` : D}
          </span>
          <span class="kroom-sub">${U(n.cur)}° · ${n.hum ?? "–"} % · ${$a(r) ?? n.label}</span>
        </span>
      </button>
      ${a ? w`<span class="stepper">
            <button class="step" aria-label="Soll senken" @click=${() => e.stepTarget(a, -.5)}>−</button>
            <span class="target">${U(n.target)}°</span>
            <button class="step" aria-label="Soll erhöhen" @click=${() => e.stepTarget(a, .5)}>+</button>
          </span>` : D}
    </div>
  `;
}
var to = [
	{
		mode: "cool",
		name: "Kühlen",
		icon: A.snowflake,
		stroke: "#8fd8ff"
	},
	{
		mode: "dry",
		name: "Trocknen",
		icon: A.drop,
		stroke: "#fff"
	},
	{
		mode: "off",
		name: "Aus",
		icon: A.power,
		stroke: "#fff"
	}
], no = {
	off: "Aus",
	cool: "Kühlt",
	dry: "Trocknet",
	heat: "Heizt",
	fan_only: "Lüfter",
	auto: "Auto",
	heat_cool: "Auto"
};
function ro(e, t) {
	let n = e.hass.states[t];
	if (!n) return D;
	let r = n.attributes, i = [
		no[n.state] ?? n.state,
		r.current_temperature == null ? "" : `${L(Number(r.current_temperature), 1)}° innen`,
		r.temperature == null ? "" : `Soll ${L(Number(r.temperature), 1)}°`
	].filter(Boolean).join(" · ");
	return w`
    <div class="ac">
      <button class="ac-main" aria-label="Klimaanlage öffnen" @click=${() => e.openSheet({ id: "ac" })}>
        <span class="circle" style="width:44px;height:44px;background:rgba(100,210,255,0.18)">${M(A.snowflake, 19, "#8fd8ff", 2)}</span>
        <span><span class="t1">Klimaanlage</span><span class="t2">${i}</span></span>
      </button>
      <span class="ac-modes">
        ${to.map((r) => {
		let i = n.state === r.mode;
		return w`<button class="ac-mode ${i ? "active" : ""}" aria-label=${r.name} title=${r.name} aria-pressed=${i}
            @click=${() => e.call("climate", "set_hvac_mode", { hvac_mode: r.mode }, { entity_id: t })}>
            ${M(r.icon, 16, i ? "#101218" : r.stroke, 2.2)}</button>`;
	})}
      </span>
    </div>
  `;
}
function io(e, t, n, r) {
	let i = or(t.rooms.map((t) => tr(e.hass, t).cur));
	return w`
    <section class="section">
      <div class="section-head" style="margin-top:8px">
        <h2>${t.name}</h2>
        <span class="rule" aria-hidden="true"></span>
        <span class="meta">${i === null ? "" : `Ø ${L(i, 1)}°`}</span>
      </div>
      ${t.rooms.map((t) => eo(e, t))}
      ${r === t.id ? ro(e, n) : D}
    </section>
  `;
}
function ao(e) {
	let { hass: t, rooms: n } = e, r = P(e.config, "heating"), i = I(t, r) === "on", a = cr(t, n, e.config), o = P(e.config, "ac"), s = t.states[o] ? ar(t, o) : void 0, c = ir(t, n), l = t.states[P(e.config, "weather")]?.state ?? "", u = ur(t, n, e.config, e.now);
	return w`
    <div class="climate">
      <header class="khead">
        <div>
          <div class="date">${sr(t, n)}</div>
          <h1>Klima</h1>
        </div>
        ${t.states[r] ? w`<button class="heat-toggle ${i ? "on" : ""}" aria-pressed=${i}
              aria-label="Zentralheizung ${i ? "an" : "aus"}" title="Zentralheizung"
              @click=${() => e.call("input_boolean", "toggle", {}, { entity_id: r })}>
              <span class="track"><span class="knob">${M(A.flame, 14, i ? "#ff9f0a" : "#888", 2.6)}</span></span>
            </button>` : D}
      </header>

      <button class="pill outdoor" @click=${() => e.openSheet({ id: "airing" })}>
        <span class="circle" style="width:44px;height:44px;background:rgba(143,208,255,0.2)">${Za(l, 20, "#8fd0ff")}</span>
        <span class="grow"><span class="t1">${a.title}</span><span class="t2">${a.sub}</span></span>
        ${u.active ? w`<span class="air-badge running" aria-label="Lüften läuft, noch ${dr(u.remaining)}">${M(O.wind, 14, "#06202c", 2.4)}${dr(u.remaining)}</span>` : a.minutes === null ? D : w`<span class="air-badge">${M(O.wind, 14, "#06202c", 2.4)}${L(Math.round(a.minutes))} min</span>`}
      </button>

      <div class="pill allrooms">
        <span class="grow" style="font-size:14px;font-weight:600">Alle Räume</span>
        ${$n.map((t) => w`
          <button class="preset" style="background:${t.color}" aria-label="Alle auf ${t.name}" title=${t.name}
            @click=${() => e.runScript(P(e.config, "preset_all"), { preset: t.id })}>
            ${M(He[t.id], 18, "#101010", 2.3)}
          </button>`)}
        <button class="preset" style="background:#fff" aria-label="Temperatur für alle Räume einstellen"
          @click=${() => e.openSheet({ id: "allRooms" })}>${M(A.tune, 18, "#101218", 2.3)}</button>
      </div>

      ${c.map((t) => io(e, t, o, s))}
    </div>
  `;
}
var oo = o`
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
function J(e) {
	return e.technik === !1 ? null : e.technik ?? {};
}
function so(e, t) {
	let n = J(t), r = e.user;
	if (!n || !r) return !1;
	if (!n.users) return !!r.is_admin;
	let i = [r.id, r.name].filter(Boolean).map((e) => e.toLowerCase());
	return n.users.some((e) => i.includes(String(e).toLowerCase()));
}
var co = { DNS: "^DNS\\b" };
function lo(e, t, n) {
	let r = new Set(J(t)?.services_exclude ?? []), i = Object.values(e.entities).filter((e) => e.platform === "uptime_kuma"), a = [];
	for (let t of i) {
		if (t.translation_key !== "status") continue;
		let o = e.states[t.entity_id];
		if (!o) continue;
		let s = t.device_id ? e.devices[t.device_id] : void 0, c = s?.name_by_user || s?.name || z(e, t.entity_id).replace(/\s*Status$/, "");
		if (r.has(c)) continue;
		let l = i.find((e) => e.device_id && e.device_id === t.device_id && e.translation_key === "cert_days_remaining")?.entity_id, u = F(e, l) ?? void 0, d = _t(e, t.entity_id, n), f;
		f = o.state === "down" && d >= 3 ? {
			name: c,
			kind: "down",
			text: `down seit ${B(d)}`
		} : o.state === "down" || o.state === "pending" || o.state === "unavailable" || o.state === "unknown" ? {
			name: c,
			kind: "pending",
			text: "prüft …"
		} : o.state === "up" && u !== void 0 && u < 7 ? {
			name: c,
			kind: "cert",
			text: `Zertifikat ${L(Math.floor(u))} Tage`
		} : {
			name: c,
			kind: "ok",
			text: ""
		}, f.certDays = u, a.push(f);
	}
	return a;
}
var uo = {
	down: 0,
	pending: 1,
	cert: 2,
	ok: 3
};
function fo(e) {
	let t = J(e)?.service_groups ?? co, n = [];
	for (let [e, r] of Object.entries(t)) try {
		n.push([e, new RegExp(r)]);
	} catch {}
	return n;
}
function po(e, t, n) {
	let r = lo(e, t, n), i = fo(t), a = [], o = /* @__PURE__ */ new Set();
	for (let [e, t] of i) {
		let n = r.filter((e) => !o.has(e) && t.test(e.name));
		if (!n.length) continue;
		n.forEach((e) => o.add(e));
		let i = n.filter((e) => e.kind === "down").length, s = n.reduce((e, t) => uo[t.kind] < uo[e.kind] ? t : e), c = s.kind === "down" ? `${i} von ${n.length} down` : s.text;
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
	let s = (e, t) => e.name.localeCompare(t.name, "de"), c = a.filter((e) => e.kind !== "ok").sort((e, t) => uo[e.kind] - uo[t.kind] || s(e, t));
	return {
		problems: c,
		ok: a.filter((e) => e.kind === "ok").sort(s),
		okMonitors: r.filter((e) => e.kind === "ok").length,
		total: r.length,
		down: c.filter((e) => e.kind === "down")
	};
}
function mo(e, t) {
	return Object.values(e.entities).filter((e) => e.platform === t);
}
function ho(e, t) {
	let n = J(t);
	if (n) return n.pihole ?? mo(e, "pi_hole").find((e) => e.entity_id.startsWith("switch."))?.entity_id;
}
function go(e, t, n, r) {
	let i = ho(e, t), a = i ? e.states[i] : void 0;
	if (!i || !a || a.state !== "on" && a.state !== "off") return null;
	if (a.state === "on") {
		let t = mo(e, "pi_hole").find((e) => e.translation_key === "percent_ads_blocked")?.entity_id, n = F(e, t);
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
		problem: _t(e, i, n) >= 70
	};
}
function _o(e, t) {
	let n = J(t);
	if (!n) return null;
	let r = mo(e, "unifi"), i = n.guest_wifi ?? r.find((e) => e.translation_key === "wlan_control" && e.entity_id.includes("guest"))?.entity_id ?? r.find((e) => e.translation_key === "wlan_control" && /gast|gaest|gäst/.test(e.entity_id))?.entity_id, a = i ? e.states[i] : void 0;
	if (!i || !a) return null;
	let o = e.entities[i]?.device_id, s = o ? Object.values(e.entities).filter((t) => t.device_id === o && e.states[t.entity_id]) : [], c = (e, t) => (s.find((t) => t.translation_key === e) ?? s.find((e) => e.entity_id.startsWith(`${t}.`)))?.entity_id, l = F(e, c("wlan_clients", "sensor"));
	return {
		entity: i,
		on: a.state === "on",
		clients: l === null ? void 0 : l,
		qr: c("qr_code", "image"),
		regenerate: c("regenerate_password", "button")
	};
}
function vo(e, t, n) {
	if (!J(t)) return null;
	let r = t.entities?.backup_last ?? mo(e, "backup").find((e) => e.translation_key === "last_successful_automatic_backup")?.entity_id, i = r ? e.states[r] : void 0;
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
function yo(e, t) {
	let n = J(t);
	return n ? !!n.printer || mo(e, "bambu_lab").some((e) => e.translation_key === "print_status") || !!ho(e, t) || !!_o(e, t) || po(e, t, /* @__PURE__ */ new Date()).total > 0 : !1;
}
function bo(e, t, n, r, i) {
	return po(e, t, n).down.length + +!!go(e, t, n, i)?.problem + +!!r + +!!vo(e, t, n)?.stale;
}
var xo = [
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
function So(e, t) {
	let n = J(t);
	if (!n) return null;
	let r = Object.values(e.entities).filter((e) => e.platform === "bambu_lab"), i = n.printer ?? r.find((e) => e.translation_key === "print_status" && e.device_id)?.device_id ?? void 0;
	if (!i) return null;
	let a = r.filter((e) => e.device_id === i), o = {};
	for (let e of a) {
		let t = e.translation_key;
		t && xo.includes(t) && !o[t] && (o[t] = e.entity_id);
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
var Co = /* @__PURE__ */ new Set([
	"running",
	"prepare",
	"init",
	"slicing",
	"pause"
]), wo = /* @__PURE__ */ new Set([
	"offline",
	"unavailable",
	"unknown"
]);
function To(e, t) {
	let n = t ? e.states[t] : void 0;
	if (!n) return "";
	try {
		return e.formatEntityState?.(n) ?? n.state;
	} catch {
		return n.state;
	}
}
function Eo(e) {
	return !!e && e !== "unknown" && e !== "unavailable";
}
function Do(e, t) {
	let n = I(e, t.e.end_time);
	if (Eo(n) && Number.isFinite(Date.parse(n))) return {
		key: n,
		at: Date.parse(n)
	};
	let r = e.states[t.e.print_status]?.last_changed;
	return r ? {
		key: r,
		at: Date.parse(r)
	} : {};
}
function Oo(e, t) {
	let n = (e.states[t.e.hms_errors ?? ""]?.attributes ?? {})["1-Error"];
	if (typeof n == "string" && n.trim()) return n.replace(/^[A-Z0-9_]+:\s*/, "").trim();
	let r = e.states[t.e.print_error ?? ""]?.attributes?.error;
	return typeof r == "string" && r.trim() ? r.trim() : "Fehler am Drucker";
}
function ko(e, t, n, r) {
	let i = I(e, t.e.print_status), a = {
		paused: !1,
		failedOnly: !1
	}, o = t.plug ? I(e, t.plug) : void 0;
	if (o === "off") return {
		...a,
		kind: "off",
		status: "Aus"
	};
	if (!i || wo.has(i)) return o === "on" && _t(e, t.plug, n) < 5 ? {
		...a,
		kind: "starting",
		status: "startet …"
	} : {
		...a,
		kind: "disconnected",
		status: "nicht verbunden"
	};
	let s = Do(e, t), c = F(e, t.e.print_progress), l = {
		jobKey: s.key,
		progress: c === null ? void 0 : c / 100
	};
	if (I(e, t.e.hms_errors) === "on" || I(e, t.e.print_error) === "on") return {
		...a,
		...l,
		kind: "error",
		errorText: Oo(e, t),
		status: "Fehler"
	};
	if (i === "failed") return s.at !== void 0 && n.getTime() - s.at < 432e5 && !r(`print-error:${s.key}`) ? {
		...a,
		...l,
		kind: "error",
		failedOnly: !0,
		errorText: Oo(e, t),
		status: "Fehler"
	} : {
		...a,
		...l,
		kind: "idle",
		status: "Bereit"
	};
	if (Co.has(i)) {
		let n = i === "pause";
		return {
			...a,
			...l,
			kind: "printing",
			paused: n,
			status: `${n ? "Pausiert" : "Druckt"} · ${To(e, t.e.stage)}`
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
function Ao(e, t) {
	let n = [
		t.e.left_nozzle_temp,
		t.e.right_nozzle_temp,
		t.e.nozzle_temp
	].map((t) => F(e, t)).filter((e) => e !== null);
	return n.length ? Math.max(...n) : null;
}
function jo(e, t, n) {
	return n.kind === "printing" || n.kind === "error" || (Ao(e, t) ?? 0) >= 50;
}
function Mo(e, t) {
	return t.ams ? Object.values(e.entities).filter((n) => n.device_id === t.ams && n.platform === "bambu_lab" && e.states[n.entity_id]) : [];
}
function No(e, t) {
	let n = Mo(e, t).filter((e) => e.translation_key === "tray").map((t) => e.states[t.entity_id]);
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
function Po(e, t) {
	let n = Mo(e, t), r = (e) => n.find((t) => t.translation_key === e)?.entity_id;
	if (I(e, r("drying")) === "on") {
		let t = F(e, r("remaining_drying_time"));
		return t === null ? "trocknet" : `trocknet · noch ${B(Math.round(t * 60))}`;
	}
	let i = F(e, r("humidity"));
	return i === null ? "" : `${L(Math.round(i))} % Feuchte`;
}
function Fo(e) {
	let t = Math.max(0, Math.round(e * 60));
	return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")} h`;
}
function Io(e) {
	if (!Eo(e)) return;
	let t = Date.parse(e);
	if (Number.isFinite(t)) return new Date(t).toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
// src/logic/technik-now.ts
var Lo = ["#bf9bff", "rgba(191,155,255,0.26)"], Ro = ["#30d158", "rgba(48,209,88,0.24)"], zo = ["#ff453a", "rgba(255,69,58,0.28)"];
function Bo(e, t, n, r, i, a) {
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
function Vo(e, t) {
	let n = new Date(e), r = n.toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	}), i = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(), a = Math.round((i(t) - i(n)) / 864e5);
	return a <= 0 ? r : a === 1 ? `gestern ${r}` : `${n.toLocaleDateString("de-DE", {
		day: "2-digit",
		month: "2-digit"
	})} ${r}`;
}
function Ho(e, t) {
	let n = new Date(e), r = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
	if (Math.round((r(t) - r(n)) / 864e5) <= 1) return Vo(e, t);
	let i = n.toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	});
	return `${n.getDate()}.${n.getMonth() + 1}. ${i}`;
}
function Uo(e, t, n, r) {
	let i = So(e, t);
	if (!i) return [];
	let a = ko(e, i, n, r.dismissed), o = I(e, i.e.subtask_name), s = Wo(o) ? o : "3D-Druck", c = a.progress === void 0 ? "" : `${L(Math.round(a.progress * 100))} %`;
	if (a.kind === "printing") {
		let t = Io(I(e, i.e.end_time)), n = F(e, i.e.remaining_time);
		return [{
			...Bo("print", `3D-Druck${a.paused ? " pausiert" : ""}${c ? ` · ${c}` : ""}`, [s, t ? `fertig um ${t}` : ""].filter(Boolean).join(" · "), a.paused ? O.pause : O.printer, Lo, "printer"),
			progress: a.progress,
			value: n === null ? void 0 : Fo(n)
		}];
	}
	if (a.kind === "error") {
		let e = Bo("print-error", "3D-Druck angehalten", a.errorText ?? "Fehler am Drucker", O.alert, zo, "printer");
		return a.failedOnly && a.jobKey && (e.dismiss = {
			label: "OK",
			key: `print-error:${a.jobKey}`
		}), [e];
	}
	if (a.kind === "finished") {
		let t = Do(e, i);
		if (t.at === void 0 || n.getTime() - t.at >= 432e5) return [];
		let a = `print-done:${t.key}`;
		if (r.dismissed(a)) return [];
		let o = F(e, i.e.bed_temp);
		return [{
			...Bo("print-done", "3D-Druck fertig", `${s} · ${o !== null && o >= 35 ? `Bett ${L(Math.round(o))}°, noch abkühlen` : "kann entnommen werden"}`, O.check, Ro, "printer"),
			dismiss: {
				label: "OK",
				key: a
			}
		}];
	}
	return [];
}
function Wo(e) {
	return !!e && e !== "unknown" && e !== "unavailable";
}
function Go(e, t, n, r) {
	if (!so(e, t)) return [];
	let i = Uo(e, t, n, r), a = po(e, t, n).down;
	if (a.length === 1) {
		let e = a[0], t = e.members ? e.text : e.text.replace(/^down /, "");
		i.push(Bo("services", `${e.name} nicht erreichbar`, t, O.server, zo, "technik"));
	} else a.length > 1 && i.push(Bo("services", `${a.length} Dienste nicht erreichbar`, a.map((e) => e.name).join(" · "), O.server, zo, "technik"));
	let o = go(e, t, n, r.pauseUntil);
	o?.problem && o.offSince !== void 0 && i.push({
		...Bo("pihole", "Werbeblocker aus", `Pi-hole · seit ${Vo(o.offSince, n)}`, O.shieldOff, zo, "technik"),
		action: {
			kind: "service",
			label: "Einschalten",
			domain: "switch",
			service: "turn_on",
			data: {},
			target: { entity_id: o.entity }
		}
	});
	let s = vo(e, t, n);
	return s?.stale && i.push(Bo("backup", "Backup veraltet", `letztes erfolgreiches vor ${B(Math.round(s.ageH * 60))}`, O.alert, zo, { moreInfo: s.entity })), i;
}
function Ko(e, t, n, r) {
	let i = So(e, t);
	return bo(e, t, n, !!i && ko(e, i, n, r.dismissed).kind === "error", r.pauseUntil);
}
// src/pages/overview.ts
function qo(e, t) {
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
				onConfirm: () => e.call("button", "press", {}, { entity_id: P(n, "vacuum_quick") })
			})
		};
		case "light": return {
			tap: () => e.go("rooms", { roomsFilter: "on" }),
			hold: () => {
				let t = Rn(e.hass);
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
				onConfirm: () => e.call("alarm_control_panel", "alarm_arm_away", {}, { entity_id: P(n, "alarm") })
			})
		};
	}
}
function Jo(e) {
	let t = (e, t, n, r = "") => w`<span class="room-air" style="color:${t}" title=${n} aria-label=${n}>${M(e, 13, t, 2.4)}${r}</span>`;
	switch (e.kind) {
		case "recommend": return t(O.wind, "#5ac8fa", "Lüften empfohlen");
		case "airing": return t(O.window, "#5ac8fa", "Lüftet", e.remaining > 0 ? dr(e.remaining) : "");
		case "overdue": return t(O.window, "#ff6b61", `Fenster offen seit ${e.openMin} min`, e.openMin < 60 ? `${e.openMin}′` : fn(e.openMin));
		case "stuck": return t(O.window, "#aeb4c0", "Fenstersensor prüfen", "?");
		case "open": return t(O.window, "#aeb4c0", "Fenster offen");
		default: return D;
	}
}
function Yo(e, t) {
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
function Xo(e, t, n = !0) {
	let r = Yo(e, t), i = t.action;
	return w`
    <div class="now ${n ? "wide" : ""}" style="background: linear-gradient(90deg, ${t.tint}, rgba(255,255,255,0.05) ${n ? 75 : 100}%)">
      <button class="now-main" ?disabled=${!r} @click=${() => r?.()}>
        <span class="circle" style="width:34px;height:34px;background:${t.color}">${t.appliance ? za(t.appliance, !0, 16, "#101010") : M(t.icon, 16, "#101010")}</span>
        <span class="now-text">
          <span class="now-title ellipsis">${t.title}</span>
          <span class="now-sub ellipsis">${t.text}</span>
        </span>
        ${t.value ? w`<span class="now-value" style="color:${t.color}">${t.value}</span>` : D}
      </button>
      ${i ? w`<button class="now-action" style="background:${t.color}"
            @click=${() => e.call(i.domain, i.service, i.data, i.target)}>${i.label}</button>` : t.dismiss ? w`<button class="now-action" style="background:${t.color}" @click=${() => e.dismiss(t.dismiss.key)}>${t.dismiss.label}</button>` : D}
      ${t.progress === void 0 ? D : w`<span class="now-progress" style="width:calc((100% - 60px) * ${Math.max(0, Math.min(1, t.progress))});background:${t.color}"></span>`}
    </div>
  `;
}
function Zo(e) {
	let { hass: t, config: n, now: r } = e, i = P(n, "weather"), a = Nn(t, i), o = Bn(t, n), s = [...Hn(t, n, e.rooms, r, e.heating(), (t) => e.window(t), e.alarmoSensors?.() ?? [], e.applianceRuns?.() ?? {}), ...Go(t, n, r, {
		dismissed: e.dismissed,
		pauseUntil: e.piholePause
	})], c = Xn(t, e.rooms, (t) => e.window(t)), l = so(t, n) && yo(t, n), u = l && Ko(t, n, r, {
		dismissed: e.dismissed,
		pauseUntil: e.piholePause
	}) > 0;
	return w`
    <div class="overview">
      <header class="head">
        <div>
          <div class="date">${jn(r)}</div>
          <h1>${An(r)}</h1>
        </div>
        <span class="head-actions">
        ${l ? w`<button class="tech-btn" aria-label=${u ? "Technik öffnen, es gibt Meldungen" : "Technik öffnen"} @click=${() => e.openSheet({ id: "technik" })}>
              ${M(O.server, 20, "rgba(255,255,255,0.85)", 2)}${u ? w`<span class="tech-dot"></span>` : D}
            </button>` : D}
        <button class="weather" aria-label="Wetter öffnen" @click=${() => e.openSheet({ id: "weather" })}>
          <span class="circle" style="width:40px;height:40px;background:rgba(143,208,255,0.2)">${Za(t.states[i]?.state ?? "", 20, "#8fd0ff")}</span>
          <span>
            <span class="wp-temp">${a.temp}</span>
            <span class="wp-label">${a.label}</span>
          </span>
        </button>
        </span>
      </header>

      <div class="status">
        ${o.map((t) => w`
          <button class="bubble" aria-label="${t.label}: ${t.value}" ${Lr(qo(e, t))}>
            <span class="circle ${t.wobble ? "wobble" : ""}" style="width:34px;height:34px;background:${t.color}">${M(t.icon, 17, "#111")}</span>
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
        ${s.length ? w`<div class="now-grid">${Qn(s).map((t) => Xo(e, t.item, t.wide))}</div>` : w`
            <div class="now calm wide">
              <span class="circle" style="width:34px;height:34px;background:#30d158">${M(O.check, 16, "#101010", 2.4)}</span>
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
          ${c.some((e) => e.aq) ? w`<span class="meta" style="font-size:11px">
                <span class="dot" style="background:#30d158"></span><span class="dot" style="background:#ffd60a"></span><span class="dot" style="background:#ff453a;margin-right:3px"></span>Luftqualität
              </span>` : D}
        </div>
        <div class="sum-grid">
          ${c.map((t) => {
		let n = dn(t.win, t.heating);
		return w`
              <button class="room ${n}" @click=${() => e.openSheet({
			id: "room",
			slug: t.room.slug
		})}
                aria-label="${t.room.name}: ${t.temp} Grad, ${t.hum} Prozent">
                <span class="circle room-circle">${M(t.icon, 16, n ? "#141008" : "#fff", 2)}</span>
                <span class="room-text">
                  <span class="room-name"><span class="ellipsis">${t.room.name}</span>${t.aq ? w`<span class="dot" style="background:${t.aq}"></span>` : D}</span>
                  <span class="room-sub">${t.hum} %${t.note ? ` · ${t.note}` : ""}${Jo(t.win)}</span>
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
var Qo = o`
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
`, $o, es = class extends ze {
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
		return w`
      <div class="head"><span class="lbl">${this.label}</span><span class="val">${this.format(e)}</span></div>
      <div class="track v-${this.variant}" role="slider" tabindex="0" aria-label=${this.label}
        aria-valuemin=${this.min} aria-valuemax=${this.max} aria-valuenow=${e} aria-valuetext=${this.format(e)}
        style="background:${this.track}"
        @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._up}
        @pointercancel=${this._cancel} @lostpointercapture=${this._up} @keydown=${this._key}>
        ${this.variant === "bubble" ? w`<span class="fill" style="width:max(64px, ${t * 100}%);background:${this.fill};opacity:${e <= this.min ? 0 : 1}"></span>
              <slot></slot>` : w`<span class="knob" style="left:calc(${t * 100}% - ${t * 44}px + 4px)"></span>`}
      </div>
    `;
	}
};
$o = es, $o.properties = {
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
}, $o.styles = o`
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
  `, customElements.get("start-dashboard-slider") || customElements.define("start-dashboard-slider", es);
// src/sheets/device.ts
var ts = "#ffd60a", ns = "#30d158", rs = "#5ac8fa", is = [
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
function as(e, t) {
	let n = e.hass.states[t]?.state;
	n && n !== "unavailable" && n !== "unknown" && (t.startsWith("light.") ? e.call("light", "toggle", {}, { entity_id: t }) : e.call("homeassistant", "toggle", {}, { entity_id: t }));
}
function os(e, t) {
	let n = R(e.hass, t);
	return n ? e.rooms.find((e) => e.areas.includes(n)) : void 0;
}
function ss(e, t, n) {
	if (n) return n.name;
	let r = R(e.hass, t);
	return r ? e.hass.areas[r]?.name ?? r : "";
}
function cs(e, t, n, r, i) {
	return w`<button class="tgl ${n ? "on" : ""}" aria-pressed=${n} aria-label="${i} ein/aus"
    style=${n ? `background:${r}` : ""} @click=${() => as(e, t)}><span></span></button>`;
}
function ls(e, t, n) {
	if (!e.hass.states[t]) return D;
	switch (ai(e.hass, t)) {
		case "light": return ds(e, t);
		case "purifier": return ms(e, t);
		case "dehumidifier": return hs(e, t);
		default: return ps(e, t, n ?? {
			id: "device",
			entity: t
		});
	}
}
var us = "linear-gradient(90deg, rgba(255,214,10,0.35), #ffe37a)";
function ds(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = r.state === "on", o = os(e, t), s = ri(n, t, o, e.config.names), c = fi(i), l = a ? Math.max(1, Math.round(Number(i.brightness) / 255 * 100) || 100) : 0, u = a ? pi(i) : void 0, d = a ? Ti(i) : null, f = d ? Ei(d) : {
		fill: us,
		icon: "#2b2200"
	}, p = c.colorTemp, m = Number(i.color_temp_kelvin), h = (n) => e.call("light", "turn_on", n, { entity_id: t });
	return N({
		title: s,
		subtitle: [ss(e, t, o), a ? u ?? "an" : r.state === "off" ? "aus" : "nicht erreichbar"].filter(Boolean).join(" · "),
		color: a ? ts : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#2b2200" : "#fff",
		glow: a ? "rgba(255,240,200,0.18)" : "rgba(255,255,255,0.05)",
		iconPath: Ue(t, s),
		headerExtra: cs(e, t, a, ts, s),
		onClose: e.closeSheet,
		body: w`
      <start-dashboard-slider variant="bubble" label="Helligkeit" .min=${0} .max=${100} .step=${1} .value=${l}
        .fill=${f.fill} .format=${(e) => `${e} %`}
        @slide-change=${(n) => n.detail.value <= 0 ? e.call("light", "turn_off", {}, { entity_id: t }) : h({ brightness_pct: n.detail.value })}>
        ${M(j.brightness, 22, l > 8 ? f.icon : "#fff", 2.2)}
      </start-dashboard-slider>

      ${p ? w`<div>
            <start-dashboard-slider variant="knob" label="Farbtemperatur" .min=${p.min} .max=${p.max} .step=${50}
              .value=${Number.isFinite(m) ? m : Math.round((p.min + p.max) / 2)}
              .track=${"linear-gradient(90deg, #ffa94d, #fff1d6 50%, #d6ecff)"}
              .format=${(e) => `${L(e)} K`}
              @slide-change=${(e) => h({ color_temp_kelvin: e.detail.value })}></start-dashboard-slider>
            <div class="ends"><span>warm ${L(p.min)} K</span><span>kalt ${L(p.max)} K</span></div>
          </div>` : D}

      ${c.color ? w`<div>
            <div class="sublabel">Farbe</div>
            <div class="swatches">
              ${is.map(([e, t, n]) => w`<button class="swatch" aria-label=${e} style="background:${t}" @click=${() => h({ hs_color: n })}></button>`)}
            </div>
          </div>` : D}

      ${c.brightness ? w`<div class="grid3">
            ${mi(c).map((e) => w`<button class="dchip" @click=${() => h(e.data)}>${e.name}</button>`)}
          </div>` : D}
    `
	});
}
function fs(e, t, n) {
	let r = e.hass.states[t]?.state === "on", i = e.ui.timeInput === t, a = e.ui.offAt, o = (n) => {
		e.runScript(P(e.config, "delayed_off"), {
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
	return w`
    <div class="sublabel">Ausschalten in</div>
    <div class="grid4 ${r ? "" : "disabled"}">
      ${n.map(([e, t]) => w`<button class="dchip sm" ?disabled=${!r} @click=${() => o(t)}>${e}</button>`)}
      <button class="dchip sm ${i ? "sel" : ""}" ?disabled=${!r} aria-expanded=${i}
        @click=${() => e.setUi({ timeInput: i ? void 0 : t })}>Zeit…</button>
    </div>
    ${i && r ? w`<div class="timerow">
          <input type="time" class="time" aria-label="Ausschalten um" .value=${e.ui.timeValue ?? ""}
            @input=${(t) => e.setUi({ timeValue: t.target.value })} />
          <button class="dchip sm sel" ?disabled=${!e.ui.timeValue}
            @click=${() => e.ui.timeValue && o(Ri(e.now, e.ui.timeValue))}>Starten</button>
        </div>` : D}
    ${s && r ? w`<div class="hint">${M(A.clock, 13, "rgba(255,255,255,0.6)", 2.2)}Schaltet um
          ${s.toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	})} Uhr aus</div>` : D}
  `;
}
function ps(e, t, n) {
	let { hass: r } = e, i = r.states[t], a = i.state === "on", o = os(e, t), s = ri(r, t, o, e.config.names), c = t.startsWith("light.") ? ts : ns, l = li(r, t), u = a ? "an" : i.state === "off" ? "aus" : "nicht erreichbar";
	return N({
		title: s,
		subtitle: [ss(e, t, o), u].filter(Boolean).join(" · "),
		color: a ? c : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#0b1a10" : "#fff",
		glow: a ? `${c}2e` : "rgba(255,255,255,0.05)",
		iconPath: Ue(t, s),
		headerExtra: cs(e, t, a, c, s),
		onClose: e.closeSheet,
		body: w`
      ${l ? w`<button class="powerrow" aria-label="Leistung, Verlauf anzeigen"
            @click=${() => e.openSheet({
			id: "energyChart",
			key: l.id,
			range: "24h",
			name: s,
			back: n
		})}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffc061" aria-hidden="true"><path d=${O.bolt}></path></svg>
            <span class="grow">${l.value === null ? w`<span class="pr-lbl">Leistung nicht verfügbar</span>` : w`<span class="pr-val">${W(l.value)}</span><span class="pr-lbl">Leistung jetzt</span>`}</span>
            <span class="more">Verlauf ›</span>
          </button>` : D}
      ${fs(e, t, [
			["30 min", 30],
			["1 h", 60],
			["2 h", 120]
		])}
    `
	});
}
function ms(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = os(e, t), o = ri(n, t, a, e.config.names), s = hi(r.state, i), c = s.mode !== "off", l = i.preset_modes ?? [], u = 100 / s.levels, d = F(n, a?.pm25), f = {
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
	return N({
		title: o,
		subtitle: [ss(e, t, a), f].filter(Boolean).join(" · "),
		color: c ? ns : "rgba(255,255,255,0.12)",
		iconStroke: c ? "#0b1a10" : "#fff",
		glow: c ? "rgba(48,209,88,0.16)" : "rgba(255,255,255,0.05)",
		iconPath: j.fan,
		headerExtra: w`
      ${d === null ? D : w`<span class="pmchip" style="background:${Yn(d)}2e;color:${Yn(d)}">
            <span class="dot" style="background:${Yn(d)}"></span>PM2.5 ${L(d)}</span>`}
      ${cs(e, t, c, ns, o)}`,
		onClose: e.closeSheet,
		body: w`
      <div class="grid3" role="radiogroup" aria-label="Modus">
        ${p.map(([e, t]) => {
			let n = s.mode === e;
			return w`<button class="dchip lg ${n ? "selg" : ""}" role="radio" aria-checked=${n} @click=${() => m(e)}>${t}</button>`;
		})}
      </div>
      <div class="levelrow">
        <span class="lvl">Stufe</span>
        <div class="levels ${s.mode === "manual" ? "" : "disabled"}" style="grid-template-columns: repeat(${s.levels}, minmax(0, 1fr))">
          ${Array.from({ length: s.levels }, (e, t) => t + 1).map((n) => w`
            <button class="dchip md ${s.mode === "manual" && s.level === n ? "selg" : ""}" ?disabled=${s.mode !== "manual"}
              aria-pressed=${s.level === n}
              @click=${() => e.call("fan", "set_percentage", { percentage: Math.round(n * u) }, { entity_id: t })}>${n}</button>`)}
        </div>
      </div>
      <div class="hint">Stufen nur im Modus „Manuell“ aktiv.</div>
    `
	});
}
function hs(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = r.state === "on", o = os(e, t), s = ri(n, t, o, e.config.names), c = Number(i.min_humidity) || 35, l = Number(i.max_humidity) || 85, u = Number(i.target_humidity_step) || 5, d = e.pending(t, "humidity") ?? (Number(i.humidity) || c), f = Number(i.current_humidity), p = i.available_modes ?? Object.keys(gi), m = (n) => {
		let r = Math.min(l, Math.max(c, Math.round((d + n * u) / u) * u));
		e.setPending(t, "humidity", r, () => e.call("humidifier", "set_humidity", { humidity: r }, { entity_id: t }));
	};
	return N({
		title: s,
		subtitle: [
			ss(e, t, o),
			a ? "an" : "aus",
			Number.isFinite(f) ? `Gerät misst ${L(f)} %` : ""
		].filter(Boolean).join(" · "),
		color: a ? rs : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#06202c" : "#fff",
		glow: a ? "rgba(90,200,250,0.18)" : "rgba(255,255,255,0.05)",
		iconPath: j.drop,
		headerExtra: cs(e, t, a, rs, s),
		onClose: e.closeSheet,
		body: w`
      <div class="humrow">
        <button class="hstep" aria-label="Zielfeuchte senken" ?disabled=${d <= c} @click=${() => m(-1)}>−</button>
        <span class="hval"><span class="big">${L(d)} %</span><span class="small">Zielfeuchte · ${c}–${l} %</span></span>
        <button class="hstep" aria-label="Zielfeuchte erhöhen" ?disabled=${d >= l} @click=${() => m(1)}>+</button>
      </div>
      <div class="modes" role="radiogroup" aria-label="Modus" style="grid-template-columns: repeat(${p.length}, minmax(0, 1fr))">
        ${p.map((n) => {
			let r = i.mode === n;
			return w`<button class="dchip sm ${r ? "selb" : ""}" role="radio" aria-checked=${r}
            @click=${() => e.call("humidifier", "set_mode", { mode: n }, { entity_id: t })}>${gi[n] ?? n}</button>`;
		})}
      </div>
      ${fs(e, t, [
			["1 h", 60],
			["2 h", 120],
			["4 h", 240]
		])}
    `
	});
}
var gs = o`
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
`, _s = (e, t) => `width:${t}px;height:${t}px;background:${e}`;
function vs(e) {
	let { hass: t } = e, n = Ai(t, e.config, e.rooms), r = Ii(t, n), i = r.some((t) => t.id === e.roomsFilter) ? e.roomsFilter : "all", a = Li(n, i), o = n.flatMap((e) => e.devices.filter((e) => e.on && e.kind === "light").map((e) => e.id));
	return w`
    <div class="rooms">
      <header class="rhead">
        <div>
          <div class="date">${Fi(n)}</div>
          <h1>Räume</h1>
        </div>
        <button class="lightsoff" ?disabled=${!o.length}
          @click=${() => e.call("light", "turn_off", {}, { entity_id: o })}>
          ${M(A.power, 16, "#fff", 2.4)}Licht aus
        </button>
      </header>

      <div class="rfilter" role="tablist" aria-label="Filter" style="grid-template-columns: repeat(${r.length}, minmax(0, 1fr))">
        ${r.map((t) => w`<button role="tab" aria-selected=${t.id === i} class=${t.id === i ? "sel" : ""}
          @click=${() => e.setRoomsFilter(t.id)}>${t.label}</button>`)}
      </div>

      ${a.length ? a.map((t) => ys(e, t, i === "on")) : w`<div class="rempty">Gerade ist nichts an.</div>`}
    </div>
  `;
}
function ys(e, t, n = !1) {
	let r = xi(e.hass, t.scenes.map((e) => e.id), e.sceneConfigs(), e.now), { hass: i } = e, { room: a } = t, o = F(i, a.temperature), s = F(i, a.humidity), c = !!a.climate;
	return w`
    <article class="rcard ${t.active ? "active" : ""} ${n ? "compact" : ""}">
      <div class="rtop">
        <span class="circle" style=${_s(t.active ? "#ffd60a" : "rgba(255,255,255,0.12)", n ? 32 : 40)}>
          ${M(Ve(a.name, a.icon), 18, t.active ? "#2b2200" : "#fff", 2)}
        </span>
        <span class="rname">
          <h2 class="ellipsis">${a.name}</h2>
          <span class="rsub ellipsis">${t.sub}</span>
        </span>
        ${o !== null || t.power !== null ? w`<button class="rpill" ?disabled=${!c} aria-label="${a.name}: Raumkarte öffnen"
              @click=${() => c && e.openSheet({
		id: "room",
		slug: a.slug
	})}>
              ${o === null ? D : w`<span>${U(o)}°</span>`}
              ${s === null ? D : w`<span class="muted">${Math.round(s)} %</span>`}
              ${t.power === null ? D : w`<span class="pw"><svg width="11" height="11" viewBox="0 0 24 24" fill="#ffc061" aria-hidden="true"><path d=${O.bolt}></path></svg>${W(t.power)}</span>`}
            </button>` : D}
        ${n ? t.scenes.map((t) => w`<button class="roff" aria-label="${a.name}: alles aus" title="Alles aus"
              @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>${M(A.power, 15, "#fff", 2.3)}</button>`) : D}
      </div>

      ${n ? w`<div class="rgrid">${t.devices.map((t) => xs(e, t))}</div>` : w`${t.scenes.length ? w`<div class="rgrid" role="group" aria-label="Szenen ${a.name}">
                ${t.scenes.map((t, n) => bs(e, t, n, r))}
              </div>` : D}
          ${t.devices.length ? w`<div class="rgrid">${t.devices.map((t) => xs(e, t))}</div>` : D}`}
    </article>
  `;
}
function bs(e, t, n, r) {
	let i = t.off ? "rgba(255,255,255,0.14)" : st[n % st.length], a = t.off ? "#fff" : "#101010", o = r.has(t.id);
	return w`<button class="rscene" aria-pressed=${o} style=${o ? `background:${t.off ? "rgba(255,255,255,0.2)" : i + "33"};box-shadow:0 0 18px ${t.off ? "rgba(255,255,255,0.08)" : i + "40"}` : ""}
    @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>
    <span class="circle" style=${_s(i, 34)}>${t.off ? M(A.power, 16, a, 2.1) : ct(t.icon, A.scene, a)}</span>
    <span class="ellipsis">${t.off ? "Aus" : t.name}</span>
  </button>`;
}
function xs(e, t) {
	let n = t.kind === "light" ? Di(e.hass.states[t.id]?.attributes ?? {}) : null, r = n ? n.color : "#30d158", i = n ? n.bg : "rgba(48,209,88,0.14)", a = t.on ? n ? n.icon : "#151005" : t.unavailable ? "rgba(255,255,255,0.45)" : "#fff";
	return w`<button class="rdev ${t.on ? "on" : ""} ${t.unavailable ? "na" : ""}" style=${t.on ? `background:${i}` : ""}
    aria-label="${t.name}: ${t.tileState}"
    ${Lr({
		tap: () => as(e, t.id),
		hold: () => e.openSheet({
			id: "device",
			entity: t.id
		})
	})}>
    <span class="circle" style=${_s(t.on ? r : "rgba(255,255,255,0.1)", 32)}>${Va(t, e.hass.states[t.id]?.attributes, 15, a, 2.2)}</span>
    <span class="rdtext">
      <span class="ellipsis rdname">${t.name}</span>
      <span class="rdstate" style="color:${t.on ? n ? n.text : "#9af0b5" : "rgba(255,255,255,0.55)"}">${t.tileState}</span>
    </span>
  </button>`;
}
var Ss = o`
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
`, Cs = {
	pylon: "M12 2 6 22M12 2l6 20M8 9h8M7 14h10",
	server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
	question: "M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.5V14M12 18h.01",
	battery: "M3 8h15a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM21 11v2"
}, Y = 5, ws = (e) => `${L(e, 1)} kWh`, Ts = (e) => `${L(e, 2)} €`;
function Es(e) {
	return e.untracked ? Cs.question : /netzwerk|nas|server|router|switch|rack/i.test(e.name) ? Cs.server : Ue(e.id, e.name);
}
function Ds(e, t) {
	return t ? w`<div class="vline live ${t}" style="--c:${e}" aria-hidden="true"><span class="dashes"></span><span class="arrow"></span></div>` : w`<div class="vline idle" style="border-color:${e}4d" aria-hidden="true"></div>`;
}
function Os(e, t) {
	return t ? w`<div class="fline live ${t}" style="--c:${e}" aria-hidden="true"><span class="dashes"></span><span class="arrow"></span></div>` : w`<div class="fline idle" style="border-color:${e}4d" aria-hidden="true"></div>`;
}
function ks(e, t, n) {
	let r = t.export > t.import, i = r ? t.export : t.import, a = r ? "#64d2ff" : "#ff9f0a", o = t.battery;
	return w`
        <div class="frow">
          <button class="node" aria-label="PV ${W(t.pv)}, Verlauf anzeigen" @click=${() => n("pv")}>
            <span class="circle" style="width:48px;height:48px;background:rgba(255,214,10,${t.pv > Y ? .32 : .18})">${M(O.sun, 22, "#ffd60a", 2)}</span>
            <span class="nv">${W(t.pv)}</span><span class="nl">PV</span>
          </button>
          ${Os("#ffd60a", t.pv > Y ? "right" : null)}
          <button class="node" aria-label="Haus ${W(t.house)}, Verbrauch anzeigen" @click=${() => n("house")}>
            <span class="house">${M(O.home, 22, "#101218", 2.2)}<span>${W(t.house)}</span></span>
            <span class="nl">Haus</span>
          </button>
          ${Os(a, i > Y ? r ? "right" : "left" : null)}
          <button class="node" aria-label="Netz ${W(i)}, Verlauf anzeigen" @click=${() => n(r ? "export" : "import")}>
            <span class="circle" style="width:48px;height:48px;background:${i > Y ? a : "rgba(255,255,255,0.12)"}">${M(Cs.pylon, 22, i > Y ? "#1a1206" : "#fff", 2.2)}</span>
            <span class="nv">${W(i)}</span><span class="nl">${r ? "Einspeisung" : "Bezug"}</span>
          </button>
        </div>
        ${o ? w`<button class="bnode" aria-label="Akku, geladene und entladene Energie anzeigen" @click=${() => e.openSheet({
		id: "energyChart",
		key: "battery",
		range: "7d"
	})}>
              ${Ds("#30d158", o.power > Y ? "up" : o.power < -5 ? "down" : null)}
              <span class="bring" style="--soc:${Math.max(0, Math.min(100, o.soc ?? 0))}%" role="img"
                aria-label="Akku${o.soc === null ? "" : ` ${L(o.soc)} %`}">
                <span class="circle" style="width:44px;height:44px;background:${Math.abs(o.power) > Y ? "#30d158" : "#1d2a22"}">${M(Cs.battery, 20, Math.abs(o.power) > Y ? "#0b1a10" : "#7ee8a0", 2.2)}</span>
              </span>
              <span class="nv">${Math.abs(o.power) > Y ? W(Math.abs(o.power)) : "0 W"}</span>
              <span class="nl">${o.power > Y ? "Akku liefert" : o.power < -5 ? "Akku lädt" : "Akku"}${o.soc === null ? "" : ` · ${L(o.soc)} %`}${Math.abs(o.power) <= Y && oa(o, e.config.battery) ? ` · ${oa(o, e.config.battery)}` : ""}</span>
            </button>` : D}`;
}
function As(e, t, n) {
	return e.charge > Y ? `lädt ${W(e.charge)}` : e.fromBattery > Y ? `liefert ${W(e.fromBattery)}` : oa(t, n.config.battery) || "ruht";
}
function js(e, t, n, r, i) {
	let a = Ji(t), o = Math.max(1, a.pv + a.battery + a.grid), s = (e) => `${e / o * 100}%`, c = t.export > t.import, l = c ? t.export : t.import, u = c ? "#64d2ff" : "#ff9f0a", d = n.charge > Y || n.fromBattery > Y, f = (e, t, n) => w`<div class="spart"><span class="nl"><i class="dot" style="background:${t}"></i>${e}</span><span class="nv">${W(n)}</span></div>`, p = (e, t, n = "right") => w`<div class="clink ${t ? `live ${n}` : "idle"}" style="--c:${e}" aria-hidden="true"><span class="dashes"></span></div>`;
	return w`
    <div class="shead">
      <span class="nl">Haus jetzt</span>
      <button class="hv" aria-label="Haus ${W(t.house)}, Verbrauch anzeigen" @click=${() => i("house")}>${W(t.house)}</button>
    </div>
    <div class="sbar" role="img" aria-label="Sonne ${W(a.pv)}, Akku ${W(a.battery)}, Netz ${W(a.grid)}">
      <span style="width:${s(a.pv)};background:#ffd60a"></span><span style="width:${s(a.battery)};background:#30d158"></span><span style="width:${s(a.grid)};background:#ff9f0a"></span>
    </div>
    <div class="sparts">${f("Sonne", "#ffd60a", a.pv)}${f("Akku", "#30d158", a.battery)}${f("Netz", "#ff9f0a", a.grid)}</div>
    <div class="chain">
      <button class="cnode" aria-label="PV ${W(t.pv)}, Verlauf anzeigen" @click=${() => i("pv")}>
        <span class="circle" style="width:40px;height:40px;background:rgba(255,214,10,${t.pv > Y ? .32 : .18})">${M(O.sun, 19, "#ffd60a", 2)}</span>
        <span class="nv">${W(t.pv)}</span><span class="nl">PV</span>
      </button>
      ${p("#ffd60a", n.pv > Y)}
      <button class="cnode" aria-label="Akku, geladene und entladene Energie anzeigen" @click=${() => e.openSheet({
		id: "energyChart",
		key: "battery",
		range: "7d"
	})}>
        <span class="bring small" style="--soc:${Math.max(0, Math.min(100, r.soc ?? 0))}%" role="img" aria-label="Akku${r.soc === null ? "" : ` ${L(r.soc)} %`}">
          <span class="circle" style="width:34px;height:34px;background:${d ? "#30d158" : "#1d2a22"}">${M(Cs.battery, 17, d ? "#0b1a10" : "#7ee8a0", 2.2)}</span>
        </span>
        <span class="nv">${r.soc === null ? "–" : `${L(r.soc)} %`}</span><span class="nl">${As(n, r, e)}</span>
      </button>
      ${p("#30d158", n.output > Y)}
      <button class="cnode" aria-label="Akku-Ausgang ${W(n.output)}, Verbrauch anzeigen" @click=${() => i("house")}>
        <span class="circle" style="width:40px;height:40px;background:#fff">${M(O.home, 19, "#101218", 2.2)}</span>
        <span class="nv">${W(n.output)}</span><span class="nl">ins Haus</span>
      </button>
      ${p(u, l > Y, c ? "right" : "left")}
      <button class="cnode" aria-label="Netz ${W(l)}, Verlauf anzeigen" @click=${() => i(c ? "export" : "import")}>
        <span class="circle" style="width:40px;height:40px;background:${l > Y ? u : "rgba(255,255,255,0.12)"}">${M(Cs.pylon, 19, l > Y ? "#1a1206" : "#fff", 2.2)}</span>
        <span class="nv">${W(l)}</span><span class="nl">${c ? "Einspeisung" : "Bezug"}</span>
      </button>
    </div>`;
}
var Ms = 6;
function Ns(e) {
	let { hass: t, config: n } = e, r = e.energy(), i = qi(t, n, r.prefs), a = $i(t, n, r.today), o = r.prefs ? Wi(Ui(r.prefs), a, r.today?.cost === void 0 ? void 0 : {
		cost: r.today.cost,
		compensation: r.today.compensation ?? 0
	}) : null, s = na(t, n, 100, r.prefs), c = e.consumersAll ? s : s.slice(0, Ms), l = (t, n) => e.openSheet({
		id: "energyChart",
		key: t,
		range: "24h",
		name: n
	}), u = Math.max(1, ...c.map((e) => e.value)), d = i.battery, f = i.coupled;
	return w`
    <div class="energy">
      <header class="ehead">
        <div class="date">${Xi(e.now, i)}</div>
        <h1>Energie</h1>
      </header>

      <div class="flow">
        ${f && d ? js(e, i, f, d, l) : ks(e, i, l)}
        <button class="elink" @click=${() => e.navigate("/energy")}>Energie-Dashboard ›</button>
      </div>

      <div class="section-head">
        <h2>Heute</h2><span class="rule" aria-hidden="true"></span>
        <span class="meta">ca. ${ws(a.consumed)} verbraucht</span>
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
	].map((e) => w`<button class="tile" aria-label="${e.l} ${ws(e.v)}, Verlauf anzeigen" @click=${() => l(e.k)}>
          <span class="tdot" style="background:${e.c}"></span><span class="tv">${ws(e.v)}</span><span class="tl">${e.l}</span></button>`)}
      </div>
      ${o ? w`<div class="tiles">
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
	].map((e) => w`<button class="tile" aria-label="${e.l} ${Ts(e.v)}, Verlauf anzeigen" @click=${() => l("cost")}>
              <span class="tdot" style="background:${e.c}"></span><span class="tv">${Ts(e.v)}</span><span class="tl">${e.l}</span></button>`)}
          </div>` : D}

      ${a.consumed > 0 ? w`<div class="split">
            ${Ps("Woher kam der Strom?", a.autarky === null ? "" : `${a.autarky} % autark`, "#7ee8a0", [
		a.local,
		"#ffd60a",
		`PV & Akku ${ws(a.local)}`
	], [
		a.import,
		"#ff9f0a",
		`Netz ${ws(a.import)}`
	], () => l("autarky"))}
            ${a.pv > 0 ? Ps("Wohin ging der Solarstrom?", `${a.selfUse} % selbst genutzt`, "#ffe066", [
		Math.max(0, a.pv - a.export),
		"#ffd60a",
		`Haus ${ws(Math.max(0, a.pv - a.export))}`
	], [
		a.export,
		"#64d2ff",
		`Eingespeist ${ws(a.export)}`
	], () => l("selfuse")) : w`<div class="nopv">Heute noch kein Solarstrom.</div>`}
          </div>` : D}

      <div class="section-head"><h2>Aktuell</h2><span class="rule" aria-hidden="true"></span></div>
      ${c.length ? c.map((e) => w`
            <button class="cons" aria-label="${e.name} ${W(e.value)}, Verlauf anzeigen" @click=${() => l(e.id, e.name)}>
              <span class="cbar" style="width:${Math.round(e.value / u * 100)}%" aria-hidden="true"></span>
              <span class="circle" style="width:36px;height:36px;background:rgba(255,255,255,0.12)">${M(Es(e), 16, "#fff", 2)}</span>
              <span class="cname ellipsis">${e.name}</span>
              <span class="cval">${W(e.value)}</span>
            </button>`) : w`<div class="nopv">Keine Messwerte.</div>`}
      ${s.length > Ms ? w`<button class="cmore" @click=${() => e.setConsumersAll(!e.consumersAll)}>
            ${e.consumersAll ? "Weniger anzeigen" : `Alle anzeigen (${s.length})`}</button>` : D}
    </div>
  `;
}
function Ps(e, t, n, r, i, a) {
	let o = r[0] + i[0] || 1, s = Math.round(r[0] / o * 100);
	return w`<button class="sbtn" aria-label="${e} ${t}, Verlauf anzeigen" @click=${a}>
    <div class="shead"><span>${e}</span><span style="color:${n}">${t}</span></div>
    <div class="sbar" role="img" aria-label="${r[2]}, ${i[2]}"><span style="width:${s}%;background:${r[1]}"></span><span style="width:${100 - s}%;background:${i[1]}"></span></div>
    <div class="slegend"><span>${r[2]}</span><span>${i[2]}</span></div>
  </button>`;
}
var Fs = o`
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
  }
  /* Dashes move with a GPU transform (one 16 px period per cycle), so they stay smooth. */
  .dashes {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 2px;
  }
  .dashes::before {
    content: '';
    position: absolute;
    inset: 0 -16px;
    background: repeating-linear-gradient(90deg, var(--c) 0 10px, transparent 10px 16px);
    animation: dash-x 1s linear infinite;
    will-change: transform;
  }
  .left > .dashes::before {
    animation-direction: reverse;
  }
  .vline .dashes::before {
    inset: -16px 0;
    background: repeating-linear-gradient(180deg, var(--c) 0 10px, transparent 10px 16px);
    animation-name: dash-y;
  }
  .vline.up > .dashes::before {
    animation-direction: reverse;
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
  @keyframes dash-x {
    from {
      transform: translateX(-16px);
    }
    to {
      transform: translateX(0);
    }
  }
  @keyframes dash-y {
    from {
      transform: translateY(-16px);
    }
    to {
      transform: translateY(0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .dashes::before {
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

  .shead {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0 6px;
  }
  .shead .nl {
    font-size: 13px;
  }
  .hv {
    font-size: 24px;
    font-weight: 700;
  }
  .sbar {
    display: flex;
    height: 20px;
    margin: 0 4px;
    border-radius: 10px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
  }
  .sbar span {
    transition: width 0.6s ease;
  }
  .sparts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .spart {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.05);
  }
  .spart .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    margin-right: 6px;
  }
  .chain {
    display: flex;
    align-items: flex-start;
    gap: 2px;
    padding: 10px 8px 8px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.04);
  }
  .cnode {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 0;
    flex: 0 0 auto;
  }
  .cnode .nl {
    font-size: 10px;
    white-space: nowrap;
  }
  .bring.small {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
  .clink {
    position: relative;
    flex: 1;
    min-width: 12px;
    height: 4px;
    margin-top: 18px;
  }
  .clink.idle {
    height: 0;
    border-top: 3px dotted color-mix(in srgb, var(--c) 30%, transparent);
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
`, Is = {
	home: "#30d158",
	zone: "#64d2ff",
	away: "#8e8e93",
	unknown: "#8e8e93"
}, Ls = "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", Rs = "M5 12h14M13 6l6 6-6 6";
function zs(e, t = 40) {
	return w`<span class="pp-av ${e.place === "away" || e.place === "unknown" ? "out" : ""}" style="width:${t}px;height:${t}px" title="${e.name}: ${e.zoneName}">
    ${e.picture ? w`<img src=${e.picture} alt="" />` : w`<span class="pp-ini">${e.initials}</span>`}
    <span class="pp-zone" style="background:${Is[e.place]}">
      ${e.place === "away" ? M(Rs, 10, "#111", 2.6) : e.place === "unknown" ? M(Ls, 10, "#111", 2.4) : ct(e.zoneIcon, e.place === "home" ? O.home : Ls, "#111", 12)}
    </span>
  </span>`;
}
// src/logic/security.ts
var Bs = [
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
function Vs(e) {
	return e === "disarmed" ? "Alarm unscharf" : e === "triggered" ? "Alarm ausgelöst!" : `Alarm: ${In[e] ?? e}`;
}
function Hs(e, t, n) {
	let r = P(t, "alarm"), i = e.states[r], a = i?.state ?? "unavailable", o = "", s = i?.attributes.last_triggered, c = s ? new Date(String(s).replace(" ", "T")) : void 0;
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
		label: Vs(a),
		sub: o
	};
}
var Us = [
	"window",
	"door",
	"opening",
	"garage_door"
], Ws = ["versatile_thermostat", "bambu_lab"], Gs = /^((fenster|tür|tur)sensor(en)?|sensor|contact|kontakt|fensterstatus|status)$/i;
function Ks(e) {
	return e.toLowerCase().split(/[\s&,._\-]+/).filter(Boolean);
}
function qs(e) {
	return e.charAt(0).toUpperCase() + e.slice(1);
}
function Js(e, t, n, r) {
	let i = e.states[t]?.attributes.friendly_name ?? t.split(".")[1].split("_").map(qs).join(" "), a = e.areas[n], o = /* @__PURE__ */ new Set([...Ks(a?.name ?? ""), ...Ks(n)]), s = (e) => {
		let t = Ks(e);
		return t.length > 0 && t.every((e) => o.has(e));
	}, c = i.split(/\s+/).filter((e) => e && !Gs.test(e) && !s(e)).join(" ").trim();
	return !c || /^(fenster|tür|tur)$/i.test(c) ? r === "door" ? "Tür" : "Fenster" : c;
}
function Ys(e, t, n) {
	let r = /* @__PURE__ */ new Set([...Ws, ...t.exclude?.openings ?? []]), i = /* @__PURE__ */ new Map();
	for (let [t, n] of Object.entries(e.states)) {
		if (!t.startsWith("binary_sensor.") || !Us.includes(n.attributes.device_class) || Array.isArray(n.attributes.entity_id)) continue;
		let a = e.entities[t];
		if (r.has(t) || a?.platform && r.has(a.platform)) continue;
		let o = R(e, t);
		if (!o || !e.areas[o]) continue;
		let s = String(n.attributes.friendly_name ?? t), c = /t[üu]r|door|tor\b/i.test(s) || n.attributes.device_class === "garage_door" ? "door" : "window", l = n.state === "unavailable" || n.state === "unknown";
		i.has(o) || i.set(o, []), i.get(o).push({
			id: t,
			title: Js(e, t, o, c),
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
			name: rr[r] ?? r,
			areas: n
		};
	});
}
function Xs(e, t) {
	let n = e.flatMap((e) => e.areas.flatMap((e) => e.items)), r = n.filter((e) => e.open).length, i = `${n.length - r} von ${n.length} zu`;
	return t === "triggered" ? `Alarm ausgelöst! · ${i}` : r ? `${r} offen · ${i}` : `Alles ruhig · ${i}`;
}
// src/logic/persons.ts
function Zs(e, t) {
	let n = t.attributes.in_zones?.map((t) => e.states[t]).find(Boolean);
	if (n) return n;
	let r = t.state.trim();
	return Object.values(e.states).find((e) => e.entity_id.startsWith("zone.") && String(e.attributes.friendly_name ?? "").trim() === r);
}
function Qs(e, t) {
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
		let s = Zs(e, r);
		return [{
			...o,
			place: "zone",
			zoneName: String(s?.attributes.friendly_name ?? r.state).trim(),
			zoneIcon: s?.attributes.icon
		}];
	});
}
function $s(e) {
	let t = e.filter((e) => e.place === "home").length;
	return t === e.length ? "Alle da" : t === 0 ? "Niemand da" : `${t} von ${e.length} da`;
}
function ec(e, t) {
	let n = new Date(e), r = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`, i = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(), a = Math.round((i(t) - i(n)) / 864e5);
	return a <= 0 ? `seit ${r}` : a < 7 ? `seit ${n.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")} ${r}` : `seit ${n.getDate()}.${n.getMonth() + 1}.`;
}
// src/pages/security.ts
var tc = {
	camera: "M3 7h12v10H3zM15 10l6-3v10l-6-3",
	muted: "M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6",
	sound: "M4 9h4l5-4v14l-5-4H4zM17 8a5 5 0 0 1 0 8M19.5 5.5a9 9 0 0 1 0 13",
	full: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
};
function nc(e, t) {
	if (e.config.names?.[t]) return e.config.names[t];
	let n = z(e.hass, t);
	return /doorbell|klingel|haust/i.test(`${t} ${n}`) ? "Haustür" : n;
}
function rc(e, t, n) {
	let r = t.currentTarget.closest(".cam");
	r?.requestFullscreen ? r.requestFullscreen().catch(() => e.moreInfo(n)) : e.moreInfo(n);
}
function ic(e) {
	let { hass: t, config: n } = e, r = Hs(t, n, e.now), i = Ys(t, n, e.rooms), a = r.state === "triggered" ? "#ff453a" : "#bf9bff", o = P(n, "camera"), s = t.states[o], c = t.states[P(n, "camera_motion")], l = t.states[P(n, "camera_person")], u = e.ui.camSound !== !0, d = Qs(t, n), f = !!s && s.state !== "unavailable" && !!customElements.get("ha-camera-stream");
	return w`
    <div class="security">
      <header class="shead2">
        <div>
          <div class="date">${Xs(i, r.state)}</div>
          <h1>Schutz</h1>
        </div>
        ${d.length ? w`<button class="pp-pill" aria-label="Personen: ${$s(d)}, Karte öffnen"
              @click=${() => e.openSheet({ id: "persons" })}>
              ${d.map((e) => zs(e))}
            </button>` : D}
      </header>

      ${t.states[r.id] ? w`<div class="alarmpill" style="background: linear-gradient(90deg, ${a}42, rgba(255,255,255,0.05) 70%)">
            <button class="circle abtn" style="width:48px;height:48px;background:${a}" aria-label="Alarm-Details"
              @click=${() => e.openSheet({ id: "alarm" })}>${M(Pn(r.state), 22, "#1d1030", 2.2)}</button>
            <span class="atext">
              <span class="atitle">${r.label}</span>
              ${r.sub ? w`<span class="asub">${r.sub}</span>` : D}
            </span>
            ${Bs.filter((e) => e.state !== r.state).map((t) => w`
              <button class="amode" aria-label=${t.name} title=${t.name}
                @click=${() => e.call("alarm_control_panel", t.service, {}, { entity_id: r.id })}>
                ${M(O[t.icon], 18, "#e2d3ff", 2.1)}
              </button>`)}
          </div>` : D}

      ${s ? w`<section class="camcard" aria-label="${nc(e, o)}-Kamera">
            <div class="cam">
              ${f ? w`<ha-camera-stream class="stream" .hass=${t} .stateObj=${s} .muted=${u} .controls=${!1}
                    allow-exoplayer></ha-camera-stream>` : w`<span class="camph">${M(tc.camera, 40, "rgba(255,255,255,0.4)", 1.6)}</span>`}
              <span class="camlive"><span class="dot" style="background:${f ? "#ff453a" : "#888"}"></span>${f ? "Live" : "Offline"} · ${nc(e, o)}</span>
              <span class="camtools">
                <button aria-label=${u ? "Ton an" : "Ton aus"} @click=${() => e.setUi({ camSound: u })}>${M(u ? tc.muted : tc.sound, 15, "#fff", 2.2)}</button>
                <button aria-label="Vollbild" @click=${(t) => rc(e, t, o)}>${M(tc.full, 15, "#fff", 2.2)}</button>
              </span>
            </div>
            <div class="camchips">
              ${c ? w`<span class="cchip ${c.state === "on" ? "hot" : ""}">${c.state === "on" ? "Bewegung erkannt" : "Keine Bewegung"}</span>` : D}
              ${l ? w`<span class="cchip ${l.state === "on" ? "hot" : ""}">${l.state === "on" ? "Person erkannt" : "Keine Person"}</span>` : D}
              <span class="grow"></span>
              <button class="cchip btn2" @click=${() => e.moreInfo(c ? c.entity_id : o)}>Verlauf</button>
            </div>
          </section>` : D}

      ${i.length ? w`
            <div class="section-head">
              <h2>Fenster &amp; Türen</h2><span class="rule" aria-hidden="true"></span>
              <span class="meta legend"><span><span class="dot" style="background:#30d158"></span>zu</span><span><span class="dot" style="background:#ff453a"></span>offen</span></span>
            </div>
            ${i.map((t) => w`
              <div class="flabel">${t.name}</div>
              <div class="ogrid">
                ${t.areas.map((t) => w`
                  <div class="opill ${t.items.length > 3 ? "wide" : ""}">
                    <span class="ellipsis oname">${t.name}</span>
                    <span class="oicons">
                      ${t.items.map((t) => {
		let n = `${t.title} ${t.unavailable ? "nicht erreichbar" : t.open ? "offen" : "zu"}`;
		return w`<button class="oicon ${t.open ? "open" : ""} ${t.unavailable ? "na" : ""}" title=${n} aria-label=${n}
                          @click=${() => e.moreInfo(t.id)}>
                          ${M(t.kind === "door" ? O.door : O.window, 15, t.unavailable ? "rgba(255,255,255,0.45)" : t.open ? "#ffd1cf" : "#7ee8a0", 2.2)}
                        </button>`;
	})}
                    </span>
                  </div>`)}
              </div>`)}
          ` : D}
    </div>
  `;
}
var ac = o`
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
`, oc = {
	pause: "M7 4h3v16H7zM14 4h3v16h-3z",
	dock: "M3 10.5 12 3l9 7.5V21H3z",
	locate: "M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12zM12 7a2 2 0 1 0 0 4a2 2 0 1 0 0-4"
};
function sc(e, t, n, r) {
	let i = e === 0 ? "17px 6px 6px 17px" : e === n - 1 ? "6px 17px 17px 6px" : "6px";
	return e <= t ? `border-radius:${i};background:${r};opacity:${.55 + .45 * (e + 1) / n};color:#08121c` : `border-radius:${i};background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)`;
}
function cc(e) {
	let { hass: t, config: n } = e, r = P(n, "vacuum"), i = Jt(t, n), a = Xt(t, n), o = Qt(t, n), s = I(t, P(n, "vacuum_map")) ?? o[0]?.name, c = o.find((e) => e.name === s) ?? o[0], l = $t(t, n), u = c ? c.rooms.filter((e) => l.includes(e.segment)).length : 0, d = P(n, "vacuum_mode"), f = I(t, d) ?? "vacuum", p = String(t.states[r]?.attributes.fan_speed ?? ""), m = an.findIndex((e) => e.id === p), h = P(n, "vacuum_mop"), g = on.findIndex((e) => e.id === I(t, h)), _ = P(n, "vacuum_passes"), v = Math.round(F(t, _) ?? 1), y = (t, n = {}) => e.call("vacuum", t, n, { entity_id: r }), b = (t, n) => e.call("select", "select_option", { option: n }, { entity_id: t }), ee = i.error ? "#ff453a" : i.cleaning ? "#64d2ff" : "#30d158";
	return N({
		title: "Robby",
		subtitle: i.label,
		color: "radial-gradient(circle at 40% 35%, #4a505c, #23262e)",
		glow: i.error ? "rgba(255,69,58,0.18)" : "rgba(48,209,88,0.1)",
		iconPath: O.vacuum,
		iconStroke: ee,
		onClose: e.closeSheet,
		headerExtra: w`
      ${i.cleaning ? w`<button class="rb-ctl" aria-label="Pause" title="Pause" @click=${() => y("pause")}>${M(oc.pause, 16, "#fff", 2.2)}</button>` : w`<button class="rb-ctl" aria-label="Start" title="Start" @click=${() => y("start")}>${M(A.play, 16, "#fff", 2.2)}</button>`}
      <button class="rb-ctl" aria-label="Zur Station" title="Zur Station" @click=${() => y("return_to_base")}>${M(oc.dock, 16, "#fff", 2.2)}</button>
      <button class="rb-ctl" aria-label="Orten" title="Orten" @click=${() => y("locate")}>${M(oc.locate, 16, "#fff", 2.2)}</button>
    `,
		body: w`
      ${a.length ? w`<div class="rb-stats" style="grid-template-columns: repeat(${a.length}, minmax(0, 1fr))">
            ${a.map((t) => w`<button class="rb-stat ${t.due ? "due" : ""}" aria-label="${t.name}: ${t.value}${t.reset ? ", tippen zum Zurücksetzen" : ""}"
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
          </div>` : D}

      <div class="section-head"><h2>Programme</h2><span class="rule" aria-hidden="true"></span><span class="meta">Tippen startet</span></div>
      <div class="rb-progs">
        ${tn(n).map((t) => w`
          <button class="rb-prog" @click=${() => t.button ? e.call("button", "press", {}, { entity_id: t.button }) : y("start")}>
            <span class="rb-tag" style="background:${t.color ?? "#7ee8a0"}">${t.tag}</span>
            <span class="rb-pn">${t.name}</span>
          </button>`)}
      </div>

      ${c ? w`
            <div class="section-head"><h2>Selbst auswählen</h2><span class="rule" aria-hidden="true"></span></div>
            <section class="rb-custom" aria-label="Individuelle Reinigung">
              <div class="rb-tabs" role="tablist" aria-label="Karte" style="grid-template-columns: repeat(${o.length}, minmax(0, 1fr))">
                ${o.map((t) => w`<button role="tab" aria-selected=${t.name === c.name} class=${t.name === c.name ? "sel" : ""}
                  @click=${() => t.name !== c.name && e.runScript(P(n, "vacuum_map_script"), { karte: t.name })}>${t.name}</button>`)}
              </div>
              ${c.rooms.length ? w`<div class="rb-rooms">
                    ${c.rooms.map((t) => {
			let r = l.includes(t.segment);
			return w`<button class="rb-room ${r ? "sel" : ""}" aria-pressed=${r}
                        @click=${() => e.runScript(P(n, "vacuum_room_script"), { segment: t.segment })}>${t.name}</button>`;
		})}
                  </div>` : D}

              <div class="rb-modes" role="radiogroup" aria-label="Modus">
                ${rn.map((e) => {
			let t = f === e.id;
			return w`<button class="rb-mode ${t ? "sel" : ""}" role="radio" aria-checked=${t} @click=${() => b(d, e.id)}>
                    <span class="rb-mi">
                      ${e.id === "mop" ? D : M(A.fan, 18, "currentColor", 2.1)}
                      ${e.id === "vacuum" ? D : M(A.drop, 18, "currentColor", 2.1)}
                    </span>
                    <span class="rb-mn">${e.name}</span>
                  </button>`;
		})}
              </div>

              ${f === "mop" ? D : w`<div class="rb-slider">
                    <div class="rb-sh">${M(A.fan, 15, "#7ee8a0", 2.2)}<span>Saugkraft</span><span class="grow"></span>
                      <strong style="color:#9af0b5">${an[m]?.name ?? p}</strong></div>
                    <div class="rb-segs" role="radiogroup" aria-label="Saugkraft" style="grid-template-columns: repeat(${an.length}, minmax(0, 1fr))">
                      ${an.map((e, t) => w`<button role="radio" aria-checked=${t === m} aria-label=${e.name} title=${e.name}
                        style=${sc(t, m, an.length, "#30d158")} @click=${() => y("set_fan_speed", { fan_speed: e.id })}></button>`)}
                    </div>
                  </div>`}

              ${f === "vacuum" ? D : w`<div class="rb-slider">
                    <div class="rb-sh">${M(A.drop, 15, "#8fd8ff", 2.2)}<span>Wasser</span><span class="grow"></span>
                      <strong style="color:#bfe8ff">${on[g]?.name ?? "–"}</strong></div>
                    <div class="rb-segs" role="radiogroup" aria-label="Wischintensität" style="grid-template-columns: repeat(${on.length}, minmax(0, 1fr))">
                      ${on.map((e, t) => w`<button role="radio" aria-checked=${t === g} aria-label=${e.name} title=${e.name}
                        style=${sc(t, g, on.length, "#5ac8fa")} @click=${() => b(h, e.id)}>
                        ${Array.from({ length: t + 1 }, () => w`<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${A.drop}></path></svg>`)}
                      </button>`)}
                    </div>
                  </div>`}

              <div class="rb-start">
                <div class="rb-passes" role="radiogroup" aria-label="Durchgänge">
                  ${[1, 2].map((t) => w`<button role="radio" aria-checked=${v === t} class=${v === t ? "sel" : ""}
                    @click=${() => e.call("input_number", "set_value", { value: t }, { entity_id: _ })}>${t}×</button>`)}
                </div>
                <button class="rb-go" ?disabled=${u === 0} @click=${() => e.runScript(P(n, "vacuum_clean_script"))}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${A.play}></path></svg>${nn(u)}
                </button>
              </div>
            </section>` : D}
    `
	});
}
var lc = o`
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
`, uc = 36e5, dc = 24 * uc;
function fc(e, t) {
	let n = -1, r = Infinity;
	return e.forEach((e, i) => {
		let a = Math.abs(e - t);
		a < r && (r = a, n = i);
	}), n;
}
var pc = (e) => String(e.getHours()).padStart(2, "0"), mc = (e) => e.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
function hc(e, t) {
	let n = new Date(e);
	if ((t.step ?? 0) >= 828e5) return `${mc(n)} ${n.getDate()}.${n.getMonth() + 1}.`;
	let r = t.span > 1.5 * dc ? `${mc(n)} ` : "";
	return t.bars && t.step ? `${r}${pc(n)}–${pc(new Date(e + t.step))} Uhr` : `${r}${pc(n)}:${String(n.getMinutes()).padStart(2, "0")}`;
}
function gc(e) {
	let t = e.end - e.start, n = e.step ?? 0, r = Math.max(n, uc), i = e.compare ?? [], a = (e) => {
		let t = fc(i.map((e) => e.t), e);
		return t >= 0 && Math.abs(i[t].t - e) <= r ? i[t] : null;
	}, o = (r, i) => {
		let o = {
			x: e.bars && n ? (e.x(r.t) + e.x(r.t + n)) / 2 : e.x(r.t),
			y: e.y(r.v),
			time: hc(r.t, {
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
var _c = 1800, X = /* @__PURE__ */ new WeakMap();
function vc(e) {
	return e.querySelector(":scope > .sc-layer");
}
function yc(e) {
	let t = X.get(e);
	t && (t.index = -1), vc(e)?.classList.remove("on");
}
function bc(e, t) {
	let n = X.get(e), r = vc(e);
	if (!n || !r || !n.cfg.points.length) return;
	let i = e.getBoundingClientRect();
	if (!i.width) return;
	let a = (t - i.left) / i.width * n.cfg.width, o = fc(n.cfg.points.map((e) => e.x), a);
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
function xc(e) {
	let t = () => {
		let t = X.get(e);
		t && (window.clearTimeout(t.timer), t.timer = window.setTimeout(() => yc(e), _c));
	};
	e.addEventListener("pointerdown", (t) => {
		let n = X.get(e);
		n && (window.clearTimeout(n.timer), n.pressed = !0, bc(e, t.clientX));
	}), e.addEventListener("pointermove", (t) => {
		let n = X.get(e);
		n && (n.pressed || t.pointerType === "mouse") && bc(e, t.clientX);
	});
	let n = () => {
		let n = X.get(e);
		n && (n.pressed = !1, t());
	};
	e.addEventListener("pointerup", n), e.addEventListener("pointercancel", n), e.addEventListener("pointerleave", (t) => {
		t.pointerType === "mouse" ? yc(e) : n();
	});
}
var Sc = Ge(class extends Ke {
	constructor(e) {
		if (super(e), e.type !== We.ELEMENT) throw Error("scrub() must be used on an element");
	}
	render(e) {
		return E;
	}
	update(e, [t]) {
		let n = e.element, r = X.get(n);
		return r ? (r.cfg = t, r.index >= t.points.length && yc(n)) : (X.set(n, {
			cfg: t,
			index: -1,
			pressed: !1
		}), xc(n)), E;
	}
}), Cc = o`
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
`, wc = 338, Tc = 300, Ec = 18, Dc = 130, Oc = "#5ac8fa";
function kc(e) {
	let t = e.data, n = t.past ?? [], r = t.future ?? [], i = t.step ?? 0, a = t.compare ?? [], o = gr(n, t.start, t.end, Tc, Ec, Dc, {
		snap: e.snap,
		zero: e.zero,
		max: e.max,
		padLo: e.snap / 2,
		padHi: e.snap / 2,
		extra: [...r, ...a].map((e) => e.v)
	}), s = a.length ? gr(a, t.start, t.end, Tc, Ec, Dc, {
		snap: e.snap,
		zero: e.zero,
		max: e.max,
		padLo: e.snap / 2,
		padHi: e.snap / 2,
		extra: [...n, ...r].map((e) => e.v)
	}) : null, c = r.length ? gr(r, t.start, t.end, Tc, Ec, Dc, {
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
	], d = r.length ? o.x(r[0].t) : null, f = `${e.title}: ${e.caption ?? ""}`, p = (e.rain ?? []).filter((e) => e.v > 0), m = Math.max(2, ...p.map((e) => e.v)), h = (e) => Dc - e / m * 50.400000000000006, g = new Map((e.rain ?? []).map((e) => [e.t, e.v])), _ = gc({
		past: n,
		future: r,
		compare: a,
		step: i,
		bars: !!(e.bars && i),
		start: t.start,
		end: t.end,
		x: o.x,
		y: o.y,
		value: (t) => `${L(t, e.digits)}${l}`,
		compareName: e.compareName,
		extra: e.rain ? (e) => {
			let t = g.get(e);
			return t ? `Regen ${L(t, 1)} mm` : void 0;
		} : void 0
	}), v = (e, t, n, r) => {
		let a = o.x(e.t), s = Math.max(1, o.x(e.t + (i || 36e5)) - a - 2), c = r(e.v);
		return T`<rect x=${a + 1} y=${c} width=${s} height=${Math.max(0, Dc - c)} rx=${Math.min(3, s / 2)} fill=${t} opacity=${n}></rect>`;
	};
	return w`
    <figure class="tr-fig" style="background:${e.color}14">
      <figcaption>
        <span class="tr-title" style="color:${e.color}">${e.title}</span>
        ${e.caption ? w`<span class="tr-cap">${e.caption}</span>` : D}
      </figcaption>
      ${t.error && !n.length ? w`<div class="tr-msg">Keine Daten: ${t.error}</div>` : t.loading && !n.length ? w`<div class="tr-msg">Lade Verlauf …</div>` : w`
            <div class="sc-wrap" ${Sc({
		points: _,
		width: wc,
		height: 150,
		color: e.color
	})}>
            <svg width="100%" viewBox="0 0 ${wc} 150" role="img" aria-label=${f}>
              ${u.map((e) => T`
                <line x1="0" y1=${o.y(e)} x2=${wc} y2=${o.y(e)} stroke="rgba(255,255,255,0.08)"></line>
                <text x=${334} y=${o.y(e) - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${L(e, e % 1 ? 1 : 0)}${l}</text>`)}
              ${(t.bands ?? []).map((t) => T`<rect x=${o.x(t.from)} y=${12} width=${Math.max(1, o.x(t.to) - o.x(t.from))}
                height=${118} fill=${e.bandColors?.[t.level] ?? "rgba(255,255,255,0.08)"}></rect>`)}
              ${s?.line ? T`<polyline points=${s.line} fill="none" stroke=${e.compareColor ?? "rgba(255,255,255,0.6)"} stroke-width="1.6" stroke-linejoin="round" opacity="0.9"></polyline>` : D}
              ${e.bars && i ? T`${n.map((t) => v(t, e.color, .85, o.y))}
                  ${r.map((t) => v(t, e.color, .4, o.y))}
                  ${d === null ? D : T`<line x1=${d} y1=${12} x2=${d} y2=${Dc} stroke="rgba(255,255,255,0.35)" stroke-dasharray="2 3"></line>
                        <text x=${d + 4} y=${16} fill="rgba(255,255,255,0.7)" font-size="10">Vorhersage</text>`}` : T`
                  ${o.area ? T`<polygon points=${o.area} fill=${e.color} opacity="0.16"></polygon>` : D}
                  ${p.map((e) => v(e, Oc, .7, h))}
                  ${o.line ? T`<polyline points=${o.line} fill="none" stroke=${e.color} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>` : D}
                  ${c?.line ? T`<polyline points=${c.line} fill="none" stroke=${e.color} stroke-width="2" stroke-dasharray="5 5" opacity="0.7"></polyline>` : D}
                  ${d === null ? D : T`<line x1=${d} y1=${12} x2=${d} y2=${Dc} stroke="rgba(255,255,255,0.35)" stroke-dasharray="2 3"></line>
                        <text x=${d + 4} y=${16} fill="rgba(255,255,255,0.7)" font-size="10">Vorhersage</text>`}
                  ${o.last && e.dot !== !1 ? T`<circle cx=${o.last.x} cy=${o.last.y} r="4.5" fill=${e.color} stroke="#181a22" stroke-width="2"></circle>` : D}`}
            </svg>
            <div class="sc-layer"></div>
            </div>
            <div class="tr-x">${e.labels.map((e) => w`<span>${e}</span>`)}</div>`}
    </figure>
  `;
}
var Ac = o`
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
`, Z = "#8fd0ff", jc = {
	precipitation: A.drop,
	humidity: A.drop,
	wind: O.wind,
	pressure: "M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16M12 12l4-3",
	uv: O.sun,
	visibility: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6"
}, Mc = {
	rain: A.drop,
	sun: O.sun,
	wind: O.wind,
	humidity: A.drop,
	uv: O.sun
}, Nc = "M6 9l6 6 6-6", Pc = [
	"rainy",
	"pouring",
	"snowy",
	"snowy-rainy",
	"hail",
	"lightning-rainy"
];
function Fc(e) {
	let { hass: t, config: n } = e, r = P(n, "weather"), i = e.forecast(), a = wt(t, n, i.daily, e.now, i.hourly), o = Tt(i.hourly, e.now), s = Dt(i.daily), c = Lt(t, n, e.now), l = kt(t, n), u = !l || l.level === 0 ? "#7ee8a0" : l.level < 2 ? "#ffd60a" : "#ff9f0a";
	return N({
		title: String(t.states[r]?.attributes.friendly_name ?? "Wetter"),
		subtitle: a.source || void 0,
		color: Z,
		glow: "rgba(90,140,220,0.35)",
		iconPath: k(a.condition),
		iconTemplate: Za(a.condition, 20, "#0a1a2a"),
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		body: w`
      <div class="w-now">
        <span class="w-temp">${a.temp}</span>
        <span><span class="w-cond">${a.label}</span>${a.today ? w`<span class="w-today">${a.today}</span>` : D}</span>
      </div>
      ${a.chips.length ? w`<div class="w-chips">
            ${a.chips.map((t) => t.key in Rt || t.key === "precipitation" ? w`<button class="w-chip" aria-label="${t.label}, Verlauf anzeigen"
                  @click=${() => e.openSheet(t.key === "precipitation" ? { id: "weatherRain" } : {
			id: "weatherMetric",
			metric: t.key
		})}>${M(jc[t.key], 14, Z, 2.2)}${t.label}</button>` : w`<span class="w-chip">${M(jc[t.key], 14, Z, 2.2)}${t.label}</span>`)}
          </div>` : D}

      ${c.map((t, n) => {
			let r = e.ui[`warn${n}`] === !0;
			return w`
          <button class="w-alert" aria-expanded=${r} ?disabled=${!t.text}
            style="border-color:${t.color}66;background:linear-gradient(90deg, ${t.color}38, ${t.color}0d)"
            @click=${() => e.setUi({ [`warn${n}`]: !r })}>
            <span class="w-ah">
              <span class="circle" style="width:32px;height:32px;background:${t.color}">${M(O.storm, 15, "#1d1030", 2.2)}</span>
              <span class="grow"><span class="w-wt">${t.current ? t.level >= 3 ? "Unwetterwarnung" : "Warnung" : "Vorabwarnung"}: ${t.title}</span>
                <span class="w-ws">${t.when} · Stufe ${t.level} von 4</span></span>
              ${t.text ? w`<span class="w-chev ${r ? "open" : ""}">${M(Nc, 16, "rgba(255,255,255,0.7)", 2.4)}</span>` : D}
            </span>
            ${r ? w`<span class="w-at">${t.text}</span>` : D}
          </button>`;
		})}

      ${i.loading && !i.hourly.length ? w`<div class="w-msg">Vorhersage wird geladen …</div>` : i.error && !i.hourly.length ? w`<div class="w-msg">Vorhersage nicht verfügbar.</div>` : D}

      ${o.length ? w`<div class="w-hours" style="grid-template-columns: repeat(${o.length}, minmax(0, 1fr))">
            ${o.map((e) => w`<div class="w-hour">
              <span class="w-ht">${e.t}</span>
              ${M(k(e.condition), 20, Pc.includes(e.condition) ? Z : "rgba(255,255,255,0.85)", 2)}
              <span class="w-hv">${e.temp ?? "–"}°</span>
              <span class="w-hr">${e.rain}</span>
            </div>`)}
          </div>` : D}

      ${s.length ? w`<div class="w-days">
            ${s.map((t) => w`<button class="w-day" aria-label="${t.day}, Details anzeigen"
              @click=${() => e.openSheet({
			id: "weatherDay",
			date: t.date
		})}>
              <span class="w-dn">${t.day}</span>
              ${M(k(t.condition), 20, Pc.includes(t.condition) ? Z : "rgba(255,255,255,0.8)", 2)}
              <span class="w-dr">${t.rain}</span>
              <span class="w-track">
                <span class="w-bar" style="left:${t.left}%;width:${t.width}%"></span>
                <span class="w-lo" style="left:${t.left}%">${t.min}°</span>
              </span>
              <span class="w-dmax">${t.max}°</span>
            </button>`)}
          </div>` : D}

      ${l ? w`<div class="w-pollen" style="background:${u}1f">
            ${M(A.leaf, 16, u, 2.2)}
            <span><strong>${l.title}</strong> · ${l.text}</span>
          </div>` : D}
    `
	});
}
var Ic = 36e5;
function Lc(e, t) {
	let n = e.forecast(), r = n.daily.find((e) => e.datetime === t), i = () => e.openSheet({ id: "weather" });
	if (!r) return N({
		title: "Vorhersage",
		color: Z,
		glow: "rgba(90,140,220,0.35)",
		iconPath: O.sun,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: i,
		body: w`<div class="w-msg">${n.loading ? "Vorhersage wird geladen …" : "Für diesen Tag gibt es keine Vorhersage mehr."}</div>`
	});
	let a = Ot(r, n.hourly), o = (e) => `${String(e).padStart(2, "0")} Uhr`;
	return N({
		title: a.title,
		subtitle: a.label || void 0,
		color: Z,
		glow: "rgba(90,140,220,0.35)",
		iconPath: k(a.condition),
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: i,
		body: w`
      <div class="w-now">
        <span class="w-temp">${a.max ?? "–"}°</span>
        <span><span class="w-cond">${a.label}</span>${a.min === null ? D : w`<span class="w-today">Tiefstwert ${a.min}°</span>`}</span>
      </div>
      ${a.facts.length ? w`<div class="w-chips">${a.facts.map((e) => w`<span class="w-chip">${M(Mc[e.key], 14, Z, 2.2)}${e.label}</span>`)}</div>` : D}
      ${a.hours.length ? w`<div class="w-hours" style="grid-template-columns: repeat(${a.hours.length}, minmax(0, 1fr))">
            ${a.hours.map((e) => w`<div class="w-hour">
              <span class="w-ht">${e.t}</span>
              ${M(k(e.condition), 20, Pc.includes(e.condition) ? Z : "rgba(255,255,255,0.85)", 2)}
              <span class="w-hv">${e.temp ?? "–"}°</span>
              <span class="w-hr">${e.rain}</span>
            </div>`)}
          </div>` : w`<div class="w-msg">Stündliche Werte gibt es erst näher am Tag.</div>`}
      ${a.temps.length > 1 ? kc({
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
			caption: `${L(Math.min(...a.temps.map((e) => e.v)), 1)} – ${L(Math.max(...a.temps.map((e) => e.v)), 1)} °C${Rc(a.rain)}`,
			labels: [
				o(0),
				o(5),
				o(10),
				o(14),
				o(19)
			]
		}) : D}
    `
	});
}
var Rc = (e) => {
	let t = e.reduce((e, t) => e + t.v, 0);
	return t > 0 ? ` · Regen ${L(t, 1)} mm` : "";
};
function zc(e) {
	let t = P(e.config, "precipitation"), n = e.hass.states[t] ? t : void 0, r = e.forecast(), i = e.series(`weather:rain:${r.hourly.length ? r.at : 0}`, () => va(e.hass, n, r.hourly), 6e5), a = Ct(e.hass, e.config, r.hourly, e.now), o = (e) => L((e ?? []).reduce((e, t) => e + t.v, 0), 1), s = i.start ? `${a === null ? "" : `jetzt ${L(a, 1)} mm/h · `}${n ? `24 h ${o(i.past)} mm · ` : ""}nächste 24 h ${o(i.future)} mm` : void 0, c = (e) => `${String(new Date(i.start + e * Ic).getHours()).padStart(2, "0")} Uhr`;
	return N({
		title: "Niederschlag",
		subtitle: n ? "24 h zurück · 24 h Vorhersage" : "24 h Vorhersage",
		color: Z,
		glow: "rgba(90,140,220,0.35)",
		iconPath: A.drop,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: () => e.openSheet({ id: "weather" }),
		body: w`${kc({
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
function Bc(e, t) {
	let n = Rt[t], r = P(e.config, "weather"), i = e.forecast(), a = e.series(`weather:${t}:${i.hourly.length ? i.at : 0}`, () => ya(e.hass, r, t, i.hourly), 6e5), o = [...a.past, ...a.future ?? []].map((e) => e.v), s = Number(e.hass.states[r]?.attributes[n.attr]), c = n.unit ? ` ${n.unit}` : "", l = o.length ? `${Number.isFinite(s) ? `jetzt ${L(s, n.digits)}${c} · ` : ""}${L(Math.min(...o), n.digits)} – ${L(Math.max(...o), n.digits)}${c}` : void 0, u = (e) => {
		let t = new Date(a.start + e * Ic);
		return `${String(t.getHours()).padStart(2, "0")} Uhr`;
	};
	return N({
		title: n.name,
		subtitle: "24 h zurück · 24 h Vorhersage",
		color: n.color,
		glow: `${n.color}33`,
		iconPath: jc[t],
		onClose: e.closeSheet,
		onBack: () => e.openSheet({ id: "weather" }),
		body: w`${kc({
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
var Vc = o`
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
`, Hc = [
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
], Uc = "#8fd8ff", Wc = "rgba(255,255,255,0.65)", Gc = {
	now: "rgba(48,209,88,0.28)",
	possible: "rgba(48,209,88,0.12)"
};
function Kc(e, t, n) {
	return t ? Array.from({ length: 5 }, (r, i) => {
		let a = new Date(t + (n - t) * i / 5);
		return e === "24h" ? `${String(a.getHours()).padStart(2, "0")} Uhr` : `${a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")} ${String(a.getHours()).padStart(2, "0")}h`;
	}) : [];
}
function qc(e, t, n) {
	let r = e.rooms.find((e) => e.slug === t);
	if (!r) return D;
	let i = `sensor.${t}_taupunkt`, a = P(e.config, "outdoor_dew"), o = e.series(`dew:${t}:${n}`, () => ma(e.hass, {
		room: i,
		outdoor: a,
		airing: r.airing
	}, n), 3e5), s = F(e.hass, i), c = F(e.hass, a), l = [s === null ? "" : `innen ${L(s, 1)}°`, c === null ? "" : `außen ${L(c, 1)}°`].filter(Boolean).join(" · ");
	return N({
		title: "Taupunkt",
		subtitle: r.name,
		color: Uc,
		glow: `${Uc}33`,
		iconPath: A.drop,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: () => e.openSheet({
			id: "room",
			slug: t
		}),
		body: w`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${Hc.map((r) => w`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "dew",
			slug: t,
			range: r.id
		})}>${r.name}</button>`)}
      </div>
      ${kc({
			title: "Taupunkt",
			color: Uc,
			unit: "°C",
			digits: 1,
			snap: 2,
			data: o,
			caption: l || void 0,
			compareColor: Wc,
			compareName: "außen",
			bandColors: Gc,
			labels: Kc(n, o.start, o.end)
		})}
      <div class="dw-legend">
        <span><i style="background:${Uc}"></i>innen</span>
        <span><i style="background:${Wc}"></i>außen</span>
        <span><i class="dw-box" style="background:${Gc.now}"></i>Jetzt lüften</span>
        <span><i class="dw-box" style="background:${Gc.possible}"></i>Lüften möglich</span>
      </div>
      <p class="dw-hint">${M(A.drop, 13, "rgba(255,255,255,0.6)", 2.2)}Lüften trocknet, wenn der Taupunkt draußen unter dem im Raum liegt.</p>
    `
	});
}
var Jc = o`
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
`, Yc = "#ff9f0a", Xc = "#ffd60a";
function Zc(e, t, n, r, i) {
	return w`
    <div class="cr-row">
      <button class="cr-main" @click=${() => e.moreInfo(t.id)}>
        <span class="circle" style="width:40px;height:40px;background:${r}">${M(n, 18, "#141008", 2.2)}</span>
        <span class="cr-text"><span class="cr-name ellipsis">${t.name}</span><span class="cr-detail">${t.detail}</span></span>
      </button>
      ${t.reset ? w`<button class="cr-act" style="background:${r}" @click=${() => e.confirm({
		title: t.name,
		text: i.text,
		confirm: i.button,
		color: r,
		iconPath: n,
		onConfirm: () => e.call("button", "press", {}, { entity_id: t.reset })
	})}>${i.button}</button>` : i.hint ? w`<span class="cr-hint">${i.hint}</span>` : D}
    </div>`;
}
function Qc(e) {
	let t = Gt(e.hass), n = Kt(e.hass, e.config), r = t.length + n.length;
	return N({
		title: "Wartung",
		subtitle: r ? `${r} ${r === 1 ? "Gerät braucht" : "Geräte brauchen"} Aufmerksamkeit` : "Alles in Ordnung",
		color: Yc,
		glow: "rgba(255,159,10,0.22)",
		iconPath: O.battery,
		onClose: e.closeSheet,
		body: w`
      ${t.length ? w`<div class="section-head"><h2>Batterien</h2><span class="rule" aria-hidden="true"></span></div>
            ${t.map((t) => Zc(e, t, O.battery, Yc, {
			text: "Batterie getauscht? Das Datum wird in Battery Notes gespeichert.",
			button: "Getauscht"
		}))}` : D}
      ${n.length ? w`<div class="section-head"><h2>Filter</h2><span class="rule" aria-hidden="true"></span></div>
            ${n.map((t) => Zc(e, t, O.filter, Xc, {
			text: "Filter gereinigt oder getauscht? Der Zähler wird zurückgesetzt.",
			button: "Erledigt",
			hint: "am Gerät zurücksetzen"
		}))}` : D}
      ${r ? D : w`<p class="cr-empty">Keine schwachen Batterien und keine fälligen Filter.</p>`}
    `
	});
}
var $c = o`
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
`, el = {
	cool: "Kühlen",
	dry: "Trocknen",
	fan_only: "Lüften",
	heat: "Heizen",
	auto: "Auto",
	heat_cool: "Auto",
	off: "Aus"
}, tl = [
	"cool",
	"dry",
	"fan_only",
	"heat",
	"auto",
	"heat_cool",
	"off"
], nl = {
	cool: "Kühlt",
	dry: "Trocknet",
	fan_only: "Lüftet",
	heat: "Heizt",
	auto: "Auto",
	heat_cool: "Auto",
	off: "Aus"
}, rl = {
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
}, il = {
	none: "Normal",
	away: "Abwesend",
	sleep: "Schlafen",
	boost: "Boost",
	eco: "Eco",
	comfort: "Komfort"
}, al = /flust|fluest|silent|quiet|leise/;
function ol(e, t) {
	let n = P(t, "ac"), r = e.states[n];
	if (!r) return null;
	let i = r.attributes, a = Ut(e, n), o = gt(e, n) ?? "", s = (t) => {
		let n = String(e.states[t]?.attributes.friendly_name ?? t);
		return n.startsWith(o) && o ? n.slice(o.length).trim() : n;
	}, c = F(e, a.find((t) => t.startsWith("sensor.") && /aussen|outdoor/.test(t) && e.states[t]?.attributes.device_class === "temperature")), l = F(e, P(t, "ac_power")), u = Number(i.current_temperature), d = Number.isFinite(Number(i.temperature)) && i.temperature !== null ? Number(i.temperature) : null, f = r.state === "off" || d === null || ["dry", "fan_only"].includes(r.state) ? nl[r.state] ?? r.state : `${nl[r.state] ?? r.state} auf ${((e) => `${L(e, e % 1 ? 1 : 0)}°`)(d)}`, p = [
		r.state === "unavailable" ? "Offline" : f,
		Number.isFinite(u) ? `innen ${L(u, 1)}°` : "",
		c === null ? "" : `außen ${L(c, 1)}°`,
		l !== null && l >= 1 ? `${L(Math.round(l))} W` : ""
	].filter(Boolean).join(" · "), m = i.hvac_modes ?? [], h = i.fan_modes ?? [], g = i.swing_modes ?? [], _ = a.filter((t) => t.startsWith("switch.") && !e.entities[t]?.hidden).map((t) => ({
		id: t,
		name: s(t),
		on: e.states[t]?.state === "on"
	})).sort((e, t) => Number(al.test(t.id)) - Number(al.test(e.id)));
	return {
		id: n,
		state: r.state,
		status: p,
		target: d,
		min: Number(i.min_temp) || 16,
		max: Number(i.max_temp) || 30,
		step: Number(i.target_temp_step) || 1,
		modes: tl.filter((e) => m.includes(e)).map((e) => ({
			id: e,
			name: el[e]
		})),
		fans: [...h.filter((e) => e === "auto"), ...h.filter((e) => e !== "auto")].map((e) => ({
			id: e,
			name: rl[e] ?? e
		})),
		fan: String(i.fan_mode ?? ""),
		presets: (i.preset_modes ?? []).map((e) => ({
			id: e,
			name: il[e] ?? e
		})),
		preset: String(i.preset_mode ?? ""),
		swing: g.length > 1 && g.includes("off") ? {
			on: !!i.swing_mode && i.swing_mode !== "off",
			onMode: g.find((e) => e !== "off")
		} : null,
		switches: _,
		selfClean: Wt(e, n, /reinigung|clean/)
	};
}
// src/sheets/ac.ts
var sl = "#8fd8ff", cl = {
	cool: A.snowflake,
	dry: A.drop,
	fan_only: A.fan,
	heat: A.flame,
	auto: "M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M9 15l3-7 3 7M10 13h4",
	heat_cool: "M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0",
	off: A.power
};
function ll(e) {
	let t = ol(e.hass, e.config);
	if (!t) return D;
	let n = t.state !== "off" && t.state !== "unavailable", r = e.target(t.id) ?? t.target, i = (n, r) => e.call("climate", n, r, { entity_id: t.id }), a = (t, n) => e.call("switch", n ? "turn_off" : "turn_on", {}, { entity_id: t });
	return N({
		title: "Klimaanlage",
		subtitle: t.status,
		color: n ? sl : "rgba(255,255,255,0.16)",
		glow: n ? "rgba(100,210,255,0.22)" : "rgba(255,255,255,0.06)",
		iconPath: A.snowflake,
		iconStroke: n ? "#08202c" : "#fff",
		onClose: e.closeSheet,
		body: w`
      <div class="tcard" style="background: linear-gradient(140deg, ${n ? "rgba(100,210,255,0.24)" : "rgba(255,255,255,0.1)"}, rgba(255,255,255,0.05) 70%)">
        <div class="tcontrol">
          <button class="bigstep" aria-label="Soll senken" ?disabled=${r === null} @click=${() => e.stepTarget(t.id, -t.step)}>−</button>
          <div class="tcenter">
            <div class="tstate">${n ? "Soll" : "Aus · Soll"}</div>
            <div class="tbig">${r === null ? "–" : `${U(r, t.step % 1 ? 1 : 0)}°`}</div>
            <div class="tsoll">${t.min}° – ${t.max}°</div>
          </div>
          <button class="bigstep" aria-label="Soll erhöhen" ?disabled=${r === null} @click=${() => e.stepTarget(t.id, t.step)}>+</button>
        </div>
      </div>

      <div class="acs-modes" role="group" aria-label="Betriebsart">
        ${t.modes.map((e) => {
			let n = t.state === e.id;
			return w`<button class="acs-mode ${n ? "active" : ""}" aria-pressed=${n} @click=${() => i("set_hvac_mode", { hvac_mode: e.id })}>
            ${M(cl[e.id] ?? A.power, 18, n ? "#08202c" : "#fff", 2.1)}<span>${e.name}</span>
          </button>`;
		})}
      </div>

      ${t.fans.length ? w`<div class="section-head"><h2>Lüfter</h2><span class="rule" aria-hidden="true"></span></div>
            <div class="acs-seg" role="group" aria-label="Lüfterstufe" style="grid-template-columns: repeat(${t.fans.length}, minmax(0, 1fr))">
              ${t.fans.map((e) => w`<button class=${t.fan === e.id ? "sel" : ""} aria-pressed=${t.fan === e.id}
                @click=${() => i("set_fan_mode", { fan_mode: e.id })}>${e.name}</button>`)}
            </div>` : D}

      ${t.presets.length ? w`<div class="acs-seg" role="group" aria-label="Modus" style="grid-template-columns: repeat(${t.presets.length}, minmax(0, 1fr))">
            ${t.presets.map((e) => w`<button class=${t.preset === e.id ? "sel" : ""} aria-pressed=${t.preset === e.id}
              @click=${() => i("set_preset_mode", { preset_mode: e.id })}>${e.name}</button>`)}
          </div>` : D}

      <div class="acs-toggles">
        ${t.swing ? w`<button class="acs-tog ${t.swing.on ? "on" : ""}" aria-pressed=${t.swing.on}
              @click=${() => i("set_swing_mode", { swing_mode: t.swing.on ? "off" : t.swing.onMode })}>
              <span class="acs-dot"></span><span class="ellipsis">Lamellen schwenken</span></button>` : D}
        ${t.switches.map((e) => w`<button class="acs-tog ${e.on ? "on" : ""}" aria-pressed=${e.on} @click=${() => a(e.id, e.on)}>
          <span class="acs-dot"></span><span class="ellipsis">${e.name}</span></button>`)}
      </div>

      <div class="confirm-row">
        ${t.selfClean ? w`<button class="btn" @click=${() => e.confirm({
			title: "Selbstreinigung",
			text: "Selbstreinigung jetzt starten? Das Gerät läuft dann eine Weile.",
			confirm: "Starten",
			color: sl,
			iconPath: A.snowflake,
			onConfirm: () => e.call("button", "press", {}, { entity_id: t.selfClean })
		})}>Selbstreinigung</button>` : D}
        <button class="btn" @click=${() => {
			e.closeSheet(), e.moreInfo(t.id);
		}}>Details</button>
      </div>
    `
	});
}
var ul = o`
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
`, dl = 36e5, fl = [
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
function pl(e) {
	return e === "W" ? [{
		id: "4h",
		name: "4 h"
	}, ...fl] : fl;
}
var ml = {
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
}, hl = {
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
function gl(e, t, n) {
	if (!t) return [];
	let r = [];
	for (let i = 0; i < 5; i++) {
		let a = new Date(t + (n - t) * i / 5);
		e === "4h" ? r.push(`${String(a.getHours()).padStart(2, "0")}:${String(a.getMinutes()).padStart(2, "0")}`) : e === "24h" ? r.push(`${String(a.getHours()).padStart(2, "0")} Uhr`) : e === "7d" ? r.push(a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")) : r.push(`${a.getDate()}.${a.getMonth() + 1}.`);
	}
	return r;
}
function _l(e, t, n, r, i) {
	if (t === "battery") return yl(e, n);
	let { prefs: a } = e.energy(), o = ml[t], s = hl[t], c = a ? {
		...Vi(a),
		...Hi(a)
	} : null, l = "kWh", u, d, f = null, p = !0;
	if (s) l = "share", u = s.name, d = s.color, c && (f = () => fa(e.hass, c, n, s.kind));
	else if (t === "cost") l = "€", u = "Stromkosten", d = "#ff9f0a", a && c && (f = () => _a(e.hass, Ui(a), c, n));
	else if (t === "house") u = "Hausverbrauch", d = "#ffffff", c && (f = () => pa(e.hass, c, n));
	else if (o) {
		u = o.name, d = o.color;
		let t = c ? c[o.ids] : [];
		t.length && (f = () => da(e.hass, t, n));
	} else u = r ?? e.config.names?.[t] ?? z(e.hass, t).replace(/\s*(device\s+)?(power|leistung)$/i, ""), d = "#ff9f0a", p = !1, l = "W", f = () => ha(e.hass, t, n);
	let m = l === "share" ? "%" : l, h = f ? e.series(`energy:${t}:${n}:${l}`, f) : {
		loading: p && !a,
		error: a ? "nicht im Energie-Dashboard" : void 0,
		past: [],
		start: 0,
		end: 0
	}, g = h.past.reduce((e, t) => e + t.v, 0), _ = h.past.length ? l === "share" ? h.total == null ? void 0 : `gesamt ${h.total} % ${s.total}` : l === "€" ? `Summe ${L(g, 2)} €${h.total ? ` · Vergütung ${L(h.total, 2)} €` : ""}` : l === "kWh" ? `Summe ${L(g, g < 10 ? 2 : 1)} kWh` : `Ø ${L(g / h.past.length)} W · ${L(aa(h.past, h.step ?? dl), 2)} kWh` : void 0, v = n === "4h" ? "5 Min" : n === "24h" ? "Stunde" : "Tag", y = {
		kWh: `kWh pro ${v}`,
		W: `mittlere Leistung pro ${v}`,
		share: `Anteil pro ${v}`,
		"€": `Netzbezug in € pro ${v}`
	}[l];
	return N({
		title: u,
		subtitle: y,
		color: d,
		glow: `${d}33`,
		iconPath: O.bolt,
		onClose: e.closeSheet,
		onBack: i ? () => e.openSheet(i) : void 0,
		body: w`
      <div class="tabs3" role="tablist" aria-label="Zeitraum" style=${`grid-template-columns:repeat(${pl(l).length},minmax(0,1fr))`}>
        ${pl(l).map((a) => w`<button role="tab" aria-selected=${a.id === n} class=${a.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "energyChart",
			key: t,
			range: a.id,
			name: r,
			back: i
		})}>${a.name}</button>`)}
      </div>
      ${kc({
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
			labels: gl(n, h.start, h.end)
		})}
    `
	});
}
var vl = (e, t, n) => w`
  <div class="tabs3" role="tablist" aria-label="Zeitraum">
    ${fl.map((r) => w`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
      @click=${() => e.openSheet({
	id: "energyChart",
	key: t,
	range: r.id
})}>${r.name}</button>`)}
  </div>`;
function yl(e, t) {
	let { prefs: n } = e.energy(), r = n ? Hi(n) : null, i = F(e.hass, P(e.config, "battery_soc")), a = (r, i) => r?.length ? e.series(`energy:battery-${i}:${t}`, () => da(e.hass, r, t)) : {
		loading: !n,
		error: n ? "kein Akku im Energie-Dashboard" : void 0,
		past: [],
		start: 0,
		end: 0
	}, o = a(r?.batteryIn, "in"), s = a(r?.batteryOut, "out"), c = (e) => e.past.reduce((e, t) => e + t.v, 0), l = (e, n, r) => kc({
		title: e,
		color: n,
		unit: "kWh",
		digits: 1,
		snap: .5,
		data: r,
		bars: !0,
		zero: !0,
		caption: r.past.length ? `Summe ${L(c(r), c(r) < 10 ? 2 : 1)} kWh` : void 0,
		labels: gl(t, r.start, r.end)
	});
	return N({
		title: "Akku",
		subtitle: `${i === null ? "" : `Ladestand ${L(i)} % · `}kWh pro ${t === "24h" ? "Stunde" : "Tag"}`,
		color: "#30d158",
		glow: "#30d15833",
		iconPath: O.bolt,
		onClose: e.closeSheet,
		body: w`
      ${vl(e, "battery", t)}
      ${l("Geladen", "#30d158", o)}
      ${l("Entladen", "#ffd60a", s)}
    `
	});
}
// src/sheets/airing.ts
function bl(e) {
	let { hass: t, now: n } = e, r = ur(t, e.rooms, e.config, n), i = () => e.runScript(P(e.config, "airing_start")), a = r.active || r.paused, o = a && r.duration ? Math.max(0, Math.min(100, r.remaining / r.duration * 100)) : 100, s = r.paused ? "pausiert" : r.active ? r.remaining > 0 ? "läuft" : "fertig" : "bereit", c = r.recommended.length === 1 ? r.recommended[0] : r.openWindows.length === 1 ? r.openWindows[0] : null;
	return N({
		title: c ? `Lüften · ${c.name}` : "Lüften",
		color: "#5ac8fa",
		glow: "rgba(90,200,250,0.24)",
		iconPath: O.wind,
		iconStroke: "#06202c",
		onClose: e.closeSheet,
		body: w`
      <div class="ringcard">
        <span class="ring" style="background: conic-gradient(#5ac8fa 0 ${o}%, rgba(255,255,255,0.1) ${o}% 100%)">
          <span class="ring-in">
            <span class="ring-time">${dr(r.remaining)}</span>
            <span class="ring-status">${s}</span>
          </span>
        </span>
        <div class="ring-info">
          <span><span class="muted">Fenster offen</span> <strong>${r.openWindows.length || "keins"}</strong></span>
          <span><span class="muted">Empfohlen</span> <strong>${r.recommended.length ? `${r.recommended.length} ${r.recommended.length === 1 ? "Raum" : "Räume"}` : "keiner"}</strong></span>
        </div>
      </div>

      ${r.openWindows.length ? w`
          <div class="section-head"><h2>Offene Fenster</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${r.openWindows.map((e) => w`<span class="chip open">${M(O.window, 14, "#ff8a80", 2.4)}${e.name}
              <span class="chip-meta">${B(_t(t, e.window, n))}</span></span>`)}
          </div>` : D}

      ${r.recommended.length ? w`
          <div class="section-head"><h2>Lüften empfohlen</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${r.recommended.map((e) => {
			let n = F(t, e.humidity);
			return w`<span class="chip rec">${M(A.drop, 14, "#8fd8ff", 2.4)}${e.name}${n === null ? D : w`<span class="chip-meta">${L(Math.round(n))} %</span>`}</span>`;
		})}
          </div>` : D}

      ${a ? w`<div class="confirm-row" style="margin-top:4px">
            <button class="btn" @click=${i}>Neu starten</button>
            <button class="btn primary" style="background:#5ac8fa;color:#06202c"
              @click=${() => e.call("timer", "cancel", {}, { entity_id: P(e.config, "airing_timer") })}>Stopp</button>
          </div>` : w`<button class="btn primary" style="background:#5ac8fa;color:#06202c;margin-top:4px"
            @click=${i}>Lüften starten</button>`}
    `
	});
}
var xl = o`
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
function Sl(e) {
	let t = P(e.config, "alarm"), n = e.hass.states[t]?.state ?? "unavailable";
	return N({
		title: Vs(n),
		color: n === "triggered" ? "#ff453a" : "#bf9bff",
		glow: "rgba(191,155,255,0.22)",
		iconPath: Pn(n),
		iconStroke: "#1d1030",
		onClose: e.closeSheet,
		body: w`
      <div class="alarm-grid">
        ${Bs.map((r) => {
			let i = r.state === n;
			return w`
            <button class="alarm-mode ${i ? "active" : ""}" aria-pressed=${i}
              @click=${() => {
				e.call("alarm_control_panel", r.service, {}, { entity_id: t }), e.closeSheet();
			}}>
              <span class="circle" style="width:44px;height:44px;background:${i ? "#1d1030" : "rgba(255,255,255,0.12)"}">
                ${M(O[r.icon], 20, i ? "#bf9bff" : "#e2d3ff", 2.1)}
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
var Cl = o`
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
`, wl = "\n.maplibregl-ctrl-top-left .maplibregl-ctrl { margin: 10px 0 0 10px !important; }\n.maplibregl-ctrl-group {\n  background: none !important; box-shadow: none !important; border: none !important;\n  display: flex; flex-direction: column; gap: 6px;\n}\n.maplibregl-ctrl-group button {\n  width: 36px !important; height: 36px !important;\n  border: none !important; border-radius: 50% !important;\n  background: rgba(20, 22, 28, 0.72) !important;\n  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) !important;\n}\n.maplibregl-ctrl-group button + button { border-top: none !important; }\n.maplibregl-ctrl-group button .maplibregl-ctrl-icon { filter: brightness(0) invert(1); }\n.maplibregl-ctrl-group button:disabled .maplibregl-ctrl-icon { opacity: 0.35; }\n.maplibregl-ctrl-attrib {\n  background: rgba(20, 22, 28, 0.72) !important; color: rgba(255, 255, 255, 0.7) !important;\n  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n  border-radius: 14px !important; margin: 0 8px 8px 0 !important;\n}\n.maplibregl-ctrl-attrib a { color: rgba(255, 255, 255, 0.8) !important; }\n.maplibregl-ctrl-attrib-button { background-color: transparent !important; filter: brightness(0) invert(1); opacity: 0.7; }\n", Tl = class extends HTMLElement {
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
		n.className = "sd-map", n.textContent = wl, t.appendChild(n);
	}
};
customElements.get("start-dashboard-map") || customElements.define("start-dashboard-map", Tl);
// src/sheets/persons.ts
var El = "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0";
function Dl(e) {
	let { hass: t } = e, n = Qs(t, e.config), r = Object.keys(t.states).filter((e) => e.startsWith("zone.")), i = [...n.map((e) => ({
		entity_id: e.id,
		color: Is[e.place],
		focus: !0
	})), ...r.map((e) => ({
		entity_id: e,
		focus: !1
	}))];
	return N({
		title: "Personen",
		subtitle: $s(n),
		color: "#30d158",
		glow: "rgba(48,209,88,0.2)",
		iconPath: El,
		iconStroke: "#0b1a10",
		onClose: e.closeSheet,
		body: w`
      <div class="ps-map"><start-dashboard-map .hass=${t} .entities=${i}></start-dashboard-map></div>
      <div class="ps-list">
        ${n.map((n) => {
			let r = t.states[n.id];
			return w`<div class="ps-row">
            ${zs(n, 44)}
            <span class="ps-text">
              <span class="ps-name">${n.name}</span>
              <span class="ps-sub">${n.zoneName}${r ? ` · ${ec(r.last_changed, e.now)}` : ""}</span>
            </span>
          </div>`;
		})}
      </div>
    `
	});
}
var Ol = o`
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
`, kl = [
	"Dauerhaft",
	"1 h",
	"2 h",
	"4 h"
], Al = 7, jl = 25;
async function Ml(e) {
	let t = e.allRooms, n = e.config;
	await e.call("input_number", "set_value", { value: t.temp }, { entity_id: P(n, "all_rooms_temperature") }), await e.call("input_text", "set_value", { value: fr(e.rooms, t.selected) }, { entity_id: P(n, "all_rooms_selection") }), await e.call("input_select", "select_option", { option: t.duration }, { entity_id: P(n, "all_rooms_duration") }), await e.runScript(P(n, "all_rooms_apply"));
}
function Nl(e) {
	let t = e.allRooms, n = ir(e.hass, e.rooms), r = (n) => e.setAllRooms({ temp: Math.min(jl, Math.max(Al, Math.round((t.temp + n) * 2) / 2)) }), i = (n) => {
		let r = new Set(t.selected);
		r.has(n) ? r.delete(n) : r.add(n), e.setAllRooms({ selected: r });
	}, a = t.selected.size;
	return N({
		title: "Alle Räume einstellen",
		color: "#ffffff",
		glow: "rgba(255,159,10,0.2)",
		iconPath: A.tune,
		iconStroke: "#101218",
		onClose: e.closeSheet,
		body: w`
      <div class="arcontrol">
        <button class="bigstep" aria-label="Senken" @click=${() => r(-.5)}>−</button>
        <div style="text-align:center">
          <div class="arbig">${L(t.temp, 1)}°</div>
          <div class="arsub">Soll für ${a} ${a === 1 ? "Raum" : "Räume"}</div>
        </div>
        <button class="bigstep" aria-label="Erhöhen" @click=${() => r(.5)}>+</button>
      </div>

      <div class="section-head">
        <h2 style="font-size:14px">Räume</h2>
        <span class="rule" aria-hidden="true"></span>
        ${n.filter((e) => e.id).map((t) => w`<button class="mini"
          @click=${() => e.setAllRooms({ selected: new Set(t.rooms.map((e) => e.slug)) })}>nur ${t.short}</button>`)}
        <button class="mini" @click=${() => e.setAllRooms({ selected: new Set(e.rooms.map((e) => e.slug)) })}>alle</button>
      </div>
      <div class="chips">
        ${e.rooms.map((e) => {
			let n = t.selected.has(e.slug);
			return w`<button class="rchip ${n ? "on" : ""}" aria-pressed=${n} @click=${() => i(e.slug)}>
            ${n ? M(O.check, 14, "#ffc061", 2.8) : ""}${e.name}</button>`;
		})}
      </div>

      <div class="section-head"><h2 style="font-size:14px">Wie lange</h2><span class="rule" aria-hidden="true"></span></div>
      <div class="durations" role="radiogroup" aria-label="Dauer">
        ${kl.map((n) => w`<button role="radio" aria-checked=${t.duration === n} class=${t.duration === n ? "sel" : ""}
          @click=${() => e.setAllRooms({ duration: n })}>${n}</button>`)}
      </div>

      <button class="btn primary apply" ?disabled=${a === 0}
        @click=${async () => {
			await Ml(e), e.closeSheet();
		}}>Übernehmen</button>
    `
	});
}
var Pl = o`
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
`, Fl = 300, Il = 20, Ll = 120, Rl = [
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
function zl(e, t, n) {
	let r = [];
	for (let i = 0; i < 4; i++) {
		let a = new Date(t + (n - t) * i / 4);
		e === "24h" ? r.push(i === 0 ? `${a.getHours()} Uhr` : String(a.getHours()).padStart(2, "0")) : e === "7d" ? r.push(a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")) : r.push(`${a.getDate()}.${a.getMonth() + 1}.`);
	}
	return r.push("jetzt"), r;
}
function Bl(e, t, n) {
	let r = e === "temp", i = r ? "#ff9f0a" : "#5ac8fa", a = r ? mr(t, Fl, Il, Ll, .3, .3, 1) : mr(t, Fl, Il, Ll, 1, 1, 2), o = t.map((e) => e.v), s = o[o.length - 1], c = r ? "°" : " %", l = (e) => r ? L(e, 1) : L(Math.round(e)), u = o.length ? `${l(Math.min(...o))}${r ? "°" : ""} – ${l(Math.max(...o))}${c} · jetzt ${l(s)}${c}` : "keine Daten", d = (a.lo + a.hi) / 2, f = t.length > 1 ? t[t.length - 1].t - t[0].t : 0, p = n === "30d" ? 864e5 : 36e5, m = t.map((e, n) => ({
		x: Math.round(n / Math.max(1, t.length - 1) * Fl * 10) / 10,
		y: a.y(e.v),
		time: hc(e.t, {
			step: p,
			span: f
		}),
		value: `${l(e.v)}${c}`
	})), h = a.y(60), g = !r && 60 > a.lo && 60 < a.hi;
	return w`
    <figure class="fig" style="background:${r ? "rgba(255,159,10,0.08)" : "rgba(90,200,250,0.08)"}">
      <figcaption>
        <span style="font-size:14px;font-weight:600;color:${r ? "#ffc061" : "#8fd8ff"}">${r ? "Temperatur" : "Luftfeuchte"}</span>
        <span class="cap">${u}</span>
      </figcaption>
      <div class="sc-wrap" ${Sc({
		points: m,
		width: 338,
		height: 140,
		color: i
	})}>
      <svg width="100%" viewBox="0 0 338 140" role="img" aria-label="${r ? "Temperaturverlauf" : "Luftfeuchteverlauf"}: ${u}">
        ${r ? T`${[
		a.hi,
		d,
		a.lo
	].map((e) => T`
              <line x1="0" y1=${a.y(e)} x2="338" y2=${a.y(e)} stroke="rgba(255,255,255,0.08)"></line>
              <text x="334" y=${a.y(e) - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${L(e, e % 1 ? 1 : 0)}°</text>`)}` : T`
              ${g ? T`
                <rect x="0" y=${Il} width="338" height=${Math.max(0, h - Il)} fill="rgba(255,255,255,0.04)"></rect>
                <line x1="0" y1=${h} x2="338" y2=${h} stroke="rgba(90,200,250,0.5)" stroke-dasharray="4 4"></line>
                <text x="4" y=${h - 4} fill="rgba(143,216,255,0.85)" font-size="10">60 % Lüftgrenze</text>` : D}
              <line x1="0" y1=${Ll} x2="338" y2=${Ll} stroke="rgba(255,255,255,0.08)"></line>
              <text x="334" y=${16} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${L(a.hi)} %</text>
              <text x="334" y=${116} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${L(a.lo)} %</text>`}
        ${a.area ? T`<polygon points=${a.area} fill=${r ? "rgba(255,159,10,0.16)" : "rgba(90,200,250,0.16)"}></polygon>` : D}
        ${a.line ? T`<polyline points=${a.line} fill="none" stroke=${i} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>` : D}
        ${a.last ? T`<circle cx=${a.last.x} cy=${a.last.y} r="4.5" fill=${i} stroke="#181a22" stroke-width="2"></circle>` : D}
      </svg>
      <div class="sc-layer"></div>
      </div>
    </figure>
  `;
}
function Vl(e, t, n) {
	let r = e.rooms.find((e) => e.slug === t);
	if (!r) return D;
	let i = e.history(t, n), a = n === "24h" && !i.loading ? hr(i.hum, i.temp) : null, o = zl(n, i.start, i.end);
	return N({
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
		body: w`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${Rl.map((r) => w`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "history",
			slug: t,
			range: r.id
		})}>${r.name}</button>`)}
      </div>
      ${i.loading ? w`<div class="hist-msg">Lade Verlauf …</div>` : i.error ? w`<div class="hist-msg">Verlauf nicht verfügbar: ${i.error}</div>` : w`
            ${Bl("temp", i.temp, n)}
            <div>
              ${Bl("hum", i.hum, n)}
              <div class="xlabels">${o.map((e) => w`<span>${e}</span>`)}</div>
            </div>
            ${a ? w`<div class="insight">${M(O.wind, 16, "#8fd8ff", 2.2)}<span>${a}</span></div>` : D}`}
    `
	});
}
var Hl = o`
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
function Ul(e) {
	let t = (e, t, n) => ({
		value: e,
		label: "Fenster",
		icon: O.window,
		c: t,
		tint: n
	});
	switch (e.kind) {
		case "airing": return t(e.remaining > 0 ? `lüftet ${dr(e.remaining)}` : "lüftet", "#5ac8fa", "rgba(90,200,250,0.14)");
		case "overdue": return t(`offen ${B(e.openMin)} · ${e.reason}`, "#ff6b61", "rgba(255,69,58,0.14)");
		case "stuck": return t("Sensor prüfen", "#aeb4c0", "rgba(255,255,255,0.07)");
		case "open": return t("offen (ignoriert)", "#aeb4c0", "rgba(255,255,255,0.07)");
		default: return t("zu", "#7ee8a0", "rgba(255,255,255,0.07)");
	}
}
function Wl(e, t) {
	let { hass: n } = e, r = e.rooms.find((e) => e.slug === t);
	if (!r) return D;
	let i = tr(n, r, e.target(r.climate)), a = r.climate, o = dn(r.window ? e.window(r) : {
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
	}[o], l = e.heating().find((e) => e.slug === r.slug), u = l ? `Heizung prüfen · +${L(l.rise, 1)}° in ${l.hours} h ohne Heizbedarf` : i.off ? "Aus" : i.heating ? `heizt${i.valve === null ? "" : ` · Ventile ${i.valve} %`}` : "Soll erreicht", d = yi(n, r), f = xi(n, d.map((e) => e.id), e.sceneConfigs(), e.now), p = vi(n, r, e.config.names), m = F(n, P(e.config, "outdoor_dew")), h = I(n, P(e.config, "airing_timer")) === "active", g = [
		i.pm25 === null ? null : {
			value: L(i.pm25),
			label: "PM2.5",
			icon: A.leaf,
			c: i.aq,
			tint: i.aq + "1f"
		},
		i.dew === null ? null : {
			value: `${L(i.dew, 1)}°`,
			label: "Taupunkt",
			icon: A.drop,
			c: "#8fd8ff",
			tint: "rgba(143,216,255,0.12)",
			tap: () => e.openSheet({
				id: "dew",
				slug: t,
				range: "24h"
			})
		},
		r.window ? Ul(e.window(r)) : null
	].filter((e) => !!e), _ = [i.dew === null ? "" : `Taupunkt ${L(i.dew, 1)}°`, m === null ? "" : `außen ${L(m, 1)}°`].filter(Boolean).join(" vs. ");
	return N({
		title: r.name,
		color: s,
		glow: c,
		iconPath: Ve(r.name, r.icon),
		iconStroke: o ? "#1a1206" : "#fff",
		onClose: e.closeSheet,
		headerExtra: w`
      <button class="histpill" aria-label="Verlauf Temperatur und Luftfeuchte"
        @click=${() => e.openSheet({
			id: "history",
			slug: t,
			range: "24h"
		})}>
        ${M(O.thermo, 14, "#ffc061", 2.4)}${U(i.cur)}°
        ${M(A.drop, 14, "#8fd8ff", 2.4)}${i.hum ?? "–"} %
        ${M(A.trend, 12, "rgba(255,255,255,0.7)", 2.6)}
      </button>`,
		body: w`
      <div class="tcard" style="background: linear-gradient(140deg, ${i.heating ? "rgba(255,159,10,0.3)" : "rgba(255,255,255,0.1)"}, rgba(255,255,255,0.05) 70%)">
        <div class="tcontrol">
          <button class="bigstep" aria-label="Soll senken" ?disabled=${!a} @click=${() => a && e.stepTarget(a, -.5)}>−</button>
          <div class="tcenter">
            <div class="tstate" style="color:${l ? "#ff9f0a" : i.heating ? "#ffd29a" : "rgba(255,255,255,0.75)"}">
              ${i.heating ? M(A.flame, 13, "#ffd29a", 2.4) : D}${u}
            </div>
            <div class="tbig" style="color:${i.heating ? "#ffc061" : "#fff"}">${U(i.target)}°</div>
            <div class="tsoll">Ist <strong>${U(i.cur)}°</strong></div>
          </div>
          <button class="bigstep" aria-label="Soll erhöhen" ?disabled=${!a} @click=${() => a && e.stepTarget(a, .5)}>+</button>
        </div>
        ${a ? w`<div class="presets" role="group" aria-label="Preset">
              ${$n.map((t) => {
			let n = i.preset === t.id, r = i.presetTemps[t.id];
			return w`
                  <button class="rpreset ${n ? "active" : ""}" aria-pressed=${n}
                    @click=${() => e.call("climate", "set_preset_mode", { preset_mode: t.id }, { entity_id: a })}>
                    <span class="circle" style="width:32px;height:32px;background:${t.color}">${M(He[t.id], 16, "#101010", 2.3)}</span>
                    <span class="pname">${t.name}</span>
                    <span class="ptemp">${r === void 0 ? "–" : `${L(r, r % 1 ? 1 : 0)}°`}</span>
                  </button>`;
		})}
            </div>` : D}
      </div>

      ${d.length ? w`<div class="grid3" role="group" aria-label="Szenen">
            ${d.map((t, n) => {
			let r = t.off ? "rgba(255,255,255,0.14)" : st[n % st.length], i = t.off ? "#fff" : "#101010", a = f.has(t.id);
			return w`<button class="scene ${a ? "on" : ""}" aria-pressed=${a} style=${a ? `background:${t.off ? "rgba(255,255,255,0.2)" : r + "33"};box-shadow:0 0 18px ${t.off ? "rgba(255,255,255,0.08)" : r + "40"}` : ""}
                @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>
                <span class="circle" style="width:36px;height:36px;background:${r}">${t.off ? M(A.power, 16, i, 2.1) : ct(t.icon, A.scene, i)}</span>
                <span class="ellipsis">${t.name}</span>
              </button>`;
		})}
          </div>` : D}

      ${g.length ? w`<div class="facts" style="grid-template-columns: repeat(${g.length}, minmax(0, 1fr))">
            ${g.map((e) => {
			let t = w`${M(e.icon, 18, e.c, 2)}<span class="fv">${e.value}</span><span class="fl">${e.label}</span>`;
			return "tap" in e && e.tap ? w`<button class="fact" style="background:${e.tint}" aria-label="${e.label}, Verlauf anzeigen" @click=${e.tap}>${t}</button>` : w`<div class="fact" style="background:${e.tint}">${t}</div>`;
		})}
          </div>` : D}

      ${i.airing ? w`<div class="airrow">
            <span class="circle" style="width:40px;height:40px;background:rgba(90,200,250,0.25)">${M(O.wind, 18, "#8fd8ff", 2.2)}</span>
            <span class="grow"><span class="t1s">${h ? "Lüften läuft" : i.airing}</span><span class="t2s">${_}</span></span>
            ${h ? w`<button class="airbtn" @click=${() => e.openSheet({ id: "airing" })}>Ansehen</button>` : i.airing === "Nicht lüften" ? D : w`<button class="airbtn" @click=${() => {
			e.runScript(P(e.config, "airing_start")), e.openSheet({ id: "airing" });
		}}>Start</button>`}
          </div>` : D}

      ${p.length ? w`<div class="grid2">
            ${p.map((n) => {
			let r = n.kind === "light" ? Di(e.hass.states[n.id]?.attributes ?? {}) : null, i = r ? r.color : "#30d158";
			return w`<button class="dev ${n.on ? "on" : ""} ${n.unavailable ? "na" : ""}" style=${n.on ? `background:${r ? r.bg : `${i}24`}` : ""}
                ${Lr({
				tap: () => as(e, n.id),
				hold: () => e.openSheet({
					id: "device",
					entity: n.id,
					back: {
						id: "room",
						slug: t
					}
				})
			})}>
                <span class="circle" style="width:38px;height:38px;background:${n.on ? i : "rgba(255,255,255,0.12)"}">${Va(n, e.hass.states[n.id]?.attributes, 16, n.on ? r ? r.icon : "#0b1a10" : "#fff", 2)}</span>
                <span class="devtext"><span class="t1s ellipsis">${n.name}</span><span class="t2s ellipsis">${n.status}</span></span>
              </button>`;
		})}
          </div>` : D}
    `
	});
}
var Gl = o`
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
`, Q = "#30d158", Kl = "#ff453a", ql = "#ffd60a", Jl = "#ff9f0a";
function Yl(e) {
	return e ? {
		text: `${e} ${e === 1 ? "Meldung" : "Meldungen"}`,
		alert: !0
	} : {
		text: "alles in Ordnung",
		alert: !1
	};
}
function Xl(e) {
	let t = Math.max(0, Math.round(e));
	return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
function Zl(e, t) {
	let n = { entity_id: t.entity };
	if (t.kind === "paused") return w`
      <div class="tk-pause">
        ${M(A.clock, 18, ql, 2)}
        <span class="tk-grow">Pausiert noch ${Xl(t.remainingSec ?? 0)} min</span>
        <button class="tk-btn" style="background:${ql};color:#2b2200"
          @click=${() => {
		e.call("switch", "turn_on", {}, n), e.setPiholePause(void 0);
	}}>Fortsetzen</button>
      </div>`;
	if (t.kind === "off") return w`
      <div class="tk-row tk-alert">
        <span class="circle" style="width:42px;height:42px;background:${Kl}">${M(O.shieldOff, 18, "#1f0606", 2.2)}</span>
        <span class="tk-grow"><span class="tk-title">Werbeblocker aus</span>
          <span class="tk-sub">Pi-hole · seit ${Vo(t.offSince ?? e.now.getTime(), e.now)}</span></span>
        <button class="tk-btn" style="background:${Kl};color:#1f0606" @click=${() => e.call("switch", "turn_on", {}, n)}>Einschalten</button>
      </div>`;
	let r = (t, r) => () => {
		e.call("pi_hole", "disable", { duration: t }, n), e.setPiholePause(e.now.getTime() + r);
	};
	return w`
    <div class="tk-card tk-ok">
      <span class="tk-line">
        <span class="circle" style="width:40px;height:40px;background:${Q}">${M(O.shieldOk, 18, "#06200e", 2.2)}</span>
        <span class="tk-grow"><span class="tk-title">Werbeblocker an</span>
          <span class="tk-sub">${t.percent === void 0 ? "Pi-hole" : `heute ${L(t.percent, +(t.percent < 1))} % aller Anfragen blockiert`}</span></span>
      </span>
      <div class="tk-two">
        <button class="tk-btn soft" @click=${r("00:05:00", 3e5)}>5 min pausieren</button>
        <button class="tk-btn soft" @click=${r("01:00:00", 36e5)}>1 h pausieren</button>
      </div>
    </div>`;
}
var Ql = {
	down: [
		Kl,
		"rgba(255,69,58,0.25)",
		"#ff8a80"
	],
	pending: [
		ql,
		"rgba(255,214,10,0.2)",
		"#ffe680"
	],
	cert: [
		Jl,
		"rgba(255,159,10,0.2)",
		"#ffc061"
	],
	ok: [
		Q,
		"rgba(48,209,88,0.18)",
		"rgba(255,255,255,0.6)"
	]
};
function $l(e) {
	let [t, n, r] = Ql[e.kind], i = e.kind === "ok" && e.members ? `${e.members} Monitore` : e.text;
	return w`
    <div class="tk-srv">
      <span class="tk-dot" style="background:${t};box-shadow:0 0 0 3px ${n}"></span>
      <span class="tk-sn ellipsis">${e.name}</span>
      <span class="tk-ss" style="color:${r}">${i}</span>
    </div>`;
}
function eu(e, t) {
	let n = !!e.ui.servicesOpen, r = () => e.setUi({ servicesOpen: !n }), i = t.problems.length ? `${t.ok.length} weitere erreichbar` : `alle ${t.total} erreichbar`;
	return w`
    <div class="tk-card">
      <span class="tk-cardhead"><span class="tk-grow tk-h">Dienste</span><span class="tk-sub">${t.okMonitors} von ${t.total} ok · Uptime Kuma</span></span>
      ${t.problems.map($l)}
      ${t.ok.length ? w`<button class="tk-srv tk-more" aria-expanded=${n ? "true" : "false"} @click=${r}>
            <span class="tk-dot" style="background:${Q};box-shadow:0 0 0 3px rgba(48,209,88,0.18)"></span>
            <span class="tk-sn ellipsis tk-dim">${i}</span>
            <span class="tk-chev ${n ? "open" : ""}">${M(O.chevron, 14, "rgba(255,255,255,0.5)", 2.4)}</span>
          </button>
          ${n ? t.ok.map($l) : D}` : D}
    </div>`;
}
function tu(e, t) {
	let n = t.qr ? e.hass.states[t.qr]?.attributes.entity_picture : void 0, r = { entity_id: t.entity }, i = t.clients === void 0 ? "" : ` · ${L(t.clients)} ${t.clients === 1 ? "Gerät" : "Geräte"}`;
	return w`
    <div class="tk-card tk-guest">
      ${n && t.on ? w`<img class="tk-qr" src=${n} alt="QR-Code Gäste-WLAN" data-entity=${t.qr} />` : D}
      <div class="tk-guest-main">
        <span class="tk-title">Gäste-WLAN</span>
        <span class="tk-state"><span class="tk-dot small" style="background:${t.on ? Q : "rgba(255,255,255,0.35)"}"></span>${t.on ? `an${i}` : "aus"}</span>
        ${n && t.on ? w`<span class="tk-sub">Code scannen zum Verbinden</span>` : D}
        <div class="tk-guest-act">
          <button class="tk-btn soft tk-grow" @click=${() => e.call("switch", t.on ? "turn_off" : "turn_on", {}, r)}>${t.on ? "Ausschalten" : "Einschalten"}</button>
          ${t.regenerate ? w`<button class="tk-btn soft tk-icon" aria-label="Neues Passwort erzeugen" @click=${() => e.confirm({
		title: "Neues WLAN-Passwort",
		text: "Das Gäste-WLAN bekommt ein neues Passwort. Verbundene Gäste müssen den neuen Code scannen.",
		confirm: "Erzeugen",
		color: Q,
		iconPath: O.wifi,
		onConfirm: () => e.call("button", "press", {}, { entity_id: t.regenerate })
	})}>${M(O.refresh, 16, "#fff", 2.2)}</button>` : D}
        </div>
      </div>
    </div>`;
}
function nu(e, t, n, r = "") {
	if (!t.plug) return D;
	let i = I(e.hass, t.plug) === "on", a = i && jo(e.hass, t, n), o = { entity_id: t.plug };
	return w`
    <button class="tk-power ${r} ${a ? "locked" : ""} ${i ? "on" : "off"}" aria-label=${a ? "Ausschalten gesperrt" : i ? "Drucker ausschalten" : "Drucker einschalten"} ?disabled=${a} @click=${() => {
		if (!a) {
			if (!i) return e.call("switch", "turn_on", {}, o);
			e.confirm({
				title: "3D-Drucker ausschalten",
				text: "Die Steckdose des Druckers wird ausgeschaltet.",
				confirm: "Ausschalten",
				color: Kl,
				iconPath: O.power,
				onConfirm: () => e.call("switch", "turn_off", {}, o)
			});
		}
	}}>
      ${M(O.power, 16, a ? "rgba(255,255,255,0.4)" : i ? "#fff" : "#7ee8a0", 2.4)}
      ${a ? w`<span class="tk-lock">${M(O.lock, 10, "#ffc061", 2.4)}</span>` : D}
    </button>`;
}
function ru(e, t) {
	let n = new Date(t.at).toDateString() === e.now.toDateString(), r = Ho(t.at, e.now), i = t.stale ? `letztes erfolgreiches vor ${B(Math.round(t.ageH * 60))}` : `letztes erfolgreiches ${n ? "heute " : ""}${r}`, a = t.stale ? Kl : Q;
	return w`
    <div class="tk-row ${t.stale ? "tk-alert" : ""}">
      <button class="tk-grow tk-line" @click=${() => e.moreInfo(t.entity)}>
        <span class="circle" style="width:40px;height:40px;background:${a}">${M(t.stale ? O.alert : O.check, 18, t.stale ? "#1f0606" : "#06200e", 2.2)}</span>
        <span class="tk-grow"><span class="tk-title">Backup</span><span class="tk-sub">${i}</span></span>
      </button>
    </div>`;
}
function iu(e, t, n) {
	return w`
    <div class="tk-row tk-printer">
      <button class="tk-grow tk-line" @click=${() => e.openSheet({ id: "printer" })}>
        <span class="circle" style="width:40px;height:40px;background:rgba(255,255,255,0.12)">${M(O.printer, 18, "#fff", 2)}</span>
        <span class="tk-grow"><span class="tk-title">3D-Drucker</span><span class="tk-sub">${n.status}</span></span>
      </button>
      ${nu(e, t, n)}
    </div>`;
}
function au(e) {
	let { hass: t, config: n, now: r } = e;
	if (!so(t, n)) return D;
	let i = Yl(Ko(t, n, r, {
		dismissed: e.dismissed,
		pauseUntil: e.piholePause
	})), a = go(t, n, r, e.piholePause), o = po(t, n, r), s = _o(t, n), c = vo(t, n, r), l = So(t, n), u = l ? ko(t, l, r, e.dismissed) : void 0;
	return N({
		title: "Technik",
		subtitle: i.text,
		color: i.alert ? Kl : Q,
		glow: i.alert ? "rgba(255,69,58,0.2)" : "rgba(48,209,88,0.16)",
		iconPath: O.server,
		iconStroke: i.alert ? "#1f0606" : "#06200e",
		onClose: e.closeSheet,
		body: w`
      ${a ? Zl(e, a) : D}
      ${o.total ? eu(e, o) : D}
      ${s ? tu(e, s) : D}
      ${c ? ru(e, c) : D}
      ${l && u ? iu(e, l, u) : D}
    `
	});
}
var ou = o`
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
`, su = "#bf9bff", cu = "#30d158", lu = "#ff453a", uu = "#ffd60a", du = "#ff9f0a", fu = "#ffb37a", pu = {
	printing: [
		su,
		"rgba(191,155,255,0.22)",
		"#1a0f2e"
	],
	finished: [
		cu,
		"rgba(48,209,88,0.18)",
		"#06200e"
	],
	error: [
		lu,
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
function mu(e, t, n, r) {
	let i = (t - n) / 2, a = 2 * Math.PI * i, o = Math.max(0, Math.min(1, e));
	return w`<svg width=${t} height=${t} viewBox="0 0 ${t} ${t}" aria-hidden="true" style="transform:rotate(-90deg)">
    <circle cx=${t / 2} cy=${t / 2} r=${i} fill="none" stroke="rgba(255,255,255,0.1)" stroke-width=${n}></circle>
    <circle cx=${t / 2} cy=${t / 2} r=${i} fill="none" stroke=${r} stroke-width=${n} stroke-linecap="round"
      stroke-dasharray="${a * o} ${a}"></circle></svg>`;
}
function hu(e) {
	if (e === null) return;
	let t = Math.max(0, Math.round(e * 60));
	return t < 60 ? `noch ${t} min` : `noch ${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")} min`;
}
function gu(e, t) {
	let n = F(e.hass, t.e.print_weight);
	return n === null ? void 0 : `${L(Math.round(n))} g`;
}
function _u(e, t) {
	let n = t.e.cover_image ? e.hass.states[t.e.cover_image]?.attributes.entity_picture : void 0;
	return w`<span class="pr-cover" aria-label="Titelbild des Drucks">
    ${n ? w`<img src=${n} alt="" />` : M(O.cube, 22, "rgba(255,255,255,0.7)", 1.8)}</span>`;
}
function vu(e, t, n = !1) {
	let r = t.e.chamber_light;
	if (!r || !e.hass.states[r]) return D;
	let i = I(e.hass, r) === "on", a = () => e.call("light", i ? "turn_off" : "turn_on", {}, { entity_id: r });
	return n ? w`<button class="pr-ctl" style="background:${i ? "rgba(255,214,10,0.16)" : ""}" @click=${a}>
      <span class="circle" style="width:34px;height:34px;background:${i ? uu : "rgba(255,255,255,0.12)"}">${M(O.bulb, 16, i ? "#2b2200" : "#fff", 2.2)}</span>${i ? "Licht an" : "Licht aus"}</button>` : w`<button class="pr-tile" style="background:${i ? "rgba(255,214,10,0.16)" : ""}" @click=${a}>
    <span class="circle" style="width:40px;height:40px;background:${i ? uu : "rgba(255,255,255,0.12)"}">${M(O.bulb, 18, i ? "#2b2200" : "#fff", 2.2)}</span>
    <span><span class="pr-t">Licht</span><span class="pr-s" style=${i ? "color:#ffe680" : ""}>${i ? "an" : "aus"}</span></span></button>`;
}
function yu(e, t, n, r = !1) {
	if (!t.plug) return D;
	let i = I(e.hass, t.plug) === "on", a = i && jo(e.hass, t, n), o = a ? "gesperrt" : i ? "ausschalten" : "einschalten", s = nu(e, t, n, r ? "pr-power-grid" : "pr-power-tile");
	return r ? w`<span class="pr-ctl ${a ? "dim" : ""}">${s}Strom</span>` : w`<span class="pr-tile ${a ? "dim" : ""}">${s}<span><span class="pr-t">Strom</span><span class="pr-s">${o}</span></span></span>`;
}
function bu(e, t) {
	let n = [
		[t.e.left_nozzle_temp ?? t.e.nozzle_temp, t.e.left_nozzle_temp ? "Düse L" : "Düse"],
		[t.e.right_nozzle_temp, "Düse R"],
		[t.e.bed_temp, "Bett"],
		[t.e.chamber_temp, "Druckraum"]
	].filter(([t]) => F(e.hass, t) !== null);
	return n.length ? w`<div class="pr-grid" style="grid-template-columns:repeat(${n.length}, minmax(0, 1fr))">
    ${n.map(([t, n]) => {
		let r = F(e.hass, t);
		return w`<div class="pr-pill"><span class="pr-pv" style="color:${r >= 50 ? fu : "#fff"}">${L(Math.round(r))}°</span><span class="pr-pl">${n}</span></div>`;
	})}</div>` : D;
}
function xu(e, t) {
	let n = No(e.hass, t);
	if (!n.length) return D;
	let r = Po(e.hass, t);
	return w`<div class="pr-card pr-ams">
    <div class="pr-row"><span class="pr-h">AMS</span>${r ? w`<span class="pr-note">${r}</span>` : D}</div>
    <div class="pr-grid" style="grid-template-columns:repeat(${Math.max(4, n.length)}, minmax(0, 1fr))">
      ${n.map((e) => w`<div class="pr-slot">
        <span class="circle ${e.empty ? "empty" : ""}" style="width:40px;height:40px;background:${e.color ?? "transparent"};box-shadow:${e.active ? `0 0 0 3px #181a22, 0 0 0 5px ${su}` : "inset 0 0 0 1px rgba(255,255,255,0.18)"}"></span>
        <span class="pr-st">${e.type || "–"}</span>
        <span class="pr-pl ellipsis">${e.name}</span>
        ${e.remain === void 0 ? D : w`<span class="pr-pl">${L(e.remain)} %</span>`}
      </div>`)}
    </div>
  </div>`;
}
function Su(e, t) {
	let n = F(e.hass, t.plugPower);
	return n === null ? D : w`<div class="pr-line">${M(O.power, 18, "rgba(255,255,255,0.7)", 2)}<span class="pr-grow pr-b">Steckdose · ${L(Math.round(n))} W</span></div>`;
}
function Cu(e, t) {
	let n = t.plugEnergy;
	if (!n) return D;
	let r = e.series(`printer-month:${n}`, () => ba(e.hass, n, e.now.getTime()), 9e5), i = r.total;
	return w`<div class="pr-line">${M(O.bolt, 18, "rgba(255,255,255,0.7)", 2)}
    <span class="pr-grow pr-b">Diesen Monat</span>
    <span class="pr-v">${i == null ? r.loading ? "…" : "–" : `${L(i, 1)} kWh`}</span></div>`;
}
function wu(e, t) {
	let n = I(e.hass, t.e.subtask_name), r = I(e.hass, t.e.end_time);
	if (!n || n === "unknown" || n === "unavailable") return D;
	let i = Io(r), a = "";
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
	return w`<div class="pr-line">${M(O.cube, 18, "rgba(255,255,255,0.7)", 2)}
    <span class="pr-grow"><span class="pr-b ellipsis" style="display:block">Letzter Druck: ${n}</span>${a ? w`<span class="pr-pl">${a}</span>` : D}</span></div>`;
}
function Tu(e, t) {
	let n = t.controls.camera, r = n ? e.hass.states[n] : void 0;
	return !r || r.state === "unavailable" || !customElements.get("ha-camera-stream") ? D : w`<div class="pr-cam"><ha-camera-stream .hass=${e.hass} .stateObj=${r} .muted=${!0} .controls=${!1}></ha-camera-stream>
    <span class="pr-chip"><span class="pr-dotl"></span>Live</span></div>`;
}
function Eu(e, t, n) {
	let { hass: r } = e, i = Math.round((n.progress ?? 0) * 100), a = I(r, t.e.current_layer), o = I(r, t.e.total_layers), s = Io(I(r, t.e.end_time)), c = hu(F(r, t.e.remaining_time)), l = I(r, t.e.subtask_name), u = gu(e, t), d = To(r, t.e.speed_profile), { pause: f, resume: p, stop: m } = t.controls, h = n.paused ? p : f, g = [];
	h && g.push(w`<button class="pr-ctl" style="background:rgba(255,214,10,0.16)" @click=${() => e.call("button", "press", {}, { entity_id: h })}>
      <span class="circle" style="width:34px;height:34px;background:${uu}">${M(n.paused ? A.play : O.pause, 16, "#2b2200", 2.4)}</span>${n.paused ? "Fortsetzen" : "Pause"}</button>`), m && g.push(w`<button class="pr-ctl" style="background:rgba(255,69,58,0.14)" ${Lr({ hold: () => e.confirm({
		title: "Druck abbrechen",
		text: "Der laufende Druck wird abgebrochen und kann nicht fortgesetzt werden.",
		confirm: "Abbrechen",
		color: lu,
		iconPath: O.printer,
		onConfirm: () => e.call("button", "press", {}, { entity_id: m })
	}) })}>
      <span class="circle" style="width:34px;height:34px;background:${lu}">${M(A.stop, 16, "#1f0606", 2.4)}</span>Stopp</button>`);
	let _ = vu(e, t, !0), v = yu(e, t, n, !0), y = g.length + (_ === D ? 0 : 1) + (v === D ? 0 : 1);
	return w`
    ${Tu(e, t)}
    <div class="pr-card pr-hero">
      <div class="pr-ring">${mu(n.progress ?? 0, 118, 10, n.paused ? uu : su)}
        <span class="pr-ring-in"><span class="pr-big">${i} %</span>${a && o ? w`<span class="pr-pl">Schicht ${a}/${o}</span>` : D}</span>
      </div>
      <div class="pr-hero-main">
        <div class="pr-row">${_u(e, t)}
          <span class="pr-grow"><span class="pr-b ellipsis" style="display:block">${l ?? ""}</span>${u ? w`<span class="pr-pl">${u}</span>` : D}</span></div>
        ${s ? w`<span><span class="pr-pl">fertig um</span><span class="pr-clock">${s}</span></span>` : D}
        ${c ? w`<span class="pr-remain">${c}</span>` : D}
      </div>
    </div>
    <div class="pr-status">
      <span class="pr-sdot" style="background:${n.paused ? uu : cu}"></span>
      <span class="pr-b">${n.paused ? "Pausiert" : "Druckt"}</span>
      <span class="pr-grow pr-dim ellipsis">· Arbeitsschritt: ${To(r, t.e.stage)}</span>
      ${d ? w`<span class="pr-pl">${d}</span>` : D}
    </div>
    ${y ? w`<div class="pr-grid" style="grid-template-columns:repeat(${y}, minmax(0, 1fr))">${g}${_}${v}</div>` : D}
    ${t.plug ? w`<span class="pr-hint">${m ? "Stopp: halten zum Bestätigen · " : ""}Strom gesperrt während Druck und bis Düse &lt; ${50}°</span>` : D}
    ${bu(e, t)}
    ${xu(e, t)}
    ${Su(e, t)}`;
}
function Du(e, t, n) {
	let { hass: r } = e, i = Io(I(r, t.e.end_time)), a = F(r, t.e.bed_temp), o = Ao(r, t), s = gu(e, t), c = !!t.plug && I(r, t.plug) === "on" && !jo(r, t, n), l = F(r, t.plugPower);
	return w`
    <div class="pr-card pr-hero" style="background:linear-gradient(160deg, rgba(48,209,88,0.2), rgba(255,255,255,0.05) 70%)">
      <div class="pr-ring" style="width:96px;height:96px">${mu(1, 96, 9, cu)}<span class="pr-ring-in">${M(O.check, 34, cu, 3)}</span></div>
      <div class="pr-hero-main" style="gap:4px">
        ${i ? w`<span class="pr-pl">fertig um</span><span class="pr-clock">${i}</span>` : w`<span class="pr-clock">Fertig</span>`}
        <span class="pr-b ellipsis">${I(r, t.e.subtask_name) ?? ""}</span>
        ${s ? w`<span class="pr-pl">${s}</span>` : D}
      </div>
    </div>
    ${a !== null && a >= 35 ? w`<div class="pr-bed"><span class="circle" style="width:40px;height:40px;background:${du}">${M(O.thermo, 18, "#2b1600", 2.2)}</span>
          <span class="pr-grow"><span class="pr-t">Druckbett ${L(Math.round(a))}°</span><span class="pr-s" style="color:#ffc061">noch abkühlen lassen · unter ${35}° entnehmen</span></span></div>` : D}
    <div class="pr-tiles">${vu(e, t)}${yu(e, t, n)}</div>
    ${c && o !== null ? w`<span class="pr-hint">Düse ist abgekühlt (${L(Math.round(o))}°) · Ausschalten frei${l === null ? "" : ` · Steckdose ${L(Math.round(l))} W`}</span>` : D}
    ${xu(e, t)}`;
}
function Ou(e, t, n) {
	let { hass: r } = e, i = I(r, t.e.current_layer), a = I(r, t.e.total_layers), { resume: o, stop: s } = t.controls, c = Math.round((n.progress ?? 0) * 100);
	return w`
    <div class="pr-err">
      <span class="pr-row"><span class="circle" style="width:34px;height:34px;background:${lu}">${M(O.alert, 16, "#1f0606", 2.4)}</span>
        <span class="pr-t">${n.errorText ?? "Fehler am Drucker"}</span></span>
      ${o || s ? D : w`<span class="pr-s" style="color:rgba(255,255,255,0.85)">Am Drucker oder in Bambu Handy fortsetzen.</span>`}
    </div>
    <div class="pr-line" style="height:auto;padding:12px 14px">
      <span class="pr-ring" style="width:56px;height:56px">${mu(n.progress ?? 0, 56, 6, "rgba(255,255,255,0.45)")}<span class="pr-ring-in pr-b">${c} %</span></span>
      <span class="pr-grow"><span class="pr-b ellipsis" style="display:block">${I(r, t.e.subtask_name) ?? ""}</span>
        ${i && a ? w`<span class="pr-pl">Schicht ${i} von ${a} · angehalten</span>` : D}</span>
    </div>
    ${o || s ? w`<div class="pr-grid" style="grid-template-columns:repeat(${o && s ? 2 : 1}, minmax(0, 1fr))">
          ${o ? w`<button class="pr-big-btn" style="background:${cu};color:#06200e" @click=${() => e.call("button", "press", {}, { entity_id: o })}>Fortsetzen</button>` : D}
          ${s ? w`<button class="pr-big-btn" style="background:rgba(255,69,58,0.18);color:#ff8a80" @click=${() => e.confirm({
		title: "Druck abbrechen",
		text: "Der Druck wird abgebrochen.",
		confirm: "Abbrechen",
		color: lu,
		iconPath: O.printer,
		onConfirm: () => e.call("button", "press", {}, { entity_id: s })
	})}>Abbrechen</button>` : D}
        </div>` : D}
    <div class="pr-tiles">${vu(e, t)}${yu(e, t, n)}</div>`;
}
function ku(e, t, n) {
	let r = {
		off: ["Steckdose aus", "Nach dem Einschalten braucht der Drucker etwa 1 min, bis er sich meldet."],
		starting: ["Startet …", "Drucker startet, das dauert etwa 1 min."],
		disconnected: ["Nicht verbunden", t.plug ? "Steckdose an, aber keine Verbindung zum Drucker." : "Keine Verbindung zum Drucker."]
	}[n.kind];
	return w`
    ${r ? w`<div class="pr-quiet">
          <span class="circle" style="width:56px;height:56px;background:rgba(255,255,255,0.08)">${M(O.printer, 26, "rgba(255,255,255,0.75)", 1.8)}</span>
          <span class="pr-qt">${r[0]}</span>
          <span class="pr-pl" style="max-width:260px">${r[1]}</span>
          ${n.kind === "off" && t.plug ? w`<button class="pr-on" @click=${() => e.call("switch", "turn_on", {}, { entity_id: t.plug })}>${M(O.power, 16, "#06200e", 2.4)}Einschalten</button>` : D}
        </div>` : D}
    ${n.kind === "idle" ? w`${bu(e, t)}${xu(e, t)}<div class="pr-tiles">${vu(e, t)}${yu(e, t, n)}</div>` : D}
    ${wu(e, t)}
    ${Cu(e, t)}`;
}
function Au(e) {
	let { hass: t, config: n, now: r } = e;
	if (!so(t, n)) return D;
	let i = So(t, n);
	if (!i) return D;
	let a = ko(t, i, r, e.dismissed), [o, s, c] = pu[a.kind], l = a.kind === "printing" ? Eu(e, i, a) : a.kind === "finished" ? Du(e, i, a) : a.kind === "error" ? Ou(e, i, a) : ku(e, i, a);
	return N({
		title: "3D-Drucker",
		subtitle: a.status,
		color: o,
		glow: s,
		iconPath: O.printer,
		iconStroke: c,
		onClose: e.closeSheet,
		body: w`${l}`
	});
}
var ju = o`
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
`, Mu, Nu = "0.22.0", $ = [
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
], Pu = {
	overview: "radial-gradient(100% 30% at 0% 0%, rgba(110,90,200,0.34), transparent 70%), radial-gradient(80% 30% at 100% 40%, rgba(90,200,250,0.12), transparent 70%)",
	climate: "radial-gradient(100% 30% at 50% 0%, rgba(255,140,60,0.26), transparent 70%), radial-gradient(80% 30% at 0% 55%, rgba(90,200,250,0.12), transparent 70%)",
	rooms: "radial-gradient(100% 28% at 50% 0%, rgba(255,214,10,0.18), transparent 70%)",
	energy: "radial-gradient(100% 28% at 50% 0%, rgba(48,209,88,0.2), transparent 70%)",
	security: "radial-gradient(100% 28% at 50% 0%, rgba(191,155,255,0.22), transparent 70%)"
}, Fu = 36e5, Iu = {
	"24h": {
		ms: 24 * Fu,
		bucket: Fu,
		period: "hour"
	},
	"7d": {
		ms: 168 * Fu,
		bucket: Fu,
		period: "hour"
	},
	"30d": {
		ms: 720 * Fu,
		bucket: 24 * Fu,
		period: "day"
	}
}, Lu = 700, Ru = 15e3;
function zu() {
	let e = "ha-start-dashboard-font";
	if (document.getElementById(e)) return;
	let t = document.createElement("link");
	t.id = e, t.rel = "stylesheet", t.href = "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap", document.head.appendChild(t);
}
var Bu = class extends ze {
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
			let r = e.clientX - t.navLeft, i = Ye(r, t.tabs);
			this._navDrag && i !== this._navDrag.hover && Fr(this, "selection"), this._navDrag = {
				...Xe(r, t.width, t.barWidth, 6),
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
		this._config = e, this._page = e.page ?? "overview", this._roomsKey = void 0, e.load_font !== !1 && zu();
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
		super.disconnectedCallback(), window.clearInterval(this._tick), window.clearInterval(this._fastTick), this._fastTick = void 0, ti(this);
	}
	updated(e) {
		let t = this._config?.header ?? "hide", n = ei(this, t) ? t : "";
		if (n !== this._hdr && (this._hdr = n), e.has("_sheet") || e.has("hass") || e.has("_piholePause")) {
			let e = this.hass && this._config ? this.hass.states[P(this._config, "airing_timer")] : void 0, t = !!this._piholePause && this._piholePause > Date.now(), n = this._sheet?.id === "airing" || e?.state === "active" || this._sheet?.id === "technik" && t;
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
				(Number(this.hass.states[a]?.attributes[o]) === i.value && e - i.at > Lu || e - i.at > Ru) && (delete n[r], t = !0);
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
		}, window.clearTimeout(this._debounce[i]), this._debounce[i] = window.setTimeout(r, Lu);
	}
	_stepTarget(e, t) {
		let n = this.hass?.states[e]?.attributes;
		if (!n) return;
		let r = nr(this._target(e) ?? 19, t, Number(n.min_temp) || 7, Number(n.max_temp) || 30, Number(n.target_temp_step) || .5);
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
			let e = F(this.hass, P(this._config, "all_rooms_temperature")), t = this.hass.states[P(this._config, "all_rooms_duration")]?.state;
			this._allRooms = {
				temp: e !== null && e >= 7 ? e : 19,
				selected: new Set(this._rooms.map((e) => e.slug)),
				duration: t && kl.includes(t) ? t : "Dauerhaft"
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
		let i = Iu[t], a = Date.now(), o = Math.floor((a - i.ms) / i.bucket) * i.bucket, s = {
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
		let e = P(this._config, "weather"), t = async (t) => (await this.hass.callWS({
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
		}, ka(this.hass, br(this.hass, this._config), Gi(this._config, this._energy.prefs), e ?? {}).then((e) => this._heating = {
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
		return !e.loading && Date.now() - e.at > 18e5 && !yn(this.hass) ? this._alarmo = {
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
		let e = this.hass, t = this._appliances, n = ln(e, this._config).map((e) => e.power);
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
				key: Ma(t, e, r.getTime()).map((e) => e.slug).join(",")
			};
		}
		let { rooms: a, key: o } = i, s = this._stuck;
		!s.loading && (s.key !== o || Date.now() - s.at > 6e5) && (this._stuck = {
			...s,
			key: o,
			loading: !0
		}, Na(t, a, n).then((e) => this._stuck = {
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
		let c = hn(t.states[P(n, "window_snooze")]?.state);
		return pn(t, e, n, r, {
			stuck: o ? s.key === o && s.slugs.includes(e.slug) : !1,
			snoozed: !!e.window && gn(c, e.window, r.getTime())
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
			let t = Vi(e);
			if (t.solar.length + t.import.length + t.export.length) {
				let n = await ga(this.hass, {
					...t,
					...Hi(e)
				}, Ui(e));
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
			runScript: (e, t) => this._call(...ht(e), t),
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
		if (!this.hass || !this._config) return D;
		let e = this._ctx(), t = this._config.nav !== !1;
		return w`
      <div class="wrap ${this._hdr ? `hdr-${this._hdr}` : ""}" style="background-image:${Pu[this._page]}">
        <main class="content">${this._renderPage(e)}</main>
        ${t ? this._renderNav() : D}
      </div>
      ${this._renderSheets(e)}
    `;
	}
	_renderPage(e) {
		if (this._page === "overview") return Zo(e);
		if (this._page === "climate") return ao(e);
		if (this._page === "rooms") return vs(e);
		if (this._page === "energy") return Ns(e);
		if (this._page === "security") return ic(e);
		let t = $.find((e) => e.id === this._page);
		return w`
      <header class="page-head">
        <div class="date">${jn(e.now)}</div>
        <h1>${t.name}</h1>
      </header>
      <div class="todo">
        <span class="circle" style="width:42px;height:42px;background:rgba(255,255,255,0.12)">${M(t.icon, 18, "#fff")}</span>
        <span>Diese Seite kommt in Etappe ${t.milestone}.</span>
      </div>
    `;
	}
	_renderNav() {
		let e = $.length, t = Math.max(0, $.findIndex((e) => e.id === this._page)), n = this._navDrag, r = `((100% - 12px - ${(e - 1) * 4}px) / ${e + 1})`, i = n ? `left:${n.left}px;width:${n.width}px` : `left:calc(6px + ${t} * (${r} + 4px));width:calc(2 * ${r})`;
		return w`
      <nav class="nav ${n ? "dragging" : ""}" aria-label="Bereiche"
        @pointerdown=${this._navDown} @pointermove=${this._navMove} @pointerup=${this._navUp} @pointercancel=${this._navCancel}>
        <span class="lens" style=${i} aria-hidden="true"></span>
        ${$.map((e, t) => {
			let r = e.id === this._page, i = n?.hover === t;
			return w`
            <button class="tab ${r ? "active" : ""} ${i ? "hover" : ""}" aria-label=${e.name} aria-current=${r ? "page" : "false"}
              @click=${() => this._selectPage(e.id)}>
              ${M(e.icon, 20, "currentColor")}${r ? w`<span>${e.name}</span>` : D}
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
			let r = Yr(n);
			r && t.push({
				key: Xr(r),
				view: this._sheetView(e, r)
			}), t.push({
				key: Xr(n),
				view: this._sheetView(e, n)
			});
		}
		if (this._confirm && t.push({
			key: "confirm",
			view: lt({
				...this._confirm,
				onClose: () => this._confirm = null
			})
		}), !t.length) return D;
		let r = t.length - 1;
		return Jr(t, (e) => e.key, (e, t) => w`
      <div class="layer ${t < r ? "under" : ""} ${t > 0 ? "stacked" : ""}" ?inert=${t < r}>${e.view}</div>`);
	}
	_sheetView(e, t) {
		switch (t.id) {
			case "persons": return Dl(e);
			case "alarm": return Sl(e);
			case "room": return Wl(e, t.slug);
			case "history": return Vl(e, t.slug, t.range);
			case "airing": return bl(e);
			case "allRooms": return Nl(e);
			case "device": return ls(e, t.entity, t);
			case "robby": return cc(e);
			case "weather": return Fc(e);
			case "care": return Qc(e);
			case "ac": return ll(e);
			case "energyChart": return _l(e, t.key, t.range, t.name, t.back);
			case "weatherMetric": return Bc(e, t.metric);
			case "weatherRain": return zc(e);
			case "dew": return qc(e, t.slug, t.range);
			case "weatherDay": return Lc(e, t.date);
			case "technik": return au(e);
			case "printer": return Au(e);
		}
	}
};
Mu = Bu, Mu.properties = {
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
}, Mu.styles = [
	wr,
	ut,
	Qo,
	oo,
	Cl,
	Ol,
	Gl,
	Hl,
	xl,
	Pl,
	Ss,
	gs,
	Fs,
	ac,
	lc,
	Vc,
	Jc,
	$c,
	ul,
	ou,
	ju,
	Ac,
	Cc,
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
], customElements.get("ha-start-dashboard") || customElements.define("ha-start-dashboard", Bu);
var Vu = window;
Vu.customCards = Vu.customCards ?? [], Vu.customCards.push({
	type: "ha-start-dashboard",
	name: "Start Dashboard",
	description: "Phone-first Start dashboard (Übersicht, Klima, Räume, Energie, Schutz) in one card.",
	preview: !1
}), console.info(`%c START-DASHBOARD %c ${Nu} `, "background:#bf9bff;color:#1d1030;font-weight:700", "background:#181a22;color:#fff");
export { Bu as HaStartDashboard };
