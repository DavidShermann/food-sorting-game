const Game = (() => {
  let config = null;
  let totalItems = 0;
  let sortedCount = 0;
  let basketSortedCounts = {};

  async function loadConfig() {
    const response = await fetch('game-config.json');
    config = await response.json();
    return config;
  }

  function start() {
    sortedCount = 0;
    basketSortedCounts = {};
    totalItems = 0;

    config.categories.forEach(cat => {
      totalItems += cat.items.length;
      basketSortedCounts[cat.id] = 0;
    });

    renderGame();
    DragDrop.init(handleCorrectDrop, handleWrongDrop);
  }

  function renderGame() {
    document.getElementById('game-title').textContent = config.gameTitle;

    // Render shelf rows — each row has a drop area + category card inside
    const dropRows = document.getElementById('shelf-drop-rows');
    dropRows.innerHTML = '';

    config.categories.forEach(cat => {
      const row = document.createElement('div');
      row.className = 'shelf-row';
      row.setAttribute('data-category', cat.id);
      row.id = `shelf-${cat.id}`;

      row.innerHTML = `
        <div class="shelf-items-area" id="sorted-${cat.id}"></div>
        <div class="category-card">
          <img class="checkmark-icon" id="check-${cat.id}" src="assets/ui/checkmark.svg" alt="">
          ${cat.categoryImage ? `<img class="category-preview" src="${cat.categoryImage}" alt="${cat.name}">` : ''}
          <span class="category-label">${cat.name}</span>
        </div>
      `;

      dropRows.appendChild(row);
    });

    // Collect all items and shuffle
    const allItems = [];
    config.categories.forEach(cat => {
      cat.items.forEach(item => {
        allItems.push({ ...item, category: cat.id });
      });
    });
    shuffle(allItems);

    // Distribute items: 3 left, 3 right, rest bottom
    const leftContainer = document.getElementById('items-left');
    const rightContainer = document.getElementById('items-right');
    const bottomContainer = document.getElementById('items-bottom');
    leftContainer.innerHTML = '';
    rightContainer.innerHTML = '';
    bottomContainer.innerHTML = '';

    const leftCount = 3;
    const rightCount = 3;

    allItems.forEach((item, index) => {
      const el = createItemElement(item);
      if (index < leftCount) {
        leftContainer.appendChild(el);
      } else if (index < leftCount + rightCount) {
        rightContainer.appendChild(el);
      } else {
        bottomContainer.appendChild(el);
      }
    });

    // Add farmer to the left of the left column
    document.querySelectorAll('.decor-item').forEach(el => el.remove());
    if (config.extraItems) {
      config.extraItems.forEach(extra => {
        const el = document.createElement('div');
        el.className = 'decor-item';
        el.innerHTML = `<img src="${extra.image}" alt="${extra.name}">`;
        // Insert before the left column in the game area
        const gameArea = document.getElementById('game-area');
        gameArea.insertBefore(el, leftContainer);
      });
    }

    document.getElementById('game-complete-overlay').classList.add('hidden');
  }

  function createItemElement(item) {
    const el = document.createElement('div');
    el.className = 'drag-item';
    el.id = `item-${item.id}`;
    el.setAttribute('data-category', item.category);
    el.setAttribute('data-x', 0);
    el.setAttribute('data-y', 0);
    el.innerHTML = `<img src="${item.image}" alt="${item.name}" draggable="false">`;
    return el;
  }

  function handleCorrectDrop(itemEl, shelfRowEl) {
    sortedCount++;
    const categoryId = shelfRowEl.getAttribute('data-category');
    basketSortedCounts[categoryId]++;

    AudioManager.playSuccess();
    itemEl.classList.add('sorted');

    const sortedArea = document.getElementById(`sorted-${categoryId}`);
    const sortedImg = document.createElement('div');
    sortedImg.className = 'sorted-item';
    sortedImg.innerHTML = `<img src="${itemEl.querySelector('img').src}" alt="">`;
    sortedArea.appendChild(sortedImg);

    const cat = config.categories.find(c => c.id === categoryId);
    const checkEl = document.getElementById(`check-${categoryId}`);
    checkEl.classList.add('visible');
    setTimeout(() => {
      if (basketSortedCounts[categoryId] < cat.items.length) {
        checkEl.classList.remove('visible');
      }
    }, 1200);

    if (sortedCount === totalItems) {
      setTimeout(() => gameComplete(), 600);
    }
  }

  function handleWrongDrop(itemEl, shelfRowEl) {
    AudioManager.playError();
    shelfRowEl.classList.add('drop-wrong');
    setTimeout(() => shelfRowEl.classList.remove('drop-wrong'), 500);
    DragDrop.snapBack(itemEl);
  }

  function gameComplete() {
    AudioManager.playCelebration();
    AudioManager.playClapping();
    spawnConfetti();
    document.getElementById('game-complete-overlay').classList.remove('hidden');
  }

  function spawnConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#82E0AA'];
    for (let i = 0; i < 50; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + '%';
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDelay = Math.random() * 2 + 's';
      c.style.animationDuration = (2 + Math.random() * 2) + 's';
      c.style.width = (6 + Math.random() * 8) + 'px';
      c.style.height = (6 + Math.random() * 8) + 'px';
      container.appendChild(c);
    }
  }

  function replay() {
    DragDrop.destroy();
    start();
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return { loadConfig, start, replay };
})();

document.addEventListener('DOMContentLoaded', async () => {
  await Game.loadConfig();
  Game.start();
  document.getElementById('play-again-btn').addEventListener('click', () => Game.replay());
});
