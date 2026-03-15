/**
 * Drag & Drop Manager — interact.js draggable items and shelf-row dropzones.
 */
const DragDrop = (() => {
  let _onCorrectDrop = null;
  let _onWrongDrop = null;

  function init(onCorrectDrop, onWrongDrop) {
    _onCorrectDrop = onCorrectDrop;
    _onWrongDrop = onWrongDrop;
    setupDraggables();
    setupDropzones();
  }

  function setupDraggables() {
    interact('.drag-item').draggable({
      inertia: false,
      autoScroll: true,

      listeners: {
        start(event) {
          event.target.classList.add('dragging');
          AudioManager.unlock();
        },

        move(event) {
          const el = event.target;
          const x = (parseFloat(el.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(el.getAttribute('data-y')) || 0) + event.dy;

          el.style.transform = `translate(${x}px, ${y}px) scale(1.15) rotate(3deg)`;
          el.setAttribute('data-x', x);
          el.setAttribute('data-y', y);
        },

        end(event) {
          event.target.classList.remove('dragging');
          if (!event.target.classList.contains('sorted')) {
            snapBack(event.target);
          }
        }
      }
    });
  }

  function setupDropzones() {
    interact('.shelf-row').dropzone({
      accept: '.drag-item',
      overlap: 0.3,

      ondropactivate(event) {
        event.target.classList.add('drop-active');
      },

      ondropdeactivate(event) {
        event.target.classList.remove('drop-active', 'drop-hover');
      },

      ondragenter(event) {
        event.target.classList.add('drop-hover');
      },

      ondragleave(event) {
        event.target.classList.remove('drop-hover');
      },

      ondrop(event) {
        const itemEl = event.relatedTarget;
        const shelfRowEl = event.target;

        shelfRowEl.classList.remove('drop-hover');

        const itemCategory = itemEl.getAttribute('data-category');
        const rowCategory = shelfRowEl.getAttribute('data-category');

        if (itemCategory === rowCategory) {
          if (_onCorrectDrop) _onCorrectDrop(itemEl, shelfRowEl);
        } else {
          if (_onWrongDrop) _onWrongDrop(itemEl, shelfRowEl);
        }
      }
    });
  }

  function snapBack(el) {
    el.classList.add('snap-back');
    el.style.transform = 'translate(0px, 0px)';
    el.setAttribute('data-x', 0);
    el.setAttribute('data-y', 0);

    setTimeout(() => {
      el.classList.remove('snap-back');
    }, 400);
  }

  function destroy() {
    interact('.drag-item').unset();
    interact('.shelf-row').unset();
  }

  return { init, snapBack, destroy };
})();
