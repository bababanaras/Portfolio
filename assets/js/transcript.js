// Animated lead-to-lease transcript for the landing hero.
// Plays one message per tick, loops, and shows the whole thread at once under reduced motion.
(function () {
  var SCRIPT = [
    { who: 'renter', time: '10:42 pm', stage: 0, text: 'Hi! Is the one-bed at The Alder still available for December 1?' },
    { who: 'agent', state: 'Confident', stage: 0, text: 'Yes. Unit 4B: one bed, 640 sq ft, $2,180 a month, ready Dec 1. Want to see it? I have self-guided tours tomorrow at 10:00 am or 5:30 pm.' },
    { who: 'renter', time: '10:44 pm', stage: 0, text: '5:30 works.' },
    { who: 'event', stage: 1, text: 'Tour booked · Tue 5:30 pm · access code sent' },
    { who: 'renter', time: 'Tue 6:12 pm', stage: 1, text: 'Loved it. How do I apply?' },
    { who: 'agent', state: 'Confident', stage: 2, text: 'I can do it right here, about six minutes. I need a photo ID and one way to confirm income. You can fix anything before you submit.' },
    { who: 'event', stage: 3, text: 'ID verified · Income verified via payroll' },
    { who: 'agent', state: 'Escalated', stage: 3, text: 'One thing I can’t approve alone: you asked to move in Dec 15, not Dec 1. I’ve asked the property manager. You’ll hear back within the hour.' },
    { who: 'human', stage: 3, text: 'Priya R., property manager, approved a Dec 15 move-in from Vida. 6 min.' },
    { who: 'agent', state: 'Completed', stage: 4, text: 'Your lease is ready. Two terms differ from our standard lease, and I’ve highlighted both. Sign when you’re ready.' },
    { who: 'event', stage: 4, text: 'Lease signed · Tue 6:58 pm' }
  ];
  var STAGES = ['Message', 'Tour', 'Apply', 'Verify', 'Sign'];
  var CHECK = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderMessage(m) {
    var node;
    if (m.who === 'renter' || m.who === 'agent') {
      node = el('div', 'msg msg--' + m.who);
      node.appendChild(el('span', 'msg__meta', m.who === 'renter' ? 'Maya · ' + m.time : 'Vivian · ' + m.state));
      node.appendChild(el('div', 'msg__bubble', m.text));
    } else if (m.who === 'event') {
      node = el('div', 'msg msg--event');
      node.innerHTML = CHECK;
      node.appendChild(el('span', null, m.text));
    } else {
      node = el('div', 'msg msg--human');
      var avatar = el('span', 'avatar', 'PR');
      avatar.setAttribute('aria-hidden', 'true');
      node.appendChild(avatar);
      node.appendChild(el('span', null, m.text));
    }
    return node;
  }

  function init(root) {
    var log = root.querySelector('[data-log]');
    var stagesEl = root.querySelector('[data-stages]');
    var stageNodes = stagesEl.querySelectorAll('.stage');
    var status = root.querySelector('[data-status]');
    var pace = Number(root.getAttribute('data-pace')) || 1800;
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var step = 1;
    var timer;

    function render() {
      var n = still ? SCRIPT.length : Math.min(step, SCRIPT.length);
      var shown = SCRIPT.slice(0, n);
      var reached = shown.reduce(function (a, m) { return Math.max(a, m.stage); }, 0);

      // Append only new messages so earlier ones don't re-animate.
      while (log.querySelectorAll('.msg').length > n) log.removeChild(log.querySelector('.msg'));
      var typing = log.querySelector('.typing');
      if (typing) log.removeChild(typing);
      for (var i = log.querySelectorAll('.msg').length; i < n; i++) log.appendChild(renderMessage(SCRIPT[i]));

      var next = SCRIPT[n];
      if (!still && next && next.who === 'agent') {
        typing = el('div', 'typing');
        typing.setAttribute('aria-label', 'Agent is typing');
        typing.innerHTML = '<span></span><span></span><span></span>';
        log.appendChild(typing);
      }

      for (var s = 0; s < stageNodes.length; s++) stageNodes[s].classList.toggle('is-on', s <= reached);
      stagesEl.setAttribute('aria-label', 'Lease progress: ' + STAGES[reached] + ', step ' + (reached + 1) + ' of 5');
      status.textContent = reached >= 4 ? 'Signed' : (reached >= 1 ? 'In progress' : 'Live');
    }

    function start() {
      clearInterval(timer);
      render();
      if (still) return;
      timer = setInterval(function () {
        step = step >= SCRIPT.length + 3 ? 1 : step + 1;
        if (step === 1) log.textContent = '';
        render();
      }, pace);
    }

    root.querySelector('[data-replay]').addEventListener('click', function () {
      step = 1;
      log.textContent = '';
      start();
    });

    start();
  }

  document.querySelectorAll('[data-transcript]').forEach(init);
})();
