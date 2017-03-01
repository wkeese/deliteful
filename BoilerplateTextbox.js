/** @module deliteful/BoilerplateTextBox */
define([
	"delite/register",
	"delite/Widget"
], function (
	register,
	Widget
) {
	"use strict";

	// TODO: create Field, NumberField, Delimiter classes to represent fields.
	/**
	 * A base class for TextBoxes like DateTextBox and TimeTextBox that will enforce a specified pattern.
	 */
	return register("d-boilerplate-textbox", [HTMLElement, Widget], {
		value: "",

		/**
		 * The pattern to use like a placeHolder and to enforce what and where the user can type.
		 * Letters represent where the user can type and other characters (ex: slash) are treated
		 * as boilerplate.
		 */
		pattern: "mm/dd/yyyy",

		// TODO: maybe subclass needs to define sections[] directly?
		// TODO: start and length not really needed, they are implied.
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
		currentSection: 0,

		/**
		 * Which characters the user is allowed to type.  Others will be ignored.
		 */
		acceptedChars: /[0-9]/,

		/**
		 * Number of characters the user has typed into the current section.
		 */
		charactersTypedIntoCurrentSection: 0,

		postRender: function () {
			this.on("focus", this.focusHandler.bind(this));
			this.on("keydown", this.keydownHandler.bind(this));

			// Helper for directly testing this class.
			// TODO: Extend FormValueWidget and create template
			if (!this.focusNode) {
				this.focusNode = this.appendChild(this.ownerDocument.createElement("input"));
				this.focusNode.id = (this.id || this.widgetId) + "-input";
			}
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
						this.sections.push({
							value: match,
							boilerplate: match,		// aka initial value
							boilerplateAfterSection: "",
							start: pos,
							length: match.length
						});
					} else {
						// Note that this code doesn't handle a pattern that starts with boilerplate, like "$XX.YY".
						this.sections[this.sections.length - 1].boilerplateAfterSection += match;
					}
					pos += match.length;
				}, this)
			}

			if ("currentSection" in oldVals) {
				this.charactersTypedIntoCurrentSection = 0;
			}

		},

		refreshRendering: function (oldVals) {
			if ("value" in oldVals) {
				this.focusNode.value = this.value;
			}

			// TODO: only do this when focused
			if ("currentSection" in oldVals || "sections" in oldVals || "value" in oldVals) {
				var currentSection = this.sections[this.currentSection];
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
			var index = 0;
			while (this.sections[index + 1] && this.sections[index + 1].start <= pos) {
				index++
			}
			return index;
		},

		focusHandler: function () {
			// On focus, select the first input section.  User notifyCurrentValue() to trigger processing
			// even if currentSection was already set to 0.
			this.currentSection = 0;
			this.notifyCurrentValue("currentSection");
		},

		keydownHandler: function (evt) {
			if (!this.acceptedChars.test(evt.key)) {
				return;
			}

			// Handle all keystrokes programatically.
			evt.preventDefault();
			var currentSection = this.sections[this.currentSection];

			// TODO: character handling needs to be customizable because for TimePicker am/pm section
			// handing is different (allowed characters, response after first character, etc.)
			if (this.charactersTypedIntoCurrentSection === 0) {
				// For the first character the user types, replace the boilerplate text (ex: "yyyy")
				// with zeros followed by the character the user typed.
				// TODO: hmm, currentSection.value will be wrong if this.value is changed externally.
				currentSection.value = "0".repeat(currentSection.length - 1) + evt.key;
			} else {
				// Otherwise, slide the other characters over and insert new character at right,
				// for example if the user types "3" then "0002" is changed to "0023".
				currentSection.value = currentSection.value.substr(1) + evt.key;
			}

			this.value = this.sections.map(function (section) {
				return section.value + section.boilerplateAfterSection;
			}).join("");

			this.charactersTypedIntoCurrentSection++;
			if (this.charactersTypedIntoCurrentSection >= this.currentSection.length) {
				// User has finished typing this section so go to next section.
				this.currentSection++;
			}

			// Apparently calling code wants a change event on every keystroke.
			this.emit("change", {
				value: this.value
			});
		}

		// TODO: delete key should restore to boilerplate text.
		// TODO: handle tab and shift-tab between fields and leaving control completely
		// TODO: handle when TextBox is already focused and user clicks a different section.
	});
});
