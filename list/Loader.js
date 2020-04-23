/** @module deliteful/list/Loader */
import register from "delite/register";
import LitWidget from "delite/LitWidget";
import { html } from "lit-html";

// Used in template.
import "../ProgressIndicator";

/**
 * An helper widget that renders a progress indicator and a label.
 *
 * Depending of the value of its `loading` property, it shows a `loadingMessage` or a `loadMessage`.
 * Furthermore, if `loading` is equal to `true`, an active progress indicator is displayed too.
 *
 * @class module:deliteful/list/Loader
 * @augments module:deliteful/list/Loader
 */
export default register("d-list-loader", [ HTMLElement, LitWidget ], {
	baseClass: "d-list-loader",

	/**
	 * Loader's message.
	 * @type {string}
	 * @default ""
	 */
	label: "",

	/**
	 * It determines if the loader is active or not.
	 * @type {Boolean}
	 * @default false
	 */
	loading: false,

	render: function () {
		const { label, loading, widgetId } = this;

		return html`
			<div class="d-list-loader ${this.loading ? "d-loading" : ""}" role="button"
					aria-labelledby="${widgetId}-label" aria-disabled="${loading}">
				<div class="d-spacer"></div>
				<d-progress-indicator class="d-list-loader-progress-indicator" active=${loading}
					d-hidden="${!this.loading}"></d-progress-indicator>
				<div class="d-list-loader-label" id="${widgetId}-label">${label}</div>
				<div class="d-spacer"></div>
			</div>
		`;
	}
});

