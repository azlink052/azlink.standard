/**
 ***********************************************
 *
 * フェード効果のあるスライダ
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <http://www.azlink.jp>
 * @final 		2019.04.04
 *
 ***********************************************
 */
(function($) {

	var pluginName = 'fadeSlider';
	var options;

	var current 		= 0,
		count 				= 0,
		current 			= 0,
		isAllowSlide 	= false,
		timer 				= false,
		$jq;

	var methods = {
		init: function(params) {
			$jq = this;

			options = $.extend({
				isAuto: true,
				isLoop: true,
				pause: 5000,
				speed: 500,
				easing: 'easeInCubic',
				ctrl: false,
				pager: false,
				wrapper: $jq.parent(),
				onSliderLoad: false,
				onSlideBefore: new Array, // oldIndex, newIndex
				onSlideAfter: new Array // oldIndex, newIndex
			}, params);

			if (options.pause < options.speed) {
				options.speed = options.pause - 1;
			}

			count = $jq.children().length;
			$jq.css({
				position: 'relative'
			});
			$jq.children().css({
				opacity: 0,
				zIndex: 50,
				position: 'absolute',
				left: 0,
				top: 0
			}).eq(current).css({
				opacity: 1,
				zIndex: 51
			});
			if (options.ctrl) {
				options.wrapper.append('<div class="fs-ctrls"><div class="fs-ctrls-direction" /></div>');
				options.wrapper.find('.fs-ctrls-direction').append('<a class="fs-prev" href="javascript:void(0)">Prev</a><a class="fs-next" href="javascript:void(0)">Next</a>');
				options.wrapper.find('.fs-prev').on('click.fsPager', function() {
					if (!isAllowSlide) return;
					if (options.isLoop) {
						var index = current === 0 ? count - 1 : current - 1;
						methods.change(index + '');
					} else {
						if (current !== 0) {
							var index = current - 1;
							methods.change(index + '');
						}
					}
				});
				options.wrapper.find('.fs-next').on('click.fsPager', function() {
					if (!isAllowSlide) return;
					if (options.isLoop) {
						var index = current === count - 1 ? 0 : current + 1;
						methods.change(index + '');
					} else {
						if (current !== count - 1) {
							var index = current + 1;
							methods.change(index + '');
						}
					}
				});
			}
			if (options.pager) {
				options.wrapper.append('<div class="fs-pager" />');
				for (var i = 0; i < count; i++) {
					options.wrapper.find('.fs-pager').append('<div class="fs-pager-item"><a href="javascript:void(0)" data-index="' + i + '">' + (i + 1) + '</a></div>');
				}
				options.wrapper.find('.fs-pager-item').eq(current).find('a').addClass('active');
				options.wrapper.find('.fs-pager-item a').on('click.fsPager', function() {
					if (!isAllowSlide) return;
					var index = $(this).data('index'); // 文字列変換
					methods.change(index + '');
				});
			}
			isAllowSlide = true;
			methods.slideAuto();
			if (typeof options.onSliderLoad === 'function') {
				options.onSliderLoad();
			}

			return this;
		},
		change: function(target) {
			clearTimeout(timer);
			if (!isAllowSlide) return;
			isAllowSlide = false;
			var oldIndex = current,
				newIndex = target >= 0 ? parseInt(target) : (current !== count - 1 ? current + 1 : 0);
			current = newIndex === count ? 0 : newIndex;
			if (typeof options.onSlideBefore === 'function') {
				options.onSlideBefore(oldIndex, newIndex);
			}
			if (options.pager) methods.togglePager();
			$jq.children().eq(oldIndex).css({
				zIndex: 50
			});
			$jq.children().eq(current).css({
				zIndex: 51
			}).velocity('stop').velocity({
				opacity: 1
			}, {
				duration: options.speed,
				complete: function() {
					// var oldIndex = current !== 0 ? current - 1 : count - 1;
					if (typeof options.onSlideAfter === 'function') {
						options.onSlideAfter(oldIndex, current);
					}
					$jq.children().not(':eq(' + current + ')').css({
						opacity: 0
					});
					isAllowSlide = true;
					if (options.isLoop) {
						methods.slideAuto();
					} else {
						if (current !== count - 1) {
							methods.slideAuto();
						}
					}
				}
			});

			return this;
		},
		togglePager: function() {
			options.wrapper.find('.fs-pager-item a').removeClass('active');
			options.wrapper.find('.fs-pager-item').eq(current).find('a').addClass('active');

			return this;
		},
		slideAuto: function() {
			if (!isAllowSlide || !options.isAuto) return;
			methods.startSlideAuto();

			return this;
		},
		startSlideAuto: function() {
			isAllowSlide = options.isAuto = true;
			timer = setTimeout(function() {
				methods.change();
			}, options.pause);

			return this;
		},
		stopAuto: function() {
			clearTimeout(timer);
			options.isAuto = false;

			return this;
		},
		reset: function() {
			current = count - 1;
			methods.change(0);

			return this;
		},
		destroy: function() {
			clearTimeout(timer);
			$(document).off('.fsPager');

			options;
			current 			= 0,
			count 				= 0,
			current 			= 0,
			isAllowSlide 	= false,
			timer 				= false,
			$jq;

			return this;
		}
	};

	$.fn[pluginName] = function(method) {
		if ( methods[method] ) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
			return this;
		}
	};

}(jQuery));
