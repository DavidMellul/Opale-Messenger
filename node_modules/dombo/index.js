module.exports = function(selector, context) {
  context = context || document

  var nodes

  if (selector._dombo) {
    nodes = selector
  } else if (selector === window || selector === document || selector.nodeName) {
    nodes = [selector]
  } else {
    nodes = context.querySelectorAll(selector)
  }

  nodes = nodes || []
  nodes = Array.prototype.slice.call(nodes);

  /*
    To handle event listeners, dombo attached its own even listener to the node.
    To do this properly dombo adds some data on the node.

    Node: {
      _domboListeners: {
        eventName: {
          original: function()... // the function given by the user
          internal: function()... // the function used internally by dombo
        }
      },
      ...
    }
  */
  var on = function(event, selector, fOriginal, one) {
    var called = false

    return nodes.forEach(function(node) {
      var fInternal = function(mouseEvent) {
        if (one && called) return

        if (!selector) {
          called = true
          return fOriginal.apply(this, [mouseEvent])
        }

        /*
          Traverses from mouseEvent.srcElement and up to this(where the event handler is attached).
          On each node it checks to see if the node is part of the matched elements.
        */
        var handlerNode = this
        var possibles = this.querySelectorAll(selector)
        var isPossible = function(node) {
          for (var i=0; i<possibles.length; i++) {
            if (possibles[i] === node) return true
          }
          return false
        }
        var next = function(node) {
          if (node === handlerNode) return
          if (isPossible(node)) {
            called = true
            fOriginal.apply(node, [mouseEvent])
          }
          if (!node.parentNode) return
          next(node.parentNode)
        }
        next(mouseEvent.srcElement)
      }

      node._domboListeners = node._domboListeners || {}
      node._domboListeners[event] = node._domboListeners[event] || []
      node._domboListeners[event].push({
        original: fOriginal,
        internal: fInternal
      })
      node.addEventListener(event, fInternal, false)
    })
  }
  nodes.on = function(event, filter, fn) {
    if (!fn) return nodes.on(event, null, filter)
    return on(event, filter, fn)
  }
  nodes.one = function(event, filter, fn) {
    if (!fn) return nodes.one(event, null, filter)
    return on(event, filter, fn, 1)
  }
  nodes.off = function(event, fn) {
    return nodes.forEach(function(node) {
      if (!node._domboListeners) return
      if (!node._domboListeners[event]) return

      node._domboListeners[event] = node._domboListeners[event].filter(function(listener) {
        if (listener.original !== fn) return true
        node.removeEventListener(event, listener.internal)
        return false
      })
    })
  }
  nodes.trigger = function(name, data) {
    return nodes.forEach(function(node) {
      // From http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
      if (document.createEvent) {
        var evt = document.createEvent('HTMLEvents')
        evt.initEvent(name, true, true)
        evt.eventName = name
        node.dispatchEvent(evt)
      } else {
        var evt = document.createEventObject()
        evt.eventType = name
        evt.eventName = name
        node.fireEvent("on" + evt.eventType, evt)
      }
    })
  }
  nodes.hasClass = function(name) {
    var res = false
    nodes.forEach(function(node) {
      if (node.className.indexOf(name) > -1) res = true
    })
    return res
  }
  nodes.addClass = function(name) {
    return nodes.forEach(function(node) {
      if (node.className.indexOf(name) > -1) return
      node.className += ' ' + name
    })
  }
  nodes.removeClass = function(name) {
    return nodes.forEach(function(node) {
      if (node.className.indexOf(name) === -1) return
      node.className = node.className.split(name).join(' ')
    })
  }
  nodes.toggleClass = function(name, state) {
    if (state === true) return nodes.addClass(name)
    if (state === false) return nodes.removeClass(name)
    if (nodes.hasClass(name)) return nodes.removeClass(name)
    return nodes.addClass(name)
  }
  nodes._dombo = true

  return nodes
}
