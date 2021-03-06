define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = requirejs.nodeRequire("@theintern/leadfoot/helpers/pollUntil").default;
	var keys = requirejs.nodeRequire("@theintern/leadfoot/keys").default;
	var assert = intern.getPlugin("chai").assert;

	function checkNumberOfOptions(remote, selectId, expectedNumberOfOptions) {
		return remote
			.findById(selectId)
			.findAllByTagName("OPTION")
			.then(function (result) {
				assert.strictEqual(result.length, expectedNumberOfOptions,
					selectId + " number of options is not the expected one");
			});
	}

	function updateAndCheckNumberOfOptions(
		remote, selectId, updateId, expectedNumberOfOptions) {
		return remote
			// Do not use remote.click() because of appium issues on iOS
			// (the buttons being outside browser's visible area).
			// Hence, instead, execute the action of the update button from Select.html.
			.execute("updateOptions(" + selectId + "); ")
			.findById(selectId)
			.findAllByTagName("OPTION")
			.then(function (result) {
				assert.strictEqual(result.length, expectedNumberOfOptions,
					selectId + " number of options is not the expected one");
			});
	}

	// Check the state of the widget after selecting options using the keyboard.
	// The most important is checking that the delite/Selection parent class
	// is correctly kept in sync (that is, its selectedItem/selectedItems
	// properties are correctly updated by the widget).
	function checkKeyboardNavigationSingleSelection(remote, selectId) {
		var selItemNullStr = "widget.selectedItem is null";
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget.
		var executeExpr = "return {" +
			"widgetSelectedItemText: " +
			"(" + selectId + ".selectedItem ? " + selectId +
			".selectedItem.text : '" + selItemNullStr + "'), " +
			"widgetValueNodeSelectedIndex: " + selectId +
			".valueNode.selectedIndex, " +
			// Do not rely on HTMLSelectElement.selectedOptions for counting
			// the selected options, because it is not universally supported by
			// browsers. At least IE10/Win does not support it. Hence going
			// through a utility function inthe HTML test file:
			"widgetValueNodeNSelectedOptions: getSelectedOptionsArray(" + selectId +
			").length, " +
			"widgetSelectionChangeCounter: " + selectId +
			"._selection_change_counter" +
			"};";
		return remote
			.execute(selectId + ".focus(); " + executeExpr)
			.then(function (value) {
				// The first option is initially selected by default
				// text = update #1 because the item has been already updated
				// in the previous test cases
				assert.strictEqual(value.widgetSelectedItemText, "Option 1 update #1",
					"(single) after focus, " + selectId + ".selectedItem.text");
				assert.strictEqual(value.widgetValueNodeSelectedIndex, 0,
					"(single) after focus, " + selectId + ".valueNode.selectedIndex");
				assert.strictEqual(value.widgetValueNodeNSelectedOptions, 1,
					"(single) after focus, " + selectId + ".valueNode_nSelectedOptions");
				// No selection-change event initially
				assert.strictEqual(value.widgetSelectionChangeCounter, 0,
					"(single) after focus, " + selectId +
					"._selection_change_counter (internal testing counter)");
			})
			.end()
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (value) {
				// Now the second option should be selected
				// arrow update #1 because the item has been already updated
				// in the previous test cases
				assert.strictEqual(value.widgetSelectedItemText, "Option 2 update #1",
					"(single) after first arrow down key, " + selectId + ".selectedItem.text");
				assert.strictEqual(value.widgetValueNodeSelectedIndex, 1,
					"(single) after first arrow down key, " + selectId + ".valueNode.selectedIndex");
				assert.strictEqual(value.widgetValueNodeNSelectedOptions, 1,
					"(single) after first arrow down key, " + selectId + ".valueNode_nSelectedOptions");
				assert.strictEqual(value.widgetSelectionChangeCounter, 1,
					"(single) after first arrow down key, " + selectId +
					"._selection_change_counter (internal testing counter)");
			})
			.end()
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (value) {
				// Now the third option should be selected
				assert.strictEqual(value.widgetSelectedItemText, "Option 3 update #1",
					"(single) after second arrow down key, " + selectId + ".selectedItem.text");
				assert.strictEqual(value.widgetValueNodeSelectedIndex, 2,
					"(single) after second arrow down key, " + selectId +
					".valueNode.selectedIndex");
				assert.strictEqual(value.widgetValueNodeNSelectedOptions, 1,
					"(single) after second arrow down key, " + selectId +
					".valueNode_nSelectedOptions");
				assert.strictEqual(value.widgetSelectionChangeCounter, 2,
					"(single) after second arrow down key, " + selectId +
					"._selection_change_counter (internal testing counter)");
			})
			.end()
			.pressKeys(keys.ARROW_UP)
			.execute(executeExpr)
			.then(function (value) {
				// Now the second option should be selected again
				assert.strictEqual(value.widgetSelectedItemText, "Option 2 update #1",
					"(single) after arrow up key, " + selectId + ".selectedItem.text");
				assert.strictEqual(value.widgetValueNodeSelectedIndex, 1,
					"(single) after arrow up key, " + selectId +
					".valueNode.selectedIndex");
				assert.strictEqual(value.widgetValueNodeNSelectedOptions, 1,
					"(single) after arrow up key, " + selectId +
					".valueNode_nSelectedOptions");
				assert.strictEqual(value.widgetSelectionChangeCounter, 3,
					"(single) after arrow up key, " + selectId +
					"._selection_change_counter (internal testing counter)");
			})
			.end();
	}

	var nOptions = 40;

	registerSuite("deliteful/Select - functional", {
		before: function () {
			return this.remote
				.get("deliteful/tests/functional/Select.html")
				.then(pollUntil("return ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},
		/* The content of Select.html:
		1. deliteful/Select created declaratively:
		2. deliteful/Select created programmatically (with custom element source):
		3. deliteful/Select created declaratively (with custom element source):
		4. deliteful/Select created programmatically:
		5. deliteful/Select created declaratively with no options (empty):
		6. deliteful/Select created programmatically with no options (empty):
		7. deliteful/Select created declaratively with larger font-size, font-family:Courier,
		border-radius, and background-color (with default source):
		*/

		tests: {
			"init (declaratively, default source)": function () {
				return checkNumberOfOptions(this.remote, "select1", nOptions);
			},

			"init (programmatically, default source)": function () {
				return checkNumberOfOptions(this.remote, "select2", nOptions);
			},

			"init (declaratively, user's source)": function () {
				return checkNumberOfOptions(this.remote, "select3", nOptions);
			},

			"init (programmatically, user's source)": function () {
				return checkNumberOfOptions(this.remote, "select4", nOptions);
			},

			"init (declaratively, empty)": function () {
				return checkNumberOfOptions(this.remote, "select5", 0/*empty*/);
			},

			"init (programmatically, empty)": function () {
				return checkNumberOfOptions(this.remote, "select6", 0/*empty*/);
			},

			// Check that after pressing the update button the Select widget still has
			// the expected number of options and the options now contain the
			// updated text content.
			"update (declaratively, default source)": function () {
				return updateAndCheckNumberOfOptions(
					this.remote, "select1", "update1", nOptions);
			},

			"update (programmatically, default source)": function () {
				return updateAndCheckNumberOfOptions(
					this.remote, "select2", "update2", nOptions);
			},

			"update (declaratively, user's source)": function () {
				return updateAndCheckNumberOfOptions(
					this.remote, "select3", "update3", nOptions);
			},

			"update (programmatically, user's source)": function () {
				return updateAndCheckNumberOfOptions(
					this.remote, "select4", "update4", nOptions);
			},

			"keyboard navigation selectionMode = single": function () {
				if (!/internet explorer/i.test(this.remote.environmentType.browserName)) {
					// This test relies on up/down directly cycling through the choices, rather than opening the
					// dropdown.  I think it used to work that way on Chrome, but now the first down arrow opens
					// the dropdown.  So, it only currently works on IE.
					return this.skip("Test designed for IE behavior only.");
				}
				return checkKeyboardNavigationSingleSelection(this.remote, "select1");
			},

			"Select Form submit": function () {
				var remote = this.remote;
				if (/selendroid/i.test(remote.environmentType.browserName)) {
					return this.skip("selendroid");
				}
				return remote
					.findById("form1")
					.submit()
					.end()
					.sleep(100)		// needed when testing against local Safari 10
					.setFindTimeout(intern.config.WAIT_TIMEOUT)
					.findById("valueFor_d_select_form1")
					.getVisibleText()
					.then(function (value) {
						assert.strictEqual(value, "1", "Unexpected value for d_select_form1");
					})
					.end()
					.execute("return document.getElementById('valueFor_d_select_form2');") // disabled
					.then(function (value) {
						assert.isNull(value, "Unexpected value for disabled Combobox d_select_form2 (disabled)");
					})
					.end()
					.execute("return document.getElementById('valueFor_d_select_form4');") // multiple
					.then(function (value) {
						assert.isNull(value, "Unexpected value for disabled Combobox d_select_form2 (multiple)");
					})
					.end();
			}
		}
	});
});
