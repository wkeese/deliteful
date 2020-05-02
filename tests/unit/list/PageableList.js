import Memory from "dojo-dstore/Memory";
import Trackable from "dojo-dstore/Trackable";
import popup from "delite/popup";
import PageableList from "deliteful/list/PageableList";
import ListBaseTests from "./resources/ListBaseTests";

var registerSuite = intern.getPlugin("interface.object").registerSuite;
var assert = intern.getPlugin("chai").assert;

var Store = Memory.createSubclass([ Trackable ], {});

/////////////////////////////////
// List base tests
/////////////////////////////////

registerSuite("list/PageableList-noPagination-baseListTests", ListBaseTests.buildSuite(PageableList));

/////////////////////////////////
// PageableList specific tests
/////////////////////////////////

var list = null;

function removeTabsAndReturns (str) {
	return str.replace(/\t/g, "").replace(/\n/g, "");
}

function assertList (l, firstItemNumber, lastItemNumber, missingItemNumbers,
					 previousPageLoader, nextPageLoader, hint) {
	hint = hint || "";
	var listContent = l.containerNode;
	var numberOfItems = lastItemNumber - firstItemNumber + 1 - missingItemNumbers.length;
	assert.strictEqual(listContent.children.length, numberOfItems, hint + " number of children");
	if (previousPageLoader && l._previousPageLoaderVisible) {
		assert.strictEqual(removeTabsAndReturns(l.previousPageLoader.labelNode.textContent),
			"Click to load " + l.pageLength + " more items", hint + " previous page loader");
	}
	for (var i = 0, index = firstItemNumber; i < numberOfItems; i++, index++) {
		if (missingItemNumbers.length) {
			while (missingItemNumbers.indexOf(index) >= 0) {
				index++;
			}
		}
		assert.strictEqual(
			removeTabsAndReturns(listContent.children[i].textContent), "item " + index, hint);
	}
	if (nextPageLoader && l._nextPageLoaderVisible) {
		assert.strictEqual(removeTabsAndReturns(l.nextPageLoader.labelNode.textContent),
			"Click to load " + l.pageLength + " more items", hint + " previous page loader");
	}
}

function assertCategorizedList (l, numberOfItems, firstItemNumber, previousPageLoader, nextPageLoader) {
	var numberOfCategories = Math.floor((firstItemNumber + numberOfItems - 1) / 10)
		- Math.floor(firstItemNumber / 10) + 1;
	var lastCategory = null;
	var listContent = l.containerNode;
	assert.strictEqual(numberOfCategories + numberOfItems, listContent.children.length, "number of children");
	if (previousPageLoader && l._previousPageLoaderVisible) {
		assert.strictEqual(removeTabsAndReturns(l.previousPageLoader.labelNode.textContent),
			"Click to load " + l.pageLength + " more items", "previous page loader");
	}
	for (var childIndex = 0, itemIndex = firstItemNumber; itemIndex < firstItemNumber + numberOfItems;
		 itemIndex++, childIndex++) {
		var category = Math.floor(itemIndex / 10);
		if (category !== lastCategory) {
			lastCategory = category;
			assert.strictEqual(removeTabsAndReturns(listContent.children[childIndex].textContent),
				"Category " + category);
			childIndex++;
		}
		assert.strictEqual(
			removeTabsAndReturns(listContent.children[childIndex].textContent), "item " + itemIndex);
	}
	if (nextPageLoader && l._nextPageLoaderVisible) {
		assert.strictEqual(removeTabsAndReturns(l.nextPageLoader.labelNode.textContent),
			"Click to load " + l.pageLength + " more items", "previous page loader");
	}
}

function clickPreviousPageLoader (l) {
	return l._loadPreviousPage();
}

function clickNextPageLoader (l) {
	return l._loadNextPage();
}

var testHelpers = {
	"removing items in displayed pages": function (/*Deferred*/dfd) {
		var store = new Store();
		for (var i = 0; i < 92; i++) {
			store.add({ label: "item " + i, id: i });
		}
		list = new PageableList({ source: store });
		list.pageLength = 23;
		list.maxPages = 2;
		list.placeAt(document.body);
		list.deliver();
		// initial load (page 1 loaded)
		assertList(list, 0, 22, [], false, true, "initial load");
		// check internal pages references
		assert.strictEqual(list._idPages.length, 1, "A: expect one page loaded");
		assert.strictEqual(list._idPages[0].length, 23, "A: page size");
		for (var j = 0; j < 23; j++) {
			assert(list._idPages[0][j] === j);
		}
		// remove two items in the first page (page 1 size will be 21)
		list.source.remove(0); // remove item 0
		list.source.remove(2); // remove item 2
		list.deliver();
		assertList(list, 0, 22, [ 0, 2 ], false, true, "page 1 loaded");
		// check internal pages references
		assert.strictEqual(list._idPages.length, 1, "B: expect one page loaded");
		assert.strictEqual(list._idPages[0].length, 21, "B: page size");
		assert(list._idPages[0][0] === 1);
		assert(list._idPages[0][1] === 3);
		for (var k = 2; k < 21; k++) {
			assert(list._idPages[0][k] === k + 2);
		}
		// load next page (pages 1 and 2 loaded)
		clickNextPageLoader(list).then(dfd.rejectOnError(function () {
			list.deliver();
			assertList(list, 1, 45, [ 2 ], false, true, "page 1 and 2 loaded");
			// remove to items in the second page (page 2 size will be 21)
			list.source.remove(45); // remove item 45
			list.source.remove(43); // remove item 43
			list.deliver();
			assertList(list, 1, 44, [ 2, 43 ], false, true, "after removal");
			// load next page (pages 2 and 3 loaded)
			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				list.deliver();
				assertList(list, 23, 68, [ 43, 45 ], true, true, "page 2 and 3 loaded");
				// load previous page (page 1 and 2 loaded)
				clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					assertList(list, 1, 44, [ 2, 43 ], false, true, "page 1 and 2 loaded (second time)");
					// load next page (pages 2 and 3 loaded)
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						assertList(list, 23, 68, [ 43, 45 ], true, true, "page 2 and 3 loaded (second time)");
						// load next page (pages 3 and 4 loaded)
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							assertList(list, 46, 91, [], true, true, "page 3 and 4 loaded");
							// click once more (pages 3 and 4 loaded still loaded, next loader disappears)
							clickNextPageLoader(list).then(dfd.rejectOnError(function () {
								list.deliver();
								assertList(list, 46, 91, [], true, false,
									"page 3 and 4 loaded and next loader disappears");
								// load previous page (pages 2 and 3 loaded)
								clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
									list.deliver();
									assertList(list, 21, 68, [ 43, 45 ], true, true,
										"page 2 and 3 loaded (third time)");
									// load previous page (pages 1 and 2 loaded)
									clickPreviousPageLoader(list).then(dfd.callback(function () {
										list.deliver();
										assertList(list, 1, 44, [ 2, 43 ], false, true,
											"page 1 and 2 loaded (third time)");
									}));
								}));
							}));
						}));
					}));
				}));
			}));
		}));

		return dfd;
	},

	"removing items in next non displayed page": function (/*Deferred*/dfd) {
		var store = new Store();
		for (var i = 0; i < 92; i++) {
			store.add({ label: "item " + i, id: i });
		}

		list = new PageableList({ source: store });
		list.pageLength = 23;
		list.maxPages = 2;
		list.placeAt(document.body);

		// initial load (page 1 loaded)
		list.deliver();
		assertList(list, 0, 22, [], false, true, "assert 1");
		// Remove items in the next page
		list.source.remove(23); // remove item 23
		list.source.remove(25); // remove item 25
		clickNextPageLoader(list).then(dfd.callback(function () {
			list.deliver();
			assertList(list, 0, 47, [ 23, 25 ], false, true, "assert 2");
		}));

		return dfd;
	},

	"removing items in previous non displayed page": function (/*Deferred*/dfd) {
		var store = new Store();
		for (var i = 0; i < 92; i++) {
			store.add({ label: "item " + i, id: i });
		}

		list = new PageableList({ source: store });
		list.pageLength = 23;
		list.maxPages = 2;
		list.placeAt(document.body);
		list.deliver();

		clickNextPageLoader(list).then(dfd.rejectOnError(function () {
			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				list.deliver();
				// initial load (page 1 loaded)
				assertList(list, 23, 68, [], true, true, "assert 1");
				// Remove items in the previous page
				list.source.remove(0); // remove item 0
				list.source.remove(12); // remove item 12
				list.source.remove(22); // remove item 22
				clickPreviousPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					assertList(list, 1, 45, [ 12, 22 ], false, true, "assert 2");
				}));
			}));
		}));

		return dfd;
	},

	"remove item and browse": function (/*Deferred*/dfd) {
		var store = new Store();
		for (var i = 0; i < 91; i++) {
			store.add({ label: "item " + i, id: i });
		}

		list = new PageableList({ source: store });
		list.pageLength = 23;
		list.maxPages = 2;
		list.style.height = "200px";
		list.placeAt(document.body);
		list.deliver();

		// Click next page loader three times
		clickNextPageLoader(list).then(dfd.rejectOnError(function () {
			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					// remove item 45
					list.source.remove(45);
					// Click previous page loader two times
					clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
						clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
							// Click load next page
							clickNextPageLoader(list).then(dfd.callback(function () {
								list.deliver();
								// Check the content of the list
								assertList(list, 22, 68, [ 45 ], true, true);
							}));
						}));
					}));
				}));
			}));
		}));

		return dfd;
	},

	"remove all items in non displayed first page removes previous page loader":
		function (/*Deferred*/dfd) {
			var store = new Store();
			for (var i = 0; i < 91; i++) {
				store.add({ label: "item " + i, id: i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 23;
			list.maxPages = 2;
			list.style.height = "200px";
			list.placeAt(document.body);
			list.deliver();

			// Click next page loader two times
			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				clickNextPageLoader(list).then(dfd.callback(function () {
					// remove all items in the first page
					for (var j = 0; j < 23; j++) {
						list.source.remove(j);
					}
					list.deliver();
					// check that the previous page loader has been removed
					assertList(list, 23, 68, [], false, true);
				}));
			}));

			return dfd;
		},

	"add items in displayed page": function (/*Deferred*/dfd) {
		var store = new Store();
		for (var i = 0; i < 92; i++) {
			store.add({ label: "item " + i, id: i });
		}

		list = new PageableList({ source: store });
		list.pageLength = 23;
		list.maxPages = 2;
		list.placeAt(document.body);
		list.deliver();

		list.source.add({ id: "A", label: "item A" }, { beforeId: 1 });
		list.source.add({ id: "B", label: "item B" }, { beforeId: 22 });
		list.deliver();

		// Check internal page representation
		assert.strictEqual(list._idPages.length, 1, "A: number of pages");
		assert.deepEqual(list._idPages[0],
			[ 0, "A", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, "B", 22 ]);
		assert.strictEqual(list._idPages[0].length, 25, "A: number of items in page");
		assert.strictEqual(list.containerNode.children.length, 25, "A: number of list children");
		list.deliver();
		assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item 0", "A");
		assert.strictEqual(removeTabsAndReturns(list.containerNode.children[1].textContent), "item A", "A");
		for (var j = 2; j <= 22; j++) {
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[j].textContent),
				"item " + (j - 1), "A");
		}
		assert.strictEqual(removeTabsAndReturns(list.containerNode.children[23].textContent), "item B", "A");
		assert.strictEqual(removeTabsAndReturns(list.containerNode.children[24].textContent), "item 22", "A");
		assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
			"Click to load 23 more items", "A");
		clickNextPageLoader(list).then(dfd.rejectOnError(function () {
			assert.strictEqual(list.containerNode.children.length, 48, "B: number of list children");
			list.deliver();
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item 0", "B");
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[1].textContent), "item A", "B");
			for (var k = 2; k <= 22; k++) {
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[k].textContent),
					"item " + (k - 1), "B");
			}
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[23].textContent), "item B", "B");
			for (var l = 24; l <= 47; l++) {
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[l].textContent),
					"item " + (l - 2), "B");
			}
			assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
				"Click to load 23 more items", "B");
			// Add an item
			list.source.add({ id: "C", label: "item C" }, { beforeId: 23 });
			list.deliver();
			assert.strictEqual(list.containerNode.children.length, 49, "C: number of list children");
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item 0", "C");
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[1].textContent), "item A", "C");
			for (var m = 2; m <= 22; m++) {
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[m].textContent),
					"item " + (m - 1), "C");
			}
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[23].textContent), "item B", "C");
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[24].textContent), "item 22", "C");
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[25].textContent), "item C", "C");
			for (var n = 26; n <= 48; n++) {
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[n].textContent),
					"item " + (n - 3), "C");
			}
			assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
				"Click to load 23 more items", "C");
			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				list.deliver();
				assert.strictEqual(list.containerNode.children.length, 47, "D: number of list children");
				assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
					"Click to load 23 more items",
					"C: previous page loader");
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item C", "C");
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[46].textContent),
					"item 68", "C");
				assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
					"Click to load 23 more items",
					"C: next page loader");
				clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					assert.strictEqual(list.containerNode.children.length, 47, "D: number of list children");
					assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
						"Click to load 23 more items",
						"D: previous page loader");
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent),
						"item 1", "D");
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[46].textContent),
						"item 45", "D");
					assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
						"Click to load 23 more items",
						"D: next page loader");
					clickPreviousPageLoader(list).then(dfd.callback(function () {
						list.deliver();
						assert.strictEqual(list.containerNode.children.length, 25, "E: number of list children");
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent),
							"item 0", "E");
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[1].textContent),
							"item A", "E");
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[24].textContent),
							"item 22", "E");
						assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
							"Click to load 23 more items",
							"E: next page loader");
					}));
				}));
			}));
		}));

		return dfd;
	},

	"add item before first page creates loader": function (/*Deferred*/dfd) {
		var store = new Store();
		for (var i = 0; i < 24; i++) {
			store.add({ label: "item " + i, id: i });
		}

		list = new PageableList({ source: store });
		list.pageLength = 23;
		list.maxPages = 2;
		list.placeAt(document.body);
		list.deliver();
		list.source.add({ id: "A", label: "item A" }, { beforeId: 0 });
		list.deliver();
		// Check internal page representation
		assert.strictEqual(list._idPages.length, 1, "A: number of pages");
		assert.deepEqual(list._idPages[0],
			[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ]);
		assert.strictEqual(list._idPages[0].length, 23, "A: number of items in page");
		assert.strictEqual(list.containerNode.children.length, 23, "A: number of list children");
		assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
			"Click to load 23 more items",
			"A (previous page loader)");
		for (var j = 0; j < 23; j++) {
			assert.strictEqual(
				removeTabsAndReturns(list.containerNode.children[j].textContent), "item " + j, "A");
		}
		assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
			"Click to load 23 more items",
			"A (next page loader)");
		clickPreviousPageLoader(list).then(dfd.callback(function () {
			list.deliver();
			assert.strictEqual(list.containerNode.children.length, 24, "B: number of list children");
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item A", "B");
			for (var k = 1; k < 23; k++) {
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[k].textContent),
					"item " + (k - 1), "B");
			}
			assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
				"Click to load 23 more items", "B");
		}));

		return dfd;
	},

	"add item after last page creates loader": function (/*Deferred*/dfd) {
		var store = new Store();
		for (var i = 0; i < 23; i++) {
			store.add({ label: "item " + i, id: i });
		}

		list = new PageableList({ source: store });
		list.pageLength = 23;
		list.maxPages = 0;
		list.placeAt(document.body);
		list.deliver();
		assert.strictEqual(list.containerNode.children.length, 23, "0: number of list children");
		assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
			"Click to load 23 more items",
			"0: last children is next page loader");
		clickNextPageLoader(list).then(dfd.rejectOnError(function () {
			// Add an item at the end
			list.source.add({ id: "A", label: "item A" });
			list.deliver();
			// Check internal page representation
			assert.strictEqual(list._idPages.length, 1, "A: number of pages");
			assert.deepEqual(list._idPages[0],
				[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ]);
			assert.strictEqual(list._idPages[0].length, 23, "A: number of items in page");
			assert.strictEqual(list.containerNode.children.length, 23, "A: number of list children");
			for (var j = 0; j <= 22; j++) {
				assert.strictEqual(
					removeTabsAndReturns(list.containerNode.children[j].textContent), "item " + j, "A");
			}
			assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
				"Click to load 23 more items",
				"A (next page loader)");
			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				assert.strictEqual(list.containerNode.children.length, 24, "B: number of list children");
				for (var k = 0; k <= 22; k++) {
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[k].textContent),
						"item " + k, "B");
				}
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[23].textContent),
					"item A", "B");
			}));
		}));
		return dfd;
	},

	"add item to undisplayed page": function (/*Deferred*/dfd) {
		var store = new Store();
		for (var i = 0; i < 100; i++) {
			store.add({ label: "item " + i, id: i });
		}

		list = new PageableList({ source: store });
		list.pageLength = 23;
		list.maxPages = 1;
		list.placeAt(document.body);
		list.deliver();

		list.source.add({ id: "A", label: "item A" }, { beforeId: 23 });
		list.deliver();
		assertList(list, 0, 22, [], false, true, "A");

		clickNextPageLoader(list).then(dfd.rejectOnError(function () {
			list.deliver();
			assert.strictEqual(list.containerNode.children.length, 23, "B: list number of children");
			assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
				"Click to load 23 more items",
				"B: previous page loader");
			assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item A", "B");
			for (var j = 2; j < 23; j++) {
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[j].textContent),
					"item " + (j + 22), "B");
			}
			assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
				"Click to load 23 more items",
				"B: next page loader");
			list.source.add({ id: "B", label: "item B" }, { beforeId: 22 });
			clickPreviousPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				assert.strictEqual(list.containerNode.children.length, 23, "C: list number of children");
				assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
					"Click to load 23 more items",
					"C: previous page loader");
				for (var k = 0; k < 21; k++) {
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[k].textContent),
						"item " + (k + 1), "C");
				}
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[21].textContent),
					"item B", "C");
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[22].textContent),
					"item 22", "C");
				assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
					"Click to load 23 more items",
					"C: next page loader");
			}));
		}));

		return dfd;
	}
};

registerSuite("list/PageableList", {
	beforeEach: function () {
		if (list) {
			list.destroy();
		}
	},

	tests: {
		"itemAdded": function () {
			list = new PageableList({ source: new Store() });
			list.pageLength = 100;
			var resetList = function () {
				list._idPages = [ [ 1, 2, 3 ], [ 4, 5, 6 ] ];
				list._firstLoaded = 1;
				list._lastLoaded = 6;
				list.deliver();
			};
			list.getIdentity = function (item) {
				return list.source.getIdentity(item);
			};
			resetList();
			list.itemAdded(0, { id: "A" });
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 2, "A");
			assert.strictEqual(list._lastLoaded, 7, "A");
			resetList();
			list.itemAdded(1, { id: "B" });
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 2, "B");
			assert.strictEqual(list._lastLoaded, 7, "B");
			resetList();
			list.itemAdded(2, { id: "C" });
			assert.deepEqual(list._idPages, [ [ 1, "C", 2, 3 ], [ 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "C");
			assert.strictEqual(list._lastLoaded, 7, "C");
			resetList();
			list.itemAdded(3, { id: "D" });
			assert.deepEqual(list._idPages, [ [ 1, 2, "D", 3 ], [ 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "D");
			assert.strictEqual(list._lastLoaded, 7, "D");
			resetList();
			list.itemAdded(4, { id: "E" });
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ "E", 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "E");
			assert.strictEqual(list._lastLoaded, 7, "E");
			resetList();
			list.itemAdded(5, { id: "F" });
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ 4, "F", 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "F");
			assert.strictEqual(list._lastLoaded, 7, "F");
			resetList();
			list.itemAdded(6, { id: "G" });
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ 4, 5, "G", 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "G");
			assert.strictEqual(list._lastLoaded, 7, "G");
			resetList();
			list.itemAdded(7, { id: "H" });
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "H");
			assert.strictEqual(list._lastLoaded, 6, "H");
		},

		"itemRemoved": function () {
			list = new PageableList({ source: new Store() });
			list.pageLength = 100;
			var resetList = function () {
				list._idPages = [ [ 1, 2, 3 ], [ 4, 5, 6 ] ];
				list._firstLoaded = 1;
				list._lastLoaded = 6;
				list.deliver();
			};
			resetList();
			list.itemRemoved(0);
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 0, "0");
			assert.strictEqual(list._lastLoaded, 5, "0");
			resetList();
			list.itemRemoved(1);
			assert.deepEqual(list._idPages, [ [ 2, 3 ], [ 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "1");
			assert.strictEqual(list._lastLoaded, 5, "1");
			resetList();
			list.itemRemoved(2);
			assert.deepEqual(list._idPages, [ [ 1, 3 ], [ 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "2");
			assert.strictEqual(list._lastLoaded, 5, "2");
			resetList();
			list.itemRemoved(3);
			assert.deepEqual(list._idPages, [ [ 1, 2 ], [ 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "3");
			assert.strictEqual(list._lastLoaded, 5, "3");
			resetList();
			list.itemRemoved(4);
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "4");
			assert.strictEqual(list._lastLoaded, 5, "4");
			resetList();
			list.itemRemoved(5);
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ 4, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "5");
			assert.strictEqual(list._lastLoaded, 5, "5");
			resetList();
			list.itemRemoved(6);
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ 4, 5 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "6");
			assert.strictEqual(list._lastLoaded, 5, "6");
			resetList();
			list.itemRemoved(7);
			assert.deepEqual(list._idPages, [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]);
			assert.strictEqual(list._firstLoaded, 1, "7");
			assert.strictEqual(list._lastLoaded, 6, "7");
		},

		"Loading all next pages (pageLength 20, maxPages 0)": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i, id: i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 20;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertList(list, 0, 19, [], false, true);
			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				list.deliver();
				// after second page is loaded
				assertList(list, 0, 39, [], false, true);
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					// after third page is loaded
					assertList(list, 0, 59, [], false, true);
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						// after fourth page is loaded
						assertList(list, 0, 79, [], false, true);
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							// after fifth page is loaded
							assertList(list, 0, 99, [], false, true);
							clickNextPageLoader(list).then(dfd.callback(function () {
								list.deliver();
								// after last click
								assertList(list, 0, 99, [], false, false);
							}));
						}));
					}));
				}));
			}));

			return dfd;
		},

		"Categorized list: Loading all next pages (pageLength 25, maxPages 0)": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i, category: "Category " + Math.floor(i / 10) });
			}

			list = new PageableList({ source: store });
			list.pageLength = 25;
			list.maxPages = 0;
			list.categoryAttr = "category";
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertCategorizedList(list, 25, 0, false, true);
			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				list.deliver();
				// after second page is loaded
				assertCategorizedList(list, 50, 0, false, true);
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					// after third page is loaded
					assertCategorizedList(list, 75, 0, false, true);
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						// after fourth page is loaded
						assertCategorizedList(list, 100, 0, false, true);
						clickNextPageLoader(list).then(dfd.callback(function () {
							list.deliver();
							// after last click
							assertCategorizedList(list, 100, 0, false, false);
						}));
					}));
				}));
			}));

			return dfd;
		},

		"Loading all next pages, and then loading all previous pages (pageLength 20, maxPages 2)": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 20;
			list.maxPages = 2;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertList(list, 0, 19, [], false, true);
			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				list.deliver();
				// after second page is loaded
				assertList(list, 0, 39, [], false, true);
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					// after third page is loaded and first page is unloaded
					assertList(list, 20, 59, [], true, true);
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						// after fourth page is loaded and second page is unloaded
						assertList(list, 40, 79, [], true, true);
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							// after fifth page is loaded and third page is unloaded
							assertList(list, 60, 99, [], true, true);
							clickNextPageLoader(list).then(dfd.rejectOnError(function () {
								list.deliver();
								// after last click
								assertList(list, 60, 99, [], true, false);
								clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
									list.deliver();
									// after fifth page is unloaded and third page is loaded
									assertList(list, 40, 79, [], true, true);
									clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
										list.deliver();
										// after fourth page is unloaded and second page is loaded
										assertList(list, 20, 59, [], true, true);
										clickPreviousPageLoader(list).then(dfd.callback(function () {
											list.deliver();
											// after third page is unloaded and first page is loaded
											assertList(list, 0, 39, [], false, true);
										}));
									}));
								}));
							}));
						}));
					}));
				}));
			}));

			return dfd;
		},

		"Categorized List: load all next pages, load all previous pages (pageLength 20, maxPages 2)": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i, category: "Category " + Math.floor(i / 10) });
			}

			list = new PageableList({ source: store });
			list.categoryAttr = "category";
			list.pageLength = 25;
			list.maxPages = 2;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertCategorizedList(list, 25, 0, false, true);
			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				list.deliver();
				// after second page is loaded
				assertCategorizedList(list, 50, 0, false, true);
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					// after third page is loaded and first page is unloaded
					assertCategorizedList(list, 50, 25, true, true);
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						// after fourth page is loaded and second page is unloaded
						assertCategorizedList(list, 50, 50, true, true);
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							// after last click
							assertCategorizedList(list, 50, 50, true, false);
							clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
								list.deliver();
								// after fourth page is unloaded and second page is loaded
								assertCategorizedList(list, 50, 25, true, true);
								clickPreviousPageLoader(list).then(dfd.callback(function () {
									list.deliver();
									// after third page is unloaded and first page is loaded
									assertCategorizedList(list, 50, 0, false, true);
								}));
							}));
						}));
					}));
				}));
			}));

			return dfd;
		},

		"pageLength equal to the total number of item (maxPages 0)": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 100;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertList(list, 0, 99, [], false, true);
			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				// after a click on the next page loader
				assertList(list, 0, 99, [], false, false);
			}));

			return dfd;
		},

		"Categorized List: pageLength equal to the total number of item (maxPages 0)": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i, category: "Category " + Math.floor(i / 10) });
			}

			list = new PageableList({ source: store });
			list.categoryAttr = "category";
			list.pageLength = 100;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertCategorizedList(list, 100, 0, false, true);
			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				// after a click on the next page loader
				assertCategorizedList(list, 100, 0, false, false);
			}));

			return dfd;
		},

		"pageLength equal to the total number of item (maxPages 2)": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 100;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertList(list, 0, 99, [], false, true);
			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				// after a click on the next page loader
				assertList(list, 0, 99, [], false, false);
			}));

			return dfd;
		},

		"Categorized List: pageLength equal to the total number of item (maxPages 2)": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i, category: "Category " + Math.floor(i / 10) });
			}

			list = new PageableList({ source: store });
			list.categoryAttr = "category";
			list.pageLength = 100;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertCategorizedList(list, 100, 0, false, true);
			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				// after a click on the next page loader
				assertCategorizedList(list, 100, 0, false, false);
			}));

			return dfd;
		},

		"pageLength greater than the total number of item (maxPages 0)": function () {
			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 101;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertList(list, 0, 99, [], false, false);
		},

		"Categorized List: pageLength greater than the total number of item (maxPages 0)": function () {
			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i, category: "Category " + Math.floor(i / 10) });
			}

			list = new PageableList({ source: store });
			list.categoryAttr = "category";
			list.pageLength = 101;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertCategorizedList(list, 100, 0, false, false);
		},

		"pageLength greater than the total number of item (maxPages 2)": function () {
			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 101;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertList(list, 0, 99, [], false, false);
		},

		"Categorized List: pageLength greater than the total number of item (maxPages 2)": function () {
			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i, category: "Category " + Math.floor(i / 10) });
			}

			list = new PageableList({ source: store });
			list.categoryAttr = "category";
			list.pageLength = 101;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertCategorizedList(list, 100, 0, false, false);
		},

		"list in a popup": function () {
			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 25;
			list.maxPages = 0;
			list.placeAt(document.body);

			popup.open({
				popup: list,
				x: 50,
				y: 50
			});

			try {
				list.deliver();
				assert(list.offsetWidth > 50, "list.offsetWidth === " + list.offsetWidth);
				assert(list.querySelector("d-list-item-renderer").offsetWidth > 0, "d-list-item-renderer");
				assert(list.querySelector("d-list-loader[d-shown='true']").offsetWidth > 0, "d-list-loader");
			} finally {
				popup.close(list);
			}
		},

		"list with categories in a popup": function () {
			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i, category: "Category " + Math.floor(i / 10) });
			}

			list = new PageableList({ source: store });
			list.pageLength = 25;
			list.maxPages = 0;
			list.categoryAttr = "category";
			list.placeAt(document.body);

			popup.open({
				popup: list,
				x: 50,
				y: 50
			});

			try {
				list.deliver();
				assert(list.offsetWidth > 50, "list.offsetWidth === " + list.offsetWidth);
				assert(list.querySelector("d-list-category-renderer").offsetWidth > 0, "d-list-category-renderer");
				assert(list.querySelector("d-list-item-renderer").offsetWidth > 0, "d-list-item-renderer");
				assert(list.querySelector("d-list-loader[d-shown='true']").offsetWidth > 0, "d-list-loader");
			} finally {
				popup.close(list);
			}
		},

		///////////////////////////////////////////
		// TEST REMOVING ITEMS
		///////////////////////////////////////////
		"removing items in displayed pages": function () {
			return testHelpers["removing items in displayed pages"](this.async(3000), false);
		},

		"removing items in next non displayed page": function () {
			return testHelpers["removing items in next non displayed page"](this.async(3000), false);
		},

		"removing items in previous non displayed page": function () {
			return testHelpers["removing items in previous non displayed page"](this.async(3000), false);
		},

		"remove all items in non displayed first page": function () {
			return testHelpers[
				"remove all items in non displayed first page removes previous page loader"
				](this.async(3000), false);
		},

		"remove item and browse": function () {
			return testHelpers["remove item and browse"](this.async(3000), false);
		},

		///////////////////////////////////////////
		// TEST ADDING ITEMS
		///////////////////////////////////////////
		"add items in displayed pages": function () {
			return testHelpers["add items in displayed page"](this.async(3000), false);
		},

		"add item before first page creates loader": function () {
			return testHelpers["add item before first page creates loader"](this.async(3000), false);
		},

		"add item after last page creates loader": function () {
			return testHelpers["add item after last page creates loader"](this.async(3000), false);
		},

		"add item to undisplayed page": function () {
			return testHelpers["add item to undisplayed page"](this.async(3000), false);
		},

		"update items in displayed page with index page > maxpages": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 20; i++) {
				store.add({ label: "item " + i, id: i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 5;
			list.maxPages = 1;
			list.placeAt(document.body);
			list.deliver();

			// initial load (page 1 loaded)
			assertList(list, 0, 4, [], false, true, "assert 1");
			clickNextPageLoader(list).then(dfd.callback(function () {
				list.source.put({ label: "item A", id: 6 });
				list.deliver();
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[1].textContent), "item A");
			}));

			return dfd;
		},

		"reload list content": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i, category: "Category " + Math.floor(i / 10) });
			}

			list = new PageableList({ source: store });
			list.categoryAttr = "category";
			list.pageLength = 25;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertCategorizedList(list, 25, 0, false, true);
			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				assertCategorizedList(list, 50, 0, false, true);
				// Create a new source and assign it to the list
				var source = new Store();
				for (var j = 1000; j < 1100; j++) {
					source.add({ label: "item " + j, category: "Category " + Math.floor(j / 10) });
				}
				list.source = source;
				list.deliver();
				assertCategorizedList(list, 25, 1000, false, true);
			}));

			return dfd;
		},

		"update pageLength": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 10;
			list.maxPages = 2;
			list.placeAt(document.body);
			list.deliver();

			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				list.deliver();
				assertList(list, 0, 19, [], false, true, "A");
				list.pageLength = 20;
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					assertList(list, 10, 39, [], true, true, "B");
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						assertList(list, 20, 59, [], true, true, "C");
						clickPreviousPageLoader(list).then(dfd.callback(function () {
							list.deliver();
							assertList(list, 0, 39, [], false, true, "D");
						}));
					}));
				}));
			}));

			return dfd;
		},

		"update maxPages": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 10;
			list.maxPages = 2;
			list.placeAt(document.body);
			list.deliver();

			clickNextPageLoader(list).then(dfd.rejectOnError(function () {
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					assertList(list, 10, 29, [], true, true, "A");
					list.maxPages = 3;
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						assertList(list, 10, 39, [], true, true, "B");
						clickNextPageLoader(list).then(dfd.callback(function () {
							list.deliver();
							assertList(list, 20, 49, [], true, true, "C");
						}));
					}));
				}));
			}));

			return dfd;
		},

		"update loadPreviousMessage": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 10;
			list.maxPages = 1;
			list.placeAt(document.body);
			list.deliver();

			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				assertList(list, 10, 19, [], true, true, "A");
				list.loadPreviousMessage = "foo";
				list.deliver();
				assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
					"foo", "loader label not updated");
			}));

			return dfd;
		},

		"update loadNextMessage": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 10;
			list.maxPages = 1;
			list.placeAt(document.body);
			list.deliver();

			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				assertList(list, 10, 19, [], true, true, "A");
				list.loadNextMessage = "foo";
				list.deliver();
				assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
					"foo", "loader label not updated");
			}));

			return dfd;
		},

		"hideOnPageLoad: hidding panel removed after loading the last page": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 39; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.hideOnPageLoad = true;
			list.pageLength = 20;
			list.maxPages = 0;
			list.placeAt(document.body);
			list.deliver();

			// initial load
			assertList(list, 0, 19, [], false, true);
			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				// after second page is loaded
				assertList(list, 0, 38, [], false, false);
				// verify that loading panel is not displayed
				assert.isNotNull(list.querySelector(".d-list-loading-panel[d-shown='false']"),
					"loading panel should not be visible");
			}));

			return dfd;
		},

		"hideOnPageLoad: check loading panel, list and loaders visibility": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 92; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });

			list.hideOnPageLoad = true;
			list.pageLength = 20;
			list.maxPages = 0;
			list.placeAt(document.body);
			list._busy = true;
			list.deliver();

			// verify that loading panel is displayed, list and prev/next loader not visible.
			assert.isNotNull(list.querySelector(".d-list-loading-panel[d-shown='true']"),
				"loading panel should be visible");
			assert.isNotNull(list.querySelector(".d-list-container[d-shown='false']"),
				"list containerNode should not be visible");
			assert.isNotNull(list.querySelector(".d-list-previous-loader[d-shown='false']"),
				"previous loader should not be visible");
			assert.isNotNull(list.querySelector(".d-list-next-loader[d-shown='false']"),
				"next loader should not be visible");
			list.hideOnPageLoad = false;
			list.deliver();

			// verify that loading panel and prev loader are not shown,
			// list and next loader are visible when busy equals to true.
			assert.isNotNull(list.querySelector(".d-list-loading-panel[d-shown='false']"),
				"loading panel should not be visible");
			assert.isNotNull(list.querySelector(".d-list-container[d-shown='true']"),
				"list containerNode should be visible");
			assert.isNotNull(list.querySelector(".d-list-previous-loader[d-shown='false']"),
				"previous loader should not be visible");
			assert.isNotNull(list.querySelector(".d-list-next-loader[d-shown='true']"),
				"next loader should be visible");
			list._busy = false;

			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				// verify that loading panel is not displayed
				assert.isNotNull(list.querySelector(".d-list-loading-panel[d-shown='false']"),
					"loading panel should be visible");
			}));

			return dfd;
		},

		"getItemRendererByIndex ignores page loaders": function () {
			var dfd = this.async(3000);

			var store = new Store();
			for (var i = 0; i < 100; i++) {
				store.add({ label: "item " + i });
			}

			list = new PageableList({ source: store });
			list.pageLength = 10;
			list.maxPages = 1;
			list.placeAt(document.body);
			list.deliver();

			clickNextPageLoader(list).then(dfd.callback(function () {
				list.deliver();
				assert.strictEqual("item 10",
					removeTabsAndReturns(list.getItemRendererByIndex(0).textContent));
			}));

			return dfd;
		}
	},

	///////////////////////////////////////////
	// TODO: TEST MOVING ITEMS ?
	///////////////////////////////////////////
	after: function () {
		//			list.destroy();
		//			list = null;
	}
});

