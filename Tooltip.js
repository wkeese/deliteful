/** @module deliteful/Tooltip */
define([
	"delite/register",
	"delite/Container",
	"delite/handlebars!./Tooltip/Tooltip.html",
	"delite/theme!./Tooltip/themes/{{theme}}/Tooltip.css"
], function (register, Container, template) {

	/**
	 * A tooltip widget, to be used as a popup.
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

		template: template
	});
});
