import register from "delite/register";
import List from "deliteful/list/List";
import { html } from "lit-html";

export default register("complex-list", [ List ], {
	renderItem: function (item) {
		return html`
			<div role="row">
				<div role="gridcell" class="d-list-cell" tabindex="-1">${item.title}</div>
				<div role="gridcell" class="d-list-cell complex-cell" tabindex="-1">
					<label for="${item.id}-input1">First input:</label>
					<input id="${item.id}-input1">
					<label for="${item.id}-input2">Second input:</label>
					<input id="${item.id}-input2">
					<span id="${item.id}-button" role="button" tabindex="0">aria button</span>
				</div>
			</div>
		`;
	},

	copyAllItemProps: true
});
