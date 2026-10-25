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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, _ = g ? g.emptyScript : "", v = h.reactiveElementPolyfillSupport, y = (e, t) => e, ee = {
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
}, te = (e, t) => !l(e, t), ne = {
	attribute: !0,
	type: String,
	converter: ee,
	reflect: !1,
	useDefault: !1,
	hasChanged: te
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var re = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ne) {
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
		return this.elementProperties.get(e) ?? ne;
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
			let i = (n.converter?.toAttribute === void 0 ? ee : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? ee : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? te)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
re.elementStyles = [], re.shadowRootOptions = { mode: "open" }, re[y("elementProperties")] = /* @__PURE__ */ new Map(), re[y("finalized")] = /* @__PURE__ */ new Map(), v?.({ ReactiveElement: re }), (h.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var ie = globalThis, ae = (e) => e, oe = ie.trustedTypes, se = oe ? oe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ce = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + b, ue = `<${le}>`, x = document, de = () => x.createComment(""), fe = (e) => e === null || typeof e != "object" && typeof e != "function", pe = Array.isArray, me = (e) => pe(e) || typeof e?.[Symbol.iterator] == "function", he = "[ 	\n\f\r]", ge = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _e = /-->/g, ve = />/g, S = RegExp(`>|${he}(?:([^\\s"'>=/]+)(${he}*=${he}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ye = /'/g, be = /"/g, xe = /^(?:script|style|textarea|title)$/i, Se = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), C = Se(1), w = Se(2), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), Ce = /* @__PURE__ */ new WeakMap(), D = x.createTreeWalker(x, 129);
function we(e, t) {
	if (!pe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return se === void 0 ? t : se.createHTML(t);
}
var Te = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = ge;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === ge ? c[1] === "!--" ? o = _e : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = S) : (xe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = S) : o = ve : o === S ? c[0] === ">" ? (o = i ?? ge, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? S : c[3] === "\"" ? be : ye) : o === be || o === ye ? o = S : o === _e || o === ve ? o = ge : (o = S, i = void 0);
		let d = o === S && e[t + 1].startsWith("/>") ? " " : "";
		a += o === ge ? n + ue : l >= 0 ? (r.push(s), n.slice(0, l) + ce + n.slice(l) + b + d) : n + b + (l === -2 ? t : d);
	}
	return [we(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Ee = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Te(t, n);
		if (this.el = e.createElement(l, r), D.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = D.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ce)) {
					let t = u[o++], n = i.getAttribute(e).split(b), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ae : r[1] === "?" ? je : r[1] === "@" ? Me : ke
					}), i.removeAttribute(e);
				} else e.startsWith(b) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (xe.test(i.tagName)) {
					let e = i.textContent.split(b), t = e.length - 1;
					if (t > 0) {
						i.textContent = oe ? oe.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], de()), D.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], de());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === le) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(b, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += b.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = x.createElement("template");
		return n.innerHTML = e, n;
	}
};
function O(e, t, n = e, r) {
	if (t === T) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = fe(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = O(e, i._$AS(e, t.values), i, r)), t;
}
var De = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? x).importNode(t, !0);
		D.currentNode = r;
		let i = D.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Oe(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ne(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = D.nextNode(), a++);
		}
		return D.currentNode = x, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Oe = class e {
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
		e = O(this, e, t), fe(e) ? e === E || e == null || e === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : e !== this._$AH && e !== T && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? me(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== E && fe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ee.createElement(we(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new De(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ce.get(e.strings);
		return t === void 0 && Ce.set(e.strings, t = new Ee(e)), t;
	}
	k(t) {
		pe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(de()), this.O(de()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ae(e).nextSibling;
			ae(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, ke = class {
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
		if (i === void 0) e = O(this, e, t, 0), a = !fe(e) || e !== this._$AH && e !== T, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = O(this, r[n + o], t, o), s === T && (s = this._$AH[o]), a ||= !fe(s) || s !== this._$AH[o], s === E ? e = E : e !== E && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ae = class extends ke {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === E ? void 0 : e;
	}
}, je = class extends ke {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== E);
	}
}, Me = class extends ke {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = O(this, e, t, 0) ?? E) === T) return;
		let n = this._$AH, r = e === E && n !== E || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== E && (n === E || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ne = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		O(this, e);
	}
}, Pe = {
	M: ce,
	P: b,
	A: le,
	C: 1,
	L: Te,
	R: De,
	D: me,
	V: O,
	I: Oe,
	H: ke,
	N: je,
	U: Me,
	B: Ae,
	F: Ne
}, Fe = ie.litHtmlPolyfillSupport;
Fe?.(Ee, Oe), (ie.litHtmlVersions ??= []).push("3.3.3");
var Ie = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Oe(t.insertBefore(de(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Le = globalThis, Re = class extends re {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ie(t, this.renderRoot, this.renderOptions);
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
Re._$litElement$ = !0, Re.finalized = !0, Le.litElementHydrateSupport?.({ LitElement: Re });
var ze = Le.litElementPolyfillSupport;
ze?.({ LitElement: Re }), (Le.litElementVersions ??= []).push("4.2.2");
// src/icons.ts
var k = {
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
	tree: "M12 2l6 9h-3l4 6H5l4-6H6zM12 17v5"
};
function Be(e, t) {
	if (t && t in k) return k[t];
	let n = e.toLowerCase();
	return /büro|arbeits/.test(n) ? k.desk : /bad|wc/.test(n) ? k.bath : /schlaf/.test(n) ? k.bed : /flur|diele|treppe/.test(n) ? k.door : /wohn/.test(n) ? k.sofa : /küche|kuche|ess/.test(n) ? k.pot : /garten|terrasse|balkon/.test(n) ? k.tree : k.home;
}
function A(e) {
	switch (e) {
		case "sunny": return k.sun;
		case "clear-night": return k.moon;
		case "rainy":
		case "pouring": return k.rain;
		case "lightning":
		case "lightning-rainy":
		case "windy":
		case "windy-variant": return k.storm;
		case "snowy":
		case "snowy-rainy":
		case "hail": return k.snow;
		case "fog": return k.fog;
		default: return k.cloud;
	}
}
var j = {
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
}, Ve = {
	eco: j.leaf,
	comfort: k.sofa,
	boost: j.flame,
	frost: j.snowflake
}, M = {
	bulb: k.bulb,
	lamp: "M9 2h6l3 8H6zM12 10v11M8 21h8",
	strip: "M3 12h18M6 9v6M10 9v6M14 9v6M18 9v6",
	tv: "M3 6h18v12H3zM8 21h8",
	fan: j.fan,
	drop: j.drop,
	plug: "M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4",
	boiler: "M7 3h10v14a5 5 0 0 1-10 0zM10 21h4M12 8v4",
	dryer: "M4 3h16v18H4zM12 9a4 4 0 1 0 0 8a4 4 0 1 0 0-8M7 6h.01",
	brightness: "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
};
function He(e, t) {
	let n = `${e} ${t}`.toLowerCase();
	return e.startsWith("fan.") ? M.fan : e.startsWith("humidifier.") ? M.drop : e.startsWith("light.") ? /led|strip|sideboard|stimmung|couch|regal/.test(n) ? M.strip : /stehlampe|uhr|wandlampe/.test(n) ? M.lamp : M.bulb : /tv|fernseh|heimkino|kino/.test(n) ? M.tv : /brunnen|pumpe/.test(n) ? M.drop : /trockner|wasch/.test(n) ? M.dryer : /warmwasser|boiler/.test(n) ? M.boiler : /deckenlampe|lampe|licht/.test(n) ? M.bulb : M.plug;
}
// node_modules/lit-html/directive.js
var Ue = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, We = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Ge = class {
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
function Ke(e, t, n) {
	return e < 30 ? !1 : e >= Math.max(80, Math.min(140, n * .25)) || t >= .5;
}
function qe(e) {
	return e >= 0 ? e : -Math.min(40, Math.round(-e * .15));
}
function Je(e, t) {
	let n = 0, r = Infinity;
	return t.forEach((t, i) => {
		let a = e < t.left ? t.left - e : e > t.right ? e - t.right : 0;
		a < r && (r = a, n = i);
	}), n;
}
function Ye(e, t, n, r) {
	let i = Math.max(r, Math.min(n - r - t, e - t / 2));
	return {
		left: Math.round(i),
		width: t
	};
}
// src/components/swipe.ts
var Xe = ".grabber, .sheet-head", Ze = /* @__PURE__ */ new WeakMap();
function Qe(e) {
	let t = e.previousElementSibling;
	return t instanceof HTMLElement && t.classList.contains("backdrop") ? t : null;
}
function $e(e, t) {
	e.style.setProperty("--drag", `${t}px`);
	let n = Qe(e);
	n && (n.style.opacity = String(Math.max(.15, 1 - Math.max(0, t) / (e.offsetHeight || 600))));
}
function et(e) {
	e.style.removeProperty("--drag"), e.style.transition = "";
	let t = Qe(e);
	t && (t.style.opacity = "", t.style.transition = "");
}
function tt(e, t, n, r) {
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
function nt(e, t, n, r) {
	let i = r - t.startY, a = n - t.startX;
	if (!t.decided) {
		if (Math.abs(i) < 6 && Math.abs(a) < 6) return !1;
		if (t.decided = !0, t.active = Math.abs(i) > Math.abs(a) && i > 0 && (t.fromHead || e.scrollTop <= 0), t.active) {
			e.style.transition = "none";
			let t = Qe(e);
			t && (t.style.transition = "none");
		}
	}
	return t.active ? (t.dy = qe(i), t.samples.push({
		y: r,
		t: performance.now()
	}), t.samples.length > 5 && t.samples.shift(), $e(e, t.dy), !0) : !1;
}
function rt(e, t) {
	if (!t.active) return;
	t.active = !1;
	let n = t.samples[0], r = t.samples[t.samples.length - 1], i = r.t - n.t >= 16 ? (r.y - n.y) / (r.t - n.t) : 0, a = Qe(e);
	Ke(t.dy, i, e.offsetHeight) ? (e.style.transition = "transform 0.2s ease-in", a && (a.style.transition = "opacity 0.2s ease-in"), $e(e, e.offsetHeight + 40), a && (a.style.opacity = "0"), window.setTimeout(() => {
		t.onClose(), et(e);
	}, 190)) : (e.style.transition = "transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.15)", a && (a.style.transition = "opacity 0.3s ease-out"), $e(e, 0), a && (a.style.opacity = ""), window.setTimeout(() => et(e), 340));
}
function it(e) {
	let t = () => Ze.get(e);
	e.addEventListener("touchstart", (e) => {
		if (e.touches.length !== 1) return;
		let n = e.touches[0], r = e.target;
		r.closest("start-dashboard-slider, input") || tt(t(), n.clientX, n.clientY, !!r.closest(Xe));
	}, { passive: !0 }), e.addEventListener("touchmove", (n) => {
		let r = n.touches[0];
		r && nt(e, t(), r.clientX, r.clientY) && n.cancelable && n.preventDefault();
	}, { passive: !1 }), e.addEventListener("touchend", () => rt(e, t())), e.addEventListener("touchcancel", () => rt(e, t())), e.addEventListener("pointerdown", (n) => {
		if (n.pointerType !== "mouse" || n.button !== 0 || !n.target.closest(Xe)) return;
		tt(t(), n.clientX, n.clientY, !0);
		let r = (n) => nt(e, t(), n.clientX, n.clientY), i = () => {
			window.removeEventListener("pointermove", r), window.removeEventListener("pointerup", i);
			let n = t().active;
			rt(e, t()), n && e.addEventListener("click", (e) => e.stopPropagation(), {
				capture: !0,
				once: !0
			});
		};
		window.addEventListener("pointermove", r), window.addEventListener("pointerup", i);
	});
}
var at = We(class extends Ge {
	constructor(e) {
		if (super(e), e.type !== Ue.ELEMENT) throw Error("swipeToClose() must be used as an element directive");
	}
	render(e) {
		return T;
	}
	update(e, [t]) {
		let n = e.element, r = Ze.get(n);
		return r ? r.onClose = t : (Ze.set(n, {
			onClose: t,
			startX: 0,
			startY: 0,
			active: !1,
			decided: !1,
			fromHead: !1,
			samples: [],
			dy: 0
		}), it(n)), T;
	}
});
// src/components/ui.ts
function N(e, t, n, r = 2.2) {
	return C`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke=${n} stroke-width=${r}
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${e}></path></svg>`;
}
var ot = [
	"#ffb340",
	"#64d2ff",
	"#bf9bff",
	"#7ee8a0",
	"#ff9f0a",
	"#ff6b5e"
];
function st(e, t, n, r = 18) {
	return e && customElements.get("ha-icon") ? C`<ha-icon .icon=${e} style="--mdc-icon-size:${r}px;color:${n}"></ha-icon>` : N(t, r - 2, n, 2.1);
}
function P(e) {
	let t = e.onBack ?? e.onClose;
	return C`
    <div class="backdrop" @click=${t}></div>
    <section class="sheet" role="dialog" aria-modal="true" aria-label=${e.title}
      style="background-image: radial-gradient(100% 30% at 50% 0%, ${e.glow}, transparent 70%)"
      ${at(t)}
      @keydown=${(e) => e.key === "Escape" && t()}>
      <div class="grabber" aria-hidden="true"></div>
      <header class="sheet-head">
        ${e.onBack ? C`<button class="close back" aria-label="Zurück" @click=${e.onBack}>${N("M15 5l-7 7 7 7", 18, "#fff", 2.4)}</button>` : C`<span class="circle" style="width:44px;height:44px;background:${e.color}">${N(e.iconPath, 20, e.iconStroke ?? "#141008", 2)}</span>`}
        <span class="sheet-title">
          <h1 class="ellipsis">${e.title}</h1>
          ${e.subtitle ? C`<span class="sheet-sub">${e.subtitle}</span>` : ""}
        </span>
        ${e.headerExtra ?? ""}
        ${e.noClose ? "" : C`<button class="close" aria-label="Schließen" @click=${e.onClose}>${N(k.close, 16, "#fff", 2.4)}</button>`}
      </header>
      ${e.body}
    </section>
  `;
}
function ct(e) {
	return P({
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
var lt = o`
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
`, ut = {
	weather: "weather.musterstadt",
	gusts: "sensor.musterstadt_windboen",
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
}, dt = ["binary_sensor.flur_1_og_klimaanlage_filteralarm", "binary_sensor.klima_eg_filter_cleaning_reminder"], ft = {
	weather: "weather",
	alarm: "alarm",
	vacuum: "vacuum",
	front_door: "front_door",
	ac: "ac"
};
function F(e, t) {
	let n = e.entities?.[t];
	if (typeof n == "string" && n) return n;
	let r = ft[t], i = r ? e[r] : void 0;
	return typeof i == "string" && i ? i : ut[t];
}
function pt(e) {
	return e.entities?.filter_alarms ?? dt;
}
function mt(e) {
	let [t, n] = e.split(".");
	return [t, n];
}
// src/logic/util.ts
function I(e, t) {
	if (!t) return null;
	let n = e.states[t]?.state;
	if (n === void 0 || n === "" || n === "unknown" || n === "unavailable") return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function L(e, t) {
	return t ? e.states[t]?.state : void 0;
}
function R(e, t = 0) {
	return e.toLocaleString("de-DE", {
		minimumFractionDigits: t,
		maximumFractionDigits: t
	});
}
function z(e, t) {
	let n = e.entities[t];
	if (n) return n.area_id ? n.area_id : (n.device_id ? e.devices[n.device_id] : void 0)?.area_id ?? void 0;
}
function ht(e, t) {
	let n = e.entities[t], r = n?.device_id ? e.devices[n.device_id] : void 0;
	return r && (r.name_by_user || r.name) || void 0;
}
function B(e, t, n) {
	return n?.[t] ? n[t] : e.states[t]?.attributes.friendly_name ?? t.split(".")[1];
}
function gt(e, t, n) {
	let r = e.states[t]?.last_changed;
	return r ? Math.max(0, Math.floor((n.getTime() - new Date(r).getTime()) / 6e4)) : 0;
}
function _t(e) {
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
var xt = (e, t) => e.toDateString() === t.toDateString(), St = (e) => R(e, 1);
function Ct(e, t, n, r = /* @__PURE__ */ new Date()) {
	let i = e.states[F(t, "weather")], a = i?.attributes ?? {}, o = Number(a.temperature), s = n[0], c = s && xt(new Date(s.datetime), r) ? s : void 0, l = "";
	c?.temperature !== void 0 && (l = `heute ${c.templow === void 0 ? "" : `${Math.round(c.templow)}° – `}${Math.round(c.temperature)}°${c.precipitation ? ` · ${St(c.precipitation)} mm` : ""}`);
	let u = a.latest_update ? new Date(a.latest_update) : void 0, d = [/DWD|Deutscher Wetterdienst/.test(String(a.attribution ?? "")) ? "DWD" : "", u && !Number.isNaN(u.getTime()) ? `Stand ${u.getHours()} Uhr` : ""].filter(Boolean).join(" · "), f = [], p = (e) => a[e] !== void 0 && a[e] !== null && Number.isFinite(Number(a[e]));
	p("humidity") && f.push({
		key: "humidity",
		label: `Feuchte ${Math.round(a.humidity)} %`
	}), p("wind_speed") && f.push({
		key: "wind",
		label: `Wind ${Math.round(a.wind_speed)} ${a.wind_speed_unit ?? "km/h"}${p("wind_bearing") ? ` ${bt(Number(a.wind_bearing))}` : ""}`
	}), p("pressure") && f.push({
		key: "pressure",
		label: `${Math.round(a.pressure)} ${a.pressure_unit ?? "hPa"}`
	}), p("uv_index") && f.push({
		key: "uv",
		label: `UV ${Math.round(a.uv_index)}`
	}), p("visibility") && f.push({
		key: "visibility",
		label: `Sicht ${Math.round(a.visibility)} ${a.visibility_unit ?? "km"}`
	});
	let m = i?.state ?? "";
	return {
		temp: Number.isFinite(o) ? `${Math.round(o)}°` : "–",
		label: vt[m] ?? m,
		condition: m,
		today: l,
		source: d,
		chips: f
	};
}
function wt(e, t, n = 6, r = 2) {
	let i = new Date(t);
	return i.setMinutes(0, 0, 0), e.filter((e) => new Date(e.datetime).getTime() >= i.getTime()).filter((e, t) => t % r === 0).slice(0, n).map((e) => ({
		t: String(new Date(e.datetime).getHours()).padStart(2, "0"),
		temp: e.temperature === void 0 ? null : Math.round(e.temperature),
		rain: e.precipitation === void 0 ? "" : St(e.precipitation),
		condition: e.condition ?? ""
	}));
}
var Tt = (e) => Math.round(e * 100) / 100;
function Et(e, t = 7) {
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
			left: Tt((r[t] - i) / a * 100),
			width: Tt(Math.max((e.temperature - r[t]) / a * 100, 4))
		};
	});
}
function Dt(e, t) {
	let n = new Date(e.datetime), r = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime(), i = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1).getTime(), a = t.filter((e) => {
		let t = new Date(e.datetime).getTime();
		return t >= r && t < i;
	}), o = [];
	if (e.precipitation !== void 0 && o.push({
		key: "rain",
		label: `Regen ${St(e.precipitation)} mm`
	}), e.sun_duration !== void 0 && o.push({
		key: "sun",
		label: `Sonne ${R(e.sun_duration / 3600, 1)} h`
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
		start: r,
		end: i
	};
}
function Ot(e, t, n) {
	if (t !== null && t >= 60) return {
		title: "Jetzt stürmisch",
		text: `Böen bis ${Math.round(t)} km/h`
	};
	let r = e.find((e) => (e.wind_gust_speed ?? 0) >= 60);
	if (!r) return null;
	let i = new Date(r.datetime);
	return {
		title: `${xt(i, n) ? "Heute" : i.toLocaleDateString("de-DE", { weekday: "long" })} stürmisch`,
		text: `Böen bis ${Math.round(r.wind_gust_speed)} km/h${r.precipitation ? ` · ${St(r.precipitation)} mm Regen` : ""}`
	};
}
function kt(e, t) {
	let n = (t.pollen ?? Object.keys(e.states).filter((e) => e.startsWith("sensor.pollenflug_"))).map((t) => ({
		name: String(e.states[t]?.attributes.friendly_name ?? t.split(".")[1]),
		v: I(e, t)
	})).filter((e) => e.v !== null);
	if (!n.length) return null;
	let r = n.filter((e) => e.v > 0).sort((e, t) => t.v - e.v);
	return r.length ? {
		level: r[0].v,
		title: "Pollenflug",
		text: r.map((e) => `${e.name} ${R(e.v, e.v % 1 ? 1 : 0)}`).join(" · ")
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
	return Ln(e).map((t) => {
		let n = Ut(e, t.id).find((e) => e.startsWith("sensor.") && e.endsWith("_battery_type")), r = n ? L(e, n) : void 0, i = r && ![
			"unknown",
			"unavailable",
			""
		].includes(r);
		return {
			id: t.id,
			name: t.name,
			detail: i ? `${R(t.level)} % · ${r}` : `${R(t.level)} %`,
			reset: Wt(e, t.id, /_battery_replaced$/)
		};
	});
}
function Kt(e, t) {
	let n = [], r = (t) => ht(e, t) ?? B(e, t), i = (t) => Wt(e, t, RegExp(`filter.*(${Ht.source})|(${Ht.source}).*filter`));
	for (let a of pt(t)) L(e, a) === "on" && n.push({
		id: a,
		name: r(a),
		detail: "Filter reinigen",
		reset: i(a)
	});
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.endsWith("filter_life")) continue;
		let a = I(e, t);
		a !== null && a < Vt && n.push({
			id: t,
			name: r(t),
			detail: `Filter ${R(a)} %`,
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
	let n = e.states[F(t, "vacuum")], r = L(e, F(t, "vacuum_status")) ?? n?.state ?? "unavailable", i = I(e, F(t, "vacuum_battery")) ?? (Number.isFinite(Number(n?.attributes.battery_level)) ? Number(n.attributes.battery_level) : null), a = L(e, F(t, "vacuum_error")), o = n?.state === "error" || r === "error" || !!a && ![
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
	let n = F(t, "vacuum"), r = n.split(".")[1], i = [];
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.includes(r) || !t.endsWith("_minutes")) continue;
		let a = t.slice(7).replace(/^sensor_/, ""), o = Yt.find(([e]) => e.test(a)), s = o?.[1];
		if (!o || !s || i.some((e) => e.name === s)) continue;
		let c = I(e, t);
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
	let n = e.states[F(t, "vacuum_map")]?.attributes.options ?? Object.keys(Zt), r = t.vacuum_maps ?? Zt;
	return n.filter((e) => e !== "custom").map((e) => ({
		name: e,
		rooms: Object.entries(r[e] ?? {}).map(([e, t]) => ({
			segment: Number(e),
			name: t
		})).filter((e) => Number.isFinite(e.segment)).sort((e, t) => e.segment - t.segment)
	}));
}
function $t(e, t) {
	return (L(e, F(t, "vacuum_selection")) ?? "").split(",").map((e) => e.trim()).filter((e) => /^\d+$/.test(e)).map(Number);
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
];
function sn(e) {
	return e < 60 ? `${e} min` : `${Math.floor(e / 60)} h`;
}
function cn(e, t, n, r, i = {}) {
	let a = t.window ? e.states[t.window] : void 0, o = L(e, t.airing), s = {
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
	let d = I(e, F(n, "airing_duration")) ?? 15;
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
var ln = (e) => e.split(".").pop();
function un(e) {
	let t = {};
	for (let n of (e ?? "").split(";")) {
		let [e, r] = n.split("@"), i = parseInt(r ?? "", 36);
		e && Number.isFinite(i) && (t[e] = i * 6e4);
	}
	return t;
}
function dn(e, t, n) {
	return (e[ln(t)] ?? 0) > n;
}
function fn(e, t, n, r) {
	let i = ln(t), a = [[i, n], ...Object.entries(un(e)).filter(([e]) => e !== i)].filter(([, e]) => e > r).sort((e, t) => t[1] - e[1]).map(([e, t]) => `${e}@${Math.ceil(t / 6e4).toString(36)}`);
	for (; a.join(";").length > 255;) a.pop();
	return a.join(";");
}
function pn(e, t, n, r) {
	if (r === null || e.length < 4) return !1;
	let i = [...e].reverse().find((e) => e.t <= n) ?? e[0], a = e.filter((e) => e.t > n);
	if (!a.length || i.v - r < 3) return !1;
	let o = i.v - Math.min(...a.map((e) => e.v)), s = t.map((e) => e.v), c = s.length ? Math.max(...s) - Math.min(...s) : 0;
	return o < .3 && c < 3;
}
// src/logic/overview.ts
var mn = "dashboard_gerat", hn = 60, gn = 5, _n = 15, vn = 10;
function yn(e) {
	let t = e.getHours();
	return t >= 5 && t < 11 ? "Guten Morgen" : t >= 11 && t < 18 ? "Guten Tag" : t >= 18 && t < 23 ? "Guten Abend" : "Gute Nacht";
}
function bn(e) {
	return e.toLocaleDateString("de-DE", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
var xn = {
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
function Sn(e, t) {
	let n = e.states[t], r = n ? Number(n.attributes.temperature) : NaN;
	return {
		temp: Number.isFinite(r) ? `${R(Math.round(r))}°` : "–",
		label: n ? xn[n.state] ?? n.state : "Wetter",
		icon: A(n?.state ?? "")
	};
}
function Cn(e) {
	return {
		armed_away: k.car,
		armed_vacation: k.car,
		armed_home: k.home,
		armed_night: k.moon
	}[e] ?? k.shield;
}
var wn = {
	docked: "Dockt",
	cleaning: "Saugt",
	returning: "Fährt heim",
	paused: "Pause",
	idle: "Bereit",
	error: "Fehler",
	unavailable: "Offline"
}, Tn = {
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
function En(e) {
	let t = Object.keys(e.states).filter((t) => t.startsWith("light.") && !Array.isArray(e.states[t].attributes.entity_id) && !e.entities[t]?.hidden), n = t.filter((t) => e.entities[t]?.labels?.includes(mn));
	return n.length ? n : t;
}
function Dn(e) {
	return En(e).filter((t) => e.states[t].state === "on");
}
function On(e, t) {
	let n = I(e, F(t, "grid_import")) ?? 0, r = I(e, F(t, "grid_export")) ?? 0;
	return r > n && r > 0 ? {
		value: `${R(Math.round(r))} W`,
		label: "Einspeisung"
	} : {
		value: `${R(Math.round(n))} W`,
		label: "Netzbezug"
	};
}
function kn(e, t) {
	let n = L(e, F(t, "vacuum")) ?? "unavailable", r = L(e, F(t, "alarm")) ?? "unavailable", i = On(e, t);
	return [
		{
			key: "robby",
			value: n === "docked" && (Jt(e, t).battery ?? 0) >= 100 ? "Geladen" : wn[n] ?? n,
			label: "Robby",
			icon: k.vacuum,
			color: n === "error" ? "#ff453a" : "#ffffff"
		},
		{
			key: "light",
			value: `${Dn(e).length} an`,
			label: "Licht",
			icon: k.bulb,
			color: "#ffd60a"
		},
		{
			key: "energy",
			value: i.value,
			label: i.label,
			icon: k.bolt,
			color: i.label === "Einspeisung" ? "#30d158" : "#ff9f0a"
		},
		{
			key: "alarm",
			value: Tn[r] ?? r,
			label: "Alarm",
			icon: Cn(r),
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
var An = (e, t) => !!t && L(e, t) === "on";
function jn(e, t, n, r, i = [], a = (n) => cn(e, n, t, r)) {
	let o = [], s = e.states, c = F(t, "front_door");
	if (L(e, F(t, "alarm")) === "triggered" && o.push(H("alarm", "Alarm ausgelöst", "Jetzt prüfen", k.shield, V.red, "alarm")), An(e, c) && gt(e, c, r) >= gn && o.push(H("door", "Haustür offen", `seit ${_t(gt(e, c, r))}`, k.door, V.red, { moreInfo: c })), i.length) {
		let e = i.map((e) => `${e.name} +${R(e.rise, 1)}°`).join(" · ");
		o.push(H("heat", "Heizung prüfen", `${e} in ${i[0].hours} h ohne Heizbedarf`, k.thermo, V.orange, { room: i[0].slug }));
	}
	let l = Lt(e, t, r).filter((e) => e.current), u = I(e, F(t, "gusts"));
	if (l.length) {
		let [e, ...t] = l, n = [e.when, ...t.map((e) => `${e.title} ${e.when}`)].filter(Boolean).join(" · ");
		o.push(H("warn", `${e.level >= 3 ? "Unwetterwarnung" : "Warnung"}: ${e.title}`, n, k.storm, [e.color, `${e.color}44`], "weather"));
	} else u !== null && u >= hn && o.push(H("storm", "Sturmböen", `Böen bis ${R(Math.round(u))} km/h`, k.storm, V.purple, "weather"));
	let d = s[F(t, "airing_timer")];
	if (d && d.state === "active") {
		let i = $n(e, n, t, r), a = i.openWindows.map((e) => e.name), s = [`noch ${W(i.remaining)}`, a.length ? `${a.join(", ")} offen` : ""].filter(Boolean).join(" · ");
		o.push(H("airing", "Lüften läuft", s, k.wind, V.blue, "airing"));
	} else {
		let r = n.filter((t) => L(e, t.airing) === "Jetzt lüften");
		if (r.length) {
			let n = r.map((t) => {
				let n = I(e, t.humidity);
				return n === null ? t.name : `${t.name} ${R(Math.round(n))} %`;
			}), i = I(e, F(t, "airing_duration"));
			i !== null && n.push(`${R(Math.round(i))} min`), o.push(H("airing", "Jetzt lüften", n.join(" · "), k.wind, V.blue, "airing", {
				kind: "service",
				label: "Start",
				domain: mt(F(t, "airing_start"))[0],
				service: mt(F(t, "airing_start"))[1],
				data: {}
			}));
		}
	}
	let f = F(t, "window_snooze");
	for (let t of n) {
		if (!t.window || t.window === c) continue;
		let n = a(t);
		if (n.kind !== "overdue" && n.kind !== "stuck") continue;
		let i = s[f] ? {
			kind: "service",
			label: "1 h ignorieren",
			domain: "input_text",
			service: "set_value",
			target: { entity_id: f },
			data: { value: fn(s[f].state, t.window, r.getTime() + 36e5, r.getTime()) }
		} : void 0;
		if (n.kind === "overdue") o.push(H(`window:${t.slug}`, "Fenster schließen", `${t.name} · ${_t(n.openMin)} · ${n.reason}`, k.window, V.red, { room: t.slug }, i));
		else {
			let n = L(e, t.window) === "unavailable" ? "Sensor nicht erreichbar" : "meldet offen, Raum bleibt gleich";
			o.push(H(`sensor:${t.slug}`, "Fenstersensor prüfen", `${t.name} · ${n}`, k.window, V.grey, { room: t.slug }, i));
		}
	}
	for (let t of Object.keys(s).filter((e) => /^input_boolean\..+_fertig$/.test(e))) {
		if (s[t].state !== "on") continue;
		let n = B(e, t).replace(/\s*fertig$/i, "");
		o.push(H(t, `${n} fertig`, "Bitte ausräumen", k.washer, V.green, null, {
			kind: "service",
			label: "OK",
			domain: "input_boolean",
			service: "turn_off",
			data: {},
			target: { entity_id: t }
		}));
	}
	let p = F(t, "vacuum"), m = L(e, p), h = L(e, F(t, "vacuum_status"));
	if (m === "error" || h === "error") {
		let e = s[p]?.attributes.error ?? s[p]?.attributes.status ?? "Bitte prüfen";
		o.push(H("robby-error", "Robby: Fehler", String(e), k.vacuum, V.red, "robby"));
	}
	let g = Nn(e, p);
	g.length && o.push(H("robby-due", "Robby: Wartung fällig", `${Mn(g)} reinigen`, k.vacuum, V.orange, "robby"));
	let _ = Fn(e, t, r);
	_ && o.push(_);
	let v = In(e, t);
	v.length && o.push(H("filter", "Filter prüfen", v.join(" · "), k.filter, V.yellow, "care"));
	let y = Ln(e);
	return y.length && o.push(H("battery", y.length === 1 ? "Batterie schwach" : `${y.length} Batterien schwach`, y.map((e) => `${e.name} ${R(e.level)} %`).join(" · "), k.battery, V.orange, "care")), o;
}
function Mn(e) {
	return e.length <= 1 ? e.join("") : `${e.slice(0, -1).join(", ")} & ${e[e.length - 1]}`;
}
function Nn(e, t) {
	let n = t.split(".")[1], r = [
		[/filter/, "Filter"],
		[/sensor/, "Sensoren"],
		[/haupt/, "Hauptbürste"],
		[/seiten/, "Seitenbürste"]
	], i = [];
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.includes(n) || !t.endsWith("_minutes")) continue;
		let a = I(e, t);
		if (a === null || a > 0) continue;
		let o = t.slice(7).replace(/^sensor_/, ""), s = r.find(([e]) => e.test(o))?.[1] ?? B(e, t);
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
function Pn(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function Fn(e, t, n) {
	let r = F(t, "waste"), i = e.states[r];
	if (!i) return null;
	let a = Number(i.attributes.daysTo);
	if (!Number.isFinite(a) || a < 0 || a > 1) return null;
	let o = new Date(n);
	o.setDate(o.getDate() + a);
	let s = i.attributes[Pn(o)];
	return H("waste", a === 0 ? "Müll heute" : "Müll morgen", typeof s == "string" ? s : "Abfuhr", k.trash, V.green, { moreInfo: r });
}
function In(e, t) {
	let n = [];
	for (let r of pt(t)) L(e, r) === "on" && n.push(ht(e, r) ?? B(e, r));
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.endsWith("filter_life")) continue;
		let r = I(e, t);
		r !== null && r < vn && n.push(`${ht(e, t) ?? B(e, t)} ${R(r)} %`);
	}
	return n;
}
function Ln(e) {
	let t = [];
	for (let [n, r] of Object.entries(e.states)) {
		if (!n.startsWith("sensor.") || r.attributes.device_class !== "battery" || /robby|phone|iphone|handy|pixel|ipad|watch|_plus$/.test(n)) continue;
		let i = I(e, n);
		if (i === null || i >= _n) continue;
		let a = ht(e, n) ?? B(e, n).replace(/\s*(Batterie|Battery)$/i, "");
		t.push({
			id: n,
			name: a,
			level: i
		});
	}
	return t.sort((e, t) => e.level - t.level);
}
function Rn(e) {
	return e === null ? null : e <= 12 ? "#30d158" : e <= 35 ? "#ffd60a" : "#ff453a";
}
function zn(e, t, n = (t) => cn(e, t, {}, /* @__PURE__ */ new Date())) {
	return t.map((t) => {
		let r = I(e, t.temperature) ?? (t.climate ? Number(e.states[t.climate]?.attributes.current_temperature) : NaN), i = I(e, t.humidity), a = !!t.climate && e.states[t.climate]?.attributes.hvac_action === "heating", o = L(e, t.airing) === "Jetzt lüften", s = n(t);
		return {
			room: t,
			icon: Be(t.name, t.icon),
			temp: r !== null && Number.isFinite(r) ? R(r, 1) : "–",
			hum: i === null ? "–" : R(Math.round(i)),
			heating: a,
			vent: o,
			note: a && s.kind === "none" ? "heizt" : "",
			recommend: s.kind === "recommend",
			win: s,
			aq: t.pm25 ? Rn(I(e, t.pm25)) : null
		};
	});
}
var Bn = /* @__PURE__ */ new Set([
	"alarm",
	"door",
	"warn",
	"heat",
	"window",
	"sensor"
]);
function Vn(e) {
	let t = e.filter((e) => e.action || Bn.has(e.id.split(":")[0])), n = e.filter((e) => !t.includes(e));
	return [...t.map((e) => ({
		item: e,
		wide: !0
	})), ...n.map((e, t) => ({
		item: e,
		wide: n.length % 2 == 1 && t === n.length - 1
	}))];
}
// src/logic/climate.ts
var Hn = [
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
function Un(e) {
	let t = {};
	if (typeof e == "string") try {
		t = JSON.parse(e);
	} catch {
		t = {};
	}
	else e && typeof e == "object" && (t = e);
	let n = {};
	for (let e of Hn) {
		let r = Number(t[`${e.id}_temp`]);
		Number.isFinite(r) && r > 0 && (n[e.id] = r);
	}
	return n;
}
function Wn(e, t, n) {
	let r = t.climate ? e.states[t.climate] : void 0, i = r?.attributes ?? {}, a = I(e, t.temperature) ?? (Number.isFinite(Number(i.current_temperature)) ? Number(i.current_temperature) : null), o = I(e, t.humidity) ?? (Number.isFinite(Number(i.current_humidity)) ? Number(i.current_humidity) : null), s = o === null ? null : Math.round(o), c = n ?? (Number.isFinite(Number(i.temperature)) ? Number(i.temperature) : null), l = !r || r.state === "off" || r.state === "unavailable", u = !l && i.hvac_action === "heating", d = !!t.window && L(e, t.window) === "on", f = L(e, t.airing), p = f === "Jetzt lüften", m = p || d, h = t.pm25 ? I(e, t.pm25) : null, g = Number.isFinite(Number(i.valve_open_percent)) ? Math.round(Number(i.valve_open_percent)) : null;
	return {
		cur: a,
		target: c,
		hum: s,
		dew: I(e, `sensor.${t.slug}_taupunkt`),
		heating: u,
		vent: m,
		recommend: p,
		off: l,
		valve: g,
		preset: typeof i.preset_mode == "string" && i.preset_mode !== "none" ? i.preset_mode : null,
		presetTemps: Un(i.preset_temperatures),
		min: Number(i.min_temp) || 7,
		max: Number(i.max_temp) || 30,
		step: Number(i.target_temp_step) || .5,
		pm25: h,
		aq: t.pm25 ? Rn(h) : null,
		fanOn: !!t.purifier && L(e, t.purifier) === "on",
		windowOpen: d,
		airing: f,
		label: l ? "Aus" : d ? "lüftet" : u ? "heizt" : "Soll erreicht"
	};
}
function Gn(e, t, n, r, i = .5) {
	let a = Math.round((e + t) / i) * i;
	return Math.min(r, Math.max(n, Math.round(a * 10) / 10));
}
function U(e, t = 1) {
	return e === null ? "–" : R(e, t);
}
var Kn = {
	OG: "Obergeschoss",
	EG: "Erdgeschoss",
	UG: "Untergeschoss",
	DG: "Dachgeschoss",
	KG: "Keller"
};
function qn(e, t) {
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
			name: Kn[r] ?? r,
			rooms: n
		};
	});
}
function Jn(e, t) {
	let n = z(e, t);
	return n ? e.areas[n]?.floor_id ?? void 0 : void 0;
}
function Yn(e) {
	let t = e.filter((e) => e !== null);
	return t.length ? t.reduce((e, t) => e + t, 0) / t.length : null;
}
function Xn(e, t) {
	let n = t.map((t) => Wn(e, t)), r = n.filter((e) => e.heating).length, i = n.map((e) => e.pm25).filter((e) => e !== null), a = i.length ? Math.max(...i) : null, o = a === null ? "" : a <= 12 ? "Luft überall gut" : a <= 35 ? "Luft teils mäßig" : "Luft schlecht", s = r ? `${r} von ${t.length} Räumen heizen` : "Kein Raum heizt";
	return o ? `${s} · ${o}` : s;
}
function Zn(e, t, n) {
	let r = F(n, "weather"), i = I(e, F(n, "outdoor_temp")) ?? (Number(e.states[r]?.attributes.temperature) || null), a = e.states[r]?.attributes.humidity, o = Number.isFinite(Number(a)) ? Number(a) : null, s = I(e, F(n, "outdoor_dew")), c = Yn(t.map((t) => I(e, `sensor.${t.slug}_taupunkt`))), l = "";
	return s !== null && c !== null && (l = s < c - 1 ? "draußen trockener" : s > c + 1 ? "draußen feuchter" : "ähnlich feucht"), {
		title: [i === null ? "Außen" : `Außen ${R(i, 1)}°`, o === null ? "" : `${R(Math.round(o))} %`].filter(Boolean).join(" · "),
		sub: [s === null ? "" : `Taupunkt ${R(s, 1)}°`, l].filter(Boolean).join(" · "),
		minutes: I(e, F(n, "airing_duration"))
	};
}
function Qn(e) {
	if (typeof e != "string") return 0;
	let t = e.split(":").map(Number);
	return t.some((e) => !Number.isFinite(e)) ? 0 : t.reduce((e, t) => e * 60 + t, 0);
}
function $n(e, t, n, r) {
	let i = e.states[F(n, "airing_timer")], a = I(e, F(n, "airing_duration")), o = Qn(i?.attributes.duration) || (a ?? 15) * 60, s = a === null ? o : a * 60, c = i?.state === "active", l = i?.state === "paused";
	return c && i?.attributes.finishes_at ? s = Math.max(0, Math.round((new Date(i.attributes.finishes_at).getTime() - r.getTime()) / 1e3)) : l && (s = Qn(i?.attributes.remaining)), {
		active: c,
		paused: l,
		remaining: s,
		duration: c || l ? o : s,
		openWindows: t.filter((t) => t.window && L(e, t.window) === "on"),
		recommended: t.filter((t) => L(e, t.airing) === "Jetzt lüften")
	};
}
function W(e) {
	let t = Math.floor(e / 60), n = e % 60;
	return `${t}:${String(n).padStart(2, "0")}`;
}
function er(e, t) {
	let n = e.filter((e) => t.has(e.slug));
	return n.length === e.length ? "" : n.map((e) => e.climate?.replace(/^climate\.vtherm_/, "")).filter((e) => !!e && !e.includes(".")).join(",");
}
function tr(e, t, n, r) {
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
function nr(e, t, n, r, i, a, o) {
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
function rr(e, t) {
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
	return `${i} gelüftet: Feuchte ${a} → ${o} %${s !== void 0 && l !== null && s - l >= .5 ? `, Raum kurz auf ${R(l, 1)}° abgekühlt` : ""}.`;
}
function ir(e, t, n, r, i, a, o = {}) {
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
var ar = {
	"Jetzt lüften": "now",
	"Lüften möglich": "possible"
};
function or(e, t, n) {
	let r = [...e].sort((e, t) => e.lu - t.lu), i = [];
	return r.forEach((e, a) => {
		let o = ar[e.s];
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
var sr = /^sensor\.(.+)_luftung$/;
function cr(e, t) {
	return (t.rooms?.length ? t.rooms : lr(e)).map((t) => dr(e, t));
}
function lr(e) {
	return Object.keys(e.states).map((e) => sr.exec(e)?.[1]).filter((e) => !!e && !e.startsWith("aussen")).map((e) => ({ slug: e }));
}
function ur(e, t, n, r) {
	if (n.length) return Object.keys(e.states).find((i) => i.startsWith(t + ".") && n.includes(z(e, i) ?? "") && r(i));
}
function dr(e, t) {
	let n = e.states, r = t.areas?.length ? t.areas : e.areas[t.slug] ? [t.slug] : (() => {
		let n = z(e, `sensor.${t.slug}_temperature`);
		return n ? [n] : [];
	})(), i = (e) => n[e]?.attributes.device_class, a = t.climate ?? (n[`climate.vtherm_${t.slug}`] ? `climate.vtherm_${t.slug}` : void 0) ?? ur(e, "climate", r, () => !0), o = r[0] ? e.areas[r[0]] : void 0, s = t.name ?? o?.name ?? String(n[`sensor.${t.slug}_luftung`]?.attributes.friendly_name ?? t.slug).replace(/\s*Lüftung$/i, "");
	return {
		...t,
		name: s,
		areas: r,
		climate: a,
		floor: t.floor ?? o?.floor_id ?? void 0,
		pm25: t.pm25 ?? ur(e, "sensor", r, (e) => i(e) === "pm25"),
		purifier: t.purifier ?? ur(e, "fan", r, () => !0),
		window: t.window ?? ur(e, "binary_sensor", r, (e) => ["window", "opening"].includes(i(e))),
		temperature: `sensor.${t.slug}_temperature`,
		humidity: `sensor.${t.slug}_humidity`,
		airing: `sensor.${t.slug}_luftung`
	};
}
// src/styles.ts
var fr = o`
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
`;
// src/logic/click-guard.ts
function pr(e, t = 400) {
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
var mr = 500, hr = 10, gr = /* @__PURE__ */ new WeakMap(), _r;
function vr() {
	_r ??= pr(window), _r.arm();
	let e = () => {
		window.removeEventListener("pointerup", e, !0), window.removeEventListener("pointercancel", e, !0), _r.release();
	};
	window.addEventListener("pointerup", e, !0), window.addEventListener("pointercancel", e, !0);
}
function yr(e, t = "medium") {
	e.dispatchEvent(new CustomEvent("haptic", {
		detail: t,
		bubbles: !0,
		composed: !0
	}));
}
function br(e) {
	let t = () => gr.get(e), n = () => {
		window.clearTimeout(t().timer), t().timer = void 0;
	};
	e.addEventListener("pointerdown", (n) => {
		let r = t();
		r.held = !1, !(!r.opts.hold || n.button > 0) && (r.x = n.clientX, r.y = n.clientY, r.timer = window.setTimeout(() => {
			r.held = !0, r.timer = void 0, vr(), yr(e), r.opts.hold?.();
		}, mr));
	}), e.addEventListener("pointermove", (e) => {
		let r = t();
		r.timer && Math.hypot(e.clientX - r.x, e.clientY - r.y) > hr && n();
	}), e.addEventListener("pointerup", n), e.addEventListener("pointercancel", n), e.addEventListener("pointerleave", n), e.addEventListener("contextmenu", (e) => {
		t().opts.hold && e.preventDefault();
	}), e.addEventListener("click", (n) => {
		let r = t();
		r.held ? (r.held = !1, n.preventDefault(), n.stopPropagation()) : r.opts.tap && (yr(e, "light"), r.opts.tap());
	});
}
var xr = We(class extends Ge {
	constructor(e) {
		if (super(e), e.type !== Ue.ELEMENT) throw Error("hold() must be used as an element directive");
	}
	render(e) {
		return T;
	}
	update(e, [t]) {
		let n = e.element, r = gr.get(n);
		return r ? r.opts = t : (gr.set(n, {
			opts: t,
			held: !1,
			x: 0,
			y: 0
		}), br(n)), T;
	}
}), { I: Sr } = Pe, Cr = (e) => e, wr = () => document.createComment(""), Tr = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new Sr(r.insertBefore(wr(), i), r.insertBefore(wr(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = Cr(e).nextSibling;
				Cr(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, G = (e, t, n = e) => (e._$AI(t, n), e), Er = {}, Dr = (e, t = Er) => e._$AH = t, Or = (e) => e._$AH, kr = (e) => {
	e._$AR(), e._$AA.remove();
}, Ar = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, jr = We(class extends Ge {
	constructor(e) {
		if (super(e), e.type !== Ue.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = Or(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = G(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = G(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = G(i[d], a[m]), Tr(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = G(i[f], a[p]), Tr(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Ar(o, p, m), u = Ar(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = Tr(e, i[d]);
					G(t, a[p]), c[p] = t;
				} else c[p] = G(n, a[p]), Tr(e, i[d], n), i[t] = null;
				p++;
			} else kr(i[f]), f--;
		} else kr(i[d]), d++;
		for (; p <= m;) {
			let t = Tr(e, c[m + 1]);
			G(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && kr(e);
		}
		return this.ut = o, Dr(e, c), T;
	}
});
// src/logic/sheet-stack.ts
function Mr(e) {
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
function Nr(e) {
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
var Pr = "ha-start-dashboard-header";
function Fr(e) {
	return e === "hide" ? "\n      .header { display: none !important; }\n      #view { padding-top: 0 !important; min-height: 100vh !important; }" : e === "blend" ? "\n      .header { background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: none !important; border: none !important; }\n      #view { padding-top: 0 !important; }" : "";
}
function Ir(e) {
	let t = e;
	for (; t;) {
		if (t instanceof HTMLElement && t.tagName === "HUI-ROOT") return t;
		t = t.parentNode ?? (t instanceof ShadowRoot ? t.host : null);
	}
	return null;
}
function Lr(e, t) {
	let n = Ir(e), r = n?.shadowRoot;
	if (!n || !r) return !1;
	let i = n.lovelace?.editMode ? "" : Fr(t), a = r.getElementById(Pr);
	return i ? (a || (a = document.createElement("style"), a.id = Pr, r.appendChild(a)), a.textContent !== i && (a.textContent = i), !0) : (a?.remove(), !1);
}
function Rr(e) {
	Ir(e)?.shadowRoot?.getElementById(Pr)?.remove();
}
function zr(e) {
	return e.toLowerCase().split(/[\s&,.\-_]+/).filter((e) => e.length > 1);
}
function Br(e, t, n, r) {
	if (r?.[t]) return r[t];
	let i = B(e, t);
	if (!n) return i;
	let a = /* @__PURE__ */ new Set([
		...zr(n.name),
		...n.areas.flatMap((t) => zr(e.areas[t]?.name ?? t)),
		...zr(n.slug)
	]);
	return i.split(/\s+/).filter((e) => !a.has(e.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""))).join(" ").replace(/^[\s\-–·]+|[\s\-–·]+$/g, "") || i;
}
function Vr(e, t, n) {
	let r = e.entities[t];
	return r?.labels?.includes(n) ? !0 : !!(r?.device_id ? e.devices[r.device_id] : void 0)?.labels?.includes(n);
}
function Hr(e, t) {
	let n = e.states[t]?.attributes ?? {};
	return t.startsWith("light.") ? Yr(n).brightness ? "light" : "switch" : t.startsWith("fan.") ? Array.isArray(n.preset_modes) && n.preset_modes.length ? "purifier" : "switch" : t.startsWith("humidifier.") ? "dehumidifier" : "switch";
}
var Ur = /* @__PURE__ */ new WeakMap();
function Wr(e) {
	let t = Ur.get(e.entities);
	if (t) return t;
	let n = /* @__PURE__ */ new Map();
	for (let t of Object.values(e.entities)) t.device_id && t.entity_id.startsWith("sensor.") && /_power$/.test(t.entity_id) && (n.has(t.device_id) || n.set(t.device_id, []), n.get(t.device_id).push(t.entity_id));
	return Ur.set(e.entities, n), n;
}
function Gr(e, t) {
	let n = e.states[t]?.state;
	if (n === void 0 || n === "" || n === "unknown" || n === "unavailable") return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function Kr(e, t) {
	let n = e.entities[t]?.device_id, r = n ? (Wr(e).get(n) ?? []).filter((t) => e.states[t]) : [];
	if (!r.length) {
		let n = `sensor.${t.split(".")[1]}_power`;
		e.states[n] && (r = [n]);
	}
	if (!r.length) return null;
	let i = r.filter((e) => !/_device_power$/.test(e)), a = i.find((t) => Gr(e, t) !== null) ?? i[0] ?? r[0];
	return {
		id: a,
		value: Gr(e, a)
	};
}
function K(e) {
	return `${R(e, e > 0 && e < 10 && e % 1 ? 1 : 0)} W`;
}
function qr(e, t, n) {
	let r = e.states[t];
	if (!r || r.state === "unavailable" || r.state === "unknown") return "n. v.";
	if (r.state !== "on") return "Aus";
	let i = Number(r.attributes.brightness);
	return t.startsWith("light.") && r.attributes.brightness != null && Number.isFinite(i) ? `${Math.max(1, Math.round(i / 255 * 100))} %` : !t.startsWith("light.") && n?.value != null && n.value >= 1 ? K(n.value) : "An";
}
var Jr = [
	"hs",
	"xy",
	"rgb",
	"rgbw",
	"rgbww"
];
function Yr(e) {
	let t = Array.isArray(e.supported_color_modes) ? e.supported_color_modes : [], n = t.includes("color_temp");
	return {
		brightness: t.some((e) => e !== "onoff"),
		colorTemp: n ? {
			min: Number(e.min_color_temp_kelvin) || 2e3,
			max: Number(e.max_color_temp_kelvin) || 6500
		} : null,
		color: t.some((e) => Jr.includes(e)),
		effects: Array.isArray(e.effect_list) ? e.effect_list : []
	};
}
function Xr(e) {
	if (Jr.includes(e.color_mode)) return "farbig";
	if (e.color_mode !== "color_temp") return;
	let t = Number(e.color_temp_kelvin);
	if (Number.isFinite(t)) return t < 3300 ? "warmweiß" : t < 5e3 ? "neutralweiß" : "kaltweiß";
}
function Zr(e) {
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
function Qr(e, t) {
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
var $r = {
	manual: "Manuell",
	continuous: "Dauer",
	auto: "Auto",
	clothes_dry: "Wäsche",
	shoes_dry: "Schuhe"
};
function ei(e, t) {
	let n = e.states[t];
	if (!n || n.state === "unavailable" || n.state === "unknown") return "Nicht erreichbar";
	if (n.state !== "on") return "Aus";
	let r = n.attributes;
	return t.startsWith("light.") && Number.isFinite(Number(r.brightness)) ? `An · ${Math.round(Number(r.brightness) / 255 * 100)} %` : t.startsWith("fan.") && r.preset_mode ? `An · ${String(r.preset_mode).toLowerCase()}` : t.startsWith("humidifier.") && Number.isFinite(Number(r.humidity)) ? `An · ${r.humidity} %` : "An";
}
function ti(e, t, n) {
	let r = Object.keys(e.states).filter((n) => Vr(e, n, "dashboard_gerat") && t.areas.includes(z(e, n) ?? ""));
	return t.purifier && e.states[t.purifier] && !r.includes(t.purifier) && r.unshift(t.purifier), r.map((r) => {
		let i = r.split(".")[0], a = e.states[r]?.state, o = Kr(e, r);
		return {
			tileState: qr(e, r, o),
			power: o,
			sheet: Hr(e, r),
			id: r,
			name: Br(e, r, t, n),
			on: a === "on",
			unavailable: !a || a === "unavailable" || a === "unknown",
			status: ei(e, r),
			kind: [
				"light",
				"fan",
				"humidifier",
				"switch"
			].includes(i) ? i : "other"
		};
	});
}
function ni(e, t) {
	return Object.keys(e.states).filter((n) => n.startsWith("scene.") && t.areas.includes(z(e, n) ?? "")).map((n) => {
		let r = /_off$|_aus$/.test(n);
		return {
			id: n,
			name: r ? "Alles aus" : Br(e, n, t),
			icon: e.states[n].attributes.icon,
			off: r
		};
	}).sort((e, t) => Number(e.off) - Number(t.off));
}
var ri = 13;
function ii(e, t, n, r) {
	let i = /* @__PURE__ */ new Set(), a = (t) => Date.parse(e.states[t]?.state ?? "");
	for (let r of t) {
		let t = n[r];
		if (!t) continue;
		let a = Object.entries(t).filter(([t]) => e.states[t]);
		a.length > 0 && a.every(([t, n]) => {
			let r = e.states[t];
			if (n.state && r.state !== n.state) return !1;
			let i = Number(r.attributes.brightness);
			return n.state === "on" && n.brightness !== void 0 && Number.isFinite(i) ? Math.abs(i - n.brightness) <= ri : !0;
		}) && i.add(r);
	}
	let o = t.filter((e) => Number.isFinite(a(e)) && a(e) <= r.getTime()).sort((e, t) => a(t) - a(e))[0];
	if (o && !n[o]) {
		let t = e.states[o].attributes.entity_id ?? [], n = a(o) + 1e4;
		t.length && t.every((t) => !e.states[t] || Date.parse(e.states[t].last_changed) <= n) && i.add(o);
	}
	return i;
}
var ai = (e) => Math.round(Math.min(255, Math.max(0, e)));
function oi(e) {
	let t = e / 100, n = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -.1332047592, r = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * (t - 60) ** -.0755148492, i = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
	return [
		ai(n),
		ai(r),
		ai(i)
	];
}
function si(e, t) {
	let n = (n) => {
		let r = (n + e / 60) % 6;
		return 255 * (1 - t / 100 * Math.max(0, Math.min(r, 4 - r, 1)));
	};
	return [
		ai(n(5)),
		ai(n(3)),
		ai(n(1))
	];
}
function ci(e) {
	if (Jr.includes(e.color_mode)) return Array.isArray(e.rgb_color) && e.rgb_color.length === 3 ? e.rgb_color.map(Number) : Array.isArray(e.hs_color) ? si(Number(e.hs_color[0]), Number(e.hs_color[1])) : null;
	if (e.color_mode === "color_temp") {
		let t = Number(e.color_temp_kelvin);
		return Number.isFinite(t) && t > 0 ? oi(t) : null;
	}
	return null;
}
function li([e, t, n]) {
	let r = (.2126 * e + .7152 * t + .0722 * n) / 255;
	return {
		fill: `linear-gradient(90deg, rgba(${e},${t},${n},0.35), rgb(${e},${t},${n}))`,
		icon: r > .5 ? "#2b2200" : "#fff"
	};
}
function ui(e) {
	let t = ci(e);
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
		icon: li(t).icon === "#fff" ? "#fff" : "#151005"
	};
}
// src/logic/rooms-page.ts
var di = "raumverbrauch", fi = "raumverbrauch_ignorieren";
function pi(e, t, n) {
	let r = new Set(n.flatMap((e) => e.areas)), i = [];
	for (let [t, n] of Object.entries(e.entities)) {
		if (!e.states[t] || !mi(e, t, n.labels)) continue;
		let a = z(e, t);
		a && e.areas[a] && !r.has(a) && !i.includes(a) && i.push(a);
	}
	let a = [...n, ...i.map((t) => dr(e, {
		slug: t,
		areas: [t]
	}))], o = (t) => (t.floor ? e.floors?.[t.floor]?.level : void 0) ?? -Infinity;
	return a.map((e, t) => ({
		r: e,
		i: t
	})).sort((e, t) => o(t.r) - o(e.r) || e.i - t.i).map((e) => e.r).map((n) => {
		let r = ti(e, n, t.names), i = r.filter((e) => e.on).length, a = r.filter((e) => e.on && e.kind === "light").length, o = n.floor ? e.floors?.[n.floor]?.name ?? n.floor.toUpperCase() : void 0, s = r.length ? i ? `${i} von ${r.length} an` : "alles aus" : "keine Geräte";
		return {
			room: n,
			devices: r,
			scenes: ni(e, n),
			onCount: i,
			lightsOn: a,
			sub: o ? `${o} · ${s}` : s,
			active: a > 0,
			power: hi(e, n),
			floorShort: o
		};
	});
}
function mi(e, t, n) {
	if (n?.includes("dashboard_gerat")) return !0;
	let r = e.entities[t]?.device_id;
	return !!(r && e.devices[r]?.labels?.includes("dashboard_gerat"));
}
function hi(e, t) {
	let n = gi(e, t).map((t) => I(e, t)).filter((e) => e !== null);
	return n.length ? n.reduce((e, t) => e + t, 0) : null;
}
function gi(e, t) {
	let n = t.power;
	if (!n?.length) {
		let r = _i(e), i = `sensor.${t.slug}_leistung`;
		if (r.has(i)) n = [i];
		else {
			let e = [...t.areas, ...t.slug.split("_").filter((e) => e.length > 3)];
			n = [...new Set(e.map((e) => `sensor.${e}_leistung`).filter((e) => r.has(e)))];
		}
	}
	return n;
}
function _i(e) {
	let t = Object.keys(e.states).filter((e) => /^sensor\..+_leistung$/.test(e)), n = (t) => e.entities[t]?.labels ?? [], r = t.filter((e) => n(e).includes(di));
	return new Set((r.length ? r : t).filter((e) => !n(e).includes(fi)));
}
function vi(e) {
	let t = e.reduce((e, t) => e + t.lightsOn, 0), n = e.reduce((e, t) => e + t.onCount - t.lightsOn, 0);
	if (!t && !n) return "Alles aus";
	let r = [];
	return t && r.push(`${t} ${t === 1 ? "Licht" : "Lichter"}`), n && r.push(`${n} ${n === 1 ? "Gerät" : "Geräte"}`), `${r.join(" · ")} an`;
}
function yi(e, t) {
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
function bi(e, t) {
	return t === "all" ? e : t === "on" ? e.filter((e) => e.onCount > 0).map((e) => ({
		...e,
		devices: e.devices.filter((e) => e.on),
		scenes: e.scenes.filter((e) => e.off)
	})) : e.filter((e) => e.room.floor === t);
}
function xi(e, t) {
	let [n, r] = t.split(":").map(Number), i = new Date(e);
	i.setHours(n, r, 0, 0);
	let a = Math.round((i.getTime() - e.getTime()) / 6e4);
	return a <= 0 && (a += 1440), a;
}
// src/logic/energy.ts
var Si = (e) => e ?? 0;
function Ci(e) {
	let t = e.energy_sources ?? [], n = (e, n) => t.filter((t) => t.type === e && t[n]).map((e) => e[n]);
	return {
		solar: n("solar", "stat_energy_from"),
		import: n("grid", "stat_energy_from"),
		export: n("grid", "stat_energy_to"),
		solarRate: n("solar", "stat_rate")
	};
}
function wi(e) {
	let t = (e.energy_sources ?? []).filter((e) => e.type === "battery");
	return {
		batteryOut: t.filter((e) => e.stat_energy_from).map((e) => e.stat_energy_from),
		batteryIn: t.filter((e) => e.stat_energy_to).map((e) => e.stat_energy_to)
	};
}
function Ti(e) {
	let t = (e.energy_sources ?? []).filter((e) => e.type === "grid"), n = t.length === 1 ? t[0] : void 0;
	return {
		importPrice: n?.number_energy_price ?? null,
		exportPrice: n?.number_energy_price_export ?? null,
		costStats: t.filter((e) => e.stat_cost || e.stat_energy_from).map((e) => e.stat_cost || `${e.stat_energy_from}_cost`),
		compensationStats: t.filter((e) => e.stat_compensation || e.stat_energy_to).map((e) => e.stat_compensation || `${e.stat_energy_to}_compensation`)
	};
}
function Ei(e, t, n) {
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
function Di(e, t) {
	let n = [F(e, "pv_power"), ...t ? Ci(t).solarRate : []];
	return [...new Set(n)];
}
function q(e, t) {
	return t.reduce((t, n) => t + (e[n] ?? []).reduce((e, t) => e + (Number(t.change) || 0), 0), 0);
}
function Oi(e, t, n) {
	let r = Di(t, n).reduce((t, n) => t + Math.max(0, Si(I(e, n))), 0), i = Math.max(0, Si(I(e, F(t, "grid_import")))), a = Math.max(0, Si(I(e, F(t, "grid_export")))), o = I(e, F(t, "battery_power")), s = I(e, F(t, "battery_soc")), c = o !== null || s !== null ? {
		soc: s,
		power: Si(o)
	} : null;
	return {
		pv: r,
		house: I(e, F(t, "house_power")) ?? Math.max(0, r + i - a + Si(c?.power ?? null)),
		import: i,
		export: a,
		battery: c
	};
}
function ki(e) {
	let t = e.getHours();
	return t >= 5 && t < 11 ? "Morgen" : t >= 11 && t < 14 ? "Mittag" : t >= 14 && t < 18 ? "Nachmittag" : t >= 18 && t < 23 ? "Abend" : "Nacht";
}
function Ai(e, t) {
	let n;
	return n = t.pv > 50 && t.export > t.import ? "Sonne liefert, Überschuss geht ins Netz" : t.pv > 50 && t.import > 50 ? `PV deckt ${Math.min(99, Math.round(t.pv / Math.max(t.house, 1) * 100))} %, Rest aus dem Netz` : t.pv > 50 ? "PV deckt den Verbrauch" : (t.battery?.power ?? 0) > 50 && t.import < 50 ? "Akku versorgt das Haus" : "PV aus, Strom kommt aus dem Netz", `${ki(e)} · ${n}`;
}
function ji(e, t) {
	let n = I(e, t);
	return n === null ? 0 : e.states[t]?.attributes.unit_of_measurement === "Wh" ? n / 1e3 : n;
}
function Mi(e, t, n, r = 0, i = 0) {
	let a = (e) => Math.round(e * 1e3) / 1e3, o = a(Math.max(0, e + t + r - n - i));
	return {
		consumed: o,
		local: a(Math.max(0, o - t))
	};
}
function Ni(e, t, n) {
	let r = n ? n.pv : ji(e, F(t, "pv_today")), i = n ? n.import : ji(e, F(t, "import_today")), a = n ? n.export : ji(e, F(t, "export_today")), { consumed: o, local: s } = Mi(r, i, a, n?.batteryOut, n?.batteryIn);
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
var Pi = /_phase_|_poe_|standby/;
function Fi(e, t) {
	let n = I(e, t);
	return n === null ? null : Math.abs(e.states[t]?.attributes.unit_of_measurement === "kW" ? n * 1e3 : n);
}
function Ii(e, t, n = 6, r) {
	let i = new Set(t.exclude?.consumers ?? []), a = new Set([...[
		"grid_import",
		"grid_export",
		"battery_power",
		"house_power"
	].map((e) => F(t, e)), ...Di(t, r)].map((t) => e.entities[t]?.device_id).filter((e) => !!e)), o = /* @__PURE__ */ new Map();
	for (let t of Object.keys(e.states)) {
		if (!/^sensor\..+_power$/.test(t) || Pi.test(t) || i.has(t)) continue;
		let n = e.states[t].attributes;
		if (n.device_class !== "power" && !["W", "kW"].includes(n.unit_of_measurement)) continue;
		let r = e.entities[t];
		if (r?.platform && i.has(r.platform)) continue;
		let s = r?.labels ?? [];
		if (s.includes("raumverbrauch") || s.includes("raumverbrauch_ignorieren") || r?.device_id && a.has(r.device_id) || !z(e, t)) continue;
		let c = r?.device_id ?? t;
		o.has(c) || o.set(c, []), o.get(c).push(t);
	}
	let s = [];
	for (let [n, r] of o) {
		let i = r.filter((e) => !/_device_power$/.test(e)).find((t) => Fi(e, t) !== null) ?? r.find((t) => Fi(e, t) !== null);
		if (!i) continue;
		let a = Fi(e, i);
		if (a < 1) continue;
		let o = e.devices[n], c = t.names?.[i] || o?.name_by_user || o?.name || B(e, i).replace(/\s*(device\s+)?(power|leistung)$/i, "");
		s.push({
			id: i,
			name: c || i,
			value: a
		});
	}
	let c = F(t, "untracked_power"), l = Fi(e, c);
	return l !== null && l >= 1 && s.push({
		id: c,
		name: "Nicht erfasst",
		value: l,
		untracked: !0
	}), s.sort((e, t) => t.value - e.value).slice(0, n);
}
function Li(e, t) {
	let n = (e) => new Map(e.map((e) => [e.t, e.v])), r = n(t.import), i = n(t.export), a = n(t.pv), o = n(t.batteryOut ?? []), s = n(t.batteryIn ?? []), c = [.../* @__PURE__ */ new Set([
		...a.keys(),
		...r.keys(),
		...i.keys(),
		...o.keys(),
		...s.keys()
	])].sort((e, t) => e - t), l = (t, n, r, i, a) => {
		if (e === "selfuse") return t > .01 ? Math.max(0, t - r) / t : null;
		let { consumed: o, local: s } = Mi(t, n, r, i, a);
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
function Ri(e) {
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
			v: Mi(n, r, i, a, o).consumed
		};
	});
}
function zi(e, t) {
	return e.reduce((e, n) => e + n.v * t / 36e5 / 1e3, 0);
}
function Bi(e, t) {
	return e.soc === null || Math.abs(e.power) > 10 ? null : t?.reserve !== void 0 && e.soc <= t.reserve ? "Reserve" : e.soc >= (t?.full ?? 100) ? "voll" : null;
}
// src/data/series.ts
var J = 36e5, Vi = 24 * J, Hi = (e) => typeof e == "number" ? e : Date.parse(e);
function Ui(e, t = Date.now()) {
	if (e === "4h") {
		let e = 3e5, n = Math.ceil(t / e) * e;
		return {
			start: n - 4 * J,
			end: n,
			period: "5minute",
			step: e
		};
	}
	if (e === "24h") {
		let e = Math.ceil(t / J) * J;
		return {
			start: e - 24 * J,
			end: e,
			period: "hour",
			step: J
		};
	}
	let n = new Date(t);
	n.setHours(0, 0, 0, 0);
	let r = e === "7d" ? 7 : 30, i = n.getTime() + Vi;
	return {
		start: i - r * Vi,
		end: i,
		period: "day",
		step: Vi
	};
}
async function Wi(e, t, n) {
	let r = Ui(n), i = await e.callWS({
		type: "recorder/statistics_during_period",
		start_time: new Date(r.start).toISOString(),
		end_time: new Date(r.end).toISOString(),
		statistic_ids: t,
		period: r.period,
		types: ["change"],
		units: { energy: "kWh" }
	}), a = /* @__PURE__ */ new Map();
	for (let e of t) for (let t of i[e] ?? []) {
		let e = Hi(t.start);
		a.set(e, (a.get(e) ?? 0) + (Number(t.change) || 0));
	}
	let o = [];
	for (let e = r.start; e < r.end; e += r.step) o.push({
		t: e,
		v: Math.max(0, a.get(e) ?? 0)
	});
	return {
		past: o,
		start: r.start,
		end: r.end,
		step: r.step
	};
}
async function Gi(e, t, n, r) {
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
	], [o, s, c, l, u] = await Promise.all(a.map((t) => t.length ? Wi(e, t, n) : i())), d = [
		o,
		s,
		c
	].find((e) => e.start) ?? o, f = Li(r, {
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
async function Ki(e, t, n) {
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
	].map((t) => t.length ? Wi(e, t, n) : r())), l = [
		i,
		a,
		o
	].find((e) => e.start) ?? i;
	return {
		past: Ri({
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
async function qi(e, t, n) {
	let r = Date.now(), i = n === "24h" ? J / 2 : J, a = Math.ceil(r / i) * i, o = a - (n === "24h" ? 1 : n === "3d" ? 3 : 7) * Vi, s = [
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
		past: tr(l(t.room), o, a, i),
		compare: t.outdoor ? tr(l(t.outdoor), o, a, i) : void 0,
		bands: t.airing ? or(c[t.airing] ?? [], o, r) : void 0,
		start: o,
		end: a
	};
}
async function Ji(e, t, n) {
	let r = Ui(n);
	return {
		past: ((await e.callWS({
			type: "recorder/statistics_during_period",
			start_time: new Date(r.start).toISOString(),
			end_time: new Date(r.end).toISOString(),
			statistic_ids: [t],
			period: r.period,
			types: ["mean"]
		}))[t] ?? []).map((e) => ({
			t: Hi(e.start),
			v: Math.abs(Number(e.mean))
		})).filter((e) => Number.isFinite(e.v)),
		start: r.start,
		end: r.end,
		step: r.step
	};
}
async function Yi(e, t, n) {
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
	], s = await e.callWS({
		type: "recorder/statistics_during_period",
		start_time: r.toISOString(),
		statistic_ids: o,
		period: "hour",
		types: ["change"],
		units: { energy: "kWh" }
	});
	return {
		pv: q(s, t.solar),
		import: q(s, t.import),
		export: q(s, t.export),
		batteryOut: q(s, t.batteryOut),
		batteryIn: q(s, t.batteryIn),
		...i.some((e) => s[e]) ? {
			cost: q(s, i),
			compensation: q(s, a)
		} : {}
	};
}
async function Xi(e, t, n, r) {
	let i = async (t, n, i) => {
		if (n !== null) {
			let i = await Wi(e, t, r);
			return {
				...i,
				past: i.past.map((e) => ({
					t: e.t,
					v: e.v * n
				}))
			};
		}
		return Wi(e, i, r);
	}, [a, o] = await Promise.all([i(n.import, t.importPrice, t.costStats), n.export.length || t.compensationStats.length ? i(n.export, t.exportPrice, t.compensationStats) : Promise.resolve({ past: [] })]), s = Math.round(o.past.reduce((e, t) => e + t.v, 0) * 100) / 100;
	return {
		...a,
		total: s
	};
}
async function Zi(e, t, n, r) {
	let i = Date.now(), a = Math.floor((i - 24 * J) / J) * J, o = a + 48 * J, { past: s, future: c } = zt(n, (await e.callWS({
		type: "history/history_during_period",
		start_time: new Date(a).toISOString(),
		end_time: new Date(i).toISOString(),
		entity_ids: [t],
		minimal_response: !1,
		no_attributes: !1,
		significant_changes_only: !1
	}))[t] ?? [], r), l = tr(s, a, i, J), u = s.length ? [{
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
// src/logic/heating-check.ts
var Qi = {
	hours: 2,
	min_rise: 1,
	max_power: 150,
	max_pv: 300,
	max_hum_rise: 10
}, $i = 6;
function ea(e, t, n = {}) {
	let r = {
		...Qi,
		...n
	}, i = (e) => t > r.max_pv && (!r.sunny || r.sunny.includes(e)), a = [];
	for (let t of e) {
		if (i(t.slug) || t.temps.length < $i || t.heated || t.windowOpened || t.power > r.max_power || !t.off && (t.cur === null || t.target === null || t.cur <= t.target)) continue;
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
function ta(e) {
	return e.some((e) => e.a?.hvac_action === "heating");
}
function na(e) {
	return e.some((e) => e.s === "on");
}
// src/data/heating-check.ts
var ra = 36e5, ia = ra;
function aa(e, t) {
	let n = `sensor.${t.split(".")[1]}_power_percent`;
	return e.states[n] ? n : void 0;
}
async function oa(e, t, n, r = {}, i = Date.now()) {
	let a = {
		...Qi,
		...r
	}, o = t.filter((t) => t.climate && e.states[t.temperature]);
	if (!o.length) return [];
	let s = i - a.hours * ra, c = new Map(o.map((t) => [t.slug, gi(e, t)])), l = new Map(o.map((t) => [t.slug, aa(e, t.climate)])), u = [...new Set([...o.flatMap((e) => [
		e.temperature,
		e.humidity,
		...c.get(e.slug),
		l.get(e.slug) ?? ""
	]), ...n].filter((t) => t && e.states[t]))], d = o.flatMap((e) => e.window ? [e.window] : []), f = o.filter((e) => !l.get(e.slug)).map((e) => e.climate), p = (t, n) => t.length ? e.callWS({
		type: "history/history_during_period",
		start_time: (/* @__PURE__ */ new Date(s - ia)).toISOString(),
		end_time: new Date(i).toISOString(),
		entity_ids: t,
		...n ? { significant_changes_only: !1 } : {
			minimal_response: !0,
			no_attributes: !0
		}
	}) : Promise.resolve({}), [m, h, g] = await Promise.all([
		e.callWS({
			type: "recorder/statistics_during_period",
			start_time: (/* @__PURE__ */ new Date(s - ia)).toISOString(),
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
	}, ee = (e) => _(e, s - ia).some((e) => Number(e.max ?? e.mean) > 0), te = n.reduce((e, t) => e + Math.max(0, y(t)), 0);
	return ea(o.map((t) => {
		let n = Wn(e, t), r = l.get(t.slug);
		return {
			slug: t.slug,
			name: t.name,
			temps: v(t.temperature),
			hums: v(t.humidity),
			power: c.get(t.slug).reduce((e, t) => e + Math.max(0, y(t)), 0),
			heated: n.heating || (r ? ee(r) : ta(g[t.climate] ?? [])),
			windowOpened: n.windowOpen || !!t.window && na(h[t.window] ?? []),
			off: n.off,
			cur: n.cur,
			target: n.target
		};
	}), te, a);
}
// src/data/window-check.ts
var sa = 9e5, ca = 216e5;
function la(e, t, n) {
	return t.filter((t) => {
		let r = t.window ? e.states[t.window] : void 0;
		return r?.state === "on" && n - new Date(r.last_changed).getTime() >= 18e5;
	});
}
async function ua(e, t, n, r = Date.now()) {
	let i = la(e, t, r), a = I(e, F(n, "outdoor_temp"));
	if (!i.length || a === null) return [];
	let o = (t) => new Date(e.states[t.window].last_changed).getTime(), s = Math.max(Math.min(...i.map(o)) - sa, r - ca), c = await e.callWS({
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
		return pn(l(e.temperature, t - sa), l(e.humidity, t - sa).filter((e) => e.t > t), t, a);
	}).map((e) => e.slug);
}
// src/pages/climate.ts
function da(e) {
	let t = (e, t, n, r, i = "", a = 11) => C`<span class="winchip ${i}" style="background:${n}" title=${r} aria-label=${r}>${N(e, a, t, 2.6)}</span>`;
	switch (e.kind) {
		case "recommend": return t(k.wind, "#5ac8fa", "rgba(90,200,250,0.2)", "Lüften empfohlen", "", 12);
		case "airing": return t(k.window, "#5ac8fa", "rgba(90,200,250,0.2)", "Lüftet");
		case "overdue": return t(k.window, "#ff6b61", "rgba(255,69,58,0.24)", `Fenster offen seit ${e.openMin} min · ${e.reason}`);
		case "stuck": return t(k.window, "#aeb4c0", "transparent", "Fenstersensor prüfen", "doubt");
		case "open": return t(k.window, "#aeb4c0", "rgba(255,255,255,0.1)", "Fenster offen (ignoriert)");
		default: return E;
	}
}
function fa(e) {
	switch (e.kind) {
		case "airing": return e.remaining > 0 ? `lüftet ${W(e.remaining)}` : "lüftet";
		case "overdue": return `offen ${sn(e.openMin)}`;
		case "stuck": return "Sensor?";
		case "open": return "offen";
		default: return null;
	}
}
function pa(e, t) {
	let n = Wn(e.hass, t, e.target(t.climate)), r = e.window(t), i = r.kind === "overdue" ? "alert" : n.heating ? "heat" : n.vent ? "vent" : "", a = t.climate, o = e.heating().find((e) => e.slug === t.slug);
	return C`
    <div class="kroom ${i}">
      <button class="kroom-main" @click=${() => e.openSheet({
		id: "room",
		slug: t.slug
	})}>
        <span class="circle kroom-circle">${N(Be(t.name, t.icon), 19, i ? "#141008" : "#fff", 2)}</span>
        <span class="kroom-text">
          <span class="kroom-name">
            <span class="ellipsis">${t.name}</span>
            ${n.aq || n.fanOn ? C`<span class="aqchip" title=${n.pm25 === null ? "Luftreiniger an" : `PM2.5 ${R(n.pm25)} µg/m³`}
                  style="background:${n.aq ? n.aq + "2e" : "rgba(48,209,88,0.18)"}">
                  ${n.aq ? C`<span class="dot" style="width:6px;height:6px;background:${n.aq}"></span>` : E}
                  ${n.fanOn ? N(j.fan, 11, "#7ee8a0", 2.6) : E}
                </span>` : E}
            ${da(r)}
            ${o ? C`<span class="heatchip" title="Heizung prüfen: +${R(o.rise, 1)}° in ${o.hours} h ohne Heizbedarf"
                  aria-label="Heizung prüfen">${N(k.thermo, 11, "#ff9f0a", 2.6)}!</span>` : E}
          </span>
          <span class="kroom-sub">${U(n.cur)}° · ${n.hum ?? "–"} % · ${fa(r) ?? n.label}</span>
        </span>
      </button>
      ${a ? C`<span class="stepper">
            <button class="step" aria-label="Soll senken" @click=${() => e.stepTarget(a, -.5)}>−</button>
            <span class="target">${U(n.target)}°</span>
            <button class="step" aria-label="Soll erhöhen" @click=${() => e.stepTarget(a, .5)}>+</button>
          </span>` : E}
    </div>
  `;
}
var ma = [
	{
		mode: "cool",
		name: "Kühlen",
		icon: j.snowflake,
		stroke: "#8fd8ff"
	},
	{
		mode: "dry",
		name: "Trocknen",
		icon: j.drop,
		stroke: "#fff"
	},
	{
		mode: "off",
		name: "Aus",
		icon: j.power,
		stroke: "#fff"
	}
], ha = {
	off: "Aus",
	cool: "Kühlt",
	dry: "Trocknet",
	heat: "Heizt",
	fan_only: "Lüfter",
	auto: "Auto",
	heat_cool: "Auto"
};
function ga(e, t) {
	let n = e.hass.states[t];
	if (!n) return E;
	let r = n.attributes, i = [
		ha[n.state] ?? n.state,
		r.current_temperature == null ? "" : `${R(Number(r.current_temperature), 1)}° innen`,
		r.temperature == null ? "" : `Soll ${R(Number(r.temperature), 1)}°`
	].filter(Boolean).join(" · ");
	return C`
    <div class="ac">
      <button class="ac-main" aria-label="Klimaanlage öffnen" @click=${() => e.openSheet({ id: "ac" })}>
        <span class="circle" style="width:44px;height:44px;background:rgba(100,210,255,0.18)">${N(j.snowflake, 19, "#8fd8ff", 2)}</span>
        <span><span class="t1">Klimaanlage</span><span class="t2">${i}</span></span>
      </button>
      <span class="ac-modes">
        ${ma.map((r) => {
		let i = n.state === r.mode;
		return C`<button class="ac-mode ${i ? "active" : ""}" aria-label=${r.name} title=${r.name} aria-pressed=${i}
            @click=${() => e.call("climate", "set_hvac_mode", { hvac_mode: r.mode }, { entity_id: t })}>
            ${N(r.icon, 16, i ? "#101218" : r.stroke, 2.2)}</button>`;
	})}
      </span>
    </div>
  `;
}
function _a(e, t, n, r) {
	let i = Yn(t.rooms.map((t) => Wn(e.hass, t).cur));
	return C`
    <section class="section">
      <div class="section-head" style="margin-top:8px">
        <h2>${t.name}</h2>
        <span class="rule" aria-hidden="true"></span>
        <span class="meta">${i === null ? "" : `Ø ${R(i, 1)}°`}</span>
      </div>
      ${t.rooms.map((t) => pa(e, t))}
      ${r === t.id ? ga(e, n) : E}
    </section>
  `;
}
function va(e) {
	let { hass: t, rooms: n } = e, r = F(e.config, "heating"), i = L(t, r) === "on", a = Zn(t, n, e.config), o = F(e.config, "ac"), s = t.states[o] ? Jn(t, o) : void 0, c = qn(t, n), l = t.states[F(e.config, "weather")]?.state ?? "", u = $n(t, n, e.config, e.now);
	return C`
    <div class="climate">
      <header class="khead">
        <div>
          <div class="date">${Xn(t, n)}</div>
          <h1>Klima</h1>
        </div>
        ${t.states[r] ? C`<button class="heat-toggle ${i ? "on" : ""}" aria-pressed=${i}
              aria-label="Zentralheizung ${i ? "an" : "aus"}" title="Zentralheizung"
              @click=${() => e.call("input_boolean", "toggle", {}, { entity_id: r })}>
              <span class="track"><span class="knob">${N(j.flame, 14, i ? "#ff9f0a" : "#888", 2.6)}</span></span>
            </button>` : E}
      </header>

      <button class="pill outdoor" @click=${() => e.openSheet({ id: "airing" })}>
        <span class="circle" style="width:44px;height:44px;background:rgba(143,208,255,0.2)">${N(A(l), 20, "#8fd0ff", 2)}</span>
        <span class="grow"><span class="t1">${a.title}</span><span class="t2">${a.sub}</span></span>
        ${u.active ? C`<span class="air-badge running" aria-label="Lüften läuft, noch ${W(u.remaining)}">${N(k.wind, 14, "#06202c", 2.4)}${W(u.remaining)}</span>` : a.minutes === null ? E : C`<span class="air-badge">${N(k.wind, 14, "#06202c", 2.4)}${R(Math.round(a.minutes))} min</span>`}
      </button>

      <div class="pill allrooms">
        <span class="grow" style="font-size:14px;font-weight:600">Alle Räume</span>
        ${Hn.map((t) => C`
          <button class="preset" style="background:${t.color}" aria-label="Alle auf ${t.name}" title=${t.name}
            @click=${() => e.runScript(F(e.config, "preset_all"), { preset: t.id })}>
            ${N(Ve[t.id], 18, "#101010", 2.3)}
          </button>`)}
        <button class="preset" style="background:#fff" aria-label="Temperatur für alle Räume einstellen"
          @click=${() => e.openSheet({ id: "allRooms" })}>${N(j.tune, 18, "#101218", 2.3)}</button>
      </div>

      ${c.map((t) => _a(e, t, o, s))}
    </div>
  `;
}
var ya = o`
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
// src/pages/overview.ts
function ba(e, t) {
	let { config: n } = e;
	switch (t.key) {
		case "robby": return {
			tap: () => e.openSheet({ id: "robby" }),
			hold: () => e.confirm({
				title: "Robby",
				text: "EG jetzt saugen?",
				confirm: "Starten",
				color: "#ffffff",
				iconPath: k.vacuum,
				onConfirm: () => e.call("button", "press", {}, { entity_id: F(n, "vacuum_quick") })
			})
		};
		case "light": return {
			tap: () => e.go("rooms", { roomsFilter: "on" }),
			hold: () => {
				let t = Dn(e.hass);
				t.length && e.confirm({
					title: "Licht",
					text: `Alle ${t.length} Lichter ausschalten?`,
					confirm: "Alle aus",
					color: "#ffd60a",
					iconPath: k.bulb,
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
				iconPath: k.shield,
				onConfirm: () => e.call("alarm_control_panel", "alarm_arm_away", {}, { entity_id: F(n, "alarm") })
			})
		};
	}
}
function xa(e) {
	let t = (e, t, n, r = "") => C`<span class="room-air" style="color:${t}" title=${n} aria-label=${n}>${N(e, 13, t, 2.4)}${r}</span>`;
	switch (e.kind) {
		case "recommend": return t(k.wind, "#5ac8fa", "Lüften empfohlen");
		case "airing": return t(k.window, "#5ac8fa", "Lüftet", e.remaining > 0 ? W(e.remaining) : "");
		case "overdue": return t(k.window, "#ff6b61", `Fenster offen seit ${e.openMin} min`, e.openMin < 60 ? `${e.openMin}′` : sn(e.openMin));
		case "stuck": return t(k.window, "#aeb4c0", "Fenstersensor prüfen", "?");
		case "open": return t(k.window, "#aeb4c0", "Fenster offen");
		default: return E;
	}
}
function Sa(e, t) {
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
		}
	}
}
function Ca(e, t, n = !0) {
	let r = Sa(e, t), i = t.action;
	return C`
    <div class="now ${n ? "wide" : ""}" style="background: linear-gradient(90deg, ${t.tint}, rgba(255,255,255,0.05) ${n ? 75 : 100}%)">
      <button class="now-main" ?disabled=${!r} @click=${() => r?.()}>
        <span class="circle" style="width:34px;height:34px;background:${t.color}">${N(t.icon, 16, "#101010")}</span>
        <span class="now-text">
          <span class="now-title ellipsis">${t.title}</span>
          <span class="now-sub ellipsis">${t.text}</span>
        </span>
      </button>
      ${i ? C`<button class="now-action" style="background:${t.color}"
            @click=${() => e.call(i.domain, i.service, i.data, i.target)}>${i.label}</button>` : E}
    </div>
  `;
}
function wa(e) {
	let { hass: t, config: n, now: r } = e, i = Sn(t, F(n, "weather")), a = kn(t, n), o = jn(t, n, e.rooms, r, e.heating(), (t) => e.window(t)), s = zn(t, e.rooms, (t) => e.window(t));
	return C`
    <div class="overview">
      <header class="head">
        <div>
          <div class="date">${bn(r)}</div>
          <h1>${yn(r)}</h1>
        </div>
        <button class="weather" aria-label="Wetter öffnen" @click=${() => e.openSheet({ id: "weather" })}>
          <span class="circle" style="width:40px;height:40px;background:rgba(143,208,255,0.2)">${N(i.icon, 20, "#8fd0ff", 2)}</span>
          <span>
            <span class="wp-temp">${i.temp}</span>
            <span class="wp-label">${i.label}</span>
          </span>
        </button>
      </header>

      <div class="status">
        ${a.map((t) => C`
          <button class="bubble" aria-label="${t.label}: ${t.value}" ${xr(ba(e, t))}>
            <span class="circle" style="width:34px;height:34px;background:${t.color}">${N(t.icon, 17, "#111")}</span>
            <span class="b-value ellipsis">${t.value}</span>
            <span class="b-label ellipsis">${t.label}</span>
          </button>
        `)}
      </div>

      <section class="section" aria-labelledby="now-h">
        <div class="section-head">
          <h2 id="now-h">Aktuell</h2>
          <span class="rule" aria-hidden="true"></span>
          <span class="meta">${o.length || ""}</span>
        </div>
        ${o.length ? C`<div class="now-grid">${Vn(o).map((t) => Ca(e, t.item, t.wide))}</div>` : C`
            <div class="now calm wide">
              <span class="circle" style="width:34px;height:34px;background:#30d158">${N(k.check, 16, "#101010", 2.4)}</span>
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
          ${s.some((e) => e.aq) ? C`<span class="meta" style="font-size:11px">
                <span class="dot" style="background:#30d158"></span><span class="dot" style="background:#ffd60a"></span><span class="dot" style="background:#ff453a;margin-right:3px"></span>Luftqualität
              </span>` : E}
        </div>
        <div class="sum-grid">
          ${s.map((t) => {
		let n = t.win.kind === "overdue" ? "alert" : t.vent || t.win.kind === "airing" ? "vent" : t.heating ? "heat" : "";
		return C`
              <button class="room ${n}" @click=${() => e.openSheet({
			id: "room",
			slug: t.room.slug
		})}
                aria-label="${t.room.name}: ${t.temp} Grad, ${t.hum} Prozent">
                <span class="circle room-circle">${N(t.icon, 16, n ? "#141008" : "#fff", 2)}</span>
                <span class="room-text">
                  <span class="room-name"><span class="ellipsis">${t.room.name}</span>${t.aq ? C`<span class="dot" style="background:${t.aq}"></span>` : E}</span>
                  <span class="room-sub">${t.hum} %${t.note ? ` · ${t.note}` : ""}${xa(t.win)}</span>
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
var Ta = o`
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
`, Ea, Da = class extends Re {
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
Ea = Da, Ea.properties = {
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
}, Ea.styles = o`
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
  `, customElements.get("start-dashboard-slider") || customElements.define("start-dashboard-slider", Da);
// src/sheets/device.ts
var Oa = "#ffd60a", ka = "#30d158", Aa = "#5ac8fa", ja = [
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
function Ma(e, t) {
	let n = e.hass.states[t]?.state;
	n && n !== "unavailable" && n !== "unknown" && (t.startsWith("light.") ? e.call("light", "toggle", {}, { entity_id: t }) : e.call("homeassistant", "toggle", {}, { entity_id: t }));
}
function Na(e, t) {
	let n = z(e.hass, t);
	return n ? e.rooms.find((e) => e.areas.includes(n)) : void 0;
}
function Pa(e, t, n) {
	if (n) return n.name;
	let r = z(e.hass, t);
	return r ? e.hass.areas[r]?.name ?? r : "";
}
function Fa(e, t, n, r, i) {
	return C`<button class="tgl ${n ? "on" : ""}" aria-pressed=${n} aria-label="${i} ein/aus"
    style=${n ? `background:${r}` : ""} @click=${() => Ma(e, t)}><span></span></button>`;
}
function Ia(e, t, n) {
	if (!e.hass.states[t]) return E;
	switch (Hr(e.hass, t)) {
		case "light": return Ra(e, t);
		case "purifier": return Va(e, t);
		case "dehumidifier": return Ha(e, t);
		default: return Ba(e, t, n ?? {
			id: "device",
			entity: t
		});
	}
}
var La = "linear-gradient(90deg, rgba(255,214,10,0.35), #ffe37a)";
function Ra(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = r.state === "on", o = Na(e, t), s = Br(n, t, o, e.config.names), c = Yr(i), l = a ? Math.max(1, Math.round(Number(i.brightness) / 255 * 100) || 100) : 0, u = a ? Xr(i) : void 0, d = a ? ci(i) : null, f = d ? li(d) : {
		fill: La,
		icon: "#2b2200"
	}, p = c.colorTemp, m = Number(i.color_temp_kelvin), h = (n) => e.call("light", "turn_on", n, { entity_id: t });
	return P({
		title: s,
		subtitle: [Pa(e, t, o), a ? u ?? "an" : r.state === "off" ? "aus" : "nicht erreichbar"].filter(Boolean).join(" · "),
		color: a ? Oa : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#2b2200" : "#fff",
		glow: a ? "rgba(255,240,200,0.18)" : "rgba(255,255,255,0.05)",
		iconPath: He(t, s),
		headerExtra: Fa(e, t, a, Oa, s),
		onClose: e.closeSheet,
		body: C`
      <start-dashboard-slider variant="bubble" label="Helligkeit" .min=${0} .max=${100} .step=${1} .value=${l}
        .fill=${f.fill} .format=${(e) => `${e} %`}
        @slide-change=${(n) => n.detail.value <= 0 ? e.call("light", "turn_off", {}, { entity_id: t }) : h({ brightness_pct: n.detail.value })}>
        ${N(M.brightness, 22, l > 8 ? f.icon : "#fff", 2.2)}
      </start-dashboard-slider>

      ${p ? C`<div>
            <start-dashboard-slider variant="knob" label="Farbtemperatur" .min=${p.min} .max=${p.max} .step=${50}
              .value=${Number.isFinite(m) ? m : Math.round((p.min + p.max) / 2)}
              .track=${"linear-gradient(90deg, #ffa94d, #fff1d6 50%, #d6ecff)"}
              .format=${(e) => `${R(e)} K`}
              @slide-change=${(e) => h({ color_temp_kelvin: e.detail.value })}></start-dashboard-slider>
            <div class="ends"><span>warm ${R(p.min)} K</span><span>kalt ${R(p.max)} K</span></div>
          </div>` : E}

      ${c.color ? C`<div>
            <div class="sublabel">Farbe</div>
            <div class="swatches">
              ${ja.map(([e, t, n]) => C`<button class="swatch" aria-label=${e} style="background:${t}" @click=${() => h({ hs_color: n })}></button>`)}
            </div>
          </div>` : E}

      ${c.brightness ? C`<div class="grid3">
            ${Zr(c).map((e) => C`<button class="dchip" @click=${() => h(e.data)}>${e.name}</button>`)}
          </div>` : E}
    `
	});
}
function za(e, t, n) {
	let r = e.hass.states[t]?.state === "on", i = e.ui.timeInput === t, a = e.ui.offAt, o = (n) => {
		e.runScript(F(e.config, "delayed_off"), {
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
            @click=${() => e.ui.timeValue && o(xi(e.now, e.ui.timeValue))}>Starten</button>
        </div>` : E}
    ${s && r ? C`<div class="hint">${N(j.clock, 13, "rgba(255,255,255,0.6)", 2.2)}Schaltet um
          ${s.toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	})} Uhr aus</div>` : E}
  `;
}
function Ba(e, t, n) {
	let { hass: r } = e, i = r.states[t], a = i.state === "on", o = Na(e, t), s = Br(r, t, o, e.config.names), c = t.startsWith("light.") ? Oa : ka, l = Kr(r, t), u = a ? "an" : i.state === "off" ? "aus" : "nicht erreichbar";
	return P({
		title: s,
		subtitle: [Pa(e, t, o), u].filter(Boolean).join(" · "),
		color: a ? c : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#0b1a10" : "#fff",
		glow: a ? `${c}2e` : "rgba(255,255,255,0.05)",
		iconPath: He(t, s),
		headerExtra: Fa(e, t, a, c, s),
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffc061" aria-hidden="true"><path d=${k.bolt}></path></svg>
            <span class="grow">${l.value === null ? C`<span class="pr-lbl">Leistung nicht verfügbar</span>` : C`<span class="pr-val">${K(l.value)}</span><span class="pr-lbl">Leistung jetzt</span>`}</span>
            <span class="more">Verlauf ›</span>
          </button>` : E}
      ${za(e, t, [
			["30 min", 30],
			["1 h", 60],
			["2 h", 120]
		])}
    `
	});
}
function Va(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = Na(e, t), o = Br(n, t, a, e.config.names), s = Qr(r.state, i), c = s.mode !== "off", l = i.preset_modes ?? [], u = 100 / s.levels, d = I(n, a?.pm25), f = {
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
	return P({
		title: o,
		subtitle: [Pa(e, t, a), f].filter(Boolean).join(" · "),
		color: c ? ka : "rgba(255,255,255,0.12)",
		iconStroke: c ? "#0b1a10" : "#fff",
		glow: c ? "rgba(48,209,88,0.16)" : "rgba(255,255,255,0.05)",
		iconPath: M.fan,
		headerExtra: C`
      ${d === null ? E : C`<span class="pmchip" style="background:${Rn(d)}2e;color:${Rn(d)}">
            <span class="dot" style="background:${Rn(d)}"></span>PM2.5 ${R(d)}</span>`}
      ${Fa(e, t, c, ka, o)}`,
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
function Ha(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = r.state === "on", o = Na(e, t), s = Br(n, t, o, e.config.names), c = Number(i.min_humidity) || 35, l = Number(i.max_humidity) || 85, u = Number(i.target_humidity_step) || 5, d = e.pending(t, "humidity") ?? (Number(i.humidity) || c), f = Number(i.current_humidity), p = i.available_modes ?? Object.keys($r), m = (n) => {
		let r = Math.min(l, Math.max(c, Math.round((d + n * u) / u) * u));
		e.setPending(t, "humidity", r, () => e.call("humidifier", "set_humidity", { humidity: r }, { entity_id: t }));
	};
	return P({
		title: s,
		subtitle: [
			Pa(e, t, o),
			a ? "an" : "aus",
			Number.isFinite(f) ? `Gerät misst ${R(f)} %` : ""
		].filter(Boolean).join(" · "),
		color: a ? Aa : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#06202c" : "#fff",
		glow: a ? "rgba(90,200,250,0.18)" : "rgba(255,255,255,0.05)",
		iconPath: M.drop,
		headerExtra: Fa(e, t, a, Aa, s),
		onClose: e.closeSheet,
		body: C`
      <div class="humrow">
        <button class="hstep" aria-label="Zielfeuchte senken" ?disabled=${d <= c} @click=${() => m(-1)}>−</button>
        <span class="hval"><span class="big">${R(d)} %</span><span class="small">Zielfeuchte · ${c}–${l} %</span></span>
        <button class="hstep" aria-label="Zielfeuchte erhöhen" ?disabled=${d >= l} @click=${() => m(1)}>+</button>
      </div>
      <div class="modes" role="radiogroup" aria-label="Modus" style="grid-template-columns: repeat(${p.length}, minmax(0, 1fr))">
        ${p.map((n) => {
			let r = i.mode === n;
			return C`<button class="dchip sm ${r ? "selb" : ""}" role="radio" aria-checked=${r}
            @click=${() => e.call("humidifier", "set_mode", { mode: n }, { entity_id: t })}>${$r[n] ?? n}</button>`;
		})}
      </div>
      ${za(e, t, [
			["1 h", 60],
			["2 h", 120],
			["4 h", 240]
		])}
    `
	});
}
var Ua = o`
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
`, Wa = (e, t) => `width:${t}px;height:${t}px;background:${e}`;
function Ga(e) {
	let { hass: t } = e, n = pi(t, e.config, e.rooms), r = yi(t, n), i = r.some((t) => t.id === e.roomsFilter) ? e.roomsFilter : "all", a = bi(n, i), o = n.flatMap((e) => e.devices.filter((e) => e.on && e.kind === "light").map((e) => e.id));
	return C`
    <div class="rooms">
      <header class="rhead">
        <div>
          <div class="date">${vi(n)}</div>
          <h1>Räume</h1>
        </div>
        <button class="lightsoff" ?disabled=${!o.length}
          @click=${() => e.call("light", "turn_off", {}, { entity_id: o })}>
          ${N(j.power, 16, "#fff", 2.4)}Licht aus
        </button>
      </header>

      <div class="rfilter" role="tablist" aria-label="Filter" style="grid-template-columns: repeat(${r.length}, minmax(0, 1fr))">
        ${r.map((t) => C`<button role="tab" aria-selected=${t.id === i} class=${t.id === i ? "sel" : ""}
          @click=${() => e.setRoomsFilter(t.id)}>${t.label}</button>`)}
      </div>

      ${a.length ? a.map((t) => Ka(e, t, i === "on")) : C`<div class="rempty">Gerade ist nichts an.</div>`}
    </div>
  `;
}
function Ka(e, t, n = !1) {
	let r = ii(e.hass, t.scenes.map((e) => e.id), e.sceneConfigs(), e.now), { hass: i } = e, { room: a } = t, o = I(i, a.temperature), s = I(i, a.humidity), c = !!a.climate;
	return C`
    <article class="rcard ${t.active ? "active" : ""} ${n ? "compact" : ""}">
      <div class="rtop">
        <span class="circle" style=${Wa(t.active ? "#ffd60a" : "rgba(255,255,255,0.12)", n ? 32 : 40)}>
          ${N(Be(a.name, a.icon), 18, t.active ? "#2b2200" : "#fff", 2)}
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
              ${o === null ? E : C`<span>${U(o)}°</span>`}
              ${s === null ? E : C`<span class="muted">${Math.round(s)} %</span>`}
              ${t.power === null ? E : C`<span class="pw"><svg width="11" height="11" viewBox="0 0 24 24" fill="#ffc061" aria-hidden="true"><path d=${k.bolt}></path></svg>${K(t.power)}</span>`}
            </button>` : E}
        ${n ? t.scenes.map((t) => C`<button class="roff" aria-label="${a.name}: alles aus" title="Alles aus"
              @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>${N(j.power, 15, "#fff", 2.3)}</button>`) : E}
      </div>

      ${n ? C`<div class="rgrid">${t.devices.map((t) => Ja(e, t))}</div>` : C`${t.scenes.length ? C`<div class="rgrid" role="group" aria-label="Szenen ${a.name}">
                ${t.scenes.map((t, n) => qa(e, t, n, r))}
              </div>` : E}
          ${t.devices.length ? C`<div class="rgrid">${t.devices.map((t) => Ja(e, t))}</div>` : E}`}
    </article>
  `;
}
function qa(e, t, n, r) {
	let i = t.off ? "rgba(255,255,255,0.14)" : ot[n % ot.length], a = t.off ? "#fff" : "#101010", o = r.has(t.id);
	return C`<button class="rscene" aria-pressed=${o} style=${o ? `background:${t.off ? "rgba(255,255,255,0.2)" : i + "33"};box-shadow:0 0 18px ${t.off ? "rgba(255,255,255,0.08)" : i + "40"}` : ""}
    @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>
    <span class="circle" style=${Wa(i, 34)}>${t.off ? N(j.power, 16, a, 2.1) : st(t.icon, j.scene, a)}</span>
    <span class="ellipsis">${t.off ? "Aus" : t.name}</span>
  </button>`;
}
function Ja(e, t) {
	let n = t.kind === "light" ? ui(e.hass.states[t.id]?.attributes ?? {}) : null, r = n ? n.color : "#30d158", i = n ? n.bg : "rgba(48,209,88,0.14)", a = t.on ? n ? n.icon : "#151005" : t.unavailable ? "rgba(255,255,255,0.45)" : "#fff";
	return C`<button class="rdev ${t.on ? "on" : ""} ${t.unavailable ? "na" : ""}" style=${t.on ? `background:${i}` : ""}
    aria-label="${t.name}: ${t.tileState}"
    ${xr({
		tap: () => Ma(e, t.id),
		hold: () => e.openSheet({
			id: "device",
			entity: t.id
		})
	})}>
    <span class="circle" style=${Wa(t.on ? r : "rgba(255,255,255,0.1)", 32)}>${N(He(t.id, t.name), 15, a, 2.2)}</span>
    <span class="rdtext">
      <span class="ellipsis rdname">${t.name}</span>
      <span class="rdstate" style="color:${t.on ? n ? n.text : "#9af0b5" : "rgba(255,255,255,0.55)"}">${t.tileState}</span>
    </span>
  </button>`;
}
var Ya = o`
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
`, Xa = {
	pylon: "M12 2 6 22M12 2l6 20M8 9h8M7 14h10",
	server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
	question: "M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.5V14M12 18h.01",
	battery: "M3 8h15a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM21 11v2"
}, Y = 5, X = (e) => `${R(e, 1)} kWh`, Za = (e) => `${R(e, 2)} €`;
function Qa(e) {
	return e.untracked ? Xa.question : /netzwerk|nas|server|router|switch|rack/i.test(e.name) ? Xa.server : He(e.id, e.name);
}
function $a(e, t) {
	return t ? C`<div class="vline live ${t}" style="--c:${e}" aria-hidden="true"><span class="arrow"></span></div>` : C`<div class="vline idle" style="border-color:${e}4d" aria-hidden="true"></div>`;
}
function eo(e, t) {
	return t ? C`<div class="fline live ${t}" style="--c:${e}" aria-hidden="true"><span class="arrow"></span></div>` : C`<div class="fline idle" style="border-color:${e}4d" aria-hidden="true"></div>`;
}
var to = 6;
function no(e) {
	let { hass: t, config: n } = e, r = e.energy(), i = Oi(t, n, r.prefs), a = Ni(t, n, r.today), o = r.prefs ? Ei(Ti(r.prefs), a, r.today?.cost === void 0 ? void 0 : {
		cost: r.today.cost,
		compensation: r.today.compensation ?? 0
	}) : null, s = Ii(t, n, 100, r.prefs), c = e.consumersAll ? s : s.slice(0, to), l = (t, n) => e.openSheet({
		id: "energyChart",
		key: t,
		range: "24h",
		name: n
	}), u = Math.max(1, ...c.map((e) => e.value)), d = i.export > i.import, f = d ? i.export : i.import, p = d ? "#64d2ff" : "#ff9f0a", m = i.battery;
	return C`
    <div class="energy">
      <header class="ehead">
        <div class="date">${Ai(e.now, i)}</div>
        <h1>Energie</h1>
      </header>

      <div class="flow">
        <div class="frow">
          <button class="node" aria-label="PV ${K(i.pv)}, Verlauf anzeigen" @click=${() => l("pv")}>
            <span class="circle" style="width:48px;height:48px;background:rgba(255,214,10,${i.pv > Y ? .32 : .18})">${N(k.sun, 22, "#ffd60a", 2)}</span>
            <span class="nv">${K(i.pv)}</span><span class="nl">PV</span>
          </button>
          ${eo("#ffd60a", i.pv > Y ? "right" : null)}
          <button class="node" aria-label="Haus ${K(i.house)}, Verbrauch anzeigen" @click=${() => l("house")}>
            <span class="house">${N(k.home, 22, "#101218", 2.2)}<span>${K(i.house)}</span></span>
            <span class="nl">Haus</span>
          </button>
          ${eo(p, f > Y ? d ? "right" : "left" : null)}
          <button class="node" aria-label="Netz ${K(f)}, Verlauf anzeigen" @click=${() => l(d ? "export" : "import")}>
            <span class="circle" style="width:48px;height:48px;background:${f > Y ? p : "rgba(255,255,255,0.12)"}">${N(Xa.pylon, 22, f > Y ? "#1a1206" : "#fff", 2.2)}</span>
            <span class="nv">${K(f)}</span><span class="nl">${d ? "Einspeisung" : "Bezug"}</span>
          </button>
        </div>
        ${m ? C`<button class="bnode" aria-label="Akku, geladene und entladene Energie anzeigen" @click=${() => e.openSheet({
		id: "energyChart",
		key: "battery",
		range: "7d"
	})}>
              ${$a("#30d158", m.power > Y ? "up" : m.power < -5 ? "down" : null)}
              <span class="bring" style="--soc:${Math.max(0, Math.min(100, m.soc ?? 0))}%" role="img"
                aria-label="Akku${m.soc === null ? "" : ` ${R(m.soc)} %`}">
                <span class="circle" style="width:44px;height:44px;background:${Math.abs(m.power) > Y ? "#30d158" : "#1d2a22"}">${N(Xa.battery, 20, Math.abs(m.power) > Y ? "#0b1a10" : "#7ee8a0", 2.2)}</span>
              </span>
              <span class="nv">${Math.abs(m.power) > Y ? K(Math.abs(m.power)) : "0 W"}</span>
              <span class="nl">${m.power > Y ? "Akku liefert" : m.power < -5 ? "Akku lädt" : "Akku"}${m.soc === null ? "" : ` · ${R(m.soc)} %`}${Math.abs(m.power) <= Y && Bi(m, e.config.battery) ? ` · ${Bi(m, e.config.battery)}` : ""}</span>
            </button>` : E}
        <button class="elink" @click=${() => e.navigate("/energy")}>Energie-Dashboard ›</button>
      </div>

      <div class="section-head">
        <h2>Heute</h2><span class="rule" aria-hidden="true"></span>
        <span class="meta">ca. ${X(a.consumed)} verbraucht</span>
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
	].map((e) => C`<button class="tile" aria-label="${e.l} ${X(e.v)}, Verlauf anzeigen" @click=${() => l(e.k)}>
          <span class="tdot" style="background:${e.c}"></span><span class="tv">${X(e.v)}</span><span class="tl">${e.l}</span></button>`)}
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
	].map((e) => C`<button class="tile" aria-label="${e.l} ${Za(e.v)}, Verlauf anzeigen" @click=${() => l("cost")}>
              <span class="tdot" style="background:${e.c}"></span><span class="tv">${Za(e.v)}</span><span class="tl">${e.l}</span></button>`)}
          </div>` : E}

      ${a.consumed > 0 ? C`<div class="split">
            ${ro("Woher kam der Strom?", a.autarky === null ? "" : `${a.autarky} % autark`, "#7ee8a0", [
		a.local,
		"#ffd60a",
		`PV & Akku ${X(a.local)}`
	], [
		a.import,
		"#ff9f0a",
		`Netz ${X(a.import)}`
	], () => l("autarky"))}
            ${a.pv > 0 ? ro("Wohin ging der Solarstrom?", `${a.selfUse} % selbst genutzt`, "#ffe066", [
		Math.max(0, a.pv - a.export),
		"#ffd60a",
		`Haus ${X(Math.max(0, a.pv - a.export))}`
	], [
		a.export,
		"#64d2ff",
		`Eingespeist ${X(a.export)}`
	], () => l("selfuse")) : C`<div class="nopv">Heute noch kein Solarstrom.</div>`}
          </div>` : E}

      <div class="section-head"><h2>Aktuell</h2><span class="rule" aria-hidden="true"></span></div>
      ${c.length ? c.map((e) => C`
            <button class="cons" aria-label="${e.name} ${K(e.value)}, Verlauf anzeigen" @click=${() => l(e.id, e.name)}>
              <span class="cbar" style="width:${Math.round(e.value / u * 100)}%" aria-hidden="true"></span>
              <span class="circle" style="width:36px;height:36px;background:rgba(255,255,255,0.12)">${N(Qa(e), 16, "#fff", 2)}</span>
              <span class="cname ellipsis">${e.name}</span>
              <span class="cval">${K(e.value)}</span>
            </button>`) : C`<div class="nopv">Keine Messwerte.</div>`}
      ${s.length > to ? C`<button class="cmore" @click=${() => e.setConsumersAll(!e.consumersAll)}>
            ${e.consumersAll ? "Weniger anzeigen" : `Alle anzeigen (${s.length})`}</button>` : E}
    </div>
  `;
}
function ro(e, t, n, r, i, a) {
	let o = r[0] + i[0] || 1, s = Math.round(r[0] / o * 100);
	return C`<button class="sbtn" aria-label="${e} ${t}, Verlauf anzeigen" @click=${a}>
    <div class="shead"><span>${e}</span><span style="color:${n}">${t}</span></div>
    <div class="sbar" role="img" aria-label="${r[2]}, ${i[2]}"><span style="width:${s}%;background:${r[1]}"></span><span style="width:${100 - s}%;background:${i[1]}"></span></div>
    <div class="slegend"><span>${r[2]}</span><span>${i[2]}</span></div>
  </button>`;
}
var io = o`
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
`, ao = {
	home: "#30d158",
	zone: "#64d2ff",
	away: "#8e8e93",
	unknown: "#8e8e93"
}, oo = "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", so = "M5 12h14M13 6l6 6-6 6";
function co(e, t = 40) {
	return C`<span class="pp-av ${e.place === "away" || e.place === "unknown" ? "out" : ""}" style="width:${t}px;height:${t}px" title="${e.name}: ${e.zoneName}">
    ${e.picture ? C`<img src=${e.picture} alt="" />` : C`<span class="pp-ini">${e.initials}</span>`}
    <span class="pp-zone" style="background:${ao[e.place]}">
      ${e.place === "away" ? N(so, 10, "#111", 2.6) : e.place === "unknown" ? N(oo, 10, "#111", 2.4) : st(e.zoneIcon, e.place === "home" ? k.home : oo, "#111", 12)}
    </span>
  </span>`;
}
// src/logic/security.ts
var lo = [
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
function uo(e) {
	return e === "disarmed" ? "Alarm unscharf" : e === "triggered" ? "Alarm ausgelöst!" : `Alarm: ${Tn[e] ?? e}`;
}
function fo(e, t, n) {
	let r = F(t, "alarm"), i = e.states[r], a = i?.state ?? "unavailable", o = "", s = i?.attributes.last_triggered, c = s ? new Date(String(s).replace(" ", "T")) : void 0;
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
		label: uo(a),
		sub: o
	};
}
var po = [
	"window",
	"door",
	"opening",
	"garage_door"
], mo = ["versatile_thermostat", "bambu_lab"], ho = /^((fenster|tür|tur)sensor(en)?|sensor|contact|kontakt|fensterstatus|status)$/i;
function go(e) {
	return e.toLowerCase().split(/[\s&,._\-]+/).filter(Boolean);
}
function _o(e) {
	return e.charAt(0).toUpperCase() + e.slice(1);
}
function vo(e, t, n, r) {
	let i = e.states[t]?.attributes.friendly_name ?? t.split(".")[1].split("_").map(_o).join(" "), a = e.areas[n], o = /* @__PURE__ */ new Set([...go(a?.name ?? ""), ...go(n)]), s = (e) => {
		let t = go(e);
		return t.length > 0 && t.every((e) => o.has(e));
	}, c = i.split(/\s+/).filter((e) => e && !ho.test(e) && !s(e)).join(" ").trim();
	return !c || /^(fenster|tür|tur)$/i.test(c) ? r === "door" ? "Tür" : "Fenster" : c;
}
function yo(e, t, n) {
	let r = /* @__PURE__ */ new Set([...mo, ...t.exclude?.openings ?? []]), i = /* @__PURE__ */ new Map();
	for (let [t, n] of Object.entries(e.states)) {
		if (!t.startsWith("binary_sensor.") || !po.includes(n.attributes.device_class) || Array.isArray(n.attributes.entity_id)) continue;
		let a = e.entities[t];
		if (r.has(t) || a?.platform && r.has(a.platform)) continue;
		let o = z(e, t);
		if (!o || !e.areas[o]) continue;
		let s = String(n.attributes.friendly_name ?? t), c = /t[üu]r|door|tor\b/i.test(s) || n.attributes.device_class === "garage_door" ? "door" : "window", l = n.state === "unavailable" || n.state === "unknown";
		i.has(o) || i.set(o, []), i.get(o).push({
			id: t,
			title: vo(e, t, o, c),
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
			name: Kn[r] ?? r,
			areas: n
		};
	});
}
function bo(e, t) {
	let n = e.flatMap((e) => e.areas.flatMap((e) => e.items)), r = n.filter((e) => e.open).length, i = `${n.length - r} von ${n.length} zu`;
	return t === "triggered" ? `Alarm ausgelöst! · ${i}` : r ? `${r} offen · ${i}` : `Alles ruhig · ${i}`;
}
// src/logic/persons.ts
function xo(e, t) {
	let n = t.attributes.in_zones?.map((t) => e.states[t]).find(Boolean);
	if (n) return n;
	let r = t.state.trim();
	return Object.values(e.states).find((e) => e.entity_id.startsWith("zone.") && String(e.attributes.friendly_name ?? "").trim() === r);
}
function So(e, t) {
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
		let s = xo(e, r);
		return [{
			...o,
			place: "zone",
			zoneName: String(s?.attributes.friendly_name ?? r.state).trim(),
			zoneIcon: s?.attributes.icon
		}];
	});
}
function Co(e) {
	let t = e.filter((e) => e.place === "home").length;
	return t === e.length ? "Alle da" : t === 0 ? "Niemand da" : `${t} von ${e.length} da`;
}
function wo(e, t) {
	let n = new Date(e), r = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`, i = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(), a = Math.round((i(t) - i(n)) / 864e5);
	return a <= 0 ? `seit ${r}` : a < 7 ? `seit ${n.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")} ${r}` : `seit ${n.getDate()}.${n.getMonth() + 1}.`;
}
// src/pages/security.ts
var To = {
	camera: "M3 7h12v10H3zM15 10l6-3v10l-6-3",
	muted: "M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6",
	sound: "M4 9h4l5-4v14l-5-4H4zM17 8a5 5 0 0 1 0 8M19.5 5.5a9 9 0 0 1 0 13",
	full: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
};
function Eo(e, t) {
	if (e.config.names?.[t]) return e.config.names[t];
	let n = B(e.hass, t);
	return /doorbell|klingel|haust/i.test(`${t} ${n}`) ? "Haustür" : n;
}
function Do(e, t, n) {
	let r = t.currentTarget.closest(".cam");
	r?.requestFullscreen ? r.requestFullscreen().catch(() => e.moreInfo(n)) : e.moreInfo(n);
}
function Oo(e) {
	let { hass: t, config: n } = e, r = fo(t, n, e.now), i = yo(t, n, e.rooms), a = r.state === "triggered" ? "#ff453a" : "#bf9bff", o = F(n, "camera"), s = t.states[o], c = t.states[F(n, "camera_motion")], l = t.states[F(n, "camera_person")], u = e.ui.camSound !== !0, d = So(t, n), f = !!s && s.state !== "unavailable" && !!customElements.get("ha-camera-stream");
	return C`
    <div class="security">
      <header class="shead2">
        <div>
          <div class="date">${bo(i, r.state)}</div>
          <h1>Schutz</h1>
        </div>
        ${d.length ? C`<button class="pp-pill" aria-label="Personen: ${Co(d)}, Karte öffnen"
              @click=${() => e.openSheet({ id: "persons" })}>
              ${d.map((e) => co(e))}
            </button>` : E}
      </header>

      ${t.states[r.id] ? C`<div class="alarmpill" style="background: linear-gradient(90deg, ${a}42, rgba(255,255,255,0.05) 70%)">
            <button class="circle abtn" style="width:48px;height:48px;background:${a}" aria-label="Alarm-Details"
              @click=${() => e.openSheet({ id: "alarm" })}>${N(Cn(r.state), 22, "#1d1030", 2.2)}</button>
            <span class="atext">
              <span class="atitle">${r.label}</span>
              ${r.sub ? C`<span class="asub">${r.sub}</span>` : E}
            </span>
            ${lo.filter((e) => e.state !== r.state).map((t) => C`
              <button class="amode" aria-label=${t.name} title=${t.name}
                @click=${() => e.call("alarm_control_panel", t.service, {}, { entity_id: r.id })}>
                ${N(k[t.icon], 18, "#e2d3ff", 2.1)}
              </button>`)}
          </div>` : E}

      ${s ? C`<section class="camcard" aria-label="${Eo(e, o)}-Kamera">
            <div class="cam">
              ${f ? C`<ha-camera-stream class="stream" .hass=${t} .stateObj=${s} .muted=${u} .controls=${!1}
                    allow-exoplayer></ha-camera-stream>` : C`<span class="camph">${N(To.camera, 40, "rgba(255,255,255,0.4)", 1.6)}</span>`}
              <span class="camlive"><span class="dot" style="background:${f ? "#ff453a" : "#888"}"></span>${f ? "Live" : "Offline"} · ${Eo(e, o)}</span>
              <span class="camtools">
                <button aria-label=${u ? "Ton an" : "Ton aus"} @click=${() => e.setUi({ camSound: u })}>${N(u ? To.muted : To.sound, 15, "#fff", 2.2)}</button>
                <button aria-label="Vollbild" @click=${(t) => Do(e, t, o)}>${N(To.full, 15, "#fff", 2.2)}</button>
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
                          ${N(t.kind === "door" ? k.door : k.window, 15, t.unavailable ? "rgba(255,255,255,0.45)" : t.open ? "#ffd1cf" : "#7ee8a0", 2.2)}
                        </button>`;
	})}
                    </span>
                  </div>`)}
              </div>`)}
          ` : E}
    </div>
  `;
}
var ko = o`
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
`, Ao = {
	pause: "M7 4h3v16H7zM14 4h3v16h-3z",
	dock: "M3 10.5 12 3l9 7.5V21H3z",
	locate: "M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12zM12 7a2 2 0 1 0 0 4a2 2 0 1 0 0-4"
};
function jo(e, t, n, r) {
	let i = e === 0 ? "17px 6px 6px 17px" : e === n - 1 ? "6px 17px 17px 6px" : "6px";
	return e <= t ? `border-radius:${i};background:${r};opacity:${.55 + .45 * (e + 1) / n};color:#08121c` : `border-radius:${i};background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)`;
}
function Mo(e) {
	let { hass: t, config: n } = e, r = F(n, "vacuum"), i = Jt(t, n), a = Xt(t, n), o = Qt(t, n), s = L(t, F(n, "vacuum_map")) ?? o[0]?.name, c = o.find((e) => e.name === s) ?? o[0], l = $t(t, n), u = c ? c.rooms.filter((e) => l.includes(e.segment)).length : 0, d = F(n, "vacuum_mode"), f = L(t, d) ?? "vacuum", p = String(t.states[r]?.attributes.fan_speed ?? ""), m = an.findIndex((e) => e.id === p), h = F(n, "vacuum_mop"), g = on.findIndex((e) => e.id === L(t, h)), _ = F(n, "vacuum_passes"), v = Math.round(I(t, _) ?? 1), y = (t, n = {}) => e.call("vacuum", t, n, { entity_id: r }), ee = (t, n) => e.call("select", "select_option", { option: n }, { entity_id: t }), te = i.error ? "#ff453a" : i.cleaning ? "#64d2ff" : "#30d158";
	return P({
		title: "Robby",
		subtitle: i.label,
		color: "radial-gradient(circle at 40% 35%, #4a505c, #23262e)",
		glow: i.error ? "rgba(255,69,58,0.18)" : "rgba(48,209,88,0.1)",
		iconPath: k.vacuum,
		iconStroke: te,
		onClose: e.closeSheet,
		headerExtra: C`
      ${i.cleaning ? C`<button class="rb-ctl" aria-label="Pause" title="Pause" @click=${() => y("pause")}>${N(Ao.pause, 16, "#fff", 2.2)}</button>` : C`<button class="rb-ctl" aria-label="Start" title="Start" @click=${() => y("start")}>${N(j.play, 16, "#fff", 2.2)}</button>`}
      <button class="rb-ctl" aria-label="Zur Station" title="Zur Station" @click=${() => y("return_to_base")}>${N(Ao.dock, 16, "#fff", 2.2)}</button>
      <button class="rb-ctl" aria-label="Orten" title="Orten" @click=${() => y("locate")}>${N(Ao.locate, 16, "#fff", 2.2)}</button>
    `,
		body: C`
      ${a.length ? C`<div class="rb-stats" style="grid-template-columns: repeat(${a.length}, minmax(0, 1fr))">
            ${a.map((t) => C`<button class="rb-stat ${t.due ? "due" : ""}" aria-label="${t.name}: ${t.value}${t.reset ? ", tippen zum Zurücksetzen" : ""}"
              @click=${() => t.reset ? e.confirm({
			title: t.name,
			text: `${t.name} gereinigt oder getauscht? Der Zähler wird zurückgesetzt.`,
			confirm: "Zurücksetzen",
			color: "#ff9f0a",
			iconPath: k.vacuum,
			onConfirm: () => e.call("button", "press", {}, { entity_id: t.reset })
		}) : e.moreInfo(t.id)}>
              <span class="rb-sv">${t.value}</span><span class="rb-sn">${t.name}</span>
            </button>`)}
          </div>` : E}

      <div class="section-head"><h2>Programme</h2><span class="rule" aria-hidden="true"></span><span class="meta">Tippen startet</span></div>
      <div class="rb-progs">
        ${tn(n).map((t) => C`
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
                  @click=${() => t.name !== c.name && e.runScript(F(n, "vacuum_map_script"), { karte: t.name })}>${t.name}</button>`)}
              </div>
              ${c.rooms.length ? C`<div class="rb-rooms">
                    ${c.rooms.map((t) => {
			let r = l.includes(t.segment);
			return C`<button class="rb-room ${r ? "sel" : ""}" aria-pressed=${r}
                        @click=${() => e.runScript(F(n, "vacuum_room_script"), { segment: t.segment })}>${t.name}</button>`;
		})}
                  </div>` : E}

              <div class="rb-modes" role="radiogroup" aria-label="Modus">
                ${rn.map((e) => {
			let t = f === e.id;
			return C`<button class="rb-mode ${t ? "sel" : ""}" role="radio" aria-checked=${t} @click=${() => ee(d, e.id)}>
                    <span class="rb-mi">
                      ${e.id === "mop" ? E : N(j.fan, 18, "currentColor", 2.1)}
                      ${e.id === "vacuum" ? E : N(j.drop, 18, "currentColor", 2.1)}
                    </span>
                    <span class="rb-mn">${e.name}</span>
                  </button>`;
		})}
              </div>

              ${f === "mop" ? E : C`<div class="rb-slider">
                    <div class="rb-sh">${N(j.fan, 15, "#7ee8a0", 2.2)}<span>Saugkraft</span><span class="grow"></span>
                      <strong style="color:#9af0b5">${an[m]?.name ?? p}</strong></div>
                    <div class="rb-segs" role="radiogroup" aria-label="Saugkraft" style="grid-template-columns: repeat(${an.length}, minmax(0, 1fr))">
                      ${an.map((e, t) => C`<button role="radio" aria-checked=${t === m} aria-label=${e.name} title=${e.name}
                        style=${jo(t, m, an.length, "#30d158")} @click=${() => y("set_fan_speed", { fan_speed: e.id })}></button>`)}
                    </div>
                  </div>`}

              ${f === "vacuum" ? E : C`<div class="rb-slider">
                    <div class="rb-sh">${N(j.drop, 15, "#8fd8ff", 2.2)}<span>Wasser</span><span class="grow"></span>
                      <strong style="color:#bfe8ff">${on[g]?.name ?? "–"}</strong></div>
                    <div class="rb-segs" role="radiogroup" aria-label="Wischintensität" style="grid-template-columns: repeat(${on.length}, minmax(0, 1fr))">
                      ${on.map((e, t) => C`<button role="radio" aria-checked=${t === g} aria-label=${e.name} title=${e.name}
                        style=${jo(t, g, on.length, "#5ac8fa")} @click=${() => ee(h, e.id)}>
                        ${Array.from({ length: t + 1 }, () => C`<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${j.drop}></path></svg>`)}
                      </button>`)}
                    </div>
                  </div>`}

              <div class="rb-start">
                <div class="rb-passes" role="radiogroup" aria-label="Durchgänge">
                  ${[1, 2].map((t) => C`<button role="radio" aria-checked=${v === t} class=${v === t ? "sel" : ""}
                    @click=${() => e.call("input_number", "set_value", { value: t }, { entity_id: _ })}>${t}×</button>`)}
                </div>
                <button class="rb-go" ?disabled=${u === 0} @click=${() => e.runScript(F(n, "vacuum_clean_script"))}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${j.play}></path></svg>${nn(u)}
                </button>
              </div>
            </section>` : E}
    `
	});
}
var No = o`
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
`, Po = 36e5, Fo = 24 * Po;
function Io(e, t) {
	let n = -1, r = Infinity;
	return e.forEach((e, i) => {
		let a = Math.abs(e - t);
		a < r && (r = a, n = i);
	}), n;
}
var Lo = (e) => String(e.getHours()).padStart(2, "0"), Ro = (e) => e.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
function zo(e, t) {
	let n = new Date(e);
	if ((t.step ?? 0) >= 828e5) return `${Ro(n)} ${n.getDate()}.${n.getMonth() + 1}.`;
	let r = t.span > 1.5 * Fo ? `${Ro(n)} ` : "";
	return t.bars && t.step ? `${r}${Lo(n)}–${Lo(new Date(e + t.step))} Uhr` : `${r}${Lo(n)}:${String(n.getMinutes()).padStart(2, "0")}`;
}
function Bo(e) {
	let t = e.end - e.start, n = e.step ?? 0, r = Math.max(n, Po), i = e.compare ?? [], a = (e) => {
		let t = Io(i.map((e) => e.t), e);
		return t >= 0 && Math.abs(i[t].t - e) <= r ? i[t] : null;
	}, o = (r, i) => {
		let o = {
			x: e.bars && n ? (e.x(r.t) + e.x(r.t + n)) / 2 : e.x(r.t),
			y: e.y(r.v),
			time: zo(r.t, {
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
		return o;
	};
	return [...e.past.map((e) => o(e, !1)), ...(e.future ?? []).map((e) => o(e, !0))];
}
// src/components/scrub.ts
var Vo = 1800, Z = /* @__PURE__ */ new WeakMap();
function Ho(e) {
	return e.querySelector(":scope > .sc-layer");
}
function Uo(e) {
	let t = Z.get(e);
	t && (t.index = -1), Ho(e)?.classList.remove("on");
}
function Wo(e, t) {
	let n = Z.get(e), r = Ho(e);
	if (!n || !r || !n.cfg.points.length) return;
	let i = e.getBoundingClientRect();
	if (!i.width) return;
	let a = (t - i.left) / i.width * n.cfg.width, o = Io(n.cfg.points.map((e) => e.x), a);
	if (o < 0) return;
	o !== n.index && n.index >= 0 && yr(e, "selection"), n.index = o;
	let s = n.cfg.points[o];
	r.firstChild || (r.innerHTML = "<div class=\"sc-line\"></div><div class=\"sc-dot\"></div><div class=\"sc-tip\"><span class=\"sc-t\"></span><span class=\"sc-v\"></span><span class=\"sc-e\"></span></div>");
	let c = s.x / n.cfg.width * i.width, l = s.y / n.cfg.height * i.height, [u, d, f] = Array.from(r.children);
	u.style.left = `${c}px`, d.style.left = `${c}px`, d.style.top = `${l}px`, d.style.background = n.cfg.color;
	let [p, m, h] = Array.from(f.children);
	p.textContent = s.time, m.textContent = s.value, m.style.color = n.cfg.color, h.textContent = s.extra ?? "", h.hidden = !s.extra, r.classList.add("on");
	let g = f.offsetWidth;
	f.style.left = `${Math.min(Math.max(0, c - g / 2), Math.max(0, i.width - g))}px`;
}
function Go(e) {
	let t = () => {
		let t = Z.get(e);
		t && (window.clearTimeout(t.timer), t.timer = window.setTimeout(() => Uo(e), Vo));
	};
	e.addEventListener("pointerdown", (t) => {
		let n = Z.get(e);
		n && (window.clearTimeout(n.timer), n.pressed = !0, Wo(e, t.clientX));
	}), e.addEventListener("pointermove", (t) => {
		let n = Z.get(e);
		n && (n.pressed || t.pointerType === "mouse") && Wo(e, t.clientX);
	});
	let n = () => {
		let n = Z.get(e);
		n && (n.pressed = !1, t());
	};
	e.addEventListener("pointerup", n), e.addEventListener("pointercancel", n), e.addEventListener("pointerleave", (t) => {
		t.pointerType === "mouse" ? Uo(e) : n();
	});
}
var Ko = We(class extends Ge {
	constructor(e) {
		if (super(e), e.type !== Ue.ELEMENT) throw Error("scrub() must be used on an element");
	}
	render(e) {
		return T;
	}
	update(e, [t]) {
		let n = e.element, r = Z.get(n);
		return r ? (r.cfg = t, r.index >= t.points.length && Uo(n)) : (Z.set(n, {
			cfg: t,
			index: -1,
			pressed: !1
		}), Go(n)), T;
	}
}), qo = o`
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
`, Jo = 338, Yo = 300, Xo = 18, Zo = 130;
function Qo(e) {
	let t = e.data, n = t.past ?? [], r = t.future ?? [], i = t.step ?? 0, a = t.compare ?? [], o = ir(n, t.start, t.end, Yo, Xo, Zo, {
		snap: e.snap,
		zero: e.zero,
		max: e.max,
		padLo: e.snap / 2,
		padHi: e.snap / 2,
		extra: [...r, ...a].map((e) => e.v)
	}), s = a.length ? ir(a, t.start, t.end, Yo, Xo, Zo, {
		snap: e.snap,
		zero: e.zero,
		max: e.max,
		padLo: e.snap / 2,
		padHi: e.snap / 2,
		extra: [...n, ...r].map((e) => e.v)
	}) : null, c = r.length ? ir(r, t.start, t.end, Yo, Xo, Zo, {
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
	], d = r.length ? o.x(r[0].t) : null, f = `${e.title}: ${e.caption ?? ""}`, p = Bo({
		past: n,
		future: r,
		compare: a,
		step: i,
		bars: !!(e.bars && i),
		start: t.start,
		end: t.end,
		x: o.x,
		y: o.y,
		value: (t) => `${R(t, e.digits)}${l}`,
		compareName: e.compareName
	});
	return C`
    <figure class="tr-fig" style="background:${e.color}14">
      <figcaption>
        <span class="tr-title" style="color:${e.color}">${e.title}</span>
        ${e.caption ? C`<span class="tr-cap">${e.caption}</span>` : E}
      </figcaption>
      ${t.error && !n.length ? C`<div class="tr-msg">Keine Daten: ${t.error}</div>` : t.loading && !n.length ? C`<div class="tr-msg">Lade Verlauf …</div>` : C`
            <div class="sc-wrap" ${Ko({
		points: p,
		width: Jo,
		height: 150,
		color: e.color
	})}>
            <svg width="100%" viewBox="0 0 ${Jo} 150" role="img" aria-label=${f}>
              ${u.map((e) => w`
                <line x1="0" y1=${o.y(e)} x2=${Jo} y2=${o.y(e)} stroke="rgba(255,255,255,0.08)"></line>
                <text x=${334} y=${o.y(e) - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${R(e, e % 1 ? 1 : 0)}${l}</text>`)}
              ${(t.bands ?? []).map((t) => w`<rect x=${o.x(t.from)} y=${12} width=${Math.max(1, o.x(t.to) - o.x(t.from))}
                height=${118} fill=${e.bandColors?.[t.level] ?? "rgba(255,255,255,0.08)"}></rect>`)}
              ${s?.line ? w`<polyline points=${s.line} fill="none" stroke=${e.compareColor ?? "rgba(255,255,255,0.6)"} stroke-width="1.6" stroke-linejoin="round" opacity="0.9"></polyline>` : E}
              ${e.bars && i ? n.map((t) => {
		let n = o.x(t.t), r = Math.max(1, o.x(t.t + i) - n - 2), a = o.y(t.v);
		return w`<rect x=${n + 1} y=${a} width=${r} height=${Math.max(0, Zo - a)} rx=${Math.min(3, r / 2)} fill=${e.color} opacity="0.85"></rect>`;
	}) : w`
                  ${o.area ? w`<polygon points=${o.area} fill=${e.color} opacity="0.16"></polygon>` : E}
                  ${o.line ? w`<polyline points=${o.line} fill="none" stroke=${e.color} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>` : E}
                  ${c?.line ? w`<polyline points=${c.line} fill="none" stroke=${e.color} stroke-width="2" stroke-dasharray="5 5" opacity="0.7"></polyline>` : E}
                  ${d === null ? E : w`<line x1=${d} y1=${12} x2=${d} y2=${Zo} stroke="rgba(255,255,255,0.35)" stroke-dasharray="2 3"></line>
                        <text x=${d + 4} y=${16} fill="rgba(255,255,255,0.7)" font-size="10">Vorhersage</text>`}
                  ${o.last && e.dot !== !1 ? w`<circle cx=${o.last.x} cy=${o.last.y} r="4.5" fill=${e.color} stroke="#181a22" stroke-width="2"></circle>` : E}`}
            </svg>
            <div class="sc-layer"></div>
            </div>
            <div class="tr-x">${e.labels.map((e) => C`<span>${e}</span>`)}</div>`}
    </figure>
  `;
}
var $o = o`
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
`, Q = "#8fd0ff", es = {
	humidity: j.drop,
	wind: k.wind,
	pressure: "M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16M12 12l4-3",
	uv: k.sun,
	visibility: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6"
}, ts = {
	rain: j.drop,
	sun: k.sun,
	wind: k.wind,
	humidity: j.drop,
	uv: k.sun
}, ns = "M6 9l6 6 6-6", rs = [
	"rainy",
	"pouring",
	"snowy",
	"snowy-rainy",
	"hail",
	"lightning-rainy"
];
function is(e) {
	let { hass: t, config: n } = e, r = F(n, "weather"), i = e.forecast(), a = Ct(t, n, i.daily, e.now), o = wt(i.hourly, e.now), s = Et(i.daily), c = Lt(t, n, e.now), l = c.length ? null : Ot(i.daily, I(t, F(n, "gusts")), e.now), u = kt(t, n), d = !u || u.level === 0 ? "#7ee8a0" : u.level < 2 ? "#ffd60a" : "#ff9f0a";
	return P({
		title: String(t.states[r]?.attributes.friendly_name ?? "Wetter"),
		subtitle: a.source || void 0,
		color: Q,
		glow: "rgba(90,140,220,0.35)",
		iconPath: A(a.condition),
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		body: C`
      <div class="w-now">
        <span class="w-temp">${a.temp}</span>
        <span><span class="w-cond">${a.label}</span>${a.today ? C`<span class="w-today">${a.today}</span>` : E}</span>
      </div>
      ${a.chips.length ? C`<div class="w-chips">
            ${a.chips.map((t) => t.key in Rt ? C`<button class="w-chip" aria-label="${t.label}, Verlauf anzeigen"
                  @click=${() => e.openSheet({
			id: "weatherMetric",
			metric: t.key
		})}>${N(es[t.key], 14, Q, 2.2)}${t.label}</button>` : C`<span class="w-chip">${N(es[t.key], 14, Q, 2.2)}${t.label}</span>`)}
          </div>` : E}

      ${c.map((t, n) => {
			let r = e.ui[`warn${n}`] === !0;
			return C`
          <button class="w-alert" aria-expanded=${r} ?disabled=${!t.text}
            style="border-color:${t.color}66;background:linear-gradient(90deg, ${t.color}38, ${t.color}0d)"
            @click=${() => e.setUi({ [`warn${n}`]: !r })}>
            <span class="w-ah">
              <span class="circle" style="width:32px;height:32px;background:${t.color}">${N(k.storm, 15, "#1d1030", 2.2)}</span>
              <span class="grow"><span class="w-wt">${t.current ? t.level >= 3 ? "Unwetterwarnung" : "Warnung" : "Vorabwarnung"}: ${t.title}</span>
                <span class="w-ws">${t.when} · Stufe ${t.level} von 4</span></span>
              ${t.text ? C`<span class="w-chev ${r ? "open" : ""}">${N(ns, 16, "rgba(255,255,255,0.7)", 2.4)}</span>` : E}
            </span>
            ${r ? C`<span class="w-at">${t.text}</span>` : E}
          </button>`;
		})}

      ${l ? C`<div class="w-warn">
            <span class="circle" style="width:40px;height:40px;background:#bf9bff">${N(k.storm, 18, "#1d1030", 2.2)}</span>
            <span><span class="w-wt">${l.title}</span><span class="w-ws">${l.text}</span></span>
          </div>` : E}

      ${i.loading && !i.hourly.length ? C`<div class="w-msg">Vorhersage wird geladen …</div>` : i.error && !i.hourly.length ? C`<div class="w-msg">Vorhersage nicht verfügbar.</div>` : E}

      ${o.length ? C`<div class="w-hours" style="grid-template-columns: repeat(${o.length}, minmax(0, 1fr))">
            ${o.map((e) => C`<div class="w-hour">
              <span class="w-ht">${e.t}</span>
              ${N(A(e.condition), 20, rs.includes(e.condition) ? Q : "rgba(255,255,255,0.85)", 2)}
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
              ${N(A(t.condition), 20, rs.includes(t.condition) ? Q : "rgba(255,255,255,0.8)", 2)}
              <span class="w-dr">${t.rain}</span>
              <span class="w-track">
                <span class="w-bar" style="left:${t.left}%;width:${t.width}%"></span>
                <span class="w-lo" style="left:${t.left}%">${t.min}°</span>
              </span>
              <span class="w-dmax">${t.max}°</span>
            </button>`)}
          </div>` : E}

      ${u ? C`<div class="w-pollen" style="background:${d}1f">
            ${N(j.leaf, 16, d, 2.2)}
            <span><strong>${u.title}</strong> · ${u.text}</span>
          </div>` : E}
    `
	});
}
var as = 36e5;
function os(e, t) {
	let n = e.forecast(), r = n.daily.find((e) => e.datetime === t), i = () => e.openSheet({ id: "weather" });
	if (!r) return P({
		title: "Vorhersage",
		color: Q,
		glow: "rgba(90,140,220,0.35)",
		iconPath: k.sun,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: i,
		body: C`<div class="w-msg">${n.loading ? "Vorhersage wird geladen …" : "Für diesen Tag gibt es keine Vorhersage mehr."}</div>`
	});
	let a = Dt(r, n.hourly), o = (e) => `${String(e).padStart(2, "0")} Uhr`;
	return P({
		title: a.title,
		subtitle: a.label || void 0,
		color: Q,
		glow: "rgba(90,140,220,0.35)",
		iconPath: A(a.condition),
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: i,
		body: C`
      <div class="w-now">
        <span class="w-temp">${a.max ?? "–"}°</span>
        <span><span class="w-cond">${a.label}</span>${a.min === null ? E : C`<span class="w-today">Tiefstwert ${a.min}°</span>`}</span>
      </div>
      ${a.facts.length ? C`<div class="w-chips">${a.facts.map((e) => C`<span class="w-chip">${N(ts[e.key], 14, Q, 2.2)}${e.label}</span>`)}</div>` : E}
      ${a.hours.length ? C`<div class="w-hours" style="grid-template-columns: repeat(${a.hours.length}, minmax(0, 1fr))">
            ${a.hours.map((e) => C`<div class="w-hour">
              <span class="w-ht">${e.t}</span>
              ${N(A(e.condition), 20, rs.includes(e.condition) ? Q : "rgba(255,255,255,0.85)", 2)}
              <span class="w-hv">${e.temp ?? "–"}°</span>
              <span class="w-hr">${e.rain}</span>
            </div>`)}
          </div>` : C`<div class="w-msg">Stündliche Werte gibt es erst näher am Tag.</div>`}
      ${a.temps.length > 1 ? Qo({
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
			caption: `${R(Math.min(...a.temps.map((e) => e.v)), 1)} – ${R(Math.max(...a.temps.map((e) => e.v)), 1)} °C`,
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
function ss(e, t) {
	let n = Rt[t], r = F(e.config, "weather"), i = e.forecast(), a = e.series(`weather:${t}:${i.hourly.length ? i.at : 0}`, () => Zi(e.hass, r, t, i.hourly), 6e5), o = [...a.past, ...a.future ?? []].map((e) => e.v), s = Number(e.hass.states[r]?.attributes[n.attr]), c = n.unit ? ` ${n.unit}` : "", l = o.length ? `${Number.isFinite(s) ? `jetzt ${R(s, n.digits)}${c} · ` : ""}${R(Math.min(...o), n.digits)} – ${R(Math.max(...o), n.digits)}${c}` : void 0, u = (e) => {
		let t = new Date(a.start + e * as);
		return `${String(t.getHours()).padStart(2, "0")} Uhr`;
	};
	return P({
		title: n.name,
		subtitle: "24 h zurück · 24 h Vorhersage",
		color: n.color,
		glow: `${n.color}33`,
		iconPath: es[t],
		onClose: e.closeSheet,
		onBack: () => e.openSheet({ id: "weather" }),
		body: C`${Qo({
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
var cs = o`
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
`, ls = [
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
], us = "#8fd8ff", ds = "rgba(255,255,255,0.65)", fs = {
	now: "rgba(48,209,88,0.28)",
	possible: "rgba(48,209,88,0.12)"
};
function ps(e, t, n) {
	return t ? Array.from({ length: 5 }, (r, i) => {
		let a = new Date(t + (n - t) * i / 5);
		return e === "24h" ? `${String(a.getHours()).padStart(2, "0")} Uhr` : `${a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")} ${String(a.getHours()).padStart(2, "0")}h`;
	}) : [];
}
function ms(e, t, n) {
	let r = e.rooms.find((e) => e.slug === t);
	if (!r) return E;
	let i = `sensor.${t}_taupunkt`, a = F(e.config, "outdoor_dew"), o = e.series(`dew:${t}:${n}`, () => qi(e.hass, {
		room: i,
		outdoor: a,
		airing: r.airing
	}, n), 3e5), s = I(e.hass, i), c = I(e.hass, a), l = [s === null ? "" : `innen ${R(s, 1)}°`, c === null ? "" : `außen ${R(c, 1)}°`].filter(Boolean).join(" · ");
	return P({
		title: "Taupunkt",
		subtitle: r.name,
		color: us,
		glow: `${us}33`,
		iconPath: j.drop,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: () => e.openSheet({
			id: "room",
			slug: t
		}),
		body: C`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${ls.map((r) => C`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "dew",
			slug: t,
			range: r.id
		})}>${r.name}</button>`)}
      </div>
      ${Qo({
			title: "Taupunkt",
			color: us,
			unit: "°C",
			digits: 1,
			snap: 2,
			data: o,
			caption: l || void 0,
			compareColor: ds,
			compareName: "außen",
			bandColors: fs,
			labels: ps(n, o.start, o.end)
		})}
      <div class="dw-legend">
        <span><i style="background:${us}"></i>innen</span>
        <span><i style="background:${ds}"></i>außen</span>
        <span><i class="dw-box" style="background:${fs.now}"></i>Jetzt lüften</span>
        <span><i class="dw-box" style="background:${fs.possible}"></i>Lüften möglich</span>
      </div>
      <p class="dw-hint">${N(j.drop, 13, "rgba(255,255,255,0.6)", 2.2)}Lüften trocknet, wenn der Taupunkt draußen unter dem im Raum liegt.</p>
    `
	});
}
var hs = o`
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
`, gs = "#ff9f0a", _s = "#ffd60a";
function vs(e, t, n, r, i) {
	return C`
    <div class="cr-row">
      <button class="cr-main" @click=${() => e.moreInfo(t.id)}>
        <span class="circle" style="width:40px;height:40px;background:${r}">${N(n, 18, "#141008", 2.2)}</span>
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
function ys(e) {
	let t = Gt(e.hass), n = Kt(e.hass, e.config), r = t.length + n.length;
	return P({
		title: "Wartung",
		subtitle: r ? `${r} ${r === 1 ? "Gerät braucht" : "Geräte brauchen"} Aufmerksamkeit` : "Alles in Ordnung",
		color: gs,
		glow: "rgba(255,159,10,0.22)",
		iconPath: k.battery,
		onClose: e.closeSheet,
		body: C`
      ${t.length ? C`<div class="section-head"><h2>Batterien</h2><span class="rule" aria-hidden="true"></span></div>
            ${t.map((t) => vs(e, t, k.battery, gs, {
			text: "Batterie getauscht? Das Datum wird in Battery Notes gespeichert.",
			button: "Getauscht"
		}))}` : E}
      ${n.length ? C`<div class="section-head"><h2>Filter</h2><span class="rule" aria-hidden="true"></span></div>
            ${n.map((t) => vs(e, t, k.filter, _s, {
			text: "Filter gereinigt oder getauscht? Der Zähler wird zurückgesetzt.",
			button: "Erledigt",
			hint: "am Gerät zurücksetzen"
		}))}` : E}
      ${r ? E : C`<p class="cr-empty">Keine schwachen Batterien und keine fälligen Filter.</p>`}
    `
	});
}
var bs = o`
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
`, xs = {
	cool: "Kühlen",
	dry: "Trocknen",
	fan_only: "Lüften",
	heat: "Heizen",
	auto: "Auto",
	heat_cool: "Auto",
	off: "Aus"
}, Ss = [
	"cool",
	"dry",
	"fan_only",
	"heat",
	"auto",
	"heat_cool",
	"off"
], Cs = {
	cool: "Kühlt",
	dry: "Trocknet",
	fan_only: "Lüftet",
	heat: "Heizt",
	auto: "Auto",
	heat_cool: "Auto",
	off: "Aus"
}, ws = {
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
}, Ts = {
	none: "Normal",
	away: "Abwesend",
	sleep: "Schlafen",
	boost: "Boost",
	eco: "Eco",
	comfort: "Komfort"
}, Es = /flust|fluest|silent|quiet|leise/;
function Ds(e, t) {
	let n = F(t, "ac"), r = e.states[n];
	if (!r) return null;
	let i = r.attributes, a = Ut(e, n), o = ht(e, n) ?? "", s = (t) => {
		let n = String(e.states[t]?.attributes.friendly_name ?? t);
		return n.startsWith(o) && o ? n.slice(o.length).trim() : n;
	}, c = I(e, a.find((t) => t.startsWith("sensor.") && /aussen|outdoor/.test(t) && e.states[t]?.attributes.device_class === "temperature")), l = I(e, F(t, "ac_power")), u = Number(i.current_temperature), d = Number.isFinite(Number(i.temperature)) && i.temperature !== null ? Number(i.temperature) : null, f = r.state === "off" || d === null || ["dry", "fan_only"].includes(r.state) ? Cs[r.state] ?? r.state : `${Cs[r.state] ?? r.state} auf ${((e) => `${R(e, e % 1 ? 1 : 0)}°`)(d)}`, p = [
		r.state === "unavailable" ? "Offline" : f,
		Number.isFinite(u) ? `innen ${R(u, 1)}°` : "",
		c === null ? "" : `außen ${R(c, 1)}°`,
		l !== null && l >= 1 ? `${R(Math.round(l))} W` : ""
	].filter(Boolean).join(" · "), m = i.hvac_modes ?? [], h = i.fan_modes ?? [], g = i.swing_modes ?? [], _ = a.filter((t) => t.startsWith("switch.") && !e.entities[t]?.hidden).map((t) => ({
		id: t,
		name: s(t),
		on: e.states[t]?.state === "on"
	})).sort((e, t) => Number(Es.test(t.id)) - Number(Es.test(e.id)));
	return {
		id: n,
		state: r.state,
		status: p,
		target: d,
		min: Number(i.min_temp) || 16,
		max: Number(i.max_temp) || 30,
		step: Number(i.target_temp_step) || 1,
		modes: Ss.filter((e) => m.includes(e)).map((e) => ({
			id: e,
			name: xs[e]
		})),
		fans: [...h.filter((e) => e === "auto"), ...h.filter((e) => e !== "auto")].map((e) => ({
			id: e,
			name: ws[e] ?? e
		})),
		fan: String(i.fan_mode ?? ""),
		presets: (i.preset_modes ?? []).map((e) => ({
			id: e,
			name: Ts[e] ?? e
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
var Os = "#8fd8ff", ks = {
	cool: j.snowflake,
	dry: j.drop,
	fan_only: j.fan,
	heat: j.flame,
	auto: "M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M9 15l3-7 3 7M10 13h4",
	heat_cool: "M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0",
	off: j.power
};
function As(e) {
	let t = Ds(e.hass, e.config);
	if (!t) return E;
	let n = t.state !== "off" && t.state !== "unavailable", r = e.target(t.id) ?? t.target, i = (n, r) => e.call("climate", n, r, { entity_id: t.id }), a = (t, n) => e.call("switch", n ? "turn_off" : "turn_on", {}, { entity_id: t });
	return P({
		title: "Klimaanlage",
		subtitle: t.status,
		color: n ? Os : "rgba(255,255,255,0.16)",
		glow: n ? "rgba(100,210,255,0.22)" : "rgba(255,255,255,0.06)",
		iconPath: j.snowflake,
		iconStroke: n ? "#08202c" : "#fff",
		onClose: e.closeSheet,
		body: C`
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
			return C`<button class="acs-mode ${n ? "active" : ""}" aria-pressed=${n} @click=${() => i("set_hvac_mode", { hvac_mode: e.id })}>
            ${N(ks[e.id] ?? j.power, 18, n ? "#08202c" : "#fff", 2.1)}<span>${e.name}</span>
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
			color: Os,
			iconPath: j.snowflake,
			onConfirm: () => e.call("button", "press", {}, { entity_id: t.selfClean })
		})}>Selbstreinigung</button>` : E}
        <button class="btn" @click=${() => {
			e.closeSheet(), e.moreInfo(t.id);
		}}>Details</button>
      </div>
    `
	});
}
var js = o`
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
`, Ms = 36e5, Ns = [
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
function Ps(e) {
	return e === "W" ? [{
		id: "4h",
		name: "4 h"
	}, ...Ns] : Ns;
}
var Fs = {
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
}, Is = {
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
function Ls(e, t, n) {
	if (!t) return [];
	let r = [];
	for (let i = 0; i < 5; i++) {
		let a = new Date(t + (n - t) * i / 5);
		e === "4h" ? r.push(`${String(a.getHours()).padStart(2, "0")}:${String(a.getMinutes()).padStart(2, "0")}`) : e === "24h" ? r.push(`${String(a.getHours()).padStart(2, "0")} Uhr`) : e === "7d" ? r.push(a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")) : r.push(`${a.getDate()}.${a.getMonth() + 1}.`);
	}
	return r;
}
function Rs(e, t, n, r, i) {
	if (t === "battery") return Bs(e, n);
	let { prefs: a } = e.energy(), o = Fs[t], s = Is[t], c = a ? {
		...Ci(a),
		...wi(a)
	} : null, l = "kWh", u, d, f = null, p = !0;
	if (s) l = "share", u = s.name, d = s.color, c && (f = () => Gi(e.hass, c, n, s.kind));
	else if (t === "cost") l = "€", u = "Stromkosten", d = "#ff9f0a", a && c && (f = () => Xi(e.hass, Ti(a), c, n));
	else if (t === "house") u = "Hausverbrauch", d = "#ffffff", c && (f = () => Ki(e.hass, c, n));
	else if (o) {
		u = o.name, d = o.color;
		let t = c ? c[o.ids] : [];
		t.length && (f = () => Wi(e.hass, t, n));
	} else u = r ?? e.config.names?.[t] ?? B(e.hass, t).replace(/\s*(device\s+)?(power|leistung)$/i, ""), d = "#ff9f0a", p = !1, l = "W", f = () => Ji(e.hass, t, n);
	let m = l === "share" ? "%" : l, h = f ? e.series(`energy:${t}:${n}:${l}`, f) : {
		loading: p && !a,
		error: a ? "nicht im Energie-Dashboard" : void 0,
		past: [],
		start: 0,
		end: 0
	}, g = h.past.reduce((e, t) => e + t.v, 0), _ = h.past.length ? l === "share" ? h.total == null ? void 0 : `gesamt ${h.total} % ${s.total}` : l === "€" ? `Summe ${R(g, 2)} €${h.total ? ` · Vergütung ${R(h.total, 2)} €` : ""}` : l === "kWh" ? `Summe ${R(g, g < 10 ? 2 : 1)} kWh` : `Ø ${R(g / h.past.length)} W · ${R(zi(h.past, h.step ?? Ms), 2)} kWh` : void 0, v = n === "4h" ? "5 Min" : n === "24h" ? "Stunde" : "Tag", y = {
		kWh: `kWh pro ${v}`,
		W: `mittlere Leistung pro ${v}`,
		share: `Anteil pro ${v}`,
		"€": `Netzbezug in € pro ${v}`
	}[l];
	return P({
		title: u,
		subtitle: y,
		color: d,
		glow: `${d}33`,
		iconPath: k.bolt,
		onClose: e.closeSheet,
		onBack: i ? () => e.openSheet(i) : void 0,
		body: C`
      <div class="tabs3" role="tablist" aria-label="Zeitraum" style=${`grid-template-columns:repeat(${Ps(l).length},minmax(0,1fr))`}>
        ${Ps(l).map((a) => C`<button role="tab" aria-selected=${a.id === n} class=${a.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "energyChart",
			key: t,
			range: a.id,
			name: r,
			back: i
		})}>${a.name}</button>`)}
      </div>
      ${Qo({
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
			labels: Ls(n, h.start, h.end)
		})}
    `
	});
}
var zs = (e, t, n) => C`
  <div class="tabs3" role="tablist" aria-label="Zeitraum">
    ${Ns.map((r) => C`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
      @click=${() => e.openSheet({
	id: "energyChart",
	key: t,
	range: r.id
})}>${r.name}</button>`)}
  </div>`;
function Bs(e, t) {
	let { prefs: n } = e.energy(), r = n ? wi(n) : null, i = I(e.hass, F(e.config, "battery_soc")), a = (r, i) => r?.length ? e.series(`energy:battery-${i}:${t}`, () => Wi(e.hass, r, t)) : {
		loading: !n,
		error: n ? "kein Akku im Energie-Dashboard" : void 0,
		past: [],
		start: 0,
		end: 0
	}, o = a(r?.batteryIn, "in"), s = a(r?.batteryOut, "out"), c = (e) => e.past.reduce((e, t) => e + t.v, 0), l = (e, n, r) => Qo({
		title: e,
		color: n,
		unit: "kWh",
		digits: 1,
		snap: .5,
		data: r,
		bars: !0,
		zero: !0,
		caption: r.past.length ? `Summe ${R(c(r), c(r) < 10 ? 2 : 1)} kWh` : void 0,
		labels: Ls(t, r.start, r.end)
	});
	return P({
		title: "Akku",
		subtitle: `${i === null ? "" : `Ladestand ${R(i)} % · `}kWh pro ${t === "24h" ? "Stunde" : "Tag"}`,
		color: "#30d158",
		glow: "#30d15833",
		iconPath: k.bolt,
		onClose: e.closeSheet,
		body: C`
      ${zs(e, "battery", t)}
      ${l("Geladen", "#30d158", o)}
      ${l("Entladen", "#ffd60a", s)}
    `
	});
}
// src/sheets/airing.ts
function Vs(e) {
	let { hass: t, now: n } = e, r = $n(t, e.rooms, e.config, n), i = () => e.runScript(F(e.config, "airing_start")), a = r.active || r.paused, o = a && r.duration ? Math.max(0, Math.min(100, r.remaining / r.duration * 100)) : 100, s = r.paused ? "pausiert" : r.active ? r.remaining > 0 ? "läuft" : "fertig" : "bereit", c = r.recommended.length === 1 ? r.recommended[0] : r.openWindows.length === 1 ? r.openWindows[0] : null;
	return P({
		title: c ? `Lüften · ${c.name}` : "Lüften",
		color: "#5ac8fa",
		glow: "rgba(90,200,250,0.24)",
		iconPath: k.wind,
		iconStroke: "#06202c",
		onClose: e.closeSheet,
		body: C`
      <div class="ringcard">
        <span class="ring" style="background: conic-gradient(#5ac8fa 0 ${o}%, rgba(255,255,255,0.1) ${o}% 100%)">
          <span class="ring-in">
            <span class="ring-time">${W(r.remaining)}</span>
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
            ${r.openWindows.map((e) => C`<span class="chip open">${N(k.window, 14, "#ff8a80", 2.4)}${e.name}
              <span class="chip-meta">${_t(gt(t, e.window, n))}</span></span>`)}
          </div>` : E}

      ${r.recommended.length ? C`
          <div class="section-head"><h2>Lüften empfohlen</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${r.recommended.map((e) => {
			let n = I(t, e.humidity);
			return C`<span class="chip rec">${N(j.drop, 14, "#8fd8ff", 2.4)}${e.name}${n === null ? E : C`<span class="chip-meta">${R(Math.round(n))} %</span>`}</span>`;
		})}
          </div>` : E}

      ${a ? C`<div class="confirm-row" style="margin-top:4px">
            <button class="btn" @click=${i}>Neu starten</button>
            <button class="btn primary" style="background:#5ac8fa;color:#06202c"
              @click=${() => e.call("timer", "cancel", {}, { entity_id: F(e.config, "airing_timer") })}>Stopp</button>
          </div>` : C`<button class="btn primary" style="background:#5ac8fa;color:#06202c;margin-top:4px"
            @click=${i}>Lüften starten</button>`}
    `
	});
}
var Hs = o`
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
function Us(e) {
	let t = F(e.config, "alarm"), n = e.hass.states[t]?.state ?? "unavailable";
	return P({
		title: uo(n),
		color: n === "triggered" ? "#ff453a" : "#bf9bff",
		glow: "rgba(191,155,255,0.22)",
		iconPath: Cn(n),
		iconStroke: "#1d1030",
		onClose: e.closeSheet,
		body: C`
      <div class="alarm-grid">
        ${lo.map((r) => {
			let i = r.state === n;
			return C`
            <button class="alarm-mode ${i ? "active" : ""}" aria-pressed=${i}
              @click=${() => {
				e.call("alarm_control_panel", r.service, {}, { entity_id: t }), e.closeSheet();
			}}>
              <span class="circle" style="width:44px;height:44px;background:${i ? "#1d1030" : "rgba(255,255,255,0.12)"}">
                ${N(k[r.icon], 20, i ? "#bf9bff" : "#e2d3ff", 2.1)}
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
var Ws = o`
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
`, Gs = "\n.maplibregl-ctrl-top-left .maplibregl-ctrl { margin: 10px 0 0 10px !important; }\n.maplibregl-ctrl-group {\n  background: none !important; box-shadow: none !important; border: none !important;\n  display: flex; flex-direction: column; gap: 6px;\n}\n.maplibregl-ctrl-group button {\n  width: 36px !important; height: 36px !important;\n  border: none !important; border-radius: 50% !important;\n  background: rgba(20, 22, 28, 0.72) !important;\n  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) !important;\n}\n.maplibregl-ctrl-group button + button { border-top: none !important; }\n.maplibregl-ctrl-group button .maplibregl-ctrl-icon { filter: brightness(0) invert(1); }\n.maplibregl-ctrl-group button:disabled .maplibregl-ctrl-icon { opacity: 0.35; }\n.maplibregl-ctrl-attrib {\n  background: rgba(20, 22, 28, 0.72) !important; color: rgba(255, 255, 255, 0.7) !important;\n  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n  border-radius: 14px !important; margin: 0 8px 8px 0 !important;\n}\n.maplibregl-ctrl-attrib a { color: rgba(255, 255, 255, 0.8) !important; }\n.maplibregl-ctrl-attrib-button { background-color: transparent !important; filter: brightness(0) invert(1); opacity: 0.7; }\n", Ks = class extends HTMLElement {
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
		n.className = "sd-map", n.textContent = Gs, t.appendChild(n);
	}
};
customElements.get("start-dashboard-map") || customElements.define("start-dashboard-map", Ks);
// src/sheets/persons.ts
var qs = "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0";
function Js(e) {
	let { hass: t } = e, n = So(t, e.config), r = Object.keys(t.states).filter((e) => e.startsWith("zone.")), i = [...n.map((e) => ({
		entity_id: e.id,
		color: ao[e.place],
		focus: !0
	})), ...r.map((e) => ({
		entity_id: e,
		focus: !1
	}))];
	return P({
		title: "Personen",
		subtitle: Co(n),
		color: "#30d158",
		glow: "rgba(48,209,88,0.2)",
		iconPath: qs,
		iconStroke: "#0b1a10",
		onClose: e.closeSheet,
		body: C`
      <div class="ps-map"><start-dashboard-map .hass=${t} .entities=${i}></start-dashboard-map></div>
      <div class="ps-list">
        ${n.map((n) => {
			let r = t.states[n.id];
			return C`<div class="ps-row">
            ${co(n, 44)}
            <span class="ps-text">
              <span class="ps-name">${n.name}</span>
              <span class="ps-sub">${n.zoneName}${r ? ` · ${wo(r.last_changed, e.now)}` : ""}</span>
            </span>
          </div>`;
		})}
      </div>
    `
	});
}
var Ys = o`
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
`, Xs = [
	"Dauerhaft",
	"1 h",
	"2 h",
	"4 h"
], Zs = 7, Qs = 25;
async function $s(e) {
	let t = e.allRooms, n = e.config;
	await e.call("input_number", "set_value", { value: t.temp }, { entity_id: F(n, "all_rooms_temperature") }), await e.call("input_text", "set_value", { value: er(e.rooms, t.selected) }, { entity_id: F(n, "all_rooms_selection") }), await e.call("input_select", "select_option", { option: t.duration }, { entity_id: F(n, "all_rooms_duration") }), await e.runScript(F(n, "all_rooms_apply"));
}
function ec(e) {
	let t = e.allRooms, n = qn(e.hass, e.rooms), r = (n) => e.setAllRooms({ temp: Math.min(Qs, Math.max(Zs, Math.round((t.temp + n) * 2) / 2)) }), i = (n) => {
		let r = new Set(t.selected);
		r.has(n) ? r.delete(n) : r.add(n), e.setAllRooms({ selected: r });
	}, a = t.selected.size;
	return P({
		title: "Alle Räume einstellen",
		color: "#ffffff",
		glow: "rgba(255,159,10,0.2)",
		iconPath: j.tune,
		iconStroke: "#101218",
		onClose: e.closeSheet,
		body: C`
      <div class="arcontrol">
        <button class="bigstep" aria-label="Senken" @click=${() => r(-.5)}>−</button>
        <div style="text-align:center">
          <div class="arbig">${R(t.temp, 1)}°</div>
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
            ${n ? N(k.check, 14, "#ffc061", 2.8) : ""}${e.name}</button>`;
		})}
      </div>

      <div class="section-head"><h2 style="font-size:14px">Wie lange</h2><span class="rule" aria-hidden="true"></span></div>
      <div class="durations" role="radiogroup" aria-label="Dauer">
        ${Xs.map((n) => C`<button role="radio" aria-checked=${t.duration === n} class=${t.duration === n ? "sel" : ""}
          @click=${() => e.setAllRooms({ duration: n })}>${n}</button>`)}
      </div>

      <button class="btn primary apply" ?disabled=${a === 0}
        @click=${async () => {
			await $s(e), e.closeSheet();
		}}>Übernehmen</button>
    `
	});
}
var tc = o`
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
`, nc = 300, rc = 20, ic = 120, ac = [
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
function oc(e, t, n) {
	let r = [];
	for (let i = 0; i < 4; i++) {
		let a = new Date(t + (n - t) * i / 4);
		e === "24h" ? r.push(i === 0 ? `${a.getHours()} Uhr` : String(a.getHours()).padStart(2, "0")) : e === "7d" ? r.push(a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")) : r.push(`${a.getDate()}.${a.getMonth() + 1}.`);
	}
	return r.push("jetzt"), r;
}
function sc(e, t, n) {
	let r = e === "temp", i = r ? "#ff9f0a" : "#5ac8fa", a = r ? nr(t, nc, rc, ic, .3, .3, 1) : nr(t, nc, rc, ic, 1, 1, 2), o = t.map((e) => e.v), s = o[o.length - 1], c = r ? "°" : " %", l = (e) => r ? R(e, 1) : R(Math.round(e)), u = o.length ? `${l(Math.min(...o))}${r ? "°" : ""} – ${l(Math.max(...o))}${c} · jetzt ${l(s)}${c}` : "keine Daten", d = (a.lo + a.hi) / 2, f = t.length > 1 ? t[t.length - 1].t - t[0].t : 0, p = n === "30d" ? 864e5 : 36e5, m = t.map((e, n) => ({
		x: Math.round(n / Math.max(1, t.length - 1) * nc * 10) / 10,
		y: a.y(e.v),
		time: zo(e.t, {
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
      <div class="sc-wrap" ${Ko({
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
              <text x="334" y=${a.y(e) - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${R(e, e % 1 ? 1 : 0)}°</text>`)}` : w`
              ${g ? w`
                <rect x="0" y=${rc} width="338" height=${Math.max(0, h - rc)} fill="rgba(255,255,255,0.04)"></rect>
                <line x1="0" y1=${h} x2="338" y2=${h} stroke="rgba(90,200,250,0.5)" stroke-dasharray="4 4"></line>
                <text x="4" y=${h - 4} fill="rgba(143,216,255,0.85)" font-size="10">60 % Lüftgrenze</text>` : E}
              <line x1="0" y1=${ic} x2="338" y2=${ic} stroke="rgba(255,255,255,0.08)"></line>
              <text x="334" y=${16} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${R(a.hi)} %</text>
              <text x="334" y=${116} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${R(a.lo)} %</text>`}
        ${a.area ? w`<polygon points=${a.area} fill=${r ? "rgba(255,159,10,0.16)" : "rgba(90,200,250,0.16)"}></polygon>` : E}
        ${a.line ? w`<polyline points=${a.line} fill="none" stroke=${i} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>` : E}
        ${a.last ? w`<circle cx=${a.last.x} cy=${a.last.y} r="4.5" fill=${i} stroke="#181a22" stroke-width="2"></circle>` : E}
      </svg>
      <div class="sc-layer"></div>
      </div>
    </figure>
  `;
}
function cc(e, t, n) {
	let r = e.rooms.find((e) => e.slug === t);
	if (!r) return E;
	let i = e.history(t, n), a = n === "24h" && !i.loading ? rr(i.hum, i.temp) : null, o = oc(n, i.start, i.end);
	return P({
		title: `${r.name} · Verlauf`,
		subtitle: n === "30d" ? "Tagesmittel" : "Stundenmittel",
		color: "#ff9f0a",
		glow: "rgba(255,159,10,0.12)",
		iconPath: k.thermo,
		onClose: e.closeSheet,
		onBack: () => e.openSheet({
			id: "room",
			slug: t
		}),
		body: C`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${ac.map((r) => C`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "history",
			slug: t,
			range: r.id
		})}>${r.name}</button>`)}
      </div>
      ${i.loading ? C`<div class="hist-msg">Lade Verlauf …</div>` : i.error ? C`<div class="hist-msg">Verlauf nicht verfügbar: ${i.error}</div>` : C`
            ${sc("temp", i.temp, n)}
            <div>
              ${sc("hum", i.hum, n)}
              <div class="xlabels">${o.map((e) => C`<span>${e}</span>`)}</div>
            </div>
            ${a ? C`<div class="insight">${N(k.wind, 16, "#8fd8ff", 2.2)}<span>${a}</span></div>` : E}`}
    `
	});
}
var lc = o`
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
function uc(e) {
	let t = (e, t, n) => ({
		value: e,
		label: "Fenster",
		icon: k.window,
		c: t,
		tint: n
	});
	switch (e.kind) {
		case "airing": return t(e.remaining > 0 ? `lüftet ${W(e.remaining)}` : "lüftet", "#5ac8fa", "rgba(90,200,250,0.14)");
		case "overdue": return t(`offen ${_t(e.openMin)} · ${e.reason}`, "#ff6b61", "rgba(255,69,58,0.14)");
		case "stuck": return t("Sensor prüfen", "#aeb4c0", "rgba(255,255,255,0.07)");
		case "open": return t("offen (ignoriert)", "#aeb4c0", "rgba(255,255,255,0.07)");
		default: return t("zu", "#7ee8a0", "rgba(255,255,255,0.07)");
	}
}
function dc(e, t) {
	let { hass: n } = e, r = e.rooms.find((e) => e.slug === t);
	if (!r) return E;
	let i = Wn(n, r, e.target(r.climate)), a = r.climate, o = i.heating ? "#ff9f0a" : i.vent ? "#5ac8fa" : "rgba(255,255,255,0.16)", s = i.heating ? "rgba(255,159,10,0.2)" : i.vent ? "rgba(90,200,250,0.2)" : "rgba(255,255,255,0.06)", c = e.heating().find((e) => e.slug === r.slug), l = c ? `Heizung prüfen · +${R(c.rise, 1)}° in ${c.hours} h ohne Heizbedarf` : i.off ? "Aus" : i.heating ? `heizt${i.valve === null ? "" : ` · Ventile ${i.valve} %`}` : "Soll erreicht", u = ni(n, r), d = ii(n, u.map((e) => e.id), e.sceneConfigs(), e.now), f = ti(n, r, e.config.names), p = I(n, F(e.config, "outdoor_dew")), m = L(n, F(e.config, "airing_timer")) === "active", h = [
		i.pm25 === null ? null : {
			value: R(i.pm25),
			label: "PM2.5",
			icon: j.leaf,
			c: i.aq,
			tint: i.aq + "1f"
		},
		i.dew === null ? null : {
			value: `${R(i.dew, 1)}°`,
			label: "Taupunkt",
			icon: j.drop,
			c: "#8fd8ff",
			tint: "rgba(143,216,255,0.12)",
			tap: () => e.openSheet({
				id: "dew",
				slug: t,
				range: "24h"
			})
		},
		r.window ? uc(e.window(r)) : null
	].filter((e) => !!e), g = [i.dew === null ? "" : `Taupunkt ${R(i.dew, 1)}°`, p === null ? "" : `außen ${R(p, 1)}°`].filter(Boolean).join(" vs. ");
	return P({
		title: r.name,
		color: o,
		glow: s,
		iconPath: Be(r.name, r.icon),
		iconStroke: i.heating || i.vent ? "#1a1206" : "#fff",
		onClose: e.closeSheet,
		headerExtra: C`
      <button class="histpill" aria-label="Verlauf Temperatur und Luftfeuchte"
        @click=${() => e.openSheet({
			id: "history",
			slug: t,
			range: "24h"
		})}>
        ${N(k.thermo, 14, "#ffc061", 2.4)}${U(i.cur)}°
        ${N(j.drop, 14, "#8fd8ff", 2.4)}${i.hum ?? "–"} %
        ${N(j.trend, 12, "rgba(255,255,255,0.7)", 2.6)}
      </button>`,
		body: C`
      <div class="tcard" style="background: linear-gradient(140deg, ${i.heating ? "rgba(255,159,10,0.3)" : "rgba(255,255,255,0.1)"}, rgba(255,255,255,0.05) 70%)">
        <div class="tcontrol">
          <button class="bigstep" aria-label="Soll senken" ?disabled=${!a} @click=${() => a && e.stepTarget(a, -.5)}>−</button>
          <div class="tcenter">
            <div class="tstate" style="color:${c ? "#ff9f0a" : i.heating ? "#ffd29a" : "rgba(255,255,255,0.75)"}">
              ${i.heating ? N(j.flame, 13, "#ffd29a", 2.4) : E}${l}
            </div>
            <div class="tbig" style="color:${i.heating ? "#ffc061" : "#fff"}">${U(i.target)}°</div>
            <div class="tsoll">Ist <strong>${U(i.cur)}°</strong></div>
          </div>
          <button class="bigstep" aria-label="Soll erhöhen" ?disabled=${!a} @click=${() => a && e.stepTarget(a, .5)}>+</button>
        </div>
        ${a ? C`<div class="presets" role="group" aria-label="Preset">
              ${Hn.map((t) => {
			let n = i.preset === t.id, r = i.presetTemps[t.id];
			return C`
                  <button class="rpreset ${n ? "active" : ""}" aria-pressed=${n}
                    @click=${() => e.call("climate", "set_preset_mode", { preset_mode: t.id }, { entity_id: a })}>
                    <span class="circle" style="width:32px;height:32px;background:${t.color}">${N(Ve[t.id], 16, "#101010", 2.3)}</span>
                    <span class="pname">${t.name}</span>
                    <span class="ptemp">${r === void 0 ? "–" : `${R(r, r % 1 ? 1 : 0)}°`}</span>
                  </button>`;
		})}
            </div>` : E}
      </div>

      ${u.length ? C`<div class="grid3" role="group" aria-label="Szenen">
            ${u.map((t, n) => {
			let r = t.off ? "rgba(255,255,255,0.14)" : ot[n % ot.length], i = t.off ? "#fff" : "#101010", a = d.has(t.id);
			return C`<button class="scene ${a ? "on" : ""}" aria-pressed=${a} style=${a ? `background:${t.off ? "rgba(255,255,255,0.2)" : r + "33"};box-shadow:0 0 18px ${t.off ? "rgba(255,255,255,0.08)" : r + "40"}` : ""}
                @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>
                <span class="circle" style="width:36px;height:36px;background:${r}">${t.off ? N(j.power, 16, i, 2.1) : st(t.icon, j.scene, i)}</span>
                <span class="ellipsis">${t.name}</span>
              </button>`;
		})}
          </div>` : E}

      ${h.length ? C`<div class="facts" style="grid-template-columns: repeat(${h.length}, minmax(0, 1fr))">
            ${h.map((e) => {
			let t = C`${N(e.icon, 18, e.c, 2)}<span class="fv">${e.value}</span><span class="fl">${e.label}</span>`;
			return "tap" in e && e.tap ? C`<button class="fact" style="background:${e.tint}" aria-label="${e.label}, Verlauf anzeigen" @click=${e.tap}>${t}</button>` : C`<div class="fact" style="background:${e.tint}">${t}</div>`;
		})}
          </div>` : E}

      ${i.airing ? C`<div class="airrow">
            <span class="circle" style="width:40px;height:40px;background:rgba(90,200,250,0.25)">${N(k.wind, 18, "#8fd8ff", 2.2)}</span>
            <span class="grow"><span class="t1s">${m ? "Lüften läuft" : i.airing}</span><span class="t2s">${g}</span></span>
            ${m ? C`<button class="airbtn" @click=${() => e.openSheet({ id: "airing" })}>Ansehen</button>` : i.airing === "Nicht lüften" ? E : C`<button class="airbtn" @click=${() => {
			e.runScript(F(e.config, "airing_start")), e.openSheet({ id: "airing" });
		}}>Start</button>`}
          </div>` : E}

      ${f.length ? C`<div class="grid2">
            ${f.map((n) => {
			let r = n.kind === "light" ? ui(e.hass.states[n.id]?.attributes ?? {}) : null, i = r ? r.color : "#30d158";
			return C`<button class="dev ${n.on ? "on" : ""} ${n.unavailable ? "na" : ""}" style=${n.on ? `background:${r ? r.bg : `${i}24`}` : ""}
                ${xr({
				tap: () => Ma(e, n.id),
				hold: () => e.openSheet({
					id: "device",
					entity: n.id,
					back: {
						id: "room",
						slug: t
					}
				})
			})}>
                <span class="circle" style="width:38px;height:38px;background:${n.on ? i : "rgba(255,255,255,0.12)"}">${N(He(n.id, n.name), 16, n.on ? r ? r.icon : "#0b1a10" : "#fff", 2)}</span>
                <span class="devtext"><span class="t1s ellipsis">${n.name}</span><span class="t2s ellipsis">${n.status}</span></span>
              </button>`;
		})}
          </div>` : E}
    `
	});
}
var fc = o`
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
`, pc, mc = "0.17.0", $ = [
	{
		id: "overview",
		name: "Übersicht",
		icon: k.home,
		milestone: 1
	},
	{
		id: "climate",
		name: "Klima",
		icon: k.thermo,
		milestone: 2
	},
	{
		id: "rooms",
		name: "Räume",
		icon: k.grid,
		milestone: 3
	},
	{
		id: "energy",
		name: "Energie",
		icon: k.bolt,
		milestone: 4
	},
	{
		id: "security",
		name: "Schutz",
		icon: k.shield,
		milestone: 4
	}
], hc = {
	overview: "radial-gradient(100% 30% at 0% 0%, rgba(110,90,200,0.34), transparent 70%), radial-gradient(80% 30% at 100% 40%, rgba(90,200,250,0.12), transparent 70%)",
	climate: "radial-gradient(100% 30% at 50% 0%, rgba(255,140,60,0.26), transparent 70%), radial-gradient(80% 30% at 0% 55%, rgba(90,200,250,0.12), transparent 70%)",
	rooms: "radial-gradient(100% 28% at 50% 0%, rgba(255,214,10,0.18), transparent 70%)",
	energy: "radial-gradient(100% 28% at 50% 0%, rgba(48,209,88,0.2), transparent 70%)",
	security: "radial-gradient(100% 28% at 50% 0%, rgba(191,155,255,0.22), transparent 70%)"
}, gc = 36e5, _c = {
	"24h": {
		ms: 24 * gc,
		bucket: gc,
		period: "hour"
	},
	"7d": {
		ms: 168 * gc,
		bucket: gc,
		period: "hour"
	},
	"30d": {
		ms: 720 * gc,
		bucket: 24 * gc,
		period: "day"
	}
}, vc = 700, yc = 15e3;
function bc() {
	let e = "ha-start-dashboard-font";
	if (document.getElementById(e)) return;
	let t = document.createElement("link");
	t.id = e, t.rel = "stylesheet", t.href = "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap", document.head.appendChild(t);
}
var xc = class extends Re {
	constructor(...e) {
		super(...e), this._page = "overview", this._sheet = null, this._confirm = null, this._now = /* @__PURE__ */ new Date(), this._roomsFilter = "all", this._consumersAll = !1, this._rooms = [], this._pending = {}, this._ui = {}, this._hdr = "", this._energy = {}, this._energyAt = 0, this._energyLoading = !1, this._series = {}, this._heating = {
			at: 0,
			loading: !1,
			alerts: []
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
		}, this._navDown = (e) => {
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
			let r = e.clientX - t.navLeft, i = Je(r, t.tabs);
			this._navDrag && i !== this._navDrag.hover && yr(this, "selection"), this._navDrag = {
				...Ye(r, t.width, t.barWidth, 6),
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
		this._config = e, this._page = e.page ?? "overview", this._roomsKey = void 0, e.load_font !== !1 && bc();
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
		super.disconnectedCallback(), window.clearInterval(this._tick), window.clearInterval(this._fastTick), this._fastTick = void 0, Rr(this);
	}
	updated(e) {
		let t = this._config?.header ?? "hide", n = Lr(this, t) ? t : "";
		if (n !== this._hdr && (this._hdr = n), e.has("_sheet") || e.has("hass")) {
			let e = this.hass && this._config ? this.hass.states[F(this._config, "airing_timer")] : void 0, t = this._sheet?.id === "airing" || e?.state === "active";
			t && !this._fastTick ? this._fastTick = window.setInterval(() => this._now = /* @__PURE__ */ new Date(), 1e3) : !t && this._fastTick && (window.clearInterval(this._fastTick), this._fastTick = void 0);
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
			(!t || e.some((e, n) => e !== t[n])) && (this._rooms = cr(this.hass, this._config), this._roomsKey = e);
		}
		if (this.hass && e.has("hass")) {
			let e = Date.now(), t = !1, n = { ...this._pending };
			for (let [r, i] of Object.entries(n)) {
				let [a, o] = r.split("|");
				(Number(this.hass.states[a]?.attributes[o]) === i.value && e - i.at > vc || e - i.at > yc) && (delete n[r], t = !0);
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
		}, window.clearTimeout(this._debounce[i]), this._debounce[i] = window.setTimeout(r, vc);
	}
	_stepTarget(e, t) {
		let n = this.hass?.states[e]?.attributes;
		if (!n) return;
		let r = Gn(this._target(e) ?? 19, t, Number(n.min_temp) || 7, Number(n.max_temp) || 30, Number(n.target_temp_step) || .5);
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
			let e = I(this.hass, F(this._config, "all_rooms_temperature")), t = this.hass.states[F(this._config, "all_rooms_duration")]?.state;
			this._allRooms = {
				temp: e !== null && e >= 7 ? e : 19,
				selected: new Set(this._rooms.map((e) => e.slug)),
				duration: t && Xs.includes(t) ? t : "Dauerhaft"
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
		let i = _c[t], a = Date.now(), o = Math.floor((a - i.ms) / i.bucket) * i.bucket, s = {
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
				s.length < 2 && (s = tr(t(a[0]), n, r, i.bucket)), c.length < 2 && (c = tr(t(a[1]), n, r, i.bucket));
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
		let e = F(this._config, "weather"), t = async (t) => (await this.hass.callWS({
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
		}, oa(this.hass, cr(this.hass, this._config), Di(this._config, this._energy.prefs), e ?? {}).then((e) => this._heating = {
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
	_windowState(e) {
		let t = this.hass, n = this._config, r = this._now, i = this._winMemo;
		if (!i || i.hass !== t || i.now !== r) {
			let e = cr(t, n);
			i = this._winMemo = {
				hass: t,
				now: r,
				rooms: e,
				key: la(t, e, r.getTime()).map((e) => e.slug).join(",")
			};
		}
		let { rooms: a, key: o } = i, s = this._stuck;
		!s.loading && (s.key !== o || Date.now() - s.at > 6e5) && (this._stuck = {
			...s,
			key: o,
			loading: !0
		}, ua(t, a, n).then((e) => this._stuck = {
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
		let c = un(t.states[F(n, "window_snooze")]?.state);
		return cn(t, e, n, r, {
			stuck: o ? s.key === o && s.slugs.includes(e.slug) : !1,
			snoozed: !!e.window && dn(c, e.window, r.getTime())
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
			let t = Ci(e);
			if (t.solar.length + t.import.length + t.export.length) {
				let n = await Yi(this.hass, {
					...t,
					...wi(e)
				}, Ti(e));
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
			runScript: (e, t) => this._call(...mt(e), t),
			target: (e) => this._target(e),
			stepTarget: (e, t) => this._stepTarget(e, t),
			history: (e, t) => this._historyFor(e, t),
			forecast: () => this._forecastData(),
			energy: () => this._energyInfo(),
			heating: () => this._heatingAlerts(),
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
			}
		};
	}
	render() {
		if (!this.hass || !this._config) return E;
		let e = this._ctx(), t = this._config.nav !== !1;
		return C`
      <div class="wrap ${this._hdr ? `hdr-${this._hdr}` : ""}" style="background-image:${hc[this._page]}">
        <main class="content">${this._renderPage(e)}</main>
        ${t ? this._renderNav() : E}
      </div>
      ${this._renderSheets(e)}
    `;
	}
	_renderPage(e) {
		if (this._page === "overview") return wa(e);
		if (this._page === "climate") return va(e);
		if (this._page === "rooms") return Ga(e);
		if (this._page === "energy") return no(e);
		if (this._page === "security") return Oo(e);
		let t = $.find((e) => e.id === this._page);
		return C`
      <header class="page-head">
        <div class="date">${bn(e.now)}</div>
        <h1>${t.name}</h1>
      </header>
      <div class="todo">
        <span class="circle" style="width:42px;height:42px;background:rgba(255,255,255,0.12)">${N(t.icon, 18, "#fff")}</span>
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
              ${N(e.icon, 20, "currentColor")}${r ? C`<span>${e.name}</span>` : E}
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
			let r = Mr(n);
			r && t.push({
				key: Nr(r),
				view: this._sheetView(e, r)
			}), t.push({
				key: Nr(n),
				view: this._sheetView(e, n)
			});
		}
		if (this._confirm && t.push({
			key: "confirm",
			view: ct({
				...this._confirm,
				onClose: () => this._confirm = null
			})
		}), !t.length) return E;
		let r = t.length - 1;
		return jr(t, (e) => e.key, (e, t) => C`
      <div class="layer ${t < r ? "under" : ""} ${t > 0 ? "stacked" : ""}" ?inert=${t < r}>${e.view}</div>`);
	}
	_sheetView(e, t) {
		switch (t.id) {
			case "persons": return Js(e);
			case "alarm": return Us(e);
			case "room": return dc(e, t.slug);
			case "history": return cc(e, t.slug, t.range);
			case "airing": return Vs(e);
			case "allRooms": return ec(e);
			case "device": return Ia(e, t.entity, t);
			case "robby": return Mo(e);
			case "weather": return is(e);
			case "care": return ys(e);
			case "ac": return As(e);
			case "energyChart": return Rs(e, t.key, t.range, t.name, t.back);
			case "weatherMetric": return ss(e, t.metric);
			case "dew": return ms(e, t.slug, t.range);
			case "weatherDay": return os(e, t.date);
		}
	}
};
pc = xc, pc.properties = {
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
	_navDrag: { state: !0 }
}, pc.styles = [
	fr,
	lt,
	Ta,
	ya,
	Ws,
	Ys,
	fc,
	lc,
	Hs,
	tc,
	Ya,
	Ua,
	io,
	ko,
	No,
	cs,
	hs,
	bs,
	js,
	$o,
	qo,
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
], customElements.get("ha-start-dashboard") || customElements.define("ha-start-dashboard", xc);
var Sc = window;
Sc.customCards = Sc.customCards ?? [], Sc.customCards.push({
	type: "ha-start-dashboard",
	name: "Start Dashboard",
	description: "Phone-first Start dashboard (Übersicht, Klima, Räume, Energie, Schutz) in one card.",
	preview: !1
}), console.info(`%c START-DASHBOARD %c ${mc} `, "background:#bf9bff;color:#1d1030;font-weight:700", "background:#181a22;color:#fff");
export { xc as HaStartDashboard };
