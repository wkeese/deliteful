/** @module deliteful/list/PageableList */
import dcl from "dcl/dcl";
import { html } from "lit-html";
import "delite/a11y";		// d-keyboard-click
import register from "delite/register";
import string from "dojo/string";
import List from "./List";
import messages from "requirejs-dplugins/i18n!./List/nls/Pageable";

// Used in template.
// TODO: convert to lit-html and inline.
import "deliteful/list/Loader";

/**
 * A widget that renders a scrollable list of items and provides paging.
 *
 * This widget allows displaying the content of a list in pages of items instead of rendering
 * all items at once.
 *
 * @class module:deliteful/list/PageableListList
 * @augments module:deliteful/list/List
 */
export default register("d-pageable-list", [ List ], /** @lends module:deliteful/list/PageableList# */ {
	/**
	 * if > 0, enable paging while defining the number of items to display per page.
	 * @member {number}
	 * @default 0
	 */
	pageLength: 0,

	/**
	 * The maximum number of pages to display at the same time. If a new page is loaded while
	 * the maximum number of pages is already displayed, another page will be unloaded from the list
	 * to make room for the new page.
	 * @member {number}
	 * @default 0
	 */
	maxPages: 0,

	/**
	 * The message displayed on the previous page loader when it can be clicked
	 * to load the previous page and when a loading is not already in progress.
	 * This message can contains placeholders for the
	 * List attributes to be replaced by their runtime value. For example, the
	 * message can include the value of the pageLength attribute by using the
	 * placeholder `${pageLength}`.
	 * @member {string}
	 * @default localized version of "Click to load ${pageLength} more items"
	 */
	loadPreviousMessage: messages["default-load-message"],

	/**
	 * The message displayed on the next page loader when it can be clicked
	 * to load the next page and when a loading is not already in progress.
	 * This message can contains placeholders for the
	 * List attributes to be replaced by their runtime value. For example, the
	 * message can include the value of the pageLength attribute by using the
	 * placeholder `${pageLength}`.
	 * @member {string}
	 * @default localized version of "Click to load ${pageLength} more items"
	 */
	loadNextMessage: messages["default-load-message"],

	/**
	 * The message displayed on both loaders when they can be clicked
	 * to load a new page.
	 * @member {string}
	 * @default ""
	 */
	loadingMessage: messages["loading-message"],

	/**
	 * The message displayed when the loading panel is shown.
	 * @member {string}
	 * @default ""
	 */
	loadingPanelMessage: messages["loading-panel-message"],

	/**
	 * Indicates whether or not to use auto paging. If true, automatically loads the next or previous page when
	 * the scrolling reaches the bottom or the top of the list content.
	 * @member {boolean}
	 * @default false
	 */
	autoPaging: dcl.prop({
		set: function (value) {
			this._set("autoPaging", value);
			if (this._autoPagingHandle) {
				this._autoPagingHandle.remove();
				this._autoPagingHandle = null;
			}
			if (value) {
				this._autoPagingHandle = this.on("scroll", this._scrollHandler.bind(this), this);
			}
		},
		get: function () {
			return this._get("autoPaging") || false;
		},
		enumerable: true,
		configurable: true
	}),

	/**
	 * Indicates whether or not to hide the content of the list when loading a new page.
	 * If true, the content of the list is hidden by a loading panel (displaying a progress
	 * indicator and an optional label defined with the property loadingMessage)
	 * while its content is updated with a new page of data.
	 * This attribute is ignored if autoPaging is true.
	 * @member {boolean}
	 * @default false
	 */
	hideOnPageLoad: false,

	/**
	 * The collection of items from which pages are extracted
	 * @member {boolean} module:deliteful/list/Pageable#_collection
	 * @private
	 */
	_collection: null,

	/**
	 * Handle for the auto paging scroll handler (Object with a remove method)
	 * @member {module:deliteful/list/Pageable} module:deliteful/list/Pageable#_autoPagingHandle
	 * @private
	 */

	/**
	 * Spec of the range to use to load a page.
	 * @member {Object} module:deliteful/list/Pageable#_rangeSpec
	 * @private
	 */

	/**
	 * The next page loader.
	 * @member {_PageLoaderRenderer} module:deliteful/list/Pageable#nextPageLoader
	 * @private
	 */

	/**
	 * The previous page loader.
	 * @member {_PageLoaderRenderer} module:deliteful/list/Pageable#previousPageLoader
	 * @private
	 */

	/**
	 * Wheter or not the list is currently scrolled at the top or the bottom
	 * @member {boolean} module:deliteful/list/Pageable#_atExtremity
	 * @private
	 */

	/**
	 * One entry per page currently loaded. Each entry contains an array
	 * of the ids of the items displayed in the page.
	 * @member {Array[]} module:deliteful/list/Pageable#_idPages
	 * @private
	 */

	/**
	 * Index of the first item currently loaded.
	 * @member {number}
	 * @default -1
	 * @private
	 */
	_firstLoaded: -1,

	/**
	 * Index of the last item currently loaded.
	 * @member {number}
	 * @default -1
	 * @private
	 */
	_lastLoaded: -1,

	/**
	 * Flag to indicate that there is (or may be) more data before the data that's currently
	 * being shown.
	 * @member {boolean}
	 * @default false
	 * @private
	 */
	_previousRecordsMayExist: false,

	/**
	 * Flag to hide/show the button to load the previous page.
	 * @member {boolean}
	 * @default false
	 * @private
	 */
	_showPreviousPageButton: false,

	/**
	 * Flag to indicate that there is (or may be) more data after the data that's currently
	 * being shown.
	 * @member {boolean}
	 * @default false
	 * @private
	 */
	_nextRecordsMayExist: false,

	/**
	 * Flag to hide/show the nextPageLoader widget.
	 * However the widget is shown only if `displayedPanel` is equal to `list`.
	 * @member {boolean}
	 * @default false
	 * @private
	 */
	_showNextPageButton: false,

	/**
	 * Set to true if the previous page is currently being loaded.
	 * @type {boolean}
	 */
	loadingPreviousPage: false,

	/**
	 * Set to true if the next page is currently being loaded.
	 * @type {boolean}
	 */
	loadingNextPage: false,

	/**
	 * Previous page loader's message. This is the actual message that will be visible
	 * once `loadPreviousMessage` property's placeholders have been replaced.
	 * @type {string}
	 * @private
	 */
	_previousPageButtonLabel: "",

	/**
	 * Next page loader's message. This is the actual message  that will be visible
	 * once `loadNextMessage` property's placeholders have been replaced.
	 * @type {string}
	 * @private
	 */
	_nextPageButtonLabel: "",

	/**
	 * Flag to make refreshRendering() move focus to first list item.
	 * @type {boolean}
	 */
	_focusFirstListItem: false,

	/**
	 * Flag to make refreshRendering() move focus to last list item.
	 * @type {boolean}
	 */
	_focusLastListItem: false,

	previousPageLoader: dcl.prop({
		get: () => this.querySelector("d-list-loader")
	}),

	nextPageLoader: dcl.prop({
		get: () => this.querySelectorAll("d-list-loader")[1]
	}),

	computeProperties: function (props) {
		if (this.pageLength > 0) {
			if ("_busy" in props || "hideOnPageLoad" in props || "autoPaging" in props || "showNoItems" in props
				|| "_previousRecordsMayExist" in props || "_nextRecordsMayExist" in props) {
				this._displayedPanel = (this._busy && this.hideOnPageLoad && !this.autoPaging) ? "loading-panel" :
					(this.containerNode && this.containerNode.children.length > 0) ?
						"list" : ((this.showNoItems) ? "no-items" : "none");
			}
		}

		// Due to the string.substitute(), any change to any property could trigger a change to
		// _previousPageButtonLabel, _nextPageButtonLabel.
		this._previousPageButtonLabel = this.loadingPreviousPage ? this.loadingMessage :
			string.substitute(this.loadPreviousMessage, this);

		this._nextPageButtonLabel = this.loadingNextPage ? this.loadingMessage :
			string.substitute(this.loadNextMessage, this);

		this._showNextPageButton = this._nextRecordsMayExist && this._displayedPanel === "list";
		this._showPreviousPageButton = this._previousRecordsMayExist && this._displayedPanel === "list";
	},

	render: dcl.superCall(function (sup) {
		const {
			loadingPreviousPage, _previousPageButtonLabel, _showPreviousPageButton,
			loadingNextPage, _nextPageButtonLabel, _showNextPageButton,
			tabIndex
		} = this;

		const previousPageButton = _showPreviousPageButton ? html`
			<d-list-loader
				class="d-list-previous-loader d-list-cell"
				@click="${evt => this._loadPreviousPage(evt)}" d-keyboard-click="true"
				.loading=${loadingPreviousPage}
				.label="${_previousPageButtonLabel}"
				.tabIndex="${tabIndex}"
			></d-list-loader>
		` : null;

		const nextPageButton = _showNextPageButton ? html`
			<d-list-loader class="d-list-next-loader d-list-cell"
				@click="${evt => this._loadNextPage(evt)}" d-keyboard-click="true"
				.loading=${loadingNextPage}
				.label="${_nextPageButtonLabel}"
				.tabIndex="${tabIndex}"
			></d-list-loader>
		` : null;

		return function () {
			return html`
				${previousPageButton}
				${sup.call(this)}
				${nextPageButton}
			`;
		};
	}),

	refreshRendering: function (props) {
		if (this.pageLength > 0) {
			if ("_collection" in props && this._collection) {
				// Initial loading of the list
				if (this._dataLoaded) {
					this._busy = true;
					this._empty();
					props.pageLength = true;
				}
				this._idPages = [];
				this._loadNextPage().then(function () {
					this._busy = false;
					this._dataLoaded = true;
				}.bind(this), function (error) {
					this._busy = false;
					this._queryError(error);
				}.bind(this));
			}
		}

		// If user [keyboard] clicked the "next page" button, move focus to last visible list item.
		// Important if we just hid that button because there are no more pages.
		// Likewise if focus was on the "first page" button.
		// This code is positioned to run after the "next page" / "previous page" buttons are hidden/shown
		// because hiding/showing buttons can scroll list items in/out of view.
		var renderer;
		if ("_focusFirstListItem" in props) {
			renderer = this._getFirstVisibleRenderer();
		} else if ("_focusLastListItem" in props) {
			renderer = this._getLastVisibleRenderer();
		}
		if (renderer) {
			this.navigateTo(this.type === "grid" ? renderer.firstElementChild : renderer);
		}
	},

	//////////// delite/Store methods ///////////////////////////////////////

	processCollection: dcl.superCall(function (sup) {
		return function (collection) {
			if (this.pageLength === 0) {
				sup.apply(this, arguments);
			}
			this._collection = collection;
			if (this.pageLength !== 0) {
				this.emit("query-success", { renderItems: this.renderItems, cancelable: false, bubbles: true });
			}
		};
	}),

	//////////// Private methods ///////////////////////////////////////

	/**
	 * Adds or removes the identity of an item in idPages
	 * @param {boolean} add true to add, false to remove
	 * @param {number} index Index of the item in the tracked collection
	 * @param {Object} identity Identity to add (only if add is true)
	 * @private
	 */
	_updateIdPages: function (add, index, identity) {
		var pageFirstIndex = this._firstLoaded;
		for (var pageIndex = 0; pageIndex < this._idPages.length; pageIndex++) {
			var pageLastIndex = pageFirstIndex + this._idPages[pageIndex].length - 1;
			if (index >= pageFirstIndex && index <= pageLastIndex) {
				if (add) {
					this._idPages[pageIndex].splice(index - pageFirstIndex, 0, identity);
				} else {
					this._idPages[pageIndex].splice(index - pageFirstIndex, 1);
				}
				break;
			} else {
				pageFirstIndex += this._idPages[pageIndex].length;
			}
		}
	},

	/**
	 * Unloads a page.
	 * @param {boolean} first true to unload the first page, false to unload the last one.
	 * @private
	 */
	_unloadPage: function (first) {
		if (first) {
			const idPage = this._idPages.shift();
			this.displayedItems = this.displayedItems.slice(idPage.length);
			this._firstLoaded += idPage.length;
			if (idPage.length) {
				this._previousRecordsMayExist = true;
			}
			// if the next page is also empty, unload it too
			if (this._idPages.length && !this._idPages[0].length) {
				this._unloadPage(first);
			}
		} else {
			const idPage = this._idPages.pop();
			this.displayedItems = this.displayedItems.slice(0, idPage.length);
			this.lastLoaded -= idPage.length;
			if (idPage.length) {
				this._nextRecordsMayExist = true;
			}
			// if the previous page is also empty, unload it too
			if (this._idPages.length && !this._idPages[this._idPages.length - 1].length) {
				this._unloadPage(first);
			}
		}
	},

	/**
	 * Loads the previous page of items if available and if another loading is not already in progress.
	 * @private
	 */
	_loadPreviousPage: function () {
		if (this._dataLoaded && this._busy) {
			return;
		}

		this._rangeSpec.count = this.pageLength;
		this._rangeSpec.start = this._firstLoaded - this.pageLength;
		if (this._rangeSpec.start < 0) {
			this._rangeSpec.count += this._rangeSpec.start;
			this._rangeSpec.start = 0;
		}
		this.loadingPreviousPage = this._busy = true;
		var results = this._collection.fetchRange({
			start: this._rangeSpec.start,
			end: this._rangeSpec.start + this._rangeSpec.count
		});
		return results.then(function (items) {
			var page = items.map(function (item) {
				return this.itemToRenderItem(item);
			}, this);
			if (page.length) {
				var i;
				var idPage = page.map(function (item) {
					return this.getIdentity(item);
				}, this);
				var previousPageIds = this._idPages[0];
				for (i = 0; i < idPage.length; i++) {
					if (previousPageIds.indexOf(idPage[i]) >= 0) {
						// remove the duplicate (happens if an element was deleted before the first one displayed)
						page.splice(i, 1);
						idPage.splice(i, 1);
						i--;
					}
				}
				this._firstLoaded = this._rangeSpec.start;
				this._idPages.unshift(idPage);
			}
			this._previousPageReadyHandler(page);
		}.bind(this));
	},

	/**
	 * Loads the next page of items if available and if another loading is not already in progress.
	 * @private
	 */
	_loadNextPage: function () {
		if (this._dataLoaded && this._busy) {
			return;
		}

		if (!this._rangeSpec) {
			this._rangeSpec = {
				start: 0,
				count: this.pageLength
			};
		}
		this.loadingNextPage = this._busy = true;
		if (this._nextRecordsMayExist) {
			this._rangeSpec.start = this._lastLoaded + 1;
			this._rangeSpec.count = this.pageLength;
		}
		var results = this._collection.fetchRange({
			start: this._rangeSpec.start,
			end: this._rangeSpec.start + this._rangeSpec.count
		});
		return results.then(function (items) {
			var page = items.map(function (item) {
				return this.itemToRenderItem(item);
			}, this);
			if (page.length) {
				var idPage = page.map(function (item) {
					return this.getIdentity(item);
				}, this);
				if (this._firstLoaded < 0) {
					this._firstLoaded = this._rangeSpec.start;
				}
				this._lastLoaded = this._rangeSpec.start + idPage.length - 1;
				this._idPages.push(idPage);
			}
			this._nextPageReadyHandler(page);
		}.bind(this));
	},

	/**
	 * Function to call when the previous page has been loaded.
	 * @param {Object[]} items the items in the previous page.
	 * @private
	 */
	_previousPageReadyHandler: function (items) {
		this._addPage(items, true);
		if (this.maxPages && this._idPages.length > this.maxPages) {
			this._unloadPage(false);
		}
		if (this._firstLoaded === 0) {
			// no more previous page
			this._previousRecordsMayExist = false;
		} else {
			this._previousRecordsMayExist = true;
		}

		this.loadingPreviousPage = this._busy = false;

		// If focus is on the "previous page" button, then set flag to move focus inside the list.
		// Especially important for the case when the "previous page" button is about to be hidden.
		if (this.previousPageLoader.contains(this.ownerDocument.activeElement)) {
			this.notifyCurrentValue("_focusFirstListItem");
		}
	},

	/**
	 * Function to call when the next page has been loaded.
	 * @param {Object[]} items the items in the next page.
	 * @private
	 */
	_nextPageReadyHandler: function (items) {
		this._addPage(items, false);
		if (this.maxPages && this._idPages.length > this.maxPages) {
			this._unloadPage(true);
		}
		if (this._nextRecordsMayExist) {
			if (items.length !== this._rangeSpec.count) {
				// no more next page
				this._nextRecordsMayExist = false;
			} else {
				this._nextRecordsMayExist = true;
			}
		} else {
			if (items.length === this._rangeSpec.count) {
				this._nextRecordsMayExist = true;
			}
		}

		this.loadingNextPage = this._busy = false;

		// If focus is on the "next page" button, then set flag to move focus inside the list.
		// Especially important for the case when the "next page" button is about to be hidden.
		if (this.nextPageLoader.contains(this.ownerDocument.activeElement)) {
			this.notifyCurrentValue("_focusLastListItem");
		}
	},

	/**
	 * Returns the last renderer that is visible in the scroll viewport.
	 * @private
	 */
	_getLastVisibleRenderer: function () {
		const renderers = this.getNavigableRows().reverse();
		return renderers.find(renderer => this.getBottomDistance(renderer) <= 0);
	},

	/**
	 * Returns the first renderer that is visible in the scroll viewport.
	 * @private
	 */
	_getFirstVisibleRenderer: function () {
		const renderers = this.getNavigableRows();
		return renderers.find(renderer => this.getTopDistance(renderer) >= 0);
	},

	//////////// Event handlers ///////////////////////////////////////

	/**
	 * Handler for scroll events (auto paging).
	 * @private
	 */
	_scrollHandler: function () {
		if (this.isTopScroll()) {
			if (!this._atExtremity && this._previousRecordsMayExist) {
				this._loadPreviousPage();
			}
			this._atExtremity = true;
		} else if (this.isBottomScroll()) {
			if (!this._atExtremity && this._nextRecordsMayExist) {
				this._loadNextPage();
			}
			this._atExtremity = true;
		} else {
			this._atExtremity = false;
		}
	},

	//////////// List methods overriding ///////////////////////////////////////

	_empty: function () {
		this.displayedItems = [];
		if (this.pageLength > 0) {
			this._nextRecordsMayExist = false;
			this._previousRecordsMayExist = false;
			this._rangeSpec = null;
			this._untrack();
			this._firstLoaded = this._lastLoaded = -1;
			this._dataLoaded = false;
		}
	}
});

