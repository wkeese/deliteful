define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;
	var domGeom = require("dojo/dom-geometry");
	var register = require("delite/register");
	require("deliteful/LinearLayout");

	var container, node;
	var htmlContent =
			"<d-linear-layout id='dlayout' vertical='false' style='width:680px'>" +
				"<div id='divA' style='width:40px'>A</div>" +
				"<div id='divB' class='fill'>B</div><div id='divC' style='width:40px'>C</div></d-linear-layout>";

	registerSuite("LinearLayout-horizontal-mixedwidth", {
		before: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.deliver();
			node = document.getElementById("dlayout");
		},

		tests: {
			"Horizontal LinearLayout Various Width": function () {
				var children = node.getChildren();
				assert.strictEqual(children.length, 3);
				var box1 = domGeom.getMarginBox(children[0]);
				var box2 = domGeom.getMarginBox(children[1]);
				var box3 = domGeom.getMarginBox(children[2]);
				assert.strictEqual(box1.w, 40, "box1.w");
				assert.strictEqual(box2.w, 600, "box2.w");
				assert.strictEqual(box3.w, 40, "box3.w");
			}
		},

		after: function () {
			container.parentNode.removeChild(container);
		}
	});
});
