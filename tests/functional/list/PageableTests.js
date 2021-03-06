define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = requirejs.nodeRequire("@theintern/leadfoot/helpers/pollUntil").default;
	var keys = requirejs.nodeRequire("@theintern/leadfoot/keys").default;
	var assert = intern.getPlugin("chai").assert;

	function loadNextPage(remote, listId, pageSize, expectedActiveTextAfterLoad, comment) {
		return remote.pressKeys(keys.PAGE_DOWN)
			.pressKeys(keys.TAB)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.strictEqual(value, "Click to load " + pageSize + " more items", comment + " (a)");
			})
			.end()
			.pressKeys(keys.SPACE)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.strictEqual(value, expectedActiveTextAfterLoad, comment + " (b)");
			})
			.end();
	}

	function loadPreviousPage(remote, listId, pageSize, expectedActiveTextAfterLoad, comment) {
		return remote.pressKeys(keys.PAGE_UP)
			.pressKeys(keys.SHIFT + keys.TAB)
			.pressKeys(keys.SHIFT) // release shift
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.strictEqual(value, "Click to load " + pageSize + " more items", comment + " (a)");
			})
			.end()
			.pressKeys(keys.SPACE)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.strictEqual(value, expectedActiveTextAfterLoad, comment + " (b)");
			})
			.end();
	}

	registerSuite("Pageable tests", {
		"Pageable list keyboard navigation": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			if (remote.environmentType.browserName === "internet explorer") {
				// On most browsers, when you click "next page", focus goes to the first item of the new page.
				// But on IE, the list is scrolled to the end and the last item of the new page is focused.
				// I'm assuming that the other browsers have the intended behavior, but I'm not planning to fix IE.
				return this.skip("On IE, loading a new page jumps focus to the end of the page");
			}
			var listId = "pageable-prog-1";
			return remote
				.get("deliteful/tests/functional/list/pageable-prog-1.html")
				.then(pollUntil("return ('ready' in window &&  ready "
						+ "&& document.getElementById('" + listId + "') "
						+ "&& !document.querySelector('#" + listId + " .d-list-container')"
						+	".getAttribute('aria-busy') === false) ? true : null;",
				[],
				intern.config.WAIT_TIMEOUT,
				intern.config.POLL_INTERVAL))
				.getActiveElement()
				// For some reason, tab navigation doesn't succeed on IE if not typing a value before
				.type("test")
				.end()
				.pressKeys(keys.TAB)
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 20", "loadNext #1");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 40", "loadNext #2");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 60", "loadNext #3");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 80", "loadNext #4");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 99", "loadNext #5");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 20, "Programmatic item of order 40", "loadPrev #1");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 20, "Programmatic item of order 20", "loadPrev #2");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 20, "Programmatic item of order 0", "loadPrev #3");
				});
		},

		"Pageable categorized list keyboard navigation": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			if (remote.environmentType.browserName === "internet explorer") {
				// On most browsers, when you click "next page", focus goes to the first item of the new page.
				// But on IE, the list is scrolled to the end and the last item of the new page is focused.
				// I'm assuming that the other browsers have the intended behavior, but I'm not planning to fix IE.
				return this.skip("On IE, loading a new page jumps focus to the end of the page");
			}
			var listId = "pageable-prog-2";
			return remote
				.get("deliteful/tests/functional/list/pageable-prog-2.html")
				.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.querySelector('#" + listId + " .d-list-container')"
					+	".getAttribute('aria-busy') === false) ? true : null;",
				[],
				intern.config.WAIT_TIMEOUT,
				intern.config.POLL_INTERVAL))
				.pressKeys(keys.TAB)
				.then(function () {
					return loadNextPage(remote, listId, 25, "Programmatic item of order 25", "loadNext #1");
				})
				.then(function () {
					return loadNextPage(remote, listId, 25, "Category 5", "loadNext #2");
				})
				.then(function () {
					return loadNextPage(remote, listId, 25, "Programmatic item of order 75", "loadNext #3");
				})
				.then(function () {
					return loadNextPage(remote, listId, 25, "Programmatic item of order 99", "loadNext #4");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 25, "Category 2", "loadPrev #1");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 25, "Category 0", "loadPrev #2");
				});
		}
	});
});
