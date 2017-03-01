/** @module deliteful/BoilerplateTextbox */
define([
	"dcl/dcl",
	"delite/register",
	"delite/FormValueWidget",
	"delite/handlebars!./BoilerplateTextbox/BoilerplateTextbox.html"
], function (
	dcl,
	register,
	FormValueWidget,
	template
) {
	"use strict";

	// TODO: create Field, NumberField, Delimiter classes to represent fields.

	/**
	 * Base class for all editable fields and delimiters in a BoilerplateTextbox.
	 */
	var Field = dcl(null, {
		constructor: function (args) {
			dcl.mix(this, args);
		},

		/**
		 * Text to display when field has no value.
		 * @member {string}
		 */
		boilerplate: "",

		/**
		 * True if the user can edit the field.  False if field is a delimiter.
		 * @member {boolean}
		 */
		editable: true,

		/**
		 * Value of field, or null if no value is set.
		 * @member {string}
		 */
		value: null,

		/**
		 * Called when focus moved to this field.
		 */
		focusHandler: function () {
		},

		/**
		 * Handler for when the user types a character.
		 * @param {string} char
		 * @returns {boolean} True if focus should be moved to next field.     `
		 */
		inputHandler: function (char) {
		}

		// TODO: delete key handler
	});

	/**
	 * Non-editable field.
	 */
	var Delimiter = dcl(Field, {
		editable: false
	});

	/**
	 * Generic number field.
	 */
	var NumberField = dcl(Field, {
		/**
		 * Number of characters user has typed into this field since it was focused.
		 */
		charactersTyped: 0,

		focusHandler: function () {
			this.charactersTyped = 0;
		},

		inputHandler: function (char) {
			if (/[0-9]/.test(char)) {
				if (this.charactersTyped === 0) {
					// For the first character the user types, replace the boilerplate text (ex: "yyyy")
					// with zeros followed by the character the user typed.
					this.value = "0".repeat(this.boilerplate.length - 1) + char;
				} else {
					// Otherwise, slide the other characters over and insert new character at right,
					// for example if the user types "3" then "0002" is changed to "0023".
					this.value = this.value.substr(1) + char;
				}

				this.charactersTyped++;
			}
			
			// Return true if focus should advance to next field.
			return  this.charactersTyped >= this.boilerplate.length;
		}
	});

	// TODO: move to delite?
	/**
	 * A base class for TextBoxes like DateTextBox and TimeTextBox that will enforce a specified pattern.
	 */
	return register("d-boilerplate-textbox", [HTMLElement, FormValueWidget], {
		baseClass: "d-boilerplate-textbox",

		template: template,

		// TODO: Remove.  Implied by sections[].
		/**
		 * The pattern to use like a placeHolder and to enforce what and where the user can type.
		 * Letters represent where the user can type and other characters (ex: slash) are treated
		 * as boilerplate.
		 */
		pattern: "mm/dd/yyyy",

		// TODO: maybe subclass needs to define sections[] directly?
		// TODO: start and length not really needed, they are implied.
		// TODO: update this if pattern is changed.
		// TODO: rename to fields[].
		// { boilerplate: "mm", editable: true,
		/**
		 * List of sections of the <input> the user can edit,
		 * for example for the pattern "mm/dd/yyyy" the sections are
		 * [ {start: 0, length: 2}, {start: 3, length: 2}, {start: 5, length: 4} ].
		 * Computed from `this.pattern`.
		 */
		sections: [],

		/**
		 * The index of the section that's currently being edited.
		 */
		currentSectionIndex: -1,

		postRender: function () {
			this.on("focus", this.focusHandler.bind(this), this.focusNode);
			this.on("keydown", this.keydownHandler.bind(this), this.focusNode);
		},

		computeProperties: function (oldVals) {
			if ("pattern" in oldVals) {
				// Initially display the boilerplate text.
				if (!this.value) {
					this.value = this.pattern;
				}

				// Compute list of sections that the user can edit, for example for the pattern
				// "mm/dd/yyyy" the list is [ {start: 0, length: 2}, {start: 3, length: 2}, {start:6, length 4} ].
				var pos = 0;
				this.sections = [];
				this.pattern.match(/[a-zA-Z]+|[^a-zA-Z]+/g).forEach(function (match) {
					if (/[a-zA-Z]+/.test(match)) {
						this.sections.push(new NumberField({
							boilerplate: match,		// aka initial value
							start: pos,             // todo: remove?
							length: match.length             // todo: remove?
						}));
					} else {
						this.sections.push(new Delimiter({
							boilerplate: match,
							start: pos,             // todo: remove?
							length: match.length             // todo: remove?
						}));
					}
					pos += match.length;
				}, this)
			}

			if ("currentSectionIndex" in oldVals && this.currentSectionIndex >= 0) {
				this.sections[this.currentSectionIndex].focusHandler();
			}

		},

		refreshRendering: function (oldVals) {
			if ("value" in oldVals) {
				this.focusNode.value = this.value;
			}

			if (this.currentSectionIndex >= 0 &&
				("currentSectionIndex" in oldVals || "sections" in oldVals || "value" in oldVals)) {
				var currentSection = this.sections[this.currentSectionIndex];
				this.focusNode.setSelectionRange(currentSection.start, currentSection.start + currentSection.length);
			}
		},

		/**
		 * Return the character range containing the specified position.
		 * For example, with the pattern "mm/dd/yyyy", for position 4,
		 * i.e. between the two "d"'s, the section is "dd" which is range [3,5].
		 * To be used to handle clicks by the user on a certain section.
		 */
		getSectionAtPos: function (pos) {
			// TODO: rewrite
			var index = 0;
			while (this.sections[index + 1] && this.sections[index + 1].start <= pos) {
				index++
			}
			return index;
		},

		focusHandler: function () {
			// On focus, select the first input section.  User notifyCurrentValue() to trigger processing
			// even if currentSection was already set to 0.
			this.currentSectionIndex = 0;
			this.notifyCurrentValue("currentSectionIndex");
		},

		keydownHandler: function (evt) {
			// Handle all keystrokes programatically.
			evt.preventDefault();
			var currentSection = this.sections[this.currentSectionIndex];

			// TODO: delete key should restore to boilerplate text.
			// TODO: handle tab and shift-tab between fields and leaving control completely

			// Send keystroke to current field.
			var advance = currentSection.inputHandler(evt.key);

			if (advance) {
				// User has finished typing this field so go to next field, if there is one.
				for (var csn = this.currentSectionIndex + 1; csn < this.sections.length; csn++) {
					if (this.sections[csn].editable ) {
						this.currentSectionIndex = csn;
						break;
					}
				}
			}

			this.value = this.sections.map(function (section) {
				return section.value || section.boilerplate;
			}).join("");
		}

		// TODO: handle when TextBox is already focused and user clicks a different section.
	});
});
