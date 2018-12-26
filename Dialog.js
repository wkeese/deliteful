define([
	"dcl/advise",
	"dojo/dnd/move",
	"delite/popup",
	"delite/register",
	"delite/Container",
	"delite/Dialog",
	"./ResizeHandle",
	"delite/handlebars!./Dialog/Dialog.html",
	"requirejs-dplugins/i18n!./Dialog/nls/Dialog",
	"delite/theme!./Dialog/themes/{{theme}}/Dialog.css",
	"delite/uacss"		// Dialog.css references "d-ie" class
], function (
	advise,
	move,
	popup,
	register,
	Container,
	Dialog,
	ResizeHandle,
	template,
	messages
) {

	"use strict";

	var ParentConstrainedMoveable = move.parentConstrainedMoveable;

	/**
	 * A dialog widget, to be used as a popup.
	 * Meant to contain forms or interactive controls (ex: links, buttons).
	 *
	 * @class module:deliteful/Dialog
	 * @augments module:delite/Dialog
	 * @augments module:delite/Container
	 */
	return register("d-dialog", [HTMLElement, Dialog, Container],  /** @lends module:deliteful/Dialog# */ {

		baseClass: "d-dialog",

		nls: messages,

		template: template,

		/**
		 * Whether or not dialog is modal.
		 */
		modal: true,

		/**
		 * Whether or not dialog is draggable.
		 */
		draggable: true,

		/**
		 * If set, makes dialog resizable.  One of: x|y|xy limit resizing to a single axis.
		 * @member {string}
		 */
		resizeAxis: "",

		/**
		 * The title of the Dialog, displayed at the top, above the content.
		 * @member {string}
		 */
		label: "",

		/**
		 * Class to display the close button icon.
		 * @member {string}
		 * @default "d-dialog-close-icon"
		 */
		closeButtonIconClass: "d-dialog-close-icon",

		refreshRendering: function (props) {
			// Add/remove ResizeHandle depending on whether or not Dialog is resizable.
			if ("resizeAxis" in props) {
				if (this._resizeHandle) {
					this._resizeHandle.destroy();
				}
				if (this.resizeAxis) {
					this._resizeHandle = new ResizeHandle({
						target: this,
						resizeAxis: this.resizeAxis
					});

					// Add it to root node, not this.containerNode.
					HTMLElement.prototype.appendChild.call(this, this._resizeHandle);
				}
			}

			if ("draggable" in props) {
				if (this.draggable) {
					this.enableDrag();
				} else {
					this.disableDrag();
				}

			}
		},

		/**
		 * Display the Dialog.
		 */
		open: function () {
			var previouslyFocusedNode = this.ownerDocument.activeElement;

			popup.open({
				parent: previouslyFocusedNode,
				popup: this,
				orient: ["center"],
				onExecute: this.close.bind(this),
				onCancel: this.close.bind(this),
				onClose: function () {
					// Focus previously focused node unless it's hidden or destroyed,
					// in which case caller must handle the focus.
					if (previouslyFocusedNode && previouslyFocusedNode.focus &&
						previouslyFocusedNode.offsetParent !== null) {
						previouslyFocusedNode.focus();
					}
				}.bind(this)
			});

			this.focus();
		},

		/**
		 * Closes the dialog.
		 * Called automatically when dialog emits an "execute" or "cancel" event.
		 */
		close: function () {
			popup.close(this);
			delete this._openArgs;
		},

		focus: function () {
			// Focus on first field.
			this._getFocusItems();
			if (this._firstFocusItem && this._firstFocusItem !== this) {
				this._firstFocusItem.focus();
			}
		},

		/**
		 * Make the dialog draggable.
		 */
		enableDrag: function () {
			if (!this.moveable) {
				var wrapper = popup.moveOffScreen(this);

				this.moveable = new ParentConstrainedMoveable(wrapper, {
					handle: this.dragHandle,
					area: "padding",
					within: true
				});

				advise.after(this.moveable, "onMoveStop", function () {
					this.emit("delite-dragged");
				}.bind(this));
			}
		},

		/**
		 * Remove ability to drag the dialog.
		 */
		disableDrag: function () {
			if (this.moveable) {
				this.moveable.destroy();
				delete this.moveable;
			}
		},

		/**
		 * Called when clicking the dialog's close button.
		 * @protected
		 */
		closeButtonClickHandler: function () {
			this.emit("cancel");
		}
	});
});
