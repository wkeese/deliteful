define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"dojo/dom-class",
	"deliteful/CheckBox",
	"./resources/CheckBox-shared"
], function (dcl, registerSuite, assert, register, domClass, CheckBox, commonSuite) {

	var container,
		html = "<d-checkbox id='cb1'></d-checkbox><d-checkbox id='cb2' value='foo'>" +
			"</d-checkbox><d-checkbox id='cb3' checked='true'></d-checkbox><label id='lbl4' for='cb3'>cb3</label>";

	var suite = {
		setup: function () {
			dcl.mix(commonSuite, {
				baseClass: "d-checkbox",
				defaultWidget: "cb1",
				labelForTarget: "cb3",
				inputType: "checkbox"
			});
		},
		"initState": function () {
			var cb2 = document.getElementById("cb2");
			assert.strictEqual(cb2.value, "foo",
				"Unexpected default value for 'value' property if 'value' specified/unchecked");
			var cb = document.getElementById("cb3");
			assert.ok(cb.checked, "Unexpected default value for 'checked' property if 'checked' specified.");
		},
		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};
	dcl.mix(suite, commonSuite.testCases);

	// Markup
	var markupSuite = {
		name: "deliteful/CheckBox: markup",
		"beforeEach": function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.parse();
		}
	};
	dcl.mix(markupSuite, suite);
	registerSuite(markupSuite);

	var progSuite = {
		name: "deliteful/CheckBox: programmatic",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			var cb = new CheckBox({id: "cb1"});
			container.appendChild(cb);
			cb.startup();
			cb = new CheckBox({id: "cb2", value: "foo"});
			container.appendChild(cb);
			cb.startup();
			var lbl4 = document.createElement("label");
			lbl4.id = "lbl4";
			lbl4.setAttribute("for", "cb3");
			lbl4.textContent = "cb3";
			container.appendChild(lbl4);
			cb = new CheckBox({id: "cb3", checked: true});
			container.appendChild(cb);
			cb.startup();
		}
	};
	dcl.mix(progSuite, suite);
	registerSuite(progSuite);
});
