/** @module deliteful/Tooltip */
define([
	"delite/register",
	"delite/Container",
	"delite/handlebars!./Tooltip/Tooltip.html",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/theme!./Tooltip/themes/{{theme}}/Tooltip.css"
], function (register, Container, template, $) {

	/**
	 * A tooltip widget, to be used as a popup.
	 * Meant to contain simple or rich text, but not interactive controls (ex: links and buttons).
	 *
	 * @class module:deliteful/Tooltip
	 * @augments module:delite/Container
	 */
	return register("d-tooltip", [HTMLElement, Container], /** @lends module:deliteful/Tooltip# */ {
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-tooltip"
		 */
		baseClass: "d-tooltip",

		template: template,

		createdCallback: function () {
			this.on("popup-after-show", this.onOpen.bind(this));
			this.on("popup-after-position", this.onPosition.bind(this));
			this.on("popup-before-hide", this.onClose.bind(this));
		},

		/**
		 * Configure widget to be displayed in given position relative to the button.
		 * This is called from the delite/popup code, and should not be called directly.
		 * Alternately could change Tooltip.less to put 15px margin on all sides of the tooltip
		 * (rather than having margin dependent on tooltip orientation), and then this code
		 * could be moved to `onOpen()`.
		 */
		orient: function (/*delite/Widget*/ node, /*string*/ aroundCorner, /*string*/ tooltipCorner) {
			var newC = {
				// Real around node
				"MR-ML": "d-tooltip-right",
				"ML-MR": "d-tooltip-left",
				"TM-BM": "d-tooltip-above",
				"BM-TM": "d-tooltip-below",
				"BL-TL": "d-tooltip-below d-tooltip-AB-left",
				"TL-BL": "d-tooltip-above d-tooltip-AB-left",
				"BR-TR": "d-tooltip-below d-tooltip-AB-right",
				"TR-BR": "d-tooltip-above d-tooltip-AB-right",
				"BR-BL": "d-tooltip-right",
				"BL-BR": "d-tooltip-left",

				// Positioning "around" a point, ex: mouse position
				"BR-TL": "d-tooltip-below d-tooltip-AB-left",
				"BL-TR": "d-tooltip-below d-tooltip-AB-right",
				"TL-BR": "d-tooltip-above d-tooltip-AB-right",
				"TR-BL": "d-tooltip-above d-tooltip-AB-left"
			}[aroundCorner + "-" + tooltipCorner];

			$(this).removeClass(this._currentOrientClass || "").addClass(newC);
			this._currentOrientClass = newC;
		},

		/**
		 * Called when tooltip is displayed or repositioned.
		 * This is called from the delite/popup code, and should not be called directly.
		 */
		onPosition: function (/*Object*/ pos) {
			// Position the tooltip connector for middle alignment.
			// This could not have been done in orient() since the tooltip wasn't positioned at that time.
			var aroundNodeCoords = pos.aroundNodePos;
			if (pos.corner.charAt(0) === "M" && pos.aroundCorner.charAt(0) === "M") {
				this.connectorNode.style.top = aroundNodeCoords.y +
					((aroundNodeCoords.h - this.connectorNode.offsetHeight) >> 1) - pos.y + "px";
				this.connectorNode.style.left = "";
			} else if (pos.corner.charAt(1) === "M" && pos.aroundCorner.charAt(1) === "M") {
				this.connectorNode.style.left = aroundNodeCoords.x +
					((aroundNodeCoords.w - this.connectorNode.offsetWidth) >> 1) - pos.x + "px";
				this.connectorNode.style.top = "";
			}
		},

		/**
		 * Called when tooltip is displayed.
		 * This is called from the delite/popup code, and should not be called directly.
		 */
		onOpen: function (/*Object*/ pos) {
			// Setup aria-described property pointing from anchor-node to this node.
			var aroundNode = pos.around;
			if (aroundNode) {
				this.anchorNode = aroundNode.focusNode || aroundNode;
				if (!this.id) {
					this.id = "tooltip" + this.widgetId;
				}
				this.anchorNode.setAttribute("aria-describedby", this.id);
			}
		},

		/**
		 * Called when tooltip is hidden.
		 * This is called from the delite/popup code, and should not be called directly.
		 */
		onClose: function () {
			if (this.anchorNode) {
				this.anchorNode.removeAttribute("aria-describedby");
			}
		}
	});
});
