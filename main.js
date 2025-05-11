// ハンバーガーメニュー開閉
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// ヒーローパララックス
const hero = document.getElementById('hero');
const overlay = hero.querySelector('.hero-overlay');
hero.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth) * 30;
  const y = (e.clientY / window.innerHeight) * 30;
  overlay.style.transform = `translate(${x}px, ${y}px)`;
});

// カウンターアニメーション
const counters = document.querySelectorAll('.counter');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset-target;
      let count = 0;
      const step = target / 100;
      const update = () => {
        count += step;
        el.textContent = count < target ? Math.ceil(count) : target;
        if (count < target) requestAnimationFrame(update);
      };
      update();
      observer.unobserve(el);
    }
  });
}, { threshold: 0.3 });
counters.forEach(c => observer.observe(c));
