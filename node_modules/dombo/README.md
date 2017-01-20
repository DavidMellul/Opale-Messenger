# dombo

A very limited subset of the jQuery methods.

Only includes event handlers (`on`, `off`, `one`, `trigger`) and className manipulation (`hasClass`, `addClass`, `removeClass`, `toggleClass`)

The selector returns a normal array so you can use `forEach`, `map`, `filter`, etc.

```
npm install dombo
```

## Usage

``` js
var $ = require('dombo')

$('.item').forEach(function(elm) {
  console.log(elm)
})
$('.item').on('click', '.delete', function() {
	console.log('Removes item')
	this.remove()
})
$('.delete').trigger('click')
```

## Selector

### `$(selector[, context])`

Returns an array with the matched elements, with the methods in this doc added to it. Returns an empty array if there are no matched elements.

If a `context` is given, the selector is only checked in the descendant nodes of that context.

If the selector is already a previous returned value from dombo, then it is simply returned. This makes sure that `$('.foo') === $($('.foo'))`.

## Methods

If the selector is `document` or `window` it is also just returned, so you can do `$(document)` and `$(window)`.

### `$(selector[, context]).each(fn)`

Iterates over all matched elements

### `$(selector[, context]).on(event, [selector,] fn)`

Adds event handler to all matched elements. If selector is given, then the event handler is only run if selector matches child elements.

### `$(selector[, context]).off(event, fn)`

Removes event handler from all matched elements

### `$(selector[, context]).one(event, [selector,] fn)`

Adds event handler to all matched elements, but guarantees it's not called after the first time the event fires.

### `$(selector[, context]).hasClass(name)`

Returns true if one node of the matched elements has the class

### `$(selector[, context]).addClass(name)`

Adds class to all matched elements

### `$(selector[, context]).removeClass(name)`

Removes class from all matched elements

### `$(selector[, context]).toggleClass(name[, state])`

Adds/removes class on the matched elements depending on whether or not it's already present.

`State` is a boolean, and if it's set, adds/removes classes accordingly.

## Browser support

Unlike jQuery, dombo is not aiming for legacy browser support.

This means that it's only compatible with browsers that supports `querySelectorAll`. This is most newer browsers, and even IE9 has full support for this. Check compatability list here https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll#Browser_compatibility

## License

MIT
