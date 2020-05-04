import register from "delite/register";
import List from "deliteful/list/List";

export default register("d-book-list", [ List ], {
	renderItem: function (item) {
		return html`
			<div role="row" class="d-list-item">
				<div role="gridcell" class="d-list-cell" tabindex="-1">
					<div tabindex="0">${item.title}</div>
					<div class="d-spacer"></div>
					<div tabindex="0">ISBN: ${item.isbn}</div>
				</div>
			</div>
		`;
	},

	renderCategory: function (item) {
		return html`
			<div role="row" class="d-list-item">
				<div role="columnheader" class="d-list-cell" tabindex="-1">
					<div tabindex="0">${item.category}</div>
					<div class="d-spacer"></div>
					<a tabindex="-1" href="${item.bookstoreUrl}">${item.bookstoreUrl}</a>
				</div>
			</div>
		`;
	},

	categoryAttr: "bookstore",

	bookstoreUrlFunc: function (item) {
		if (item.bookstore === "Amazon") {
			return "http://www.amazon.com";
		} else if (item.bookstore === "FNAC") {
			return "http://www.fnac.fr";
		}
	},

	copyAllItemProps: true,

	source: [
		{title: "Dojo: The Definitive Guide", isbn: "0596516487", bookstore: "Amazon"},
		{title: "Dojo: Using the Dojo JavaScript Library to Build Ajax Applications", isbn: "0132358042", bookstore: "Amazon"},
		{title: "Practical Dojo Projects (Expert's Voice in Web Development)", isbn: "1430210664", bookstore: "Amazon"},
		{title: "The Dojo Toolkit: Visual QuickStart Guide", isbn: "0321605128", bookstore: "FNAC"},
		{title: "Mastering Dojo: JavaScript and Ajax Tools for Great Web Experiences", isbn: "1934356115", bookstore: "FNAC"}
	]
});
