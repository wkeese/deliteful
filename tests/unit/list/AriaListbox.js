define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/list/List",
	"dstore/Memory",
	"dstore/Trackable"
], function (registerSuite, assert, List, Memory, Trackable) {

	var list = null;

	var Store = Memory.createSubclass([Trackable], {});

	registerSuite({
		name: "list/AriaListbox",
		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new List({store: new Store()});
			list.setAttribute("role", "listbox");
			document.body.appendChild(list);
			list.startup();
			list.store.filter();
			list.store.add({label: "item 1"});
			list.store.add({label: "item 2"});
			list.store.add({label: "item 3"});
			list.deliver();
		},
		"aria properties": function () {
			assert.strictEqual(list.getAttribute("role"), "listbox", "role");
			assert.strictEqual(list.children[0].getAttribute("role"), null, "first renderer role");
			assert.strictEqual(list.children[0].renderNode.getAttribute("role"), "option",
					"first renderNode role");
			assert.strictEqual(list.children[1].getAttribute("role"), null, "second renderer role");
			assert.strictEqual(list.children[1].renderNode.getAttribute("role"), "option",
					"second renderNode role");
			assert.strictEqual(list.children[2].getAttribute("role"), null, "third renderer role");
			assert.strictEqual(list.children[2].renderNode.getAttribute("role"), "option",
					"third renderNode role");
		},
		"aria properties when moving from listbox to grid": function () {
			list.setAttribute("role", "grid");
			list.deliver();
			assert.strictEqual(list.getAttribute("role"), "grid", "role");
			assert.strictEqual(list.children[0].getAttribute("role"), "row", "first renderer role");
			assert.strictEqual(list.children[0].renderNode.getAttribute("role"), "gridcell",
					"first renderNode role");
			assert.strictEqual(list.children[1].getAttribute("role"), "row", "second renderer role");
			assert.strictEqual(list.children[1].renderNode.getAttribute("role"), "gridcell",
					"second renderNode role");
			assert.strictEqual(list.children[2].getAttribute("role"), "row", "third renderer role");
			assert.strictEqual(list.children[2].renderNode.getAttribute("role"), "gridcell",
					"third renderNode role");
		},
		teardown : function () {
			list.destroy();
		}
	});
});
