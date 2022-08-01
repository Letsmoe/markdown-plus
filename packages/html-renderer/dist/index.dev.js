/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ var __webpack_modules__ = ({

/***/ "./node_modules/@snowblind/core/dist/snowblind.min.js":
/*!************************************************************!*\
  !*** ./node_modules/@snowblind/core/dist/snowblind.min.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Snowblind\": () => (/* binding */ v),\n/* harmony export */   \"applyChange\": () => (/* binding */ C),\n/* harmony export */   \"applyMemo\": () => (/* binding */ O),\n/* harmony export */   \"applyReducer\": () => (/* binding */ w),\n/* harmony export */   \"applyRef\": () => (/* binding */ g),\n/* harmony export */   \"applyState\": () => (/* binding */ U),\n/* harmony export */   \"applyStyles\": () => (/* binding */ j)\n/* harmony export */ });\nvar e={d:(t,n)=>{for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)},t={};e.d(t,{KS:()=>m,vH:()=>d,ji:()=>b,E5:()=>y,bk:()=>p,Ei:()=>u,Zs:()=>h});class n{constructor(e){this.subscriberCount=0,this.value=e,this.subscribers=[]}next(e){this.value=e;for(const t of this.subscribers)t(e)}subscribe(e){this.subscribers.push(e),this.subscriberCount++}restore(){this.subscribers=[],this.value=void 0}}function r(e){let t={value:e.value};return e.subscribe((e=>t.value=e)),new Proxy(t,{get(t,n){if(n===i)return e;const r=Reflect.get(t,\"value\"),o=r[n];return\"function\"==typeof o?o.bind(r):o},ownKeys:e=>Reflect.ownKeys(e.value)})}class o{constructor(){this.current}}const s=new n,i=Symbol(\"isProxy\");class a{constructor(e,t){this.didUpdateOnce=!1,this.didMountCallbacks=[],this.didUpdateCallbacks=[],this.willUnmountCallbacks=[],this.type=t,this.generator=e,s.next(this),s.restore()}render(){return this.node=this.generator(),this.node}onComponentDidMount(e){this.didMountCallbacks.push(e)}onComponentDidUpdate(e){this.didUpdateCallbacks.push(e)}onComponentWillUnmount(e){this.willUnmountCallbacks.push(e)}didUpdate(){this.didUpdateOnce?this.didUpdateCallbacks.forEach((e=>e(this.node))):(this.didMountCallbacks.forEach((e=>e(this.node))),this.didUpdateOnce=!0)}}function l(e,t){if(t instanceof DocumentFragment)return e.appendChild(t),t;{s.next(t);let n=t.render();return e.appendChild(n),t.didUpdate(),n}}const c={allowObjectProperties:!1};function u(e){const t=new n(e);let o;return s.subscribe((e=>{o=e})),[r(t),e=>(t.next(e),o.node.replaceWith&&o.node.replaceWith(o.render()),e)]}const f=function e(t,n){if(t===n)return!0;if(!(t instanceof Object&&n instanceof Object))return!1;if(t.constructor!==n.constructor)return!1;for(var r in t)if(t.hasOwnProperty(r)){if(!n.hasOwnProperty(r))return!1;if(t[r]!==n[r]){if(\"object\"!=typeof t[r])return!1;if(!e(t[r],n[r]))return!1}}for(r in n)if(n.hasOwnProperty(r)&&!t.hasOwnProperty(r))return!1;return!0};function d(e,t=[]){var r=t.map((e=>e.valueOf()));const o=s.value,i=n=>{if(r.length>0){let o=!1;for(let e=0;e<r.length;e++)if(!f(r[e],t[e].valueOf())){o=!0;break}o&&(e(n),r=t.map((e=>e.valueOf())))}else e(n)};o.onComponentDidMount(i),o.onComponentDidUpdate(i),t.forEach((e=>{e instanceof n&&e.subscribe(i)}))}function p(){return new o}function h(e){const t=e=>{for(var t=\"\",n=\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\",r=n.length,o=0;o<e;o++)t+=n.charAt(Math.floor(Math.random()*r));return t};let n=document.createElement(\"style\");document.head.appendChild(n);let r,o=n.sheet,s=\"\";const i={},a=e=>{for(const n in e){let l=e[n];if(null===l)r.style[n]=\"none\";else if(\"number\"==typeof l)r.style[n]=l+\"px\";else if(\"string\"==typeof l)r.style[n]=l;else{if(n.indexOf(\"&\")>-1){let e=n.replace(/&/g,s);o.insertRule(`.${e} {}`,0),s=e}else{const e=t(10);o.insertRule(`.${e} {}`,0),s=e,i[n]=e}r=o.cssRules[0],a(l)}}};return a(e),i}function b(e,t){let o=e();const s=new n(o),a=r(s);for(const r of t){let t=r[i];t instanceof n&&t.subscribe((()=>{s.next(e())}))}return a}function y(e,t,n=(e=>e)){let r=n(t);const[o,s]=u(r);return[o,t=>{let n=e(o,t);s(n)}]}const m={options:c,Component:a,Fragment:\"div\",make:function(e,t,...r){let s;if(t=t||{},\"function\"==typeof e){t.children=r||[];let n=e(t);if(\"function\"!=typeof n)throw new Error(\"Snowblind component initializers must return a function.\");return new a(n,e.displayName||e.name)}s=-32===e?document.createDocumentFragment():document.createElement(e);for(const[e,r]of Object.entries(t))if(\"function\"==typeof r)s[e]=r;else if(r instanceof n)s.setAttribute(e,r.value);else if(r instanceof o)r.current=s;else if(\"object\"==typeof r)if(\"style\"===e)for(let[e,t]of Object.entries(r))null===t?t=\"none\":\"number\"==typeof t&&(t+=\"px\"),s.style[e]=t;else if(\"props\"===e)for(const[e,t]of Object.entries(r))s[e]=t;else c.allowObjectProperties&&s.setAttribute(e,JSON.stringify(r));else s.setAttribute(e,r.toString());const u=e=>{for(const t of e)if(Array.isArray(t))u(t);else if(t instanceof a)l(s,t),t.didUpdate();else if(t instanceof HTMLElement)s.appendChild(t);else if(t&&t[i]instanceof n){let e=document.createTextNode(t);s.appendChild(e)}else s.appendChild(document.createTextNode(t))};return u(r.flat(1/0)),s},render:l};var v=t.KS,C=t.vH,O=t.ji,w=t.E5,g=t.bk,U=t.Ei,j=t.Zs;\n\n//# sourceURL=webpack://@markdownplus/html-renderer/./node_modules/@snowblind/core/dist/snowblind.min.js?");

/***/ }),

/***/ "./dist/Footer.js":
/*!************************!*\
  !*** ./dist/Footer.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Footer\": () => (/* binding */ Footer)\n/* harmony export */ });\n/* harmony import */ var _snowblind_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @snowblind/core */ \"./node_modules/@snowblind/core/dist/snowblind.min.js\");\n\nfunction Footer(props) {\n    return () => (_snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"div\", { class: \"footer\" }));\n}\n//# sourceMappingURL=Footer.js.map\n\n//# sourceURL=webpack://@markdownplus/html-renderer/./dist/Footer.js?");

/***/ }),

/***/ "./dist/Header.js":
/*!************************!*\
  !*** ./dist/Header.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Header\": () => (/* binding */ Header)\n/* harmony export */ });\n/* harmony import */ var _snowblind_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @snowblind/core */ \"./node_modules/@snowblind/core/dist/snowblind.min.js\");\n/* harmony import */ var _shared_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared.js */ \"./dist/shared.js\");\n\n\nfunction Header(props) {\n    const [config, updateConfig] = (0,_snowblind_core__WEBPACK_IMPORTED_MODULE_0__.applyState)({});\n    fetch(\"/scripts/config.json\").then(response => {\n        response.json().then(config => {\n            updateConfig(config);\n        });\n    });\n    var theme = localStorage.getItem(\"default-color-scheme\") || (window.matchMedia(\"(prefers-color-scheme: dark)\") ? \"dark\" : \"light\");\n    const themeRef = (0,_snowblind_core__WEBPACK_IMPORTED_MODULE_0__.applyRef)();\n    document.body.classList.add(theme);\n    var sidebarHidden = false;\n    return () => (_snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"div\", { class: \"header\" },\n        _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"div\", null,\n            _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"button\", { onclick: () => {\n                    if (_shared_js__WEBPACK_IMPORTED_MODULE_1__.sidebarRef.current.offsetWidth > 80) {\n                        _shared_js__WEBPACK_IMPORTED_MODULE_1__.sidebarRef.current.style.width = \"6px\";\n                    }\n                    else {\n                        _shared_js__WEBPACK_IMPORTED_MODULE_1__.sidebarRef.current.style.width = \"300px\";\n                    }\n                    sidebarHidden = !sidebarHidden;\n                } }, \"Hide\")),\n        _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"div\", { class: \"link-list\" },\n            config.themeConfig && config.themeConfig.nav.map(item => {\n                return (_snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"a\", { href: item.link }, item.text));\n            }),\n            _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"span\", { ref: themeRef, class: \"theme-toggle \" + theme, onclick: () => {\n                    let oldTheme = theme;\n                    theme = (theme == \"light\" ? \"dark\" : \"light\");\n                    document.body.classList.add(theme);\n                    document.body.classList.remove(oldTheme);\n                    themeRef.current.classList.add(theme);\n                    themeRef.current.classList.remove(oldTheme);\n                    localStorage.setItem(\"default-color-scheme\", theme);\n                } }))));\n}\n//# sourceMappingURL=Header.js.map\n\n//# sourceURL=webpack://@markdownplus/html-renderer/./dist/Header.js?");

/***/ }),

/***/ "./dist/Sidebar.js":
/*!*************************!*\
  !*** ./dist/Sidebar.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Sidebar\": () => (/* binding */ Sidebar)\n/* harmony export */ });\n/* harmony import */ var _snowblind_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @snowblind/core */ \"./node_modules/@snowblind/core/dist/snowblind.min.js\");\n/* harmony import */ var _shared_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared.js */ \"./dist/shared.js\");\n\n\nfunction Sidebar(props) {\n    const dragRef = (0,_snowblind_core__WEBPACK_IMPORTED_MODULE_0__.applyRef)();\n    fetch(\"/assets/summary.html\").then(response => {\n        response.text().then(responseText => {\n            let template = document.createElement(\"template\");\n            template.innerHTML = responseText;\n            for (const child of Array.from(template.content.childNodes)) {\n                _shared_js__WEBPACK_IMPORTED_MODULE_1__.sidebarRef.current.appendChild(child);\n            }\n        });\n    });\n    return () => (_snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"div\", { class: \"sidebar\", ref: _shared_js__WEBPACK_IMPORTED_MODULE_1__.sidebarRef },\n        _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"div\", { class: \"resize-handle\", onmousedown: (downEvent) => {\n                document.body.style.cursor = \"col-resize\";\n                document.body.style.userSelect = \"none\";\n                let startX = downEvent.clientX;\n                let startWidth = _shared_js__WEBPACK_IMPORTED_MODULE_1__.sidebarRef.current.offsetWidth;\n                const mousemove = (e) => {\n                    let endX = e.clientX;\n                    let diff = startX - endX;\n                    let endWidth = startWidth - diff;\n                    if (endWidth < 600) {\n                        _shared_js__WEBPACK_IMPORTED_MODULE_1__.sidebarRef.current.style.width = endWidth + \"px\";\n                    }\n                    if (endWidth < 80) {\n                        _shared_js__WEBPACK_IMPORTED_MODULE_1__.sidebarRef.current.style.width = 6 + \"px\";\n                    }\n                };\n                window.addEventListener(\"mousemove\", mousemove);\n                const mouseup = () => {\n                    document.body.style.cursor = \"auto\";\n                    document.body.style.userSelect = \"\";\n                    window.removeEventListener(\"mouseup\", mouseup);\n                    window.removeEventListener(\"mousemove\", mousemove);\n                };\n                window.addEventListener(\"mouseup\", mouseup);\n            }, ref: dragRef })));\n}\n//# sourceMappingURL=Sidebar.js.map\n\n//# sourceURL=webpack://@markdownplus/html-renderer/./dist/Sidebar.js?");

/***/ }),

/***/ "./dist/Toc.js":
/*!*********************!*\
  !*** ./dist/Toc.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Toc\": () => (/* binding */ Toc)\n/* harmony export */ });\n/* harmony import */ var _snowblind_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @snowblind/core */ \"./node_modules/@snowblind/core/dist/snowblind.min.js\");\n\nfunction getHeadingPositions() {\n    return Array.from(document.querySelectorAll(\".markdown-body h2, .markdown-body h3\")).map(x => {\n        return {\n            top: x.getBoundingClientRect().top,\n            element: x\n        };\n    });\n}\nfunction Toc(props) {\n    const body = document.querySelector(\".markdown-body\");\n    const tocRef = (0,_snowblind_core__WEBPACK_IMPORTED_MODULE_0__.applyRef)();\n    var h2Headings = [];\n    if (body) {\n        h2Headings = Array.from(body.querySelectorAll(\"h2\"));\n    }\n    window.addEventListener(\"scroll\", (e) => {\n        const currentY = window.scrollY;\n        const positions = getHeadingPositions();\n        let current;\n        for (const { element, top } of positions) {\n            if (top < 100) {\n                current = element;\n            }\n        }\n        if (current) {\n            let id = current.id;\n            let active = tocRef.current.querySelector(\".active\");\n            let newActive = tocRef.current.querySelector(`[href='#${id}']`);\n            if (active != newActive) {\n                if (active)\n                    active.classList.remove(\"active\");\n                if (newActive)\n                    newActive.classList.add(\"active\");\n            }\n        }\n    });\n    return () => _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"div\", { class: \"toc\", ref: tocRef },\n        _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"h3\", null, \"On this page\"),\n        h2Headings.map((h) => {\n            const h3Headings = nextUntil(h, \"h2\", \"h3\");\n            return (_snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"div\", null,\n                _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"a\", { href: \"#\" + h.id, class: \"heading\" }, h.textContent),\n                h3Headings.map(x => {\n                    return _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(\"a\", { href: \"#\" + x.id, class: \"subheading\" }, x.textContent);\n                })));\n        }));\n}\nfunction nextUntil(elem, selector, filter) {\n    // Setup siblings array\n    var siblings = [];\n    // Get the next sibling element\n    elem = elem.nextElementSibling;\n    // As long as a sibling exists\n    while (elem) {\n        // If we've reached our match, bail\n        if (elem.matches(selector))\n            break;\n        // If filtering by a selector, check if the sibling matches\n        if (filter && !elem.matches(filter)) {\n            elem = elem.nextElementSibling;\n            continue;\n        }\n        // Otherwise, push it to the siblings array\n        siblings.push(elem);\n        // Get the next sibling element\n        elem = elem.nextElementSibling;\n    }\n    return siblings;\n}\n;\n//# sourceMappingURL=Toc.js.map\n\n//# sourceURL=webpack://@markdownplus/html-renderer/./dist/Toc.js?");

/***/ }),

/***/ "./dist/index.js":
/*!***********************!*\
  !*** ./dist/index.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _snowblind_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @snowblind/core */ \"./node_modules/@snowblind/core/dist/snowblind.min.js\");\n/* harmony import */ var _Header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Header.js */ \"./dist/Header.js\");\n/* harmony import */ var _Footer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Footer.js */ \"./dist/Footer.js\");\n/* harmony import */ var _Sidebar_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Sidebar.js */ \"./dist/Sidebar.js\");\n/* harmony import */ var _Toc_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Toc.js */ \"./dist/Toc.js\");\n/**\n * Load the default markdown into the markdown body.\n */\n\n\n\n\n\nwindow.onload = () => {\n    _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.render(document.body, _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(_Header_js__WEBPACK_IMPORTED_MODULE_1__.Header, null));\n    _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.render(document.body, _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(_Sidebar_js__WEBPACK_IMPORTED_MODULE_3__.Sidebar, null));\n    _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.render(document.body, _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(_Footer_js__WEBPACK_IMPORTED_MODULE_2__.Footer, null));\n    _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.render(document.body, _snowblind_core__WEBPACK_IMPORTED_MODULE_0__.Snowblind.make(_Toc_js__WEBPACK_IMPORTED_MODULE_4__.Toc, null));\n};\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack://@markdownplus/html-renderer/./dist/index.js?");

/***/ }),

/***/ "./dist/shared.js":
/*!************************!*\
  !*** ./dist/shared.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"sidebarRef\": () => (/* binding */ sidebarRef)\n/* harmony export */ });\n/* harmony import */ var _snowblind_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @snowblind/core */ \"./node_modules/@snowblind/core/dist/snowblind.min.js\");\n\nconst sidebarRef = (0,_snowblind_core__WEBPACK_IMPORTED_MODULE_0__.applyRef)();\n\n//# sourceMappingURL=shared.js.map\n\n//# sourceURL=webpack://@markdownplus/html-renderer/./dist/shared.js?");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = __webpack_require__("./dist/index.js");
/******/ 
