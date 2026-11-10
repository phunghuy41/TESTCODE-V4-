(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const gradeKeys = ['10', '11', '12'];
  const letters = gradeKeys.flatMap(grade => (Array.isArray(HEART_DATA?.[grade]) ? HEART_DATA[grade] : []).map((entry, index) => ({
    ...entry, id: `${grade}-${index + 1}`, grade, title: String(entry.name || `${grade} lớp ${index + 1}`), index
  })));
  const state = { grade: 'all', query: '' };
  const heartRows = [4, 6, 7, 7, 6, 4, 2];

  function normalize(value) {
    return String(value).toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  }
  function getFiltered() {
    const query = normalize(state.query);
    return letters.filter(item => (state.grade === 'all' || item.grade === state.grade) && (!query || normalize(item.title).includes(query)));
  }
  function showToast(message) {
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  function createHeart(item, order) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `heart-node grade-${item.grade}`;
    button.dataset.id = item.id; button.style.setProperty('--delay', `${(order % 18) * 24}ms`);
    button.setAttribute('aria-label', `Mở thư ${item.title}`);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M50 88 C43 81 12 60 8 39 C4 18 29 5 46 22 C48 24 49 26 50 28 C51 26 52 24 54 22 C71 5 96 18 92 39 C88 60 57 81 50 88 Z');
    svg.append(path);
    const label = document.createElement('span'); label.className = 'node-label';
    label.textContent = item.title.replace(/^(\d+)\s+/, '$1\n');
    button.append(svg, label); button.addEventListener('click', () => openLetter(item));
    return button;
  }
  function renderHearts() {
    const canvas = $('#heartCanvas'), filtered = getFiltered();
    canvas.replaceChildren();
    const filteredIds = new Set(filtered.map(item => item.id));
    let index = 0;
    heartRows.forEach((count, rowIndex) => {
      const row = document.createElement('div'); row.className = `heart-row row-${rowIndex + 1}`;
      for (let i = 0; i < count; i++) {
        const item = letters[index++];
        if (item && filteredIds.has(item.id)) row.append(createHeart(item, index));
      }
      if (row.childElementCount) canvas.append(row);
    });
    canvas.classList.toggle('filtered', state.grade !== 'all' || Boolean(state.query));
    $('#searchEmpty').hidden = filtered.length > 0;
  }
  function openLetter(item) {
    $('#dialogGrade').textContent = `KHỐI ${item.grade} · CHUYÊN ${item.specialty.toLocaleUpperCase('vi')}`;
    $('#dialogTitle').textContent = item.title;
    $('#dialogCopy').textContent = item.message || 'Lời nhắn đang được cập nhật.';
    const dialog = $('#letterDialog'); if (!dialog.open) dialog.showModal();
  }

  $('#closeDialog').addEventListener('click', () => $('#letterDialog').close());
  $('#letterDialog').addEventListener('click', event => { if (event.target === $('#letterDialog')) $('#letterDialog').close(); });
  $$('.grade-tab').forEach(button => button.addEventListener('click', () => {
    state.grade = button.dataset.grade;
    $$('.grade-tab').forEach(tab => {
      const active = tab === button; tab.classList.toggle('active', active); tab.setAttribute('aria-pressed', String(active));
    });
    renderHearts();
  }));
  $('#heartSearch').addEventListener('input', event => {
    state.query = event.target.value.trim(); $('#clearSearch').hidden = !state.query; renderHearts();
  });
  $('#clearSearch').addEventListener('click', () => {
    $('#heartSearch').value = ''; state.query = ''; $('#clearSearch').hidden = true; renderHearts(); $('#heartSearch').focus();
  });
  $('#randomLetter').addEventListener('click', () => {
    const options = getFiltered(); if (!options.length) return showToast('Không có tập thể phù hợp.');
    openLetter(options[Math.floor(Math.random() * options.length)]);
  });

  // A single featured film. The source remains empty until the real clip is supplied.
  const player = $('#memoryPlayer');
  const finale = $('#filmFinale');
  if (FEATURED_VIDEO?.src?.trim()) {
    player.src = FEATURED_VIDEO.src;
    player.hidden = false;
    $('#memoryEmpty').hidden = true;
    $('#mediaName').textContent = FEATURED_VIDEO.title || 'THƯỚC PHIM 19/11';
    $('#mediaMeta').textContent = 'Một video duy nhất · Chuyên Hạ Long';
  }
  function showFinale() {
    finale.classList.add('is-visible');
    finale.setAttribute('aria-hidden', 'false');
    document.body.classList.add('finale-open');
  }
  function hideFinale() {
    finale.classList.remove('is-visible');
    finale.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('finale-open');
  }
  player.addEventListener('ended', showFinale);
  $('#finaleExplore').addEventListener('click', () => {
    hideFinale();
    $('#heartArchive').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  $('#finaleClose').addEventListener('click', hideFinale);
  $('#afterFilmPrompt').querySelector('a').addEventListener('click', hideFinale);

  let dark = true;
  try { dark = localStorage.getItem('chuyenHaLongV3Theme') !== 'light'; } catch {}
  function applyTheme() {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    $('#themeToggle').textContent = dark ? '☼' : '☾';
    $('#themeToggle').setAttribute('aria-label', dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#100f1d' : '#f7f3f8';
  }
  $('#themeToggle').addEventListener('click', () => {
    dark = !dark; applyTheme();
    try { localStorage.setItem('chuyenHaLongV3Theme', dark ? 'dark' : 'light'); } catch {}
  });
  applyTheme();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    const stars = $('#stars'), count = window.matchMedia('(max-width: 650px)').matches ? 24 : 48;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('i'); star.className = 'star';
      star.style.left = `${(i * 67 + 13) % 100}%`; star.style.top = `${(i * 43 + 7) % 100}%`;
      star.style.setProperty('--duration', `${4 + (i % 6)}s`); star.style.setProperty('--delay', `${-(i % 8)}s`);
      stars.append(star);
    }
  }
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');
    const targets = [$('.heart-section'), $('.footer')].filter(Boolean);
    targets.forEach(node => node.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    targets.forEach(node => observer.observe(node));
  }
  renderHearts();
})();