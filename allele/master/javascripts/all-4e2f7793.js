/*!
 * Bootstrap v3.3.4 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */


if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.4
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.4
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.4'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.4
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.4'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.4
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.4'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.4
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.4'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.4
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.4'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.4
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.4'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.4
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.4'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.4
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.4'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.4
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.4'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.4
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.4'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.4
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.4'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $(document.body).height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
/*!
 * Bootstrap v3.3.4 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.4",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.4",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active"));a&&this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.4",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.4",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){b&&3===b.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=c(d),f={relatedTarget:this};e.hasClass("open")&&(e.trigger(b=a.Event("hide.bs.dropdown",f)),b.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger("hidden.bs.dropdown",f)))}))}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.4",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger("shown.bs.dropdown",h)}return!1}},g.prototype.keydown=function(b){if(/(38|40|27|32)/.test(b.which)&&!/input|textarea/i.test(b.target.tagName)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var e=c(d),g=e.hasClass("open");if(!g&&27!=b.which||g&&27==b.which)return 27==b.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find('[role="menu"]'+h+', [role="listbox"]'+h);if(i.length){var j=i.index(b.target);38==b.which&&j>0&&j--,40==b.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="menu"]',g.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="listbox"]',g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.4",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in").attr("aria-hidden",!1),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a('<div class="modal-backdrop '+e+'" />').appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.init("tooltip",a,b)};c.VERSION="3.3.4",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(this.options.viewport.selector||this.options.viewport),this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c&&c.$tip&&c.$tip.is(":visible")?void(c.hoverState="in"):(c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.options.container?a(this.options.container):this.$element.parent(),p=this.getPosition(o);h="bottom"==h&&k.bottom+m>p.bottom?"top":"top"==h&&k.top-m<p.top?"bottom":"right"==h&&k.right+l>p.width?"left":"left"==h&&k.left-l<p.left?"right":h,f.removeClass(n).addClass(h)}var q=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(q,h);var r=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",r).emulateTransitionEnd(c.TRANSITION_DURATION):r()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top=b.top+g,b.left=b.left+h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.width&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type)})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.4",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.4",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.4",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){
var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.4",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=a(document.body).height();"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
!function(n){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.dagreD3=n()}}(function(){var n;return function e(n,t,r){function i(a,u){if(!t[a]){if(!n[a]){var c="function"==typeof require&&require;if(!u&&c)return c(a,!0);if(o)return o(a,!0);var f=new Error("Cannot find module '"+a+"'");throw f.code="MODULE_NOT_FOUND",f}var l=t[a]={exports:{}};n[a][0].call(l.exports,function(e){var t=n[a][1][e];return i(t?t:e)},l,l.exports,e,n,t,r)}return t[a].exports}for(var o="function"==typeof require&&require,a=0;a<r.length;a++)i(r[a]);return i}({1:[function(n,e,t){/**
 * @license
 * Copyright (c) 2012-2013 Chris Pettitt
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
e.exports={graphlib:n("./lib/graphlib"),dagre:n("./lib/dagre"),intersect:n("./lib/intersect"),render:n("./lib/render"),util:n("./lib/util"),version:n("./lib/version")}},{"./lib/dagre":8,"./lib/graphlib":9,"./lib/intersect":10,"./lib/render":25,"./lib/util":27,"./lib/version":28}],2:[function(n,e,t){function r(n,e,t,r){var i=n.append("marker").attr("id",e).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto"),o=i.append("path").attr("d","M 0 0 L 10 5 L 0 10 z").style("stroke-width",1).style("stroke-dasharray","1,0");a.applyStyle(o,t[r+"Style"])}function i(n,e,t,r){var i=n.append("marker").attr("id",e).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto"),o=i.append("path").attr("d","M 0 0 L 10 5 L 0 10 L 4 5 z").style("stroke-width",1).style("stroke-dasharray","1,0");a.applyStyle(o,t[r+"Style"])}function o(n,e,t,r){var i=n.append("marker").attr("id",e).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto"),o=i.append("path").attr("d","M 0 5 L 10 5").style("stroke-width",1).style("stroke-dasharray","1,0");a.applyStyle(o,t[r+"Style"])}var a=n("./util");e.exports={"default":r,normal:r,vee:i,undirected:o}},{"./util":27}],3:[function(n,e,t){function r(n,e){var t=e.nodes().filter(function(n){return i.isSubgraph(e,n)}),r=n.selectAll("g.cluster").data(t,function(n){return n});return r.selectAll("*").remove(),r.enter().append("g").attr("class","cluster").attr("id",function(n){var t=e.node(n);return t.id}).style("opacity",0),i.applyTransition(r,e).style("opacity",1),r.each(function(n){var t=e.node(n),r=d3.select(this),i=r.append("g").attr("class","label");d3.select(this).append("rect"),o(i,t,t.clusterLabelPos)}),r.selectAll("rect").each(function(n){var t=e.node(n),r=d3.select(this);i.applyStyle(r,t.style)}),i.applyTransition(r.exit(),e).style("opacity",0).remove(),r}var i=n("./util"),o=n("./label/add-label");e.exports=r},{"./label/add-label":18,"./util":27}],4:[function(n,e,t){"use strict";function r(n,e){var t=n.selectAll("g.edgeLabel").data(e.edges(),function(n){return a.edgeToId(n)}).classed("update",!0);return t.selectAll("*").remove(),t.enter().append("g").classed("edgeLabel",!0).style("opacity",0),t.each(function(n){var t=e.edge(n),r=o(u.select(this),e.edge(n),0,0).classed("label",!0),a=r.node().getBBox();t.labelId&&r.attr("id",t.labelId),i.has(t,"width")||(t.width=a.width),i.has(t,"height")||(t.height=a.height)}),a.applyTransition(t.exit(),e).style("opacity",0).remove(),t}var i=n("./lodash"),o=n("./label/add-label"),a=n("./util"),u=n("./d3");e.exports=r},{"./d3":7,"./label/add-label":18,"./lodash":21,"./util":27}],5:[function(n,e,t){"use strict";function r(n,e,t){var r=n.selectAll("g.edgePath").data(e.edges(),function(n){return s.edgeToId(n)}).classed("update",!0);return u(r,e),c(r,e),s.applyTransition(r,e).style("opacity",1),r.each(function(n){var t=p.select(this),r=e.edge(n);r.elem=this,r.id&&t.attr("id",r.id),s.applyClass(t,r["class"],(t.classed("update")?"update ":"")+"edgePath")}),r.selectAll("path.path").each(function(n){var t=e.edge(n);t.arrowheadId=f.uniqueId("arrowhead");var r=p.select(this).attr("marker-end",function(){return"url(#"+t.arrowheadId+")"}).style("fill","none");s.applyTransition(r,e).attr("d",function(n){return i(e,n)}),s.applyStyle(r,t.style)}),r.selectAll("defs *").remove(),r.selectAll("defs").each(function(n){var r=e.edge(n),i=t[r.arrowhead];i(p.select(this),r.arrowheadId,r,"arrowhead")}),r}function i(n,e){var t=n.edge(e),r=n.node(e.v),i=n.node(e.w),a=t.points.slice(1,t.points.length-1);return a.unshift(l(r,a[0])),a.push(l(i,a[a.length-1])),o(t,a)}function o(n,e){var t=p.svg.line().x(function(n){return n.x}).y(function(n){return n.y});return f.has(n,"lineInterpolate")&&t.interpolate(n.lineInterpolate),f.has(n,"lineTension")&&t.tension(Number(n.lineTension)),t(e)}function a(n){var e=n.getBBox(),t=n.getTransformToElement(n.ownerSVGElement).translate(e.width/2,e.height/2);return{x:t.e,y:t.f}}function u(n,e){var t=n.enter().append("g").attr("class","edgePath").style("opacity",0);t.append("path").attr("class","path").attr("d",function(n){var t=e.edge(n),r=e.node(n.v).elem,i=f.range(t.points.length).map(function(){return a(r)});return o(t,i)}),t.append("defs")}function c(n,e){var t=n.exit();s.applyTransition(t,e).style("opacity",0).remove(),s.applyTransition(t.select("path.path"),e).attr("d",function(n){var t=e.node(n.v);if(t){var r=f.range(this.pathSegList.length).map(function(){return t});return o({},r)}return p.select(this).attr("d")})}var f=n("./lodash"),l=n("./intersect/intersect-node"),s=n("./util"),p=n("./d3");e.exports=r},{"./d3":7,"./intersect/intersect-node":14,"./lodash":21,"./util":27}],6:[function(n,e,t){"use strict";function r(n,e,t){var r=e.nodes().filter(function(n){return!a.isSubgraph(e,n)}),c=n.selectAll("g.node").data(r,function(n){return n}).classed("update",!0);return c.selectAll("*").remove(),c.enter().append("g").attr("class","node").style("opacity",0),c.each(function(n){var r=e.node(n),c=u.select(this),f=c.append("g").attr("class","label"),l=o(f,r),s=t[r.shape],p=i.pick(l.node().getBBox(),"width","height");r.elem=this,r.id&&c.attr("id",r.id),r.labelId&&f.attr("id",r.labelId),a.applyClass(c,r["class"],(c.classed("update")?"update ":"")+"node"),i.has(r,"width")&&(p.width=r.width),i.has(r,"height")&&(p.height=r.height),p.width+=r.paddingLeft+r.paddingRight,p.height+=r.paddingTop+r.paddingBottom,f.attr("transform","translate("+(r.paddingLeft-r.paddingRight)/2+","+(r.paddingTop-r.paddingBottom)/2+")");var h=s(u.select(this),p,r);a.applyStyle(h,r.style);var d=h.node().getBBox();r.width=d.width,r.height=d.height}),a.applyTransition(c.exit(),e).style("opacity",0).remove(),c}var i=n("./lodash"),o=n("./label/add-label"),a=n("./util"),u=n("./d3");e.exports=r},{"./d3":7,"./label/add-label":18,"./lodash":21,"./util":27}],7:[function(n,e,t){e.exports=window.d3},{}],8:[function(n,e,t){var r;if(n)try{r=n("dagre")}catch(i){}r||(r=window.dagre),e.exports=r},{dagre:29}],9:[function(n,e,t){var r;if(n)try{r=n("graphlib")}catch(i){}r||(r=window.graphlib),e.exports=r},{graphlib:60}],10:[function(n,e,t){e.exports={node:n("./intersect-node"),circle:n("./intersect-circle"),ellipse:n("./intersect-ellipse"),polygon:n("./intersect-polygon"),rect:n("./intersect-rect")}},{"./intersect-circle":11,"./intersect-ellipse":12,"./intersect-node":14,"./intersect-polygon":15,"./intersect-rect":16}],11:[function(n,e,t){function r(n,e,t){return i(n,e,e,t)}var i=n("./intersect-ellipse");e.exports=r},{"./intersect-ellipse":12}],12:[function(n,e,t){function r(n,e,t,r){var i=n.x,o=n.y,a=i-r.x,u=o-r.y,c=Math.sqrt(e*e*u*u+t*t*a*a),f=Math.abs(e*t*a/c);r.x<i&&(f=-f);var l=Math.abs(e*t*u/c);return r.y<o&&(l=-l),{x:i+f,y:o+l}}e.exports=r},{}],13:[function(n,e,t){function r(n,e,t,r){var o,a,u,c,f,l,s,p,h,d,g,v,y,m,b;return o=e.y-n.y,u=n.x-e.x,f=e.x*n.y-n.x*e.y,h=o*t.x+u*t.y+f,d=o*r.x+u*r.y+f,0!==h&&0!==d&&i(h,d)||(a=r.y-t.y,c=t.x-r.x,l=r.x*t.y-t.x*r.y,s=a*n.x+c*n.yy+l,p=a*e.x+c*e.y+l,0!==s&&0!==p&&i(s,p)||(g=o*c-a*u,0===g))?void 0:(v=Math.abs(g/2),y=u*l-c*f,m=0>y?(y-v)/g:(y+v)/g,y=a*f-o*l,b=0>y?(y-v)/g:(y+v)/g,{x:m,y:b})}function i(n,e){return n*e>0}e.exports=r},{}],14:[function(n,e,t){function r(n,e){return n.intersect(e)}e.exports=r},{}],15:[function(n,e,t){function r(n,e,t){var r=n.x,o=n.y,a=[],u=Number.POSITIVE_INFINITY,c=Number.POSITIVE_INFINITY;e.forEach(function(n){u=Math.min(u,n.x),c=Math.min(c,n.y)});for(var f=r-n.width/2-u,l=o-n.height/2-c,s=0;s<e.length;s++){var p=e[s],h=e[s<e.length-1?s+1:0],d=i(n,t,{x:f+p.x,y:l+p.y},{x:f+h.x,y:l+h.y});d&&a.push(d)}return a.length?(a.length>1&&a.sort(function(n,e){var r=n.x-t.x,i=n.y-t.y,o=Math.sqrt(r*r+i*i),a=e.x-t.x,u=e.y-t.y,c=Math.sqrt(a*a+u*u);return c>o?-1:o===c?0:1}),a[0]):(console.log("NO INTERSECTION FOUND, RETURN NODE CENTER",n),n)}var i=n("./intersect-line");e.exports=r},{"./intersect-line":13}],16:[function(n,e,t){function r(n,e){var t,r,i=n.x,o=n.y,a=e.x-i,u=e.y-o,c=n.width/2,f=n.height/2;return Math.abs(u)*c>Math.abs(a)*f?(0>u&&(f=-f),t=0===u?0:f*a/u,r=f):(0>a&&(c=-c),t=c,r=0===a?0:c*u/a),{x:i+t,y:o+r}}e.exports=r},{}],17:[function(n,e,t){function r(n,e){var t=n.append("foreignObject").attr("width","100000"),r=t.append("xhtml:div"),o=e.label;switch(typeof o){case"function":r.insert(o);break;case"object":r.insert(function(){return o});break;default:r.html(o)}i.applyStyle(r,e.labelStyle),r.style("display","inline-block"),r.style("white-space","nowrap");var a,u;return r.each(function(){a=this.clientWidth,u=this.clientHeight}),t.attr("width",a).attr("height",u),t}var i=n("../util");e.exports=r},{"../util":27}],18:[function(n,e,t){function r(n,e,t){var r=e.label,u=n.append("g");"svg"===e.labelType?a(u,e):"string"!=typeof r||"html"===e.labelType?o(u,e):i(u,e);var c=u.node().getBBox();switch(t){case"top":y=-e.height/2;break;case"bottom":y=e.height/2-c.height;break;default:y=-c.height/2}return u.attr("transform","translate("+-c.width/2+","+y+")"),u}var i=n("./add-text-label"),o=n("./add-html-label"),a=n("./add-svg-label");e.exports=r},{"./add-html-label":17,"./add-svg-label":19,"./add-text-label":20}],19:[function(n,e,t){function r(n,e){var t=n;return t.node().appendChild(e.label),i.applyStyle(t,e.labelStyle),t}var i=n("../util");e.exports=r},{"../util":27}],20:[function(n,e,t){function r(n,e){for(var t=n.append("text"),r=i(e.label).split("\n"),a=0;a<r.length;a++)t.append("tspan").attr("xml:space","preserve").attr("dy","1em").attr("x","1").text(r[a]);return o.applyStyle(t,e.labelStyle),t}function i(n){for(var e,t="",r=!1,i=0;i<n.length;++i)if(e=n[i],r){switch(e){case"n":t+="\n";break;default:t+=e}r=!1}else"\\"===e?r=!0:t+=e;return t}var o=n("../util");e.exports=r},{"../util":27}],21:[function(n,e,t){var r;if(n)try{r=n("lodash")}catch(i){}r||(r=window._),e.exports=r},{lodash:81}],22:[function(n,e,t){"use strict";function r(n,e){function t(n){var t=e.node(n);return"translate("+t.x+","+t.y+")"}var r=n.filter(function(){return!o.select(this).classed("update")});r.attr("transform",t),i.applyTransition(n,e).style("opacity",1).attr("transform",t),i.applyTransition(r.selectAll("rect"),e).attr("width",function(n){return e.node(n).width}).attr("height",function(n){return e.node(n).height}).attr("x",function(n){var t=e.node(n);return-t.width/2}).attr("y",function(n){var t=e.node(n);return-t.height/2})}var i=n("./util"),o=n("./d3");e.exports=r},{"./d3":7,"./util":27}],23:[function(n,e,t){"use strict";function r(n,e){function t(n){var t=e.edge(n);return a.has(t,"x")?"translate("+t.x+","+t.y+")":""}var r=n.filter(function(){return!o.select(this).classed("update")});r.attr("transform",t),i.applyTransition(n,e).style("opacity",1).attr("transform",t)}var i=n("./util"),o=n("./d3"),a=n("./lodash");e.exports=r},{"./d3":7,"./lodash":21,"./util":27}],24:[function(n,e,t){"use strict";function r(n,e){function t(n){var t=e.node(n);return"translate("+t.x+","+t.y+")"}var r=n.filter(function(){return!o.select(this).classed("update")});r.attr("transform",t),i.applyTransition(n,e).style("opacity",1).attr("transform",t)}var i=n("./util"),o=n("./d3");e.exports=r},{"./d3":7,"./util":27}],25:[function(n,e,t){function r(){var e=n("./create-nodes"),t=n("./create-clusters"),r=n("./create-edge-labels"),u=n("./create-edge-paths"),f=n("./position-nodes"),l=n("./position-edge-labels"),s=n("./position-clusters"),p=n("./shapes"),h=n("./arrows"),d=function(n,d){i(d);var g=a(n,"output"),v=a(g,"clusters"),y=a(g,"edgePaths"),m=r(a(g,"edgeLabels"),d),b=e(a(g,"nodes"),d,p);c(d),f(b,d),l(m,d),u(y,d,h);var _=t(v,d);s(_,d),o(d)};return d.createNodes=function(n){return arguments.length?(e=n,d):e},d.createClusters=function(n){return arguments.length?(t=n,d):t},d.createEdgeLabels=function(n){return arguments.length?(r=n,d):r},d.createEdgePaths=function(n){return arguments.length?(u=n,d):u},d.shapes=function(n){return arguments.length?(p=n,d):p},d.arrows=function(n){return arguments.length?(h=n,d):h},d}function i(n){n.nodes().forEach(function(e){var t=n.node(e);u.has(t,"label")||n.children(e).length||(t.label=e),u.has(t,"paddingX")&&u.defaults(t,{paddingLeft:t.paddingX,paddingRight:t.paddingX}),u.has(t,"paddingY")&&u.defaults(t,{paddingTop:t.paddingY,paddingBottom:t.paddingY}),u.has(t,"padding")&&u.defaults(t,{paddingLeft:t.padding,paddingRight:t.padding,paddingTop:t.padding,paddingBottom:t.padding}),u.defaults(t,f),u.each(["paddingLeft","paddingRight","paddingTop","paddingBottom"],function(n){t[n]=Number(t[n])}),u.has(t,"width")&&(t._prevWidth=t.width),u.has(t,"height")&&(t._prevHeight=t.height)}),n.edges().forEach(function(e){var t=n.edge(e);u.has(t,"label")||(t.label=""),u.defaults(t,l)})}function o(n){u.each(n.nodes(),function(e){var t=n.node(e);u.has(t,"_prevWidth")?t.width=t._prevWidth:delete t.width,u.has(t,"_prevHeight")?t.height=t._prevHeight:delete t.height,delete t._prevWidth,delete t._prevHeight})}function a(n,e){var t=n.select("g."+e);return t.empty()&&(t=n.append("g").attr("class",e)),t}var u=n("./lodash"),c=n("./dagre").layout;e.exports=r;var f={paddingLeft:10,paddingRight:10,paddingTop:10,paddingBottom:10,rx:0,ry:0,shape:"rect"},l={arrowhead:"normal",lineInterpolate:"linear"}},{"./arrows":2,"./create-clusters":3,"./create-edge-labels":4,"./create-edge-paths":5,"./create-nodes":6,"./dagre":8,"./lodash":21,"./position-clusters":22,"./position-edge-labels":23,"./position-nodes":24,"./shapes":26}],26:[function(n,e,t){"use strict";function r(n,e,t){var r=n.insert("rect",":first-child").attr("rx",t.rx).attr("ry",t.ry).attr("x",-e.width/2).attr("y",-e.height/2).attr("width",e.width).attr("height",e.height);return t.intersect=function(n){return u(t,n)},r}function i(n,e,t){var r=e.width/2,i=e.height/2,o=n.insert("ellipse",":first-child").attr("x",-e.width/2).attr("y",-e.height/2).attr("rx",r).attr("ry",i);return t.intersect=function(n){return c(t,r,i,n)},o}function o(n,e,t){var r=Math.max(e.width,e.height)/2,i=n.insert("circle",":first-child").attr("x",-e.width/2).attr("y",-e.height/2).attr("r",r);return t.intersect=function(n){return f(t,r,n)},i}function a(n,e,t){var r=e.width*Math.SQRT2/2,i=e.height*Math.SQRT2/2,o=[{x:0,y:-i},{x:-r,y:0},{x:0,y:i},{x:r,y:0}],a=n.insert("polygon",":first-child").attr("points",o.map(function(n){return n.x+","+n.y}).join(" "));return t.intersect=function(n){return l(t,o,n)},a}var u=n("./intersect/intersect-rect"),c=n("./intersect/intersect-ellipse"),f=n("./intersect/intersect-circle"),l=n("./intersect/intersect-polygon");e.exports={rect:r,ellipse:i,circle:o,diamond:a}},{"./intersect/intersect-circle":11,"./intersect/intersect-ellipse":12,"./intersect/intersect-polygon":15,"./intersect/intersect-rect":16}],27:[function(n,e,t){function r(n,e){return!!n.children(e).length}function i(n){return o(n.v)+":"+o(n.w)+":"+o(n.name)}function o(n){return n?String(n).replace(l,"\\:"):""}function a(n,e){e&&n.attr("style",e)}function u(n,e,t){e&&n.attr("class",e).attr("class",t+" "+n.attr("class"))}function c(n,e){var t=e.graph();if(f.isPlainObject(t)){var r=t.transition;if(f.isFunction(r))return r(n)}return n}var f=n("./lodash");e.exports={isSubgraph:r,edgeToId:i,applyStyle:a,applyClass:u,applyTransition:c};var l=/:/g},{"./lodash":21}],28:[function(n,e,t){e.exports="0.4.8"},{}],29:[function(n,e,t){e.exports={graphlib:n("./lib/graphlib"),layout:n("./lib/layout"),debug:n("./lib/debug"),util:{time:n("./lib/util").time,notime:n("./lib/util").notime},version:n("./lib/version")}},{"./lib/debug":34,"./lib/graphlib":35,"./lib/layout":37,"./lib/util":57,"./lib/version":58}],30:[function(n,e,t){"use strict";function r(n){function e(n){return function(e){return n.edge(e).weight}}var t="greedy"===n.graph().acyclicer?u(n,e(n)):i(n);a.each(t,function(e){var t=n.edge(e);n.removeEdge(e),t.forwardName=e.name,t.reversed=!0,n.setEdge(e.w,e.v,t,a.uniqueId("rev"))})}function i(n){function e(o){a.has(i,o)||(i[o]=!0,r[o]=!0,a.each(n.outEdges(o),function(n){a.has(r,n.w)?t.push(n):e(n.w)}),delete r[o])}var t=[],r={},i={};return a.each(n.nodes(),e),t}function o(n){a.each(n.edges(),function(e){var t=n.edge(e);if(t.reversed){n.removeEdge(e);var r=t.forwardName;delete t.reversed,delete t.forwardName,n.setEdge(e.w,e.v,t,r)}})}var a=n("./lodash"),u=n("./greedy-fas");e.exports={run:r,undo:o}},{"./greedy-fas":36,"./lodash":38}],31:[function(n,e,t){function r(n){function e(t){var r=n.children(t),a=n.node(t);if(r.length&&o.each(r,e),o.has(a,"minRank")){a.borderLeft=[],a.borderRight=[];for(var u=a.minRank,c=a.maxRank+1;c>u;++u)i(n,"borderLeft","_bl",t,a,u),i(n,"borderRight","_br",t,a,u)}}o.each(n.children(),e)}function i(n,e,t,r,i,o){var u={width:0,height:0,rank:o,borderType:e},c=i[e][o-1],f=a.addDummyNode(n,"border",u,t);i[e][o]=f,n.setParent(f,r),c&&n.setEdge(c,f,{weight:1})}var o=n("./lodash"),a=n("./util");e.exports=r},{"./lodash":38,"./util":57}],32:[function(n,e,t){"use strict";function r(n){var e=n.graph().rankdir.toLowerCase();("lr"===e||"rl"===e)&&o(n)}function i(n){var e=n.graph().rankdir.toLowerCase();("bt"===e||"rl"===e)&&u(n),("lr"===e||"rl"===e)&&(f(n),o(n))}function o(n){s.each(n.nodes(),function(e){a(n.node(e))}),s.each(n.edges(),function(e){a(n.edge(e))})}function a(n){var e=n.width;n.width=n.height,n.height=e}function u(n){s.each(n.nodes(),function(e){c(n.node(e))}),s.each(n.edges(),function(e){var t=n.edge(e);s.each(t.points,c),s.has(t,"y")&&c(t)})}function c(n){n.y=-n.y}function f(n){s.each(n.nodes(),function(e){l(n.node(e))}),s.each(n.edges(),function(e){var t=n.edge(e);s.each(t.points,l),s.has(t,"x")&&l(t)})}function l(n){var e=n.x;n.x=n.y,n.y=e}var s=n("./lodash");e.exports={adjust:r,undo:i}},{"./lodash":38}],33:[function(n,e,t){function r(){var n={};n._next=n._prev=n,this._sentinel=n}function i(n){n._prev._next=n._next,n._next._prev=n._prev,delete n._next,delete n._prev}function o(n,e){return"_next"!==n&&"_prev"!==n?e:void 0}e.exports=r,r.prototype.dequeue=function(){var n=this._sentinel,e=n._prev;return e!==n?(i(e),e):void 0},r.prototype.enqueue=function(n){var e=this._sentinel;n._prev&&n._next&&i(n),n._next=e._next,e._next._prev=n,e._next=n,n._prev=e},r.prototype.toString=function(){for(var n=[],e=this._sentinel,t=e._prev;t!==e;)n.push(JSON.stringify(t,o)),t=t._prev;return"["+n.join(", ")+"]"}},{}],34:[function(n,e,t){function r(n){var e=o.buildLayerMatrix(n),t=new a({compound:!0,multigraph:!0}).setGraph({});return i.each(n.nodes(),function(e){t.setNode(e,{label:e}),t.setParent(e,"layer"+n.node(e).rank)}),i.each(n.edges(),function(n){t.setEdge(n.v,n.w,{},n.name)}),i.each(e,function(n,e){var r="layer"+e;t.setNode(r,{rank:"same"}),i.reduce(n,function(n,e){return t.setEdge(n,e,{style:"invis"}),e})}),t}var i=n("./lodash"),o=n("./util"),a=n("./graphlib").Graph;e.exports={debugOrdering:r}},{"./graphlib":35,"./lodash":38,"./util":57}],35:[function(n,e,t){e.exports=n(9)},{"/Users/cpettitt/projects/dagre-d3/lib/graphlib.js":9,graphlib:60}],36:[function(n,e,t){function r(n,e){if(n.nodeCount()<=1)return[];var t=a(n,e||s),r=i(t.graph,t.buckets,t.zeroIdx);return c.flatten(c.map(r,function(e){return n.outEdges(e.v,e.w)}),!0)}function i(n,e,t){for(var r,i=[],a=e[e.length-1],u=e[0];n.nodeCount();){for(;r=u.dequeue();)o(n,e,t,r);for(;r=a.dequeue();)o(n,e,t,r);if(n.nodeCount())for(var c=e.length-2;c>0;--c)if(r=e[c].dequeue()){i=i.concat(o(n,e,t,r,!0));break}}return i}function o(n,e,t,r,i){var o=i?[]:void 0;return c.each(n.inEdges(r.v),function(r){var a=n.edge(r),c=n.node(r.v);i&&o.push({v:r.v,w:r.w}),c.out-=a,u(e,t,c)}),c.each(n.outEdges(r.v),function(r){var i=n.edge(r),o=r.w,a=n.node(o);a["in"]-=i,u(e,t,a)}),n.removeNode(r.v),o}function a(n,e){var t=new f,r=0,i=0;c.each(n.nodes(),function(n){t.setNode(n,{v:n,"in":0,out:0})}),c.each(n.edges(),function(n){var o=t.edge(n.v,n.w)||0,a=e(n),u=o+a;t.setEdge(n.v,n.w,u),i=Math.max(i,t.node(n.v).out+=a),r=Math.max(r,t.node(n.w)["in"]+=a)});var o=c.range(i+r+3).map(function(){return new l}),a=r+1;return c.each(t.nodes(),function(n){u(o,a,t.node(n))}),{graph:t,buckets:o,zeroIdx:a}}function u(n,e,t){t.out?t["in"]?n[t.out-t["in"]+e].enqueue(t):n[n.length-1].enqueue(t):n[0].enqueue(t)}var c=n("./lodash"),f=n("./graphlib").Graph,l=n("./data/list");e.exports=r;var s=c.constant(1)},{"./data/list":33,"./graphlib":35,"./lodash":38}],37:[function(n,e,t){"use strict";function r(n,e){var t=e&&e.debugTiming?L.time:L.notime;t("layout",function(){var e=t("  buildLayoutGraph",function(){return a(n)});t("  runLayout",function(){i(e,t)}),t("  updateInputGraph",function(){o(n,e)})})}function i(n,e){e("    makeSpaceForEdgeLabels",function(){u(n)}),e("    removeSelfEdges",function(){v(n)}),e("    acyclic",function(){x.run(n)}),e("    nestingGraph.run",function(){I.run(n)}),e("    rank",function(){j(L.asNonCompoundGraph(n))}),e("    injectEdgeLabelProxies",function(){c(n)}),e("    removeEmptyRanks",function(){N(n)}),e("    nestingGraph.cleanup",function(){I.cleanup(n)}),e("    normalizeRanks",function(){E(n)}),e("    assignRankMinMax",function(){f(n)}),e("    removeEdgeLabelProxies",function(){l(n)}),e("    normalize.run",function(){k.run(n)}),e("    parentDummyChains",function(){C(n)}),e("    addBorderSegments",function(){T(n)}),e("    order",function(){R(n)}),e("    insertSelfEdges",function(){y(n)}),e("    adjustCoordinateSystem",function(){O.adjust(n)}),e("    position",function(){S(n)}),e("    positionSelfEdges",function(){m(n)}),e("    removeBorderNodes",function(){g(n)}),e("    normalize.undo",function(){k.undo(n)}),e("    fixupEdgeLabelCoords",function(){h(n)}),e("    undoCoordinateSystem",function(){O.undo(n)}),e("    translateGraph",function(){s(n)}),e("    assignNodeIntersects",function(){p(n)}),e("    reversePoints",function(){d(n)}),e("    acyclic.undo",function(){x.undo(n)})}function o(n,e){w.each(n.nodes(),function(t){var r=n.node(t),i=e.node(t);r&&(r.x=i.x,r.y=i.y,e.children(t).length&&(r.width=i.width,r.height=i.height))}),w.each(n.edges(),function(t){var r=n.edge(t),i=e.edge(t);r.points=i.points,w.has(i,"x")&&(r.x=i.x,r.y=i.y)}),n.graph().width=e.graph().width,n.graph().height=e.graph().height}function a(n){var e=new M({multigraph:!0,compound:!0}),t=_(n.graph());return e.setGraph(w.merge({},D,b(t,B),w.pick(t,F))),w.each(n.nodes(),function(t){var r=_(n.node(t));e.setNode(t,w.defaults(b(r,A),P)),e.setParent(t,n.parent(t))}),w.each(n.edges(),function(t){var r=_(n.edge(t));e.setEdge(t,w.merge({},q,b(r,U),w.pick(r,z)))}),e}function u(n){var e=n.graph();e.ranksep/=2,w.each(n.edges(),function(t){var r=n.edge(t);r.minlen*=2,"c"!==r.labelpos.toLowerCase()&&("TB"===e.rankdir||"BT"===e.rankdir?r.width+=r.labeloffset:r.height+=r.labeloffset)})}function c(n){w.each(n.edges(),function(e){var t=n.edge(e);if(t.width&&t.height){var r=n.node(e.v),i=n.node(e.w),o={rank:(i.rank-r.rank)/2+r.rank,e:e};L.addDummyNode(n,"edge-proxy",o,"_ep")}})}function f(n){var e=0;w.each(n.nodes(),function(t){var r=n.node(t);r.borderTop&&(r.minRank=n.node(r.borderTop).rank,r.maxRank=n.node(r.borderBottom).rank,e=w.max(e,r.maxRank))}),n.graph().maxRank=e}function l(n){w.each(n.nodes(),function(e){var t=n.node(e);"edge-proxy"===t.dummy&&(n.edge(t.e).labelRank=t.rank,n.removeNode(e))})}function s(n){function e(n){var e=n.x,a=n.y,u=n.width,c=n.height;t=Math.min(t,e-u/2),r=Math.max(r,e+u/2),i=Math.min(i,a-c/2),o=Math.max(o,a+c/2)}var t=Number.POSITIVE_INFINITY,r=0,i=Number.POSITIVE_INFINITY,o=0,a=n.graph(),u=a.marginx||0,c=a.marginy||0;w.each(n.nodes(),function(t){e(n.node(t))}),w.each(n.edges(),function(t){var r=n.edge(t);w.has(r,"x")&&e(r)}),t-=u,i-=c,w.each(n.nodes(),function(e){var r=n.node(e);r.x-=t,r.y-=i}),w.each(n.edges(),function(e){var r=n.edge(e);w.each(r.points,function(n){n.x-=t,n.y-=i}),w.has(r,"x")&&(r.x-=t),w.has(r,"y")&&(r.y-=i)}),a.width=r-t+u,a.height=o-i+c}function p(n){w.each(n.edges(),function(e){var t,r,i=n.edge(e),o=n.node(e.v),a=n.node(e.w);i.points?(t=i.points[0],r=i.points[i.points.length-1]):(i.points=[],t=a,r=o),i.points.unshift(L.intersectRect(o,t)),i.points.push(L.intersectRect(a,r))})}function h(n){w.each(n.edges(),function(e){var t=n.edge(e);if(w.has(t,"x"))switch(("l"===t.labelpos||"r"===t.labelpos)&&(t.width-=t.labeloffset),t.labelpos){case"l":t.x-=t.width/2+t.labeloffset;break;case"r":t.x+=t.width/2+t.labeloffset}})}function d(n){w.each(n.edges(),function(e){var t=n.edge(e);t.reversed&&t.points.reverse()})}function g(n){w.each(n.nodes(),function(e){if(n.children(e).length){var t=n.node(e),r=n.node(t.borderTop),i=n.node(t.borderBottom),o=n.node(w.last(t.borderLeft)),a=n.node(w.last(t.borderRight));t.width=Math.abs(a.x-o.x),t.height=Math.abs(i.y-r.y),t.x=o.x+t.width/2,t.y=r.y+t.height/2}}),w.each(n.nodes(),function(e){"border"===n.node(e).dummy&&n.removeNode(e)})}function v(n){w.each(n.edges(),function(e){if(e.v===e.w){var t=n.node(e.v);t.selfEdges||(t.selfEdges=[]),t.selfEdges.push({e:e,label:n.edge(e)}),n.removeEdge(e)}})}function y(n){var e=L.buildLayerMatrix(n);w.each(e,function(e){var t=0;w.each(e,function(e,r){var i=n.node(e);i.order=r+t,w.each(i.selfEdges,function(e){L.addDummyNode(n,"selfedge",{width:e.label.width,height:e.label.height,rank:i.rank,order:r+ ++t,e:e.e,label:e.label},"_se")}),delete i.selfEdges})})}function m(n){w.each(n.nodes(),function(e){var t=n.node(e);if("selfedge"===t.dummy){var r=n.node(t.e.v),i=r.x+r.width/2,o=r.y,a=t.x-i,u=r.height/2;n.setEdge(t.e,t.label),n.removeNode(e),t.label.points=[{x:i+2*a/3,y:o-u},{x:i+5*a/6,y:o-u},{x:i+a,y:o},{x:i+5*a/6,y:o+u},{x:i+2*a/3,y:o+u}],t.label.x=t.x,t.label.y=t.y}})}function b(n,e){return w.mapValues(w.pick(n,e),Number)}function _(n){var e={};return w.each(n,function(n,t){e[t.toLowerCase()]=n}),e}var w=n("./lodash"),x=n("./acyclic"),k=n("./normalize"),j=n("./rank"),E=n("./util").normalizeRanks,C=n("./parent-dummy-chains"),N=n("./util").removeEmptyRanks,I=n("./nesting-graph"),T=n("./add-border-segments"),O=n("./coordinate-system"),R=n("./order"),S=n("./position"),L=n("./util"),M=n("./graphlib").Graph;e.exports=r;var B=["nodesep","edgesep","ranksep","marginx","marginy"],D={ranksep:50,edgesep:20,nodesep:50,rankdir:"tb"},F=["acyclicer","ranker","rankdir","align"],A=["width","height"],P={width:0,height:0},U=["minlen","weight","width","height","labeloffset"],q={minlen:1,weight:1,width:0,height:0,labeloffset:10,labelpos:"r"},z=["labelpos"]},{"./acyclic":30,"./add-border-segments":31,"./coordinate-system":32,"./graphlib":35,"./lodash":38,"./nesting-graph":39,"./normalize":40,"./order":45,"./parent-dummy-chains":50,"./position":52,"./rank":54,"./util":57}],38:[function(n,e,t){arguments[4][21][0].apply(t,arguments)},{"/Users/cpettitt/projects/dagre-d3/lib/lodash.js":21,lodash:59}],39:[function(n,e,t){function r(n){var e=f.addDummyNode(n,"root",{},"_root"),t=o(n),r=c.max(t)-1,u=2*r+1;n.graph().nestingRoot=e,c.each(n.edges(),function(e){n.edge(e).minlen*=u});var l=a(n)+1;c.each(n.children(),function(o){i(n,e,u,l,r,t,o)}),n.graph().nodeRankFactor=u}function i(n,e,t,r,o,a,u){var l=n.children(u);if(!l.length)return void(u!==e&&n.setEdge(e,u,{weight:0,minlen:t}));var s=f.addBorderNode(n,"_bt"),p=f.addBorderNode(n,"_bb"),h=n.node(u);n.setParent(s,u),h.borderTop=s,n.setParent(p,u),h.borderBottom=p,c.each(l,function(c){i(n,e,t,r,o,a,c);var f=n.node(c),l=f.borderTop?f.borderTop:c,h=f.borderBottom?f.borderBottom:c,d=f.borderTop?r:2*r,g=l!==h?1:o-a[u]+1;n.setEdge(s,l,{weight:d,minlen:g,nestingEdge:!0}),n.setEdge(h,p,{weight:d,minlen:g,nestingEdge:!0})}),n.parent(u)||n.setEdge(e,s,{weight:0,minlen:o+a[u]})}function o(n){function e(r,i){var o=n.children(r);o&&o.length&&c.each(o,function(n){e(n,i+1)}),t[r]=i}var t={};return c.each(n.children(),function(n){e(n,1)}),t}function a(n){return c.reduce(n.edges(),function(e,t){return e+n.edge(t).weight},0)}function u(n){var e=n.graph();n.removeNode(e.nestingRoot),delete e.nestingRoot,c.each(n.edges(),function(e){var t=n.edge(e);t.nestingEdge&&n.removeEdge(e)})}var c=n("./lodash"),f=n("./util");e.exports={run:r,cleanup:u}},{"./lodash":38,"./util":57}],40:[function(n,e,t){"use strict";function r(n){n.graph().dummyChains=[],a.each(n.edges(),function(e){i(n,e)})}function i(n,e){var t=e.v,r=n.node(t).rank,i=e.w,o=n.node(i).rank,a=e.name,c=n.edge(e),f=c.labelRank;if(o!==r+1){n.removeEdge(e);var l,s,p;for(p=0,++r;o>r;++p,++r)c.points=[],s={width:0,height:0,edgeLabel:c,edgeObj:e,rank:r},l=u.addDummyNode(n,"edge",s,"_d"),r===f&&(s.width=c.width,s.height=c.height,s.dummy="edge-label",s.labelpos=c.labelpos),n.setEdge(t,l,{weight:c.weight},a),0===p&&n.graph().dummyChains.push(l),t=l;n.setEdge(t,i,{weight:c.weight},a)}}function o(n){a.each(n.graph().dummyChains,function(e){var t,r=n.node(e),i=r.edgeLabel;for(n.setEdge(r.edgeObj,i);r.dummy;)t=n.successors(e)[0],n.removeNode(e),i.points.push({x:r.x,y:r.y}),"edge-label"===r.dummy&&(i.x=r.x,i.y=r.y,i.width=r.width,i.height=r.height),e=t,r=n.node(e)})}var a=n("./lodash"),u=n("./util");e.exports={run:r,undo:o}},{"./lodash":38,"./util":57}],41:[function(n,e,t){function r(n,e,t){var r,o={};i.each(t,function(t){for(var i,a,u=n.parent(t);u;){if(i=n.parent(u),i?(a=o[i],o[i]=u):(a=r,r=u),a&&a!==u)return void e.setEdge(a,u);u=i}})}var i=n("../lodash");e.exports=r},{"../lodash":38}],42:[function(n,e,t){function r(n,e){return i.map(e,function(e){var t=n.inEdges(e);if(t.length){var r=i.reduce(t,function(e,t){var r=n.edge(t),i=n.node(t.v);return{sum:e.sum+r.weight*i.order,weight:e.weight+r.weight}},{sum:0,weight:0});return{v:e,barycenter:r.sum/r.weight,weight:r.weight}}return{v:e}})}var i=n("../lodash");e.exports=r},{"../lodash":38}],43:[function(n,e,t){function r(n,e,t){var r=i(n),u=new a({compound:!0}).setGraph({root:r}).setDefaultNodeLabel(function(e){return n.node(e)});return o.each(n.nodes(),function(i){var a=n.node(i),c=n.parent(i);(a.rank===e||a.minRank<=e&&e<=a.maxRank)&&(u.setNode(i),u.setParent(i,c||r),o.each(n[t](i),function(e){var t=e.v===i?e.w:e.v,r=u.edge(t,i),a=o.isUndefined(r)?0:r.weight;u.setEdge(t,i,{weight:n.edge(e).weight+a})}),o.has(a,"minRank")&&u.setNode(i,{borderLeft:a.borderLeft[e],borderRight:a.borderRight[e]}))}),u}function i(n){for(var e;n.hasNode(e=o.uniqueId("_root")););return e}var o=n("../lodash"),a=n("../graphlib").Graph;e.exports=r},{"../graphlib":35,"../lodash":38}],44:[function(n,e,t){"use strict";function r(n,e){for(var t=0,r=1;r<e.length;++r)t+=i(n,e[r-1],e[r]);return t}function i(n,e,t){for(var r=o.zipObject(t,o.map(t,function(n,e){return e})),i=o.flatten(o.map(e,function(e){return o.chain(n.outEdges(e)).map(function(e){return{pos:r[e.w],weight:n.edge(e).weight}}).sortBy("pos").value()}),!0),a=1;a<t.length;)a<<=1;var u=2*a-1;a-=1;var c=o.map(new Array(u),function(){return 0}),f=0;return o.each(i.forEach(function(n){var e=n.pos+a;c[e]+=n.weight;for(var t=0;e>0;)e%2&&(t+=c[e+1]),e=e-1>>1,c[e]+=n.weight;f+=n.weight*t})),f}var o=n("../lodash");e.exports=r},{"../lodash":38}],45:[function(n,e,t){"use strict";function r(n){var e=d.maxRank(n),t=i(n,u.range(1,e+1),"inEdges"),r=i(n,u.range(e-1,-1,-1),"outEdges"),l=c(n);a(n,l);for(var s,p=Number.POSITIVE_INFINITY,h=0,g=0;4>g;++h,++g){o(h%2?t:r,h%4>=2),l=d.buildLayerMatrix(n);var v=f(n,l);p>v&&(g=0,s=u.cloneDeep(l),p=v)}a(n,s)}function i(n,e,t){return u.map(e,function(e){return s(n,e,t)})}function o(n,e){var t=new h;u.each(n,function(n){var r=n.graph().root,i=l(n,r,t,e);u.each(i.vs,function(e,t){n.node(e).order=t}),p(n,t,i.vs)})}function a(n,e){u.each(e,function(e){u.each(e,function(e,t){n.node(e).order=t})})}var u=n("../lodash"),c=n("./init-order"),f=n("./cross-count"),l=n("./sort-subgraph"),s=n("./build-layer-graph"),p=n("./add-subgraph-constraints"),h=n("../graphlib").Graph,d=n("../util");e.exports=r},{"../graphlib":35,"../lodash":38,"../util":57,"./add-subgraph-constraints":41,"./build-layer-graph":43,"./cross-count":44,"./init-order":46,"./sort-subgraph":48}],46:[function(n,e,t){"use strict";function r(n){function e(r){if(!i.has(t,r)){t[r]=!0;var o=n.node(r);a[o.rank].push(r),i.each(n.successors(r),e)}}var t={},r=i.filter(n.nodes(),function(e){return!n.children(e).length}),o=i.max(i.map(r,function(e){
return n.node(e).rank})),a=i.map(i.range(o+1),function(){return[]}),u=i.sortBy(r,function(e){return n.node(e).rank});return i.each(u,e),a}var i=n("../lodash");e.exports=r},{"../lodash":38}],47:[function(n,e,t){"use strict";function r(n,e){var t={};a.each(n,function(n,e){var r=t[n.v]={indegree:0,"in":[],out:[],vs:[n.v],i:e};a.isUndefined(n.barycenter)||(r.barycenter=n.barycenter,r.weight=n.weight)}),a.each(e.edges(),function(n){var e=t[n.v],r=t[n.w];a.isUndefined(e)||a.isUndefined(r)||(r.indegree++,e.out.push(t[n.w]))});var r=a.filter(t,function(n){return!n.indegree});return i(r)}function i(n){function e(n){return function(e){e.merged||(a.isUndefined(e.barycenter)||a.isUndefined(n.barycenter)||e.barycenter>=n.barycenter)&&o(n,e)}}function t(e){return function(t){t["in"].push(e),0===--t.indegree&&n.push(t)}}for(var r=[];n.length;){var i=n.pop();r.push(i),a.each(i["in"].reverse(),e(i)),a.each(i.out,t(i))}return a.chain(r).filter(function(n){return!n.merged}).map(function(n){return a.pick(n,["vs","i","barycenter","weight"])}).value()}function o(n,e){var t=0,r=0;n.weight&&(t+=n.barycenter*n.weight,r+=n.weight),e.weight&&(t+=e.barycenter*e.weight,r+=e.weight),n.vs=e.vs.concat(n.vs),n.barycenter=t/r,n.weight=r,n.i=Math.min(e.i,n.i),e.merged=!0}var a=n("../lodash");e.exports=r},{"../lodash":38}],48:[function(n,e,t){function r(n,e,t,l){var s=n.children(e),p=n.node(e),h=p?p.borderLeft:void 0,d=p?p.borderRight:void 0,g={};h&&(s=a.filter(s,function(n){return n!==h&&n!==d}));var v=u(n,s);a.each(v,function(e){if(n.children(e.v).length){var i=r(n,e.v,t,l);g[e.v]=i,a.has(i,"barycenter")&&o(e,i)}});var y=c(v,t);i(y,g);var m=f(y,l);if(h&&(m.vs=a.flatten([h,m.vs,d],!0),n.predecessors(h).length)){var b=n.node(n.predecessors(h)[0]),_=n.node(n.predecessors(d)[0]);a.has(m,"barycenter")||(m.barycenter=0,m.weight=0),m.barycenter=(m.barycenter*m.weight+b.order+_.order)/(m.weight+2),m.weight+=2}return m}function i(n,e){a.each(n,function(n){n.vs=a.flatten(n.vs.map(function(n){return e[n]?e[n].vs:n}),!0)})}function o(n,e){a.isUndefined(n.barycenter)?(n.barycenter=e.barycenter,n.weight=e.weight):(n.barycenter=(n.barycenter*n.weight+e.barycenter*e.weight)/(n.weight+e.weight),n.weight+=e.weight)}var a=n("../lodash"),u=n("./barycenter"),c=n("./resolve-conflicts"),f=n("./sort");e.exports=r},{"../lodash":38,"./barycenter":42,"./resolve-conflicts":47,"./sort":49}],49:[function(n,e,t){function r(n,e){var t=u.partition(n,function(n){return a.has(n,"barycenter")}),r=t.lhs,c=a.sortBy(t.rhs,function(n){return-n.i}),f=[],l=0,s=0,p=0;r.sort(o(!!e)),p=i(f,c,p),a.each(r,function(n){p+=n.vs.length,f.push(n.vs),l+=n.barycenter*n.weight,s+=n.weight,p=i(f,c,p)});var h={vs:a.flatten(f,!0)};return s&&(h.barycenter=l/s,h.weight=s),h}function i(n,e,t){for(var r;e.length&&(r=a.last(e)).i<=t;)e.pop(),n.push(r.vs),t++;return t}function o(n){return function(e,t){return e.barycenter<t.barycenter?-1:e.barycenter>t.barycenter?1:n?t.i-e.i:e.i-t.i}}var a=n("../lodash"),u=n("../util");e.exports=r},{"../lodash":38,"../util":57}],50:[function(n,e,t){function r(n){var e=o(n);a.each(n.graph().dummyChains,function(t){for(var r=n.node(t),o=r.edgeObj,a=i(n,e,o.v,o.w),u=a.path,c=a.lca,f=0,l=u[f],s=!0;t!==o.w;){if(r=n.node(t),s){for(;(l=u[f])!==c&&n.node(l).maxRank<r.rank;)f++;l===c&&(s=!1)}if(!s){for(;f<u.length-1&&n.node(l=u[f+1]).minRank<=r.rank;)f++;l=u[f]}n.setParent(t,l),t=n.successors(t)[0]}})}function i(n,e,t,r){var i,o,a=[],u=[],c=Math.min(e[t].low,e[r].low),f=Math.max(e[t].lim,e[r].lim);i=t;do i=n.parent(i),a.push(i);while(i&&(e[i].low>c||f>e[i].lim));for(o=i,i=r;(i=n.parent(i))!==o;)u.push(i);return{path:a.concat(u.reverse()),lca:o}}function o(n){function e(i){var o=r;a.each(n.children(i),e),t[i]={low:o,lim:r++}}var t={},r=0;return a.each(n.children(),e),t}var a=n("./lodash");e.exports=r},{"./lodash":38}],51:[function(n,e,t){"use strict";function r(n,e){function t(e,t){var i=0,u=0,c=e.length,f=y.last(t);return y.each(t,function(e,l){var s=o(n,e),p=s?n.node(s).order:c;(s||e===f)&&(y.each(t.slice(u,l+1),function(e){y.each(n.predecessors(e),function(t){var o=n.node(t),u=o.order;!(i>u||u>p)||o.dummy&&n.node(e).dummy||a(r,t,e)})}),u=l+1,i=p)}),t}var r={};return y.reduce(e,t),r}function i(n,e){function t(e,t,r,o,u){var c;y.each(y.range(t,r),function(t){c=e[t],n.node(c).dummy&&y.each(n.predecessors(c),function(e){var t=n.node(e);t.dummy&&(t.order<o||t.order>u)&&a(i,e,c)})})}function r(e,r){var i,o=-1,a=0;return y.each(r,function(u,c){if("border"===n.node(u).dummy){var f=n.predecessors(u);f.length&&(i=n.node(f[0]).order,t(r,a,c,o,i),a=c,o=i)}t(r,a,r.length,i,e.length)}),r}var i={};return y.reduce(e,r),i}function o(n,e){return n.node(e).dummy?y.find(n.predecessors(e),function(e){return n.node(e).dummy}):void 0}function a(n,e,t){if(e>t){var r=e;e=t,t=r}var i=n[e];i||(n[e]=i={}),i[t]=!0}function u(n,e,t){if(e>t){var r=e;e=t,t=r}return y.has(n[e],t)}function c(n,e,t,r){var i={},o={},a={};return y.each(e,function(n){y.each(n,function(n,e){i[n]=n,o[n]=n,a[n]=e})}),y.each(e,function(n){var e=-1;y.each(n,function(n){var c=r(n);if(c.length){c=y.sortBy(c,function(n){return a[n]});for(var f=(c.length-1)/2,l=Math.floor(f),s=Math.ceil(f);s>=l;++l){var p=c[l];o[n]===n&&e<a[p]&&!u(t,n,p)&&(o[p]=n,o[n]=i[n]=i[p],e=a[p])}}})}),{root:i,align:o}}function f(n,e,t,r,i){function o(n){y.has(f,n)||(f[n]=!0,u[n]=y.reduce(c.inEdges(n),function(n,e){return o(e.v),Math.max(n,u[e.v]+c.edge(e))},0))}function a(e){if(2!==f[e]){f[e]++;var t=n.node(e),r=y.reduce(c.outEdges(e),function(n,e){return a(e.w),Math.min(n,u[e.w]-c.edge(e))},Number.POSITIVE_INFINITY);r!==Number.POSITIVE_INFINITY&&t.borderType!==s&&(u[e]=Math.max(u[e],r))}}var u={},c=l(n,e,t,i),f={};y.each(c.nodes(),o);var s=i?"borderLeft":"borderRight";return y.each(c.nodes(),a),y.each(r,function(n){u[n]=u[t[n]]}),u}function l(n,e,t,r){var i=new m,o=n.graph(),a=g(o.nodesep,o.edgesep,r);return y.each(e,function(e){var r;y.each(e,function(e){var o=t[e];if(i.setNode(o),r){var u=t[r],c=i.edge(u,o);i.setEdge(u,o,Math.max(a(n,e,r),c||0))}r=e})}),i}function s(n,e){return y.min(e,function(e){var t=y.min(e,function(e,t){return e-v(n,t)/2}),r=y.max(e,function(e,t){return e+v(n,t)/2});return r-t})}function p(n,e){var t=y.min(e),r=y.max(e);y.each(["u","d"],function(i){y.each(["l","r"],function(o){var a,u=i+o,c=n[u];c!==e&&(a="l"===o?t-y.min(c):r-y.max(c),a&&(n[u]=y.mapValues(c,function(n){return n+a})))})})}function h(n,e){return y.mapValues(n.ul,function(t,r){if(e)return n[e.toLowerCase()][r];var i=y.sortBy(y.pluck(n,r));return(i[1]+i[2])/2})}function d(n){var e,t=b.buildLayerMatrix(n),o=y.merge(r(n,t),i(n,t)),a={};y.each(["u","d"],function(r){e="u"===r?t:y.values(t).reverse(),y.each(["l","r"],function(t){"r"===t&&(e=y.map(e,function(n){return y.values(n).reverse()}));var i=y.bind("u"===r?n.predecessors:n.successors,n),u=c(n,e,o,i),l=f(n,e,u.root,u.align,"r"===t);"r"===t&&(l=y.mapValues(l,function(n){return-n})),a[r+t]=l})});var u=s(n,a);return p(a,u),h(a,n.graph().align)}function g(n,e,t){return function(r,i,o){var a,u=r.node(i),c=r.node(o),f=0;if(f+=u.width/2,y.has(u,"labelpos"))switch(u.labelpos.toLowerCase()){case"l":a=-u.width/2;break;case"r":a=u.width/2}if(a&&(f+=t?a:-a),a=0,f+=(u.dummy?e:n)/2,f+=(c.dummy?e:n)/2,f+=c.width/2,y.has(c,"labelpos"))switch(c.labelpos.toLowerCase()){case"l":a=c.width/2;break;case"r":a=-c.width/2}return a&&(f+=t?a:-a),a=0,f}}function v(n,e){return n.node(e).width}var y=n("../lodash"),m=n("../graphlib").Graph,b=n("../util");e.exports={positionX:d,findType1Conflicts:r,findType2Conflicts:i,addConflict:a,hasConflict:u,verticalAlignment:c,horizontalCompaction:f,alignCoordinates:p,findSmallestWidthAlignment:s,balance:h}},{"../graphlib":35,"../lodash":38,"../util":57}],52:[function(n,e,t){"use strict";function r(n){n=a.asNonCompoundGraph(n),i(n),o.each(u(n),function(e,t){n.node(t).x=e})}function i(n){var e=a.buildLayerMatrix(n),t=n.graph().ranksep,r=0;o.each(e,function(e){var i=o.max(o.map(e,function(e){return n.node(e).height}));o.each(e,function(e){n.node(e).y=r+i/2}),r+=i+t})}var o=n("../lodash"),a=n("../util"),u=n("./bk").positionX;e.exports=r},{"../lodash":38,"../util":57,"./bk":51}],53:[function(n,e,t){"use strict";function r(n){var e=new c({directed:!1}),t=n.nodes()[0],r=n.nodeCount();e.setNode(t,{});for(var u,l;i(e,n)<r;)u=o(e,n),l=e.hasNode(u.v)?f(n,u):-f(n,u),a(e,n,l);return e}function i(n,e){function t(r){u.each(e.nodeEdges(r),function(i){var o=i.v,a=r===o?i.w:o;n.hasNode(a)||f(e,i)||(n.setNode(a,{}),n.setEdge(r,a,{}),t(a))})}return u.each(n.nodes(),t),n.nodeCount()}function o(n,e){return u.min(e.edges(),function(t){return n.hasNode(t.v)!==n.hasNode(t.w)?f(e,t):void 0})}function a(n,e,t){u.each(n.nodes(),function(n){e.node(n).rank+=t})}var u=n("../lodash"),c=n("../graphlib").Graph,f=n("./util").slack;e.exports=r},{"../graphlib":35,"../lodash":38,"./util":56}],54:[function(n,e,t){"use strict";function r(n){switch(n.graph().ranker){case"network-simplex":o(n);break;case"tight-tree":i(n);break;case"longest-path":l(n);break;default:o(n)}}function i(n){u(n),c(n)}function o(n){f(n)}var a=n("./util"),u=a.longestPath,c=n("./feasible-tree"),f=n("./network-simplex");e.exports=r;var l=u},{"./feasible-tree":53,"./network-simplex":55,"./util":56}],55:[function(n,e,t){"use strict";function r(n){n=w(n),m(n);var e=v(n);u(e),i(e,n);for(var t,r;t=f(e);)r=l(e,n,t),s(e,n,t,r)}function i(n,e){var t=_(n,n.nodes());t=t.slice(0,t.length-1),g.each(t,function(t){o(n,e,t)})}function o(n,e,t){var r=n.node(t),i=r.parent;n.edge(t,i).cutvalue=a(n,e,t)}function a(n,e,t){var r=n.node(t),i=r.parent,o=!0,a=e.edge(t,i),u=0;return a||(o=!1,a=e.edge(i,t)),u=a.weight,g.each(e.nodeEdges(t),function(r){var a=r.v===t,c=a?r.w:r.v;if(c!==i){var f=a===o,l=e.edge(r).weight;if(u+=f?l:-l,h(n,t,c)){var s=n.edge(t,c).cutvalue;u+=f?-s:s}}}),u}function u(n,e){arguments.length<2&&(e=n.nodes()[0]),c(n,{},1,e)}function c(n,e,t,r,i){var o=t,a=n.node(r);return e[r]=!0,g.each(n.neighbors(r),function(i){g.has(e,i)||(t=c(n,e,t,i,r))}),a.low=o,a.lim=t++,i?a.parent=i:delete a.parent,t}function f(n){return g.find(n.edges(),function(e){return n.edge(e).cutvalue<0})}function l(n,e,t){var r=t.v,i=t.w;e.hasEdge(r,i)||(r=t.w,i=t.v);var o=n.node(r),a=n.node(i),u=o,c=!1;o.lim>a.lim&&(u=a,c=!0);var f=g.filter(e.edges(),function(e){return c===d(n,n.node(e.v),u)&&c!==d(n,n.node(e.w),u)});return g.min(f,function(n){return y(e,n)})}function s(n,e,t,r){var o=t.v,a=t.w;n.removeEdge(o,a),n.setEdge(r.v,r.w,{}),u(n),i(n,e),p(n,e)}function p(n,e){var t=g.find(n.nodes(),function(n){return!e.node(n).parent}),r=b(n,t);r=r.slice(1),g.each(r,function(t){var r=n.node(t).parent,i=e.edge(t,r),o=!1;i||(i=e.edge(r,t),o=!0),e.node(t).rank=e.node(r).rank+(o?i.minlen:-i.minlen)})}function h(n,e,t){return n.hasEdge(e,t)}function d(n,e,t){return t.low<=e.lim&&e.lim<=t.lim}var g=n("../lodash"),v=n("./feasible-tree"),y=n("./util").slack,m=n("./util").longestPath,b=n("../graphlib").alg.preorder,_=n("../graphlib").alg.postorder,w=n("../util").simplify;e.exports=r,r.initLowLimValues=u,r.initCutValues=i,r.calcCutValue=a,r.leaveEdge=f,r.enterEdge=l,r.exchangeEdges=s},{"../graphlib":35,"../lodash":38,"../util":57,"./feasible-tree":53,"./util":56}],56:[function(n,e,t){"use strict";function r(n){function e(r){var i=n.node(r);if(o.has(t,r))return i.rank;t[r]=!0;var a=o.min(o.map(n.outEdges(r),function(t){return e(t.w)-n.edge(t).minlen}));return a===Number.POSITIVE_INFINITY&&(a=0),i.rank=a}var t={};o.each(n.sources(),e)}function i(n,e){return n.node(e.w).rank-n.node(e.v).rank-n.edge(e).minlen}var o=n("../lodash");e.exports={longestPath:r,slack:i}},{"../lodash":38}],57:[function(n,e,t){"use strict";function r(n,e,t,r){var i;do i=y.uniqueId(r);while(n.hasNode(i));return t.dummy=e,n.setNode(i,t),i}function i(n){var e=(new m).setGraph(n.graph());return y.each(n.nodes(),function(t){e.setNode(t,n.node(t))}),y.each(n.edges(),function(t){var r=e.edge(t.v,t.w)||{weight:0,minlen:1},i=n.edge(t);e.setEdge(t.v,t.w,{weight:r.weight+i.weight,minlen:Math.max(r.minlen,i.minlen)})}),e}function o(n){var e=new m({multigraph:n.isMultigraph()}).setGraph(n.graph());return y.each(n.nodes(),function(t){n.children(t).length||e.setNode(t,n.node(t))}),y.each(n.edges(),function(t){e.setEdge(t,n.edge(t))}),e}function a(n){var e=y.map(n.nodes(),function(e){var t={};return y.each(n.outEdges(e),function(e){t[e.w]=(t[e.w]||0)+n.edge(e).weight}),t});return y.zipObject(n.nodes(),e)}function u(n){var e=y.map(n.nodes(),function(e){var t={};return y.each(n.inEdges(e),function(e){t[e.v]=(t[e.v]||0)+n.edge(e).weight}),t});return y.zipObject(n.nodes(),e)}function c(n,e){var t=n.x,r=n.y,i=e.x-t,o=e.y-r,a=n.width/2,u=n.height/2;if(!i&&!o)throw new Error("Not possible to find intersection inside of the rectangle");var c,f;return Math.abs(o)*a>Math.abs(i)*u?(0>o&&(u=-u),c=u*i/o,f=u):(0>i&&(a=-a),c=a,f=a*o/i),{x:t+c,y:r+f}}function f(n){var e=y.map(y.range(h(n)+1),function(){return[]});return y.each(n.nodes(),function(t){var r=n.node(t),i=r.rank;y.isUndefined(i)||(e[i][r.order]=t)}),e}function l(n){var e=y.min(y.map(n.nodes(),function(e){return n.node(e).rank}));y.each(n.nodes(),function(t){var r=n.node(t);y.has(r,"rank")&&(r.rank-=e)})}function s(n){var e=y.min(y.map(n.nodes(),function(e){return n.node(e).rank})),t=[];y.each(n.nodes(),function(r){var i=n.node(r).rank-e;y.has(t,i)||(t[i]=[]),t[i].push(r)});var r=0,i=n.graph().nodeRankFactor;y.each(t,function(e,t){y.isUndefined(e)&&t%i!==0?--r:r&&y.each(e,function(e){n.node(e).rank+=r})})}function p(n,e,t,i){var o={width:0,height:0};return arguments.length>=4&&(o.rank=t,o.order=i),r(n,"border",o,e)}function h(n){return y.max(y.map(n.nodes(),function(e){var t=n.node(e).rank;return y.isUndefined(t)?void 0:t}))}function d(n,e){var t={lhs:[],rhs:[]};return y.each(n,function(n){e(n)?t.lhs.push(n):t.rhs.push(n)}),t}function g(n,e){var t=y.now();try{return e()}finally{console.log(n+" time: "+(y.now()-t)+"ms")}}function v(n,e){return e()}var y=n("./lodash"),m=n("./graphlib").Graph;e.exports={addDummyNode:r,simplify:i,asNonCompoundGraph:o,successorWeights:a,predecessorWeights:u,intersectRect:c,buildLayerMatrix:f,normalizeRanks:l,removeEmptyRanks:s,addBorderNode:p,maxRank:h,partition:d,time:g,notime:v}},{"./graphlib":35,"./lodash":38}],58:[function(n,e,t){e.exports="0.7.2"},{}],59:[function(e,t,r){(function(e){(function(){function i(n,e,t){for(var r=(t||0)-1,i=n?n.length:0;++r<i;)if(n[r]===e)return r;return-1}function o(n,e){var t=typeof e;if(n=n.cache,"boolean"==t||null==e)return n[e]?0:-1;"number"!=t&&"string"!=t&&(t="object");var r="number"==t?e:w+e;return n=(n=n[t])&&n[r],"object"==t?n&&i(n,e)>-1?0:-1:n?0:-1}function a(n){var e=this.cache,t=typeof n;if("boolean"==t||null==n)e[n]=!0;else{"number"!=t&&"string"!=t&&(t="object");var r="number"==t?n:w+n,i=e[t]||(e[t]={});"object"==t?(i[r]||(i[r]=[])).push(n):i[r]=!0}}function u(n){return n.charCodeAt(0)}function c(n,e){for(var t=n.criteria,r=e.criteria,i=-1,o=t.length;++i<o;){var a=t[i],u=r[i];if(a!==u){if(a>u||"undefined"==typeof a)return 1;if(u>a||"undefined"==typeof u)return-1}}return n.index-e.index}function f(n){var e=-1,t=n.length,r=n[0],i=n[t/2|0],o=n[t-1];if(r&&"object"==typeof r&&i&&"object"==typeof i&&o&&"object"==typeof o)return!1;var u=p();u["false"]=u["null"]=u["true"]=u.undefined=!1;var c=p();for(c.array=n,c.cache=u,c.push=a;++e<t;)c.push(n[e]);return c}function l(n){return"\\"+Q[n]}function s(){return m.pop()||[]}function p(){return b.pop()||{array:null,cache:null,criteria:null,"false":!1,index:0,"null":!1,number:null,object:null,push:null,string:null,"true":!1,undefined:!1,value:null}}function h(n){n.length=0,m.length<k&&m.push(n)}function d(n){var e=n.cache;e&&d(e),n.array=n.cache=n.criteria=n.object=n.number=n.string=n.value=null,b.length<k&&b.push(n)}function g(n,e,t){e||(e=0),"undefined"==typeof t&&(t=n?n.length:0);for(var r=-1,i=t-e||0,o=Array(0>i?0:i);++r<i;)o[r]=n[e+r];return o}function v(n){function e(n){return n&&"object"==typeof n&&!Jt(n)&&Mt.call(n,"__wrapped__")?n:new t(n)}function t(n,e){this.__chain__=!!e,this.__wrapped__=n}function r(n){function e(){if(r){var n=g(r);Bt.apply(n,arguments)}if(this instanceof e){var o=m(t.prototype),a=t.apply(o,n||arguments);return Rn(a)?a:o}return t.apply(i,n||arguments)}var t=n[0],r=n[2],i=n[4];return Qt(e,n),e}function a(n,e,t,r,i){if(t){var o=t(n);if("undefined"!=typeof o)return o}var u=Rn(n);if(!u)return n;var c=Nt.call(n);if(!Y[c])return n;var f=Ht[c];switch(c){case U:case q:return new f(+n);case W:case V:return new f(n);case G:return o=f(n.source,T.exec(n)),o.lastIndex=n.lastIndex,o}var l=Jt(n);if(e){var p=!r;r||(r=s()),i||(i=s());for(var d=r.length;d--;)if(r[d]==n)return i[d];o=l?f(n.length):{}}else o=l?g(n):or({},n);return l&&(Mt.call(n,"index")&&(o.index=n.index),Mt.call(n,"input")&&(o.input=n.input)),e?(r.push(n),i.push(o),(l?Qn:cr)(n,function(n,u){o[u]=a(n,e,t,r,i)}),p&&(h(r),h(i)),o):o}function m(n,e){return Rn(n)?Ut(n):{}}function b(n,e,t){if("function"!=typeof n)return Je;if("undefined"==typeof e||!("prototype"in n))return n;var r=n.__bindData__;if("undefined"==typeof r&&(Xt.funcNames&&(r=!n.name),r=r||!Xt.funcDecomp,!r)){var i=St.call(n);Xt.funcNames||(r=!O.test(i)),r||(r=M.test(i),Qt(n,r))}if(r===!1||r!==!0&&1&r[1])return n;switch(t){case 1:return function(t){return n.call(e,t)};case 2:return function(t,r){return n.call(e,t,r)};case 3:return function(t,r,i){return n.call(e,t,r,i)};case 4:return function(t,r,i,o){return n.call(e,t,r,i,o)}}return Be(n,e)}function k(n){function e(){var n=c?a:this;if(i){var h=g(i);Bt.apply(h,arguments)}if((o||l)&&(h||(h=g(arguments)),o&&Bt.apply(h,o),l&&h.length<u))return r|=16,k([t,s?r:-4&r,h,null,a,u]);if(h||(h=arguments),f&&(t=n[p]),this instanceof e){n=m(t.prototype);var d=t.apply(n,h);return Rn(d)?d:n}return t.apply(n,h)}var t=n[0],r=n[1],i=n[2],o=n[3],a=n[4],u=n[5],c=1&r,f=2&r,l=4&r,s=8&r,p=t;return Qt(e,n),e}function Q(n,e){var t=-1,r=fn(),a=n?n.length:0,u=a>=x&&r===i,c=[];if(u){var l=f(e);l?(r=o,e=l):u=!1}for(;++t<a;){var s=n[t];r(e,s)<0&&c.push(s)}return u&&d(e),c}function Z(n,e,t,r){for(var i=(r||0)-1,o=n?n.length:0,a=[];++i<o;){var u=n[i];if(u&&"object"==typeof u&&"number"==typeof u.length&&(Jt(u)||hn(u))){e||(u=Z(u,e,t));var c=-1,f=u.length,l=a.length;for(a.length+=f;++c<f;)a[l++]=u[c]}else t||a.push(u)}return a}function nn(n,e,t,r,i,o){if(t){var a=t(n,e);if("undefined"!=typeof a)return!!a}if(n===e)return 0!==n||1/n==1/e;var u=typeof n,c=typeof e;if(!(n!==n||n&&X[u]||e&&X[c]))return!1;if(null==n||null==e)return n===e;var f=Nt.call(n),l=Nt.call(e);if(f==A&&(f=$),l==A&&(l=$),f!=l)return!1;switch(f){case U:case q:return+n==+e;case W:return n!=+n?e!=+e:0==n?1/n==1/e:n==+e;case G:case V:return n==xt(e)}var p=f==P;if(!p){var d=Mt.call(n,"__wrapped__"),g=Mt.call(e,"__wrapped__");if(d||g)return nn(d?n.__wrapped__:n,g?e.__wrapped__:e,t,r,i,o);if(f!=$)return!1;var v=n.constructor,y=e.constructor;if(v!=y&&!(On(v)&&v instanceof v&&On(y)&&y instanceof y)&&"constructor"in n&&"constructor"in e)return!1}var m=!i;i||(i=s()),o||(o=s());for(var b=i.length;b--;)if(i[b]==n)return o[b]==e;var _=0;if(a=!0,i.push(n),o.push(e),p){if(b=n.length,_=e.length,a=_==b,a||r)for(;_--;){var w=b,x=e[_];if(r)for(;w--&&!(a=nn(n[w],x,t,r,i,o)););else if(!(a=nn(n[_],x,t,r,i,o)))break}}else ur(e,function(e,u,c){return Mt.call(c,u)?(_++,a=Mt.call(n,u)&&nn(n[u],e,t,r,i,o)):void 0}),a&&!r&&ur(n,function(n,e,t){return Mt.call(t,e)?a=--_>-1:void 0});return i.pop(),o.pop(),m&&(h(i),h(o)),a}function en(n,e,t,r,i){(Jt(e)?Qn:cr)(e,function(e,o){var a,u,c=e,f=n[o];if(e&&((u=Jt(e))||fr(e))){for(var l=r.length;l--;)if(a=r[l]==e){f=i[l];break}if(!a){var s;t&&(c=t(f,e),(s="undefined"!=typeof c)&&(f=c)),s||(f=u?Jt(f)?f:[]:fr(f)?f:{}),r.push(e),i.push(f),s||en(f,e,t,r,i)}}else t&&(c=t(f,e),"undefined"==typeof c&&(c=e)),"undefined"!=typeof c&&(f=c);n[o]=f})}function tn(n,e){return n+Rt(Kt()*(e-n+1))}function on(n,e,t){var r=-1,a=fn(),u=n?n.length:0,c=[],l=!e&&u>=x&&a===i,p=t||l?s():c;if(l){var g=f(p);a=o,p=g}for(;++r<u;){var v=n[r],y=t?t(v,r,n):v;(e?!r||p[p.length-1]!==y:a(p,y)<0)&&((t||l)&&p.push(y),c.push(v))}return l?(h(p.array),d(p)):t&&h(p),c}function an(n){return function(t,r,i){var o={};r=e.createCallback(r,i,3);var a=-1,u=t?t.length:0;if("number"==typeof u)for(;++a<u;){var c=t[a];n(o,c,r(c,a,t),t)}else cr(t,function(e,t,i){n(o,e,r(e,t,i),i)});return o}}function un(n,e,t,i,o,a){var u=1&e,c=2&e,f=4&e,l=16&e,s=32&e;if(!c&&!On(n))throw new kt;l&&!t.length&&(e&=-17,l=t=!1),s&&!i.length&&(e&=-33,s=i=!1);var p=n&&n.__bindData__;if(p&&p!==!0)return p=g(p),p[2]&&(p[2]=g(p[2])),p[3]&&(p[3]=g(p[3])),!u||1&p[1]||(p[4]=o),!u&&1&p[1]&&(e|=8),!f||4&p[1]||(p[5]=a),l&&Bt.apply(p[2]||(p[2]=[]),t),s&&At.apply(p[3]||(p[3]=[]),i),p[1]|=e,un.apply(null,p);var h=1==e||17===e?r:k;return h([n,e,t,i,o,a])}function cn(n){return er[n]}function fn(){var n=(n=e.indexOf)===me?i:n;return n}function ln(n){return"function"==typeof n&&It.test(n)}function sn(n){var e,t;return n&&Nt.call(n)==$&&(e=n.constructor,!On(e)||e instanceof e)?(ur(n,function(n,e){t=e}),"undefined"==typeof t||Mt.call(n,t)):!1}function pn(n){return tr[n]}function hn(n){return n&&"object"==typeof n&&"number"==typeof n.length&&Nt.call(n)==A||!1}function dn(n,e,t,r){return"boolean"!=typeof e&&null!=e&&(r=t,t=e,e=!1),a(n,e,"function"==typeof t&&b(t,r,1))}function gn(n,e,t){return a(n,!0,"function"==typeof e&&b(e,t,1))}function vn(n,e){var t=m(n);return e?or(t,e):t}function yn(n,t,r){var i;return t=e.createCallback(t,r,3),cr(n,function(n,e,r){return t(n,e,r)?(i=e,!1):void 0}),i}function mn(n,t,r){var i;return t=e.createCallback(t,r,3),_n(n,function(n,e,r){return t(n,e,r)?(i=e,!1):void 0}),i}function bn(n,e,t){var r=[];ur(n,function(n,e){r.push(e,n)});var i=r.length;for(e=b(e,t,3);i--&&e(r[i--],r[i],n)!==!1;);return n}function _n(n,e,t){var r=nr(n),i=r.length;for(e=b(e,t,3);i--;){var o=r[i];if(e(n[o],o,n)===!1)break}return n}function wn(n){var e=[];return ur(n,function(n,t){On(n)&&e.push(t)}),e.sort()}function xn(n,e){return n?Mt.call(n,e):!1}function kn(n){for(var e=-1,t=nr(n),r=t.length,i={};++e<r;){var o=t[e];i[n[o]]=o}return i}function jn(n){return n===!0||n===!1||n&&"object"==typeof n&&Nt.call(n)==U||!1}function En(n){return n&&"object"==typeof n&&Nt.call(n)==q||!1}function Cn(n){return n&&1===n.nodeType||!1}function Nn(n){var e=!0;if(!n)return e;var t=Nt.call(n),r=n.length;return t==P||t==V||t==A||t==$&&"number"==typeof r&&On(n.splice)?!r:(cr(n,function(){return e=!1}),e)}function In(n,e,t,r){return nn(n,e,"function"==typeof t&&b(t,r,2))}function Tn(n){return zt(n)&&!Wt(parseFloat(n))}function On(n){return"function"==typeof n}function Rn(n){return!(!n||!X[typeof n])}function Sn(n){return Mn(n)&&n!=+n}function Ln(n){return null===n}function Mn(n){return"number"==typeof n||n&&"object"==typeof n&&Nt.call(n)==W||!1}function Bn(n){return n&&"object"==typeof n&&Nt.call(n)==G||!1}function Dn(n){return"string"==typeof n||n&&"object"==typeof n&&Nt.call(n)==V||!1}function Fn(n){return"undefined"==typeof n}function An(n,t,r){var i={};return t=e.createCallback(t,r,3),cr(n,function(n,e,r){i[e]=t(n,e,r)}),i}function Pn(n){var e=arguments,t=2;if(!Rn(n))return n;if("number"!=typeof e[2]&&(t=e.length),t>3&&"function"==typeof e[t-2])var r=b(e[--t-1],e[t--],2);else t>2&&"function"==typeof e[t-1]&&(r=e[--t]);for(var i=g(arguments,1,t),o=-1,a=s(),u=s();++o<t;)en(n,i[o],r,a,u);return h(a),h(u),n}function Un(n,t,r){var i={};if("function"!=typeof t){var o=[];ur(n,function(n,e){o.push(e)}),o=Q(o,Z(arguments,!0,!1,1));for(var a=-1,u=o.length;++a<u;){var c=o[a];i[c]=n[c]}}else t=e.createCallback(t,r,3),ur(n,function(n,e,r){t(n,e,r)||(i[e]=n)});return i}function qn(n){for(var e=-1,t=nr(n),r=t.length,i=dt(r);++e<r;){var o=t[e];i[e]=[o,n[o]]}return i}function zn(n,t,r){var i={};if("function"!=typeof t)for(var o=-1,a=Z(arguments,!0,!1,1),u=Rn(n)?a.length:0;++o<u;){var c=a[o];c in n&&(i[c]=n[c])}else t=e.createCallback(t,r,3),ur(n,function(n,e,r){t(n,e,r)&&(i[e]=n)});return i}function Wn(n,t,r,i){var o=Jt(n);if(null==r)if(o)r=[];else{var a=n&&n.constructor,u=a&&a.prototype;r=m(u)}return t&&(t=e.createCallback(t,i,4),(o?Qn:cr)(n,function(n,e,i){return t(r,n,e,i)})),r}function $n(n){for(var e=-1,t=nr(n),r=t.length,i=dt(r);++e<r;)i[e]=n[t[e]];return i}function Gn(n){for(var e=arguments,t=-1,r=Z(e,!0,!1,1),i=e[2]&&e[2][e[1]]===n?1:r.length,o=dt(i);++t<i;)o[t]=n[r[t]];return o}function Vn(n,e,t){var r=-1,i=fn(),o=n?n.length:0,a=!1;return t=(0>t?Gt(0,o+t):t)||0,Jt(n)?a=i(n,e,t)>-1:"number"==typeof o?a=(Dn(n)?n.indexOf(e,t):i(n,e,t))>-1:cr(n,function(n){return++r>=t?!(a=n===e):void 0}),a}function Yn(n,t,r){var i=!0;t=e.createCallback(t,r,3);var o=-1,a=n?n.length:0;if("number"==typeof a)for(;++o<a&&(i=!!t(n[o],o,n)););else cr(n,function(n,e,r){return i=!!t(n,e,r)});return i}function Kn(n,t,r){var i=[];t=e.createCallback(t,r,3);var o=-1,a=n?n.length:0;if("number"==typeof a)for(;++o<a;){var u=n[o];t(u,o,n)&&i.push(u)}else cr(n,function(n,e,r){t(n,e,r)&&i.push(n)});return i}function Hn(n,t,r){t=e.createCallback(t,r,3);var i=-1,o=n?n.length:0;if("number"!=typeof o){var a;return cr(n,function(n,e,r){return t(n,e,r)?(a=n,!1):void 0}),a}for(;++i<o;){var u=n[i];if(t(u,i,n))return u}}function Xn(n,t,r){var i;return t=e.createCallback(t,r,3),Jn(n,function(n,e,r){return t(n,e,r)?(i=n,!1):void 0}),i}function Qn(n,e,t){var r=-1,i=n?n.length:0;if(e=e&&"undefined"==typeof t?e:b(e,t,3),"number"==typeof i)for(;++r<i&&e(n[r],r,n)!==!1;);else cr(n,e);return n}function Jn(n,e,t){var r=n?n.length:0;if(e=e&&"undefined"==typeof t?e:b(e,t,3),"number"==typeof r)for(;r--&&e(n[r],r,n)!==!1;);else{var i=nr(n);r=i.length,cr(n,function(n,t,o){return t=i?i[--r]:--r,e(o[t],t,o)})}return n}function Zn(n,e){var t=g(arguments,2),r=-1,i="function"==typeof e,o=n?n.length:0,a=dt("number"==typeof o?o:0);return Qn(n,function(n){a[++r]=(i?e:n[e]).apply(n,t)}),a}function ne(n,t,r){var i=-1,o=n?n.length:0;if(t=e.createCallback(t,r,3),"number"==typeof o)for(var a=dt(o);++i<o;)a[i]=t(n[i],i,n);else a=[],cr(n,function(n,e,r){a[++i]=t(n,e,r)});return a}function ee(n,t,r){var i=-(1/0),o=i;if("function"!=typeof t&&r&&r[t]===n&&(t=null),null==t&&Jt(n))for(var a=-1,c=n.length;++a<c;){var f=n[a];f>o&&(o=f)}else t=null==t&&Dn(n)?u:e.createCallback(t,r,3),Qn(n,function(n,e,r){var a=t(n,e,r);a>i&&(i=a,o=n)});return o}function te(n,t,r){var i=1/0,o=i;if("function"!=typeof t&&r&&r[t]===n&&(t=null),null==t&&Jt(n))for(var a=-1,c=n.length;++a<c;){var f=n[a];o>f&&(o=f)}else t=null==t&&Dn(n)?u:e.createCallback(t,r,3),Qn(n,function(n,e,r){var a=t(n,e,r);i>a&&(i=a,o=n)});return o}function re(n,t,r,i){if(!n)return r;var o=arguments.length<3;t=e.createCallback(t,i,4);var a=-1,u=n.length;if("number"==typeof u)for(o&&(r=n[++a]);++a<u;)r=t(r,n[a],a,n);else cr(n,function(n,e,i){r=o?(o=!1,n):t(r,n,e,i)});return r}function ie(n,t,r,i){var o=arguments.length<3;return t=e.createCallback(t,i,4),Jn(n,function(n,e,i){r=o?(o=!1,n):t(r,n,e,i)}),r}function oe(n,t,r){return t=e.createCallback(t,r,3),Kn(n,function(n,e,r){return!t(n,e,r)})}function ae(n,e,t){if(n&&"number"!=typeof n.length&&(n=$n(n)),null==e||t)return n?n[tn(0,n.length-1)]:y;var r=ue(n);return r.length=Vt(Gt(0,e),r.length),r}function ue(n){var e=-1,t=n?n.length:0,r=dt("number"==typeof t?t:0);return Qn(n,function(n){var t=tn(0,++e);r[e]=r[t],r[t]=n}),r}function ce(n){var e=n?n.length:0;return"number"==typeof e?e:nr(n).length}function fe(n,t,r){var i;t=e.createCallback(t,r,3);var o=-1,a=n?n.length:0;if("number"==typeof a)for(;++o<a&&!(i=t(n[o],o,n)););else cr(n,function(n,e,r){return!(i=t(n,e,r))});return!!i}function le(n,t,r){var i=-1,o=Jt(t),a=n?n.length:0,u=dt("number"==typeof a?a:0);for(o||(t=e.createCallback(t,r,3)),Qn(n,function(n,e,r){var a=u[++i]=p();o?a.criteria=ne(t,function(e){return n[e]}):(a.criteria=s())[0]=t(n,e,r),a.index=i,a.value=n}),a=u.length,u.sort(c);a--;){var f=u[a];u[a]=f.value,o||h(f.criteria),d(f)}return u}function se(n){return n&&"number"==typeof n.length?g(n):$n(n)}function pe(n){for(var e=-1,t=n?n.length:0,r=[];++e<t;){var i=n[e];i&&r.push(i)}return r}function he(n){return Q(n,Z(arguments,!0,!0,1))}function de(n,t,r){var i=-1,o=n?n.length:0;for(t=e.createCallback(t,r,3);++i<o;)if(t(n[i],i,n))return i;return-1}function ge(n,t,r){var i=n?n.length:0;for(t=e.createCallback(t,r,3);i--;)if(t(n[i],i,n))return i;return-1}function ve(n,t,r){var i=0,o=n?n.length:0;if("number"!=typeof t&&null!=t){var a=-1;for(t=e.createCallback(t,r,3);++a<o&&t(n[a],a,n);)i++}else if(i=t,null==i||r)return n?n[0]:y;return g(n,0,Vt(Gt(0,i),o))}function ye(n,e,t,r){return"boolean"!=typeof e&&null!=e&&(r=t,t="function"!=typeof e&&r&&r[e]===n?null:e,e=!1),null!=t&&(n=ne(n,t,r)),Z(n,e)}function me(n,e,t){if("number"==typeof t){var r=n?n.length:0;t=0>t?Gt(0,r+t):t||0}else if(t){var o=Ne(n,e);return n[o]===e?o:-1}return i(n,e,t)}function be(n,t,r){var i=0,o=n?n.length:0;if("number"!=typeof t&&null!=t){var a=o;for(t=e.createCallback(t,r,3);a--&&t(n[a],a,n);)i++}else i=null==t||r?1:t||i;return g(n,0,Vt(Gt(0,o-i),o))}function _e(){for(var n=[],e=-1,t=arguments.length,r=s(),a=fn(),u=a===i,c=s();++e<t;){var l=arguments[e];(Jt(l)||hn(l))&&(n.push(l),r.push(u&&l.length>=x&&f(e?n[e]:c)))}var p=n[0],g=-1,v=p?p.length:0,y=[];n:for(;++g<v;){var m=r[0];if(l=p[g],(m?o(m,l):a(c,l))<0){for(e=t,(m||c).push(l);--e;)if(m=r[e],(m?o(m,l):a(n[e],l))<0)continue n;y.push(l)}}for(;t--;)m=r[t],m&&d(m);return h(r),h(c),y}function we(n,t,r){var i=0,o=n?n.length:0;if("number"!=typeof t&&null!=t){var a=o;for(t=e.createCallback(t,r,3);a--&&t(n[a],a,n);)i++}else if(i=t,null==i||r)return n?n[o-1]:y;return g(n,Gt(0,o-i))}function xe(n,e,t){var r=n?n.length:0;for("number"==typeof t&&(r=(0>t?Gt(0,r+t):Vt(t,r-1))+1);r--;)if(n[r]===e)return r;return-1}function ke(n){for(var e=arguments,t=0,r=e.length,i=n?n.length:0;++t<r;)for(var o=-1,a=e[t];++o<i;)n[o]===a&&(Ft.call(n,o--,1),i--);return n}function je(n,e,t){n=+n||0,t="number"==typeof t?t:+t||1,null==e&&(e=n,n=0);for(var r=-1,i=Gt(0,Tt((e-n)/(t||1))),o=dt(i);++r<i;)o[r]=n,n+=t;return o}function Ee(n,t,r){var i=-1,o=n?n.length:0,a=[];for(t=e.createCallback(t,r,3);++i<o;){var u=n[i];t(u,i,n)&&(a.push(u),Ft.call(n,i--,1),o--)}return a}function Ce(n,t,r){if("number"!=typeof t&&null!=t){var i=0,o=-1,a=n?n.length:0;for(t=e.createCallback(t,r,3);++o<a&&t(n[o],o,n);)i++}else i=null==t||r?1:Gt(0,t);return g(n,i)}function Ne(n,t,r,i){var o=0,a=n?n.length:o;for(r=r?e.createCallback(r,i,1):Je,t=r(t);a>o;){var u=o+a>>>1;r(n[u])<t?o=u+1:a=u}return o}function Ie(){return on(Z(arguments,!0,!0))}function Te(n,t,r,i){return"boolean"!=typeof t&&null!=t&&(i=r,r="function"!=typeof t&&i&&i[t]===n?null:t,t=!1),null!=r&&(r=e.createCallback(r,i,3)),on(n,t,r)}function Oe(n){return Q(n,g(arguments,1))}function Re(){for(var n=-1,e=arguments.length;++n<e;){var t=arguments[n];if(Jt(t)||hn(t))var r=r?on(Q(r,t).concat(Q(t,r))):t}return r||[]}function Se(){for(var n=arguments.length>1?arguments:arguments[0],e=-1,t=n?ee(hr(n,"length")):0,r=dt(0>t?0:t);++e<t;)r[e]=hr(n,e);return r}function Le(n,e){var t=-1,r=n?n.length:0,i={};for(e||!r||Jt(n[0])||(e=[]);++t<r;){var o=n[t];e?i[o]=e[t]:o&&(i[o[0]]=o[1])}return i}function Me(n,e){if(!On(e))throw new kt;return function(){return--n<1?e.apply(this,arguments):void 0}}function Be(n,e){return arguments.length>2?un(n,17,g(arguments,2),null,e):un(n,1,null,null,e)}function De(n){for(var e=arguments.length>1?Z(arguments,!0,!1,1):wn(n),t=-1,r=e.length;++t<r;){var i=e[t];n[i]=un(n[i],1,null,null,n)}return n}function Fe(n,e){return arguments.length>2?un(e,19,g(arguments,2),null,n):un(e,3,null,null,n)}function Ae(){for(var n=arguments,e=n.length;e--;)if(!On(n[e]))throw new kt;return function(){for(var e=arguments,t=n.length;t--;)e=[n[t].apply(this,e)];return e[0]}}function Pe(n,e){return e="number"==typeof e?e:+e||n.length,un(n,4,null,null,null,e)}function Ue(n,e,t){var r,i,o,a,u,c,f,l=0,s=!1,p=!0;if(!On(n))throw new kt;if(e=Gt(0,e)||0,t===!0){var h=!0;p=!1}else Rn(t)&&(h=t.leading,s="maxWait"in t&&(Gt(e,t.maxWait)||0),p="trailing"in t?t.trailing:p);var d=function(){var t=e-(gr()-a);if(0>=t){i&&Ot(i);var s=f;i=c=f=y,s&&(l=gr(),o=n.apply(u,r),c||i||(r=u=null))}else c=Dt(d,t)},g=function(){c&&Ot(c),i=c=f=y,
(p||s!==e)&&(l=gr(),o=n.apply(u,r),c||i||(r=u=null))};return function(){if(r=arguments,a=gr(),u=this,f=p&&(c||!h),s===!1)var t=h&&!c;else{i||h||(l=a);var v=s-(a-l),y=0>=v;y?(i&&(i=Ot(i)),l=a,o=n.apply(u,r)):i||(i=Dt(g,v))}return y&&c?c=Ot(c):c||e===s||(c=Dt(d,e)),t&&(y=!0,o=n.apply(u,r)),!y||c||i||(r=u=null),o}}function qe(n){if(!On(n))throw new kt;var e=g(arguments,1);return Dt(function(){n.apply(y,e)},1)}function ze(n,e){if(!On(n))throw new kt;var t=g(arguments,2);return Dt(function(){n.apply(y,t)},e)}function We(n,e){if(!On(n))throw new kt;var t=function(){var r=t.cache,i=e?e.apply(this,arguments):w+arguments[0];return Mt.call(r,i)?r[i]:r[i]=n.apply(this,arguments)};return t.cache={},t}function $e(n){var e,t;if(!On(n))throw new kt;return function(){return e?t:(e=!0,t=n.apply(this,arguments),n=null,t)}}function Ge(n){return un(n,16,g(arguments,1))}function Ve(n){return un(n,32,null,g(arguments,1))}function Ye(n,e,t){var r=!0,i=!0;if(!On(n))throw new kt;return t===!1?r=!1:Rn(t)&&(r="leading"in t?t.leading:r,i="trailing"in t?t.trailing:i),K.leading=r,K.maxWait=e,K.trailing=i,Ue(n,e,K)}function Ke(n,e){return un(e,16,[n])}function He(n){return function(){return n}}function Xe(n,e,t){var r=typeof n;if(null==n||"function"==r)return b(n,e,t);if("object"!=r)return tt(n);var i=nr(n),o=i[0],a=n[o];return 1!=i.length||a!==a||Rn(a)?function(e){for(var t=i.length,r=!1;t--&&(r=nn(e[i[t]],n[i[t]],null,!0)););return r}:function(n){var e=n[o];return a===e&&(0!==a||1/a==1/e)}}function Qe(n){return null==n?"":xt(n).replace(ir,cn)}function Je(n){return n}function Ze(n,r,i){var o=!0,a=r&&wn(r);r&&(i||a.length)||(null==i&&(i=r),u=t,r=n,n=e,a=wn(r)),i===!1?o=!1:Rn(i)&&"chain"in i&&(o=i.chain);var u=n,c=On(u);Qn(a,function(e){var t=n[e]=r[e];c&&(u.prototype[e]=function(){var e=this.__chain__,r=this.__wrapped__,i=[r];Bt.apply(i,arguments);var a=t.apply(n,i);if(o||e){if(r===a&&Rn(a))return this;a=new u(a),a.__chain__=e}return a})})}function nt(){return n._=Ct,this}function et(){}function tt(n){return function(e){return e[n]}}function rt(n,e,t){var r=null==n,i=null==e;if(null==t&&("boolean"==typeof n&&i?(t=n,n=1):i||"boolean"!=typeof e||(t=e,i=!0)),r&&i&&(e=1),n=+n||0,i?(e=n,n=0):e=+e||0,t||n%1||e%1){var o=Kt();return Vt(n+o*(e-n+parseFloat("1e-"+((o+"").length-1))),e)}return tn(n,e)}function it(n,e){if(n){var t=n[e];return On(t)?n[e]():t}}function ot(n,t,r){var i=e.templateSettings;n=xt(n||""),r=ar({},r,i);var o,a=ar({},r.imports,i.imports),u=nr(a),c=$n(a),f=0,s=r.interpolate||L,p="__p += '",h=wt((r.escape||L).source+"|"+s.source+"|"+(s===R?I:L).source+"|"+(r.evaluate||L).source+"|$","g");n.replace(h,function(e,t,r,i,a,u){return r||(r=i),p+=n.slice(f,u).replace(B,l),t&&(p+="' +\n__e("+t+") +\n'"),a&&(o=!0,p+="';\n"+a+";\n__p += '"),r&&(p+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),f=u+e.length,e}),p+="';\n";var d=r.variable,g=d;g||(d="obj",p="with ("+d+") {\n"+p+"\n}\n"),p=(o?p.replace(E,""):p).replace(C,"$1").replace(N,"$1;"),p="function("+d+") {\n"+(g?"":d+" || ("+d+" = {});\n")+"var __t, __p = '', __e = _.escape"+(o?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var v="\n/*\n//# sourceURL="+(r.sourceURL||"/lodash/template/source["+F++ +"]")+"\n*/";try{var m=yt(u,"return "+p+v).apply(y,c)}catch(b){throw b.source=p,b}return t?m(t):(m.source=p,m)}function at(n,e,t){n=(n=+n)>-1?n:0;var r=-1,i=dt(n);for(e=b(e,t,1);++r<n;)i[r]=e(r);return i}function ut(n){return null==n?"":xt(n).replace(rr,pn)}function ct(n){var e=++_;return xt(null==n?"":n)+e}function ft(n){return n=new t(n),n.__chain__=!0,n}function lt(n,e){return e(n),n}function st(){return this.__chain__=!0,this}function pt(){return xt(this.__wrapped__)}function ht(){return this.__wrapped__}n=n?rn.defaults(J.Object(),n,rn.pick(J,D)):J;var dt=n.Array,gt=n.Boolean,vt=n.Date,yt=n.Function,mt=n.Math,bt=n.Number,_t=n.Object,wt=n.RegExp,xt=n.String,kt=n.TypeError,jt=[],Et=_t.prototype,Ct=n._,Nt=Et.toString,It=wt("^"+xt(Nt).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$"),Tt=mt.ceil,Ot=n.clearTimeout,Rt=mt.floor,St=yt.prototype.toString,Lt=ln(Lt=_t.getPrototypeOf)&&Lt,Mt=Et.hasOwnProperty,Bt=jt.push,Dt=n.setTimeout,Ft=jt.splice,At=jt.unshift,Pt=function(){try{var n={},e=ln(e=_t.defineProperty)&&e,t=e(n,n,n)&&e}catch(r){}return t}(),Ut=ln(Ut=_t.create)&&Ut,qt=ln(qt=dt.isArray)&&qt,zt=n.isFinite,Wt=n.isNaN,$t=ln($t=_t.keys)&&$t,Gt=mt.max,Vt=mt.min,Yt=n.parseInt,Kt=mt.random,Ht={};Ht[P]=dt,Ht[U]=gt,Ht[q]=vt,Ht[z]=yt,Ht[$]=_t,Ht[W]=bt,Ht[G]=wt,Ht[V]=xt,t.prototype=e.prototype;var Xt=e.support={};Xt.funcDecomp=!ln(n.WinRTError)&&M.test(v),Xt.funcNames="string"==typeof yt.name,e.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:R,variable:"",imports:{_:e}},Ut||(m=function(){function e(){}return function(t){if(Rn(t)){e.prototype=t;var r=new e;e.prototype=null}return r||n.Object()}}());var Qt=Pt?function(n,e){H.value=e,Pt(n,"__bindData__",H),H.value=null}:et,Jt=qt||function(n){return n&&"object"==typeof n&&"number"==typeof n.length&&Nt.call(n)==P||!1},Zt=function(n){var e,t=n,r=[];if(!t)return r;if(!X[typeof n])return r;for(e in t)Mt.call(t,e)&&r.push(e);return r},nr=$t?function(n){return Rn(n)?$t(n):[]}:Zt,er={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},tr=kn(er),rr=wt("("+nr(tr).join("|")+")","g"),ir=wt("["+nr(er).join("")+"]","g"),or=function(n,e,t){var r,i=n,o=i;if(!i)return o;var a=arguments,u=0,c="number"==typeof t?2:a.length;if(c>3&&"function"==typeof a[c-2])var f=b(a[--c-1],a[c--],2);else c>2&&"function"==typeof a[c-1]&&(f=a[--c]);for(;++u<c;)if(i=a[u],i&&X[typeof i])for(var l=-1,s=X[typeof i]&&nr(i),p=s?s.length:0;++l<p;)r=s[l],o[r]=f?f(o[r],i[r]):i[r];return o},ar=function(n,e,t){var r,i=n,o=i;if(!i)return o;for(var a=arguments,u=0,c="number"==typeof t?2:a.length;++u<c;)if(i=a[u],i&&X[typeof i])for(var f=-1,l=X[typeof i]&&nr(i),s=l?l.length:0;++f<s;)r=l[f],"undefined"==typeof o[r]&&(o[r]=i[r]);return o},ur=function(n,e,t){var r,i=n,o=i;if(!i)return o;if(!X[typeof i])return o;e=e&&"undefined"==typeof t?e:b(e,t,3);for(r in i)if(e(i[r],r,n)===!1)return o;return o},cr=function(n,e,t){var r,i=n,o=i;if(!i)return o;if(!X[typeof i])return o;e=e&&"undefined"==typeof t?e:b(e,t,3);for(var a=-1,u=X[typeof i]&&nr(i),c=u?u.length:0;++a<c;)if(r=u[a],e(i[r],r,n)===!1)return o;return o},fr=Lt?function(n){if(!n||Nt.call(n)!=$)return!1;var e=n.valueOf,t=ln(e)&&(t=Lt(e))&&Lt(t);return t?n==t||Lt(n)==t:sn(n)}:sn,lr=an(function(n,e,t){Mt.call(n,t)?n[t]++:n[t]=1}),sr=an(function(n,e,t){(Mt.call(n,t)?n[t]:n[t]=[]).push(e)}),pr=an(function(n,e,t){n[t]=e}),hr=ne,dr=Kn,gr=ln(gr=vt.now)&&gr||function(){return(new vt).getTime()},vr=8==Yt(j+"08")?Yt:function(n,e){return Yt(Dn(n)?n.replace(S,""):n,e||0)};return e.after=Me,e.assign=or,e.at=Gn,e.bind=Be,e.bindAll=De,e.bindKey=Fe,e.chain=ft,e.compact=pe,e.compose=Ae,e.constant=He,e.countBy=lr,e.create=vn,e.createCallback=Xe,e.curry=Pe,e.debounce=Ue,e.defaults=ar,e.defer=qe,e.delay=ze,e.difference=he,e.filter=Kn,e.flatten=ye,e.forEach=Qn,e.forEachRight=Jn,e.forIn=ur,e.forInRight=bn,e.forOwn=cr,e.forOwnRight=_n,e.functions=wn,e.groupBy=sr,e.indexBy=pr,e.initial=be,e.intersection=_e,e.invert=kn,e.invoke=Zn,e.keys=nr,e.map=ne,e.mapValues=An,e.max=ee,e.memoize=We,e.merge=Pn,e.min=te,e.omit=Un,e.once=$e,e.pairs=qn,e.partial=Ge,e.partialRight=Ve,e.pick=zn,e.pluck=hr,e.property=tt,e.pull=ke,e.range=je,e.reject=oe,e.remove=Ee,e.rest=Ce,e.shuffle=ue,e.sortBy=le,e.tap=lt,e.throttle=Ye,e.times=at,e.toArray=se,e.transform=Wn,e.union=Ie,e.uniq=Te,e.values=$n,e.where=dr,e.without=Oe,e.wrap=Ke,e.xor=Re,e.zip=Se,e.zipObject=Le,e.collect=ne,e.drop=Ce,e.each=Qn,e.eachRight=Jn,e.extend=or,e.methods=wn,e.object=Le,e.select=Kn,e.tail=Ce,e.unique=Te,e.unzip=Se,Ze(e),e.clone=dn,e.cloneDeep=gn,e.contains=Vn,e.escape=Qe,e.every=Yn,e.find=Hn,e.findIndex=de,e.findKey=yn,e.findLast=Xn,e.findLastIndex=ge,e.findLastKey=mn,e.has=xn,e.identity=Je,e.indexOf=me,e.isArguments=hn,e.isArray=Jt,e.isBoolean=jn,e.isDate=En,e.isElement=Cn,e.isEmpty=Nn,e.isEqual=In,e.isFinite=Tn,e.isFunction=On,e.isNaN=Sn,e.isNull=Ln,e.isNumber=Mn,e.isObject=Rn,e.isPlainObject=fr,e.isRegExp=Bn,e.isString=Dn,e.isUndefined=Fn,e.lastIndexOf=xe,e.mixin=Ze,e.noConflict=nt,e.noop=et,e.now=gr,e.parseInt=vr,e.random=rt,e.reduce=re,e.reduceRight=ie,e.result=it,e.runInContext=v,e.size=ce,e.some=fe,e.sortedIndex=Ne,e.template=ot,e.unescape=ut,e.uniqueId=ct,e.all=Yn,e.any=fe,e.detect=Hn,e.findWhere=Hn,e.foldl=re,e.foldr=ie,e.include=Vn,e.inject=re,Ze(function(){var n={};return cr(e,function(t,r){e.prototype[r]||(n[r]=t)}),n}(),!1),e.first=ve,e.last=we,e.sample=ae,e.take=ve,e.head=ve,cr(e,function(n,r){var i="sample"!==r;e.prototype[r]||(e.prototype[r]=function(e,r){var o=this.__chain__,a=n(this.__wrapped__,e,r);return o||null!=e&&(!r||i&&"function"==typeof e)?new t(a,o):a})}),e.VERSION="2.4.2",e.prototype.chain=st,e.prototype.toString=pt,e.prototype.value=ht,e.prototype.valueOf=ht,Qn(["join","pop","shift"],function(n){var r=jt[n];e.prototype[n]=function(){var n=this.__chain__,e=r.apply(this.__wrapped__,arguments);return n?new t(e,n):e}}),Qn(["push","reverse","sort","unshift"],function(n){var t=jt[n];e.prototype[n]=function(){return t.apply(this.__wrapped__,arguments),this}}),Qn(["concat","slice","splice"],function(n){var r=jt[n];e.prototype[n]=function(){return new t(r.apply(this.__wrapped__,arguments),this.__chain__)}}),e}var y,m=[],b=[],_=0,w=+new Date+"",x=75,k=40,j=" 	\f \ufeff\n\r\u2028\u2029 ᠎             　",E=/\b__p \+= '';/g,C=/\b(__p \+=) '' \+/g,N=/(__e\(.*?\)|\b__t\)) \+\n'';/g,I=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,T=/\w*$/,O=/^\s*function[ \n\r\t]+\w/,R=/<%=([\s\S]+?)%>/g,S=RegExp("^["+j+"]*0+(?=.$)"),L=/($^)/,M=/\bthis\b/,B=/['\n\r\t\u2028\u2029\\]/g,D=["Array","Boolean","Date","Function","Math","Number","Object","RegExp","String","_","attachEvent","clearTimeout","isFinite","isNaN","parseInt","setTimeout"],F=0,A="[object Arguments]",P="[object Array]",U="[object Boolean]",q="[object Date]",z="[object Function]",W="[object Number]",$="[object Object]",G="[object RegExp]",V="[object String]",Y={};Y[z]=!1,Y[A]=Y[P]=Y[U]=Y[q]=Y[W]=Y[$]=Y[G]=Y[V]=!0;var K={leading:!1,maxWait:0,trailing:!1},H={configurable:!1,enumerable:!1,value:null,writable:!1},X={"boolean":!1,"function":!0,object:!0,number:!1,string:!1,undefined:!1},Q={"\\":"\\","'":"'","\n":"n","\r":"r","	":"t","\u2028":"u2028","\u2029":"u2029"},J=X[typeof window]&&window||this,Z=X[typeof r]&&r&&!r.nodeType&&r,nn=X[typeof t]&&t&&!t.nodeType&&t,en=nn&&nn.exports===Z&&Z,tn=X[typeof e]&&e;!tn||tn.global!==tn&&tn.window!==tn||(J=tn);var rn=v();"function"==typeof n&&"object"==typeof n.amd&&n.amd?(J._=rn,n(function(){return rn})):Z&&nn?en?(nn.exports=rn)._=rn:Z._=rn:J._=rn}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],60:[function(n,e,t){var r=n("./lib");e.exports={Graph:r.Graph,json:n("./lib/json"),alg:n("./lib/alg"),version:r.version}},{"./lib":76,"./lib/alg":67,"./lib/json":77}],61:[function(n,e,t){function r(n){function e(o){i.has(r,o)||(r[o]=!0,t.push(o),i.each(n.successors(o),e),i.each(n.predecessors(o),e))}var t,r={},o=[];return i.each(n.nodes(),function(n){t=[],e(n),t.length&&o.push(t)}),o}var i=n("../lodash");e.exports=r},{"../lodash":78}],62:[function(n,e,t){function r(n,e,t){o.isArray(e)||(e=[e]);var r=[],a={};return o.each(e,function(e){if(!n.hasNode(e))throw new Error("Graph does not have node: "+e);i(n,e,"post"===t,a,r)}),r}function i(n,e,t,r,a){o.has(r,e)||(r[e]=!0,t||a.push(e),o.each(n.neighbors(e),function(e){i(n,e,t,r,a)}),t&&a.push(e))}var o=n("../lodash");e.exports=r},{"../lodash":78}],63:[function(n,e,t){function r(n,e,t){return o.transform(n.nodes(),function(r,o){r[o]=i(n,o,e,t)},{})}var i=n("./dijkstra"),o=n("../lodash");e.exports=r},{"../lodash":78,"./dijkstra":64}],64:[function(n,e,t){function r(n,e,t,r){return i(n,String(e),t||u,r||function(e){return n.outEdges(e)})}function i(n,e,t,r){var i,o,u={},c=new a,f=function(n){var e=n.v!==i?n.v:n.w,r=u[e],a=t(n),f=o.distance+a;if(0>a)throw new Error("dijkstra does not allow negative edge weights. Bad edge: "+n+" Weight: "+a);f<r.distance&&(r.distance=f,r.predecessor=i,c.decrease(e,f))};for(n.nodes().forEach(function(n){var t=n===e?0:Number.POSITIVE_INFINITY;u[n]={distance:t},c.add(n,t)});c.size()>0&&(i=c.removeMin(),o=u[i],o.distance!==Number.POSITIVE_INFINITY);)r(i).forEach(f);return u}var o=n("../lodash"),a=n("../data/priority-queue");e.exports=r;var u=o.constant(1)},{"../data/priority-queue":74,"../lodash":78}],65:[function(n,e,t){function r(n){return i.filter(o(n),function(n){return n.length>1})}var i=n("../lodash"),o=n("./tarjan");e.exports=r},{"../lodash":78,"./tarjan":72}],66:[function(n,e,t){function r(n,e,t){return i(n,e||a,t||function(e){return n.outEdges(e)})}function i(n,e,t){var r={},i=n.nodes();return i.forEach(function(n){r[n]={},r[n][n]={distance:0},i.forEach(function(e){n!==e&&(r[n][e]={distance:Number.POSITIVE_INFINITY})}),t(n).forEach(function(t){var i=t.v===n?t.w:t.v,o=e(t);r[n][i]={distance:o,predecessor:n}})}),i.forEach(function(n){var e=r[n];i.forEach(function(t){var o=r[t];i.forEach(function(t){var r=o[n],i=e[t],a=o[t],u=r.distance+i.distance;u<a.distance&&(a.distance=u,a.predecessor=i.predecessor)})})}),r}var o=n("../lodash");e.exports=r;var a=o.constant(1)},{"../lodash":78}],67:[function(n,e,t){e.exports={components:n("./components"),dijkstra:n("./dijkstra"),dijkstraAll:n("./dijkstra-all"),findCycles:n("./find-cycles"),floydWarshall:n("./floyd-warshall"),isAcyclic:n("./is-acyclic"),postorder:n("./postorder"),preorder:n("./preorder"),prim:n("./prim"),tarjan:n("./tarjan"),topsort:n("./topsort")}},{"./components":61,"./dijkstra":64,"./dijkstra-all":63,"./find-cycles":65,"./floyd-warshall":66,"./is-acyclic":68,"./postorder":69,"./preorder":70,"./prim":71,"./tarjan":72,"./topsort":73}],68:[function(n,e,t){function r(n){try{i(n)}catch(e){if(e instanceof i.CycleException)return!1;throw e}return!0}var i=n("./topsort");e.exports=r},{"./topsort":73}],69:[function(n,e,t){function r(n,e){return i(n,e,"post")}var i=n("./dfs");e.exports=r},{"./dfs":62}],70:[function(n,e,t){function r(n,e){return i(n,e,"pre")}var i=n("./dfs");e.exports=r},{"./dfs":62}],71:[function(n,e,t){function r(n,e){function t(n){var t=n.v===r?n.w:n.v,i=f.priority(t);if(void 0!==i){var o=e(n);i>o&&(c[t]=r,f.decrease(t,o))}}var r,u=new o,c={},f=new a;if(0===n.nodeCount())return u;i.each(n.nodes(),function(n){f.add(n,Number.POSITIVE_INFINITY),u.setNode(n)}),f.decrease(n.nodes()[0],0);for(var l=!1;f.size()>0;){if(r=f.removeMin(),i.has(c,r))u.setEdge(r,c[r]);else{if(l)throw new Error("Input graph is not connected: "+n);l=!0}n.nodeEdges(r).forEach(t)}return u}var i=n("../lodash"),o=n("../graph"),a=n("../data/priority-queue");e.exports=r},{"../data/priority-queue":74,"../graph":75,"../lodash":78}],72:[function(n,e,t){function r(n){function e(u){var c=o[u]={onStack:!0,lowlink:t,index:t++};if(r.push(u),n.successors(u).forEach(function(n){i.has(o,n)?o[n].onStack&&(c.lowlink=Math.min(c.lowlink,o[n].index)):(e(n),c.lowlink=Math.min(c.lowlink,o[n].lowlink))}),c.lowlink===c.index){var f,l=[];do f=r.pop(),o[f].onStack=!1,l.push(f);while(u!==f);a.push(l)}}var t=0,r=[],o={},a=[];return n.nodes().forEach(function(n){i.has(o,n)||e(n)}),a}var i=n("../lodash");e.exports=r},{"../lodash":78}],73:[function(n,e,t){function r(n){function e(u){if(o.has(r,u))throw new i;o.has(t,u)||(r[u]=!0,t[u]=!0,o.each(n.predecessors(u),e),delete r[u],a.push(u))}var t={},r={},a=[];if(o.each(n.sinks(),e),o.size(t)!==n.nodeCount())throw new i;return a}function i(){}var o=n("../lodash");e.exports=r,r.CycleException=i},{"../lodash":78}],74:[function(n,e,t){function r(){this._arr=[],this._keyIndices={}}var i=n("../lodash");e.exports=r,r.prototype.size=function(){return this._arr.length},r.prototype.keys=function(){return this._arr.map(function(n){return n.key})},r.prototype.has=function(n){return i.has(this._keyIndices,n)},r.prototype.priority=function(n){var e=this._keyIndices[n];return void 0!==e?this._arr[e].priority:void 0},r.prototype.min=function(){if(0===this.size())throw new Error("Queue underflow");return this._arr[0].key},r.prototype.add=function(n,e){var t=this._keyIndices;if(n=String(n),!i.has(t,n)){var r=this._arr,o=r.length;return t[n]=o,r.push({key:n,priority:e}),this._decrease(o),!0}return!1},r.prototype.removeMin=function(){this._swap(0,this._arr.length-1);var n=this._arr.pop();return delete this._keyIndices[n.key],this._heapify(0),n.key},r.prototype.decrease=function(n,e){var t=this._keyIndices[n];if(e>this._arr[t].priority)throw new Error("New priority is greater than current priority. Key: "+n+" Old: "+this._arr[t].priority+" New: "+e);this._arr[t].priority=e,this._decrease(t)},r.prototype._heapify=function(n){var e=this._arr,t=2*n,r=t+1,i=n;t<e.length&&(i=e[t].priority<e[i].priority?t:i,r<e.length&&(i=e[r].priority<e[i].priority?r:i),i!==n&&(this._swap(n,i),this._heapify(i)))},r.prototype._decrease=function(n){for(var e,t=this._arr,r=t[n].priority;0!==n&&(e=n>>1,!(t[e].priority<r));)this._swap(n,e),n=e},r.prototype._swap=function(n,e){var t=this._arr,r=this._keyIndices,i=t[n],o=t[e];t[n]=o,t[e]=i,r[o.key]=n,r[i.key]=e}},{"../lodash":78}],75:[function(n,e,t){"use strict";function r(n){this._isDirected=f.has(n,"directed")?n.directed:!0,this._isMultigraph=f.has(n,"multigraph")?n.multigraph:!1,this._isCompound=f.has(n,"compound")?n.compound:!1,this._label=void 0,this._defaultNodeLabelFn=f.constant(void 0),this._defaultEdgeLabelFn=f.constant(void 0),this._nodes={},this._isCompound&&(this._parent={},this._children={},this._children[s]={}),this._in={},this._preds={},this._out={},this._sucs={},this._edgeObjs={},this._edgeLabels={}}function i(n,e){f.has(n,e)?n[e]++:n[e]=1}function o(n,e){--n[e]||delete n[e]}function a(n,e,t,r){if(!n&&e>t){var i=e;e=t,t=i}return e+p+t+p+(f.isUndefined(r)?l:r)}function u(n,e,t,r){if(!n&&e>t){var i=e;e=t,t=i}var o={v:e,w:t};return r&&(o.name=r),o}function c(n,e){return a(n,e.v,e.w,e.name)}var f=n("./lodash");e.exports=r;var l="\x00",s="\x00",p="";r.prototype._nodeCount=0,r.prototype._edgeCount=0,r.prototype.isDirected=function(){return this._isDirected},r.prototype.isMultigraph=function(){return this._isMultigraph},r.prototype.isCompound=function(){return this._isCompound},r.prototype.setGraph=function(n){return this._label=n,this},r.prototype.graph=function(){return this._label},r.prototype.setDefaultNodeLabel=function(n){return f.isFunction(n)||(n=f.constant(n)),this._defaultNodeLabelFn=n,this},r.prototype.nodeCount=function(){return this._nodeCount},r.prototype.nodes=function(){return f.keys(this._nodes)},r.prototype.sources=function(){return f.filter(this.nodes(),function(n){return f.isEmpty(this._in[n])},this)},r.prototype.sinks=function(){return f.filter(this.nodes(),function(n){return f.isEmpty(this._out[n])},this)},r.prototype.setNodes=function(n,e){var t=arguments;return f.each(n,function(n){t.length>1?this.setNode(n,e):this.setNode(n)},this),this},r.prototype.setNode=function(n,e){return f.has(this._nodes,n)?(arguments.length>1&&(this._nodes[n]=e),this):(this._nodes[n]=arguments.length>1?e:this._defaultNodeLabelFn(n),this._isCompound&&(this._parent[n]=s,this._children[n]={},this._children[s][n]=!0),this._in[n]={},this._preds[n]={},this._out[n]={},this._sucs[n]={},++this._nodeCount,this)},r.prototype.node=function(n){return this._nodes[n]},r.prototype.hasNode=function(n){return f.has(this._nodes,n)},r.prototype.removeNode=function(n){var e=this;if(f.has(this._nodes,n)){var t=function(n){e.removeEdge(e._edgeObjs[n])};delete this._nodes[n],this._isCompound&&(this._removeFromParentsChildList(n),delete this._parent[n],f.each(this.children(n),function(n){this.setParent(n)},this),delete this._children[n]),f.each(f.keys(this._in[n]),t),delete this._in[n],delete this._preds[n],f.each(f.keys(this._out[n]),t),delete this._out[n],delete this._sucs[n],--this._nodeCount}return this},r.prototype.setParent=function(n,e){if(!this._isCompound)throw new Error("Cannot set parent in a non-compound graph");if(f.isUndefined(e))e=s;else{e+="";for(var t=e;!f.isUndefined(t);t=this.parent(t))if(t===n)throw new Error("Setting "+e+" as parent of "+n+" would create create a cycle");this.setNode(e)}return this.setNode(n),this._removeFromParentsChildList(n),this._parent[n]=e,this._children[e][n]=!0,this},r.prototype._removeFromParentsChildList=function(n){delete this._children[this._parent[n]][n]},r.prototype.parent=function(n){if(this._isCompound){var e=this._parent[n];if(e!==s)return e}},r.prototype.children=function(n){if(f.isUndefined(n)&&(n=s),this._isCompound){var e=this._children[n];if(e)return f.keys(e)}else{if(n===s)return this.nodes();if(this.hasNode(n))return[]}},r.prototype.predecessors=function(n){var e=this._preds[n];return e?f.keys(e):void 0},r.prototype.successors=function(n){var e=this._sucs[n];return e?f.keys(e):void 0},r.prototype.neighbors=function(n){var e=this.predecessors(n);return e?f.union(e,this.successors(n)):void 0},r.prototype.setDefaultEdgeLabel=function(n){return f.isFunction(n)||(n=f.constant(n)),this._defaultEdgeLabelFn=n,this},r.prototype.edgeCount=function(){return this._edgeCount},r.prototype.edges=function(){return f.values(this._edgeObjs)},r.prototype.setPath=function(n,e){var t=this,r=arguments;return f.reduce(n,function(n,i){return r.length>1?t.setEdge(n,i,e):t.setEdge(n,i),i}),this},r.prototype.setEdge=function(){var n,e,t,r,o=!1;f.isPlainObject(arguments[0])?(n=arguments[0].v,e=arguments[0].w,t=arguments[0].name,2===arguments.length&&(r=arguments[1],o=!0)):(n=arguments[0],e=arguments[1],t=arguments[3],arguments.length>2&&(r=arguments[2],o=!0)),n=""+n,e=""+e,f.isUndefined(t)||(t=""+t);var c=a(this._isDirected,n,e,t);if(f.has(this._edgeLabels,c))return o&&(this._edgeLabels[c]=r),this;if(!f.isUndefined(t)&&!this._isMultigraph)throw new Error("Cannot set a named edge when isMultigraph = false");this.setNode(n),this.setNode(e),this._edgeLabels[c]=o?r:this._defaultEdgeLabelFn(n,e,t);var l=u(this._isDirected,n,e,t);return n=l.v,e=l.w,Object.freeze(l),this._edgeObjs[c]=l,i(this._preds[e],n),i(this._sucs[n],e),this._in[e][c]=l,this._out[n][c]=l,this._edgeCount++,this},r.prototype.edge=function(n,e,t){var r=1===arguments.length?c(this._isDirected,arguments[0]):a(this._isDirected,n,e,t);return this._edgeLabels[r]},r.prototype.hasEdge=function(n,e,t){var r=1===arguments.length?c(this._isDirected,arguments[0]):a(this._isDirected,n,e,t);return f.has(this._edgeLabels,r)},r.prototype.removeEdge=function(n,e,t){var r=1===arguments.length?c(this._isDirected,arguments[0]):a(this._isDirected,n,e,t),i=this._edgeObjs[r];return i&&(n=i.v,e=i.w,delete this._edgeLabels[r],delete this._edgeObjs[r],o(this._preds[e],n),o(this._sucs[n],e),delete this._in[e][r],delete this._out[n][r],this._edgeCount--),this},r.prototype.inEdges=function(n,e){var t=this._in[n];if(t){var r=f.values(t);return e?f.filter(r,function(n){return n.v===e}):r}},r.prototype.outEdges=function(n,e){var t=this._out[n];if(t){var r=f.values(t);return e?f.filter(r,function(n){return n.w===e}):r}},r.prototype.nodeEdges=function(n,e){var t=this.inEdges(n,e);return t?t.concat(this.outEdges(n,e)):void 0}},{"./lodash":78}],76:[function(n,e,t){e.exports={Graph:n("./graph"),version:n("./version")}},{"./graph":75,"./version":79}],77:[function(n,e,t){function r(n){var e={options:{directed:n.isDirected(),multigraph:n.isMultigraph(),compound:n.isCompound()},nodes:i(n),edges:o(n)};return u.isUndefined(n.graph())||(e.value=u.clone(n.graph())),e}function i(n){return u.map(n.nodes(),function(e){var t=n.node(e),r=n.parent(e),i={v:e};return u.isUndefined(t)||(i.value=t),u.isUndefined(r)||(i.parent=r),i})}function o(n){return u.map(n.edges(),function(e){var t=n.edge(e),r={v:e.v,w:e.w};return u.isUndefined(e.name)||(r.name=e.name),u.isUndefined(t)||(r.value=t),r})}function a(n){var e=new c(n.options).setGraph(n.value);return u.each(n.nodes,function(n){e.setNode(n.v,n.value),n.parent&&e.setParent(n.v,n.parent)}),u.each(n.edges,function(n){e.setEdge({v:n.v,w:n.w,name:n.name},n.value)}),e}var u=n("./lodash"),c=n("./graph");e.exports={write:r,read:a}},{"./graph":75,"./lodash":78}],78:[function(n,e,t){var r;if("function"==typeof n)try{r=n("lodash")}catch(i){}r||(r=window._),e.exports=r},{lodash:80}],79:[function(n,e,t){e.exports="1.0.3"},{}],80:[function(e,t,r){(function(e){(function(){function i(n,e,t){for(var r=(t||0)-1,i=n?n.length:0;++r<i;)if(n[r]===e)return r;return-1}function o(n,e){var t=typeof e;if(n=n.cache,"boolean"==t||null==e)return n[e]?0:-1;"number"!=t&&"string"!=t&&(t="object");var r="number"==t?e:w+e;return n=(n=n[t])&&n[r],"object"==t?n&&i(n,e)>-1?0:-1:n?0:-1}function a(n){var e=this.cache,t=typeof n;if("boolean"==t||null==n)e[n]=!0;else{"number"!=t&&"string"!=t&&(t="object");var r="number"==t?n:w+n,i=e[t]||(e[t]={});"object"==t?(i[r]||(i[r]=[])).push(n):i[r]=!0}}function u(n){return n.charCodeAt(0)}function c(n,e){for(var t=n.criteria,r=e.criteria,i=-1,o=t.length;++i<o;){var a=t[i],u=r[i];if(a!==u){if(a>u||"undefined"==typeof a)return 1;if(u>a||"undefined"==typeof u)return-1}}return n.index-e.index}function f(n){var e=-1,t=n.length,r=n[0],i=n[t/2|0],o=n[t-1];if(r&&"object"==typeof r&&i&&"object"==typeof i&&o&&"object"==typeof o)return!1;var u=p();u["false"]=u["null"]=u["true"]=u.undefined=!1;var c=p();for(c.array=n,c.cache=u,c.push=a;++e<t;)c.push(n[e]);return c}function l(n){return"\\"+Q[n]}function s(){return m.pop()||[]}function p(){return b.pop()||{array:null,cache:null,criteria:null,"false":!1,index:0,"null":!1,number:null,object:null,push:null,string:null,"true":!1,undefined:!1,value:null}}function h(n){n.length=0,m.length<k&&m.push(n)}function d(n){var e=n.cache;e&&d(e),n.array=n.cache=n.criteria=n.object=n.number=n.string=n.value=null,b.length<k&&b.push(n)}function g(n,e,t){e||(e=0),"undefined"==typeof t&&(t=n?n.length:0);for(var r=-1,i=t-e||0,o=Array(0>i?0:i);++r<i;)o[r]=n[e+r];return o}function v(n){function e(n){return n&&"object"==typeof n&&!Jt(n)&&Mt.call(n,"__wrapped__")?n:new t(n)}function t(n,e){this.__chain__=!!e,this.__wrapped__=n}function r(n){function e(){if(r){var n=g(r);Bt.apply(n,arguments)}if(this instanceof e){var o=m(t.prototype),a=t.apply(o,n||arguments);return Rn(a)?a:o}return t.apply(i,n||arguments)}var t=n[0],r=n[2],i=n[4];return Qt(e,n),e}function a(n,e,t,r,i){if(t){var o=t(n);if("undefined"!=typeof o)return o}var u=Rn(n);if(!u)return n;var c=Nt.call(n);if(!Y[c])return n;var f=Ht[c];switch(c){case U:case q:return new f(+n);case W:case V:return new f(n);case G:return o=f(n.source,T.exec(n)),o.lastIndex=n.lastIndex,o}var l=Jt(n);if(e){var p=!r;r||(r=s()),i||(i=s());for(var d=r.length;d--;)if(r[d]==n)return i[d];o=l?f(n.length):{}}else o=l?g(n):or({},n);return l&&(Mt.call(n,"index")&&(o.index=n.index),Mt.call(n,"input")&&(o.input=n.input)),e?(r.push(n),i.push(o),(l?Qn:cr)(n,function(n,u){o[u]=a(n,e,t,r,i)}),p&&(h(r),h(i)),o):o}function m(n,e){return Rn(n)?Ut(n):{}}function b(n,e,t){if("function"!=typeof n)return Je;if("undefined"==typeof e||!("prototype"in n))return n;var r=n.__bindData__;if("undefined"==typeof r&&(Xt.funcNames&&(r=!n.name),r=r||!Xt.funcDecomp,!r)){var i=St.call(n);Xt.funcNames||(r=!O.test(i)),r||(r=M.test(i),Qt(n,r))}if(r===!1||r!==!0&&1&r[1])return n;switch(t){case 1:return function(t){return n.call(e,t)};case 2:return function(t,r){return n.call(e,t,r)};case 3:return function(t,r,i){return n.call(e,t,r,i)};case 4:return function(t,r,i,o){return n.call(e,t,r,i,o)}}return Be(n,e)}function k(n){function e(){var n=c?a:this;if(i){var h=g(i);Bt.apply(h,arguments)}if((o||l)&&(h||(h=g(arguments)),o&&Bt.apply(h,o),l&&h.length<u))return r|=16,k([t,s?r:-4&r,h,null,a,u]);if(h||(h=arguments),f&&(t=n[p]),this instanceof e){n=m(t.prototype);var d=t.apply(n,h);return Rn(d)?d:n}return t.apply(n,h)}var t=n[0],r=n[1],i=n[2],o=n[3],a=n[4],u=n[5],c=1&r,f=2&r,l=4&r,s=8&r,p=t;return Qt(e,n),e}function Q(n,e){var t=-1,r=fn(),a=n?n.length:0,u=a>=x&&r===i,c=[];if(u){var l=f(e);l?(r=o,e=l):u=!1}for(;++t<a;){var s=n[t];r(e,s)<0&&c.push(s)}return u&&d(e),c}function Z(n,e,t,r){for(var i=(r||0)-1,o=n?n.length:0,a=[];++i<o;){var u=n[i];if(u&&"object"==typeof u&&"number"==typeof u.length&&(Jt(u)||hn(u))){e||(u=Z(u,e,t));var c=-1,f=u.length,l=a.length;for(a.length+=f;++c<f;)a[l++]=u[c]}else t||a.push(u)}return a}function nn(n,e,t,r,i,o){if(t){var a=t(n,e);if("undefined"!=typeof a)return!!a}if(n===e)return 0!==n||1/n==1/e;var u=typeof n,c=typeof e;if(!(n!==n||n&&X[u]||e&&X[c]))return!1;if(null==n||null==e)return n===e;var f=Nt.call(n),l=Nt.call(e);if(f==A&&(f=$),l==A&&(l=$),f!=l)return!1;switch(f){case U:case q:return+n==+e;case W:return n!=+n?e!=+e:0==n?1/n==1/e:n==+e;case G:case V:return n==xt(e)}var p=f==P;if(!p){var d=Mt.call(n,"__wrapped__"),g=Mt.call(e,"__wrapped__");if(d||g)return nn(d?n.__wrapped__:n,g?e.__wrapped__:e,t,r,i,o);if(f!=$)return!1;var v=n.constructor,y=e.constructor;if(v!=y&&!(On(v)&&v instanceof v&&On(y)&&y instanceof y)&&"constructor"in n&&"constructor"in e)return!1}var m=!i;i||(i=s()),o||(o=s());for(var b=i.length;b--;)if(i[b]==n)return o[b]==e;var _=0;if(a=!0,i.push(n),o.push(e),p){if(b=n.length,_=e.length,a=_==b,a||r)for(;_--;){var w=b,x=e[_];if(r)for(;w--&&!(a=nn(n[w],x,t,r,i,o)););else if(!(a=nn(n[_],x,t,r,i,o)))break}}else ur(e,function(e,u,c){return Mt.call(c,u)?(_++,a=Mt.call(n,u)&&nn(n[u],e,t,r,i,o)):void 0}),a&&!r&&ur(n,function(n,e,t){return Mt.call(t,e)?a=--_>-1:void 0});return i.pop(),o.pop(),m&&(h(i),h(o)),a}function en(n,e,t,r,i){(Jt(e)?Qn:cr)(e,function(e,o){var a,u,c=e,f=n[o];if(e&&((u=Jt(e))||fr(e))){for(var l=r.length;l--;)if(a=r[l]==e){f=i[l];break}if(!a){var s;t&&(c=t(f,e),(s="undefined"!=typeof c)&&(f=c)),s||(f=u?Jt(f)?f:[]:fr(f)?f:{}),r.push(e),i.push(f),s||en(f,e,t,r,i)}}else t&&(c=t(f,e),"undefined"==typeof c&&(c=e)),"undefined"!=typeof c&&(f=c);n[o]=f})}function tn(n,e){return n+Rt(Kt()*(e-n+1))}function on(n,e,t){var r=-1,a=fn(),u=n?n.length:0,c=[],l=!e&&u>=x&&a===i,p=t||l?s():c;if(l){var g=f(p);a=o,p=g}for(;++r<u;){var v=n[r],y=t?t(v,r,n):v;(e?!r||p[p.length-1]!==y:a(p,y)<0)&&((t||l)&&p.push(y),c.push(v))}return l?(h(p.array),d(p)):t&&h(p),c}function an(n){return function(t,r,i){var o={};r=e.createCallback(r,i,3);var a=-1,u=t?t.length:0;if("number"==typeof u)for(;++a<u;){var c=t[a];n(o,c,r(c,a,t),t)}else cr(t,function(e,t,i){n(o,e,r(e,t,i),i)});return o}}function un(n,e,t,i,o,a){var u=1&e,c=2&e,f=4&e,l=16&e,s=32&e;if(!c&&!On(n))throw new kt;l&&!t.length&&(e&=-17,l=t=!1),s&&!i.length&&(e&=-33,s=i=!1);var p=n&&n.__bindData__;if(p&&p!==!0)return p=g(p),p[2]&&(p[2]=g(p[2])),p[3]&&(p[3]=g(p[3])),!u||1&p[1]||(p[4]=o),!u&&1&p[1]&&(e|=8),!f||4&p[1]||(p[5]=a),l&&Bt.apply(p[2]||(p[2]=[]),t),s&&At.apply(p[3]||(p[3]=[]),i),p[1]|=e,un.apply(null,p);var h=1==e||17===e?r:k;return h([n,e,t,i,o,a])}function cn(n){return er[n]}function fn(){var n=(n=e.indexOf)===me?i:n;return n}function ln(n){return"function"==typeof n&&It.test(n)}function sn(n){var e,t;return n&&Nt.call(n)==$&&(e=n.constructor,!On(e)||e instanceof e)?(ur(n,function(n,e){t=e}),"undefined"==typeof t||Mt.call(n,t)):!1}function pn(n){return tr[n]}function hn(n){return n&&"object"==typeof n&&"number"==typeof n.length&&Nt.call(n)==A||!1}function dn(n,e,t,r){return"boolean"!=typeof e&&null!=e&&(r=t,t=e,e=!1),a(n,e,"function"==typeof t&&b(t,r,1))}function gn(n,e,t){return a(n,!0,"function"==typeof e&&b(e,t,1))}function vn(n,e){var t=m(n);return e?or(t,e):t}function yn(n,t,r){var i;return t=e.createCallback(t,r,3),cr(n,function(n,e,r){return t(n,e,r)?(i=e,!1):void 0}),i}function mn(n,t,r){var i;return t=e.createCallback(t,r,3),_n(n,function(n,e,r){return t(n,e,r)?(i=e,!1):void 0}),i}function bn(n,e,t){var r=[];ur(n,function(n,e){r.push(e,n)});var i=r.length;for(e=b(e,t,3);i--&&e(r[i--],r[i],n)!==!1;);return n}function _n(n,e,t){var r=nr(n),i=r.length;for(e=b(e,t,3);i--;){var o=r[i];if(e(n[o],o,n)===!1)break}return n}function wn(n){var e=[];return ur(n,function(n,t){On(n)&&e.push(t)}),e.sort()}function xn(n,e){return n?Mt.call(n,e):!1;

}function kn(n){for(var e=-1,t=nr(n),r=t.length,i={};++e<r;){var o=t[e];i[n[o]]=o}return i}function jn(n){return n===!0||n===!1||n&&"object"==typeof n&&Nt.call(n)==U||!1}function En(n){return n&&"object"==typeof n&&Nt.call(n)==q||!1}function Cn(n){return n&&1===n.nodeType||!1}function Nn(n){var e=!0;if(!n)return e;var t=Nt.call(n),r=n.length;return t==P||t==V||t==A||t==$&&"number"==typeof r&&On(n.splice)?!r:(cr(n,function(){return e=!1}),e)}function In(n,e,t,r){return nn(n,e,"function"==typeof t&&b(t,r,2))}function Tn(n){return zt(n)&&!Wt(parseFloat(n))}function On(n){return"function"==typeof n}function Rn(n){return!(!n||!X[typeof n])}function Sn(n){return Mn(n)&&n!=+n}function Ln(n){return null===n}function Mn(n){return"number"==typeof n||n&&"object"==typeof n&&Nt.call(n)==W||!1}function Bn(n){return n&&"object"==typeof n&&Nt.call(n)==G||!1}function Dn(n){return"string"==typeof n||n&&"object"==typeof n&&Nt.call(n)==V||!1}function Fn(n){return"undefined"==typeof n}function An(n,t,r){var i={};return t=e.createCallback(t,r,3),cr(n,function(n,e,r){i[e]=t(n,e,r)}),i}function Pn(n){var e=arguments,t=2;if(!Rn(n))return n;if("number"!=typeof e[2]&&(t=e.length),t>3&&"function"==typeof e[t-2])var r=b(e[--t-1],e[t--],2);else t>2&&"function"==typeof e[t-1]&&(r=e[--t]);for(var i=g(arguments,1,t),o=-1,a=s(),u=s();++o<t;)en(n,i[o],r,a,u);return h(a),h(u),n}function Un(n,t,r){var i={};if("function"!=typeof t){var o=[];ur(n,function(n,e){o.push(e)}),o=Q(o,Z(arguments,!0,!1,1));for(var a=-1,u=o.length;++a<u;){var c=o[a];i[c]=n[c]}}else t=e.createCallback(t,r,3),ur(n,function(n,e,r){t(n,e,r)||(i[e]=n)});return i}function qn(n){for(var e=-1,t=nr(n),r=t.length,i=dt(r);++e<r;){var o=t[e];i[e]=[o,n[o]]}return i}function zn(n,t,r){var i={};if("function"!=typeof t)for(var o=-1,a=Z(arguments,!0,!1,1),u=Rn(n)?a.length:0;++o<u;){var c=a[o];c in n&&(i[c]=n[c])}else t=e.createCallback(t,r,3),ur(n,function(n,e,r){t(n,e,r)&&(i[e]=n)});return i}function Wn(n,t,r,i){var o=Jt(n);if(null==r)if(o)r=[];else{var a=n&&n.constructor,u=a&&a.prototype;r=m(u)}return t&&(t=e.createCallback(t,i,4),(o?Qn:cr)(n,function(n,e,i){return t(r,n,e,i)})),r}function $n(n){for(var e=-1,t=nr(n),r=t.length,i=dt(r);++e<r;)i[e]=n[t[e]];return i}function Gn(n){for(var e=arguments,t=-1,r=Z(e,!0,!1,1),i=e[2]&&e[2][e[1]]===n?1:r.length,o=dt(i);++t<i;)o[t]=n[r[t]];return o}function Vn(n,e,t){var r=-1,i=fn(),o=n?n.length:0,a=!1;return t=(0>t?Gt(0,o+t):t)||0,Jt(n)?a=i(n,e,t)>-1:"number"==typeof o?a=(Dn(n)?n.indexOf(e,t):i(n,e,t))>-1:cr(n,function(n){return++r>=t?!(a=n===e):void 0}),a}function Yn(n,t,r){var i=!0;t=e.createCallback(t,r,3);var o=-1,a=n?n.length:0;if("number"==typeof a)for(;++o<a&&(i=!!t(n[o],o,n)););else cr(n,function(n,e,r){return i=!!t(n,e,r)});return i}function Kn(n,t,r){var i=[];t=e.createCallback(t,r,3);var o=-1,a=n?n.length:0;if("number"==typeof a)for(;++o<a;){var u=n[o];t(u,o,n)&&i.push(u)}else cr(n,function(n,e,r){t(n,e,r)&&i.push(n)});return i}function Hn(n,t,r){t=e.createCallback(t,r,3);var i=-1,o=n?n.length:0;if("number"!=typeof o){var a;return cr(n,function(n,e,r){return t(n,e,r)?(a=n,!1):void 0}),a}for(;++i<o;){var u=n[i];if(t(u,i,n))return u}}function Xn(n,t,r){var i;return t=e.createCallback(t,r,3),Jn(n,function(n,e,r){return t(n,e,r)?(i=n,!1):void 0}),i}function Qn(n,e,t){var r=-1,i=n?n.length:0;if(e=e&&"undefined"==typeof t?e:b(e,t,3),"number"==typeof i)for(;++r<i&&e(n[r],r,n)!==!1;);else cr(n,e);return n}function Jn(n,e,t){var r=n?n.length:0;if(e=e&&"undefined"==typeof t?e:b(e,t,3),"number"==typeof r)for(;r--&&e(n[r],r,n)!==!1;);else{var i=nr(n);r=i.length,cr(n,function(n,t,o){return t=i?i[--r]:--r,e(o[t],t,o)})}return n}function Zn(n,e){var t=g(arguments,2),r=-1,i="function"==typeof e,o=n?n.length:0,a=dt("number"==typeof o?o:0);return Qn(n,function(n){a[++r]=(i?e:n[e]).apply(n,t)}),a}function ne(n,t,r){var i=-1,o=n?n.length:0;if(t=e.createCallback(t,r,3),"number"==typeof o)for(var a=dt(o);++i<o;)a[i]=t(n[i],i,n);else a=[],cr(n,function(n,e,r){a[++i]=t(n,e,r)});return a}function ee(n,t,r){var i=-(1/0),o=i;if("function"!=typeof t&&r&&r[t]===n&&(t=null),null==t&&Jt(n))for(var a=-1,c=n.length;++a<c;){var f=n[a];f>o&&(o=f)}else t=null==t&&Dn(n)?u:e.createCallback(t,r,3),Qn(n,function(n,e,r){var a=t(n,e,r);a>i&&(i=a,o=n)});return o}function te(n,t,r){var i=1/0,o=i;if("function"!=typeof t&&r&&r[t]===n&&(t=null),null==t&&Jt(n))for(var a=-1,c=n.length;++a<c;){var f=n[a];o>f&&(o=f)}else t=null==t&&Dn(n)?u:e.createCallback(t,r,3),Qn(n,function(n,e,r){var a=t(n,e,r);i>a&&(i=a,o=n)});return o}function re(n,t,r,i){if(!n)return r;var o=arguments.length<3;t=e.createCallback(t,i,4);var a=-1,u=n.length;if("number"==typeof u)for(o&&(r=n[++a]);++a<u;)r=t(r,n[a],a,n);else cr(n,function(n,e,i){r=o?(o=!1,n):t(r,n,e,i)});return r}function ie(n,t,r,i){var o=arguments.length<3;return t=e.createCallback(t,i,4),Jn(n,function(n,e,i){r=o?(o=!1,n):t(r,n,e,i)}),r}function oe(n,t,r){return t=e.createCallback(t,r,3),Kn(n,function(n,e,r){return!t(n,e,r)})}function ae(n,e,t){if(n&&"number"!=typeof n.length&&(n=$n(n)),null==e||t)return n?n[tn(0,n.length-1)]:y;var r=ue(n);return r.length=Vt(Gt(0,e),r.length),r}function ue(n){var e=-1,t=n?n.length:0,r=dt("number"==typeof t?t:0);return Qn(n,function(n){var t=tn(0,++e);r[e]=r[t],r[t]=n}),r}function ce(n){var e=n?n.length:0;return"number"==typeof e?e:nr(n).length}function fe(n,t,r){var i;t=e.createCallback(t,r,3);var o=-1,a=n?n.length:0;if("number"==typeof a)for(;++o<a&&!(i=t(n[o],o,n)););else cr(n,function(n,e,r){return!(i=t(n,e,r))});return!!i}function le(n,t,r){var i=-1,o=Jt(t),a=n?n.length:0,u=dt("number"==typeof a?a:0);for(o||(t=e.createCallback(t,r,3)),Qn(n,function(n,e,r){var a=u[++i]=p();o?a.criteria=ne(t,function(e){return n[e]}):(a.criteria=s())[0]=t(n,e,r),a.index=i,a.value=n}),a=u.length,u.sort(c);a--;){var f=u[a];u[a]=f.value,o||h(f.criteria),d(f)}return u}function se(n){return n&&"number"==typeof n.length?g(n):$n(n)}function pe(n){for(var e=-1,t=n?n.length:0,r=[];++e<t;){var i=n[e];i&&r.push(i)}return r}function he(n){return Q(n,Z(arguments,!0,!0,1))}function de(n,t,r){var i=-1,o=n?n.length:0;for(t=e.createCallback(t,r,3);++i<o;)if(t(n[i],i,n))return i;return-1}function ge(n,t,r){var i=n?n.length:0;for(t=e.createCallback(t,r,3);i--;)if(t(n[i],i,n))return i;return-1}function ve(n,t,r){var i=0,o=n?n.length:0;if("number"!=typeof t&&null!=t){var a=-1;for(t=e.createCallback(t,r,3);++a<o&&t(n[a],a,n);)i++}else if(i=t,null==i||r)return n?n[0]:y;return g(n,0,Vt(Gt(0,i),o))}function ye(n,e,t,r){return"boolean"!=typeof e&&null!=e&&(r=t,t="function"!=typeof e&&r&&r[e]===n?null:e,e=!1),null!=t&&(n=ne(n,t,r)),Z(n,e)}function me(n,e,t){if("number"==typeof t){var r=n?n.length:0;t=0>t?Gt(0,r+t):t||0}else if(t){var o=Ne(n,e);return n[o]===e?o:-1}return i(n,e,t)}function be(n,t,r){var i=0,o=n?n.length:0;if("number"!=typeof t&&null!=t){var a=o;for(t=e.createCallback(t,r,3);a--&&t(n[a],a,n);)i++}else i=null==t||r?1:t||i;return g(n,0,Vt(Gt(0,o-i),o))}function _e(){for(var n=[],e=-1,t=arguments.length,r=s(),a=fn(),u=a===i,c=s();++e<t;){var l=arguments[e];(Jt(l)||hn(l))&&(n.push(l),r.push(u&&l.length>=x&&f(e?n[e]:c)))}var p=n[0],g=-1,v=p?p.length:0,y=[];n:for(;++g<v;){var m=r[0];if(l=p[g],(m?o(m,l):a(c,l))<0){for(e=t,(m||c).push(l);--e;)if(m=r[e],(m?o(m,l):a(n[e],l))<0)continue n;y.push(l)}}for(;t--;)m=r[t],m&&d(m);return h(r),h(c),y}function we(n,t,r){var i=0,o=n?n.length:0;if("number"!=typeof t&&null!=t){var a=o;for(t=e.createCallback(t,r,3);a--&&t(n[a],a,n);)i++}else if(i=t,null==i||r)return n?n[o-1]:y;return g(n,Gt(0,o-i))}function xe(n,e,t){var r=n?n.length:0;for("number"==typeof t&&(r=(0>t?Gt(0,r+t):Vt(t,r-1))+1);r--;)if(n[r]===e)return r;return-1}function ke(n){for(var e=arguments,t=0,r=e.length,i=n?n.length:0;++t<r;)for(var o=-1,a=e[t];++o<i;)n[o]===a&&(Ft.call(n,o--,1),i--);return n}function je(n,e,t){n=+n||0,t="number"==typeof t?t:+t||1,null==e&&(e=n,n=0);for(var r=-1,i=Gt(0,Tt((e-n)/(t||1))),o=dt(i);++r<i;)o[r]=n,n+=t;return o}function Ee(n,t,r){var i=-1,o=n?n.length:0,a=[];for(t=e.createCallback(t,r,3);++i<o;){var u=n[i];t(u,i,n)&&(a.push(u),Ft.call(n,i--,1),o--)}return a}function Ce(n,t,r){if("number"!=typeof t&&null!=t){var i=0,o=-1,a=n?n.length:0;for(t=e.createCallback(t,r,3);++o<a&&t(n[o],o,n);)i++}else i=null==t||r?1:Gt(0,t);return g(n,i)}function Ne(n,t,r,i){var o=0,a=n?n.length:o;for(r=r?e.createCallback(r,i,1):Je,t=r(t);a>o;){var u=o+a>>>1;r(n[u])<t?o=u+1:a=u}return o}function Ie(){return on(Z(arguments,!0,!0))}function Te(n,t,r,i){return"boolean"!=typeof t&&null!=t&&(i=r,r="function"!=typeof t&&i&&i[t]===n?null:t,t=!1),null!=r&&(r=e.createCallback(r,i,3)),on(n,t,r)}function Oe(n){return Q(n,g(arguments,1))}function Re(){for(var n=-1,e=arguments.length;++n<e;){var t=arguments[n];if(Jt(t)||hn(t))var r=r?on(Q(r,t).concat(Q(t,r))):t}return r||[]}function Se(){for(var n=arguments.length>1?arguments:arguments[0],e=-1,t=n?ee(hr(n,"length")):0,r=dt(0>t?0:t);++e<t;)r[e]=hr(n,e);return r}function Le(n,e){var t=-1,r=n?n.length:0,i={};for(e||!r||Jt(n[0])||(e=[]);++t<r;){var o=n[t];e?i[o]=e[t]:o&&(i[o[0]]=o[1])}return i}function Me(n,e){if(!On(e))throw new kt;return function(){return--n<1?e.apply(this,arguments):void 0}}function Be(n,e){return arguments.length>2?un(n,17,g(arguments,2),null,e):un(n,1,null,null,e)}function De(n){for(var e=arguments.length>1?Z(arguments,!0,!1,1):wn(n),t=-1,r=e.length;++t<r;){var i=e[t];n[i]=un(n[i],1,null,null,n)}return n}function Fe(n,e){return arguments.length>2?un(e,19,g(arguments,2),null,n):un(e,3,null,null,n)}function Ae(){for(var n=arguments,e=n.length;e--;)if(!On(n[e]))throw new kt;return function(){for(var e=arguments,t=n.length;t--;)e=[n[t].apply(this,e)];return e[0]}}function Pe(n,e){return e="number"==typeof e?e:+e||n.length,un(n,4,null,null,null,e)}function Ue(n,e,t){var r,i,o,a,u,c,f,l=0,s=!1,p=!0;if(!On(n))throw new kt;if(e=Gt(0,e)||0,t===!0){var h=!0;p=!1}else Rn(t)&&(h=t.leading,s="maxWait"in t&&(Gt(e,t.maxWait)||0),p="trailing"in t?t.trailing:p);var d=function(){var t=e-(gr()-a);if(0>=t){i&&Ot(i);var s=f;i=c=f=y,s&&(l=gr(),o=n.apply(u,r),c||i||(r=u=null))}else c=Dt(d,t)},g=function(){c&&Ot(c),i=c=f=y,(p||s!==e)&&(l=gr(),o=n.apply(u,r),c||i||(r=u=null))};return function(){if(r=arguments,a=gr(),u=this,f=p&&(c||!h),s===!1)var t=h&&!c;else{i||h||(l=a);var v=s-(a-l),y=0>=v;y?(i&&(i=Ot(i)),l=a,o=n.apply(u,r)):i||(i=Dt(g,v))}return y&&c?c=Ot(c):c||e===s||(c=Dt(d,e)),t&&(y=!0,o=n.apply(u,r)),!y||c||i||(r=u=null),o}}function qe(n){if(!On(n))throw new kt;var e=g(arguments,1);return Dt(function(){n.apply(y,e)},1)}function ze(n,e){if(!On(n))throw new kt;var t=g(arguments,2);return Dt(function(){n.apply(y,t)},e)}function We(n,e){if(!On(n))throw new kt;var t=function(){var r=t.cache,i=e?e.apply(this,arguments):w+arguments[0];return Mt.call(r,i)?r[i]:r[i]=n.apply(this,arguments)};return t.cache={},t}function $e(n){var e,t;if(!On(n))throw new kt;return function(){return e?t:(e=!0,t=n.apply(this,arguments),n=null,t)}}function Ge(n){return un(n,16,g(arguments,1))}function Ve(n){return un(n,32,null,g(arguments,1))}function Ye(n,e,t){var r=!0,i=!0;if(!On(n))throw new kt;return t===!1?r=!1:Rn(t)&&(r="leading"in t?t.leading:r,i="trailing"in t?t.trailing:i),K.leading=r,K.maxWait=e,K.trailing=i,Ue(n,e,K)}function Ke(n,e){return un(e,16,[n])}function He(n){return function(){return n}}function Xe(n,e,t){var r=typeof n;if(null==n||"function"==r)return b(n,e,t);if("object"!=r)return tt(n);var i=nr(n),o=i[0],a=n[o];return 1!=i.length||a!==a||Rn(a)?function(e){for(var t=i.length,r=!1;t--&&(r=nn(e[i[t]],n[i[t]],null,!0)););return r}:function(n){var e=n[o];return a===e&&(0!==a||1/a==1/e)}}function Qe(n){return null==n?"":xt(n).replace(ir,cn)}function Je(n){return n}function Ze(n,r,i){var o=!0,a=r&&wn(r);r&&(i||a.length)||(null==i&&(i=r),u=t,r=n,n=e,a=wn(r)),i===!1?o=!1:Rn(i)&&"chain"in i&&(o=i.chain);var u=n,c=On(u);Qn(a,function(e){var t=n[e]=r[e];c&&(u.prototype[e]=function(){var e=this.__chain__,r=this.__wrapped__,i=[r];Bt.apply(i,arguments);var a=t.apply(n,i);if(o||e){if(r===a&&Rn(a))return this;a=new u(a),a.__chain__=e}return a})})}function nt(){return n._=Ct,this}function et(){}function tt(n){return function(e){return e[n]}}function rt(n,e,t){var r=null==n,i=null==e;if(null==t&&("boolean"==typeof n&&i?(t=n,n=1):i||"boolean"!=typeof e||(t=e,i=!0)),r&&i&&(e=1),n=+n||0,i?(e=n,n=0):e=+e||0,t||n%1||e%1){var o=Kt();return Vt(n+o*(e-n+parseFloat("1e-"+((o+"").length-1))),e)}return tn(n,e)}function it(n,e){if(n){var t=n[e];return On(t)?n[e]():t}}function ot(n,t,r){var i=e.templateSettings;n=xt(n||""),r=ar({},r,i);var o,a=ar({},r.imports,i.imports),u=nr(a),c=$n(a),f=0,s=r.interpolate||L,p="__p += '",h=wt((r.escape||L).source+"|"+s.source+"|"+(s===R?I:L).source+"|"+(r.evaluate||L).source+"|$","g");n.replace(h,function(e,t,r,i,a,u){return r||(r=i),p+=n.slice(f,u).replace(B,l),t&&(p+="' +\n__e("+t+") +\n'"),a&&(o=!0,p+="';\n"+a+";\n__p += '"),r&&(p+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),f=u+e.length,e}),p+="';\n";var d=r.variable,g=d;g||(d="obj",p="with ("+d+") {\n"+p+"\n}\n"),p=(o?p.replace(E,""):p).replace(C,"$1").replace(N,"$1;"),p="function("+d+") {\n"+(g?"":d+" || ("+d+" = {});\n")+"var __t, __p = '', __e = _.escape"+(o?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var v="\n/*\n//# sourceURL="+(r.sourceURL||"/lodash/template/source["+F++ +"]")+"\n*/";try{var m=yt(u,"return "+p+v).apply(y,c)}catch(b){throw b.source=p,b}return t?m(t):(m.source=p,m)}function at(n,e,t){n=(n=+n)>-1?n:0;var r=-1,i=dt(n);for(e=b(e,t,1);++r<n;)i[r]=e(r);return i}function ut(n){return null==n?"":xt(n).replace(rr,pn)}function ct(n){var e=++_;return xt(null==n?"":n)+e}function ft(n){return n=new t(n),n.__chain__=!0,n}function lt(n,e){return e(n),n}function st(){return this.__chain__=!0,this}function pt(){return xt(this.__wrapped__)}function ht(){return this.__wrapped__}n=n?rn.defaults(J.Object(),n,rn.pick(J,D)):J;var dt=n.Array,gt=n.Boolean,vt=n.Date,yt=n.Function,mt=n.Math,bt=n.Number,_t=n.Object,wt=n.RegExp,xt=n.String,kt=n.TypeError,jt=[],Et=_t.prototype,Ct=n._,Nt=Et.toString,It=wt("^"+xt(Nt).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$"),Tt=mt.ceil,Ot=n.clearTimeout,Rt=mt.floor,St=yt.prototype.toString,Lt=ln(Lt=_t.getPrototypeOf)&&Lt,Mt=Et.hasOwnProperty,Bt=jt.push,Dt=n.setTimeout,Ft=jt.splice,At=jt.unshift,Pt=function(){try{var n={},e=ln(e=_t.defineProperty)&&e,t=e(n,n,n)&&e}catch(r){}return t}(),Ut=ln(Ut=_t.create)&&Ut,qt=ln(qt=dt.isArray)&&qt,zt=n.isFinite,Wt=n.isNaN,$t=ln($t=_t.keys)&&$t,Gt=mt.max,Vt=mt.min,Yt=n.parseInt,Kt=mt.random,Ht={};Ht[P]=dt,Ht[U]=gt,Ht[q]=vt,Ht[z]=yt,Ht[$]=_t,Ht[W]=bt,Ht[G]=wt,Ht[V]=xt,t.prototype=e.prototype;var Xt=e.support={};Xt.funcDecomp=!ln(n.WinRTError)&&M.test(v),Xt.funcNames="string"==typeof yt.name,e.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:R,variable:"",imports:{_:e}},Ut||(m=function(){function e(){}return function(t){if(Rn(t)){e.prototype=t;var r=new e;e.prototype=null}return r||n.Object()}}());var Qt=Pt?function(n,e){H.value=e,Pt(n,"__bindData__",H),H.value=null}:et,Jt=qt||function(n){return n&&"object"==typeof n&&"number"==typeof n.length&&Nt.call(n)==P||!1},Zt=function(n){var e,t=n,r=[];if(!t)return r;if(!X[typeof n])return r;for(e in t)Mt.call(t,e)&&r.push(e);return r},nr=$t?function(n){return Rn(n)?$t(n):[]}:Zt,er={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},tr=kn(er),rr=wt("("+nr(tr).join("|")+")","g"),ir=wt("["+nr(er).join("")+"]","g"),or=function(n,e,t){var r,i=n,o=i;if(!i)return o;var a=arguments,u=0,c="number"==typeof t?2:a.length;if(c>3&&"function"==typeof a[c-2])var f=b(a[--c-1],a[c--],2);else c>2&&"function"==typeof a[c-1]&&(f=a[--c]);for(;++u<c;)if(i=a[u],i&&X[typeof i])for(var l=-1,s=X[typeof i]&&nr(i),p=s?s.length:0;++l<p;)r=s[l],o[r]=f?f(o[r],i[r]):i[r];return o},ar=function(n,e,t){var r,i=n,o=i;if(!i)return o;for(var a=arguments,u=0,c="number"==typeof t?2:a.length;++u<c;)if(i=a[u],i&&X[typeof i])for(var f=-1,l=X[typeof i]&&nr(i),s=l?l.length:0;++f<s;)r=l[f],"undefined"==typeof o[r]&&(o[r]=i[r]);return o},ur=function(n,e,t){var r,i=n,o=i;if(!i)return o;if(!X[typeof i])return o;e=e&&"undefined"==typeof t?e:b(e,t,3);for(r in i)if(e(i[r],r,n)===!1)return o;return o},cr=function(n,e,t){var r,i=n,o=i;if(!i)return o;if(!X[typeof i])return o;e=e&&"undefined"==typeof t?e:b(e,t,3);for(var a=-1,u=X[typeof i]&&nr(i),c=u?u.length:0;++a<c;)if(r=u[a],e(i[r],r,n)===!1)return o;return o},fr=Lt?function(n){if(!n||Nt.call(n)!=$)return!1;var e=n.valueOf,t=ln(e)&&(t=Lt(e))&&Lt(t);return t?n==t||Lt(n)==t:sn(n)}:sn,lr=an(function(n,e,t){Mt.call(n,t)?n[t]++:n[t]=1}),sr=an(function(n,e,t){(Mt.call(n,t)?n[t]:n[t]=[]).push(e)}),pr=an(function(n,e,t){n[t]=e}),hr=ne,dr=Kn,gr=ln(gr=vt.now)&&gr||function(){return(new vt).getTime()},vr=8==Yt(j+"08")?Yt:function(n,e){return Yt(Dn(n)?n.replace(S,""):n,e||0)};return e.after=Me,e.assign=or,e.at=Gn,e.bind=Be,e.bindAll=De,e.bindKey=Fe,e.chain=ft,e.compact=pe,e.compose=Ae,e.constant=He,e.countBy=lr,e.create=vn,e.createCallback=Xe,e.curry=Pe,e.debounce=Ue,e.defaults=ar,e.defer=qe,e.delay=ze,e.difference=he,e.filter=Kn,e.flatten=ye,e.forEach=Qn,e.forEachRight=Jn,e.forIn=ur,e.forInRight=bn,e.forOwn=cr,e.forOwnRight=_n,e.functions=wn,e.groupBy=sr,e.indexBy=pr,e.initial=be,e.intersection=_e,e.invert=kn,e.invoke=Zn,e.keys=nr,e.map=ne,e.mapValues=An,e.max=ee,e.memoize=We,e.merge=Pn,e.min=te,e.omit=Un,e.once=$e,e.pairs=qn,e.partial=Ge,e.partialRight=Ve,e.pick=zn,e.pluck=hr,e.property=tt,e.pull=ke,e.range=je,e.reject=oe,e.remove=Ee,e.rest=Ce,e.shuffle=ue,e.sortBy=le,e.tap=lt,e.throttle=Ye,e.times=at,e.toArray=se,e.transform=Wn,e.union=Ie,e.uniq=Te,e.values=$n,e.where=dr,e.without=Oe,e.wrap=Ke,e.xor=Re,e.zip=Se,e.zipObject=Le,e.collect=ne,e.drop=Ce,e.each=Qn,e.eachRight=Jn,e.extend=or,e.methods=wn,e.object=Le,e.select=Kn,e.tail=Ce,e.unique=Te,e.unzip=Se,Ze(e),e.clone=dn,e.cloneDeep=gn,e.contains=Vn,e.escape=Qe,e.every=Yn,e.find=Hn,e.findIndex=de,e.findKey=yn,e.findLast=Xn,e.findLastIndex=ge,e.findLastKey=mn,e.has=xn,e.identity=Je,e.indexOf=me,e.isArguments=hn,e.isArray=Jt,e.isBoolean=jn,e.isDate=En,e.isElement=Cn,e.isEmpty=Nn,e.isEqual=In,e.isFinite=Tn,e.isFunction=On,e.isNaN=Sn,e.isNull=Ln,e.isNumber=Mn,e.isObject=Rn,e.isPlainObject=fr,e.isRegExp=Bn,e.isString=Dn,e.isUndefined=Fn,e.lastIndexOf=xe,e.mixin=Ze,e.noConflict=nt,e.noop=et,e.now=gr,e.parseInt=vr,e.random=rt,e.reduce=re,e.reduceRight=ie,e.result=it,e.runInContext=v,e.size=ce,e.some=fe,e.sortedIndex=Ne,e.template=ot,e.unescape=ut,e.uniqueId=ct,e.all=Yn,e.any=fe,e.detect=Hn,e.findWhere=Hn,e.foldl=re,e.foldr=ie,e.include=Vn,e.inject=re,Ze(function(){var n={};return cr(e,function(t,r){e.prototype[r]||(n[r]=t)}),n}(),!1),e.first=ve,e.last=we,e.sample=ae,e.take=ve,e.head=ve,cr(e,function(n,r){var i="sample"!==r;e.prototype[r]||(e.prototype[r]=function(e,r){var o=this.__chain__,a=n(this.__wrapped__,e,r);return o||null!=e&&(!r||i&&"function"==typeof e)?new t(a,o):a})}),e.VERSION="2.4.2",e.prototype.chain=st,e.prototype.toString=pt,e.prototype.value=ht,e.prototype.valueOf=ht,Qn(["join","pop","shift"],function(n){var r=jt[n];e.prototype[n]=function(){var n=this.__chain__,e=r.apply(this.__wrapped__,arguments);return n?new t(e,n):e}}),Qn(["push","reverse","sort","unshift"],function(n){var t=jt[n];e.prototype[n]=function(){return t.apply(this.__wrapped__,arguments),this}}),Qn(["concat","slice","splice"],function(n){var r=jt[n];e.prototype[n]=function(){return new t(r.apply(this.__wrapped__,arguments),this.__chain__)}}),e}var y,m=[],b=[],_=0,w=+new Date+"",x=75,k=40,j=" 	\f \ufeff\n\r\u2028\u2029 ᠎             　",E=/\b__p \+= '';/g,C=/\b(__p \+=) '' \+/g,N=/(__e\(.*?\)|\b__t\)) \+\n'';/g,I=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,T=/\w*$/,O=/^\s*function[ \n\r\t]+\w/,R=/<%=([\s\S]+?)%>/g,S=RegExp("^["+j+"]*0+(?=.$)"),L=/($^)/,M=/\bthis\b/,B=/['\n\r\t\u2028\u2029\\]/g,D=["Array","Boolean","Date","Function","Math","Number","Object","RegExp","String","_","attachEvent","clearTimeout","isFinite","isNaN","parseInt","setTimeout"],F=0,A="[object Arguments]",P="[object Array]",U="[object Boolean]",q="[object Date]",z="[object Function]",W="[object Number]",$="[object Object]",G="[object RegExp]",V="[object String]",Y={};Y[z]=!1,Y[A]=Y[P]=Y[U]=Y[q]=Y[W]=Y[$]=Y[G]=Y[V]=!0;var K={leading:!1,maxWait:0,trailing:!1},H={configurable:!1,enumerable:!1,value:null,writable:!1},X={"boolean":!1,"function":!0,object:!0,number:!1,string:!1,undefined:!1},Q={"\\":"\\","'":"'","\n":"n","\r":"r","	":"t","\u2028":"u2028","\u2029":"u2029"},J=X[typeof window]&&window||this,Z=X[typeof r]&&r&&!r.nodeType&&r,nn=X[typeof t]&&t&&!t.nodeType&&t,en=nn&&nn.exports===Z&&Z,tn=X[typeof e]&&e;!tn||tn.global!==tn&&tn.window!==tn||(J=tn);var rn=v();"function"==typeof n&&"object"==typeof n.amd&&n.amd?(J._=rn,n(function(){return rn})):Z&&nn?en?(nn.exports=rn)._=rn:Z._=rn:J._=rn}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],81:[function(e,t,r){(function(e){(function(){function i(n,e,t){for(var r=(t||0)-1,i=n?n.length:0;++r<i;)if(n[r]===e)return r;return-1}function o(n,e){var t=typeof e;if(n=n.cache,"boolean"==t||null==e)return n[e]?0:-1;"number"!=t&&"string"!=t&&(t="object");var r="number"==t?e:w+e;return n=(n=n[t])&&n[r],"object"==t?n&&i(n,e)>-1?0:-1:n?0:-1}function a(n){var e=this.cache,t=typeof n;if("boolean"==t||null==n)e[n]=!0;else{"number"!=t&&"string"!=t&&(t="object");var r="number"==t?n:w+n,i=e[t]||(e[t]={});"object"==t?(i[r]||(i[r]=[])).push(n):i[r]=!0}}function u(n){return n.charCodeAt(0)}function c(n,e){for(var t=n.criteria,r=e.criteria,i=-1,o=t.length;++i<o;){var a=t[i],u=r[i];if(a!==u){if(a>u||"undefined"==typeof a)return 1;if(u>a||"undefined"==typeof u)return-1}}return n.index-e.index}function f(n){var e=-1,t=n.length,r=n[0],i=n[t/2|0],o=n[t-1];if(r&&"object"==typeof r&&i&&"object"==typeof i&&o&&"object"==typeof o)return!1;var u=p();u["false"]=u["null"]=u["true"]=u.undefined=!1;var c=p();for(c.array=n,c.cache=u,c.push=a;++e<t;)c.push(n[e]);return c}function l(n){return"\\"+Q[n]}function s(){return m.pop()||[]}function p(){return b.pop()||{array:null,cache:null,criteria:null,"false":!1,index:0,"null":!1,number:null,object:null,push:null,string:null,"true":!1,undefined:!1,value:null}}function h(n){n.length=0,m.length<k&&m.push(n)}function d(n){var e=n.cache;e&&d(e),n.array=n.cache=n.criteria=n.object=n.number=n.string=n.value=null,b.length<k&&b.push(n)}function g(n,e,t){e||(e=0),"undefined"==typeof t&&(t=n?n.length:0);for(var r=-1,i=t-e||0,o=Array(0>i?0:i);++r<i;)o[r]=n[e+r];return o}function v(n){function e(n){return n&&"object"==typeof n&&!Jt(n)&&Mt.call(n,"__wrapped__")?n:new t(n)}function t(n,e){this.__chain__=!!e,this.__wrapped__=n}function r(n){function e(){if(r){var n=g(r);Bt.apply(n,arguments)}if(this instanceof e){var o=m(t.prototype),a=t.apply(o,n||arguments);return Rn(a)?a:o}return t.apply(i,n||arguments)}var t=n[0],r=n[2],i=n[4];return Qt(e,n),e}function a(n,e,t,r,i){if(t){var o=t(n);if("undefined"!=typeof o)return o}var u=Rn(n);if(!u)return n;var c=Nt.call(n);if(!Y[c])return n;var f=Ht[c];switch(c){case U:case q:return new f(+n);case W:case V:return new f(n);case G:return o=f(n.source,T.exec(n)),o.lastIndex=n.lastIndex,o}var l=Jt(n);if(e){var p=!r;r||(r=s()),i||(i=s());for(var d=r.length;d--;)if(r[d]==n)return i[d];o=l?f(n.length):{}}else o=l?g(n):or({},n);return l&&(Mt.call(n,"index")&&(o.index=n.index),Mt.call(n,"input")&&(o.input=n.input)),e?(r.push(n),i.push(o),(l?Qn:cr)(n,function(n,u){o[u]=a(n,e,t,r,i)}),p&&(h(r),h(i)),o):o}function m(n,e){return Rn(n)?Ut(n):{}}function b(n,e,t){if("function"!=typeof n)return Je;if("undefined"==typeof e||!("prototype"in n))return n;var r=n.__bindData__;if("undefined"==typeof r&&(Xt.funcNames&&(r=!n.name),r=r||!Xt.funcDecomp,!r)){var i=St.call(n);Xt.funcNames||(r=!O.test(i)),r||(r=M.test(i),Qt(n,r))}if(r===!1||r!==!0&&1&r[1])return n;switch(t){case 1:return function(t){return n.call(e,t)};case 2:return function(t,r){return n.call(e,t,r)};case 3:return function(t,r,i){return n.call(e,t,r,i)};case 4:return function(t,r,i,o){return n.call(e,t,r,i,o)}}return Be(n,e)}function k(n){function e(){var n=c?a:this;if(i){var h=g(i);Bt.apply(h,arguments)}if((o||l)&&(h||(h=g(arguments)),o&&Bt.apply(h,o),l&&h.length<u))return r|=16,k([t,s?r:-4&r,h,null,a,u]);if(h||(h=arguments),f&&(t=n[p]),this instanceof e){n=m(t.prototype);var d=t.apply(n,h);return Rn(d)?d:n}return t.apply(n,h)}var t=n[0],r=n[1],i=n[2],o=n[3],a=n[4],u=n[5],c=1&r,f=2&r,l=4&r,s=8&r,p=t;return Qt(e,n),e}function Q(n,e){var t=-1,r=fn(),a=n?n.length:0,u=a>=x&&r===i,c=[];if(u){var l=f(e);l?(r=o,e=l):u=!1}for(;++t<a;){var s=n[t];r(e,s)<0&&c.push(s)}return u&&d(e),c}function Z(n,e,t,r){for(var i=(r||0)-1,o=n?n.length:0,a=[];++i<o;){var u=n[i];if(u&&"object"==typeof u&&"number"==typeof u.length&&(Jt(u)||hn(u))){e||(u=Z(u,e,t));var c=-1,f=u.length,l=a.length;for(a.length+=f;++c<f;)a[l++]=u[c]}else t||a.push(u)}return a}function nn(n,e,t,r,i,o){if(t){var a=t(n,e);if("undefined"!=typeof a)return!!a}if(n===e)return 0!==n||1/n==1/e;var u=typeof n,c=typeof e;if(!(n!==n||n&&X[u]||e&&X[c]))return!1;if(null==n||null==e)return n===e;var f=Nt.call(n),l=Nt.call(e);if(f==A&&(f=$),l==A&&(l=$),f!=l)return!1;switch(f){case U:case q:return+n==+e;case W:return n!=+n?e!=+e:0==n?1/n==1/e:n==+e;case G:case V:return n==xt(e)}var p=f==P;if(!p){var d=Mt.call(n,"__wrapped__"),g=Mt.call(e,"__wrapped__");if(d||g)return nn(d?n.__wrapped__:n,g?e.__wrapped__:e,t,r,i,o);if(f!=$)return!1;var v=n.constructor,y=e.constructor;if(v!=y&&!(On(v)&&v instanceof v&&On(y)&&y instanceof y)&&"constructor"in n&&"constructor"in e)return!1}var m=!i;i||(i=s()),o||(o=s());for(var b=i.length;b--;)if(i[b]==n)return o[b]==e;var _=0;if(a=!0,i.push(n),o.push(e),p){if(b=n.length,_=e.length,a=_==b,a||r)for(;_--;){var w=b,x=e[_];if(r)for(;w--&&!(a=nn(n[w],x,t,r,i,o)););else if(!(a=nn(n[_],x,t,r,i,o)))break}}else ur(e,function(e,u,c){return Mt.call(c,u)?(_++,a=Mt.call(n,u)&&nn(n[u],e,t,r,i,o)):void 0}),a&&!r&&ur(n,function(n,e,t){return Mt.call(t,e)?a=--_>-1:void 0});return i.pop(),o.pop(),m&&(h(i),h(o)),a}function en(n,e,t,r,i){(Jt(e)?Qn:cr)(e,function(e,o){var a,u,c=e,f=n[o];if(e&&((u=Jt(e))||fr(e))){for(var l=r.length;l--;)if(a=r[l]==e){f=i[l];break}if(!a){var s;t&&(c=t(f,e),(s="undefined"!=typeof c)&&(f=c)),s||(f=u?Jt(f)?f:[]:fr(f)?f:{}),r.push(e),i.push(f),s||en(f,e,t,r,i)}}else t&&(c=t(f,e),"undefined"==typeof c&&(c=e)),"undefined"!=typeof c&&(f=c);n[o]=f})}function tn(n,e){return n+Rt(Kt()*(e-n+1))}function on(n,e,t){var r=-1,a=fn(),u=n?n.length:0,c=[],l=!e&&u>=x&&a===i,p=t||l?s():c;if(l){var g=f(p);a=o,p=g}for(;++r<u;){var v=n[r],y=t?t(v,r,n):v;(e?!r||p[p.length-1]!==y:a(p,y)<0)&&((t||l)&&p.push(y),c.push(v))}return l?(h(p.array),d(p)):t&&h(p),c}function an(n){return function(t,r,i){var o={};r=e.createCallback(r,i,3);var a=-1,u=t?t.length:0;if("number"==typeof u)for(;++a<u;){var c=t[a];n(o,c,r(c,a,t),t)}else cr(t,function(e,t,i){n(o,e,r(e,t,i),i)});return o}}function un(n,e,t,i,o,a){var u=1&e,c=2&e,f=4&e,l=16&e,s=32&e;if(!c&&!On(n))throw new kt;l&&!t.length&&(e&=-17,l=t=!1),s&&!i.length&&(e&=-33,s=i=!1);var p=n&&n.__bindData__;if(p&&p!==!0)return p=g(p),p[2]&&(p[2]=g(p[2])),p[3]&&(p[3]=g(p[3])),!u||1&p[1]||(p[4]=o),!u&&1&p[1]&&(e|=8),!f||4&p[1]||(p[5]=a),l&&Bt.apply(p[2]||(p[2]=[]),t),s&&At.apply(p[3]||(p[3]=[]),i),p[1]|=e,un.apply(null,p);var h=1==e||17===e?r:k;return h([n,e,t,i,o,a])}function cn(n){return er[n]}function fn(){var n=(n=e.indexOf)===me?i:n;return n}function ln(n){return"function"==typeof n&&It.test(n)}function sn(n){var e,t;return n&&Nt.call(n)==$&&(e=n.constructor,!On(e)||e instanceof e)?(ur(n,function(n,e){t=e}),"undefined"==typeof t||Mt.call(n,t)):!1}function pn(n){return tr[n]}function hn(n){return n&&"object"==typeof n&&"number"==typeof n.length&&Nt.call(n)==A||!1}function dn(n,e,t,r){return"boolean"!=typeof e&&null!=e&&(r=t,t=e,e=!1),a(n,e,"function"==typeof t&&b(t,r,1))}function gn(n,e,t){return a(n,!0,"function"==typeof e&&b(e,t,1))}function vn(n,e){var t=m(n);return e?or(t,e):t}function yn(n,t,r){var i;return t=e.createCallback(t,r,3),cr(n,function(n,e,r){return t(n,e,r)?(i=e,!1):void 0}),i}function mn(n,t,r){var i;return t=e.createCallback(t,r,3),_n(n,function(n,e,r){return t(n,e,r)?(i=e,!1):void 0}),i}function bn(n,e,t){var r=[];ur(n,function(n,e){r.push(e,n)});var i=r.length;for(e=b(e,t,3);i--&&e(r[i--],r[i],n)!==!1;);return n}function _n(n,e,t){var r=nr(n),i=r.length;for(e=b(e,t,3);i--;){var o=r[i];if(e(n[o],o,n)===!1)break}return n}function wn(n){var e=[];return ur(n,function(n,t){On(n)&&e.push(t)}),e.sort()}function xn(n,e){return n?Mt.call(n,e):!1}function kn(n){for(var e=-1,t=nr(n),r=t.length,i={};++e<r;){var o=t[e];i[n[o]]=o}return i}function jn(n){return n===!0||n===!1||n&&"object"==typeof n&&Nt.call(n)==U||!1}function En(n){return n&&"object"==typeof n&&Nt.call(n)==q||!1}function Cn(n){return n&&1===n.nodeType||!1}function Nn(n){var e=!0;if(!n)return e;var t=Nt.call(n),r=n.length;return t==P||t==V||t==A||t==$&&"number"==typeof r&&On(n.splice)?!r:(cr(n,function(){return e=!1}),e)}function In(n,e,t,r){return nn(n,e,"function"==typeof t&&b(t,r,2))}function Tn(n){return zt(n)&&!Wt(parseFloat(n))}function On(n){return"function"==typeof n}function Rn(n){return!(!n||!X[typeof n])}function Sn(n){return Mn(n)&&n!=+n}function Ln(n){return null===n}function Mn(n){return"number"==typeof n||n&&"object"==typeof n&&Nt.call(n)==W||!1}function Bn(n){return n&&"object"==typeof n&&Nt.call(n)==G||!1}function Dn(n){return"string"==typeof n||n&&"object"==typeof n&&Nt.call(n)==V||!1}function Fn(n){return"undefined"==typeof n}function An(n,t,r){var i={};return t=e.createCallback(t,r,3),cr(n,function(n,e,r){i[e]=t(n,e,r)}),i}function Pn(n){var e=arguments,t=2;if(!Rn(n))return n;if("number"!=typeof e[2]&&(t=e.length),t>3&&"function"==typeof e[t-2])var r=b(e[--t-1],e[t--],2);else t>2&&"function"==typeof e[t-1]&&(r=e[--t]);for(var i=g(arguments,1,t),o=-1,a=s(),u=s();++o<t;)en(n,i[o],r,a,u);return h(a),h(u),n}function Un(n,t,r){var i={};if("function"!=typeof t){var o=[];ur(n,function(n,e){o.push(e)}),o=Q(o,Z(arguments,!0,!1,1));for(var a=-1,u=o.length;++a<u;){var c=o[a];i[c]=n[c]}}else t=e.createCallback(t,r,3),ur(n,function(n,e,r){t(n,e,r)||(i[e]=n)});return i}function qn(n){for(var e=-1,t=nr(n),r=t.length,i=dt(r);++e<r;){var o=t[e];i[e]=[o,n[o]]}return i}function zn(n,t,r){var i={};if("function"!=typeof t)for(var o=-1,a=Z(arguments,!0,!1,1),u=Rn(n)?a.length:0;++o<u;){var c=a[o];c in n&&(i[c]=n[c])}else t=e.createCallback(t,r,3),ur(n,function(n,e,r){t(n,e,r)&&(i[e]=n)});return i}function Wn(n,t,r,i){var o=Jt(n);if(null==r)if(o)r=[];else{var a=n&&n.constructor,u=a&&a.prototype;r=m(u)}return t&&(t=e.createCallback(t,i,4),(o?Qn:cr)(n,function(n,e,i){return t(r,n,e,i)})),r}function $n(n){for(var e=-1,t=nr(n),r=t.length,i=dt(r);++e<r;)i[e]=n[t[e]];return i}function Gn(n){for(var e=arguments,t=-1,r=Z(e,!0,!1,1),i=e[2]&&e[2][e[1]]===n?1:r.length,o=dt(i);++t<i;)o[t]=n[r[t]];return o}function Vn(n,e,t){var r=-1,i=fn(),o=n?n.length:0,a=!1;return t=(0>t?Gt(0,o+t):t)||0,Jt(n)?a=i(n,e,t)>-1:"number"==typeof o?a=(Dn(n)?n.indexOf(e,t):i(n,e,t))>-1:cr(n,function(n){return++r>=t?!(a=n===e):void 0}),a}function Yn(n,t,r){var i=!0;t=e.createCallback(t,r,3);var o=-1,a=n?n.length:0;if("number"==typeof a)for(;++o<a&&(i=!!t(n[o],o,n)););else cr(n,function(n,e,r){return i=!!t(n,e,r)});return i}function Kn(n,t,r){var i=[];t=e.createCallback(t,r,3);var o=-1,a=n?n.length:0;if("number"==typeof a)for(;++o<a;){var u=n[o];t(u,o,n)&&i.push(u)}else cr(n,function(n,e,r){t(n,e,r)&&i.push(n)});return i}function Hn(n,t,r){t=e.createCallback(t,r,3);var i=-1,o=n?n.length:0;if("number"!=typeof o){var a;return cr(n,function(n,e,r){return t(n,e,r)?(a=n,!1):void 0}),a}for(;++i<o;){var u=n[i];if(t(u,i,n))return u}}function Xn(n,t,r){var i;return t=e.createCallback(t,r,3),Jn(n,function(n,e,r){return t(n,e,r)?(i=n,!1):void 0}),i}function Qn(n,e,t){var r=-1,i=n?n.length:0;if(e=e&&"undefined"==typeof t?e:b(e,t,3),
"number"==typeof i)for(;++r<i&&e(n[r],r,n)!==!1;);else cr(n,e);return n}function Jn(n,e,t){var r=n?n.length:0;if(e=e&&"undefined"==typeof t?e:b(e,t,3),"number"==typeof r)for(;r--&&e(n[r],r,n)!==!1;);else{var i=nr(n);r=i.length,cr(n,function(n,t,o){return t=i?i[--r]:--r,e(o[t],t,o)})}return n}function Zn(n,e){var t=g(arguments,2),r=-1,i="function"==typeof e,o=n?n.length:0,a=dt("number"==typeof o?o:0);return Qn(n,function(n){a[++r]=(i?e:n[e]).apply(n,t)}),a}function ne(n,t,r){var i=-1,o=n?n.length:0;if(t=e.createCallback(t,r,3),"number"==typeof o)for(var a=dt(o);++i<o;)a[i]=t(n[i],i,n);else a=[],cr(n,function(n,e,r){a[++i]=t(n,e,r)});return a}function ee(n,t,r){var i=-(1/0),o=i;if("function"!=typeof t&&r&&r[t]===n&&(t=null),null==t&&Jt(n))for(var a=-1,c=n.length;++a<c;){var f=n[a];f>o&&(o=f)}else t=null==t&&Dn(n)?u:e.createCallback(t,r,3),Qn(n,function(n,e,r){var a=t(n,e,r);a>i&&(i=a,o=n)});return o}function te(n,t,r){var i=1/0,o=i;if("function"!=typeof t&&r&&r[t]===n&&(t=null),null==t&&Jt(n))for(var a=-1,c=n.length;++a<c;){var f=n[a];o>f&&(o=f)}else t=null==t&&Dn(n)?u:e.createCallback(t,r,3),Qn(n,function(n,e,r){var a=t(n,e,r);i>a&&(i=a,o=n)});return o}function re(n,t,r,i){if(!n)return r;var o=arguments.length<3;t=e.createCallback(t,i,4);var a=-1,u=n.length;if("number"==typeof u)for(o&&(r=n[++a]);++a<u;)r=t(r,n[a],a,n);else cr(n,function(n,e,i){r=o?(o=!1,n):t(r,n,e,i)});return r}function ie(n,t,r,i){var o=arguments.length<3;return t=e.createCallback(t,i,4),Jn(n,function(n,e,i){r=o?(o=!1,n):t(r,n,e,i)}),r}function oe(n,t,r){return t=e.createCallback(t,r,3),Kn(n,function(n,e,r){return!t(n,e,r)})}function ae(n,e,t){if(n&&"number"!=typeof n.length&&(n=$n(n)),null==e||t)return n?n[tn(0,n.length-1)]:y;var r=ue(n);return r.length=Vt(Gt(0,e),r.length),r}function ue(n){var e=-1,t=n?n.length:0,r=dt("number"==typeof t?t:0);return Qn(n,function(n){var t=tn(0,++e);r[e]=r[t],r[t]=n}),r}function ce(n){var e=n?n.length:0;return"number"==typeof e?e:nr(n).length}function fe(n,t,r){var i;t=e.createCallback(t,r,3);var o=-1,a=n?n.length:0;if("number"==typeof a)for(;++o<a&&!(i=t(n[o],o,n)););else cr(n,function(n,e,r){return!(i=t(n,e,r))});return!!i}function le(n,t,r){var i=-1,o=Jt(t),a=n?n.length:0,u=dt("number"==typeof a?a:0);for(o||(t=e.createCallback(t,r,3)),Qn(n,function(n,e,r){var a=u[++i]=p();o?a.criteria=ne(t,function(e){return n[e]}):(a.criteria=s())[0]=t(n,e,r),a.index=i,a.value=n}),a=u.length,u.sort(c);a--;){var f=u[a];u[a]=f.value,o||h(f.criteria),d(f)}return u}function se(n){return n&&"number"==typeof n.length?g(n):$n(n)}function pe(n){for(var e=-1,t=n?n.length:0,r=[];++e<t;){var i=n[e];i&&r.push(i)}return r}function he(n){return Q(n,Z(arguments,!0,!0,1))}function de(n,t,r){var i=-1,o=n?n.length:0;for(t=e.createCallback(t,r,3);++i<o;)if(t(n[i],i,n))return i;return-1}function ge(n,t,r){var i=n?n.length:0;for(t=e.createCallback(t,r,3);i--;)if(t(n[i],i,n))return i;return-1}function ve(n,t,r){var i=0,o=n?n.length:0;if("number"!=typeof t&&null!=t){var a=-1;for(t=e.createCallback(t,r,3);++a<o&&t(n[a],a,n);)i++}else if(i=t,null==i||r)return n?n[0]:y;return g(n,0,Vt(Gt(0,i),o))}function ye(n,e,t,r){return"boolean"!=typeof e&&null!=e&&(r=t,t="function"!=typeof e&&r&&r[e]===n?null:e,e=!1),null!=t&&(n=ne(n,t,r)),Z(n,e)}function me(n,e,t){if("number"==typeof t){var r=n?n.length:0;t=0>t?Gt(0,r+t):t||0}else if(t){var o=Ne(n,e);return n[o]===e?o:-1}return i(n,e,t)}function be(n,t,r){var i=0,o=n?n.length:0;if("number"!=typeof t&&null!=t){var a=o;for(t=e.createCallback(t,r,3);a--&&t(n[a],a,n);)i++}else i=null==t||r?1:t||i;return g(n,0,Vt(Gt(0,o-i),o))}function _e(){for(var n=[],e=-1,t=arguments.length,r=s(),a=fn(),u=a===i,c=s();++e<t;){var l=arguments[e];(Jt(l)||hn(l))&&(n.push(l),r.push(u&&l.length>=x&&f(e?n[e]:c)))}var p=n[0],g=-1,v=p?p.length:0,y=[];n:for(;++g<v;){var m=r[0];if(l=p[g],(m?o(m,l):a(c,l))<0){for(e=t,(m||c).push(l);--e;)if(m=r[e],(m?o(m,l):a(n[e],l))<0)continue n;y.push(l)}}for(;t--;)m=r[t],m&&d(m);return h(r),h(c),y}function we(n,t,r){var i=0,o=n?n.length:0;if("number"!=typeof t&&null!=t){var a=o;for(t=e.createCallback(t,r,3);a--&&t(n[a],a,n);)i++}else if(i=t,null==i||r)return n?n[o-1]:y;return g(n,Gt(0,o-i))}function xe(n,e,t){var r=n?n.length:0;for("number"==typeof t&&(r=(0>t?Gt(0,r+t):Vt(t,r-1))+1);r--;)if(n[r]===e)return r;return-1}function ke(n){for(var e=arguments,t=0,r=e.length,i=n?n.length:0;++t<r;)for(var o=-1,a=e[t];++o<i;)n[o]===a&&(Ft.call(n,o--,1),i--);return n}function je(n,e,t){n=+n||0,t="number"==typeof t?t:+t||1,null==e&&(e=n,n=0);for(var r=-1,i=Gt(0,Tt((e-n)/(t||1))),o=dt(i);++r<i;)o[r]=n,n+=t;return o}function Ee(n,t,r){var i=-1,o=n?n.length:0,a=[];for(t=e.createCallback(t,r,3);++i<o;){var u=n[i];t(u,i,n)&&(a.push(u),Ft.call(n,i--,1),o--)}return a}function Ce(n,t,r){if("number"!=typeof t&&null!=t){var i=0,o=-1,a=n?n.length:0;for(t=e.createCallback(t,r,3);++o<a&&t(n[o],o,n);)i++}else i=null==t||r?1:Gt(0,t);return g(n,i)}function Ne(n,t,r,i){var o=0,a=n?n.length:o;for(r=r?e.createCallback(r,i,1):Je,t=r(t);a>o;){var u=o+a>>>1;r(n[u])<t?o=u+1:a=u}return o}function Ie(){return on(Z(arguments,!0,!0))}function Te(n,t,r,i){return"boolean"!=typeof t&&null!=t&&(i=r,r="function"!=typeof t&&i&&i[t]===n?null:t,t=!1),null!=r&&(r=e.createCallback(r,i,3)),on(n,t,r)}function Oe(n){return Q(n,g(arguments,1))}function Re(){for(var n=-1,e=arguments.length;++n<e;){var t=arguments[n];if(Jt(t)||hn(t))var r=r?on(Q(r,t).concat(Q(t,r))):t}return r||[]}function Se(){for(var n=arguments.length>1?arguments:arguments[0],e=-1,t=n?ee(hr(n,"length")):0,r=dt(0>t?0:t);++e<t;)r[e]=hr(n,e);return r}function Le(n,e){var t=-1,r=n?n.length:0,i={};for(e||!r||Jt(n[0])||(e=[]);++t<r;){var o=n[t];e?i[o]=e[t]:o&&(i[o[0]]=o[1])}return i}function Me(n,e){if(!On(e))throw new kt;return function(){return--n<1?e.apply(this,arguments):void 0}}function Be(n,e){return arguments.length>2?un(n,17,g(arguments,2),null,e):un(n,1,null,null,e)}function De(n){for(var e=arguments.length>1?Z(arguments,!0,!1,1):wn(n),t=-1,r=e.length;++t<r;){var i=e[t];n[i]=un(n[i],1,null,null,n)}return n}function Fe(n,e){return arguments.length>2?un(e,19,g(arguments,2),null,n):un(e,3,null,null,n)}function Ae(){for(var n=arguments,e=n.length;e--;)if(!On(n[e]))throw new kt;return function(){for(var e=arguments,t=n.length;t--;)e=[n[t].apply(this,e)];return e[0]}}function Pe(n,e){return e="number"==typeof e?e:+e||n.length,un(n,4,null,null,null,e)}function Ue(n,e,t){var r,i,o,a,u,c,f,l=0,s=!1,p=!0;if(!On(n))throw new kt;if(e=Gt(0,e)||0,t===!0){var h=!0;p=!1}else Rn(t)&&(h=t.leading,s="maxWait"in t&&(Gt(e,t.maxWait)||0),p="trailing"in t?t.trailing:p);var d=function(){var t=e-(gr()-a);if(0>=t){i&&Ot(i);var s=f;i=c=f=y,s&&(l=gr(),o=n.apply(u,r),c||i||(r=u=null))}else c=Dt(d,t)},g=function(){c&&Ot(c),i=c=f=y,(p||s!==e)&&(l=gr(),o=n.apply(u,r),c||i||(r=u=null))};return function(){if(r=arguments,a=gr(),u=this,f=p&&(c||!h),s===!1)var t=h&&!c;else{i||h||(l=a);var v=s-(a-l),y=0>=v;y?(i&&(i=Ot(i)),l=a,o=n.apply(u,r)):i||(i=Dt(g,v))}return y&&c?c=Ot(c):c||e===s||(c=Dt(d,e)),t&&(y=!0,o=n.apply(u,r)),!y||c||i||(r=u=null),o}}function qe(n){if(!On(n))throw new kt;var e=g(arguments,1);return Dt(function(){n.apply(y,e)},1)}function ze(n,e){if(!On(n))throw new kt;var t=g(arguments,2);return Dt(function(){n.apply(y,t)},e)}function We(n,e){if(!On(n))throw new kt;var t=function(){var r=t.cache,i=e?e.apply(this,arguments):w+arguments[0];return Mt.call(r,i)?r[i]:r[i]=n.apply(this,arguments)};return t.cache={},t}function $e(n){var e,t;if(!On(n))throw new kt;return function(){return e?t:(e=!0,t=n.apply(this,arguments),n=null,t)}}function Ge(n){return un(n,16,g(arguments,1))}function Ve(n){return un(n,32,null,g(arguments,1))}function Ye(n,e,t){var r=!0,i=!0;if(!On(n))throw new kt;return t===!1?r=!1:Rn(t)&&(r="leading"in t?t.leading:r,i="trailing"in t?t.trailing:i),K.leading=r,K.maxWait=e,K.trailing=i,Ue(n,e,K)}function Ke(n,e){return un(e,16,[n])}function He(n){return function(){return n}}function Xe(n,e,t){var r=typeof n;if(null==n||"function"==r)return b(n,e,t);if("object"!=r)return tt(n);var i=nr(n),o=i[0],a=n[o];return 1!=i.length||a!==a||Rn(a)?function(e){for(var t=i.length,r=!1;t--&&(r=nn(e[i[t]],n[i[t]],null,!0)););return r}:function(n){var e=n[o];return a===e&&(0!==a||1/a==1/e)}}function Qe(n){return null==n?"":xt(n).replace(ir,cn)}function Je(n){return n}function Ze(n,r,i){var o=!0,a=r&&wn(r);r&&(i||a.length)||(null==i&&(i=r),u=t,r=n,n=e,a=wn(r)),i===!1?o=!1:Rn(i)&&"chain"in i&&(o=i.chain);var u=n,c=On(u);Qn(a,function(e){var t=n[e]=r[e];c&&(u.prototype[e]=function(){var e=this.__chain__,r=this.__wrapped__,i=[r];Bt.apply(i,arguments);var a=t.apply(n,i);if(o||e){if(r===a&&Rn(a))return this;a=new u(a),a.__chain__=e}return a})})}function nt(){return n._=Ct,this}function et(){}function tt(n){return function(e){return e[n]}}function rt(n,e,t){var r=null==n,i=null==e;if(null==t&&("boolean"==typeof n&&i?(t=n,n=1):i||"boolean"!=typeof e||(t=e,i=!0)),r&&i&&(e=1),n=+n||0,i?(e=n,n=0):e=+e||0,t||n%1||e%1){var o=Kt();return Vt(n+o*(e-n+parseFloat("1e-"+((o+"").length-1))),e)}return tn(n,e)}function it(n,e){if(n){var t=n[e];return On(t)?n[e]():t}}function ot(n,t,r){var i=e.templateSettings;n=xt(n||""),r=ar({},r,i);var o,a=ar({},r.imports,i.imports),u=nr(a),c=$n(a),f=0,s=r.interpolate||L,p="__p += '",h=wt((r.escape||L).source+"|"+s.source+"|"+(s===R?I:L).source+"|"+(r.evaluate||L).source+"|$","g");n.replace(h,function(e,t,r,i,a,u){return r||(r=i),p+=n.slice(f,u).replace(B,l),t&&(p+="' +\n__e("+t+") +\n'"),a&&(o=!0,p+="';\n"+a+";\n__p += '"),r&&(p+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),f=u+e.length,e}),p+="';\n";var d=r.variable,g=d;g||(d="obj",p="with ("+d+") {\n"+p+"\n}\n"),p=(o?p.replace(E,""):p).replace(C,"$1").replace(N,"$1;"),p="function("+d+") {\n"+(g?"":d+" || ("+d+" = {});\n")+"var __t, __p = '', __e = _.escape"+(o?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var v="\n/*\n//# sourceURL="+(r.sourceURL||"/lodash/template/source["+F++ +"]")+"\n*/";try{var m=yt(u,"return "+p+v).apply(y,c)}catch(b){throw b.source=p,b}return t?m(t):(m.source=p,m)}function at(n,e,t){n=(n=+n)>-1?n:0;var r=-1,i=dt(n);for(e=b(e,t,1);++r<n;)i[r]=e(r);return i}function ut(n){return null==n?"":xt(n).replace(rr,pn)}function ct(n){var e=++_;return xt(null==n?"":n)+e}function ft(n){return n=new t(n),n.__chain__=!0,n}function lt(n,e){return e(n),n}function st(){return this.__chain__=!0,this}function pt(){return xt(this.__wrapped__)}function ht(){return this.__wrapped__}n=n?rn.defaults(J.Object(),n,rn.pick(J,D)):J;var dt=n.Array,gt=n.Boolean,vt=n.Date,yt=n.Function,mt=n.Math,bt=n.Number,_t=n.Object,wt=n.RegExp,xt=n.String,kt=n.TypeError,jt=[],Et=_t.prototype,Ct=n._,Nt=Et.toString,It=wt("^"+xt(Nt).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$"),Tt=mt.ceil,Ot=n.clearTimeout,Rt=mt.floor,St=yt.prototype.toString,Lt=ln(Lt=_t.getPrototypeOf)&&Lt,Mt=Et.hasOwnProperty,Bt=jt.push,Dt=n.setTimeout,Ft=jt.splice,At=jt.unshift,Pt=function(){try{var n={},e=ln(e=_t.defineProperty)&&e,t=e(n,n,n)&&e}catch(r){}return t}(),Ut=ln(Ut=_t.create)&&Ut,qt=ln(qt=dt.isArray)&&qt,zt=n.isFinite,Wt=n.isNaN,$t=ln($t=_t.keys)&&$t,Gt=mt.max,Vt=mt.min,Yt=n.parseInt,Kt=mt.random,Ht={};Ht[P]=dt,Ht[U]=gt,Ht[q]=vt,Ht[z]=yt,Ht[$]=_t,Ht[W]=bt,Ht[G]=wt,Ht[V]=xt,t.prototype=e.prototype;var Xt=e.support={};Xt.funcDecomp=!ln(n.WinRTError)&&M.test(v),Xt.funcNames="string"==typeof yt.name,e.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:R,variable:"",imports:{_:e}},Ut||(m=function(){function e(){}return function(t){if(Rn(t)){e.prototype=t;var r=new e;e.prototype=null}return r||n.Object()}}());var Qt=Pt?function(n,e){H.value=e,Pt(n,"__bindData__",H),H.value=null}:et,Jt=qt||function(n){return n&&"object"==typeof n&&"number"==typeof n.length&&Nt.call(n)==P||!1},Zt=function(n){var e,t=n,r=[];if(!t)return r;if(!X[typeof n])return r;for(e in t)Mt.call(t,e)&&r.push(e);return r},nr=$t?function(n){return Rn(n)?$t(n):[]}:Zt,er={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},tr=kn(er),rr=wt("("+nr(tr).join("|")+")","g"),ir=wt("["+nr(er).join("")+"]","g"),or=function(n,e,t){var r,i=n,o=i;if(!i)return o;var a=arguments,u=0,c="number"==typeof t?2:a.length;if(c>3&&"function"==typeof a[c-2])var f=b(a[--c-1],a[c--],2);else c>2&&"function"==typeof a[c-1]&&(f=a[--c]);for(;++u<c;)if(i=a[u],i&&X[typeof i])for(var l=-1,s=X[typeof i]&&nr(i),p=s?s.length:0;++l<p;)r=s[l],o[r]=f?f(o[r],i[r]):i[r];return o},ar=function(n,e,t){var r,i=n,o=i;if(!i)return o;for(var a=arguments,u=0,c="number"==typeof t?2:a.length;++u<c;)if(i=a[u],i&&X[typeof i])for(var f=-1,l=X[typeof i]&&nr(i),s=l?l.length:0;++f<s;)r=l[f],"undefined"==typeof o[r]&&(o[r]=i[r]);return o},ur=function(n,e,t){var r,i=n,o=i;if(!i)return o;if(!X[typeof i])return o;e=e&&"undefined"==typeof t?e:b(e,t,3);for(r in i)if(e(i[r],r,n)===!1)return o;return o},cr=function(n,e,t){var r,i=n,o=i;if(!i)return o;if(!X[typeof i])return o;e=e&&"undefined"==typeof t?e:b(e,t,3);for(var a=-1,u=X[typeof i]&&nr(i),c=u?u.length:0;++a<c;)if(r=u[a],e(i[r],r,n)===!1)return o;return o},fr=Lt?function(n){if(!n||Nt.call(n)!=$)return!1;var e=n.valueOf,t=ln(e)&&(t=Lt(e))&&Lt(t);return t?n==t||Lt(n)==t:sn(n)}:sn,lr=an(function(n,e,t){Mt.call(n,t)?n[t]++:n[t]=1}),sr=an(function(n,e,t){(Mt.call(n,t)?n[t]:n[t]=[]).push(e)}),pr=an(function(n,e,t){n[t]=e}),hr=ne,dr=Kn,gr=ln(gr=vt.now)&&gr||function(){return(new vt).getTime()},vr=8==Yt(j+"08")?Yt:function(n,e){return Yt(Dn(n)?n.replace(S,""):n,e||0)};return e.after=Me,e.assign=or,e.at=Gn,e.bind=Be,e.bindAll=De,e.bindKey=Fe,e.chain=ft,e.compact=pe,e.compose=Ae,e.constant=He,e.countBy=lr,e.create=vn,e.createCallback=Xe,e.curry=Pe,e.debounce=Ue,e.defaults=ar,e.defer=qe,e.delay=ze,e.difference=he,e.filter=Kn,e.flatten=ye,e.forEach=Qn,e.forEachRight=Jn,e.forIn=ur,e.forInRight=bn,e.forOwn=cr,e.forOwnRight=_n,e.functions=wn,e.groupBy=sr,e.indexBy=pr,e.initial=be,e.intersection=_e,e.invert=kn,e.invoke=Zn,e.keys=nr,e.map=ne,e.mapValues=An,e.max=ee,e.memoize=We,e.merge=Pn,e.min=te,e.omit=Un,e.once=$e,e.pairs=qn,e.partial=Ge,e.partialRight=Ve,e.pick=zn,e.pluck=hr,e.property=tt,e.pull=ke,e.range=je,e.reject=oe,e.remove=Ee,e.rest=Ce,e.shuffle=ue,e.sortBy=le,e.tap=lt,e.throttle=Ye,e.times=at,e.toArray=se,e.transform=Wn,e.union=Ie,e.uniq=Te,e.values=$n,e.where=dr,e.without=Oe,e.wrap=Ke,e.xor=Re,e.zip=Se,e.zipObject=Le,e.collect=ne,e.drop=Ce,e.each=Qn,e.eachRight=Jn,e.extend=or,e.methods=wn,e.object=Le,e.select=Kn,e.tail=Ce,e.unique=Te,e.unzip=Se,Ze(e),e.clone=dn,e.cloneDeep=gn,e.contains=Vn,e.escape=Qe,e.every=Yn,e.find=Hn,e.findIndex=de,e.findKey=yn,e.findLast=Xn,e.findLastIndex=ge,e.findLastKey=mn,e.has=xn,e.identity=Je,e.indexOf=me,e.isArguments=hn,e.isArray=Jt,e.isBoolean=jn,e.isDate=En,e.isElement=Cn,e.isEmpty=Nn,e.isEqual=In,e.isFinite=Tn,e.isFunction=On,e.isNaN=Sn,e.isNull=Ln,e.isNumber=Mn,e.isObject=Rn,e.isPlainObject=fr,e.isRegExp=Bn,e.isString=Dn,e.isUndefined=Fn,e.lastIndexOf=xe,e.mixin=Ze,e.noConflict=nt,e.noop=et,e.now=gr,e.parseInt=vr,e.random=rt,e.reduce=re,e.reduceRight=ie,e.result=it,e.runInContext=v,e.size=ce,e.some=fe,e.sortedIndex=Ne,e.template=ot,e.unescape=ut,e.uniqueId=ct,e.all=Yn,e.any=fe,e.detect=Hn,e.findWhere=Hn,e.foldl=re,e.foldr=ie,e.include=Vn,e.inject=re,Ze(function(){var n={};return cr(e,function(t,r){e.prototype[r]||(n[r]=t)}),n}(),!1),e.first=ve,e.last=we,e.sample=ae,e.take=ve,e.head=ve,cr(e,function(n,r){var i="sample"!==r;e.prototype[r]||(e.prototype[r]=function(e,r){var o=this.__chain__,a=n(this.__wrapped__,e,r);return o||null!=e&&(!r||i&&"function"==typeof e)?new t(a,o):a})}),e.VERSION="2.4.2",e.prototype.chain=st,e.prototype.toString=pt,e.prototype.value=ht,e.prototype.valueOf=ht,Qn(["join","pop","shift"],function(n){var r=jt[n];e.prototype[n]=function(){var n=this.__chain__,e=r.apply(this.__wrapped__,arguments);return n?new t(e,n):e}}),Qn(["push","reverse","sort","unshift"],function(n){var t=jt[n];e.prototype[n]=function(){return t.apply(this.__wrapped__,arguments),this}}),Qn(["concat","slice","splice"],function(n){var r=jt[n];e.prototype[n]=function(){return new t(r.apply(this.__wrapped__,arguments),this.__chain__)}}),e}var y,m=[],b=[],_=0,w=+new Date+"",x=75,k=40,j=" 	\f \ufeff\n\r\u2028\u2029 ᠎             　",E=/\b__p \+= '';/g,C=/\b(__p \+=) '' \+/g,N=/(__e\(.*?\)|\b__t\)) \+\n'';/g,I=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,T=/\w*$/,O=/^\s*function[ \n\r\t]+\w/,R=/<%=([\s\S]+?)%>/g,S=RegExp("^["+j+"]*0+(?=.$)"),L=/($^)/,M=/\bthis\b/,B=/['\n\r\t\u2028\u2029\\]/g,D=["Array","Boolean","Date","Function","Math","Number","Object","RegExp","String","_","attachEvent","clearTimeout","isFinite","isNaN","parseInt","setTimeout"],F=0,A="[object Arguments]",P="[object Array]",U="[object Boolean]",q="[object Date]",z="[object Function]",W="[object Number]",$="[object Object]",G="[object RegExp]",V="[object String]",Y={};Y[z]=!1,Y[A]=Y[P]=Y[U]=Y[q]=Y[W]=Y[$]=Y[G]=Y[V]=!0;var K={leading:!1,maxWait:0,trailing:!1},H={configurable:!1,enumerable:!1,value:null,writable:!1},X={"boolean":!1,"function":!0,object:!0,number:!1,string:!1,undefined:!1},Q={"\\":"\\","'":"'","\n":"n","\r":"r","	":"t","\u2028":"u2028","\u2029":"u2029"},J=X[typeof window]&&window||this,Z=X[typeof r]&&r&&!r.nodeType&&r,nn=X[typeof t]&&t&&!t.nodeType&&t,en=nn&&nn.exports===Z&&Z,tn=X[typeof e]&&e;!tn||tn.global!==tn&&tn.window!==tn||(J=tn);var rn=v();"function"==typeof n&&"object"==typeof n.amd&&n.amd?(J._=rn,n(function(){return rn})):Z&&nn?en?(nn.exports=rn)._=rn:Z._=rn:J._=rn}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)});
//# sourceMappingURL=dagre-d3.min-cd33b8e2.js.map
;
/*!
 * jQuery JavaScript Library v1.11.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-28T16:19Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var deletedIds = [];

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.11.3",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( support.ownLast ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.0-pre
 * http://sizzlejs.com/
 *
 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-16
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];
	nodeType = context.nodeType;

	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	if ( !seed && documentIsHTML ) {

		// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
		if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType !== 1 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;
	parent = doc.defaultView;

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Support tests
	---------------------------------------------------------------------- */
	documentIsHTML = !isXML( doc );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\f]' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !(--remaining) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};


var strundefined = typeof undefined;



// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownLast = i !== "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery(function() {
	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {
		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== strundefined ) {
		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {
			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
});




(function() {
	var div = document.createElement( "div" );

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( elem ) {
	var noData = jQuery.noData[ (elem.nodeName + " ").toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute("classid") === noData;
};


var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,
		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[0],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};



// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[0], key ) : emptyGet;
};
var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	// Minified: var a,b,c
	var input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		fragment = document.createDocumentFragment();

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );
	div.innerHTML = "<input type='radio' checked='checked' name='t'/>";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	support.noCloneEvent = true;
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}
})();


(function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox 23+ (lack focusin event)
	for ( i in { submit: true, change: true, focusin: true }) {
		eventName = "on" + i;

		if ( !(support[ i + "Bubbles" ] = eventName in window) ) {
			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i + "Bubbles" ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!support.noCloneEvent || !support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = (rtagName.exec( elem ) || [ "", "" ])[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ (rtagName.exec( value ) || [ "", "" ])[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}


(function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {
			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== strundefined ) {
			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

})();
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );



var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		if ( elem.ownerDocument.defaultView.opener ) {
			return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
		}

		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			var condition = conditionFn();

			if ( condition == null ) {
				// The test was not ready at this point; screw the hook this time
				// but check again when needed next time.
				return;
			}

			if ( condition ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	// Minified: var b,c,d,e,f,g, h,i
	var div, style, a, pixelPositionVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal;

	// Setup
	div = document.createElement( "div" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];
	style = a && a.style;

	// Finish early in limited (non-browser) environments
	if ( !style ) {
		return;
	}

	style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = style.boxSizing === "" || style.MozBoxSizing === "" ||
		style.WebkitBoxSizing === "";

	jQuery.extend(support, {
		reliableHiddenOffsets: function() {
			if ( reliableHiddenOffsetsVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		// Support: Android 2.3
		reliableMarginRight: function() {
			if ( reliableMarginRightVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		}
	});

	function computeStyleTests() {
		// Minified: var b,c,d,j
		var div, body, container, contents;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {
			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = false;
		reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			pixelPositionVal = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			boxSizingReliableVal =
				( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents, null ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		contents = div.getElementsByTagName( "td" );
		contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
		reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
		if ( reliableHiddenOffsetsVal ) {
			contents[ 0 ].style.display = "";
			contents[ 1 ].style.display = "none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
		}

		body.removeChild( container );
	}

})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,

	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	// Minified: var a,b,c,d,e
	var input, div, select, a, opt;

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName("a")[ 0 ];

	// First batch of tests.
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
})();


var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) >= 0 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// Retrieve booleans specially
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {

	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		} :
		function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return (ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

// Support: Safari, IE9+
// mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {
	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {
		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	}) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
		(!support.reliableHiddenOffsets() &&
			((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?
	// Support: IE6+
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		return !this.isLocal &&

			// Support: IE7-8
			// oldIE XHR does not support non-RFC2616 methods (#13240)
			// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
			// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
			// Although this check for six methods instead of eight
			// since IE also does not support "trace" and "connect"
			/^(get|post|head|put|delete|options)$/i.test( this.type ) &&

			createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	});
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( options ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open( options.type, options.url, options.async, options.username, options.password );

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch( e ) {
									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;
								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					if ( !options.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};





var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray("auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));
// This file is autogenerated via the `commonjs` Grunt task. You can require() this file in a CommonJS environment.
require('../../js/transition.js')
require('../../js/alert.js')
require('../../js/button.js')
require('../../js/carousel.js')
require('../../js/collapse.js')
require('../../js/dropdown.js')
require('../../js/modal.js')
require('../../js/tooltip.js')
require('../../js/popover.js')
require('../../js/scrollspy.js')
require('../../js/tab.js')
require('../../js/affix.js')
;
provn_dagre = function(provnparser, provn) {

  var encode_entities = function(text) {
      var d = document.createElement('div');
      d.textContent = text;
      return d.innerHTML;
  }

  var errors = [];

  show_attributes = true;
  this.provnparser = provnparser;

  var g = new dagreD3.graphlib.Graph().setGraph({});
  this.g = g;

  var width = 1000;
  var svg = d3.select('#diagram').append('svg')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + width)
      .attr('class', 'prov-svg')

  var inner = svg.append('g');

  var render = new dagreD3.render();


  // Set up zoom support
  var zoom = d3.behavior.zoom().on("zoom", function() {
        inner.attr("transform", "translate(" + d3.event.translate + ")" +
                                    "scale(" + d3.event.scale + ")");
      });
  svg.call(zoom);

  var show_errors = function(errors) {
      var errorDiv = document.getElementById('provn-errors');
      if (errorDiv) {
          errorDiv.style.display = 'block';
          errorDiv.innerHTML = '<ul>\n' + errors.map(function (e) {
              return '  <li>' + encode_entities(e) + '</li>'
          }).join('\n') + '\n</ul>';
      } else {
          errors.forEach(function (e) { console.log(e); });
      }
  }

  this.init_diagram = function(provn) {
      errors = [];
      var errorDiv = document.getElementById('provn-errors');
      if (errorDiv) errorDiv.style.display = 'none';
      g.setGraph({});
      try {
          var nodeslinks = this.provnparser.parse(document.getElementById('provn').childNodes[0].textContent);
      } catch (err) {
          console.log(err);
          var message = err.message;
          if (err.location) {
              message = message + '\n(at line ' + err.location.start.line + ', column ' + err.location.start.column + ')';
          }
          show_errors([message]);
          return;
      }

      var nd = nodeslinks.nodes;

      var nodes = Object.keys(nd).map(function (k) {
          var node = nd[k];
          g.setNode(k, node);
          if (show_attributes && node.label && node.attributes) {
              node.labelType = 'html';
              node.label = '<table class="provtable"><thead><tr><th colspan="2">' + encode_entities(node.label).replace(/^cg:/, '') + '</th></tr></thead>\n' +
                  node.attributes.map(function (av) {
                      return "<tr><td>" + encode_entities(av.attribute).replace(/^prov:/, '') + "</td><td>" + encode_entities(av.value).replace(/^prov:/, '') + "</td></tr>";
                  }).join('\n') + "</table>\n";
          }
      });

      nodeslinks.links.forEach(function (link) {
          if (!nd[link.source_node]) {
              errors.push("Reference to non-existant node: " + link.source_node);
              return;
          }
          if (!nd[link.target_node]) {
              errors.push("Reference to non-existant node: " + link.target_node);
              return;
          }
          g.setEdge(link.source_node, link.target_node, { label: link.label });
      });

      if (errors.length) {
          show_errors(errors);
      }
  }

  this.update_diagram = function() {

    render(inner, g);

    if (g.nodes().length == 0) return;

    // Center the graph
    var initialScale = parseInt(svg.style("width")) / g.graph().width;
    zoom
      .translate([(parseInt(svg.style("width")) - g.graph().width * initialScale) / 2, 20])
      .scale(initialScale)
      .event(svg);

    var height = g.graph().height * initialScale + 40;
    svg.attr("viewBox", "0 0 " + width + " " + height);
    d3.select('#diagram').style('padding-bottom', Math.round(100*height/width) + '%');
    // svg.attr('height', height+40);

  }

  if (provn) {
    this.init_diagram(provn);
    this.update_diagram();
  }

}

var provn_dagre = new provn_dagre(provnparser, document.getElementById('provn').innerHTML);
provnparser = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;

    this.name     = "SyntaxError";
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleIndices = { document: 0 },
        peg$startRuleIndex   = 0,

        peg$consts = [
          "document",
          { type: "literal", value: "document", description: "\"document\"" },
          "endDocument",
          { type: "literal", value: "endDocument", description: "\"endDocument\"" },
          function(type, namespaces, expressions, bundles) {
                  return {
                      nodes: nodes, links: links
                  };
              },
          "bundle",
          { type: "literal", value: "bundle", description: "\"bundle\"" },
          "endBundle",
          { type: "literal", value: "endBundle", description: "\"endBundle\"" },
          function(i, n, e) { return { type: 'bundle', identifier: i, namespaces: n, expressions: e }; },
          function(expression) { return expression; },
          "activity",
          { type: "literal", value: "activity", description: "\"activity\"" },
          "agent",
          { type: "literal", value: "agent", description: "\"agent\"" },
          "entity",
          { type: "literal", value: "entity", description: "\"entity\"" },
          "(",
          { type: "literal", value: "(", description: "\"(\"" },
          ")",
          { type: "literal", value: ")", description: "\")\"" },
          function(expressionType, identifier, attributeValuePairs) {
                  return make_node(expressionType, identifier, attributeValuePairs);
              },
          "wasGeneratedBy",
          { type: "literal", value: "wasGeneratedBy", description: "\"wasGeneratedBy\"" },
          "used",
          { type: "literal", value: "used", description: "\"used\"" },
          "wasInvalidatedBy",
          { type: "literal", value: "wasInvalidatedBy", description: "\"wasInvalidatedBy\"" },
          function(expressionType, optionalIdentifier, subject, o, t) { return {object: o, time: t}; },
          function(expressionType, optionalIdentifier, subject, objectTime, attributeValuePairs) {
                  if (objectTime) return make_link(expressionType, subject, objectTime.object);
                  // FIXME -- not sure what to do if objectTime is absent
              },
          "wasInformedBy",
          { type: "literal", value: "wasInformedBy", description: "\"wasInformedBy\"" },
          "wasAttributedTo",
          { type: "literal", value: "wasAttributedTo", description: "\"wasAttributedTo\"" },
          "wasInfluencedBy",
          { type: "literal", value: "wasInfluencedBy", description: "\"wasInfluencedBy\"" },
          function(expressionType, optionalIdentifier, subject, object, attributeValuePairs) {
                  return make_link(expressionType, subject, object);
              },
          "alternateOf",
          { type: "literal", value: "alternateOf", description: "\"alternateOf\"" },
          "specializationOf",
          { type: "literal", value: "specializationOf", description: "\"specializationOf\"" },
          "hadMember",
          { type: "literal", value: "hadMember", description: "\"hadMember\"" },
          function(expressionType, subject, object) {
                  return make_link(expressionType, subject, object);
              },
          "wasStartedBy",
          { type: "literal", value: "wasStartedBy", description: "\"wasStartedBy\"" },
          function(expressionType, optionalIdentifier, activity, trigger, starter, time) { return { trigger: trigger, starter: starter, time: time }; },
          function(expressionType, optionalIdentifier, activity, optionals, attributeValuePairs) {
                  return make_multi_link(activity, expressionType, { trigger: optionals.trigger, starter: optionals.starter }, attributeValuePairs);
              },
          "wasEndedBy",
          { type: "literal", value: "wasEndedBy", description: "\"wasEndedBy\"" },
          function(expressionType, optionalIdentifier, activity, trigger, ender, time) { return { trigger: trigger, ender: ender, time: time }; },
          function(expressionType, optionalIdentifier, activity, optionals, attributeValuePairs) {
                  return make_multi_link(activity, expressionType, { trigger: optionals.trigger, ender: optionals.ender }, attributeValuePairs);
              },
          "wasAssociatedWith",
          { type: "literal", value: "wasAssociatedWith", description: "\"wasAssociatedWith\"" },
          function(expressionType, optionalIdentifier, activity, agent, plan) { return { agent: agent, plan: plan }; },
          function(expressionType, optionalIdentifier, activity, optionals, attributeValuePairs) {
                  if (optionals.plan && optionals.plan != '-') {
                      return make_multi_link(activity, expressionType, { agent: optionals.agent, plan: optionals.plan }, attributeValuePairs);
                  } else {
                      return make_link(expressionType, activity, optionals.agent);
                  }
              },
          "actedOnBehalfOf",
          { type: "literal", value: "actedOnBehalfOf", description: "\"actedOnBehalfOf\"" },
          function(expressionType, optionalIdentifier, agent, actedOnBehalfOf, _) { return _; },
          function(expressionType, optionalIdentifier, agent, actedOnBehalfOf, inContextOfActivity, attributeValuePairs) {
                  if (inContextOfActivity) {
                      return make_multi_link(agent, expressionType, { responsibleParty: actedOnBehalfOf, inContextOfActivity: inContextOfActivity }, attributeValuePairs);
                  } else {
                      make_link(expressionType, entity, actedOnBehalfOf);
                  }
              },
          "wasDerivedFrom",
          { type: "literal", value: "wasDerivedFrom", description: "\"wasDerivedFrom\"" },
          function(expressionType, optionalIdentifier, entity, wasDerivedFrom, activity, generation, usage) { return { activity: activity, generation: generation, usage: usage }; },
          function(expressionType, optionalIdentifier, entity, wasDerivedFrom, optionals, attributeValuePairs) {
                  if (optionals) {
                      return make_multi_link(entity, expressionType, {activity: optionals.activity, generation: optionals.generation, usage: optionals.usage}, attributeValuePairs);
                  } else {
                      return make_link(expressionType, entity, wasDerivedFrom);
                  }
              },
          "{",
          { type: "literal", value: "{", description: "\"{\"" },
          "}",
          { type: "literal", value: "}", description: "\"}\"" },
          "[",
          { type: "literal", value: "[", description: "\"[\"" },
          "]",
          { type: "literal", value: "]", description: "\"]\"" },
          function(_) { return _; },
          "=",
          { type: "literal", value: "=", description: "\"=\"" },
          function(a, v) { return { attribute: a, value: v }; },
          "-",
          { type: "literal", value: "-", description: "\"-\"" },
          ";",
          { type: "literal", value: ";", description: "\";\"" },
          "%%",
          { type: "literal", value: "%%", description: "\"%%\"" },
          function(literal, datatype) { return { literal: literal, datatype: datatype }; },
          function(d, n) { return { defaultNamespace: d, namespaces: n }; },
          "prefix",
          { type: "literal", value: "prefix", description: "\"prefix\"" },
          function(p, n) { return { prefix: p, namespace: n }; },
          "default",
          { type: "literal", value: "default", description: "\"default\"" },
          ":",
          { type: "literal", value: ":", description: "\":\"" },
          /^[0-9]/,
          { type: "class", value: "[0-9]", description: "[0-9]" },
          ".",
          { type: "literal", value: ".", description: "\".\"" },
          /^[\/@~&+*?#$!]/,
          { type: "class", value: "[/@~&+*?#$!]", description: "[/@~&+*?#$!]" },
          "\\",
          { type: "literal", value: "\\", description: "\"\\\\\"" },
          /^[='(),\-:;[\].]/,
          { type: "class", value: "[=\\'(),\\-:;\\[\\]\\.]", description: "[=\\'(),\\-:;\\[\\]\\.]" },
          "%",
          { type: "literal", value: "%", description: "\"%\"" },
          /^[0-9A-Fa-f]/,
          { type: "class", value: "[0-9A-Fa-f]", description: "[0-9A-Fa-f]" },
          "'",
          { type: "literal", value: "'", description: "\"'\"" },
          function(qname) { return qname; },
          "T",
          { type: "literal", value: "T", description: "\"T\"" },
          "Z",
          { type: "literal", value: "Z", description: "\"Z\"" },
          "+",
          { type: "literal", value: "+", description: "\"+\"" },
          /^[A-Z]/,
          { type: "class", value: "[A-Z]", description: "[A-Z]" },
          /^[a-z]/,
          { type: "class", value: "[a-z]", description: "[a-z]" },
          /^[\xC0-\xD6]/,
          { type: "class", value: "[\\u00C0-\\u00D6]", description: "[\\u00C0-\\u00D6]" },
          /^[\xD8-\xF6]/,
          { type: "class", value: "[\\u00D8-\\u00F6]", description: "[\\u00D8-\\u00F6]" },
          /^[\xF8-\u02FF]/,
          { type: "class", value: "[\\u00F8-\\u02FF]", description: "[\\u00F8-\\u02FF]" },
          /^[\u0370-\u037D]/,
          { type: "class", value: "[\\u0370-\\u037D]", description: "[\\u0370-\\u037D]" },
          /^[\u037F-\u1FFF]/,
          { type: "class", value: "[\\u037F-\\u1FFF]", description: "[\\u037F-\\u1FFF]" },
          /^[\u200C-\u200D]/,
          { type: "class", value: "[\\u200C-\\u200D]", description: "[\\u200C-\\u200D]" },
          /^[\u2070-\u218F]/,
          { type: "class", value: "[\\u2070-\\u218F]", description: "[\\u2070-\\u218F]" },
          /^[\u2C00-\u2FEF]/,
          { type: "class", value: "[\\u2C00-\\u2FEF]", description: "[\\u2C00-\\u2FEF]" },
          /^[\u3001-\uD7FF]/,
          { type: "class", value: "[\\u3001-\\uD7FF]", description: "[\\u3001-\\uD7FF]" },
          /^[\uF900-\uFDCF]/,
          { type: "class", value: "[\\uF900-\\uFDCF]", description: "[\\uF900-\\uFDCF]" },
          /^[\uFDF0-\uFFFD]/,
          { type: "class", value: "[\\uFDF0-\\uFFFD]", description: "[\\uFDF0-\\uFFFD]" },
          "_",
          { type: "literal", value: "_", description: "\"_\"" },
          /^[\xB7\u0300-\u036F\u203F-\u2040]/,
          { type: "class", value: "[\\u00B7\\u0300-\\u036f\\u203f-\\u2040]", description: "[\\u00B7\\u0300-\\u036f\\u203f-\\u2040]" },
          /^[\u0300-\u036F]/,
          { type: "class", value: "[\\u0300-\\u036F]", description: "[\\u0300-\\u036F]" },
          /^[\u203F-\u2040]/,
          { type: "class", value: "[\\u203F-\\u2040]", description: "[\\u203F-\\u2040]" },
          /^[^"\\\n\r]/,
          { type: "class", value: "[^\\u0022\\u005C\\u000A\\u000D]", description: "[^\\u0022\\u005C\\u000A\\u000D]" },
          function(literal) { return literal; },
          "\"\"\"",
          { type: "literal", value: "\"\"\"", description: "\"\\\"\\\"\\\"\"" },
          "\"",
          { type: "literal", value: "\"", description: "\"\\\"\"" },
          "\"\"",
          { type: "literal", value: "\"\"", description: "\"\\\"\\\"\"" },
          /^[^"\\]/,
          { type: "class", value: "[^\"\\\\]", description: "[^\"\\\\]" },
          /^[tbnrf'"]/,
          { type: "class", value: "[tbnrf\\'\\\"]", description: "[tbnrf\\'\\\"]" },
          "@",
          { type: "literal", value: "@", description: "\"@\"" },
          /^[a-zA-Z]/,
          { type: "class", value: "[a-zA-Z]", description: "[a-zA-Z]" },
          /^[a-zA-Z0-9]/,
          { type: "class", value: "[a-zA-Z0-9]", description: "[a-zA-Z0-9]" },
          "<",
          { type: "literal", value: "<", description: "\"<\"" },
          /^[^<>"{}|\^`\0- ]/,
          { type: "class", value: "[^<>\"{}|^`\\u0000-\\u0020]", description: "[^<>\"{}|^`\\u0000-\\u0020]" },
          ">",
          { type: "literal", value: ">", description: "\">\"" },
          function() { return text(); },
          "//",
          { type: "literal", value: "//", description: "\"//\"" },
          /^[^\r\n]/,
          { type: "class", value: "[^\\r\\n]", description: "[^\\r\\n]" },
          /^[\r\n]/,
          { type: "class", value: "[\\r\\n]", description: "[\\r\\n]" },
          "/*",
          { type: "literal", value: "/*", description: "\"/*\"" },
          "*/",
          { type: "literal", value: "*/", description: "\"*/\"" },
          { type: "any", description: "any character" },
          ",",
          { type: "literal", value: ",", description: "\",\"" },
          /^[ \r\t\n]/,
          { type: "class", value: "[ \\r\\t\\n]", description: "[ \\r\\t\\n]" },
          function() { return undefined; }
        ],

        peg$bytecode = [
          peg$decode("!7X+\xA4#. \"\"2 3!+\x95$7X+\x8C$7:*\" \";+~$7X+u$=7\",#&7\"\"+e$7X+\\$=7!,#&7!\"+L$7X+C$.\"\"\"2\"3#+4$7X++$4+6$+$)'%#%$+#<$*#<$)#<$(#<$'#<$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!.%\"\"2%3&+\x8D#7X+\x84$75+{$7X+r$7:*\" \";+d$7X+[$=7\",#&7\"\"+K$7X+B$.'\"\"2'3(+3$7X+*$4*6)*#'%#%$*#<$)#<$(#<$'#<$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!7#*S \"7$*M \"7%*G \"7'*A \"7(*; \"7)*5 \"7**/ \"7+*) \"7&*# \"7,+1#7X+($4\"6*\"!!%$\"#<\"#<"),
          peg$decode("!.+\"\"2+3,*5 \".-\"\"2-3.*) \"./\"\"2/30+\x92#.1\"\"2132+\x83$75+z$!7W+>#72+5$7W+,$72+#$'$%$$#<$##<$\"#<\"#<*\" \";+G$7/*\" \";+9$.3\"\"2334+*$4&65&#%#!%$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!.6\"\"2637*5 \".8\"\"2839*) \".:\"\"2:3;+\xAB#.1\"\"2132+\x9C$73*\" \";+\x8E$75+\x85$!7W+G#74+>$7W+5$72+,$4$6<$%(&%\" %$$#<$##<$\"#<\"#<*\" \";+I$7/*\" \";+;$.3\"\"2334+,$4'6='%&$#\"!%$'#<$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!.>\"\"2>3?*5 \".@\"\"2@3A*) \".B\"\"2B3C+\x81#.1\"\"2132+r$73*\" \";+d$75+[$7W+R$74+I$7/*\" \";+;$.3\"\"2334+,$4(6D(%'%$\"!%$(#<$'#<$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!.E\"\"2E3F*5 \".G\"\"2G3H*) \".I\"\"2I3J+c#.1\"\"2132+T$75+K$7W+B$75+9$.3\"\"2334+*$4&6K&#%#!%$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!.L\"\"2L3M+\xBE#.1\"\"2132+\xAF$73*\" \";+\xA1$75+\x98$!7W+Z#74+Q$7W+H$74+?$7W+6$72+-$4&6N&&*('$\" %$&#<$%#<$$#<$##<$\"#<\"#<*\" \";+I$7/*\" \";+;$.3\"\"2334+,$4'6O'%&$#\"!%$'#<$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!.P\"\"2P3Q+\xBE#.1\"\"2132+\xAF$73*\" \";+\xA1$75+\x98$!7W+Z#74+Q$7W+H$74+?$7W+6$72+-$4&6R&&*('$\" %$&#<$%#<$$#<$##<$\"#<\"#<*\" \";+I$7/*\" \";+;$.3\"\"2334+,$4'6S'%&$#\"!%$'#<$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!.T\"\"2T3U+\xAB#.1\"\"2132+\x9C$73*\" \";+\x8E$75+\x85$!7W+G#74+>$7W+5$74+,$4$6V$%(&%\" %$$#<$##<$\"#<\"#<*\" \";+I$7/*\" \";+;$.3\"\"2334+,$4'6W'%&$#\"!%$'#<$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!.X\"\"2X3Y+\xAC#.1\"\"2132+\x9D$73*\" \";+\x8F$75+\x86$7W+}$75+t$!7W+5#74+,$4\"6Z\"%(&%# %$\"#<\"#<*\" \";+J$7/*\" \";+<$.3\"\"2334+-$4)6[)&(&%#\"!%$)#<$(#<$'#<$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!.\\\"\"2\\3]+\xD2#.1\"\"2132+\xC3$73*\" \";+\xB5$75+\xAC$7W+\xA3$75+\x9A$!7W+[#74+R$7W+I$74+@$7W+7$74+.$4&6^&',*)'$\" %$&#<$%#<$$#<$##<$\"#<\"#<*\" \";+J$7/*\" \";+<$.3\"\"2334+-$4)6_)&(&%#\"!%$)#<$(#<$'#<$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!7=+\xF5#.1\"\"2132+\xE6$73*\" \";+\xD8$=!7-+]#!7W+8#!87-9+##\"#:\"\"<+#$'\"%$\"#<\"#<*/ \"!87/9+##\"#:\"\"<+#$'\"%$\"#<\"#<,g&!7-+]#!7W+8#!87-9+##\"#:\"\"<+#$'\"%$\"#<\"#<*/ \"!87/9+##\"#:\"\"<+#$'\"%$\"#<\"#<\"+@$7/*\" \";+2$.3\"\"2334+#$'&%$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("74*5 \"77*/ \"7H*) \"7,*# \"7."),
          peg$decode("!.`\"\"2`3a+\xDC#=!7-+c#!7W+8#!87-9+##\"#:\"\"<+#$'\"%$\"#<\"#<*5 \"!8.b\"\"2b3c9+##\"#:\"\"<+#$'\"%$\"#<\"#<+p#,m&!7-+c#!7W+8#!87-9+##\"#:\"\"<+#$'\"%$\"#<\"#<*5 \"!8.b\"\"2b3c9+##\"#:\"\"<+#$'\"%$\"#<\"#<\"\"\"<+2$.b\"\"2b3c+#$'#%$##<$\"#<\"#<*\xEC \"!.1\"\"2132+\xDC#=!7-+c#!7W+8#!87-9+##\"#:\"\"<+#$'\"%$\"#<\"#<*5 \"!8.3\"\"23349+##\"#:\"\"<+#$'\"%$\"#<\"#<+p#,m&!7-+c#!7W+8#!87-9+##\"#:\"\"<+#$'\"%$\"#<\"#<*5 \"!8.3\"\"23349+##\"#:\"\"<+#$'\"%$\"#<\"#<\"\"\"<+2$.3\"\"2334+#$'#%$##<$\"#<\"#<"),
          peg$decode("!7W+j#.d\"\"2d3e+[$7X+R$70+I$7X+@$.f\"\"2f3g+1$7X+($4'6h'!#%$'#<$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("=!71+\x84#7X+{$!7W+8#!8719+##\"#:\"\"<+#$'\"%$\"#<\"#<*H \"!8!7X+2#.f\"\"2f3g+#$'\"%$\"#<\"#<9+##\"#:\"\"<+($4#6h#!\"%$##<$\"#<\"#<+\x91#,\x8E&!71+\x84#7X+{$!7W+8#!8719+##\"#:\"\"<+#$'\"%$\"#<\"#<*H \"!8!7X+2#.f\"\"2f3g+#$'\"%$\"#<\"#<9+##\"#:\"\"<+($4#6h#!\"%$##<$\"#<\"#<\"\"\"<"),
          peg$decode("!76+S#7X+J$.i\"\"2i3j+;$7X+2$77+)$4%6k%\"$ %$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("7H*) \".l\"\"2l3m"),
          peg$decode("!7X+R#74+I$7X+@$.n\"\"2n3o+1$7X+($4%6h%!#%$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!7X+=#75*) \".l\"\"2l3m+($4\"6h\"! %$\"#<\"#<"),
          peg$decode("!7=+\"!\"(%"),
          peg$decode("!7=+\"!\"(%"),
          peg$decode("78*# \"79"),
          peg$decode("!7D+A#.p\"\"2p3q+2$7=+)$4#6r#\"\" %$##<$\"#<\"#<"),
          peg$decode("!!7D+,#7R+#$'\"%$\"#<\"#<+\"!\"(%*/ \"7D*) \"7E*# \"7F"),
          peg$decode("!7<*/ \"!87<9*##\"\":\"#<+9#=7;,#&7;\"+)$4\"6s\"\"! %$\"#<\"#<"),
          peg$decode("!.t\"\"2t3u+M#7X+D$7L+;$7X+2$7S+)$4%6v%\"\" %$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("!.w\"\"2w3x+5#7X+,$7S+#$'#%$##<$\"#<\"#<"),
          peg$decode("!!7L+7#.y\"\"2y3z+($4\"6h\"!!%$\"#<\"#<*\" \";+,#7?+#$'\"%$\"#<\"#<*Q \"!7L+G#.y\"\"2y3z+8$!87?9*##\"\":\"#<+#$'#%$##<$\"#<\"#<"),
          peg$decode("7N*# \"7@"),
          peg$decode("!!7K*/ \"0{\"\"1!3|*# \"7@+\xAF#=7>*[ \"!=.}\"\"2}3~+,#,)&.}\"\"2}3~\"\"\"<+8#!87>9+##\"#:\"\"<+#$'\"%$\"#<\"#<,a&7>*[ \"!=.}\"\"2}3~+,#,)&.}\"\"2}3~\"\"\"<+8#!87>9+##\"#:\"\"<+#$'\"%$\"#<\"#<\"+#$'\"%$\"#<\"#<+\"!\"(%"),
          peg$decode("0\"\"1!3\x80*) \"7B*# \"7A"),
          peg$decode("!.\x81\"\"2\x813\x82+2#0\x83\"\"1!3\x84+#$'\"%$\"#<\"#<"),
          peg$decode("!.\x85\"\"2\x853\x86+5#7C+,$7C+#$'#%$##<$\"#<\"#<"),
          peg$decode("0\x87\"\"1!3\x88"),
          peg$decode("7O*# \"7P"),
          peg$decode("!.l\"\"2l3m*\" \";+9#=7G+&#,#&7G\"\"\"<+#$'\"%$\"#<\"#<"),
          peg$decode("!.\x89\"\"2\x893\x8A+G#!7=+\"!\"(%+7$.\x89\"\"2\x893\x8A+($4#6\x8B#!!%$##<$\"#<\"#<"),
          peg$decode("0{\"\"1!3|"),
          peg$decode("!!7G+\u014A#7G+\u0141$7G+\u0138$7G+\u012F$.l\"\"2l3m+\u0120$7G+\u0117$7G+\u010E$.l\"\"2l3m+\xFF$7G+\xF6$7G+\xED$.\x8C\"\"2\x8C3\x8D+\xDE$7G+\xD5$7G+\xCC$.y\"\"2y3z+\xBD$7G+\xB4$7G+\xAB$.y\"\"2y3z+\x9C$7G+\x93$7G+\x8A$!.}\"\"2}3~+R#7G+I$!7G+1#7G*\" \";+#$'\"%$\"#<\"#<*\" \";+#$'#%$##<$\"#<\"#<*\" \";+=$.\x8E\"\"2\x8E3\x8F*# \"7I*\" \";+#$'5%$5#<$4#<$3#<$2#<$1#<$0#<$/#<$.#<$-#<$,#<$+#<$*#<$)#<$(#<$'#<$&#<$%#<$$#<$##<$\"#<\"#<+\"!\"(%"),
          peg$decode("!.\x90\"\"2\x903\x91*) \".l\"\"2l3m+V#7G+M$7G+D$.y\"\"2y3z+5$7G+,$7G+#$'&%$&#<$%#<$$#<$##<$\"#<\"#<"),
          peg$decode("0\x92\"\"1!3\x93*\xAD \"0\x94\"\"1!3\x95*\xA1 \"0\x96\"\"1!3\x97*\x95 \"0\x98\"\"1!3\x99*\x89 \"0\x9A\"\"1!3\x9B*} \"0\x9C\"\"1!3\x9D*q \"0\x9E\"\"1!3\x9F*e \"0\xA0\"\"1!3\xA1*Y \"0\xA2\"\"1!3\xA3*M \"0\xA4\"\"1!3\xA5*A \"0\xA6\"\"1!3\xA7*5 \"0\xA8\"\"1!3\xA9*) \"0\xAA\"\"1!3\xAB"),
          peg$decode("7J*) \".\xAC\"\"2\xAC3\xAD"),
          peg$decode("!!7J+\x8B#=7N*I \"!=.}\"\"2}3~,)&.}\"\"2}3~\"+,#7N+#$'\"%$\"#<\"#<,O&7N*I \"!=.}\"\"2}3~,)&.}\"\"2}3~\"+,#7N+#$'\"%$\"#<\"#<\"+#$'\"%$\"#<\"#<+\"!\"(%"),
          peg$decode("!7K*) \"0{\"\"1!3|+c#=7K*5 \"0{\"\"1!3|*) \"0\xAE\"\"1!3\xAF,;&7K*5 \"0{\"\"1!3|*) \"0\xAE\"\"1!3\xAF\"+#$'\"%$\"#<\"#<"),
          peg$decode("7K*M \".l\"\"2l3m*A \"0{\"\"1!3|*5 \"0\xB0\"\"1!3\xB1*) \"0\xB2\"\"1!3\xB3"),
          peg$decode("!7V+`#!=0\xB4\"\"1!3\xB5*# \"7Q,/&0\xB4\"\"1!3\xB5*# \"7Q\"+\"!\"(%+1$7V+($4#6\xB6#!!%$##<$\"#<\"#<"),
          peg$decode("!.\xB7\"\"2\xB73\xB8+\xBA#!=!.\xB9\"\"2\xB93\xBA*) \".\xBB\"\"2\xBB3\xBC*\" \";+8#0\xBD\"\"1!3\xBE*# \"7Q+#$'\"%$\"#<\"#<,Y&!.\xB9\"\"2\xB93\xBA*) \".\xBB\"\"2\xBB3\xBC*\" \";+8#0\xBD\"\"1!3\xBE*# \"7Q+#$'\"%$\"#<\"#<\"+\"!\"(%+7$.\xB7\"\"2\xB73\xB8+($4#6\xB6#!!%$##<$\"#<\"#<"),
          peg$decode("!.\x81\"\"2\x813\x82+2#0\xBF\"\"1!3\xC0+#$'\"%$\"#<\"#<"),
          peg$decode("!.\xC1\"\"2\xC13\xC2+\xB9#=0\xC3\"\"1!3\xC4+,#,)&0\xC3\"\"1!3\xC4\"\"\"<+\x97$=!.l\"\"2l3m+E#=0\xC5\"\"1!3\xC6+,#,)&0\xC5\"\"1!3\xC6\"\"\"<+#$'\"%$\"#<\"#<,U&!.l\"\"2l3m+E#=0\xC5\"\"1!3\xC6+,#,)&0\xC5\"\"1!3\xC6\"\"\"<+#$'\"%$\"#<\"#<\"+#$'#%$##<$\"#<\"#<"),
          peg$decode("!.\xC7\"\"2\xC73\xC8+\x9A#=0\xC9\"\"1!3\xCA*A \".d\"\"2d3e*5 \".\x81\"\"2\x813\x82*) \".f\"\"2f3g,M&0\xC9\"\"1!3\xCA*A \".d\"\"2d3e*5 \".\x81\"\"2\x813\x82*) \".f\"\"2f3g\"+6$.\xCB\"\"2\xCB3\xCC+'$4#6\xCD# %$##<$\"#<\"#<"),
          peg$decode("!.\xCE\"\"2\xCE3\xCF+N#=0\xD0\"\"1!3\xD1,)&0\xD0\"\"1!3\xD1\"+2$0\xD2\"\"1!3\xD3+#$'#%$##<$\"#<\"#<*\xA6 \"!.\xD4\"\"2\xD43\xD5+\x96#=!!8.\xD6\"\"2\xD63\xD79*##\"\":\"#<+1#-\"\"1!3\xD8+#$'\"%$\"#<\"#<,M&!!8.\xD6\"\"2\xD63\xD79*##\"\":\"#<+1#-\"\"1!3\xD8+#$'\"%$\"#<\"#<\"+2$.\xD6\"\"2\xD63\xD7+#$'#%$##<$\"#<\"#<"),
          peg$decode(".\x89\"\"2\x893\x8A"),
          peg$decode(".\xB9\"\"2\xB93\xBA"),
          peg$decode("!7X+;#.\xD9\"\"2\xD93\xDA+,$7X+#$'#%$##<$\"#<\"#<"),
          peg$decode("!=0\xDB\"\"1!3\xDC*# \"7T,/&0\xDB\"\"1!3\xDC*# \"7T\"+& 4!6\xDD! %")
        ],

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleIndices)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleIndex = peg$startRuleIndices[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$decode(s) {
      var bc = new Array(s.length), i;

      for (i = 0; i < s.length; i++) {
        bc[i] = s.charCodeAt(i) - 32;
      }

      return bc;
    }

    function peg$parseRule(index) {
      var bc    = peg$bytecode[index],
          ip    = 0,
          ips   = [],
          end   = bc.length,
          ends  = [],
          stack = [],
          params, i;

      while (true) {
        while (ip < end) {
          switch (bc[ip]) {
            case 0:
              stack.push(peg$consts[bc[ip + 1]]);
              ip += 2;
              break;

            case 26:
              stack.push(void 0);
              ip++;
              break;

            case 27:
              stack.push(null);
              ip++;
              break;

            case 28:
              stack.push(peg$FAILED);
              ip++;
              break;

            case 29:
              stack.push([]);
              ip++;
              break;

            case 1:
              stack.push(peg$currPos);
              ip++;
              break;

            case 2:
              stack.pop();
              ip++;
              break;

            case 3:
              peg$currPos = stack.pop();
              ip++;
              break;

            case 4:
              stack.length -= bc[ip + 1];
              ip += 2;
              break;

            case 5:
              stack.splice(-2, 1);
              ip++;
              break;

            case 6:
              stack[stack.length - 2].push(stack.pop());
              ip++;
              break;

            case 7:
              stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
              ip += 2;
              break;

            case 8:
              stack.push(input.substring(stack.pop(), peg$currPos));
              ip++;
              break;

            case 9:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1]) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 10:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] === peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 11:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] !== peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 12:
              if (stack[stack.length - 1] !== peg$FAILED) {
                ends.push(end);
                ips.push(ip);

                end = ip + 2 + bc[ip + 1];
                ip += 2;
              } else {
                ip += 2 + bc[ip + 1];
              }

              break;

            case 13:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (input.length > peg$currPos) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 14:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 15:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 16:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 17:
              stack.push(input.substr(peg$currPos, bc[ip + 1]));
              peg$currPos += bc[ip + 1];
              ip += 2;
              break;

            case 18:
              stack.push(peg$consts[bc[ip + 1]]);
              peg$currPos += peg$consts[bc[ip + 1]].length;
              ip += 2;
              break;

            case 19:
              stack.push(peg$FAILED);
              if (peg$silentFails === 0) {
                peg$fail(peg$consts[bc[ip + 1]]);
              }
              ip += 2;
              break;

            case 20:
              peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];
              ip += 2;
              break;

            case 21:
              peg$savedPos = peg$currPos;
              ip++;
              break;

            case 22:
              params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);
              for (i = 0; i < bc[ip + 3]; i++) {
                params[i] = stack[stack.length - 1 - params[i]];
              }

              stack.splice(
                stack.length - bc[ip + 2],
                bc[ip + 2],
                peg$consts[bc[ip + 1]].apply(null, params)
              );

              ip += 4 + bc[ip + 3];
              break;

            case 23:
              stack.push(peg$parseRule(bc[ip + 1]));
              ip += 2;
              break;

            case 24:
              peg$silentFails++;
              ip++;
              break;

            case 25:
              peg$silentFails--;
              ip++;
              break;

            default:
              throw new Error("Invalid opcode: " + bc[ip] + ".");
          }
        }

        if (ends.length > 0) {
          end = ends.pop();
          ip = ips.pop();
        } else {
          break;
        }
      }

      return stack[0];
    }


        var nodes = {};
        var links = [];

        var make_node = function(type, identifier, attributeValuePairs) {
            if (nodes.hasOwnProperty(identifier)) { return nodes['identifier']; } // FIXME - should probably be an exception!
            var node = {
                identifier: identifier,
                label: identifier,
                type: type,
                attributes: attributeValuePairs };
            switch (type) {
              case 'entity': node.shape = 'ellipse'; break;
              case 'agent': node.shape = 'diamond'; break; // NOTE: the PROV style guidelines use a 'house'
              case 'activity': node.shape = 'rect'; break; // this is the default, but here for clarity
              case 'point': node.shape = 'circle'; node.label = ''; break;
            }
            // TODO - handle attribute/value pairs (maybe separate nodes vs. hovertips?)
            nodes[identifier] = node;
            return node;
        }

        var make_link = function(type, from, target) {
            var link = {
                source_node: from,
                target_node: target,
                type: 'link',
                label: type
            }
            links.push(link);
            return link;
        }

        var make_multi_link = function(source, type, targets, attributeValuePairs) {
            var target_labels = Object.keys(targets);
            var link_label = [type, source].concat(target_labels.map(function (l) { return targets[l]; })).join('__');
            var components = [source];
            var point = make_node('point', link_label, attributeValuePairs);
            point.label = '';
            var component_links = [{
                type: 'link',
                label: type,
                source_node: source,
                target_node: point.identifier
            }];
            for (var label in targets) {
                if (targets[label] && targets[label] != '-') {
                    component_links.push({
                        type: 'link',
                        label: label,
                        source_node: point.identifier,
                        target_node: targets[label]
                    });
                    components.push(targets[label]);
                }
            };
            point.components = components;
            links = links.concat(component_links);
            return {
                type: 'multi-link',
                node: point,
                links: component_links
            };
        }



    peg$result = peg$parseRule(peg$startRuleIndex);

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();
