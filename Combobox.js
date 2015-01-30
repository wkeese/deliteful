/** @module deliteful/Combobox */
define([
	"dcl/dcl",
	"requirejs-dplugins/jquery!attributes/classes,event",	// addClass(), css(), on(), off()
	"dstore/Filter",
	"decor/sniff",
	"delite/register",
	"delite/FormValueWidget",
	"delite/HasDropDown",
	"delite/keys",
	"./list/List",
	"./features!desktop-like-channel?:./Combobox/ComboPopup",
	"delite/handlebars!./Combobox/Combobox.html",
	"requirejs-dplugins/i18n!./Combobox/nls/Combobox",
	"delite/theme!./Combobox/themes/{{theme}}/Combobox.css"
], function (dcl, $, Filter, has, register, FormValueWidget, HasDropDown,
		keys, List, ComboPopup, template, messages) {
	/**
	 * A form-aware and store-aware multichannel widget leveraging the `deliteful/list/List`
	 * widget for rendering the options.
	 * 
	 * The corresponding custom tag is `<d-combobox>`.
	 * 
	 * The property `list` allows to specify the List instance used by the widget.
	 * The customization of the mapping of data item attributes into render item
	 * attributes can be done on the `List` instance using the mapping API of `List`
	 * inherited from its superclass `delite/StoreMap`.
	 * 
	 * The property `selectionMode` allows to choose between single and multiple
	 * choice modes.
	 *  
	 * In single selection mode, if the property `autoFilter` is set to `true`
	 * (default is `false`) the widget allows to type one or more characters which
	 * are used for filtering the shown list items. By default, the filtering is
	 * case-insensitive, and an item is shown if its label contains the entered
	 * string. The default filtering policy can be customized thanks to the 
	 * `filterMode` and `ignoreCase` properties.
	 * 
	 * The widget provides multichannel rendering. Depending on the required channel, which
	 * is determined by the value of the channel flags of `deliteful/features`, the
	 * widget displays the popup containing the options in a different manner:
	 * * if `has("desktop-like-channel")` is `true`: in a popup below or above the root node.
	 * * otherwise (that is for `"phone-like-channel"` and `"tablet-like-channel"`): in an
	 * overlay centered on the screen, filled with an instance of `deliteful/Combobox/ComboPopup`.
	 * 
	 * The channel flags are set by `deliteful/features` using CSS media queries depending on
	 * the screen size. See the `deliteful/features` documentation for information about the
	 * channel flags and about how to configure them statically and how to customize the values
	 * of the screen size breakpoints used by the media queries.
	 * 
	 * If the widget is used in an HTML form, the submitted value is the one
	 * of the `value` property. By default, the `label` field of list render items
	 * is used as value. A different field can be specified by using attribute
	 * mapping for `value` on the List instance. In multiple selection mode, the
	 * value is an array containing the values of the selected options.
	 * 
	 * Remark: the option items must be added, removed or updated exclusively using
	 * List's store API. Direct operations using the DOM API are not supported.
	 * 
	 * @example <caption>Markup</caption>
	 * JS:
	 * require(["delite/register", "deliteful/Store",
	 *   "deliteful/Combobox", "requirejs-domready/domReady!"],
	 *   function (register) {
	 *     register.parse();
	 *   });
	 * HTML:
	 * <d-combobox id="combobox1">
	 *   <d-list store="store"></d-list>
	 * </d-combobox>
	 * <d-store id="store">
	 *   { "label": "France", "sales": 500, "profit": 50, "region": "EU" },
	 *   { "label": "Germany", "sales": 450, "profit": 48, "region": "EU" },
	 *   { "label": "UK", "sales": 700, "profit": 60, "region": "EU" },
	 *   { "label": "USA", "sales": 2000, "profit": 250, "region": "America" },
	 *   { "label": "Canada", "sales": 600, "profit": 30, "region": "America" },
	 *   { "label": "Brazil", "sales": 450, "profit": 30, "region": "America" },
	 *   { "label": "China", "sales": 500, "profit": 40, "region": "Asia" },
	 *   { "label": "Japan", "sales": 900, "profit": 100, "region": "Asia" }
	 * </d-store>
	 * 
	 * @example <caption>Programmatic</caption>
	 * JS:
	 * require(["delite/register", "deliteful/List",
	 *   "deliteful/Combobox", ..., "requirejs-domready/domReady!"],
	 *   function (register, List, Combobox, ...) {
	 *     register.parse();
	 *     var dataStore = ...; // Create data store
	 *     var list = new List({store: dataStore});
	 *     var combobox = new Combobox({list: list, selectionMode: "multiple"}).
	 *       placeAt(...);
	 *   });
	 * 
	 * @class module:deliteful/Combobox
	 * @augments module:delite/HasDropDown
	 * @augments module:delite/FormValueWidget
	 */
	return register("d-combobox", [HTMLElement, HasDropDown, FormValueWidget],
		/** @lends module:deliteful/Combobox# */ {
		
		// TODO: handle the situation the list has a null/undefined store.
		// Would be nice to have a global policy for all subclasses of
		// delite/Store (in terms of error feedback).
		// TODO: future mechanism at the level of delite/Store-delite/StoreMap
		// to allow delegation from host widget to a different widget - to get
		// a clean mechanism to support all possible use-cases. (Probably also
		// requires changes in List).
		// TODO: improve API doc.
		// TODO: add (optional) placeholder?
		
		// Note: the property `disabled` is inherited from delite/FormWidget.
		
		baseClass: "d-combobox",
		
		template: template,
		
		/**
		 * If `true`, the list of options can be filtered thanks to an editable
		 * input element. Only used if `selectionMode` is "single".
		 * @member {boolean} module:deliteful/Combobox#autoFilter
		 * @default false
		 */
		autoFilter: false,
		
		/**
		 * The chosen filter mode. Only used if `autoFilter` is `true` and
		 * `selectionMode` is `"single"`.
		 *
		 * Valid values are:
		 *
		 * 1. "startsWith": the item matches if its label starts with the filter text.
		 * 2. "contains": the item matches if its label contains the filter text.
		 * 3. "is": the item matches if its label is the filter text.
		 *
		 * @member {string}
		 * @default "startsWith"
		 */
		filterMode: "startsWith",
		
		/**
		 * If `true`, the filtering of list items ignores case when matching possible items.
		 * Only used if `autoFilter` is `true` and `selectionMode` is `"single"`.
		 * @member {boolean} module:deliteful/Combobox#autoFilter
		 * @default true
		 */
		ignoreCase: true,
		
		/**
		 * The chosen selection mode.
		 *
		 * Valid values are:
		 *
		 * 1. "single": Only one option can be selected at a time.
		 * 2. "multiple": Several options can be selected.
		 *
		 * The value of this property determines the value of the `selectionMode`
		 * property of the List instance used by this widget for displaying the options:
		 * * The value "single" is mapped to "radio".
		 * * The value "multiple" is mapped to "multiple".
		 * 
		 * Note that, regardless of the selection mode, it is always possible to set 
		 * several selected items using the `selectedItem` or `selectedItems` properties
		 * of the List instance.
		 * The mode will be enforced only when using `setSelected()` and/or
		 * `selectFromEvent()` APIs of the List.
		 *
		 * @member {string}
		 * @default "single"
		 */
		selectionMode: "single",
		
		/**
		 * The `deliteful/list/List` element which provides and renders the options
		 * shown by the popup of the Combobox.
		 * Note that this property is set by default to a newly created instance of
		 * `deliteful/list/List`.
		 * @member {module:deliteful/list/List} module:deliteful/Combobox#list
		 * @default instance of deliteful/list/List
		 */
		list: null,
		
		// Flag used for binding the readonly attribute of the input element in the template
		_inputReadOnly: true,
		
		/**
		 * The value of the placeholder attribute of the input element used
		 * for filtering the list of options. The default value is provided by the
		 * "search-placeholder" key of the message bundle.
		 * @member {string}
		 * @default "Search"
		 */
		searchPlaceHolder: messages["search-placeholder"],
		
		/**
		 * The text displayed in the input element when more than one option is
		 * selected. The default value is provided by the "search-placeholder" key of
		 * the message bundle.
		 * @member {string}
		 * @default "Search"
		 */
		multipleChoiceMsg: messages["multiple-choice"],
		
		/**
		 * The text displayed in the input element when no option is selected.
		 * The default value is provided by the "multiple-choice-no-selection" key of
		 * the message bundle.
		 * @member {string}
		 * @default "Select option(s)"
		 */
		multipleChoiceNoSelectionMsg: messages["multiple-choice-no-selection"],
		
		/**
		 * The text displayed in the OK button when the combobox popup contains such a button.
		 * The default value is provided by the "ok-button-label" key of
		 * the message bundle.
		 * @member {string}
		 * @default "OK"
		 */
		okMsg: messages["ok-button-label"],
		
		/**
		 * The text displayed in the Cancel button when the combobox popup contains such a button.
		 * The default value is provided by the "cancel-button-label" key of
		 * the message bundle.
		 * @member {string}
		 * @default "Cancel"
		 */
		cancelMsg: messages["cancel-button-label"],
		
		preRender: function () {
			this.list = new List();
			this._defaultList = this.list;
		},
		
		refreshRendering: function (oldValues) {
			var updateReadOnly = false;
			if ("list" in oldValues) {
				// Programmatic case (List passed as argument of the ctor of Combobox
				// or set after the initialization phase)
				this._initList();
			}
			if ("selectionMode" in oldValues) {
				updateReadOnly = true;
				if (this.list) {
					this.list.selectionMode = this.selectionMode === "single" ?
						"radio" : "multiple";
				}
			}
			if ("autoFilter" in oldValues ||
				"readOnly" in oldValues) {
				updateReadOnly = true;
			}
			if (updateReadOnly) {
				this._updateInputReadOnly();
				this._setSelectable(this.inputNode, !this.inputNode.readOnly);
			}
		},
		
		/**
		 * Updates the value of the private property on which the Combobox template
		 * binds the `readonly` attribute of the input element.
		 * @private 
		 */
		_updateInputReadOnly: function () {
			var oldValue = this._inputReadOnly;
			this._inputReadOnly = this.readOnly || !this.autoFilter ||
				this._useCenteredDropDown() || this.selectionMode === "multiple";
			if (this._inputReadOnly === oldValue) {
				// FormValueWidget.refreshRendering() mirrors the value of widget.readOnly
				// to focusNode.readOnly, thus competing with the binding of the readOnly
				// attribute of the input node (which is also the focusNode attach point)
				// in the template of Combobox. To ensure the refresh of the binding is done
				// including when the value of the flag _inputReadOnly doesn't change while
				// FormValueWidget has reset the attribute to a different value, force
				// the notification:
				this.notifyCurrentValue("_inputReadOnly");
			} // else no need to notify "by hand", rely on automatic notification
		},
		
		/**
		 * Configures inputNode such that the text is selectable or unselectable.
		 * @private
		 */
		_setSelectable: function (inputNode, selectable) {
			if (selectable) {
				inputNode.removeAttribute("unselectable");
				$(inputNode)
					.css("user-select", "") // maps to WebkitUserSelect, etc.
					.off("selectstart", false);
			} else {
				inputNode.setAttribute("unselectable", "on");
				$(inputNode)
					.css("user-select", "none") // maps to WebkitUserSelect, etc.
					.on("selectstart", false);
			}
		},
		
		attachedCallback: function () {
			// If the widget is in a form, reset the initial value of the widget
			// when the form is reset
			if (this.valueNode.form) {
				this.on("reset", function () {
					this.defer(function () {
						if (this.value !== this.valueNode.value ||
							// In multiple mode, with no option selected before reset,
							// valueNode.value is the same but still needs the reinit to get
							// the correct initial inputNode.value.
							this.selectionMode === "multiple") {
							this._initValue();
						}
					});
				}.bind(this), this.valueNode.form);
			}
			
			// Declarative case (list specified declaratively inside the declarative Combobox)
			if (!this.list || this.list === this._defaultList) {
				var list = this.querySelector("d-list");
				if (list) {
					this.list = list;
					delete this._defaultList; // not needed anymore
					if (!this.list.attached) {
						this.list.addEventListener("customelement-attached",
							this._attachedlistener = function () {
								this._initList();
								this.list.removeEventListener("customelement-attached", this._attachedlistener);
							}.bind(this));
					} else {
						this._initList();
					}
				} else if (this.list && this.list === this._defaultList) {
					// Still with the default list. No other instance has been set
					// either programmatically, or declaratively.
					delete this._defaultList; // not needed anymore
					this._initList();
				}
			}
		},
		
		_initList: function () {
			// TODO
			// This is a workaround waiting for a proper mechanism (at the level
			// of delite/Store - delite/StoreMap) to allow a store-based widget
			// to delegate the store-related functions to a parent widget (delite#323).
			if (!this.list.attached) {
				this.list.attachedCallback();
			}
			
			// Class added on the list such that Combobox' theme can have a specific
			// CSS selector for elements inside the List when used as dropdown in
			// the combo. 
			$(this.list).addClass("d-combobox-list");
			
			// The drop-down is hidden initially
			$(this.list).addClass("d-combobox-list-hidden");
			
			// The role=listbox is required for the list part of a combobox by the
			// aria spec of role=combobox
			this.list.setAttribute("role", "listbox");
			
			// Avoid that List gives focus to list items when navigating, which would
			// blur the input field used for entering the filtering criteria. 
			this.list.focusDescendants = false;
			
			this.list.selectionMode = this.selectionMode === "single" ?
				"radio" : "multiple";
			
			var dropDown = this._createDropDown();
			
			// Since the dropdown is not a child of the Combobox, it will not inherit
			// its dir attribute. Hence:
			var dir = this.getAttribute("dir");
			if (dir) {
				dropDown.setAttribute("dir", dir);
			}
			
			this.dropDown = dropDown; // delite/HasDropDown's property
			
			// Focus stays on the input element
			this.dropDown.focusOnOpen = false;
			
			// (temporary?) Workaround for delite #373
			this.dropDown.focus = null;
			
			this._initHandlers();
			this._initValue();
		},
		
		_initHandlers: function () {
			if (this._initHandlersDone) {
				return; // set handlers only once
			}
			this._initHandlersDone = true;
			
			this.list.on("keynav-child-navigated", function (evt) {
				var input = this._popupInput || this.inputNode;
				var rend = evt.newValue ? this.list.getEnclosingRenderer(evt.newValue) : null;
				if (rend) {
					input.setAttribute("aria-activedescendant", evt.newValue.id);
					if (this.selectionMode === "single" && !this.list.isSelected(rend.item)) {
						this.list.setSelected(rend.item, true);
					}
					if (evt.triggerEvent &&
						(evt.triggerEvent.type === "keydown" || evt.triggerEvent.type === "keypress")) {
						this._updateScroll(rend.item, true);
					}
				} else {
					input.removeAttribute("aria-activedescendant");
				}
			}.bind(this));
			this.list.on("click", function (evt) {
				if (this.selectionMode === "single") {
					var rend = this.list.getEnclosingRenderer(evt.target);
					if (rend && !this.list.isCategoryRenderer(rend)) {
						this.defer(function () {
							// deferred such that the user can see the selection feedback
							// before the dropdown closes.
							this.closeDropDown(true/*refocus*/);
						}.bind(this), 100); // worth exposing a property for the delay?
					}
				}
			}.bind(this));
		
			// React to programmatic changes of selected items
			this.list.observe(function (oldValues) {
				if ("selectedItems" in oldValues) {
					if (this.selectionMode === "single") {
						var selectedItem = this.list.selectedItem;
						// selectedItem non-null because List in radio selection mode, but
						// the List can be empty, so:
						this.inputNode.value = selectedItem ? this._getItemLabel(selectedItem) : "";
						this.value = selectedItem ? this._getItemValue(selectedItem) : "";
						this.handleOnInput(this.value); // emit "input" event
					} else if (this.selectionMode === "multiple") {
						this._validateMultiple(this._popupInput || this.inputNode);
					}
				}
			}.bind(this));
			
			this._prepareInput(this.inputNode);
		},
		
		/**
		 * Sets the initial value of the widget. If the widget is inside a form,
		 * also called when reseting the form.
		 * @private 
		 */
		_initValue: function () {
			if (this.selectionMode === "single") {
				var selectedItem = this.list.selectedItem;
				if (selectedItem) {
					this.inputNode.value = this._getItemLabel(selectedItem);
					// Initialize widget's value
					var value = this._getItemValue(selectedItem);
					this._set("value", value);
					this.valueNode.value = value;
				} else {
					var initValueSingleMode = function (firstItemRenderer) {
						this.inputNode.value = this._getItemRendererLabel(firstItemRenderer);
						// Initialize widget's value
						var value = this._getItemRendererValue(firstItemRenderer);
						this._set("value", value);
						this.valueNode.value = value;
						this.list.selectedItem = firstItemRenderer.item;
					}.bind(this);
					var firstItemRenderer = this.list.getItemRendererByIndex(0);
					if (firstItemRenderer) {
						initValueSingleMode(firstItemRenderer);
					}
				}
			} else { // selectionMode === "multiple"
				// Differently than in single selection mode, do not select the first option,
				// because it would be confusing; the user may scroll and select some other option,
				// without deselecting the first one. The native select in multiple mode doesn't
				// select any option by default either.
				this.inputNode.value = this.multipleChoiceNoSelectionMsg;
				this.value = "";
				this.valueNode.value = "";
			}
		},
		
		/**
		 * Returns the label of a List item renderer.
		 * @private 
		 */
		_getItemRendererLabel: function (itemRenderer) {
			return this._getItemLabel(itemRenderer.item);
		},
		
		/**
		 * Returns the value of a List item renderer. Defaults to its label
		 * if the underlying data item has no value. 
		 * @private 
		 */
		_getItemRendererValue: function (itemRenderer) {
			return this._getItemValue(itemRenderer.item);
		},
		
		/**
		 * Returns the label of a List render item.
		 * @private 
		 */
		_getItemLabel: function (item) {
			return item.label;
		},
		
		/**
		 * Returns the value of a List render item. Defaults to its label
		 * if the underlying data item has no value. 
		 * @private 
		 */
		_getItemValue: function (item) {
			return "value" in item ? item.value : item.label;
		},
		
		/**
		 * Returns `true` if the dropdown should be centered, and returns
		 * `false` if it should be displayed below/above the widget.
		 * Returns `true` when the module `deliteful/Combobox/ComboPopup` has
		 * been loaded. Note that the module is loaded conditionally, depending
		 * on the channel has() features set by `deliteful/features`.
		 * @private
		 */
		_useCenteredDropDown: function () {
			return !!ComboPopup;
		},
		
		_createDropDown: function () {
			this._updateInputReadOnly();
			
			var centeredDropDown = this._useCenteredDropDown();
			var dropDown = centeredDropDown ?
				this.createCenteredDropDown() :
				this.createAboveBelowDropDown();
			
			this.dropDownPosition = centeredDropDown ?
				["center"] :
				["below", "above"]; // this is the default
			
			return dropDown;
		},
		
		/**
		 * Factory method which creates the widget used inside above/below drop-down.
		 * The default implementation simply returns `this.list`.
		 * @protected
		 */
		createAboveBelowDropDown: function () {
			// Use the List itself as content of the popup. Embedding it in a
			// LinearLayout has seemed useful for solving layout issues on iOS
			// (deliteful issue #270), but appears to be harmful on IE11 (deliteful
			// issue #382). Hence the List is not wrapped anymore inside a LinearLayout.
			return this.list;
		},
		
		/**
		 * Factory method which creates the widget used inside centered drop-down.
		 * The default implementation returns a new instance of deliteful/Combobox/ComboPopup
		 * (the present widget is set for its `combobox` property).
		 * The method can be overridden in order to create a subclass of ComboPopup (for
		 * specifying a custom template, for instance).
		 * @protected
		 */
		createCenteredDropDown: function () {
			return new ComboPopup({combobox: this});
		},
		
		_prepareInput: function (inputElement) {
			this.on("input", function (evt) {
				// Would be nice to also have an "incrementalFilter" boolean property.
				// On desktop, this would allow to redo the filtering only for "change"
				// events, triggered when pressing ENTER. This would also fit for Chrome/Android,
				// where pressing the search key of the virtual keyboard also triggers a
				// change event. But there's no equivalent on Safari / iOS...
				this.filter(inputElement.value);
				this.openDropDown(); // reopen if closed
				// Stop the spurious "input" events emitted while the user types
				// such that only the "input" events emitted via FormValueWidget.handleOnInput()
				// bubble to widget's root node.
				evt.stopPropagation();
				evt.preventDefault();
			}.bind(this), inputElement);
			this.on("change", function (evt) {
				// Stop the spurious "change" events emitted while the user types
				// such that only the "change" events emitted via FormValueWidget.handleOnChange()
				// bubble to widget's root node.
				evt.stopPropagation();
				evt.preventDefault();
			}.bind(this), inputElement);
			this.on("keydown", function (evt) {
				/* jshint maxcomplexity: 15 */
				// deliteful issue #382: prevent the browser from navigating to
				// the previous page when typing backspace in a readonly input
				if (inputElement.readOnly && evt.keyCode === keys.BACKSPACE) {
					evt.stopPropagation();
					evt.preventDefault();
				} else if (evt.keyCode === keys.ENTER) {
					evt.stopPropagation();
					evt.preventDefault();
					if (this.opened) {
						this.closeDropDown(true/*refocus*/);
					}
				} else if (evt.keyCode === keys.SPACE) {
					// Simply forwarding the key event to List doesn't allow toggling
					// the selection, because List's mechanism is based on the event target
					// which here is the input element outside the List. TODO: see deliteful #500.
					if (this.selectionMode === "multiple") {
						var rend = this.list.getEnclosingRenderer(this.list.navigatedDescendant);
						var item = rend.item;
						this.list.setSelected(item, !this.list.isSelected(item));
					}
					if (this.selectionMode === "multiple" || !this.autoFilter) {
						evt.stopPropagation();
						evt.preventDefault();
					}
				} else if (evt.keyCode === keys.DOWN_ARROW || evt.keyCode === keys.UP_ARROW ||
					evt.keyCode === keys.PAGE_DOWN || evt.keyCode === keys.PAGE_UP ||
					evt.keyCode === keys.HOME || evt.keyCode === keys.END) {
					if (this._useCenteredDropDown()) {
						this.list.emit("keydown", evt);
					}
					evt.stopPropagation();
					evt.preventDefault();
				}
			}.bind(this), inputElement);
		},
		
		_validateMultiple: function (inputElement) {
			var selectedItems = this.list.selectedItems;
			var n = selectedItems ? selectedItems.length : 0;
			var value = [];
			if (n > 1) {
				inputElement.value = this.multipleChoiceMsg;
				for (var i = 0; i < n; i++) {
					value.push(selectedItems[i] ? this._getItemValue(selectedItems[i]) : "");
				}
			} else if (n === 1) {
				var selectedItem = this.list.selectedItem;
				inputElement.value = this._getItemLabel(selectedItem);
				value.push(this._getItemValue(selectedItem));
			} else { // no option selected
				inputElement.value = this.multipleChoiceNoSelectionMsg;
			}
			this._set("value", value);
			this.valueNode.value = value;
			this.handleOnInput(this.value); // emit "input" event
		},
		
		/**
		 * Filters the embedded List to only show the items matching `filterTxt`.
		 * If `autoFilter` is `true` and `selectionMode` is `"single"`, the method
		 * is called automatically while the user types into the editable input
		 * element, with `filterTxt` being the currently entered text.
		 * The default implementation uses `dstore/Filter.match()`.
		 * The matching is performed against the `list.labelAttr` attribute of
		 * the data store items.
		 * The method can be overridden for implementing other filtering strategies.
		 * @protected
		 */
		filter: function (filterTxt) {
			if (this.filterMode === "startsWith") {
				filterTxt = "^" + filterTxt;
			} else if (this.filterMode === "is") {
				filterTxt = "^" + filterTxt + "$";
			} // nothing to add for "contains"
			
			// TODO: might be nice that, if no item matches the query thus the list is empty,
			// the popup shows some specific graphic feedback.
			var rexExp = new RegExp(filterTxt, this.ignoreCase ? "i" : "");
			this.list.query = (new Filter()).match(this.list.labelAttr, rexExp);
		},
		
		openDropDown: dcl.superCall(function (sup) {
			return function () {
				if (!this.opened) {
					// Temporary workaround for issue with bad pairing in List of the
					// busy on/off state. The issue appears to go away if List.attachedCallback
					// wouldn't break the automatic chaining (hence the workaround wouldn't
					// be necessary if List gets this change), but this requires further
					// investigation (TODO).
					this.defer(function () {
						this.list._hideLoadingPanel();
						// Avoid loosing focus when clicking the arrow (instead of the input element):
						this.focusNode.focus();
					}.bind(this), 300);
				}

				var promise = sup.apply(this, arguments);
				
				return promise.then(function () {
					this._updateScroll(undefined, true);
				}.bind(this));
			};
		}),
		
		closeDropDown: dcl.superCall(function (sup) {
			return function () {
				if (this.opened) {
					// Using the flag `opened` (managed by delite/HasDropDown), avoid
					// emitting a new change event if closeDropDown is closed more than once
					// for a closed dropdown.
					
					// Closing the dropdown represents a commit interaction
					this.handleOnChange(this.value); // emit "change" event
				
					// Reinit the query. Necessary such that after closing the dropdown
					// in autoFilter mode with a text in the input field not matching
					// any item, when the dropdown will be reopen it shows all items
					// instead of being empty 
					this.list.query = {};
				
					if (this.selectionMode === "single" && this.autoFilter) {
						// In autoFilter mode, reset the content of the inputNode when
						// closing the dropdown, such that next time the dropdown is opened
						// it doesn't show the text the user may have entered for filtering
						var selItem = this.list.selectedItem;
						if (selItem) {
							(this._popupInput || this.inputNode).value =
								this._getItemLabel(this.list.selectedItem);
						}
					}
				}
				
				sup.apply(this, arguments);
			};
		}),
		
		/**
		 * Scrolls the list inside the popup such that the specified item, or
		 * the first selected item if no item is specified, is visible.
		 * @private 
		 */
		_updateScroll: function (item, navigate) {
			// Since List is in focus-less mode, it does not give focus to
			// navigated items, thus the browser does not autoscroll.
			// TODO: see deliteful #498

			if (!item) {
				var selectedItems = this.list.selectedItems;
				item = selectedItems && selectedItems.length > 0 ?
					selectedItems[0] : null;
			}
			if (item) {
				// Make the first selected item (if any) visible.
				// Must be done after sup.apply, because List.getBottomDistance
				// relies on dimensions which are not available if the DOM nodes
				// are not (yet) visible, hence the popup needs to be shown before.
				var id = this.list.getIdentity(item);
				var renderer = this.list.getRendererByItemId(id);
				if (renderer) {
					this.list.scrollBy({y: this.list.getBottomDistance(renderer)});
					if (navigate) {
						this.list.navigatedDescendant = renderer.childNodes[0];
					}
				} // null if the list is empty because no item matches the auto-filtering
			}
		}
	});
});
