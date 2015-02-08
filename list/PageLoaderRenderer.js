/** @module deliteful/list/PageLoadRenderer */
define([
	"delite/register",
	"requirejs-dplugins/Promise!",
	"requirejs-dplugins/jquery!attributes/classes",
	"./Renderer",
	"delite/handlebars!./List/_PageLoaderRenderer.html",
	"requirejs-dplugins/i18n!./List/nls/Pageable"
], function (register, Promise, $, Renderer, template) {

	/*
	 * A clickable renderer that initiate the loading of a page in a pageable list.
	 * It renders an item that has the following properties:
	 * - loadMessage: the label to display when a page is not currently loading
	 * - loadingMessage: the label to display when a page is loading
	 */
	return register("d-list-loader", [HTMLElement, Renderer], {

		/*
		 * The CSS class of the widget
		 * @member {string}
		 * @default "d-list-loader"
		 */
		baseClass: "d-list-loader",

		_setItemAttr: function (item) {
			this._set("item", item);
			if (this.item && !this.loading) {
				this._label.innerHTML = this.item.loadMessage;
			}
		},

		/*
		 * Indicates whether or not a page is currently loading.
		 * @member {boolean}
		 */
		loading: false,
		_setLoadingAttr: function (/*boolean*/loading) {
			// summary:
			//		Set the loading status of the widget
			this._set("loading", loading);
			// always execute beforeLoading, even if the page loader widget was destroyed
			if (loading) {
				this.beforeLoading();
			}
			if (!this._destroyed) {
				$(this).toggleClass("d-loading", loading);
				this._label.innerHTML = loading ? this.item.loadingMessage : this.item.loadMessage;
				$(this._progressIndicator).toggleClass("d-hidden");
				this._progressIndicator.active = loading;
				if (loading) {
					this._button.setAttribute("aria-disabled", "true");
				} else {
					this._button.removeAttribute("aria-disabled");
				}
			}
			// always execute afterLoading, even if the page loader widget was destroyed
			if (!loading) {
				this.afterLoading();
			}
		},

		/*
		 * HTML element that wraps a progress indicator and an optional label in the render node
		 * @member {HTMLElement} _PageLoaderRenderer#_button
		 * @private
		 */

		/*
		 * A progress indicator to report that the loader is currently loading a page
		 * @member {module:deliteful/ProgressIndicator} _PageLoaderRenderer#_progressIndicator
		 * @private
		 */

		/*
		 * An HTML element that displays a label for the loader
		 * @member {HTMLElement} _PageLoaderRenderer#_label
		 * @private
		 */

		/*
		 * The list that the PageLoader loads data for
		 * @member {module:deliteful/list/List} _PageLoaderRenderer#_list
		 * @private
		 */

		//////////// Widget life cycle ///////////////////////////////////////

		postRender: function () {
			// summary:
			//		set the click event handler
			this.on("click", this._load.bind(this));	// todo: move to template
		},

		template: template,

		//////////// Public methods ///////////////////////////////////////

		/*
		 * Executed before loading a page.
		 * Callback to be implemented by user of the widget
		 * @method _PageLoaderRenderer#beforeLoading
		 * @abstract
		 */

		/*
		 * Performs the actual loading of a page.
		 * Callback to be implemented by user of the widget.
		 * It MUST return a promise that is fulfilled when the load operation is finished.
		 * @method _PageLoaderRenderer#performLoading
		 * @abstract
		 */

		/*
		 * Executed after loading a page.
		 * Callback to be implemented by user of the widget
		 * @method _PageLoaderRenderer#afterLoading
		 * @abstract
		 */

		//////////// Private methods ///////////////////////////////////////

		/*
		 * Handle click events on the widget.
		 * If a loading is already in progress, this method
		 * return undefined. In the other case, it starts a loading
		 * and returns a Promise that resolves when the loading
		 * has completed.
		 * @returns {Promise} or null
		 * @private
		 */
		_load: function () {
			if (this._list.hasAttribute("aria-busy")) {
				return;
			}
			this.loading = true;
			var self = this;
			return new Promise(function (resolve, reject) {
				// defer execution so that the new style / class is correctly applied on iOS
				self.defer(function () {
					self.performLoading().then(function () {
						self.loading = false;
						resolve();
					}.bind(this), function (error) {
						self.loading = false;
						reject(error);
						self._queryError(error);
					});
				});
			});
		}
	});
});
