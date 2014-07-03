---
layout: default
title: deliteful/list/List
---

# deliteful/list/List


The `deliteful/list/List` widget renders a scrollable list of items that are retrieved from a [Store](https://github.com/SitePen/dstore).

Its custom element tag is `d-list`.

By default, the widget creates its own local observable memory store, accessible as the `store` property, but any valid `dstore/Store` implementation can be used instead. 

Items rendererd by the list are standard javascript object. The list delegates the rendering of its items to an _item renderer_ widget.

The [default item renderer implementation](./ItemRenderer.md) renders objects that defines any of the following properties:
* `label`: the label of the item, displayed on the left (or on the right if direction is right to left)
* `righttext`: a text to display on the right (or on the left if direction is right to left)
* `iconclass`: css class to apply to a div before the label in order to display an icon
* `righticonclass`: css class to apply to a div after the right text in order to display an icon

Here is a screenshot of a list that displays items using the default renderer:

![List Example](images/List.png)

Any [custom item renderer](#customRenderers) can be specified  using the `itemRenderer` property of the widget.

The widget also provides the following capabilities:
* List items can be grouped in categories (see [Categorized items](#categories))
* List items can be selectable (see [Selection support](#selection))

##### Table of Contents
[Element Instantiation](#instantiation)  
[Element Configuration](#configuration)  
[Element Styling](#styling)  
[User Interactions](#interactions)  
[Mixins](#mixins)  
[Element Events](#events)  
[Enteprise Use](#enterprise)  

<a name="instantiation"></a>
## Element Instantiation

See [`delite/Widget`](/delite/docs/master/Widget.md) for full details on how instantiation lifecycle is working.

### Declarative Instantiation

```html
<!-- A list of categorized items that uses the default item renderer, -->
<!-- mapping the sales property of items to righttext, and using the -->
<!-- region property as the item category -->
<d-list height="100%" righttextAttr="sales" categoryAttr="region">
	<d-list-store>
		<!-- Add the following items to the list store -->
		{ label: "France", sales: 500, profit: 50, region: "EU" },
		{ label: "Germany", sales: 450, profit: 48, region: "EU" },
		{ label: "UK", sales: 700, profit: 60, region: "EU" },
		{ label: "USA", sales: 2000, profit: 250, region: "America" },
		{ label: "Canada", sales: 600, profit: 30, region: "America" },
		{ label: "Brazil", sales: 450, profit: 30, region: "America" },
		{ label: "China", sales: 500, profit: 40, region: "Asia" },
		{ label: "Japan", sales: 900, profit: 100, region: "Asia" }
  	</d-list-store>
  </d-list>
```
### Programmatic Instantiation

```js
require(["dstore/Memory", "delite/list/List", "dojo/domReady!"], function (Memory, List) {
  // Create a memory store for the list and initialize it
  var dataStore = new Memory({idProperty: "label", data:
    [
      { label: "France", sales: 500, profit: 50, region: "EU" },
      { label: "Germany", sales: 450, profit: 48, region: "EU" },
      { label: "UK", sales: 700, profit: 60, region: "EU" },
      { label: "USA", sales: 2000, profit: 250, region: "America" },
      { label: "Canada", sales: 600, profit: 30, region: "America" },
      { label: "Brazil", sales: 450, profit: 30, region: "America" },
      { label: "China", sales: 500, profit: 40, region: "Asia" },
      { label: "Japan", sales: 900, profit: 100, region: "Asia" }
  ]});
  // A list of categorized items from dataStore, that uses the default item renderer,
  // mapping the sales property of items to righttext and using the region property
  // as the item category.
  var list = new List({store: dataStore, righttextAttr: "sales", categoryAttr: "region"});
  list.style.height = "100%";
  list.placeAt(document.body);
  list.startup();
});
```

<a name="configuration"></a>
## Element Configuration

- [Scroll capabilities](#scroll)
- [Store capabilities](#store)
- [Categorized items](#categories)
- [Selection support](#selection)
- [Custom renderers](#customRenderers)

<a name="scroll"/>
### Scroll capabilities

Note that the list is only scrollable if the size of its content (the rendered items) is longer
than the height of the list widget.

If you do not want the list to be scrollable, you can set its `scrollDirection` property
to `"none"` in order to remove the default scrolling capability.

<a name="store"/>
### Store capabilities

If the store the items are retrieved from is [observable](), the widget will react to addition,
deletion, move and update of the store content and refresh its rendering accordingly.

If you do not specify which store to retrieve the items from, the widget creates a default
observable in-memory store implementation that can be retrieved in the `store` property,
as in the following example:

```js
var list = new List();
var defaultStore = list.store;
```

This default store can be populated programmatically using the `add` method
defined by the [dstore Store API](https://github.com/SitePen/dstore/blob/master/docs/Store.md), and it supports the `before` options to easily
order elements in the list, as in the following example:

```js
var list = new List();
var defaultStore = list.store;
var item1 = {...};
var item2 = {...};
defaultStore.add(item1);
defaultStore.add(item2, {before: item1});
```

_Note that the default store does not support ordering and filtering, so you must use
another store implementation to do this ([Memory store](https://github.com/SitePen/dstore/blob/master/docs/Stores.md#memory), for example)._

When creating a list widget declaratively, it is possible to use JSON markup to add items to
the list store using the `d-list-store` tag, as in the following
example:

```html
<d-list>
	<d-list-store>
		{"label": "First item", "iconclass": "my-icon-class-a"},
		{"label": "Second item", "iconclass": "my-icon-class-b"},
		...,
		{"label": "Last item", "iconclass": "my-icon-class-z"}
	</d-list-store>
</d-list>
```

_Note that items are appended to the store in the order they are declared in the JSON markup._

Because the List widget inherit from [delite/StoreMap](), you can redefine at will the mapping between
your store items and the ones expected by the renderer using mapping attributes and functions, as in the following example:

```js
require([
		"deliteful/list/List",
		"dojo/domReady!"
	], function (List) {
		var list = new List();
		// Map the title property of a store item to
		// the label property supported by the renderer
		list.labelAttr = "title";
		// Map a substring of the title property
		// of a store item to the righttext property
		// supported by the renderer
		list.righttextFunc = function (item, store, value) {
			return item.title.split(" ")[0];
		};
		list.store.add({title: "first item"});
		...
		list.placeAt(document.body);
		list.startup();
});
```

See the [delite/StoreMap]() documentation for more information about all the available mapping options.

If you were not to use the `delite/StoreMap` capabilities but decided to redefine the `itemToRenderItem(item)` method (inherited from [delite/Store]()),
be aware that your custom implementation of the method MUST return items that have the same identity than the corresponding store items, as the List
is relying on it.

Here is an example of redefinition of the `itemToRenderItem(item)` method, using the default store with an `identityAttribute` value set to the default one, `id`:

```js
require(["deliteful/list/List"], function (List) {
		var list = new List();
		list.itemToRenderItem = function () {
			// The list expect an identity for the item so is MUST be copied in the render item.
			return {id: item.id, righttext: item.label};
		}
});
```

Errors encountered when querying the store are reported by the widget through a `"query-error"` event.
It should be listened to in order to react to it in the application, as in the following example:

```js
var list = new List();
list.on("query-error", function (error) {
	// Report the error to the user
	...
});
```

<a name="categories"/>
### Categorized items

![Categorized List Example](images/CategorizedList.png)

The List widget supports categorized items, that are rendered with a category header that separates
each category of items in the list. To enable this feature, use the `categoryAttr` property to
define the name of the item property that holds the category of the item, as in the following
example:

```js
var list = new List();
list.categoryAttribute = "category";
list.store.add({label: "first item", category: "Category A"});
list.store.add({label: "second item", category: "Category A"});
list.store.add({label: "third item", category: "Category B"});
```

An alternative is to set `categoryFunc` to a function that extract the category from the store item,
as in the following example:

```js
var list = new List();
list.categoryFunc = function(item, store) {
	return item.category;
});
list.store.add({label: "first item", category: "Category A"});
list.store.add({label: "second item", category: "Category A"});
list.store.add({label: "third item", category: "Category B"});
```

TODO: ADD A JSFIDDLE SAMPLE ?

As with the rendering of items, the actual rendering of the categories in the list is delegated to a category renderer widget.
The default one is [deliteful/list/CategoryRenderer](CategoryRenderer.md), but a custom category renderer can be specified
using the `categoryRenderer` property of the list (see the [custom renderers](#customRenderers) section for more details).

<a name="selection"/>
### Selection support

![Multiple Selectable Items Example](images/Selectable.png)

The list uses the [delite/Selection]() mixin to provide support for selectable items. By default, items
in the list are not selectable, but you can change this behaviour using the `selectionMode` property
of the widget:

```js
var list = new List();
list.selectionMode = "multiple";
```

When the selection mode is `single`, one single item can be selected in the list at any time.

When the selection mode is `multiple`, more than one item can be selected in the list at any time.

When the selection mode is `none`, the items are not selectable.

<a name="customRenderers"/>
### Custom renderers

TODO: INSERT A SCREENSHOT HERE ?

#### Custom item renderer

The actual rendering of the items in the list is delegated to an item renderer widget.
The default one is [deliteful/list/ItemRenderer](ItemRenderer.md), but a custom item renderer can be specified
using the `itemRenderer` property of the list.

A custom item renderer must extends `deliteful/list/ItemRenderer`. It accesses the item to render in its `item` property.
It must assign to its `renderNode` property the node in which the item is rendered .

If the rendered item have actionable / keyboard navigable nodes, those are set using the `navindex` attribute, that behave simillarily to the standard `tabindex` attribute.

Here are is an example of custom item renderer that illustrate these concepts:

TODO: INSERT A JSFIDDLE SAMPLE HERE

#### Custom category renderer

The actual rendering of the categories in the list is delegated to a category renderer widget.
The default one is [deliteful/list/CategoryRenderer](CategoryRenderer.md), but a custom category renderer can be specified
using the `categoryRenderer` property of the list.

A custom category renderer is similar to a custom item renderer, except that it extends `deliteful/list/CategoryRenderer`.

Here are is an example of custom category renderer:

TODO: INSERT A JSFIDDLE SAMPLE HERE

<a name="styling"></a>
## Element Styling

The List widget comes with two different styling that are applied by setting the `baseClass` property
to one of the following values:

- `"d-list"`: the list is displayed with an edge to edge layout. This is the default `baseClass`;
- `"d-rounded-list"`: the list has rounded corners and both a left and right margin.

### Rendered Item Styling

Items are rendered inside a DIV element with the CSS class `d-list-item`.

When an item has the focus, the style of the cell in which it is rendered can be defined using the css selector `[role="gridcell"]:focus`.

The default item renderer allow futher styling of its content using CSS classes, as described in the [deliteful/list/ItemRenderer styling documentation](./ItemRenderer.md#styling).

### Rendered Category Styling

Categories are rendered inside a DIV element with the CSS class `d-list-category`.

When a category has the focus, the style of the cell in which it is rendered can be defined using the css selector `[role="gridcell"]:focus`.

The default category renderer allow further styling of its content using CSS classes, as described in the [deliteful/list/CategoryRenderer styling documentation](./CategoryRenderer.md#styling).

### Selection Marks Styling

By default, selectable List displays a selection mark before each list item. The CSS can be customized to display the selection mark after each list item, using the following rules:

```css
	[aria-selectable="true"] .d-list-item::before,[aria-multiselectable="true"] .d-list-item::before {
		display: none;
	}
	[aria-selectable="true"] .d-list-item::after,[aria-multiselectable="true"] .d-list-item::after {
		display: block;
	}
```

![Selectable Mark After](images/SelectableMarkAfter.png)

The check mark for selectable items is rendered in a _before_ of _after_ pseudo element that can be customized using the following CSS:

```css
/*================
  Selection mode = "single"
=================*/

/* unselected mark placed BEFORE each list item */
[aria-selectable="true"] .d-list-item::before {
	content: ...
}

/* selected mark placed BEFORE each list item */
[aria-selectable="true"] .d-list-item[aria-selected="true"]::before {
	content: ...
}

/* unselected mark placed AFTER each list item */
[aria-selectable="true"] .d-list-item::after {
	content: ...
}

/* selected mark placed AFTER each list item */
[aria-selectable="true"] .d-list-item[aria-selected="true"]::after {
	content: ...
}

/*================
  Selection mode = "multiple"
=================*/

/* unselected mark placed BEFORE each list item */
[aria-multiselectable="true"] .d-list-item::before {
	content: ...
}

/* selected mark placed BEFORE each list item */
[aria-multiselectable="true"] .d-list-item[aria-selected="true"]::before {
	content: ...
}

/* unselected mark placed AFTER each list item */
[aria-multiselectable="true"] .d-list-item::after {
	content: ...
}

/* selected mark placed AFTER each list item */
[aria-multiselectable="true"] .d-list-item[aria-selected="true"]::after {
	content: ...
}
```
TODO: INSERT JSFIDDLE SAMPLE HERE ?

<a name="interactions"></a>
## User Interactions

### Scroll
The widget uses the browser native scroll to allow the user to scroll its content: all the standard scroll interaction of the platform are supported (including using a mousewheel).

### Selection

When the selection mode is `"single"`, a click or tap on a item (or a press on the Space key
when an item has the focus) select it and de-select any previously selected item.

When the selection mode is `"multiple"`, a click or tap on an item (or a press on the Space key when an item has
the focus) toggle its selected state.

<a name="mixins"></a>
## Mixins

No Mixin is currently provided for this widget.

<a name="events"></a>
## Element Events

### Store query

If the widget fails to query its store to retrieve the items to render, it emits a `query-error` event (see [Store capabilities](#store) for more information).

### Selection

When the current selection changes, a `"selection-change"` event is emitted. Its `oldValue` property
contains the previous selection, and its `newValue` property contains the new selection.

<a name="enterprise"></a>
## Enterprise Use

### Accessibility

The List widget implements a single column grid navigation pattern as defined in the [WAI-ARIA 1.0 Authoring Practices](http://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#grid),
except for the selection / deselection of item, that is performed using the Space key on a focused item (no support for Ctrl+Space,  Shift+Space, Control+A, Shift+Arrow and Shift+F8).

The list items can then be navigated using the UP and DOWN arrow keys. Pressing the DOWN arrow
while the last item has focus will focus the first item. Pressing the UP arrow while the first item
has the focus will focus the next item.

When a List item has the focus, you can press the ENTER or F2 keys to focus its first actionable node (if any), and then use the (Shift+)TAB key to move from one actionable node to the (previous)next.
Pressing the ESC key will end actionable nodes navigation and resume to the previous mode.

Note that Enter and F2 only activate the Actionable Mode when using a custom renderer that render DOM nodes with a ```navindex``` attribute,
as the default renderers do not render any actionable nodes (see [deliteful/list/ItemRenderer](ItemRenderer.md) and [deliteful/list/CategoryRenderer](CategoryRenderer.md) for more information).

Pressing the PAGE UP key will focus the first item of the list, while pressing the PAGE DOWN key will focus
the last one.

You can also search for items by typing their first letter on the keyboard, and the next item element which text
begins with the letters will get the focus.

When the `selectionMode` of a List is different than `"none"`, its `aria-selectable` (for selection mode `"single"`) or `aria-multiselectable` (for selection mode `"multiple"`) attribute is set to `"true"`.
When an item is selected in such a list, its `aria-selected` attribute is set to the value `"true"`.

### Globalization

This widget does not provide any internationalizable bundle. The only strings displayed by the list are coming from the user data through the store from which items are retrieved.

This widget supports both left to right and right to left orientation.

### Security

This widget has no specific security concern. Refer to `delite/Widget` and `delite/StoreMap` documentation for general security advice on this base class and mixin that this widget is using.

### Browser Support

This widget supports all supported browsers without any degrated behavior.
