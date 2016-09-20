/** @module deliteful/DropDownButton */
define([
	"delite/register",
	"delite/HasDropDown",
	"./Button"
], function (register, HasDropDown, Button) {

	/**
	 * A button to launch a dropdown or tooltip [dialog].
	 * @class module:deliteful/DropDownButton
	 * @example
	 * <button is="d-dropdown-button">
	 *     <d-label>Click me</d-label>
	 *     <d-tooltip>...</d-tooltip>
	 * </button>
	 * @example
	 * <button is="d-dropdown-button" dropDown=...>
	 *   Click me
	 * </button>
	 * @augments module:deliteful/Button
	 */
	return register("d-dropdown-button", [Button, HasDropDown], /** @lends module:deliteful/DropDownButton# */ {
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-dropdown-button"
		 */
		baseClass: "d-dropdown-button",

		createdCallback: register.before(function () {
			// Handle the declarative case when contents are <d-label>...</d-label><d-tooltip>...</d-tooltip>.
			// This code must run before Button#createdCallback().
			if (this.firstElementChild && this.firstElementChild.tagName.toLowerCase() === "d-label") {
				this.label = this.firstElementChild.textContent.trim();
				this.dropDown = this.lastElementChild;
				this.innerHTML = "";
			}
		})
	});
});
