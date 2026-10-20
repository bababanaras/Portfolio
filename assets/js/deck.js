// Slide viewer for case-study decks.
// Each [data-deck] keeps its own position. Thumbnails carry the slide data, so the
// first slide and every thumbnail are plain HTML and the page reads fine without JS.
(function () {
  function init(deck) {
    var thumbs = Array.prototype.slice.call(deck.querySelectorAll('.deck__thumb'));
    var slide = deck.querySelector('.deck__slide');
    var title = deck.querySelector('.deck__title');
    var caption = deck.querySelector('.deck__text .text-md');
    var count = deck.querySelector('.deck__count');
    var index = 0;

    function show(i) {
      index = (i + thumbs.length) % thumbs.length;
      var t = thumbs[index];
      slide.src = t.dataset.src;
      slide.alt = t.dataset.title + ': ' + t.dataset.caption;
      title.textContent = t.dataset.title;
      caption.textContent = t.dataset.caption;
      count.textContent = (index + 1) + ' / ' + thumbs.length;
      thumbs.forEach(function (b, k) {
        if (k === index) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    }

    deck.querySelector('[data-prev]').addEventListener('click', function () { show(index - 1); });
    deck.querySelector('[data-next]').addEventListener('click', function () { show(index + 1); });
    thumbs.forEach(function (b, k) { b.addEventListener('click', function () { show(k); }); });

    // Arrow keys work only while focus is inside this deck.
    deck.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });

    // Warm the cache so the next slide appears instantly.
    deck.addEventListener('pointerenter', function () {
      thumbs.forEach(function (b) { new Image().src = b.dataset.src; });
    }, { once: true });
  }

  document.querySelectorAll('[data-deck]').forEach(init);
})();
