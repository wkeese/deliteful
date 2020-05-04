import register from "delite/register";
import List from "deliteful/list/List";
import { html } from "lit-html";

export default register("d-custom-nav", [ List ], {
	renderItem: function () {
		return html`
			<div role="row">
				<div role="gridcell" class="d-list-cell" tabindex="-1">
					<div>
						<div tabindex="1">1 tabindex 1</div>
						<div tabindex="3">2 tabindex 3</div>
						<div>3 no tabindex</div>
						<div tabindex="2">4 tabindex 2</div>
						<div tabindex="3">5 tabindex 3</div>
						<div tabindex="0">6 tabindex 0</div>
					</div>
				</div>
			</div>
		`;
	}
});
