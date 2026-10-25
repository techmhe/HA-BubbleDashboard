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
var ie = globalThis, ae = (e) => e, oe = ie.trustedTypes, se = oe ? oe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ce = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + b, ue = `<${le}>`, x = document, de = () => x.createComment(""), fe = (e) => e === null || typeof e != "object" && typeof e != "function", pe = Array.isArray, me = (e) => pe(e) || typeof e?.[Symbol.iterator] == "function", he = "[ 	\n\f\r]", ge = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _e = /-->/g, ve = />/g, ye = RegExp(`>|${he}(?:([^\\s"'>=/]+)(${he}*=${he}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), be = /'/g, xe = /"/g, Se = /^(?:script|style|textarea|title)$/i, Ce = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), S = Ce(1), C = Ce(2), w = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), we = /* @__PURE__ */ new WeakMap(), E = x.createTreeWalker(x, 129);
function Te(e, t) {
	if (!pe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return se === void 0 ? t : se.createHTML(t);
}
var Ee = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = ge;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === ge ? c[1] === "!--" ? o = _e : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = ye) : (Se.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = ye) : o = ve : o === ye ? c[0] === ">" ? (o = i ?? ge, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? ye : c[3] === "\"" ? xe : be) : o === xe || o === be ? o = ye : o === _e || o === ve ? o = ge : (o = ye, i = void 0);
		let d = o === ye && e[t + 1].startsWith("/>") ? " " : "";
		a += o === ge ? n + ue : l >= 0 ? (r.push(s), n.slice(0, l) + ce + n.slice(l) + b + d) : n + b + (l === -2 ? t : d);
	}
	return [Te(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, De = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ee(t, n);
		if (this.el = e.createElement(l, r), E.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = E.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ce)) {
					let t = u[o++], n = i.getAttribute(e).split(b), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? je : r[1] === "?" ? Me : r[1] === "@" ? Ne : Ae
					}), i.removeAttribute(e);
				} else e.startsWith(b) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Se.test(i.tagName)) {
					let e = i.textContent.split(b), t = e.length - 1;
					if (t > 0) {
						i.textContent = oe ? oe.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], de()), E.nextNode(), c.push({
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
function D(e, t, n = e, r) {
	if (t === w) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = fe(t) ? void 0 : t._$litDirective$;
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? x).importNode(t, !0);
		E.currentNode = r;
		let i = E.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new ke(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Pe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = E.nextNode(), a++);
		}
		return E.currentNode = x, r;
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
		this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = D(this, e, t), fe(e) ? e === T || e == null || e === "" ? (this._$AH !== T && this._$AR(), this._$AH = T) : e !== this._$AH && e !== w && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? me(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== T && fe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
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
		let t = we.get(e.strings);
		return t === void 0 && we.set(e.strings, t = new De(e)), t;
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
}, Ae = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = T, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = T;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = D(this, e, t, 0), a = !fe(e) || e !== this._$AH && e !== w, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = D(this, r[n + o], t, o), s === w && (s = this._$AH[o]), a ||= !fe(s) || s !== this._$AH[o], s === T ? e = T : e !== T && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, je = class extends Ae {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === T ? void 0 : e;
	}
}, Me = class extends Ae {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== T);
	}
}, Ne = class extends Ae {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = D(this, e, t, 0) ?? T) === w) return;
		let n = this._$AH, r = e === T && n !== T || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== T && (n === T || r);
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
	M: ce,
	P: b,
	A: le,
	C: 1,
	L: Ee,
	R: Oe,
	D: me,
	V: D,
	I: ke,
	H: Ae,
	N: Me,
	U: Ne,
	B: je,
	F: Pe
}, Ie = ie.litHtmlPolyfillSupport;
Ie?.(De, ke), (ie.litHtmlVersions ??= []).push("3.3.3");
var Le = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new ke(t.insertBefore(de(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Re = globalThis, ze = class extends re {
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
		return w;
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
	tree: "M12 2l6 9h-3l4 6H5l4-6H6zM12 17v5"
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
		return w;
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
		}), ot(n)), w;
	}
});
// src/components/ui.ts
function j(e, t, n, r = 2.2) {
	return S`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke=${n} stroke-width=${r}
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
	return e && customElements.get("ha-icon") ? S`<ha-icon .icon=${e} style="--mdc-icon-size:${r}px;color:${n}"></ha-icon>` : j(t, r - 2, n, 2.1);
}
function M(e) {
	let t = e.onBack ?? e.onClose;
	return S`
    <div class="backdrop" @click=${t}></div>
    <section class="sheet" role="dialog" aria-modal="true" aria-label=${e.title}
      style="background-image: radial-gradient(100% 30% at 50% 0%, ${e.glow}, transparent 70%)"
      ${st(t)}
      @keydown=${(e) => e.key === "Escape" && t()}>
      <div class="grabber" aria-hidden="true"></div>
      <header class="sheet-head">
        ${e.onBack ? S`<button class="close back" aria-label="Zurück" @click=${e.onBack}>${j("M15 5l-7 7 7 7", 18, "#fff", 2.4)}</button>` : S`<span class="circle" style="width:44px;height:44px;background:${e.color}">${j(e.iconPath, 20, e.iconStroke ?? "#141008", 2)}</span>`}
        <span class="sheet-title">
          <h1 class="ellipsis">${e.title}</h1>
          ${e.subtitle ? S`<span class="sheet-sub">${e.subtitle}</span>` : ""}
        </span>
        ${e.headerExtra ?? ""}
        ${e.noClose ? "" : S`<button class="close" aria-label="Schließen" @click=${e.onClose}>${j(O.close, 16, "#fff", 2.4)}</button>`}
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
		body: S`
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
	gusts: "sensor.musterstadt_windboen",
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
function yt(e) {
	if (e < 60) return `${e} min`;
	let t = Math.floor(e / 60), n = e % 60;
	return n ? `${t} h ${n} min` : `${t} h`;
}
// src/logic/weather.ts
var bt = {
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
}, xt = [
	"N",
	"NO",
	"O",
	"SO",
	"S",
	"SW",
	"W",
	"NW"
];
function St(e) {
	return xt[Math.round((e % 360 + 360) % 360 / 45) % 8];
}
var Ct = (e, t) => e.toDateString() === t.toDateString(), z = (e) => I(e, 1);
function wt(e, t, n, r = /* @__PURE__ */ new Date()) {
	let i = e.states[N(t, "precipitation")]?.state;
	if (i !== void 0 && i !== "" && Number.isFinite(Number(i))) return Number(i);
	let a = new Date(r);
	a.setMinutes(0, 0, 0);
	let o = n.find((e) => new Date(e.datetime).getTime() === a.getTime());
	return o?.precipitation === void 0 ? null : o.precipitation;
}
function Tt(e, t, n, r = /* @__PURE__ */ new Date(), i = []) {
	let a = e.states[N(t, "weather")], o = a?.attributes ?? {}, s = Number(o.temperature), c = n[0], l = c && Ct(new Date(c.datetime), r) ? c : void 0, u = "";
	l?.temperature !== void 0 && (u = `heute ${l.templow === void 0 ? "" : `${Math.round(l.templow)}° – `}${Math.round(l.temperature)}°${l.precipitation ? ` · ${z(l.precipitation)} mm` : ""}`);
	let d = o.latest_update ? new Date(o.latest_update) : void 0, f = [/DWD|Deutscher Wetterdienst/.test(String(o.attribution ?? "")) ? "DWD" : "", d && !Number.isNaN(d.getTime()) ? `Stand ${d.getHours()} Uhr` : ""].filter(Boolean).join(" · "), p = [], m = (e) => o[e] !== void 0 && o[e] !== null && Number.isFinite(Number(o[e])), h = wt(e, t, i, r);
	h !== null && p.push({
		key: "precipitation",
		label: `Regen ${z(h)} mm/h`
	}), m("humidity") && p.push({
		key: "humidity",
		label: `Feuchte ${Math.round(o.humidity)} %`
	}), m("wind_speed") && p.push({
		key: "wind",
		label: `Wind ${Math.round(o.wind_speed)} ${o.wind_speed_unit ?? "km/h"}${m("wind_bearing") ? ` ${St(Number(o.wind_bearing))}` : ""}`
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
		label: bt[g] ?? g,
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
		rain: e.precipitation === void 0 ? "" : z(e.precipitation),
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
			rain: e.precipitation ? `${z(e.precipitation)} mm` : "",
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
		label: `Regen ${z(e.precipitation)} mm`
	}), e.sun_duration !== void 0 && o.push({
		key: "sun",
		label: `Sonne ${I(e.sun_duration / 3600, 1)} h`
	}), e.wind_speed !== void 0) {
		let t = e.wind_bearing === void 0 ? "" : ` ${St(e.wind_bearing)}`, n = e.wind_gust_speed === void 0 ? "" : ` · Böen ${Math.round(e.wind_gust_speed)}`;
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
		label: bt[e.condition ?? ""] ?? e.condition ?? "",
		condition: e.condition ?? "",
		max: e.temperature === void 0 ? null : Math.round(e.temperature),
		min: e.templow === void 0 ? null : Math.round(e.templow),
		facts: o,
		hours: a.filter((e) => new Date(e.datetime).getHours() % 3 == 0).map((e) => ({
			t: String(new Date(e.datetime).getHours()).padStart(2, "0"),
			temp: e.temperature === void 0 ? null : Math.round(e.temperature),
			rain: e.precipitation ? z(e.precipitation) : "",
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
function At(e, t, n) {
	if (t !== null && t >= 60) return {
		title: "Jetzt stürmisch",
		text: `Böen bis ${Math.round(t)} km/h`
	};
	let r = e.find((e) => (e.wind_gust_speed ?? 0) >= 60);
	if (!r) return null;
	let i = new Date(r.datetime);
	return {
		title: `${Ct(i, n) ? "Heute" : i.toLocaleDateString("de-DE", { weekday: "long" })} stürmisch`,
		text: `Böen bis ${Math.round(r.wind_gust_speed)} km/h${r.precipitation ? ` · ${z(r.precipitation)} mm Regen` : ""}`
	};
}
function jt(e, t) {
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
var Mt = /_(current_warning_level|advance_warning_level|aktuelle_warnstufe|vorwarnstufe)$/, Nt = [
	"#7ee8a0",
	"#ffd60a",
	"#ff9f0a",
	"#ff453a",
	"#bf5af2"
];
function Pt(e, t) {
	return t.warnings ? t.warnings : Object.keys(e.states).filter((t) => t.startsWith("sensor.") && (e.entities[t]?.platform === "dwd_weather_warnings" || Mt.test(t)));
}
function Ft(e, t) {
	if (Ct(e, t)) return "heute";
	let n = new Date(t);
	return n.setDate(t.getDate() + 1), Ct(e, n) ? "morgen" : e.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
}
var It = (e) => e.toLocaleTimeString("de-DE", {
	hour: "2-digit",
	minute: "2-digit"
});
function Lt(e, t, n, r) {
	if (n || e && e <= r) return t ? Ct(t, r) ? `bis ${It(t)}` : `bis ${Ft(t, r)} ${It(t)}` : "jetzt";
	if (!e) return "";
	let i = `${Ft(e, r)} ${It(e)}`;
	return t ? Ct(e, t) ? `${i} – ${It(t)}` : `${i} – ${Ft(t, r)} ${It(t)}` : `ab ${i}`;
}
var Rt = (e) => e.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (e, t, n) => t + n.toUpperCase());
function zt(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let i of Pt(e, t)) {
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
				title: i("name") ? Rt(String(i("name"))) : String(i("headline")),
				headline: String(i("headline") ?? i("name")),
				text: String(i("description") ?? ""),
				level: o,
				color: typeof i("color") == "string" && i("color") ? String(i("color")) : Nt[Math.min(o, 4)],
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
		when: Lt(e, t, r.current, n),
		start: e?.toISOString()
	})).sort((e, t) => Number(t.current) - Number(e.current) || t.level - e.level);
}
var Bt = {
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
function Vt(e, t, n) {
	let r = Bt[e].attr;
	return {
		past: t.map((e) => ({
			t: Math.round(e.lu * 1e3),
			v: Number(e.a?.[r])
		})).filter((e) => Ht(e.v)),
		future: n.map((t) => {
			let n = Number(t[r]);
			return e === "visibility" && n > 200 && (n /= 1e3), {
				t: Date.parse(t.datetime),
				v: n
			};
		}).filter((e) => Ht(e.v) && Number.isFinite(e.t))
	};
}
var Ht = (e) => Number.isFinite(e), Ut = 10, Wt = /zurucksetzen|zuruecksetzen|reset/;
function Gt(e, t) {
	let n = e.entities[t]?.device_id;
	return n ? Object.values(e.entities).filter((e) => e.device_id === n).map((e) => e.entity_id) : [];
}
function Kt(e, t, n) {
	return Gt(e, t).find((e) => e.startsWith("button.") && n.test(e));
}
function qt(e) {
	return Bn(e).map((t) => {
		let n = Gt(e, t.id).find((e) => e.startsWith("sensor.") && e.endsWith("_battery_type")), r = n ? F(e, n) : void 0, i = r && ![
			"unknown",
			"unavailable",
			""
		].includes(r);
		return {
			id: t.id,
			name: t.name,
			detail: i ? `${I(t.level)} % · ${r}` : `${I(t.level)} %`,
			reset: Kt(e, t.id, /_battery_replaced$/)
		};
	});
}
function Jt(e, t) {
	let n = [], r = (t) => _t(e, t) ?? R(e, t), i = (t) => Kt(e, t, RegExp(`filter.*(${Wt.source})|(${Wt.source}).*filter`));
	for (let a of ht(t)) F(e, a) === "on" && n.push({
		id: a,
		name: r(a),
		detail: "Filter reinigen",
		reset: i(a)
	});
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.endsWith("filter_life")) continue;
		let a = P(e, t);
		a !== null && a < Ut && n.push({
			id: t,
			name: r(t),
			detail: `Filter ${I(a)} %`,
			reset: i(t)
		});
	}
	return n;
}
// src/logic/robby.ts
var Yt = {
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
function Xt(e, t) {
	let n = e.states[N(t, "vacuum")], r = F(e, N(t, "vacuum_status")) ?? n?.state ?? "unavailable", i = P(e, N(t, "vacuum_battery")) ?? (Number.isFinite(Number(n?.attributes.battery_level)) ? Number(n.attributes.battery_level) : null), a = F(e, N(t, "vacuum_error")), o = n?.state === "error" || r === "error" || !!a && ![
		"none",
		"unknown",
		"unavailable",
		""
	].includes(a), s = r === "unavailable" ? "Offline" : r === "charging" && i !== null && i >= 100 ? "Geladen" : Yt[r] ?? r;
	return {
		label: i === null ? s : `${s} · ${Math.round(i)} %`,
		battery: i,
		cleaning: n?.state === "cleaning" || /cleaning/.test(r),
		docked: n?.state === "docked",
		error: o
	};
}
var Zt = [
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
function Qt(e, t) {
	let n = N(t, "vacuum"), r = n.split(".")[1], i = [];
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.includes(r) || !t.endsWith("_minutes")) continue;
		let a = t.slice(7).replace(/^sensor_/, ""), o = Zt.find(([e]) => e.test(a)), s = o?.[1];
		if (!o || !s || i.some((e) => e.name === s)) continue;
		let c = P(e, t);
		c !== null && i.push({
			id: t,
			name: s,
			due: c <= 0,
			value: c <= 0 ? "fällig" : `${Math.round(c / 60)} h`,
			reset: Kt(e, n, RegExp(`${o[2].source}.*(${Wt.source})`))
		});
	}
	let a = Zt.map(([, e]) => e);
	return i.sort((e, t) => a.indexOf(e.name) - a.indexOf(t.name));
}
var $t = {
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
function en(e, t) {
	let n = e.states[N(t, "vacuum_map")]?.attributes.options ?? Object.keys($t), r = t.vacuum_maps ?? $t;
	return n.filter((e) => e !== "custom").map((e) => ({
		name: e,
		rooms: Object.entries(r[e] ?? {}).map(([e, t]) => ({
			segment: Number(e),
			name: t
		})).filter((e) => Number.isFinite(e.segment)).sort((e, t) => e.segment - t.segment)
	}));
}
function tn(e, t) {
	return (F(e, N(t, "vacuum_selection")) ?? "").split(",").map((e) => e.trim()).filter((e) => /^\d+$/.test(e)).map(Number);
}
var nn = [
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
function rn(e) {
	return e.vacuum_programs ?? nn;
}
function an(e) {
	return e <= 0 ? "Raum wählen" : e === 1 ? "1 Raum starten" : `${e} Räume starten`;
}
var on = [
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
], sn = [
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
], cn = [
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
function ln(e, t) {
	return e.kind === "overdue" ? "alert" : e.kind === "airing" ? "vent" : t ? "heat" : "";
}
function un(e) {
	return e < 60 ? `${e} min` : `${Math.floor(e / 60)} h`;
}
function dn(e, t, n, r, i = {}) {
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
var fn = (e) => e.split(".").pop();
function pn(e) {
	let t = {};
	for (let n of (e ?? "").split(";")) {
		let [e, r] = n.split("@"), i = parseInt(r ?? "", 36);
		e && Number.isFinite(i) && (t[e] = i * 6e4);
	}
	return t;
}
function mn(e, t, n) {
	return (e[fn(t)] ?? 0) > n;
}
function hn(e, t, n, r) {
	let i = fn(t), a = [[i, n], ...Object.entries(pn(e)).filter(([e]) => e !== i)].filter(([, e]) => e > r).sort((e, t) => t[1] - e[1]).map(([e, t]) => `${e}@${Math.ceil(t / 6e4).toString(36)}`);
	for (; a.join(";").length > 255;) a.pop();
	return a.join(";");
}
function gn(e, t, n, r) {
	if (r === null || e.length < 4) return !1;
	let i = [...e].reverse().find((e) => e.t <= n) ?? e[0], a = e.filter((e) => e.t > n);
	if (!a.length || i.v - r < 3) return !1;
	let o = i.v - Math.min(...a.map((e) => e.v)), s = t.map((e) => e.v), c = s.length ? Math.max(...s) - Math.min(...s) : 0;
	return o < .3 && c < 3;
}
// src/logic/overview.ts
var _n = "dashboard_gerat", vn = 60, yn = 5, bn = 15, xn = 10;
function Sn(e) {
	let t = e.getHours();
	return t >= 5 && t < 11 ? "Guten Morgen" : t >= 11 && t < 18 ? "Guten Tag" : t >= 18 && t < 23 ? "Guten Abend" : "Gute Nacht";
}
function Cn(e) {
	return e.toLocaleDateString("de-DE", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
var wn = {
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
function Tn(e, t) {
	let n = e.states[t], r = n ? Number(n.attributes.temperature) : NaN;
	return {
		temp: Number.isFinite(r) ? `${I(Math.round(r))}°` : "–",
		label: n ? wn[n.state] ?? n.state : "Wetter",
		icon: He(n?.state ?? "")
	};
}
function En(e) {
	return {
		armed_away: O.car,
		armed_vacation: O.car,
		armed_home: O.home,
		armed_night: O.moon
	}[e] ?? O.shield;
}
var Dn = {
	docked: "Dockt",
	cleaning: "Saugt",
	returning: "Fährt heim",
	paused: "Pause",
	idle: "Bereit",
	error: "Fehler",
	unavailable: "Offline"
}, On = {
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
function kn(e) {
	let t = Object.keys(e.states).filter((t) => t.startsWith("light.") && !Array.isArray(e.states[t].attributes.entity_id) && !e.entities[t]?.hidden), n = t.filter((t) => e.entities[t]?.labels?.includes(_n));
	return n.length ? n : t;
}
function An(e) {
	return kn(e).filter((t) => e.states[t].state === "on");
}
function jn(e, t) {
	let n = P(e, N(t, "grid_import")) ?? 0, r = P(e, N(t, "grid_export")) ?? 0;
	return r > n && r > 0 ? {
		value: `${I(Math.round(r))} W`,
		label: "Einspeisung"
	} : {
		value: `${I(Math.round(n))} W`,
		label: "Netzbezug"
	};
}
function Mn(e, t) {
	let n = F(e, N(t, "vacuum")) ?? "unavailable", r = F(e, N(t, "alarm")) ?? "unavailable", i = jn(e, t);
	return [
		{
			key: "robby",
			value: n === "docked" && (Xt(e, t).battery ?? 0) >= 100 ? "Geladen" : Dn[n] ?? n,
			label: "Robby",
			icon: O.vacuum,
			color: n === "error" ? "#ff453a" : "#ffffff"
		},
		{
			key: "light",
			value: `${An(e).length} an`,
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
			value: On[r] ?? r,
			label: "Alarm",
			icon: En(r),
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
var Nn = (e, t) => !!t && F(e, t) === "on";
function Pn(e, t, n, r, i = [], a = (n) => dn(e, n, t, r)) {
	let o = [], s = e.states, c = N(t, "front_door");
	if (F(e, N(t, "alarm")) === "triggered" && o.push(V("alarm", "Alarm ausgelöst", "Jetzt prüfen", O.shield, B.red, "alarm")), Nn(e, c) && vt(e, c, r) >= yn && o.push(V("door", "Haustür offen", `seit ${yt(vt(e, c, r))}`, O.door, B.red, { moreInfo: c })), i.length) {
		let e = i.map((e) => `${e.name} +${I(e.rise, 1)}°`).join(" · ");
		o.push(V("heat", "Heizung prüfen", `${e} in ${i[0].hours} h ohne Heizbedarf`, O.thermo, B.orange, { room: i[0].slug }));
	}
	let l = zt(e, t, r).filter((e) => e.current), u = P(e, N(t, "gusts"));
	if (l.length) {
		let [e, ...t] = l, n = [e.when, ...t.map((e) => `${e.title} ${e.when}`)].filter(Boolean).join(" · ");
		o.push(V("warn", `${e.level >= 3 ? "Unwetterwarnung" : "Warnung"}: ${e.title}`, n, O.storm, [e.color, `${e.color}44`], "weather"));
	} else u !== null && u >= vn && o.push(V("storm", "Sturmböen", `Böen bis ${I(Math.round(u))} km/h`, O.storm, B.purple, "weather"));
	let d = s[N(t, "airing_timer")];
	if (d && d.state === "active") {
		let i = nr(e, n, t, r), a = i.openWindows.map((e) => e.name), s = [`noch ${U(i.remaining)}`, a.length ? `${a.join(", ")} offen` : ""].filter(Boolean).join(" · ");
		o.push(V("airing", "Lüften läuft", s, O.wind, B.blue, "airing"));
	} else {
		let r = n.filter((t) => F(e, t.airing) === "Jetzt lüften");
		if (r.length) {
			let n = r.map((t) => {
				let n = P(e, t.humidity);
				return n === null ? t.name : `${t.name} ${I(Math.round(n))} %`;
			}), i = P(e, N(t, "airing_duration"));
			i !== null && n.push(`${I(Math.round(i))} min`), o.push(V("airing", "Jetzt lüften", n.join(" · "), O.wind, B.blue, "airing", {
				kind: "service",
				label: "Start",
				domain: gt(N(t, "airing_start"))[0],
				service: gt(N(t, "airing_start"))[1],
				data: {}
			}));
		}
	}
	let f = N(t, "window_snooze");
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
			data: { value: hn(s[f].state, t.window, r.getTime() + 36e5, r.getTime()) }
		} : void 0;
		if (n.kind === "overdue") o.push(V(`window:${t.slug}`, "Fenster schließen", `${t.name} · ${yt(n.openMin)} · ${n.reason}`, O.window, B.red, { room: t.slug }, i));
		else {
			let n = F(e, t.window) === "unavailable" ? "Sensor nicht erreichbar" : "meldet offen, Raum bleibt gleich";
			o.push(V(`sensor:${t.slug}`, "Fenstersensor prüfen", `${t.name} · ${n}`, O.window, B.grey, { room: t.slug }, i));
		}
	}
	for (let t of Object.keys(s).filter((e) => /^input_boolean\..+_fertig$/.test(e))) {
		if (s[t].state !== "on") continue;
		let n = R(e, t).replace(/\s*fertig$/i, "");
		o.push(V(t, `${n} fertig`, "Bitte ausräumen", O.washer, B.green, null, {
			kind: "service",
			label: "OK",
			domain: "input_boolean",
			service: "turn_off",
			data: {},
			target: { entity_id: t }
		}));
	}
	let p = N(t, "vacuum"), m = F(e, p), h = F(e, N(t, "vacuum_status"));
	if (m === "error" || h === "error") {
		let e = s[p]?.attributes.error ?? s[p]?.attributes.status ?? "Bitte prüfen";
		o.push(V("robby-error", "Robby: Fehler", String(e), O.vacuum, B.red, "robby"));
	}
	let g = In(e, p);
	g.length && o.push(V("robby-due", "Robby: Wartung fällig", `${Fn(g)} reinigen`, O.vacuum, B.orange, "robby"));
	let _ = Rn(e, t, r);
	_ && o.push(_);
	let v = zn(e, t);
	v.length && o.push(V("filter", "Filter prüfen", v.join(" · "), O.filter, B.yellow, "care"));
	let y = Bn(e);
	return y.length && o.push(V("battery", y.length === 1 ? "Batterie schwach" : `${y.length} Batterien schwach`, y.map((e) => `${e.name} ${I(e.level)} %`).join(" · "), O.battery, B.orange, "care")), o;
}
function Fn(e) {
	return e.length <= 1 ? e.join("") : `${e.slice(0, -1).join(", ")} & ${e[e.length - 1]}`;
}
function In(e, t) {
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
function Ln(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function Rn(e, t, n) {
	let r = N(t, "waste"), i = e.states[r];
	if (!i) return null;
	let a = Number(i.attributes.daysTo);
	if (!Number.isFinite(a) || a < 0 || a > 1) return null;
	let o = new Date(n);
	o.setDate(o.getDate() + a);
	let s = i.attributes[Ln(o)];
	return V("waste", a === 0 ? "Müll heute" : "Müll morgen", typeof s == "string" ? s : "Abfuhr", O.trash, B.green, { moreInfo: r });
}
function zn(e, t) {
	let n = [];
	for (let r of ht(t)) F(e, r) === "on" && n.push(_t(e, r) ?? R(e, r));
	for (let t of Object.keys(e.states)) {
		if (!t.startsWith("sensor.") || !t.endsWith("filter_life")) continue;
		let r = P(e, t);
		r !== null && r < xn && n.push(`${_t(e, t) ?? R(e, t)} ${I(r)} %`);
	}
	return n;
}
function Bn(e) {
	let t = [];
	for (let [n, r] of Object.entries(e.states)) {
		if (!n.startsWith("sensor.") || r.attributes.device_class !== "battery" || /robby|phone|iphone|handy|pixel|ipad|watch|_plus$/.test(n)) continue;
		let i = P(e, n);
		if (i === null || i >= bn) continue;
		let a = _t(e, n) ?? R(e, n).replace(/\s*(Batterie|Battery)$/i, "");
		t.push({
			id: n,
			name: a,
			level: i
		});
	}
	return t.sort((e, t) => e.level - t.level);
}
function Vn(e) {
	return e === null ? null : e <= 12 ? "#30d158" : e <= 35 ? "#ffd60a" : "#ff453a";
}
function Hn(e, t, n = (t) => dn(e, t, {}, /* @__PURE__ */ new Date())) {
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
			aq: t.pm25 ? Vn(P(e, t.pm25)) : null
		};
	});
}
var Un = /* @__PURE__ */ new Set([
	"alarm",
	"door",
	"warn",
	"heat",
	"window",
	"sensor"
]);
function Wn(e) {
	let t = e.filter((e) => e.action || Un.has(e.id.split(":")[0])), n = e.filter((e) => !t.includes(e));
	return [...t.map((e) => ({
		item: e,
		wide: !0
	})), ...n.map((e, t) => ({
		item: e,
		wide: n.length % 2 == 1 && t === n.length - 1
	}))];
}
// src/logic/climate.ts
var Gn = [
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
function Kn(e) {
	let t = {};
	if (typeof e == "string") try {
		t = JSON.parse(e);
	} catch {
		t = {};
	}
	else e && typeof e == "object" && (t = e);
	let n = {};
	for (let e of Gn) {
		let r = Number(t[`${e.id}_temp`]);
		Number.isFinite(r) && r > 0 && (n[e.id] = r);
	}
	return n;
}
function qn(e, t, n) {
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
		presetTemps: Kn(i.preset_temperatures),
		min: Number(i.min_temp) || 7,
		max: Number(i.max_temp) || 30,
		step: Number(i.target_temp_step) || .5,
		pm25: h,
		aq: t.pm25 ? Vn(h) : null,
		fanOn: !!t.purifier && F(e, t.purifier) === "on",
		windowOpen: d,
		airing: f,
		label: l ? "Aus" : d ? "lüftet" : u ? "heizt" : "Soll erreicht"
	};
}
function Jn(e, t, n, r, i = .5) {
	let a = Math.round((e + t) / i) * i;
	return Math.min(r, Math.max(n, Math.round(a * 10) / 10));
}
function H(e, t = 1) {
	return e === null ? "–" : I(e, t);
}
var Yn = {
	OG: "Obergeschoss",
	EG: "Erdgeschoss",
	UG: "Untergeschoss",
	DG: "Dachgeschoss",
	KG: "Keller"
};
function Xn(e, t) {
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
			name: Yn[r] ?? r,
			rooms: n
		};
	});
}
function Zn(e, t) {
	let n = L(e, t);
	return n ? e.areas[n]?.floor_id ?? void 0 : void 0;
}
function Qn(e) {
	let t = e.filter((e) => e !== null);
	return t.length ? t.reduce((e, t) => e + t, 0) / t.length : null;
}
function $n(e, t) {
	let n = t.map((t) => qn(e, t)), r = n.filter((e) => e.heating).length, i = n.map((e) => e.pm25).filter((e) => e !== null), a = i.length ? Math.max(...i) : null, o = a === null ? "" : a <= 12 ? "Luft überall gut" : a <= 35 ? "Luft teils mäßig" : "Luft schlecht", s = r ? `${r} von ${t.length} Räumen heizen` : "Kein Raum heizt";
	return o ? `${s} · ${o}` : s;
}
function er(e, t, n) {
	let r = N(n, "weather"), i = P(e, N(n, "outdoor_temp")) ?? (Number(e.states[r]?.attributes.temperature) || null), a = e.states[r]?.attributes.humidity, o = Number.isFinite(Number(a)) ? Number(a) : null, s = P(e, N(n, "outdoor_dew")), c = Qn(t.map((t) => P(e, `sensor.${t.slug}_taupunkt`))), l = "";
	return s !== null && c !== null && (l = s < c - 1 ? "draußen trockener" : s > c + 1 ? "draußen feuchter" : "ähnlich feucht"), {
		title: [i === null ? "Außen" : `Außen ${I(i, 1)}°`, o === null ? "" : `${I(Math.round(o))} %`].filter(Boolean).join(" · "),
		sub: [s === null ? "" : `Taupunkt ${I(s, 1)}°`, l].filter(Boolean).join(" · "),
		minutes: P(e, N(n, "airing_duration"))
	};
}
function tr(e) {
	if (typeof e != "string") return 0;
	let t = e.split(":").map(Number);
	return t.some((e) => !Number.isFinite(e)) ? 0 : t.reduce((e, t) => e * 60 + t, 0);
}
function nr(e, t, n, r) {
	let i = e.states[N(n, "airing_timer")], a = P(e, N(n, "airing_duration")), o = tr(i?.attributes.duration) || (a ?? 15) * 60, s = a === null ? o : a * 60, c = i?.state === "active", l = i?.state === "paused";
	return c && i?.attributes.finishes_at ? s = Math.max(0, Math.round((new Date(i.attributes.finishes_at).getTime() - r.getTime()) / 1e3)) : l && (s = tr(i?.attributes.remaining)), {
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
function rr(e, t) {
	let n = e.filter((e) => t.has(e.slug));
	return n.length === e.length ? "" : n.map((e) => e.climate?.replace(/^climate\.vtherm_/, "")).filter((e) => !!e && !e.includes(".")).join(",");
}
function ir(e, t, n, r) {
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
function ar(e, t, n, r, i, a, o) {
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
function or(e, t) {
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
function sr(e, t, n, r, i, a, o = {}) {
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
var cr = {
	"Jetzt lüften": "now",
	"Lüften möglich": "possible"
};
function lr(e, t, n) {
	let r = [...e].sort((e, t) => e.lu - t.lu), i = [];
	return r.forEach((e, a) => {
		let o = cr[e.s];
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
var ur = /^sensor\.(.+)_luftung$/;
function dr(e, t) {
	return (t.rooms?.length ? t.rooms : fr(e)).map((t) => mr(e, t));
}
function fr(e) {
	return Object.keys(e.states).map((e) => ur.exec(e)?.[1]).filter((e) => !!e && !e.startsWith("aussen")).map((e) => ({ slug: e }));
}
function pr(e, t, n, r) {
	if (n.length) return Object.keys(e.states).find((i) => i.startsWith(t + ".") && n.includes(L(e, i) ?? "") && r(i));
}
function mr(e, t) {
	let n = e.states, r = t.areas?.length ? t.areas : e.areas[t.slug] ? [t.slug] : (() => {
		let n = L(e, `sensor.${t.slug}_temperature`);
		return n ? [n] : [];
	})(), i = (e) => n[e]?.attributes.device_class, a = t.climate ?? (n[`climate.vtherm_${t.slug}`] ? `climate.vtherm_${t.slug}` : void 0) ?? pr(e, "climate", r, () => !0), o = r[0] ? e.areas[r[0]] : void 0, s = t.name ?? o?.name ?? String(n[`sensor.${t.slug}_luftung`]?.attributes.friendly_name ?? t.slug).replace(/\s*Lüftung$/i, "");
	return {
		...t,
		name: s,
		areas: r,
		climate: a,
		floor: t.floor ?? o?.floor_id ?? void 0,
		pm25: t.pm25 ?? pr(e, "sensor", r, (e) => i(e) === "pm25"),
		purifier: t.purifier ?? pr(e, "fan", r, () => !0),
		window: t.window ?? pr(e, "binary_sensor", r, (e) => ["window", "opening"].includes(i(e))),
		temperature: `sensor.${t.slug}_temperature`,
		humidity: `sensor.${t.slug}_humidity`,
		airing: `sensor.${t.slug}_luftung`
	};
}
// src/styles.ts
var hr = o`
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
function gr(e, t = 400) {
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
var _r = 500, vr = 10, yr = /* @__PURE__ */ new WeakMap(), br;
function xr() {
	br ??= gr(window), br.arm();
	let e = () => {
		window.removeEventListener("pointerup", e, !0), window.removeEventListener("pointercancel", e, !0), br.release();
	};
	window.addEventListener("pointerup", e, !0), window.addEventListener("pointercancel", e, !0);
}
function Sr(e, t = "medium") {
	e.dispatchEvent(new CustomEvent("haptic", {
		detail: t,
		bubbles: !0,
		composed: !0
	}));
}
function Cr(e) {
	let t = () => yr.get(e), n = () => {
		window.clearTimeout(t().timer), t().timer = void 0;
	};
	e.addEventListener("pointerdown", (n) => {
		let r = t();
		r.held = !1, !(!r.opts.hold || n.button > 0) && (r.x = n.clientX, r.y = n.clientY, r.timer = window.setTimeout(() => {
			r.held = !0, r.timer = void 0, xr(), Sr(e), r.opts.hold?.();
		}, _r));
	}), e.addEventListener("pointermove", (e) => {
		let r = t();
		r.timer && Math.hypot(e.clientX - r.x, e.clientY - r.y) > vr && n();
	}), e.addEventListener("pointerup", n), e.addEventListener("pointercancel", n), e.addEventListener("pointerleave", n), e.addEventListener("contextmenu", (e) => {
		t().opts.hold && e.preventDefault();
	}), e.addEventListener("click", (n) => {
		let r = t();
		r.held ? (r.held = !1, n.preventDefault(), n.stopPropagation()) : r.opts.tap && (Sr(e, "light"), r.opts.tap());
	});
}
var wr = Ke(class extends qe {
	constructor(e) {
		if (super(e), e.type !== Ge.ELEMENT) throw Error("hold() must be used as an element directive");
	}
	render(e) {
		return w;
	}
	update(e, [t]) {
		let n = e.element, r = yr.get(n);
		return r ? r.opts = t : (yr.set(n, {
			opts: t,
			held: !1,
			x: 0,
			y: 0
		}), Cr(n)), w;
	}
}), { I: Tr } = Fe, Er = (e) => e, Dr = () => document.createComment(""), Or = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new Tr(r.insertBefore(Dr(), i), r.insertBefore(Dr(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = Er(e).nextSibling;
				Er(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, W = (e, t, n = e) => (e._$AI(t, n), e), kr = {}, Ar = (e, t = kr) => e._$AH = t, jr = (e) => e._$AH, Mr = (e) => {
	e._$AR(), e._$AA.remove();
}, Nr = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Pr = Ke(class extends qe {
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
		let i = jr(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = W(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = W(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = W(i[d], a[m]), Or(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = W(i[f], a[p]), Or(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Nr(o, p, m), u = Nr(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = Or(e, i[d]);
					W(t, a[p]), c[p] = t;
				} else c[p] = W(n, a[p]), Or(e, i[d], n), i[t] = null;
				p++;
			} else Mr(i[f]), f--;
		} else Mr(i[d]), d++;
		for (; p <= m;) {
			let t = Or(e, c[m + 1]);
			W(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && Mr(e);
		}
		return this.ut = o, Ar(e, c), w;
	}
});
// src/logic/sheet-stack.ts
function Fr(e) {
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
function Ir(e) {
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
var Lr = "ha-start-dashboard-header";
function Rr(e) {
	return e === "hide" ? "\n      .header { display: none !important; }\n      #view { padding-top: 0 !important; min-height: 100vh !important; }" : e === "blend" ? "\n      .header { background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: none !important; border: none !important; }\n      #view { padding-top: 0 !important; }" : "";
}
function zr(e) {
	let t = e;
	for (; t;) {
		if (t instanceof HTMLElement && t.tagName === "HUI-ROOT") return t;
		t = t.parentNode ?? (t instanceof ShadowRoot ? t.host : null);
	}
	return null;
}
function Br(e, t) {
	let n = zr(e), r = n?.shadowRoot;
	if (!n || !r) return !1;
	let i = n.lovelace?.editMode ? "" : Rr(t), a = r.getElementById(Lr);
	return i ? (a || (a = document.createElement("style"), a.id = Lr, r.appendChild(a)), a.textContent !== i && (a.textContent = i), !0) : (a?.remove(), !1);
}
function Vr(e) {
	zr(e)?.shadowRoot?.getElementById(Lr)?.remove();
}
function Hr(e) {
	return e.toLowerCase().split(/[\s&,.\-_]+/).filter((e) => e.length > 1);
}
function Ur(e, t, n, r) {
	if (r?.[t]) return r[t];
	let i = R(e, t);
	if (!n) return i;
	let a = /* @__PURE__ */ new Set([
		...Hr(n.name),
		...n.areas.flatMap((t) => Hr(e.areas[t]?.name ?? t)),
		...Hr(n.slug)
	]);
	return i.split(/\s+/).filter((e) => !a.has(e.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""))).join(" ").replace(/^[\s\-–·]+|[\s\-–·]+$/g, "") || i;
}
function Wr(e, t, n) {
	let r = e.entities[t];
	return r?.labels?.includes(n) ? !0 : !!(r?.device_id ? e.devices[r.device_id] : void 0)?.labels?.includes(n);
}
function Gr(e, t) {
	let n = e.states[t]?.attributes ?? {};
	return t.startsWith("light.") ? Qr(n).brightness ? "light" : "switch" : t.startsWith("fan.") ? Array.isArray(n.preset_modes) && n.preset_modes.length ? "purifier" : "switch" : t.startsWith("humidifier.") ? "dehumidifier" : "switch";
}
var Kr = /* @__PURE__ */ new WeakMap();
function qr(e) {
	let t = Kr.get(e.entities);
	if (t) return t;
	let n = /* @__PURE__ */ new Map();
	for (let t of Object.values(e.entities)) t.device_id && t.entity_id.startsWith("sensor.") && /_power$/.test(t.entity_id) && (n.has(t.device_id) || n.set(t.device_id, []), n.get(t.device_id).push(t.entity_id));
	return Kr.set(e.entities, n), n;
}
function Jr(e, t) {
	let n = e.states[t]?.state;
	if (n === void 0 || n === "" || n === "unknown" || n === "unavailable") return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function Yr(e, t) {
	let n = e.entities[t]?.device_id, r = n ? (qr(e).get(n) ?? []).filter((t) => e.states[t]) : [];
	if (!r.length) {
		let n = `sensor.${t.split(".")[1]}_power`;
		e.states[n] && (r = [n]);
	}
	if (!r.length) return null;
	let i = r.filter((e) => !/_device_power$/.test(e)), a = i.find((t) => Jr(e, t) !== null) ?? i[0] ?? r[0];
	return {
		id: a,
		value: Jr(e, a)
	};
}
function G(e) {
	return `${I(e, e > 0 && e < 10 && e % 1 ? 1 : 0)} W`;
}
function Xr(e, t, n) {
	let r = e.states[t];
	if (!r || r.state === "unavailable" || r.state === "unknown") return "n. v.";
	if (r.state !== "on") return "Aus";
	let i = Number(r.attributes.brightness);
	return t.startsWith("light.") && r.attributes.brightness != null && Number.isFinite(i) ? `${Math.max(1, Math.round(i / 255 * 100))} %` : !t.startsWith("light.") && n?.value != null && n.value >= 1 ? G(n.value) : "An";
}
var Zr = [
	"hs",
	"xy",
	"rgb",
	"rgbw",
	"rgbww"
];
function Qr(e) {
	let t = Array.isArray(e.supported_color_modes) ? e.supported_color_modes : [], n = t.includes("color_temp");
	return {
		brightness: t.some((e) => e !== "onoff"),
		colorTemp: n ? {
			min: Number(e.min_color_temp_kelvin) || 2e3,
			max: Number(e.max_color_temp_kelvin) || 6500
		} : null,
		color: t.some((e) => Zr.includes(e)),
		effects: Array.isArray(e.effect_list) ? e.effect_list : []
	};
}
function $r(e) {
	if (Zr.includes(e.color_mode)) return "farbig";
	if (e.color_mode !== "color_temp") return;
	let t = Number(e.color_temp_kelvin);
	if (Number.isFinite(t)) return t < 3300 ? "warmweiß" : t < 5e3 ? "neutralweiß" : "kaltweiß";
}
function ei(e) {
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
function ti(e, t) {
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
var ni = {
	manual: "Manuell",
	continuous: "Dauer",
	auto: "Auto",
	clothes_dry: "Wäsche",
	shoes_dry: "Schuhe"
};
function ri(e, t) {
	let n = e.states[t];
	if (!n || n.state === "unavailable" || n.state === "unknown") return "Nicht erreichbar";
	if (n.state !== "on") return "Aus";
	let r = n.attributes;
	return t.startsWith("light.") && Number.isFinite(Number(r.brightness)) ? `An · ${Math.round(Number(r.brightness) / 255 * 100)} %` : t.startsWith("fan.") && r.preset_mode ? `An · ${String(r.preset_mode).toLowerCase()}` : t.startsWith("humidifier.") && Number.isFinite(Number(r.humidity)) ? `An · ${r.humidity} %` : "An";
}
function ii(e, t, n) {
	let r = Object.keys(e.states).filter((n) => Wr(e, n, "dashboard_gerat") && t.areas.includes(L(e, n) ?? ""));
	return t.purifier && e.states[t.purifier] && !r.includes(t.purifier) && r.unshift(t.purifier), r.map((r) => {
		let i = r.split(".")[0], a = e.states[r]?.state, o = Yr(e, r);
		return {
			tileState: Xr(e, r, o),
			power: o,
			sheet: Gr(e, r),
			id: r,
			name: Ur(e, r, t, n),
			on: a === "on",
			unavailable: !a || a === "unavailable" || a === "unknown",
			status: ri(e, r),
			kind: [
				"light",
				"fan",
				"humidifier",
				"switch"
			].includes(i) ? i : "other"
		};
	});
}
function ai(e, t) {
	return Object.keys(e.states).filter((n) => n.startsWith("scene.") && t.areas.includes(L(e, n) ?? "")).map((n) => {
		let r = /_off$|_aus$/.test(n);
		return {
			id: n,
			name: r ? "Alles aus" : Ur(e, n, t),
			icon: e.states[n].attributes.icon,
			off: r
		};
	}).sort((e, t) => Number(e.off) - Number(t.off));
}
var oi = 13;
function si(e, t, n, r) {
	let i = /* @__PURE__ */ new Set(), a = (t) => Date.parse(e.states[t]?.state ?? "");
	for (let r of t) {
		let t = n[r];
		if (!t) continue;
		let a = Object.entries(t).filter(([t]) => e.states[t]);
		a.length > 0 && a.every(([t, n]) => {
			let r = e.states[t];
			if (n.state && r.state !== n.state) return !1;
			let i = Number(r.attributes.brightness);
			return n.state === "on" && n.brightness !== void 0 && Number.isFinite(i) ? Math.abs(i - n.brightness) <= oi : !0;
		}) && i.add(r);
	}
	let o = t.filter((e) => Number.isFinite(a(e)) && a(e) <= r.getTime()).sort((e, t) => a(t) - a(e))[0];
	if (o && !n[o]) {
		let t = e.states[o].attributes.entity_id ?? [], n = a(o) + 1e4;
		t.length && t.every((t) => !e.states[t] || Date.parse(e.states[t].last_changed) <= n) && i.add(o);
	}
	return i;
}
var ci = (e) => Math.round(Math.min(255, Math.max(0, e)));
function li(e) {
	let t = e / 100, n = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -.1332047592, r = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * (t - 60) ** -.0755148492, i = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
	return [
		ci(n),
		ci(r),
		ci(i)
	];
}
function ui(e, t) {
	let n = (n) => {
		let r = (n + e / 60) % 6;
		return 255 * (1 - t / 100 * Math.max(0, Math.min(r, 4 - r, 1)));
	};
	return [
		ci(n(5)),
		ci(n(3)),
		ci(n(1))
	];
}
function di(e) {
	if (Zr.includes(e.color_mode)) return Array.isArray(e.rgb_color) && e.rgb_color.length === 3 ? e.rgb_color.map(Number) : Array.isArray(e.hs_color) ? ui(Number(e.hs_color[0]), Number(e.hs_color[1])) : null;
	if (e.color_mode === "color_temp") {
		let t = Number(e.color_temp_kelvin);
		return Number.isFinite(t) && t > 0 ? li(t) : null;
	}
	return null;
}
function fi([e, t, n]) {
	let r = (.2126 * e + .7152 * t + .0722 * n) / 255;
	return {
		fill: `linear-gradient(90deg, rgba(${e},${t},${n},0.35), rgb(${e},${t},${n}))`,
		icon: r > .5 ? "#2b2200" : "#fff"
	};
}
function pi(e) {
	let t = di(e);
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
		icon: fi(t).icon === "#fff" ? "#fff" : "#151005"
	};
}
// src/logic/rooms-page.ts
var mi = "raumverbrauch", hi = "raumverbrauch_ignorieren";
function gi(e, t, n) {
	let r = new Set(n.flatMap((e) => e.areas)), i = [];
	for (let [t, n] of Object.entries(e.entities)) {
		if (!e.states[t] || !_i(e, t, n.labels)) continue;
		let a = L(e, t);
		a && e.areas[a] && !r.has(a) && !i.includes(a) && i.push(a);
	}
	let a = [...n, ...i.map((t) => mr(e, {
		slug: t,
		areas: [t]
	}))], o = (t) => (t.floor ? e.floors?.[t.floor]?.level : void 0) ?? -Infinity;
	return a.map((e, t) => ({
		r: e,
		i: t
	})).sort((e, t) => o(t.r) - o(e.r) || e.i - t.i).map((e) => e.r).map((n) => {
		let r = ii(e, n, t.names), i = r.filter((e) => e.on).length, a = r.filter((e) => e.on && e.kind === "light").length, o = n.floor ? e.floors?.[n.floor]?.name ?? n.floor.toUpperCase() : void 0, s = r.length ? i ? `${i} von ${r.length} an` : "alles aus" : "keine Geräte";
		return {
			room: n,
			devices: r,
			scenes: ai(e, n),
			onCount: i,
			lightsOn: a,
			sub: o ? `${o} · ${s}` : s,
			active: a > 0,
			power: vi(e, n),
			floorShort: o
		};
	});
}
function _i(e, t, n) {
	if (n?.includes("dashboard_gerat")) return !0;
	let r = e.entities[t]?.device_id;
	return !!(r && e.devices[r]?.labels?.includes("dashboard_gerat"));
}
function vi(e, t) {
	let n = yi(e, t).map((t) => P(e, t)).filter((e) => e !== null);
	return n.length ? n.reduce((e, t) => e + t, 0) : null;
}
function yi(e, t) {
	let n = t.power;
	if (!n?.length) {
		let r = bi(e), i = `sensor.${t.slug}_leistung`;
		if (r.has(i)) n = [i];
		else {
			let e = [...t.areas, ...t.slug.split("_").filter((e) => e.length > 3)];
			n = [...new Set(e.map((e) => `sensor.${e}_leistung`).filter((e) => r.has(e)))];
		}
	}
	return n;
}
function bi(e) {
	let t = Object.keys(e.states).filter((e) => /^sensor\..+_leistung$/.test(e)), n = (t) => e.entities[t]?.labels ?? [], r = t.filter((e) => n(e).includes(mi));
	return new Set((r.length ? r : t).filter((e) => !n(e).includes(hi)));
}
function xi(e) {
	let t = e.reduce((e, t) => e + t.lightsOn, 0), n = e.reduce((e, t) => e + t.onCount - t.lightsOn, 0);
	if (!t && !n) return "Alles aus";
	let r = [];
	return t && r.push(`${t} ${t === 1 ? "Licht" : "Lichter"}`), n && r.push(`${n} ${n === 1 ? "Gerät" : "Geräte"}`), `${r.join(" · ")} an`;
}
function Si(e, t) {
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
function Ci(e, t) {
	return t === "all" ? e : t === "on" ? e.filter((e) => e.onCount > 0).map((e) => ({
		...e,
		devices: e.devices.filter((e) => e.on),
		scenes: e.scenes.filter((e) => e.off)
	})) : e.filter((e) => e.room.floor === t);
}
function wi(e, t) {
	let [n, r] = t.split(":").map(Number), i = new Date(e);
	i.setHours(n, r, 0, 0);
	let a = Math.round((i.getTime() - e.getTime()) / 6e4);
	return a <= 0 && (a += 1440), a;
}
// src/logic/energy.ts
var Ti = (e) => e ?? 0;
function Ei(e) {
	let t = e.energy_sources ?? [], n = (e, n) => t.filter((t) => t.type === e && t[n]).map((e) => e[n]);
	return {
		solar: n("solar", "stat_energy_from"),
		import: n("grid", "stat_energy_from"),
		export: n("grid", "stat_energy_to"),
		solarRate: n("solar", "stat_rate")
	};
}
function Di(e) {
	let t = (e.energy_sources ?? []).filter((e) => e.type === "battery");
	return {
		batteryOut: t.filter((e) => e.stat_energy_from).map((e) => e.stat_energy_from),
		batteryIn: t.filter((e) => e.stat_energy_to).map((e) => e.stat_energy_to)
	};
}
function Oi(e) {
	let t = (e.energy_sources ?? []).filter((e) => e.type === "grid"), n = t.length === 1 ? t[0] : void 0;
	return {
		importPrice: n?.number_energy_price ?? null,
		exportPrice: n?.number_energy_price_export ?? null,
		costStats: t.filter((e) => e.stat_cost || e.stat_energy_from).map((e) => e.stat_cost || `${e.stat_energy_from}_cost`),
		compensationStats: t.filter((e) => e.stat_compensation || e.stat_energy_to).map((e) => e.stat_compensation || `${e.stat_energy_to}_compensation`)
	};
}
function ki(e, t, n) {
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
function Ai(e, t) {
	let n = [N(e, "pv_power"), ...t ? Ei(t).solarRate : []];
	return [...new Set(n)];
}
function K(e, t) {
	return t.reduce((t, n) => t + (e[n] ?? []).reduce((e, t) => e + (Number(t.change) || 0), 0), 0);
}
function ji(e, t, n) {
	let r = Ai(t, n).reduce((t, n) => t + Math.max(0, Ti(P(e, n))), 0), i = Math.max(0, Ti(P(e, N(t, "grid_import")))), a = Math.max(0, Ti(P(e, N(t, "grid_export")))), o = P(e, N(t, "battery_power")), s = P(e, N(t, "battery_soc")), c = o !== null || s !== null ? {
		soc: s,
		power: Ti(o)
	} : null;
	return {
		pv: r,
		house: P(e, N(t, "house_power")) ?? Math.max(0, r + i - a + Ti(c?.power ?? null)),
		import: i,
		export: a,
		battery: c
	};
}
function Mi(e) {
	let t = e.getHours();
	return t >= 5 && t < 11 ? "Morgen" : t >= 11 && t < 14 ? "Mittag" : t >= 14 && t < 18 ? "Nachmittag" : t >= 18 && t < 23 ? "Abend" : "Nacht";
}
function Ni(e, t) {
	let n;
	return n = t.pv > 50 && t.export > t.import ? "Sonne liefert, Überschuss geht ins Netz" : t.pv > 50 && t.import > 50 ? `PV deckt ${Math.min(99, Math.round(t.pv / Math.max(t.house, 1) * 100))} %, Rest aus dem Netz` : t.pv > 50 ? "PV deckt den Verbrauch" : (t.battery?.power ?? 0) > 50 && t.import < 50 ? "Akku versorgt das Haus" : "PV aus, Strom kommt aus dem Netz", `${Mi(e)} · ${n}`;
}
function Pi(e, t) {
	let n = P(e, t);
	return n === null ? 0 : e.states[t]?.attributes.unit_of_measurement === "Wh" ? n / 1e3 : n;
}
function Fi(e, t, n, r = 0, i = 0) {
	let a = (e) => Math.round(e * 1e3) / 1e3, o = a(Math.max(0, e + t + r - n - i));
	return {
		consumed: o,
		local: a(Math.max(0, o - t))
	};
}
function Ii(e, t, n) {
	let r = n ? n.pv : Pi(e, N(t, "pv_today")), i = n ? n.import : Pi(e, N(t, "import_today")), a = n ? n.export : Pi(e, N(t, "export_today")), { consumed: o, local: s } = Fi(r, i, a, n?.batteryOut, n?.batteryIn);
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
var Li = /_phase_|_poe_|standby/;
function Ri(e, t) {
	let n = P(e, t);
	return n === null ? null : Math.abs(e.states[t]?.attributes.unit_of_measurement === "kW" ? n * 1e3 : n);
}
function zi(e, t, n = 6, r) {
	let i = new Set(t.exclude?.consumers ?? []), a = new Set([...[
		"grid_import",
		"grid_export",
		"battery_power",
		"house_power"
	].map((e) => N(t, e)), ...Ai(t, r)].map((t) => e.entities[t]?.device_id).filter((e) => !!e)), o = /* @__PURE__ */ new Map();
	for (let t of Object.keys(e.states)) {
		if (!/^sensor\..+_power$/.test(t) || Li.test(t) || i.has(t)) continue;
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
		let i = r.filter((e) => !/_device_power$/.test(e)).find((t) => Ri(e, t) !== null) ?? r.find((t) => Ri(e, t) !== null);
		if (!i) continue;
		let a = Ri(e, i);
		if (a < 1) continue;
		let o = e.devices[n], c = t.names?.[i] || o?.name_by_user || o?.name || R(e, i).replace(/\s*(device\s+)?(power|leistung)$/i, "");
		s.push({
			id: i,
			name: c || i,
			value: a
		});
	}
	let c = N(t, "untracked_power"), l = Ri(e, c);
	return l !== null && l >= 1 && s.push({
		id: c,
		name: "Nicht erfasst",
		value: l,
		untracked: !0
	}), s.sort((e, t) => t.value - e.value).slice(0, n);
}
function Bi(e, t) {
	let n = (e) => new Map(e.map((e) => [e.t, e.v])), r = n(t.import), i = n(t.export), a = n(t.pv), o = n(t.batteryOut ?? []), s = n(t.batteryIn ?? []), c = [.../* @__PURE__ */ new Set([
		...a.keys(),
		...r.keys(),
		...i.keys(),
		...o.keys(),
		...s.keys()
	])].sort((e, t) => e - t), l = (t, n, r, i, a) => {
		if (e === "selfuse") return t > .01 ? Math.max(0, t - r) / t : null;
		let { consumed: o, local: s } = Fi(t, n, r, i, a);
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
function Vi(e) {
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
			v: Fi(n, r, i, a, o).consumed
		};
	});
}
function Hi(e, t) {
	return e.reduce((e, n) => e + n.v * t / 36e5 / 1e3, 0);
}
function Ui(e, t) {
	return e.soc === null || Math.abs(e.power) > 10 ? null : t?.reserve !== void 0 && e.soc <= t.reserve ? "Reserve" : e.soc >= (t?.full ?? 100) ? "voll" : null;
}
// src/data/series.ts
var q = 36e5, Wi = 24 * q, Gi = (e) => typeof e == "number" ? e : Date.parse(e);
async function Ki(e, t, n, r = Date.now()) {
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
function qi(e, t = Date.now()) {
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
	let r = e === "7d" ? 7 : 30, i = n.getTime() + Wi;
	return {
		start: i - r * Wi,
		end: i,
		period: "day",
		step: Wi
	};
}
async function Ji(e, t, n) {
	let r = qi(n), [i, a] = await Promise.all([e.callWS({
		type: "recorder/statistics_during_period",
		start_time: new Date(r.start).toISOString(),
		end_time: new Date(r.end).toISOString(),
		statistic_ids: t,
		period: r.period,
		types: ["change"],
		units: { energy: "kWh" }
	}), r.period === "5minute" ? null : Ki(e, t, "change")]), o = /* @__PURE__ */ new Map();
	for (let e of t) for (let t of i[e] ?? []) {
		let e = Gi(t.start);
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
async function Yi(e, t, n, r) {
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
	], [o, s, c, l, u] = await Promise.all(a.map((t) => t.length ? Ji(e, t, n) : i())), d = [
		o,
		s,
		c
	].find((e) => e.start) ?? o, f = Bi(r, {
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
async function Xi(e, t, n) {
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
	].map((t) => t.length ? Ji(e, t, n) : r())), l = [
		i,
		a,
		o
	].find((e) => e.start) ?? i;
	return {
		past: Vi({
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
async function Zi(e, t, n) {
	let r = Date.now(), i = n === "24h" ? q / 2 : q, a = Math.ceil(r / i) * i, o = a - (n === "24h" ? 1 : n === "3d" ? 3 : 7) * Wi, s = [
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
		past: ir(l(t.room), o, a, i),
		compare: t.outdoor ? ir(l(t.outdoor), o, a, i) : void 0,
		bands: t.airing ? lr(c[t.airing] ?? [], o, r) : void 0,
		start: o,
		end: a
	};
}
async function Qi(e, t, n) {
	let r = qi(n), [i, a] = await Promise.all([e.callWS({
		type: "recorder/statistics_during_period",
		start_time: new Date(r.start).toISOString(),
		end_time: new Date(r.end).toISOString(),
		statistic_ids: [t],
		period: r.period,
		types: ["mean"]
	}), r.period === "hour" ? Ki(e, [t], "mean") : null]), o = (i[t] ?? []).map((e) => ({
		t: Gi(e.start),
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
async function $i(e, t, n) {
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
	}), Ki(e, o, "change")]), l = {};
	for (let e of o) {
		let t = s[e] ?? [], n = t.some((e) => Gi(e.start) === c.start) ? [] : c.rows[e] ?? [];
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
async function ea(e, t, n, r) {
	let i = async (t, n, i) => {
		if (n !== null) {
			let i = await Ji(e, t, r);
			return {
				...i,
				past: i.past.map((e) => ({
					t: e.t,
					v: e.v * n
				}))
			};
		}
		return Ji(e, i, r);
	}, [a, o] = await Promise.all([i(n.import, t.importPrice, t.costStats), n.export.length || t.compensationStats.length ? i(n.export, t.exportPrice, t.compensationStats) : Promise.resolve({ past: [] })]), s = Math.round(o.past.reduce((e, t) => e + t.v, 0) * 100) / 100;
	return {
		...a,
		total: s
	};
}
async function ta(e, t, n) {
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
			t: Gi(e.start),
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
async function na(e, t, n, r) {
	let i = Date.now(), a = Math.floor((i - 24 * q) / q) * q, o = a + 48 * q, { past: s, future: c } = Vt(n, (await e.callWS({
		type: "history/history_during_period",
		start_time: new Date(a).toISOString(),
		end_time: new Date(i).toISOString(),
		entity_ids: [t],
		minimal_response: !1,
		no_attributes: !1,
		significant_changes_only: !1
	}))[t] ?? [], r), l = ir(s, a, i, q), u = s.length ? [{
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
var ra = {
	hours: 2,
	min_rise: 1,
	max_power: 150,
	max_pv: 300,
	max_hum_rise: 10
}, ia = 6;
function aa(e, t, n = {}) {
	let r = {
		...ra,
		...n
	}, i = (e) => t > r.max_pv && (!r.sunny || r.sunny.includes(e)), a = [];
	for (let t of e) {
		if (i(t.slug) || t.temps.length < ia || t.heated || t.windowOpened || t.power > r.max_power || !t.off && (t.cur === null || t.target === null || t.cur <= t.target)) continue;
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
function oa(e) {
	return e.some((e) => e.a?.hvac_action === "heating");
}
function sa(e) {
	return e.some((e) => e.s === "on");
}
// src/data/heating-check.ts
var ca = 36e5, la = ca;
function ua(e, t) {
	let n = `sensor.${t.split(".")[1]}_power_percent`;
	return e.states[n] ? n : void 0;
}
async function da(e, t, n, r = {}, i = Date.now()) {
	let a = {
		...ra,
		...r
	}, o = t.filter((t) => t.climate && e.states[t.temperature]);
	if (!o.length) return [];
	let s = i - a.hours * ca, c = new Map(o.map((t) => [t.slug, yi(e, t)])), l = new Map(o.map((t) => [t.slug, ua(e, t.climate)])), u = [...new Set([...o.flatMap((e) => [
		e.temperature,
		e.humidity,
		...c.get(e.slug),
		l.get(e.slug) ?? ""
	]), ...n].filter((t) => t && e.states[t]))], d = o.flatMap((e) => e.window ? [e.window] : []), f = o.filter((e) => !l.get(e.slug)).map((e) => e.climate), p = (t, n) => t.length ? e.callWS({
		type: "history/history_during_period",
		start_time: (/* @__PURE__ */ new Date(s - la)).toISOString(),
		end_time: new Date(i).toISOString(),
		entity_ids: t,
		...n ? { significant_changes_only: !1 } : {
			minimal_response: !0,
			no_attributes: !0
		}
	}) : Promise.resolve({}), [m, h, g] = await Promise.all([
		e.callWS({
			type: "recorder/statistics_during_period",
			start_time: (/* @__PURE__ */ new Date(s - la)).toISOString(),
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
	}, ee = (e) => _(e, s - la).some((e) => Number(e.max ?? e.mean) > 0), te = n.reduce((e, t) => e + Math.max(0, y(t)), 0);
	return aa(o.map((t) => {
		let n = qn(e, t), r = l.get(t.slug);
		return {
			slug: t.slug,
			name: t.name,
			temps: v(t.temperature),
			hums: v(t.humidity),
			power: c.get(t.slug).reduce((e, t) => e + Math.max(0, y(t)), 0),
			heated: n.heating || (r ? ee(r) : oa(g[t.climate] ?? [])),
			windowOpened: n.windowOpen || !!t.window && sa(h[t.window] ?? []),
			off: n.off,
			cur: n.cur,
			target: n.target
		};
	}), te, a);
}
// src/data/window-check.ts
var fa = 9e5, pa = 216e5;
function ma(e, t, n) {
	return t.filter((t) => {
		let r = t.window ? e.states[t.window] : void 0;
		return r?.state === "on" && n - new Date(r.last_changed).getTime() >= 18e5;
	});
}
async function ha(e, t, n, r = Date.now()) {
	let i = ma(e, t, r), a = P(e, N(n, "outdoor_temp"));
	if (!i.length || a === null) return [];
	let o = (t) => new Date(e.states[t.window].last_changed).getTime(), s = Math.max(Math.min(...i.map(o)) - fa, r - pa), c = await e.callWS({
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
		return gn(l(e.temperature, t - fa), l(e.humidity, t - fa).filter((e) => e.t > t), t, a);
	}).map((e) => e.slug);
}
// src/pages/climate.ts
function ga(e) {
	let t = (e, t, n, r, i = "", a = 11) => S`<span class="winchip ${i}" style="background:${n}" title=${r} aria-label=${r}>${j(e, a, t, 2.6)}</span>`;
	switch (e.kind) {
		case "recommend": return t(O.wind, "#5ac8fa", "rgba(90,200,250,0.2)", "Lüften empfohlen", "", 12);
		case "airing": return t(O.window, "#5ac8fa", "rgba(90,200,250,0.2)", "Lüftet");
		case "overdue": return t(O.window, "#ff6b61", "rgba(255,69,58,0.24)", `Fenster offen seit ${e.openMin} min · ${e.reason}`);
		case "stuck": return t(O.window, "#aeb4c0", "transparent", "Fenstersensor prüfen", "doubt");
		case "open": return t(O.window, "#aeb4c0", "rgba(255,255,255,0.1)", "Fenster offen (ignoriert)");
		default: return T;
	}
}
function _a(e) {
	switch (e.kind) {
		case "airing": return e.remaining > 0 ? `lüftet ${U(e.remaining)}` : "lüftet";
		case "overdue": return `offen ${un(e.openMin)}`;
		case "stuck": return "Sensor?";
		case "open": return "offen";
		default: return null;
	}
}
function va(e, t) {
	let n = qn(e.hass, t, e.target(t.climate)), r = e.window(t), i = ln(r, n.heating), a = t.climate, o = e.heating().find((e) => e.slug === t.slug);
	return S`
    <div class="kroom ${i}">
      <button class="kroom-main" @click=${() => e.openSheet({
		id: "room",
		slug: t.slug
	})}>
        <span class="circle kroom-circle">${j(Ve(t.name, t.icon), 19, i ? "#141008" : "#fff", 2)}</span>
        <span class="kroom-text">
          <span class="kroom-name">
            <span class="ellipsis">${t.name}</span>
            ${n.aq || n.fanOn ? S`<span class="aqchip" title=${n.pm25 === null ? "Luftreiniger an" : `PM2.5 ${I(n.pm25)} µg/m³`}
                  style="background:${n.aq ? n.aq + "2e" : "rgba(48,209,88,0.18)"}">
                  ${n.aq ? S`<span class="dot" style="width:6px;height:6px;background:${n.aq}"></span>` : T}
                  ${n.fanOn ? j(k.fan, 11, "#7ee8a0", 2.6) : T}
                </span>` : T}
            ${ga(r)}
            ${o ? S`<span class="heatchip" title="Heizung prüfen: +${I(o.rise, 1)}° in ${o.hours} h ohne Heizbedarf"
                  aria-label="Heizung prüfen">${j(O.thermo, 11, "#ff9f0a", 2.6)}!</span>` : T}
          </span>
          <span class="kroom-sub">${H(n.cur)}° · ${n.hum ?? "–"} % · ${_a(r) ?? n.label}</span>
        </span>
      </button>
      ${a ? S`<span class="stepper">
            <button class="step" aria-label="Soll senken" @click=${() => e.stepTarget(a, -.5)}>−</button>
            <span class="target">${H(n.target)}°</span>
            <button class="step" aria-label="Soll erhöhen" @click=${() => e.stepTarget(a, .5)}>+</button>
          </span>` : T}
    </div>
  `;
}
var ya = [
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
], ba = {
	off: "Aus",
	cool: "Kühlt",
	dry: "Trocknet",
	heat: "Heizt",
	fan_only: "Lüfter",
	auto: "Auto",
	heat_cool: "Auto"
};
function xa(e, t) {
	let n = e.hass.states[t];
	if (!n) return T;
	let r = n.attributes, i = [
		ba[n.state] ?? n.state,
		r.current_temperature == null ? "" : `${I(Number(r.current_temperature), 1)}° innen`,
		r.temperature == null ? "" : `Soll ${I(Number(r.temperature), 1)}°`
	].filter(Boolean).join(" · ");
	return S`
    <div class="ac">
      <button class="ac-main" aria-label="Klimaanlage öffnen" @click=${() => e.openSheet({ id: "ac" })}>
        <span class="circle" style="width:44px;height:44px;background:rgba(100,210,255,0.18)">${j(k.snowflake, 19, "#8fd8ff", 2)}</span>
        <span><span class="t1">Klimaanlage</span><span class="t2">${i}</span></span>
      </button>
      <span class="ac-modes">
        ${ya.map((r) => {
		let i = n.state === r.mode;
		return S`<button class="ac-mode ${i ? "active" : ""}" aria-label=${r.name} title=${r.name} aria-pressed=${i}
            @click=${() => e.call("climate", "set_hvac_mode", { hvac_mode: r.mode }, { entity_id: t })}>
            ${j(r.icon, 16, i ? "#101218" : r.stroke, 2.2)}</button>`;
	})}
      </span>
    </div>
  `;
}
function Sa(e, t, n, r) {
	let i = Qn(t.rooms.map((t) => qn(e.hass, t).cur));
	return S`
    <section class="section">
      <div class="section-head" style="margin-top:8px">
        <h2>${t.name}</h2>
        <span class="rule" aria-hidden="true"></span>
        <span class="meta">${i === null ? "" : `Ø ${I(i, 1)}°`}</span>
      </div>
      ${t.rooms.map((t) => va(e, t))}
      ${r === t.id ? xa(e, n) : T}
    </section>
  `;
}
function Ca(e) {
	let { hass: t, rooms: n } = e, r = N(e.config, "heating"), i = F(t, r) === "on", a = er(t, n, e.config), o = N(e.config, "ac"), s = t.states[o] ? Zn(t, o) : void 0, c = Xn(t, n), l = t.states[N(e.config, "weather")]?.state ?? "", u = nr(t, n, e.config, e.now);
	return S`
    <div class="climate">
      <header class="khead">
        <div>
          <div class="date">${$n(t, n)}</div>
          <h1>Klima</h1>
        </div>
        ${t.states[r] ? S`<button class="heat-toggle ${i ? "on" : ""}" aria-pressed=${i}
              aria-label="Zentralheizung ${i ? "an" : "aus"}" title="Zentralheizung"
              @click=${() => e.call("input_boolean", "toggle", {}, { entity_id: r })}>
              <span class="track"><span class="knob">${j(k.flame, 14, i ? "#ff9f0a" : "#888", 2.6)}</span></span>
            </button>` : T}
      </header>

      <button class="pill outdoor" @click=${() => e.openSheet({ id: "airing" })}>
        <span class="circle" style="width:44px;height:44px;background:rgba(143,208,255,0.2)">${j(He(l), 20, "#8fd0ff", 2)}</span>
        <span class="grow"><span class="t1">${a.title}</span><span class="t2">${a.sub}</span></span>
        ${u.active ? S`<span class="air-badge running" aria-label="Lüften läuft, noch ${U(u.remaining)}">${j(O.wind, 14, "#06202c", 2.4)}${U(u.remaining)}</span>` : a.minutes === null ? T : S`<span class="air-badge">${j(O.wind, 14, "#06202c", 2.4)}${I(Math.round(a.minutes))} min</span>`}
      </button>

      <div class="pill allrooms">
        <span class="grow" style="font-size:14px;font-weight:600">Alle Räume</span>
        ${Gn.map((t) => S`
          <button class="preset" style="background:${t.color}" aria-label="Alle auf ${t.name}" title=${t.name}
            @click=${() => e.runScript(N(e.config, "preset_all"), { preset: t.id })}>
            ${j(Ue[t.id], 18, "#101010", 2.3)}
          </button>`)}
        <button class="preset" style="background:#fff" aria-label="Temperatur für alle Räume einstellen"
          @click=${() => e.openSheet({ id: "allRooms" })}>${j(k.tune, 18, "#101218", 2.3)}</button>
      </div>

      ${c.map((t) => Sa(e, t, o, s))}
    </div>
  `;
}
var wa = o`
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
function Ta(e, t) {
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
				let t = An(e.hass);
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
function Ea(e) {
	let t = (e, t, n, r = "") => S`<span class="room-air" style="color:${t}" title=${n} aria-label=${n}>${j(e, 13, t, 2.4)}${r}</span>`;
	switch (e.kind) {
		case "recommend": return t(O.wind, "#5ac8fa", "Lüften empfohlen");
		case "airing": return t(O.window, "#5ac8fa", "Lüftet", e.remaining > 0 ? U(e.remaining) : "");
		case "overdue": return t(O.window, "#ff6b61", `Fenster offen seit ${e.openMin} min`, e.openMin < 60 ? `${e.openMin}′` : un(e.openMin));
		case "stuck": return t(O.window, "#aeb4c0", "Fenstersensor prüfen", "?");
		case "open": return t(O.window, "#aeb4c0", "Fenster offen");
		default: return T;
	}
}
function Da(e, t) {
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
function Oa(e, t, n = !0) {
	let r = Da(e, t), i = t.action;
	return S`
    <div class="now ${n ? "wide" : ""}" style="background: linear-gradient(90deg, ${t.tint}, rgba(255,255,255,0.05) ${n ? 75 : 100}%)">
      <button class="now-main" ?disabled=${!r} @click=${() => r?.()}>
        <span class="circle" style="width:34px;height:34px;background:${t.color}">${j(t.icon, 16, "#101010")}</span>
        <span class="now-text">
          <span class="now-title ellipsis">${t.title}</span>
          <span class="now-sub ellipsis">${t.text}</span>
        </span>
      </button>
      ${i ? S`<button class="now-action" style="background:${t.color}"
            @click=${() => e.call(i.domain, i.service, i.data, i.target)}>${i.label}</button>` : T}
    </div>
  `;
}
function ka(e) {
	let { hass: t, config: n, now: r } = e, i = Tn(t, N(n, "weather")), a = Mn(t, n), o = Pn(t, n, e.rooms, r, e.heating(), (t) => e.window(t)), s = Hn(t, e.rooms, (t) => e.window(t));
	return S`
    <div class="overview">
      <header class="head">
        <div>
          <div class="date">${Cn(r)}</div>
          <h1>${Sn(r)}</h1>
        </div>
        <button class="weather" aria-label="Wetter öffnen" @click=${() => e.openSheet({ id: "weather" })}>
          <span class="circle" style="width:40px;height:40px;background:rgba(143,208,255,0.2)">${j(i.icon, 20, "#8fd0ff", 2)}</span>
          <span>
            <span class="wp-temp">${i.temp}</span>
            <span class="wp-label">${i.label}</span>
          </span>
        </button>
      </header>

      <div class="status">
        ${a.map((t) => S`
          <button class="bubble" aria-label="${t.label}: ${t.value}" ${wr(Ta(e, t))}>
            <span class="circle" style="width:34px;height:34px;background:${t.color}">${j(t.icon, 17, "#111")}</span>
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
        ${o.length ? S`<div class="now-grid">${Wn(o).map((t) => Oa(e, t.item, t.wide))}</div>` : S`
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
          ${s.some((e) => e.aq) ? S`<span class="meta" style="font-size:11px">
                <span class="dot" style="background:#30d158"></span><span class="dot" style="background:#ffd60a"></span><span class="dot" style="background:#ff453a;margin-right:3px"></span>Luftqualität
              </span>` : T}
        </div>
        <div class="sum-grid">
          ${s.map((t) => {
		let n = ln(t.win, t.heating);
		return S`
              <button class="room ${n}" @click=${() => e.openSheet({
			id: "room",
			slug: t.room.slug
		})}
                aria-label="${t.room.name}: ${t.temp} Grad, ${t.hum} Prozent">
                <span class="circle room-circle">${j(t.icon, 16, n ? "#141008" : "#fff", 2)}</span>
                <span class="room-text">
                  <span class="room-name"><span class="ellipsis">${t.room.name}</span>${t.aq ? S`<span class="dot" style="background:${t.aq}"></span>` : T}</span>
                  <span class="room-sub">${t.hum} %${t.note ? ` · ${t.note}` : ""}${Ea(t.win)}</span>
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
var Aa = o`
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
`, ja, Ma = class extends ze {
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
		return S`
      <div class="head"><span class="lbl">${this.label}</span><span class="val">${this.format(e)}</span></div>
      <div class="track v-${this.variant}" role="slider" tabindex="0" aria-label=${this.label}
        aria-valuemin=${this.min} aria-valuemax=${this.max} aria-valuenow=${e} aria-valuetext=${this.format(e)}
        style="background:${this.track}"
        @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._up}
        @pointercancel=${this._cancel} @lostpointercapture=${this._up} @keydown=${this._key}>
        ${this.variant === "bubble" ? S`<span class="fill" style="width:max(64px, ${t * 100}%);background:${this.fill};opacity:${e <= this.min ? 0 : 1}"></span>
              <slot></slot>` : S`<span class="knob" style="left:calc(${t * 100}% - ${t * 44}px + 4px)"></span>`}
      </div>
    `;
	}
};
ja = Ma, ja.properties = {
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
}, ja.styles = o`
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
  `, customElements.get("start-dashboard-slider") || customElements.define("start-dashboard-slider", Ma);
// src/sheets/device.ts
var Na = "#ffd60a", Pa = "#30d158", Fa = "#5ac8fa", Ia = [
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
function La(e, t) {
	let n = e.hass.states[t]?.state;
	n && n !== "unavailable" && n !== "unknown" && (t.startsWith("light.") ? e.call("light", "toggle", {}, { entity_id: t }) : e.call("homeassistant", "toggle", {}, { entity_id: t }));
}
function Ra(e, t) {
	let n = L(e.hass, t);
	return n ? e.rooms.find((e) => e.areas.includes(n)) : void 0;
}
function za(e, t, n) {
	if (n) return n.name;
	let r = L(e.hass, t);
	return r ? e.hass.areas[r]?.name ?? r : "";
}
function Ba(e, t, n, r, i) {
	return S`<button class="tgl ${n ? "on" : ""}" aria-pressed=${n} aria-label="${i} ein/aus"
    style=${n ? `background:${r}` : ""} @click=${() => La(e, t)}><span></span></button>`;
}
function Va(e, t, n) {
	if (!e.hass.states[t]) return T;
	switch (Gr(e.hass, t)) {
		case "light": return Ua(e, t);
		case "purifier": return Ka(e, t);
		case "dehumidifier": return qa(e, t);
		default: return Ga(e, t, n ?? {
			id: "device",
			entity: t
		});
	}
}
var Ha = "linear-gradient(90deg, rgba(255,214,10,0.35), #ffe37a)";
function Ua(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = r.state === "on", o = Ra(e, t), s = Ur(n, t, o, e.config.names), c = Qr(i), l = a ? Math.max(1, Math.round(Number(i.brightness) / 255 * 100) || 100) : 0, u = a ? $r(i) : void 0, d = a ? di(i) : null, f = d ? fi(d) : {
		fill: Ha,
		icon: "#2b2200"
	}, p = c.colorTemp, m = Number(i.color_temp_kelvin), h = (n) => e.call("light", "turn_on", n, { entity_id: t });
	return M({
		title: s,
		subtitle: [za(e, t, o), a ? u ?? "an" : r.state === "off" ? "aus" : "nicht erreichbar"].filter(Boolean).join(" · "),
		color: a ? Na : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#2b2200" : "#fff",
		glow: a ? "rgba(255,240,200,0.18)" : "rgba(255,255,255,0.05)",
		iconPath: We(t, s),
		headerExtra: Ba(e, t, a, Na, s),
		onClose: e.closeSheet,
		body: S`
      <start-dashboard-slider variant="bubble" label="Helligkeit" .min=${0} .max=${100} .step=${1} .value=${l}
        .fill=${f.fill} .format=${(e) => `${e} %`}
        @slide-change=${(n) => n.detail.value <= 0 ? e.call("light", "turn_off", {}, { entity_id: t }) : h({ brightness_pct: n.detail.value })}>
        ${j(A.brightness, 22, l > 8 ? f.icon : "#fff", 2.2)}
      </start-dashboard-slider>

      ${p ? S`<div>
            <start-dashboard-slider variant="knob" label="Farbtemperatur" .min=${p.min} .max=${p.max} .step=${50}
              .value=${Number.isFinite(m) ? m : Math.round((p.min + p.max) / 2)}
              .track=${"linear-gradient(90deg, #ffa94d, #fff1d6 50%, #d6ecff)"}
              .format=${(e) => `${I(e)} K`}
              @slide-change=${(e) => h({ color_temp_kelvin: e.detail.value })}></start-dashboard-slider>
            <div class="ends"><span>warm ${I(p.min)} K</span><span>kalt ${I(p.max)} K</span></div>
          </div>` : T}

      ${c.color ? S`<div>
            <div class="sublabel">Farbe</div>
            <div class="swatches">
              ${Ia.map(([e, t, n]) => S`<button class="swatch" aria-label=${e} style="background:${t}" @click=${() => h({ hs_color: n })}></button>`)}
            </div>
          </div>` : T}

      ${c.brightness ? S`<div class="grid3">
            ${ei(c).map((e) => S`<button class="dchip" @click=${() => h(e.data)}>${e.name}</button>`)}
          </div>` : T}
    `
	});
}
function Wa(e, t, n) {
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
	return S`
    <div class="sublabel">Ausschalten in</div>
    <div class="grid4 ${r ? "" : "disabled"}">
      ${n.map(([e, t]) => S`<button class="dchip sm" ?disabled=${!r} @click=${() => o(t)}>${e}</button>`)}
      <button class="dchip sm ${i ? "sel" : ""}" ?disabled=${!r} aria-expanded=${i}
        @click=${() => e.setUi({ timeInput: i ? void 0 : t })}>Zeit…</button>
    </div>
    ${i && r ? S`<div class="timerow">
          <input type="time" class="time" aria-label="Ausschalten um" .value=${e.ui.timeValue ?? ""}
            @input=${(t) => e.setUi({ timeValue: t.target.value })} />
          <button class="dchip sm sel" ?disabled=${!e.ui.timeValue}
            @click=${() => e.ui.timeValue && o(wi(e.now, e.ui.timeValue))}>Starten</button>
        </div>` : T}
    ${s && r ? S`<div class="hint">${j(k.clock, 13, "rgba(255,255,255,0.6)", 2.2)}Schaltet um
          ${s.toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	})} Uhr aus</div>` : T}
  `;
}
function Ga(e, t, n) {
	let { hass: r } = e, i = r.states[t], a = i.state === "on", o = Ra(e, t), s = Ur(r, t, o, e.config.names), c = t.startsWith("light.") ? Na : Pa, l = Yr(r, t), u = a ? "an" : i.state === "off" ? "aus" : "nicht erreichbar";
	return M({
		title: s,
		subtitle: [za(e, t, o), u].filter(Boolean).join(" · "),
		color: a ? c : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#0b1a10" : "#fff",
		glow: a ? `${c}2e` : "rgba(255,255,255,0.05)",
		iconPath: We(t, s),
		headerExtra: Ba(e, t, a, c, s),
		onClose: e.closeSheet,
		body: S`
      ${l ? S`<button class="powerrow" aria-label="Leistung, Verlauf anzeigen"
            @click=${() => e.openSheet({
			id: "energyChart",
			key: l.id,
			range: "24h",
			name: s,
			back: n
		})}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffc061" aria-hidden="true"><path d=${O.bolt}></path></svg>
            <span class="grow">${l.value === null ? S`<span class="pr-lbl">Leistung nicht verfügbar</span>` : S`<span class="pr-val">${G(l.value)}</span><span class="pr-lbl">Leistung jetzt</span>`}</span>
            <span class="more">Verlauf ›</span>
          </button>` : T}
      ${Wa(e, t, [
			["30 min", 30],
			["1 h", 60],
			["2 h", 120]
		])}
    `
	});
}
function Ka(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = Ra(e, t), o = Ur(n, t, a, e.config.names), s = ti(r.state, i), c = s.mode !== "off", l = i.preset_modes ?? [], u = 100 / s.levels, d = P(n, a?.pm25), f = {
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
		subtitle: [za(e, t, a), f].filter(Boolean).join(" · "),
		color: c ? Pa : "rgba(255,255,255,0.12)",
		iconStroke: c ? "#0b1a10" : "#fff",
		glow: c ? "rgba(48,209,88,0.16)" : "rgba(255,255,255,0.05)",
		iconPath: A.fan,
		headerExtra: S`
      ${d === null ? T : S`<span class="pmchip" style="background:${Vn(d)}2e;color:${Vn(d)}">
            <span class="dot" style="background:${Vn(d)}"></span>PM2.5 ${I(d)}</span>`}
      ${Ba(e, t, c, Pa, o)}`,
		onClose: e.closeSheet,
		body: S`
      <div class="grid3" role="radiogroup" aria-label="Modus">
        ${p.map(([e, t]) => {
			let n = s.mode === e;
			return S`<button class="dchip lg ${n ? "selg" : ""}" role="radio" aria-checked=${n} @click=${() => m(e)}>${t}</button>`;
		})}
      </div>
      <div class="levelrow">
        <span class="lvl">Stufe</span>
        <div class="levels ${s.mode === "manual" ? "" : "disabled"}" style="grid-template-columns: repeat(${s.levels}, minmax(0, 1fr))">
          ${Array.from({ length: s.levels }, (e, t) => t + 1).map((n) => S`
            <button class="dchip md ${s.mode === "manual" && s.level === n ? "selg" : ""}" ?disabled=${s.mode !== "manual"}
              aria-pressed=${s.level === n}
              @click=${() => e.call("fan", "set_percentage", { percentage: Math.round(n * u) }, { entity_id: t })}>${n}</button>`)}
        </div>
      </div>
      <div class="hint">Stufen nur im Modus „Manuell“ aktiv.</div>
    `
	});
}
function qa(e, t) {
	let { hass: n } = e, r = n.states[t], i = r.attributes, a = r.state === "on", o = Ra(e, t), s = Ur(n, t, o, e.config.names), c = Number(i.min_humidity) || 35, l = Number(i.max_humidity) || 85, u = Number(i.target_humidity_step) || 5, d = e.pending(t, "humidity") ?? (Number(i.humidity) || c), f = Number(i.current_humidity), p = i.available_modes ?? Object.keys(ni), m = (n) => {
		let r = Math.min(l, Math.max(c, Math.round((d + n * u) / u) * u));
		e.setPending(t, "humidity", r, () => e.call("humidifier", "set_humidity", { humidity: r }, { entity_id: t }));
	};
	return M({
		title: s,
		subtitle: [
			za(e, t, o),
			a ? "an" : "aus",
			Number.isFinite(f) ? `Gerät misst ${I(f)} %` : ""
		].filter(Boolean).join(" · "),
		color: a ? Fa : "rgba(255,255,255,0.12)",
		iconStroke: a ? "#06202c" : "#fff",
		glow: a ? "rgba(90,200,250,0.18)" : "rgba(255,255,255,0.05)",
		iconPath: A.drop,
		headerExtra: Ba(e, t, a, Fa, s),
		onClose: e.closeSheet,
		body: S`
      <div class="humrow">
        <button class="hstep" aria-label="Zielfeuchte senken" ?disabled=${d <= c} @click=${() => m(-1)}>−</button>
        <span class="hval"><span class="big">${I(d)} %</span><span class="small">Zielfeuchte · ${c}–${l} %</span></span>
        <button class="hstep" aria-label="Zielfeuchte erhöhen" ?disabled=${d >= l} @click=${() => m(1)}>+</button>
      </div>
      <div class="modes" role="radiogroup" aria-label="Modus" style="grid-template-columns: repeat(${p.length}, minmax(0, 1fr))">
        ${p.map((n) => {
			let r = i.mode === n;
			return S`<button class="dchip sm ${r ? "selb" : ""}" role="radio" aria-checked=${r}
            @click=${() => e.call("humidifier", "set_mode", { mode: n }, { entity_id: t })}>${ni[n] ?? n}</button>`;
		})}
      </div>
      ${Wa(e, t, [
			["1 h", 60],
			["2 h", 120],
			["4 h", 240]
		])}
    `
	});
}
var Ja = o`
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
`, Ya = (e, t) => `width:${t}px;height:${t}px;background:${e}`;
function Xa(e) {
	let { hass: t } = e, n = gi(t, e.config, e.rooms), r = Si(t, n), i = r.some((t) => t.id === e.roomsFilter) ? e.roomsFilter : "all", a = Ci(n, i), o = n.flatMap((e) => e.devices.filter((e) => e.on && e.kind === "light").map((e) => e.id));
	return S`
    <div class="rooms">
      <header class="rhead">
        <div>
          <div class="date">${xi(n)}</div>
          <h1>Räume</h1>
        </div>
        <button class="lightsoff" ?disabled=${!o.length}
          @click=${() => e.call("light", "turn_off", {}, { entity_id: o })}>
          ${j(k.power, 16, "#fff", 2.4)}Licht aus
        </button>
      </header>

      <div class="rfilter" role="tablist" aria-label="Filter" style="grid-template-columns: repeat(${r.length}, minmax(0, 1fr))">
        ${r.map((t) => S`<button role="tab" aria-selected=${t.id === i} class=${t.id === i ? "sel" : ""}
          @click=${() => e.setRoomsFilter(t.id)}>${t.label}</button>`)}
      </div>

      ${a.length ? a.map((t) => Za(e, t, i === "on")) : S`<div class="rempty">Gerade ist nichts an.</div>`}
    </div>
  `;
}
function Za(e, t, n = !1) {
	let r = si(e.hass, t.scenes.map((e) => e.id), e.sceneConfigs(), e.now), { hass: i } = e, { room: a } = t, o = P(i, a.temperature), s = P(i, a.humidity), c = !!a.climate;
	return S`
    <article class="rcard ${t.active ? "active" : ""} ${n ? "compact" : ""}">
      <div class="rtop">
        <span class="circle" style=${Ya(t.active ? "#ffd60a" : "rgba(255,255,255,0.12)", n ? 32 : 40)}>
          ${j(Ve(a.name, a.icon), 18, t.active ? "#2b2200" : "#fff", 2)}
        </span>
        <span class="rname">
          <h2 class="ellipsis">${a.name}</h2>
          <span class="rsub ellipsis">${t.sub}</span>
        </span>
        ${o !== null || t.power !== null ? S`<button class="rpill" ?disabled=${!c} aria-label="${a.name}: Raumkarte öffnen"
              @click=${() => c && e.openSheet({
		id: "room",
		slug: a.slug
	})}>
              ${o === null ? T : S`<span>${H(o)}°</span>`}
              ${s === null ? T : S`<span class="muted">${Math.round(s)} %</span>`}
              ${t.power === null ? T : S`<span class="pw"><svg width="11" height="11" viewBox="0 0 24 24" fill="#ffc061" aria-hidden="true"><path d=${O.bolt}></path></svg>${G(t.power)}</span>`}
            </button>` : T}
        ${n ? t.scenes.map((t) => S`<button class="roff" aria-label="${a.name}: alles aus" title="Alles aus"
              @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>${j(k.power, 15, "#fff", 2.3)}</button>`) : T}
      </div>

      ${n ? S`<div class="rgrid">${t.devices.map((t) => $a(e, t))}</div>` : S`${t.scenes.length ? S`<div class="rgrid" role="group" aria-label="Szenen ${a.name}">
                ${t.scenes.map((t, n) => Qa(e, t, n, r))}
              </div>` : T}
          ${t.devices.length ? S`<div class="rgrid">${t.devices.map((t) => $a(e, t))}</div>` : T}`}
    </article>
  `;
}
function Qa(e, t, n, r) {
	let i = t.off ? "rgba(255,255,255,0.14)" : ct[n % ct.length], a = t.off ? "#fff" : "#101010", o = r.has(t.id);
	return S`<button class="rscene" aria-pressed=${o} style=${o ? `background:${t.off ? "rgba(255,255,255,0.2)" : i + "33"};box-shadow:0 0 18px ${t.off ? "rgba(255,255,255,0.08)" : i + "40"}` : ""}
    @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>
    <span class="circle" style=${Ya(i, 34)}>${t.off ? j(k.power, 16, a, 2.1) : lt(t.icon, k.scene, a)}</span>
    <span class="ellipsis">${t.off ? "Aus" : t.name}</span>
  </button>`;
}
function $a(e, t) {
	let n = t.kind === "light" ? pi(e.hass.states[t.id]?.attributes ?? {}) : null, r = n ? n.color : "#30d158", i = n ? n.bg : "rgba(48,209,88,0.14)", a = t.on ? n ? n.icon : "#151005" : t.unavailable ? "rgba(255,255,255,0.45)" : "#fff";
	return S`<button class="rdev ${t.on ? "on" : ""} ${t.unavailable ? "na" : ""}" style=${t.on ? `background:${i}` : ""}
    aria-label="${t.name}: ${t.tileState}"
    ${wr({
		tap: () => La(e, t.id),
		hold: () => e.openSheet({
			id: "device",
			entity: t.id
		})
	})}>
    <span class="circle" style=${Ya(t.on ? r : "rgba(255,255,255,0.1)", 32)}>${j(We(t.id, t.name), 15, a, 2.2)}</span>
    <span class="rdtext">
      <span class="ellipsis rdname">${t.name}</span>
      <span class="rdstate" style="color:${t.on ? n ? n.text : "#9af0b5" : "rgba(255,255,255,0.55)"}">${t.tileState}</span>
    </span>
  </button>`;
}
var eo = o`
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
`, to = {
	pylon: "M12 2 6 22M12 2l6 20M8 9h8M7 14h10",
	server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
	question: "M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.5V14M12 18h.01",
	battery: "M3 8h15a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM21 11v2"
}, J = 5, Y = (e) => `${I(e, 1)} kWh`, no = (e) => `${I(e, 2)} €`;
function ro(e) {
	return e.untracked ? to.question : /netzwerk|nas|server|router|switch|rack/i.test(e.name) ? to.server : We(e.id, e.name);
}
function io(e, t) {
	return t ? S`<div class="vline live ${t}" style="--c:${e}" aria-hidden="true"><span class="arrow"></span></div>` : S`<div class="vline idle" style="border-color:${e}4d" aria-hidden="true"></div>`;
}
function ao(e, t) {
	return t ? S`<div class="fline live ${t}" style="--c:${e}" aria-hidden="true"><span class="arrow"></span></div>` : S`<div class="fline idle" style="border-color:${e}4d" aria-hidden="true"></div>`;
}
var oo = 6;
function so(e) {
	let { hass: t, config: n } = e, r = e.energy(), i = ji(t, n, r.prefs), a = Ii(t, n, r.today), o = r.prefs ? ki(Oi(r.prefs), a, r.today?.cost === void 0 ? void 0 : {
		cost: r.today.cost,
		compensation: r.today.compensation ?? 0
	}) : null, s = zi(t, n, 100, r.prefs), c = e.consumersAll ? s : s.slice(0, oo), l = (t, n) => e.openSheet({
		id: "energyChart",
		key: t,
		range: "24h",
		name: n
	}), u = Math.max(1, ...c.map((e) => e.value)), d = i.export > i.import, f = d ? i.export : i.import, p = d ? "#64d2ff" : "#ff9f0a", m = i.battery;
	return S`
    <div class="energy">
      <header class="ehead">
        <div class="date">${Ni(e.now, i)}</div>
        <h1>Energie</h1>
      </header>

      <div class="flow">
        <div class="frow">
          <button class="node" aria-label="PV ${G(i.pv)}, Verlauf anzeigen" @click=${() => l("pv")}>
            <span class="circle" style="width:48px;height:48px;background:rgba(255,214,10,${i.pv > J ? .32 : .18})">${j(O.sun, 22, "#ffd60a", 2)}</span>
            <span class="nv">${G(i.pv)}</span><span class="nl">PV</span>
          </button>
          ${ao("#ffd60a", i.pv > J ? "right" : null)}
          <button class="node" aria-label="Haus ${G(i.house)}, Verbrauch anzeigen" @click=${() => l("house")}>
            <span class="house">${j(O.home, 22, "#101218", 2.2)}<span>${G(i.house)}</span></span>
            <span class="nl">Haus</span>
          </button>
          ${ao(p, f > J ? d ? "right" : "left" : null)}
          <button class="node" aria-label="Netz ${G(f)}, Verlauf anzeigen" @click=${() => l(d ? "export" : "import")}>
            <span class="circle" style="width:48px;height:48px;background:${f > J ? p : "rgba(255,255,255,0.12)"}">${j(to.pylon, 22, f > J ? "#1a1206" : "#fff", 2.2)}</span>
            <span class="nv">${G(f)}</span><span class="nl">${d ? "Einspeisung" : "Bezug"}</span>
          </button>
        </div>
        ${m ? S`<button class="bnode" aria-label="Akku, geladene und entladene Energie anzeigen" @click=${() => e.openSheet({
		id: "energyChart",
		key: "battery",
		range: "7d"
	})}>
              ${io("#30d158", m.power > J ? "up" : m.power < -5 ? "down" : null)}
              <span class="bring" style="--soc:${Math.max(0, Math.min(100, m.soc ?? 0))}%" role="img"
                aria-label="Akku${m.soc === null ? "" : ` ${I(m.soc)} %`}">
                <span class="circle" style="width:44px;height:44px;background:${Math.abs(m.power) > J ? "#30d158" : "#1d2a22"}">${j(to.battery, 20, Math.abs(m.power) > J ? "#0b1a10" : "#7ee8a0", 2.2)}</span>
              </span>
              <span class="nv">${Math.abs(m.power) > J ? G(Math.abs(m.power)) : "0 W"}</span>
              <span class="nl">${m.power > J ? "Akku liefert" : m.power < -5 ? "Akku lädt" : "Akku"}${m.soc === null ? "" : ` · ${I(m.soc)} %`}${Math.abs(m.power) <= J && Ui(m, e.config.battery) ? ` · ${Ui(m, e.config.battery)}` : ""}</span>
            </button>` : T}
        <button class="elink" @click=${() => e.navigate("/energy")}>Energie-Dashboard ›</button>
      </div>

      <div class="section-head">
        <h2>Heute</h2><span class="rule" aria-hidden="true"></span>
        <span class="meta">ca. ${Y(a.consumed)} verbraucht</span>
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
	].map((e) => S`<button class="tile" aria-label="${e.l} ${Y(e.v)}, Verlauf anzeigen" @click=${() => l(e.k)}>
          <span class="tdot" style="background:${e.c}"></span><span class="tv">${Y(e.v)}</span><span class="tl">${e.l}</span></button>`)}
      </div>
      ${o ? S`<div class="tiles">
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
	].map((e) => S`<button class="tile" aria-label="${e.l} ${no(e.v)}, Verlauf anzeigen" @click=${() => l("cost")}>
              <span class="tdot" style="background:${e.c}"></span><span class="tv">${no(e.v)}</span><span class="tl">${e.l}</span></button>`)}
          </div>` : T}

      ${a.consumed > 0 ? S`<div class="split">
            ${co("Woher kam der Strom?", a.autarky === null ? "" : `${a.autarky} % autark`, "#7ee8a0", [
		a.local,
		"#ffd60a",
		`PV & Akku ${Y(a.local)}`
	], [
		a.import,
		"#ff9f0a",
		`Netz ${Y(a.import)}`
	], () => l("autarky"))}
            ${a.pv > 0 ? co("Wohin ging der Solarstrom?", `${a.selfUse} % selbst genutzt`, "#ffe066", [
		Math.max(0, a.pv - a.export),
		"#ffd60a",
		`Haus ${Y(Math.max(0, a.pv - a.export))}`
	], [
		a.export,
		"#64d2ff",
		`Eingespeist ${Y(a.export)}`
	], () => l("selfuse")) : S`<div class="nopv">Heute noch kein Solarstrom.</div>`}
          </div>` : T}

      <div class="section-head"><h2>Aktuell</h2><span class="rule" aria-hidden="true"></span></div>
      ${c.length ? c.map((e) => S`
            <button class="cons" aria-label="${e.name} ${G(e.value)}, Verlauf anzeigen" @click=${() => l(e.id, e.name)}>
              <span class="cbar" style="width:${Math.round(e.value / u * 100)}%" aria-hidden="true"></span>
              <span class="circle" style="width:36px;height:36px;background:rgba(255,255,255,0.12)">${j(ro(e), 16, "#fff", 2)}</span>
              <span class="cname ellipsis">${e.name}</span>
              <span class="cval">${G(e.value)}</span>
            </button>`) : S`<div class="nopv">Keine Messwerte.</div>`}
      ${s.length > oo ? S`<button class="cmore" @click=${() => e.setConsumersAll(!e.consumersAll)}>
            ${e.consumersAll ? "Weniger anzeigen" : `Alle anzeigen (${s.length})`}</button>` : T}
    </div>
  `;
}
function co(e, t, n, r, i, a) {
	let o = r[0] + i[0] || 1, s = Math.round(r[0] / o * 100);
	return S`<button class="sbtn" aria-label="${e} ${t}, Verlauf anzeigen" @click=${a}>
    <div class="shead"><span>${e}</span><span style="color:${n}">${t}</span></div>
    <div class="sbar" role="img" aria-label="${r[2]}, ${i[2]}"><span style="width:${s}%;background:${r[1]}"></span><span style="width:${100 - s}%;background:${i[1]}"></span></div>
    <div class="slegend"><span>${r[2]}</span><span>${i[2]}</span></div>
  </button>`;
}
var lo = o`
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
`, uo = {
	home: "#30d158",
	zone: "#64d2ff",
	away: "#8e8e93",
	unknown: "#8e8e93"
}, fo = "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", po = "M5 12h14M13 6l6 6-6 6";
function mo(e, t = 40) {
	return S`<span class="pp-av ${e.place === "away" || e.place === "unknown" ? "out" : ""}" style="width:${t}px;height:${t}px" title="${e.name}: ${e.zoneName}">
    ${e.picture ? S`<img src=${e.picture} alt="" />` : S`<span class="pp-ini">${e.initials}</span>`}
    <span class="pp-zone" style="background:${uo[e.place]}">
      ${e.place === "away" ? j(po, 10, "#111", 2.6) : e.place === "unknown" ? j(fo, 10, "#111", 2.4) : lt(e.zoneIcon, e.place === "home" ? O.home : fo, "#111", 12)}
    </span>
  </span>`;
}
// src/logic/security.ts
var ho = [
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
function go(e) {
	return e === "disarmed" ? "Alarm unscharf" : e === "triggered" ? "Alarm ausgelöst!" : `Alarm: ${On[e] ?? e}`;
}
function _o(e, t, n) {
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
		label: go(a),
		sub: o
	};
}
var vo = [
	"window",
	"door",
	"opening",
	"garage_door"
], yo = ["versatile_thermostat", "bambu_lab"], bo = /^((fenster|tür|tur)sensor(en)?|sensor|contact|kontakt|fensterstatus|status)$/i;
function xo(e) {
	return e.toLowerCase().split(/[\s&,._\-]+/).filter(Boolean);
}
function So(e) {
	return e.charAt(0).toUpperCase() + e.slice(1);
}
function Co(e, t, n, r) {
	let i = e.states[t]?.attributes.friendly_name ?? t.split(".")[1].split("_").map(So).join(" "), a = e.areas[n], o = /* @__PURE__ */ new Set([...xo(a?.name ?? ""), ...xo(n)]), s = (e) => {
		let t = xo(e);
		return t.length > 0 && t.every((e) => o.has(e));
	}, c = i.split(/\s+/).filter((e) => e && !bo.test(e) && !s(e)).join(" ").trim();
	return !c || /^(fenster|tür|tur)$/i.test(c) ? r === "door" ? "Tür" : "Fenster" : c;
}
function wo(e, t, n) {
	let r = /* @__PURE__ */ new Set([...yo, ...t.exclude?.openings ?? []]), i = /* @__PURE__ */ new Map();
	for (let [t, n] of Object.entries(e.states)) {
		if (!t.startsWith("binary_sensor.") || !vo.includes(n.attributes.device_class) || Array.isArray(n.attributes.entity_id)) continue;
		let a = e.entities[t];
		if (r.has(t) || a?.platform && r.has(a.platform)) continue;
		let o = L(e, t);
		if (!o || !e.areas[o]) continue;
		let s = String(n.attributes.friendly_name ?? t), c = /t[üu]r|door|tor\b/i.test(s) || n.attributes.device_class === "garage_door" ? "door" : "window", l = n.state === "unavailable" || n.state === "unknown";
		i.has(o) || i.set(o, []), i.get(o).push({
			id: t,
			title: Co(e, t, o, c),
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
			name: Yn[r] ?? r,
			areas: n
		};
	});
}
function To(e, t) {
	let n = e.flatMap((e) => e.areas.flatMap((e) => e.items)), r = n.filter((e) => e.open).length, i = `${n.length - r} von ${n.length} zu`;
	return t === "triggered" ? `Alarm ausgelöst! · ${i}` : r ? `${r} offen · ${i}` : `Alles ruhig · ${i}`;
}
// src/logic/persons.ts
function Eo(e, t) {
	let n = t.attributes.in_zones?.map((t) => e.states[t]).find(Boolean);
	if (n) return n;
	let r = t.state.trim();
	return Object.values(e.states).find((e) => e.entity_id.startsWith("zone.") && String(e.attributes.friendly_name ?? "").trim() === r);
}
function Do(e, t) {
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
		let s = Eo(e, r);
		return [{
			...o,
			place: "zone",
			zoneName: String(s?.attributes.friendly_name ?? r.state).trim(),
			zoneIcon: s?.attributes.icon
		}];
	});
}
function Oo(e) {
	let t = e.filter((e) => e.place === "home").length;
	return t === e.length ? "Alle da" : t === 0 ? "Niemand da" : `${t} von ${e.length} da`;
}
function ko(e, t) {
	let n = new Date(e), r = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`, i = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(), a = Math.round((i(t) - i(n)) / 864e5);
	return a <= 0 ? `seit ${r}` : a < 7 ? `seit ${n.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")} ${r}` : `seit ${n.getDate()}.${n.getMonth() + 1}.`;
}
// src/pages/security.ts
var Ao = {
	camera: "M3 7h12v10H3zM15 10l6-3v10l-6-3",
	muted: "M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6",
	sound: "M4 9h4l5-4v14l-5-4H4zM17 8a5 5 0 0 1 0 8M19.5 5.5a9 9 0 0 1 0 13",
	full: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
};
function jo(e, t) {
	if (e.config.names?.[t]) return e.config.names[t];
	let n = R(e.hass, t);
	return /doorbell|klingel|haust/i.test(`${t} ${n}`) ? "Haustür" : n;
}
function Mo(e, t, n) {
	let r = t.currentTarget.closest(".cam");
	r?.requestFullscreen ? r.requestFullscreen().catch(() => e.moreInfo(n)) : e.moreInfo(n);
}
function No(e) {
	let { hass: t, config: n } = e, r = _o(t, n, e.now), i = wo(t, n, e.rooms), a = r.state === "triggered" ? "#ff453a" : "#bf9bff", o = N(n, "camera"), s = t.states[o], c = t.states[N(n, "camera_motion")], l = t.states[N(n, "camera_person")], u = e.ui.camSound !== !0, d = Do(t, n), f = !!s && s.state !== "unavailable" && !!customElements.get("ha-camera-stream");
	return S`
    <div class="security">
      <header class="shead2">
        <div>
          <div class="date">${To(i, r.state)}</div>
          <h1>Schutz</h1>
        </div>
        ${d.length ? S`<button class="pp-pill" aria-label="Personen: ${Oo(d)}, Karte öffnen"
              @click=${() => e.openSheet({ id: "persons" })}>
              ${d.map((e) => mo(e))}
            </button>` : T}
      </header>

      ${t.states[r.id] ? S`<div class="alarmpill" style="background: linear-gradient(90deg, ${a}42, rgba(255,255,255,0.05) 70%)">
            <button class="circle abtn" style="width:48px;height:48px;background:${a}" aria-label="Alarm-Details"
              @click=${() => e.openSheet({ id: "alarm" })}>${j(En(r.state), 22, "#1d1030", 2.2)}</button>
            <span class="atext">
              <span class="atitle">${r.label}</span>
              ${r.sub ? S`<span class="asub">${r.sub}</span>` : T}
            </span>
            ${ho.filter((e) => e.state !== r.state).map((t) => S`
              <button class="amode" aria-label=${t.name} title=${t.name}
                @click=${() => e.call("alarm_control_panel", t.service, {}, { entity_id: r.id })}>
                ${j(O[t.icon], 18, "#e2d3ff", 2.1)}
              </button>`)}
          </div>` : T}

      ${s ? S`<section class="camcard" aria-label="${jo(e, o)}-Kamera">
            <div class="cam">
              ${f ? S`<ha-camera-stream class="stream" .hass=${t} .stateObj=${s} .muted=${u} .controls=${!1}
                    allow-exoplayer></ha-camera-stream>` : S`<span class="camph">${j(Ao.camera, 40, "rgba(255,255,255,0.4)", 1.6)}</span>`}
              <span class="camlive"><span class="dot" style="background:${f ? "#ff453a" : "#888"}"></span>${f ? "Live" : "Offline"} · ${jo(e, o)}</span>
              <span class="camtools">
                <button aria-label=${u ? "Ton an" : "Ton aus"} @click=${() => e.setUi({ camSound: u })}>${j(u ? Ao.muted : Ao.sound, 15, "#fff", 2.2)}</button>
                <button aria-label="Vollbild" @click=${(t) => Mo(e, t, o)}>${j(Ao.full, 15, "#fff", 2.2)}</button>
              </span>
            </div>
            <div class="camchips">
              ${c ? S`<span class="cchip ${c.state === "on" ? "hot" : ""}">${c.state === "on" ? "Bewegung erkannt" : "Keine Bewegung"}</span>` : T}
              ${l ? S`<span class="cchip ${l.state === "on" ? "hot" : ""}">${l.state === "on" ? "Person erkannt" : "Keine Person"}</span>` : T}
              <span class="grow"></span>
              <button class="cchip btn2" @click=${() => e.moreInfo(c ? c.entity_id : o)}>Verlauf</button>
            </div>
          </section>` : T}

      ${i.length ? S`
            <div class="section-head">
              <h2>Fenster &amp; Türen</h2><span class="rule" aria-hidden="true"></span>
              <span class="meta legend"><span><span class="dot" style="background:#30d158"></span>zu</span><span><span class="dot" style="background:#ff453a"></span>offen</span></span>
            </div>
            ${i.map((t) => S`
              <div class="flabel">${t.name}</div>
              <div class="ogrid">
                ${t.areas.map((t) => S`
                  <div class="opill ${t.items.length > 3 ? "wide" : ""}">
                    <span class="ellipsis oname">${t.name}</span>
                    <span class="oicons">
                      ${t.items.map((t) => {
		let n = `${t.title} ${t.unavailable ? "nicht erreichbar" : t.open ? "offen" : "zu"}`;
		return S`<button class="oicon ${t.open ? "open" : ""} ${t.unavailable ? "na" : ""}" title=${n} aria-label=${n}
                          @click=${() => e.moreInfo(t.id)}>
                          ${j(t.kind === "door" ? O.door : O.window, 15, t.unavailable ? "rgba(255,255,255,0.45)" : t.open ? "#ffd1cf" : "#7ee8a0", 2.2)}
                        </button>`;
	})}
                    </span>
                  </div>`)}
              </div>`)}
          ` : T}
    </div>
  `;
}
var Po = o`
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
`, Fo = {
	pause: "M7 4h3v16H7zM14 4h3v16h-3z",
	dock: "M3 10.5 12 3l9 7.5V21H3z",
	locate: "M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12zM12 7a2 2 0 1 0 0 4a2 2 0 1 0 0-4"
};
function Io(e, t, n, r) {
	let i = e === 0 ? "17px 6px 6px 17px" : e === n - 1 ? "6px 17px 17px 6px" : "6px";
	return e <= t ? `border-radius:${i};background:${r};opacity:${.55 + .45 * (e + 1) / n};color:#08121c` : `border-radius:${i};background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)`;
}
function Lo(e) {
	let { hass: t, config: n } = e, r = N(n, "vacuum"), i = Xt(t, n), a = Qt(t, n), o = en(t, n), s = F(t, N(n, "vacuum_map")) ?? o[0]?.name, c = o.find((e) => e.name === s) ?? o[0], l = tn(t, n), u = c ? c.rooms.filter((e) => l.includes(e.segment)).length : 0, d = N(n, "vacuum_mode"), f = F(t, d) ?? "vacuum", p = String(t.states[r]?.attributes.fan_speed ?? ""), m = sn.findIndex((e) => e.id === p), h = N(n, "vacuum_mop"), g = cn.findIndex((e) => e.id === F(t, h)), _ = N(n, "vacuum_passes"), v = Math.round(P(t, _) ?? 1), y = (t, n = {}) => e.call("vacuum", t, n, { entity_id: r }), ee = (t, n) => e.call("select", "select_option", { option: n }, { entity_id: t }), te = i.error ? "#ff453a" : i.cleaning ? "#64d2ff" : "#30d158";
	return M({
		title: "Robby",
		subtitle: i.label,
		color: "radial-gradient(circle at 40% 35%, #4a505c, #23262e)",
		glow: i.error ? "rgba(255,69,58,0.18)" : "rgba(48,209,88,0.1)",
		iconPath: O.vacuum,
		iconStroke: te,
		onClose: e.closeSheet,
		headerExtra: S`
      ${i.cleaning ? S`<button class="rb-ctl" aria-label="Pause" title="Pause" @click=${() => y("pause")}>${j(Fo.pause, 16, "#fff", 2.2)}</button>` : S`<button class="rb-ctl" aria-label="Start" title="Start" @click=${() => y("start")}>${j(k.play, 16, "#fff", 2.2)}</button>`}
      <button class="rb-ctl" aria-label="Zur Station" title="Zur Station" @click=${() => y("return_to_base")}>${j(Fo.dock, 16, "#fff", 2.2)}</button>
      <button class="rb-ctl" aria-label="Orten" title="Orten" @click=${() => y("locate")}>${j(Fo.locate, 16, "#fff", 2.2)}</button>
    `,
		body: S`
      ${a.length ? S`<div class="rb-stats" style="grid-template-columns: repeat(${a.length}, minmax(0, 1fr))">
            ${a.map((t) => S`<button class="rb-stat ${t.due ? "due" : ""}" aria-label="${t.name}: ${t.value}${t.reset ? ", tippen zum Zurücksetzen" : ""}"
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
          </div>` : T}

      <div class="section-head"><h2>Programme</h2><span class="rule" aria-hidden="true"></span><span class="meta">Tippen startet</span></div>
      <div class="rb-progs">
        ${rn(n).map((t) => S`
          <button class="rb-prog" @click=${() => t.button ? e.call("button", "press", {}, { entity_id: t.button }) : y("start")}>
            <span class="rb-tag" style="background:${t.color ?? "#7ee8a0"}">${t.tag}</span>
            <span class="rb-pn">${t.name}</span>
          </button>`)}
      </div>

      ${c ? S`
            <div class="section-head"><h2>Selbst auswählen</h2><span class="rule" aria-hidden="true"></span></div>
            <section class="rb-custom" aria-label="Individuelle Reinigung">
              <div class="rb-tabs" role="tablist" aria-label="Karte" style="grid-template-columns: repeat(${o.length}, minmax(0, 1fr))">
                ${o.map((t) => S`<button role="tab" aria-selected=${t.name === c.name} class=${t.name === c.name ? "sel" : ""}
                  @click=${() => t.name !== c.name && e.runScript(N(n, "vacuum_map_script"), { karte: t.name })}>${t.name}</button>`)}
              </div>
              ${c.rooms.length ? S`<div class="rb-rooms">
                    ${c.rooms.map((t) => {
			let r = l.includes(t.segment);
			return S`<button class="rb-room ${r ? "sel" : ""}" aria-pressed=${r}
                        @click=${() => e.runScript(N(n, "vacuum_room_script"), { segment: t.segment })}>${t.name}</button>`;
		})}
                  </div>` : T}

              <div class="rb-modes" role="radiogroup" aria-label="Modus">
                ${on.map((e) => {
			let t = f === e.id;
			return S`<button class="rb-mode ${t ? "sel" : ""}" role="radio" aria-checked=${t} @click=${() => ee(d, e.id)}>
                    <span class="rb-mi">
                      ${e.id === "mop" ? T : j(k.fan, 18, "currentColor", 2.1)}
                      ${e.id === "vacuum" ? T : j(k.drop, 18, "currentColor", 2.1)}
                    </span>
                    <span class="rb-mn">${e.name}</span>
                  </button>`;
		})}
              </div>

              ${f === "mop" ? T : S`<div class="rb-slider">
                    <div class="rb-sh">${j(k.fan, 15, "#7ee8a0", 2.2)}<span>Saugkraft</span><span class="grow"></span>
                      <strong style="color:#9af0b5">${sn[m]?.name ?? p}</strong></div>
                    <div class="rb-segs" role="radiogroup" aria-label="Saugkraft" style="grid-template-columns: repeat(${sn.length}, minmax(0, 1fr))">
                      ${sn.map((e, t) => S`<button role="radio" aria-checked=${t === m} aria-label=${e.name} title=${e.name}
                        style=${Io(t, m, sn.length, "#30d158")} @click=${() => y("set_fan_speed", { fan_speed: e.id })}></button>`)}
                    </div>
                  </div>`}

              ${f === "vacuum" ? T : S`<div class="rb-slider">
                    <div class="rb-sh">${j(k.drop, 15, "#8fd8ff", 2.2)}<span>Wasser</span><span class="grow"></span>
                      <strong style="color:#bfe8ff">${cn[g]?.name ?? "–"}</strong></div>
                    <div class="rb-segs" role="radiogroup" aria-label="Wischintensität" style="grid-template-columns: repeat(${cn.length}, minmax(0, 1fr))">
                      ${cn.map((e, t) => S`<button role="radio" aria-checked=${t === g} aria-label=${e.name} title=${e.name}
                        style=${Io(t, g, cn.length, "#5ac8fa")} @click=${() => ee(h, e.id)}>
                        ${Array.from({ length: t + 1 }, () => S`<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${k.drop}></path></svg>`)}
                      </button>`)}
                    </div>
                  </div>`}

              <div class="rb-start">
                <div class="rb-passes" role="radiogroup" aria-label="Durchgänge">
                  ${[1, 2].map((t) => S`<button role="radio" aria-checked=${v === t} class=${v === t ? "sel" : ""}
                    @click=${() => e.call("input_number", "set_value", { value: t }, { entity_id: _ })}>${t}×</button>`)}
                </div>
                <button class="rb-go" ?disabled=${u === 0} @click=${() => e.runScript(N(n, "vacuum_clean_script"))}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${k.play}></path></svg>${an(u)}
                </button>
              </div>
            </section>` : T}
    `
	});
}
var Ro = o`
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
`, zo = 36e5, Bo = 24 * zo;
function Vo(e, t) {
	let n = -1, r = Infinity;
	return e.forEach((e, i) => {
		let a = Math.abs(e - t);
		a < r && (r = a, n = i);
	}), n;
}
var Ho = (e) => String(e.getHours()).padStart(2, "0"), Uo = (e) => e.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
function Wo(e, t) {
	let n = new Date(e);
	if ((t.step ?? 0) >= 828e5) return `${Uo(n)} ${n.getDate()}.${n.getMonth() + 1}.`;
	let r = t.span > 1.5 * Bo ? `${Uo(n)} ` : "";
	return t.bars && t.step ? `${r}${Ho(n)}–${Ho(new Date(e + t.step))} Uhr` : `${r}${Ho(n)}:${String(n.getMinutes()).padStart(2, "0")}`;
}
function Go(e) {
	let t = e.end - e.start, n = e.step ?? 0, r = Math.max(n, zo), i = e.compare ?? [], a = (e) => {
		let t = Vo(i.map((e) => e.t), e);
		return t >= 0 && Math.abs(i[t].t - e) <= r ? i[t] : null;
	}, o = (r, i) => {
		let o = {
			x: e.bars && n ? (e.x(r.t) + e.x(r.t + n)) / 2 : e.x(r.t),
			y: e.y(r.v),
			time: Wo(r.t, {
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
var Ko = 1800, X = /* @__PURE__ */ new WeakMap();
function qo(e) {
	return e.querySelector(":scope > .sc-layer");
}
function Jo(e) {
	let t = X.get(e);
	t && (t.index = -1), qo(e)?.classList.remove("on");
}
function Yo(e, t) {
	let n = X.get(e), r = qo(e);
	if (!n || !r || !n.cfg.points.length) return;
	let i = e.getBoundingClientRect();
	if (!i.width) return;
	let a = (t - i.left) / i.width * n.cfg.width, o = Vo(n.cfg.points.map((e) => e.x), a);
	if (o < 0) return;
	o !== n.index && n.index >= 0 && Sr(e, "selection"), n.index = o;
	let s = n.cfg.points[o];
	r.firstChild || (r.innerHTML = "<div class=\"sc-line\"></div><div class=\"sc-dot\"></div><div class=\"sc-tip\"><span class=\"sc-t\"></span><span class=\"sc-v\"></span><span class=\"sc-e\"></span></div>");
	let c = s.x / n.cfg.width * i.width, l = s.y / n.cfg.height * i.height, [u, d, f] = Array.from(r.children);
	u.style.left = `${c}px`, d.style.left = `${c}px`, d.style.top = `${l}px`, d.style.background = n.cfg.color;
	let [p, m, h] = Array.from(f.children);
	p.textContent = s.time, m.textContent = s.value, m.style.color = n.cfg.color, h.textContent = s.extra ?? "", h.hidden = !s.extra, r.classList.add("on");
	let g = f.offsetWidth;
	f.style.left = `${Math.min(Math.max(0, c - g / 2), Math.max(0, i.width - g))}px`;
}
function Xo(e) {
	let t = () => {
		let t = X.get(e);
		t && (window.clearTimeout(t.timer), t.timer = window.setTimeout(() => Jo(e), Ko));
	};
	e.addEventListener("pointerdown", (t) => {
		let n = X.get(e);
		n && (window.clearTimeout(n.timer), n.pressed = !0, Yo(e, t.clientX));
	}), e.addEventListener("pointermove", (t) => {
		let n = X.get(e);
		n && (n.pressed || t.pointerType === "mouse") && Yo(e, t.clientX);
	});
	let n = () => {
		let n = X.get(e);
		n && (n.pressed = !1, t());
	};
	e.addEventListener("pointerup", n), e.addEventListener("pointercancel", n), e.addEventListener("pointerleave", (t) => {
		t.pointerType === "mouse" ? Jo(e) : n();
	});
}
var Zo = Ke(class extends qe {
	constructor(e) {
		if (super(e), e.type !== Ge.ELEMENT) throw Error("scrub() must be used on an element");
	}
	render(e) {
		return w;
	}
	update(e, [t]) {
		let n = e.element, r = X.get(n);
		return r ? (r.cfg = t, r.index >= t.points.length && Jo(n)) : (X.set(n, {
			cfg: t,
			index: -1,
			pressed: !1
		}), Xo(n)), w;
	}
}), Qo = o`
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
`, $o = 338, es = 300, ts = 18, Z = 130, ns = "#5ac8fa";
function rs(e) {
	let t = e.data, n = t.past ?? [], r = t.future ?? [], i = t.step ?? 0, a = t.compare ?? [], o = sr(n, t.start, t.end, es, ts, Z, {
		snap: e.snap,
		zero: e.zero,
		max: e.max,
		padLo: e.snap / 2,
		padHi: e.snap / 2,
		extra: [...r, ...a].map((e) => e.v)
	}), s = a.length ? sr(a, t.start, t.end, es, ts, Z, {
		snap: e.snap,
		zero: e.zero,
		max: e.max,
		padLo: e.snap / 2,
		padHi: e.snap / 2,
		extra: [...n, ...r].map((e) => e.v)
	}) : null, c = r.length ? sr(r, t.start, t.end, es, ts, Z, {
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
	], d = r.length ? o.x(r[0].t) : null, f = `${e.title}: ${e.caption ?? ""}`, p = (e.rain ?? []).filter((e) => e.v > 0), m = Math.max(2, ...p.map((e) => e.v)), h = (e) => Z - e / m * 50.400000000000006, g = new Map((e.rain ?? []).map((e) => [e.t, e.v])), _ = Go({
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
		return C`<rect x=${a + 1} y=${c} width=${s} height=${Math.max(0, Z - c)} rx=${Math.min(3, s / 2)} fill=${t} opacity=${n}></rect>`;
	};
	return S`
    <figure class="tr-fig" style="background:${e.color}14">
      <figcaption>
        <span class="tr-title" style="color:${e.color}">${e.title}</span>
        ${e.caption ? S`<span class="tr-cap">${e.caption}</span>` : T}
      </figcaption>
      ${t.error && !n.length ? S`<div class="tr-msg">Keine Daten: ${t.error}</div>` : t.loading && !n.length ? S`<div class="tr-msg">Lade Verlauf …</div>` : S`
            <div class="sc-wrap" ${Zo({
		points: _,
		width: $o,
		height: 150,
		color: e.color
	})}>
            <svg width="100%" viewBox="0 0 ${$o} 150" role="img" aria-label=${f}>
              ${u.map((e) => C`
                <line x1="0" y1=${o.y(e)} x2=${$o} y2=${o.y(e)} stroke="rgba(255,255,255,0.08)"></line>
                <text x=${334} y=${o.y(e) - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${I(e, e % 1 ? 1 : 0)}${l}</text>`)}
              ${(t.bands ?? []).map((t) => C`<rect x=${o.x(t.from)} y=${12} width=${Math.max(1, o.x(t.to) - o.x(t.from))}
                height=${118} fill=${e.bandColors?.[t.level] ?? "rgba(255,255,255,0.08)"}></rect>`)}
              ${s?.line ? C`<polyline points=${s.line} fill="none" stroke=${e.compareColor ?? "rgba(255,255,255,0.6)"} stroke-width="1.6" stroke-linejoin="round" opacity="0.9"></polyline>` : T}
              ${e.bars && i ? C`${n.map((t) => v(t, e.color, .85, o.y))}
                  ${r.map((t) => v(t, e.color, .4, o.y))}
                  ${d === null ? T : C`<line x1=${d} y1=${12} x2=${d} y2=${Z} stroke="rgba(255,255,255,0.35)" stroke-dasharray="2 3"></line>
                        <text x=${d + 4} y=${16} fill="rgba(255,255,255,0.7)" font-size="10">Vorhersage</text>`}` : C`
                  ${o.area ? C`<polygon points=${o.area} fill=${e.color} opacity="0.16"></polygon>` : T}
                  ${p.map((e) => v(e, ns, .7, h))}
                  ${o.line ? C`<polyline points=${o.line} fill="none" stroke=${e.color} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>` : T}
                  ${c?.line ? C`<polyline points=${c.line} fill="none" stroke=${e.color} stroke-width="2" stroke-dasharray="5 5" opacity="0.7"></polyline>` : T}
                  ${d === null ? T : C`<line x1=${d} y1=${12} x2=${d} y2=${Z} stroke="rgba(255,255,255,0.35)" stroke-dasharray="2 3"></line>
                        <text x=${d + 4} y=${16} fill="rgba(255,255,255,0.7)" font-size="10">Vorhersage</text>`}
                  ${o.last && e.dot !== !1 ? C`<circle cx=${o.last.x} cy=${o.last.y} r="4.5" fill=${e.color} stroke="#181a22" stroke-width="2"></circle>` : T}`}
            </svg>
            <div class="sc-layer"></div>
            </div>
            <div class="tr-x">${e.labels.map((e) => S`<span>${e}</span>`)}</div>`}
    </figure>
  `;
}
var is = o`
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
`, Q = "#8fd0ff", as = {
	precipitation: k.drop,
	humidity: k.drop,
	wind: O.wind,
	pressure: "M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16M12 12l4-3",
	uv: O.sun,
	visibility: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6"
}, os = {
	rain: k.drop,
	sun: O.sun,
	wind: O.wind,
	humidity: k.drop,
	uv: O.sun
}, ss = "M6 9l6 6 6-6", cs = [
	"rainy",
	"pouring",
	"snowy",
	"snowy-rainy",
	"hail",
	"lightning-rainy"
];
function ls(e) {
	let { hass: t, config: n } = e, r = N(n, "weather"), i = e.forecast(), a = Tt(t, n, i.daily, e.now, i.hourly), o = Et(i.hourly, e.now), s = Ot(i.daily), c = zt(t, n, e.now), l = c.length ? null : At(i.daily, P(t, N(n, "gusts")), e.now), u = jt(t, n), d = !u || u.level === 0 ? "#7ee8a0" : u.level < 2 ? "#ffd60a" : "#ff9f0a";
	return M({
		title: String(t.states[r]?.attributes.friendly_name ?? "Wetter"),
		subtitle: a.source || void 0,
		color: Q,
		glow: "rgba(90,140,220,0.35)",
		iconPath: He(a.condition),
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		body: S`
      <div class="w-now">
        <span class="w-temp">${a.temp}</span>
        <span><span class="w-cond">${a.label}</span>${a.today ? S`<span class="w-today">${a.today}</span>` : T}</span>
      </div>
      ${a.chips.length ? S`<div class="w-chips">
            ${a.chips.map((t) => t.key in Bt || t.key === "precipitation" ? S`<button class="w-chip" aria-label="${t.label}, Verlauf anzeigen"
                  @click=${() => e.openSheet(t.key === "precipitation" ? { id: "weatherRain" } : {
			id: "weatherMetric",
			metric: t.key
		})}>${j(as[t.key], 14, Q, 2.2)}${t.label}</button>` : S`<span class="w-chip">${j(as[t.key], 14, Q, 2.2)}${t.label}</span>`)}
          </div>` : T}

      ${c.map((t, n) => {
			let r = e.ui[`warn${n}`] === !0;
			return S`
          <button class="w-alert" aria-expanded=${r} ?disabled=${!t.text}
            style="border-color:${t.color}66;background:linear-gradient(90deg, ${t.color}38, ${t.color}0d)"
            @click=${() => e.setUi({ [`warn${n}`]: !r })}>
            <span class="w-ah">
              <span class="circle" style="width:32px;height:32px;background:${t.color}">${j(O.storm, 15, "#1d1030", 2.2)}</span>
              <span class="grow"><span class="w-wt">${t.current ? t.level >= 3 ? "Unwetterwarnung" : "Warnung" : "Vorabwarnung"}: ${t.title}</span>
                <span class="w-ws">${t.when} · Stufe ${t.level} von 4</span></span>
              ${t.text ? S`<span class="w-chev ${r ? "open" : ""}">${j(ss, 16, "rgba(255,255,255,0.7)", 2.4)}</span>` : T}
            </span>
            ${r ? S`<span class="w-at">${t.text}</span>` : T}
          </button>`;
		})}

      ${l ? S`<div class="w-warn">
            <span class="circle" style="width:40px;height:40px;background:#bf9bff">${j(O.storm, 18, "#1d1030", 2.2)}</span>
            <span><span class="w-wt">${l.title}</span><span class="w-ws">${l.text}</span></span>
          </div>` : T}

      ${i.loading && !i.hourly.length ? S`<div class="w-msg">Vorhersage wird geladen …</div>` : i.error && !i.hourly.length ? S`<div class="w-msg">Vorhersage nicht verfügbar.</div>` : T}

      ${o.length ? S`<div class="w-hours" style="grid-template-columns: repeat(${o.length}, minmax(0, 1fr))">
            ${o.map((e) => S`<div class="w-hour">
              <span class="w-ht">${e.t}</span>
              ${j(He(e.condition), 20, cs.includes(e.condition) ? Q : "rgba(255,255,255,0.85)", 2)}
              <span class="w-hv">${e.temp ?? "–"}°</span>
              <span class="w-hr">${e.rain}</span>
            </div>`)}
          </div>` : T}

      ${s.length ? S`<div class="w-days">
            ${s.map((t) => S`<button class="w-day" aria-label="${t.day}, Details anzeigen"
              @click=${() => e.openSheet({
			id: "weatherDay",
			date: t.date
		})}>
              <span class="w-dn">${t.day}</span>
              ${j(He(t.condition), 20, cs.includes(t.condition) ? Q : "rgba(255,255,255,0.8)", 2)}
              <span class="w-dr">${t.rain}</span>
              <span class="w-track">
                <span class="w-bar" style="left:${t.left}%;width:${t.width}%"></span>
                <span class="w-lo" style="left:${t.left}%">${t.min}°</span>
              </span>
              <span class="w-dmax">${t.max}°</span>
            </button>`)}
          </div>` : T}

      ${u ? S`<div class="w-pollen" style="background:${d}1f">
            ${j(k.leaf, 16, d, 2.2)}
            <span><strong>${u.title}</strong> · ${u.text}</span>
          </div>` : T}
    `
	});
}
var us = 36e5;
function ds(e, t) {
	let n = e.forecast(), r = n.daily.find((e) => e.datetime === t), i = () => e.openSheet({ id: "weather" });
	if (!r) return M({
		title: "Vorhersage",
		color: Q,
		glow: "rgba(90,140,220,0.35)",
		iconPath: O.sun,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: i,
		body: S`<div class="w-msg">${n.loading ? "Vorhersage wird geladen …" : "Für diesen Tag gibt es keine Vorhersage mehr."}</div>`
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
		body: S`
      <div class="w-now">
        <span class="w-temp">${a.max ?? "–"}°</span>
        <span><span class="w-cond">${a.label}</span>${a.min === null ? T : S`<span class="w-today">Tiefstwert ${a.min}°</span>`}</span>
      </div>
      ${a.facts.length ? S`<div class="w-chips">${a.facts.map((e) => S`<span class="w-chip">${j(os[e.key], 14, Q, 2.2)}${e.label}</span>`)}</div>` : T}
      ${a.hours.length ? S`<div class="w-hours" style="grid-template-columns: repeat(${a.hours.length}, minmax(0, 1fr))">
            ${a.hours.map((e) => S`<div class="w-hour">
              <span class="w-ht">${e.t}</span>
              ${j(He(e.condition), 20, cs.includes(e.condition) ? Q : "rgba(255,255,255,0.85)", 2)}
              <span class="w-hv">${e.temp ?? "–"}°</span>
              <span class="w-hr">${e.rain}</span>
            </div>`)}
          </div>` : S`<div class="w-msg">Stündliche Werte gibt es erst näher am Tag.</div>`}
      ${a.temps.length > 1 ? rs({
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
			caption: `${I(Math.min(...a.temps.map((e) => e.v)), 1)} – ${I(Math.max(...a.temps.map((e) => e.v)), 1)} °C${fs(a.rain)}`,
			labels: [
				o(0),
				o(5),
				o(10),
				o(14),
				o(19)
			]
		}) : T}
    `
	});
}
var fs = (e) => {
	let t = e.reduce((e, t) => e + t.v, 0);
	return t > 0 ? ` · Regen ${I(t, 1)} mm` : "";
};
function ps(e) {
	let t = N(e.config, "precipitation"), n = e.hass.states[t] ? t : void 0, r = e.forecast(), i = e.series(`weather:rain:${r.hourly.length ? r.at : 0}`, () => ta(e.hass, n, r.hourly), 6e5), a = wt(e.hass, e.config, r.hourly, e.now), o = (e) => I((e ?? []).reduce((e, t) => e + t.v, 0), 1), s = i.start ? `${a === null ? "" : `jetzt ${I(a, 1)} mm/h · `}${n ? `24 h ${o(i.past)} mm · ` : ""}nächste 24 h ${o(i.future)} mm` : void 0, c = (e) => `${String(new Date(i.start + e * us).getHours()).padStart(2, "0")} Uhr`;
	return M({
		title: "Niederschlag",
		subtitle: n ? "24 h zurück · 24 h Vorhersage" : "24 h Vorhersage",
		color: Q,
		glow: "rgba(90,140,220,0.35)",
		iconPath: k.drop,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: () => e.openSheet({ id: "weather" }),
		body: S`${rs({
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
function ms(e, t) {
	let n = Bt[t], r = N(e.config, "weather"), i = e.forecast(), a = e.series(`weather:${t}:${i.hourly.length ? i.at : 0}`, () => na(e.hass, r, t, i.hourly), 6e5), o = [...a.past, ...a.future ?? []].map((e) => e.v), s = Number(e.hass.states[r]?.attributes[n.attr]), c = n.unit ? ` ${n.unit}` : "", l = o.length ? `${Number.isFinite(s) ? `jetzt ${I(s, n.digits)}${c} · ` : ""}${I(Math.min(...o), n.digits)} – ${I(Math.max(...o), n.digits)}${c}` : void 0, u = (e) => {
		let t = new Date(a.start + e * us);
		return `${String(t.getHours()).padStart(2, "0")} Uhr`;
	};
	return M({
		title: n.name,
		subtitle: "24 h zurück · 24 h Vorhersage",
		color: n.color,
		glow: `${n.color}33`,
		iconPath: as[t],
		onClose: e.closeSheet,
		onBack: () => e.openSheet({ id: "weather" }),
		body: S`${rs({
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
var hs = o`
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
`, gs = [
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
], _s = "#8fd8ff", vs = "rgba(255,255,255,0.65)", ys = {
	now: "rgba(48,209,88,0.28)",
	possible: "rgba(48,209,88,0.12)"
};
function bs(e, t, n) {
	return t ? Array.from({ length: 5 }, (r, i) => {
		let a = new Date(t + (n - t) * i / 5);
		return e === "24h" ? `${String(a.getHours()).padStart(2, "0")} Uhr` : `${a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")} ${String(a.getHours()).padStart(2, "0")}h`;
	}) : [];
}
function xs(e, t, n) {
	let r = e.rooms.find((e) => e.slug === t);
	if (!r) return T;
	let i = `sensor.${t}_taupunkt`, a = N(e.config, "outdoor_dew"), o = e.series(`dew:${t}:${n}`, () => Zi(e.hass, {
		room: i,
		outdoor: a,
		airing: r.airing
	}, n), 3e5), s = P(e.hass, i), c = P(e.hass, a), l = [s === null ? "" : `innen ${I(s, 1)}°`, c === null ? "" : `außen ${I(c, 1)}°`].filter(Boolean).join(" · ");
	return M({
		title: "Taupunkt",
		subtitle: r.name,
		color: _s,
		glow: `${_s}33`,
		iconPath: k.drop,
		iconStroke: "#0a1a2a",
		onClose: e.closeSheet,
		onBack: () => e.openSheet({
			id: "room",
			slug: t
		}),
		body: S`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${gs.map((r) => S`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "dew",
			slug: t,
			range: r.id
		})}>${r.name}</button>`)}
      </div>
      ${rs({
			title: "Taupunkt",
			color: _s,
			unit: "°C",
			digits: 1,
			snap: 2,
			data: o,
			caption: l || void 0,
			compareColor: vs,
			compareName: "außen",
			bandColors: ys,
			labels: bs(n, o.start, o.end)
		})}
      <div class="dw-legend">
        <span><i style="background:${_s}"></i>innen</span>
        <span><i style="background:${vs}"></i>außen</span>
        <span><i class="dw-box" style="background:${ys.now}"></i>Jetzt lüften</span>
        <span><i class="dw-box" style="background:${ys.possible}"></i>Lüften möglich</span>
      </div>
      <p class="dw-hint">${j(k.drop, 13, "rgba(255,255,255,0.6)", 2.2)}Lüften trocknet, wenn der Taupunkt draußen unter dem im Raum liegt.</p>
    `
	});
}
var Ss = o`
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
`, Cs = "#ff9f0a", ws = "#ffd60a";
function Ts(e, t, n, r, i) {
	return S`
    <div class="cr-row">
      <button class="cr-main" @click=${() => e.moreInfo(t.id)}>
        <span class="circle" style="width:40px;height:40px;background:${r}">${j(n, 18, "#141008", 2.2)}</span>
        <span class="cr-text"><span class="cr-name ellipsis">${t.name}</span><span class="cr-detail">${t.detail}</span></span>
      </button>
      ${t.reset ? S`<button class="cr-act" style="background:${r}" @click=${() => e.confirm({
		title: t.name,
		text: i.text,
		confirm: i.button,
		color: r,
		iconPath: n,
		onConfirm: () => e.call("button", "press", {}, { entity_id: t.reset })
	})}>${i.button}</button>` : i.hint ? S`<span class="cr-hint">${i.hint}</span>` : T}
    </div>`;
}
function Es(e) {
	let t = qt(e.hass), n = Jt(e.hass, e.config), r = t.length + n.length;
	return M({
		title: "Wartung",
		subtitle: r ? `${r} ${r === 1 ? "Gerät braucht" : "Geräte brauchen"} Aufmerksamkeit` : "Alles in Ordnung",
		color: Cs,
		glow: "rgba(255,159,10,0.22)",
		iconPath: O.battery,
		onClose: e.closeSheet,
		body: S`
      ${t.length ? S`<div class="section-head"><h2>Batterien</h2><span class="rule" aria-hidden="true"></span></div>
            ${t.map((t) => Ts(e, t, O.battery, Cs, {
			text: "Batterie getauscht? Das Datum wird in Battery Notes gespeichert.",
			button: "Getauscht"
		}))}` : T}
      ${n.length ? S`<div class="section-head"><h2>Filter</h2><span class="rule" aria-hidden="true"></span></div>
            ${n.map((t) => Ts(e, t, O.filter, ws, {
			text: "Filter gereinigt oder getauscht? Der Zähler wird zurückgesetzt.",
			button: "Erledigt",
			hint: "am Gerät zurücksetzen"
		}))}` : T}
      ${r ? T : S`<p class="cr-empty">Keine schwachen Batterien und keine fälligen Filter.</p>`}
    `
	});
}
var Ds = o`
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
`, Os = {
	cool: "Kühlen",
	dry: "Trocknen",
	fan_only: "Lüften",
	heat: "Heizen",
	auto: "Auto",
	heat_cool: "Auto",
	off: "Aus"
}, ks = [
	"cool",
	"dry",
	"fan_only",
	"heat",
	"auto",
	"heat_cool",
	"off"
], As = {
	cool: "Kühlt",
	dry: "Trocknet",
	fan_only: "Lüftet",
	heat: "Heizt",
	auto: "Auto",
	heat_cool: "Auto",
	off: "Aus"
}, js = {
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
}, Ms = {
	none: "Normal",
	away: "Abwesend",
	sleep: "Schlafen",
	boost: "Boost",
	eco: "Eco",
	comfort: "Komfort"
}, Ns = /flust|fluest|silent|quiet|leise/;
function Ps(e, t) {
	let n = N(t, "ac"), r = e.states[n];
	if (!r) return null;
	let i = r.attributes, a = Gt(e, n), o = _t(e, n) ?? "", s = (t) => {
		let n = String(e.states[t]?.attributes.friendly_name ?? t);
		return n.startsWith(o) && o ? n.slice(o.length).trim() : n;
	}, c = P(e, a.find((t) => t.startsWith("sensor.") && /aussen|outdoor/.test(t) && e.states[t]?.attributes.device_class === "temperature")), l = P(e, N(t, "ac_power")), u = Number(i.current_temperature), d = Number.isFinite(Number(i.temperature)) && i.temperature !== null ? Number(i.temperature) : null, f = r.state === "off" || d === null || ["dry", "fan_only"].includes(r.state) ? As[r.state] ?? r.state : `${As[r.state] ?? r.state} auf ${((e) => `${I(e, e % 1 ? 1 : 0)}°`)(d)}`, p = [
		r.state === "unavailable" ? "Offline" : f,
		Number.isFinite(u) ? `innen ${I(u, 1)}°` : "",
		c === null ? "" : `außen ${I(c, 1)}°`,
		l !== null && l >= 1 ? `${I(Math.round(l))} W` : ""
	].filter(Boolean).join(" · "), m = i.hvac_modes ?? [], h = i.fan_modes ?? [], g = i.swing_modes ?? [], _ = a.filter((t) => t.startsWith("switch.") && !e.entities[t]?.hidden).map((t) => ({
		id: t,
		name: s(t),
		on: e.states[t]?.state === "on"
	})).sort((e, t) => Number(Ns.test(t.id)) - Number(Ns.test(e.id)));
	return {
		id: n,
		state: r.state,
		status: p,
		target: d,
		min: Number(i.min_temp) || 16,
		max: Number(i.max_temp) || 30,
		step: Number(i.target_temp_step) || 1,
		modes: ks.filter((e) => m.includes(e)).map((e) => ({
			id: e,
			name: Os[e]
		})),
		fans: [...h.filter((e) => e === "auto"), ...h.filter((e) => e !== "auto")].map((e) => ({
			id: e,
			name: js[e] ?? e
		})),
		fan: String(i.fan_mode ?? ""),
		presets: (i.preset_modes ?? []).map((e) => ({
			id: e,
			name: Ms[e] ?? e
		})),
		preset: String(i.preset_mode ?? ""),
		swing: g.length > 1 && g.includes("off") ? {
			on: !!i.swing_mode && i.swing_mode !== "off",
			onMode: g.find((e) => e !== "off")
		} : null,
		switches: _,
		selfClean: Kt(e, n, /reinigung|clean/)
	};
}
// src/sheets/ac.ts
var Fs = "#8fd8ff", Is = {
	cool: k.snowflake,
	dry: k.drop,
	fan_only: k.fan,
	heat: k.flame,
	auto: "M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M9 15l3-7 3 7M10 13h4",
	heat_cool: "M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0",
	off: k.power
};
function Ls(e) {
	let t = Ps(e.hass, e.config);
	if (!t) return T;
	let n = t.state !== "off" && t.state !== "unavailable", r = e.target(t.id) ?? t.target, i = (n, r) => e.call("climate", n, r, { entity_id: t.id }), a = (t, n) => e.call("switch", n ? "turn_off" : "turn_on", {}, { entity_id: t });
	return M({
		title: "Klimaanlage",
		subtitle: t.status,
		color: n ? Fs : "rgba(255,255,255,0.16)",
		glow: n ? "rgba(100,210,255,0.22)" : "rgba(255,255,255,0.06)",
		iconPath: k.snowflake,
		iconStroke: n ? "#08202c" : "#fff",
		onClose: e.closeSheet,
		body: S`
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
			return S`<button class="acs-mode ${n ? "active" : ""}" aria-pressed=${n} @click=${() => i("set_hvac_mode", { hvac_mode: e.id })}>
            ${j(Is[e.id] ?? k.power, 18, n ? "#08202c" : "#fff", 2.1)}<span>${e.name}</span>
          </button>`;
		})}
      </div>

      ${t.fans.length ? S`<div class="section-head"><h2>Lüfter</h2><span class="rule" aria-hidden="true"></span></div>
            <div class="acs-seg" role="group" aria-label="Lüfterstufe" style="grid-template-columns: repeat(${t.fans.length}, minmax(0, 1fr))">
              ${t.fans.map((e) => S`<button class=${t.fan === e.id ? "sel" : ""} aria-pressed=${t.fan === e.id}
                @click=${() => i("set_fan_mode", { fan_mode: e.id })}>${e.name}</button>`)}
            </div>` : T}

      ${t.presets.length ? S`<div class="acs-seg" role="group" aria-label="Modus" style="grid-template-columns: repeat(${t.presets.length}, minmax(0, 1fr))">
            ${t.presets.map((e) => S`<button class=${t.preset === e.id ? "sel" : ""} aria-pressed=${t.preset === e.id}
              @click=${() => i("set_preset_mode", { preset_mode: e.id })}>${e.name}</button>`)}
          </div>` : T}

      <div class="acs-toggles">
        ${t.swing ? S`<button class="acs-tog ${t.swing.on ? "on" : ""}" aria-pressed=${t.swing.on}
              @click=${() => i("set_swing_mode", { swing_mode: t.swing.on ? "off" : t.swing.onMode })}>
              <span class="acs-dot"></span><span class="ellipsis">Lamellen schwenken</span></button>` : T}
        ${t.switches.map((e) => S`<button class="acs-tog ${e.on ? "on" : ""}" aria-pressed=${e.on} @click=${() => a(e.id, e.on)}>
          <span class="acs-dot"></span><span class="ellipsis">${e.name}</span></button>`)}
      </div>

      <div class="confirm-row">
        ${t.selfClean ? S`<button class="btn" @click=${() => e.confirm({
			title: "Selbstreinigung",
			text: "Selbstreinigung jetzt starten? Das Gerät läuft dann eine Weile.",
			confirm: "Starten",
			color: Fs,
			iconPath: k.snowflake,
			onConfirm: () => e.call("button", "press", {}, { entity_id: t.selfClean })
		})}>Selbstreinigung</button>` : T}
        <button class="btn" @click=${() => {
			e.closeSheet(), e.moreInfo(t.id);
		}}>Details</button>
      </div>
    `
	});
}
var Rs = o`
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
`, zs = 36e5, Bs = [
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
function Vs(e) {
	return e === "W" ? [{
		id: "4h",
		name: "4 h"
	}, ...Bs] : Bs;
}
var Hs = {
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
}, Us = {
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
function Ws(e, t, n) {
	if (!t) return [];
	let r = [];
	for (let i = 0; i < 5; i++) {
		let a = new Date(t + (n - t) * i / 5);
		e === "4h" ? r.push(`${String(a.getHours()).padStart(2, "0")}:${String(a.getMinutes()).padStart(2, "0")}`) : e === "24h" ? r.push(`${String(a.getHours()).padStart(2, "0")} Uhr`) : e === "7d" ? r.push(a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")) : r.push(`${a.getDate()}.${a.getMonth() + 1}.`);
	}
	return r;
}
function Gs(e, t, n, r, i) {
	if (t === "battery") return qs(e, n);
	let { prefs: a } = e.energy(), o = Hs[t], s = Us[t], c = a ? {
		...Ei(a),
		...Di(a)
	} : null, l = "kWh", u, d, f = null, p = !0;
	if (s) l = "share", u = s.name, d = s.color, c && (f = () => Yi(e.hass, c, n, s.kind));
	else if (t === "cost") l = "€", u = "Stromkosten", d = "#ff9f0a", a && c && (f = () => ea(e.hass, Oi(a), c, n));
	else if (t === "house") u = "Hausverbrauch", d = "#ffffff", c && (f = () => Xi(e.hass, c, n));
	else if (o) {
		u = o.name, d = o.color;
		let t = c ? c[o.ids] : [];
		t.length && (f = () => Ji(e.hass, t, n));
	} else u = r ?? e.config.names?.[t] ?? R(e.hass, t).replace(/\s*(device\s+)?(power|leistung)$/i, ""), d = "#ff9f0a", p = !1, l = "W", f = () => Qi(e.hass, t, n);
	let m = l === "share" ? "%" : l, h = f ? e.series(`energy:${t}:${n}:${l}`, f) : {
		loading: p && !a,
		error: a ? "nicht im Energie-Dashboard" : void 0,
		past: [],
		start: 0,
		end: 0
	}, g = h.past.reduce((e, t) => e + t.v, 0), _ = h.past.length ? l === "share" ? h.total == null ? void 0 : `gesamt ${h.total} % ${s.total}` : l === "€" ? `Summe ${I(g, 2)} €${h.total ? ` · Vergütung ${I(h.total, 2)} €` : ""}` : l === "kWh" ? `Summe ${I(g, g < 10 ? 2 : 1)} kWh` : `Ø ${I(g / h.past.length)} W · ${I(Hi(h.past, h.step ?? zs), 2)} kWh` : void 0, v = n === "4h" ? "5 Min" : n === "24h" ? "Stunde" : "Tag", y = {
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
		body: S`
      <div class="tabs3" role="tablist" aria-label="Zeitraum" style=${`grid-template-columns:repeat(${Vs(l).length},minmax(0,1fr))`}>
        ${Vs(l).map((a) => S`<button role="tab" aria-selected=${a.id === n} class=${a.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "energyChart",
			key: t,
			range: a.id,
			name: r,
			back: i
		})}>${a.name}</button>`)}
      </div>
      ${rs({
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
			labels: Ws(n, h.start, h.end)
		})}
    `
	});
}
var Ks = (e, t, n) => S`
  <div class="tabs3" role="tablist" aria-label="Zeitraum">
    ${Bs.map((r) => S`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
      @click=${() => e.openSheet({
	id: "energyChart",
	key: t,
	range: r.id
})}>${r.name}</button>`)}
  </div>`;
function qs(e, t) {
	let { prefs: n } = e.energy(), r = n ? Di(n) : null, i = P(e.hass, N(e.config, "battery_soc")), a = (r, i) => r?.length ? e.series(`energy:battery-${i}:${t}`, () => Ji(e.hass, r, t)) : {
		loading: !n,
		error: n ? "kein Akku im Energie-Dashboard" : void 0,
		past: [],
		start: 0,
		end: 0
	}, o = a(r?.batteryIn, "in"), s = a(r?.batteryOut, "out"), c = (e) => e.past.reduce((e, t) => e + t.v, 0), l = (e, n, r) => rs({
		title: e,
		color: n,
		unit: "kWh",
		digits: 1,
		snap: .5,
		data: r,
		bars: !0,
		zero: !0,
		caption: r.past.length ? `Summe ${I(c(r), c(r) < 10 ? 2 : 1)} kWh` : void 0,
		labels: Ws(t, r.start, r.end)
	});
	return M({
		title: "Akku",
		subtitle: `${i === null ? "" : `Ladestand ${I(i)} % · `}kWh pro ${t === "24h" ? "Stunde" : "Tag"}`,
		color: "#30d158",
		glow: "#30d15833",
		iconPath: O.bolt,
		onClose: e.closeSheet,
		body: S`
      ${Ks(e, "battery", t)}
      ${l("Geladen", "#30d158", o)}
      ${l("Entladen", "#ffd60a", s)}
    `
	});
}
// src/sheets/airing.ts
function Js(e) {
	let { hass: t, now: n } = e, r = nr(t, e.rooms, e.config, n), i = () => e.runScript(N(e.config, "airing_start")), a = r.active || r.paused, o = a && r.duration ? Math.max(0, Math.min(100, r.remaining / r.duration * 100)) : 100, s = r.paused ? "pausiert" : r.active ? r.remaining > 0 ? "läuft" : "fertig" : "bereit", c = r.recommended.length === 1 ? r.recommended[0] : r.openWindows.length === 1 ? r.openWindows[0] : null;
	return M({
		title: c ? `Lüften · ${c.name}` : "Lüften",
		color: "#5ac8fa",
		glow: "rgba(90,200,250,0.24)",
		iconPath: O.wind,
		iconStroke: "#06202c",
		onClose: e.closeSheet,
		body: S`
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

      ${r.openWindows.length ? S`
          <div class="section-head"><h2>Offene Fenster</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${r.openWindows.map((e) => S`<span class="chip open">${j(O.window, 14, "#ff8a80", 2.4)}${e.name}
              <span class="chip-meta">${yt(vt(t, e.window, n))}</span></span>`)}
          </div>` : T}

      ${r.recommended.length ? S`
          <div class="section-head"><h2>Lüften empfohlen</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${r.recommended.map((e) => {
			let n = P(t, e.humidity);
			return S`<span class="chip rec">${j(k.drop, 14, "#8fd8ff", 2.4)}${e.name}${n === null ? T : S`<span class="chip-meta">${I(Math.round(n))} %</span>`}</span>`;
		})}
          </div>` : T}

      ${a ? S`<div class="confirm-row" style="margin-top:4px">
            <button class="btn" @click=${i}>Neu starten</button>
            <button class="btn primary" style="background:#5ac8fa;color:#06202c"
              @click=${() => e.call("timer", "cancel", {}, { entity_id: N(e.config, "airing_timer") })}>Stopp</button>
          </div>` : S`<button class="btn primary" style="background:#5ac8fa;color:#06202c;margin-top:4px"
            @click=${i}>Lüften starten</button>`}
    `
	});
}
var Ys = o`
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
function Xs(e) {
	let t = N(e.config, "alarm"), n = e.hass.states[t]?.state ?? "unavailable";
	return M({
		title: go(n),
		color: n === "triggered" ? "#ff453a" : "#bf9bff",
		glow: "rgba(191,155,255,0.22)",
		iconPath: En(n),
		iconStroke: "#1d1030",
		onClose: e.closeSheet,
		body: S`
      <div class="alarm-grid">
        ${ho.map((r) => {
			let i = r.state === n;
			return S`
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
var Zs = o`
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
`, Qs = "\n.maplibregl-ctrl-top-left .maplibregl-ctrl { margin: 10px 0 0 10px !important; }\n.maplibregl-ctrl-group {\n  background: none !important; box-shadow: none !important; border: none !important;\n  display: flex; flex-direction: column; gap: 6px;\n}\n.maplibregl-ctrl-group button {\n  width: 36px !important; height: 36px !important;\n  border: none !important; border-radius: 50% !important;\n  background: rgba(20, 22, 28, 0.72) !important;\n  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) !important;\n}\n.maplibregl-ctrl-group button + button { border-top: none !important; }\n.maplibregl-ctrl-group button .maplibregl-ctrl-icon { filter: brightness(0) invert(1); }\n.maplibregl-ctrl-group button:disabled .maplibregl-ctrl-icon { opacity: 0.35; }\n.maplibregl-ctrl-attrib {\n  background: rgba(20, 22, 28, 0.72) !important; color: rgba(255, 255, 255, 0.7) !important;\n  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n  border-radius: 14px !important; margin: 0 8px 8px 0 !important;\n}\n.maplibregl-ctrl-attrib a { color: rgba(255, 255, 255, 0.8) !important; }\n.maplibregl-ctrl-attrib-button { background-color: transparent !important; filter: brightness(0) invert(1); opacity: 0.7; }\n", $s = class extends HTMLElement {
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
		n.className = "sd-map", n.textContent = Qs, t.appendChild(n);
	}
};
customElements.get("start-dashboard-map") || customElements.define("start-dashboard-map", $s);
// src/sheets/persons.ts
var ec = "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0";
function tc(e) {
	let { hass: t } = e, n = Do(t, e.config), r = Object.keys(t.states).filter((e) => e.startsWith("zone.")), i = [...n.map((e) => ({
		entity_id: e.id,
		color: uo[e.place],
		focus: !0
	})), ...r.map((e) => ({
		entity_id: e,
		focus: !1
	}))];
	return M({
		title: "Personen",
		subtitle: Oo(n),
		color: "#30d158",
		glow: "rgba(48,209,88,0.2)",
		iconPath: ec,
		iconStroke: "#0b1a10",
		onClose: e.closeSheet,
		body: S`
      <div class="ps-map"><start-dashboard-map .hass=${t} .entities=${i}></start-dashboard-map></div>
      <div class="ps-list">
        ${n.map((n) => {
			let r = t.states[n.id];
			return S`<div class="ps-row">
            ${mo(n, 44)}
            <span class="ps-text">
              <span class="ps-name">${n.name}</span>
              <span class="ps-sub">${n.zoneName}${r ? ` · ${ko(r.last_changed, e.now)}` : ""}</span>
            </span>
          </div>`;
		})}
      </div>
    `
	});
}
var nc = o`
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
`, rc = [
	"Dauerhaft",
	"1 h",
	"2 h",
	"4 h"
], ic = 7, ac = 25;
async function oc(e) {
	let t = e.allRooms, n = e.config;
	await e.call("input_number", "set_value", { value: t.temp }, { entity_id: N(n, "all_rooms_temperature") }), await e.call("input_text", "set_value", { value: rr(e.rooms, t.selected) }, { entity_id: N(n, "all_rooms_selection") }), await e.call("input_select", "select_option", { option: t.duration }, { entity_id: N(n, "all_rooms_duration") }), await e.runScript(N(n, "all_rooms_apply"));
}
function sc(e) {
	let t = e.allRooms, n = Xn(e.hass, e.rooms), r = (n) => e.setAllRooms({ temp: Math.min(ac, Math.max(ic, Math.round((t.temp + n) * 2) / 2)) }), i = (n) => {
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
		body: S`
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
        ${n.filter((e) => e.id).map((t) => S`<button class="mini"
          @click=${() => e.setAllRooms({ selected: new Set(t.rooms.map((e) => e.slug)) })}>nur ${t.short}</button>`)}
        <button class="mini" @click=${() => e.setAllRooms({ selected: new Set(e.rooms.map((e) => e.slug)) })}>alle</button>
      </div>
      <div class="chips">
        ${e.rooms.map((e) => {
			let n = t.selected.has(e.slug);
			return S`<button class="rchip ${n ? "on" : ""}" aria-pressed=${n} @click=${() => i(e.slug)}>
            ${n ? j(O.check, 14, "#ffc061", 2.8) : ""}${e.name}</button>`;
		})}
      </div>

      <div class="section-head"><h2 style="font-size:14px">Wie lange</h2><span class="rule" aria-hidden="true"></span></div>
      <div class="durations" role="radiogroup" aria-label="Dauer">
        ${rc.map((n) => S`<button role="radio" aria-checked=${t.duration === n} class=${t.duration === n ? "sel" : ""}
          @click=${() => e.setAllRooms({ duration: n })}>${n}</button>`)}
      </div>

      <button class="btn primary apply" ?disabled=${a === 0}
        @click=${async () => {
			await oc(e), e.closeSheet();
		}}>Übernehmen</button>
    `
	});
}
var cc = o`
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
`, lc = 300, uc = 20, dc = 120, fc = [
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
function pc(e, t, n) {
	let r = [];
	for (let i = 0; i < 4; i++) {
		let a = new Date(t + (n - t) * i / 4);
		e === "24h" ? r.push(i === 0 ? `${a.getHours()} Uhr` : String(a.getHours()).padStart(2, "0")) : e === "7d" ? r.push(a.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")) : r.push(`${a.getDate()}.${a.getMonth() + 1}.`);
	}
	return r.push("jetzt"), r;
}
function mc(e, t, n) {
	let r = e === "temp", i = r ? "#ff9f0a" : "#5ac8fa", a = r ? ar(t, lc, uc, dc, .3, .3, 1) : ar(t, lc, uc, dc, 1, 1, 2), o = t.map((e) => e.v), s = o[o.length - 1], c = r ? "°" : " %", l = (e) => r ? I(e, 1) : I(Math.round(e)), u = o.length ? `${l(Math.min(...o))}${r ? "°" : ""} – ${l(Math.max(...o))}${c} · jetzt ${l(s)}${c}` : "keine Daten", d = (a.lo + a.hi) / 2, f = t.length > 1 ? t[t.length - 1].t - t[0].t : 0, p = n === "30d" ? 864e5 : 36e5, m = t.map((e, n) => ({
		x: Math.round(n / Math.max(1, t.length - 1) * lc * 10) / 10,
		y: a.y(e.v),
		time: Wo(e.t, {
			step: p,
			span: f
		}),
		value: `${l(e.v)}${c}`
	})), h = a.y(60), g = !r && 60 > a.lo && 60 < a.hi;
	return S`
    <figure class="fig" style="background:${r ? "rgba(255,159,10,0.08)" : "rgba(90,200,250,0.08)"}">
      <figcaption>
        <span style="font-size:14px;font-weight:600;color:${r ? "#ffc061" : "#8fd8ff"}">${r ? "Temperatur" : "Luftfeuchte"}</span>
        <span class="cap">${u}</span>
      </figcaption>
      <div class="sc-wrap" ${Zo({
		points: m,
		width: 338,
		height: 140,
		color: i
	})}>
      <svg width="100%" viewBox="0 0 338 140" role="img" aria-label="${r ? "Temperaturverlauf" : "Luftfeuchteverlauf"}: ${u}">
        ${r ? C`${[
		a.hi,
		d,
		a.lo
	].map((e) => C`
              <line x1="0" y1=${a.y(e)} x2="338" y2=${a.y(e)} stroke="rgba(255,255,255,0.08)"></line>
              <text x="334" y=${a.y(e) - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${I(e, e % 1 ? 1 : 0)}°</text>`)}` : C`
              ${g ? C`
                <rect x="0" y=${uc} width="338" height=${Math.max(0, h - uc)} fill="rgba(255,255,255,0.04)"></rect>
                <line x1="0" y1=${h} x2="338" y2=${h} stroke="rgba(90,200,250,0.5)" stroke-dasharray="4 4"></line>
                <text x="4" y=${h - 4} fill="rgba(143,216,255,0.85)" font-size="10">60 % Lüftgrenze</text>` : T}
              <line x1="0" y1=${dc} x2="338" y2=${dc} stroke="rgba(255,255,255,0.08)"></line>
              <text x="334" y=${16} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${I(a.hi)} %</text>
              <text x="334" y=${116} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${I(a.lo)} %</text>`}
        ${a.area ? C`<polygon points=${a.area} fill=${r ? "rgba(255,159,10,0.16)" : "rgba(90,200,250,0.16)"}></polygon>` : T}
        ${a.line ? C`<polyline points=${a.line} fill="none" stroke=${i} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>` : T}
        ${a.last ? C`<circle cx=${a.last.x} cy=${a.last.y} r="4.5" fill=${i} stroke="#181a22" stroke-width="2"></circle>` : T}
      </svg>
      <div class="sc-layer"></div>
      </div>
    </figure>
  `;
}
function hc(e, t, n) {
	let r = e.rooms.find((e) => e.slug === t);
	if (!r) return T;
	let i = e.history(t, n), a = n === "24h" && !i.loading ? or(i.hum, i.temp) : null, o = pc(n, i.start, i.end);
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
		body: S`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${fc.map((r) => S`<button role="tab" aria-selected=${r.id === n} class=${r.id === n ? "sel" : ""}
          @click=${() => e.openSheet({
			id: "history",
			slug: t,
			range: r.id
		})}>${r.name}</button>`)}
      </div>
      ${i.loading ? S`<div class="hist-msg">Lade Verlauf …</div>` : i.error ? S`<div class="hist-msg">Verlauf nicht verfügbar: ${i.error}</div>` : S`
            ${mc("temp", i.temp, n)}
            <div>
              ${mc("hum", i.hum, n)}
              <div class="xlabels">${o.map((e) => S`<span>${e}</span>`)}</div>
            </div>
            ${a ? S`<div class="insight">${j(O.wind, 16, "#8fd8ff", 2.2)}<span>${a}</span></div>` : T}`}
    `
	});
}
var gc = o`
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
function _c(e) {
	let t = (e, t, n) => ({
		value: e,
		label: "Fenster",
		icon: O.window,
		c: t,
		tint: n
	});
	switch (e.kind) {
		case "airing": return t(e.remaining > 0 ? `lüftet ${U(e.remaining)}` : "lüftet", "#5ac8fa", "rgba(90,200,250,0.14)");
		case "overdue": return t(`offen ${yt(e.openMin)} · ${e.reason}`, "#ff6b61", "rgba(255,69,58,0.14)");
		case "stuck": return t("Sensor prüfen", "#aeb4c0", "rgba(255,255,255,0.07)");
		case "open": return t("offen (ignoriert)", "#aeb4c0", "rgba(255,255,255,0.07)");
		default: return t("zu", "#7ee8a0", "rgba(255,255,255,0.07)");
	}
}
function vc(e, t) {
	let { hass: n } = e, r = e.rooms.find((e) => e.slug === t);
	if (!r) return T;
	let i = qn(n, r, e.target(r.climate)), a = r.climate, o = ln(r.window ? e.window(r) : {
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
	}[o], l = e.heating().find((e) => e.slug === r.slug), u = l ? `Heizung prüfen · +${I(l.rise, 1)}° in ${l.hours} h ohne Heizbedarf` : i.off ? "Aus" : i.heating ? `heizt${i.valve === null ? "" : ` · Ventile ${i.valve} %`}` : "Soll erreicht", d = ai(n, r), f = si(n, d.map((e) => e.id), e.sceneConfigs(), e.now), p = ii(n, r, e.config.names), m = P(n, N(e.config, "outdoor_dew")), h = F(n, N(e.config, "airing_timer")) === "active", g = [
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
		r.window ? _c(e.window(r)) : null
	].filter((e) => !!e), _ = [i.dew === null ? "" : `Taupunkt ${I(i.dew, 1)}°`, m === null ? "" : `außen ${I(m, 1)}°`].filter(Boolean).join(" vs. ");
	return M({
		title: r.name,
		color: s,
		glow: c,
		iconPath: Ve(r.name, r.icon),
		iconStroke: o ? "#1a1206" : "#fff",
		onClose: e.closeSheet,
		headerExtra: S`
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
		body: S`
      <div class="tcard" style="background: linear-gradient(140deg, ${i.heating ? "rgba(255,159,10,0.3)" : "rgba(255,255,255,0.1)"}, rgba(255,255,255,0.05) 70%)">
        <div class="tcontrol">
          <button class="bigstep" aria-label="Soll senken" ?disabled=${!a} @click=${() => a && e.stepTarget(a, -.5)}>−</button>
          <div class="tcenter">
            <div class="tstate" style="color:${l ? "#ff9f0a" : i.heating ? "#ffd29a" : "rgba(255,255,255,0.75)"}">
              ${i.heating ? j(k.flame, 13, "#ffd29a", 2.4) : T}${u}
            </div>
            <div class="tbig" style="color:${i.heating ? "#ffc061" : "#fff"}">${H(i.target)}°</div>
            <div class="tsoll">Ist <strong>${H(i.cur)}°</strong></div>
          </div>
          <button class="bigstep" aria-label="Soll erhöhen" ?disabled=${!a} @click=${() => a && e.stepTarget(a, .5)}>+</button>
        </div>
        ${a ? S`<div class="presets" role="group" aria-label="Preset">
              ${Gn.map((t) => {
			let n = i.preset === t.id, r = i.presetTemps[t.id];
			return S`
                  <button class="rpreset ${n ? "active" : ""}" aria-pressed=${n}
                    @click=${() => e.call("climate", "set_preset_mode", { preset_mode: t.id }, { entity_id: a })}>
                    <span class="circle" style="width:32px;height:32px;background:${t.color}">${j(Ue[t.id], 16, "#101010", 2.3)}</span>
                    <span class="pname">${t.name}</span>
                    <span class="ptemp">${r === void 0 ? "–" : `${I(r, r % 1 ? 1 : 0)}°`}</span>
                  </button>`;
		})}
            </div>` : T}
      </div>

      ${d.length ? S`<div class="grid3" role="group" aria-label="Szenen">
            ${d.map((t, n) => {
			let r = t.off ? "rgba(255,255,255,0.14)" : ct[n % ct.length], i = t.off ? "#fff" : "#101010", a = f.has(t.id);
			return S`<button class="scene ${a ? "on" : ""}" aria-pressed=${a} style=${a ? `background:${t.off ? "rgba(255,255,255,0.2)" : r + "33"};box-shadow:0 0 18px ${t.off ? "rgba(255,255,255,0.08)" : r + "40"}` : ""}
                @click=${() => e.call("scene", "turn_on", {}, { entity_id: t.id })}>
                <span class="circle" style="width:36px;height:36px;background:${r}">${t.off ? j(k.power, 16, i, 2.1) : lt(t.icon, k.scene, i)}</span>
                <span class="ellipsis">${t.name}</span>
              </button>`;
		})}
          </div>` : T}

      ${g.length ? S`<div class="facts" style="grid-template-columns: repeat(${g.length}, minmax(0, 1fr))">
            ${g.map((e) => {
			let t = S`${j(e.icon, 18, e.c, 2)}<span class="fv">${e.value}</span><span class="fl">${e.label}</span>`;
			return "tap" in e && e.tap ? S`<button class="fact" style="background:${e.tint}" aria-label="${e.label}, Verlauf anzeigen" @click=${e.tap}>${t}</button>` : S`<div class="fact" style="background:${e.tint}">${t}</div>`;
		})}
          </div>` : T}

      ${i.airing ? S`<div class="airrow">
            <span class="circle" style="width:40px;height:40px;background:rgba(90,200,250,0.25)">${j(O.wind, 18, "#8fd8ff", 2.2)}</span>
            <span class="grow"><span class="t1s">${h ? "Lüften läuft" : i.airing}</span><span class="t2s">${_}</span></span>
            ${h ? S`<button class="airbtn" @click=${() => e.openSheet({ id: "airing" })}>Ansehen</button>` : i.airing === "Nicht lüften" ? T : S`<button class="airbtn" @click=${() => {
			e.runScript(N(e.config, "airing_start")), e.openSheet({ id: "airing" });
		}}>Start</button>`}
          </div>` : T}

      ${p.length ? S`<div class="grid2">
            ${p.map((n) => {
			let r = n.kind === "light" ? pi(e.hass.states[n.id]?.attributes ?? {}) : null, i = r ? r.color : "#30d158";
			return S`<button class="dev ${n.on ? "on" : ""} ${n.unavailable ? "na" : ""}" style=${n.on ? `background:${r ? r.bg : `${i}24`}` : ""}
                ${wr({
				tap: () => La(e, n.id),
				hold: () => e.openSheet({
					id: "device",
					entity: n.id,
					back: {
						id: "room",
						slug: t
					}
				})
			})}>
                <span class="circle" style="width:38px;height:38px;background:${n.on ? i : "rgba(255,255,255,0.12)"}">${j(We(n.id, n.name), 16, n.on ? r ? r.icon : "#0b1a10" : "#fff", 2)}</span>
                <span class="devtext"><span class="t1s ellipsis">${n.name}</span><span class="t2s ellipsis">${n.status}</span></span>
              </button>`;
		})}
          </div>` : T}
    `
	});
}
var yc = o`
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
`, bc, xc = "0.18.0", $ = [
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
], Sc = {
	overview: "radial-gradient(100% 30% at 0% 0%, rgba(110,90,200,0.34), transparent 70%), radial-gradient(80% 30% at 100% 40%, rgba(90,200,250,0.12), transparent 70%)",
	climate: "radial-gradient(100% 30% at 50% 0%, rgba(255,140,60,0.26), transparent 70%), radial-gradient(80% 30% at 0% 55%, rgba(90,200,250,0.12), transparent 70%)",
	rooms: "radial-gradient(100% 28% at 50% 0%, rgba(255,214,10,0.18), transparent 70%)",
	energy: "radial-gradient(100% 28% at 50% 0%, rgba(48,209,88,0.2), transparent 70%)",
	security: "radial-gradient(100% 28% at 50% 0%, rgba(191,155,255,0.22), transparent 70%)"
}, Cc = 36e5, wc = {
	"24h": {
		ms: 24 * Cc,
		bucket: Cc,
		period: "hour"
	},
	"7d": {
		ms: 168 * Cc,
		bucket: Cc,
		period: "hour"
	},
	"30d": {
		ms: 720 * Cc,
		bucket: 24 * Cc,
		period: "day"
	}
}, Tc = 700, Ec = 15e3;
function Dc() {
	let e = "ha-start-dashboard-font";
	if (document.getElementById(e)) return;
	let t = document.createElement("link");
	t.id = e, t.rel = "stylesheet", t.href = "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap", document.head.appendChild(t);
}
var Oc = class extends ze {
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
			let r = e.clientX - t.navLeft, i = Xe(r, t.tabs);
			this._navDrag && i !== this._navDrag.hover && Sr(this, "selection"), this._navDrag = {
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
		this._config = e, this._page = e.page ?? "overview", this._roomsKey = void 0, e.load_font !== !1 && Dc();
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
		super.disconnectedCallback(), window.clearInterval(this._tick), window.clearInterval(this._fastTick), this._fastTick = void 0, Vr(this);
	}
	updated(e) {
		let t = this._config?.header ?? "hide", n = Br(this, t) ? t : "";
		if (n !== this._hdr && (this._hdr = n), e.has("_sheet") || e.has("hass")) {
			let e = this.hass && this._config ? this.hass.states[N(this._config, "airing_timer")] : void 0, t = this._sheet?.id === "airing" || e?.state === "active";
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
			(!t || e.some((e, n) => e !== t[n])) && (this._rooms = dr(this.hass, this._config), this._roomsKey = e);
		}
		if (this.hass && e.has("hass")) {
			let e = Date.now(), t = !1, n = { ...this._pending };
			for (let [r, i] of Object.entries(n)) {
				let [a, o] = r.split("|");
				(Number(this.hass.states[a]?.attributes[o]) === i.value && e - i.at > Tc || e - i.at > Ec) && (delete n[r], t = !0);
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
		}, window.clearTimeout(this._debounce[i]), this._debounce[i] = window.setTimeout(r, Tc);
	}
	_stepTarget(e, t) {
		let n = this.hass?.states[e]?.attributes;
		if (!n) return;
		let r = Jn(this._target(e) ?? 19, t, Number(n.min_temp) || 7, Number(n.max_temp) || 30, Number(n.target_temp_step) || .5);
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
				duration: t && rc.includes(t) ? t : "Dauerhaft"
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
		let i = wc[t], a = Date.now(), o = Math.floor((a - i.ms) / i.bucket) * i.bucket, s = {
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
				s.length < 2 && (s = ir(t(a[0]), n, r, i.bucket)), c.length < 2 && (c = ir(t(a[1]), n, r, i.bucket));
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
		}, da(this.hass, dr(this.hass, this._config), Ai(this._config, this._energy.prefs), e ?? {}).then((e) => this._heating = {
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
			let e = dr(t, n);
			i = this._winMemo = {
				hass: t,
				now: r,
				rooms: e,
				key: ma(t, e, r.getTime()).map((e) => e.slug).join(",")
			};
		}
		let { rooms: a, key: o } = i, s = this._stuck;
		!s.loading && (s.key !== o || Date.now() - s.at > 6e5) && (this._stuck = {
			...s,
			key: o,
			loading: !0
		}, ha(t, a, n).then((e) => this._stuck = {
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
		let c = pn(t.states[N(n, "window_snooze")]?.state);
		return dn(t, e, n, r, {
			stuck: o ? s.key === o && s.slugs.includes(e.slug) : !1,
			snoozed: !!e.window && mn(c, e.window, r.getTime())
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
			let t = Ei(e);
			if (t.solar.length + t.import.length + t.export.length) {
				let n = await $i(this.hass, {
					...t,
					...Di(e)
				}, Oi(e));
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
		if (!this.hass || !this._config) return T;
		let e = this._ctx(), t = this._config.nav !== !1;
		return S`
      <div class="wrap ${this._hdr ? `hdr-${this._hdr}` : ""}" style="background-image:${Sc[this._page]}">
        <main class="content">${this._renderPage(e)}</main>
        ${t ? this._renderNav() : T}
      </div>
      ${this._renderSheets(e)}
    `;
	}
	_renderPage(e) {
		if (this._page === "overview") return ka(e);
		if (this._page === "climate") return Ca(e);
		if (this._page === "rooms") return Xa(e);
		if (this._page === "energy") return so(e);
		if (this._page === "security") return No(e);
		let t = $.find((e) => e.id === this._page);
		return S`
      <header class="page-head">
        <div class="date">${Cn(e.now)}</div>
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
		return S`
      <nav class="nav ${n ? "dragging" : ""}" aria-label="Bereiche"
        @pointerdown=${this._navDown} @pointermove=${this._navMove} @pointerup=${this._navUp} @pointercancel=${this._navCancel}>
        <span class="lens" style=${i} aria-hidden="true"></span>
        ${$.map((e, t) => {
			let r = e.id === this._page, i = n?.hover === t;
			return S`
            <button class="tab ${r ? "active" : ""} ${i ? "hover" : ""}" aria-label=${e.name} aria-current=${r ? "page" : "false"}
              @click=${() => this._selectPage(e.id)}>
              ${j(e.icon, 20, "currentColor")}${r ? S`<span>${e.name}</span>` : T}
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
			let r = Fr(n);
			r && t.push({
				key: Ir(r),
				view: this._sheetView(e, r)
			}), t.push({
				key: Ir(n),
				view: this._sheetView(e, n)
			});
		}
		if (this._confirm && t.push({
			key: "confirm",
			view: ut({
				...this._confirm,
				onClose: () => this._confirm = null
			})
		}), !t.length) return T;
		let r = t.length - 1;
		return Pr(t, (e) => e.key, (e, t) => S`
      <div class="layer ${t < r ? "under" : ""} ${t > 0 ? "stacked" : ""}" ?inert=${t < r}>${e.view}</div>`);
	}
	_sheetView(e, t) {
		switch (t.id) {
			case "persons": return tc(e);
			case "alarm": return Xs(e);
			case "room": return vc(e, t.slug);
			case "history": return hc(e, t.slug, t.range);
			case "airing": return Js(e);
			case "allRooms": return sc(e);
			case "device": return Va(e, t.entity, t);
			case "robby": return Lo(e);
			case "weather": return ls(e);
			case "care": return Es(e);
			case "ac": return Ls(e);
			case "energyChart": return Gs(e, t.key, t.range, t.name, t.back);
			case "weatherMetric": return ms(e, t.metric);
			case "weatherRain": return ps(e);
			case "dew": return xs(e, t.slug, t.range);
			case "weatherDay": return ds(e, t.date);
		}
	}
};
bc = Oc, bc.properties = {
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
}, bc.styles = [
	hr,
	dt,
	Aa,
	wa,
	Zs,
	nc,
	yc,
	gc,
	Ys,
	cc,
	eo,
	Ja,
	lo,
	Po,
	Ro,
	hs,
	Ss,
	Ds,
	Rs,
	is,
	Qo,
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
], customElements.get("ha-start-dashboard") || customElements.define("ha-start-dashboard", Oc);
var kc = window;
kc.customCards = kc.customCards ?? [], kc.customCards.push({
	type: "ha-start-dashboard",
	name: "Start Dashboard",
	description: "Phone-first Start dashboard (Übersicht, Klima, Räume, Energie, Schutz) in one card.",
	preview: !1
}), console.info(`%c START-DASHBOARD %c ${xc} `, "background:#bf9bff;color:#1d1030;font-weight:700", "background:#181a22;color:#fff");
export { Oc as HaStartDashboard };
