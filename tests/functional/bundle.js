// Loads all modules used by samples/functional tests, does other various setup.

// Find the <script src="functional-tests.js"> tag, to get tests directory.
let scripts = document.getElementsByTagName("script"), script, testDir;
for (var i = 0; (script = scripts[i]); i++) {
	var src = script.getAttribute("src"),
		match = src && src.match(/(.*|^)boilerplate\.js/i);
	if (match) {
		// Sniff location of delite/tests directory relative to this test file.  testDir will be an empty string if
		// it's the same directory, or a string including a slash, ex: "../", if the test is in a subdirectory.
		testDir = match[1];

		break;
	}
}

// Add polyfills for IE.  Does this work from bundle.js?
if (/Trident/.test(navigator.userAgent)) {
	document.write("<script type='text/javascript' src='" + testDir + "ie-polyfills.js'></script>");
	document.write("<script type='text/javascript' src='" + testDir +
		"../node_modules/@webcomponents/custom-elements/custom-elements.min.js'></script>");
}

// For testing purposes, if dir=rtl is in the URL, then set dir=rtl on <html>.
if (/dir=rtl/i.test(window.location.search)) {
	document.documentElement.setAttribute("dir", "rtl");
}

// Similarly, if hc is in the URL search string, set d-hc class on <body>
// (even if the computer isn't really in high contrast mode).
if (/hc/.test(window.location.search)) {
	domReady(function () {
		document.body.classList.add("d-hc");
	});
}

// Map from module id to module.  Also makes sure modules tests need are in the bundle.
const map = {
	"dojo-dstore/Memory": require("dojo-dstore/Memory"),
	"dojo-dstore/Trackable": require("dojo-dstore/Trackable"),
	"ibm-decor/Observable": require("ibm-decor/Observable"),
	"ibm-decor/ObservableArray": require("ibm-decor/ObservableArray"),

	"deliteful/LinearLayout": require("deliteful/LinearLayout"),
	"deliteful/ViewStack": require("deliteful/ViewStack"),
	"deliteful/list/List": require("deliteful/list/List"),
	"deliteful/list/PageableList": require("deliteful/list/PageableList"),

	// For List sample pages.
	"deliteful/samples/list/CustomCategoryList": require("deliteful/samples/list/CustomCategoryList"),
	"deliteful/samples/list/CustomItemList": require("deliteful/samples/list/CustomItemList"),
	"deliteful/samples/list/DataForm": require("deliteful/samples/list/DataForm"),
	"deliteful/samples/list/InputElementList": require("deliteful/samples/list/InputElementList"),
	"deliteful/samples/list/NavigationList": require("deliteful/samples/list/NavigationList"),

	// For List functional test pages.
	"deliteful/tests/functional/list/ComplexList": require("deliteful/tests/functional/list/ComplexList"),
	"deliteful/tests/functional/list/CustomList1": require("deliteful/tests/functional/list/CustomList1"),
	"deliteful/tests/functional/list/BookList": require("deliteful/tests/functional/list/BookList")
};

// Create Promise that resolves when the document has finished loading.
const domReady = require("requirejs-domready/domReady");
const readyPromise = new Promise(function (resolve) {
	domReady(resolve);
});

// Global method similar to old AMD require().
module.exports = window.delitefulRequire = function (dependencies, callback) {
	readyPromise.then(function () {
		callback(...dependencies.map(function (mid) {
			const obj = map[mid];
			return obj.__esModule && obj.default ? obj.default : obj;
		}));
	});
};

// Loads webpack-runtime-require as another way to get dependencies.   Require("...") API (but apparently
// with only the module name, not the full module path).
window.webpackData = __webpack_require__;
require("webpack-runtime-require");


