const folders = [1, 2, 3, 4, 5, 6];
const folderState = {};
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

function getRandomDelay() {
  return 5000 + Math.floor(Math.random() * 5000);
}

function updatePlaceholder(section, hasImages) {
  if (hasImages) {
    section.classList.remove('empty');
  } else {
    section.classList.add('empty');
  }
}

async function fetchImages(folderId) {
  try {
    const response = await fetch(`/api/images/${folderId}`);
    if (!response.ok) throw new Error('Failed to load images');
    const payload = await response.json();
    return payload.images || [];
  } catch (error) {
    console.warn('Fetch error for folder', folderId, error);
    return [];
  }
}

function pickNextIndex(folder) {
  const state = folderState[folder];
  if (!state.images.length) return -1;
  state.currentIndex = (state.currentIndex + 1) % state.images.length;
  return state.currentIndex;
}

function showImage(folder, index) {
  const state = folderState[folder];
  const section = state.section;
  const imageEl = section.querySelector('.slide');
  const nextImage = state.images[index];

  if (!nextImage) {
    imageEl.src = '';
    imageEl.alt = 'No image available';
    return;
  }

  const nextImg = new Image();
  nextImg.src = nextImage.url + `?t=${Date.now()}`;
  nextImg.onload = () => {
    imageEl.classList.remove('current');
    setTimeout(() => {
      imageEl.src = nextImg.src;
      imageEl.alt = nextImage.name;
      imageEl.classList.add('current');
    }, 50);
  };
  nextImg.onerror = () => {
    console.warn('Failed to load', nextImage.url);
  };
}

async function refreshFolder(folder) {
  const section = document.querySelector(`.quad[data-folder="${folder}"]`);
  const images = await fetchImages(folder);
  const state = folderState[folder];

  if (images.length && !state.images.length) {
    state.currentIndex = -1;
  }

  state.images = images;
  updatePlaceholder(section, images.length > 0);

  if (!images.length) {
    return;
  }

  if (state.currentIndex >= images.length) {
    state.currentIndex = -1;
  }

  if (state.currentIndex === -1) {
    state.currentIndex = 0;
    showImage(folder, 0);
  }
}

function scheduleNext(folder) {
  const delay = getRandomDelay();
  const state = folderState[folder];
  state.timer = setTimeout(async () => {
    const images = await fetchImages(folder);
    if (images.length) {
      state.images = images;
      const nextIndex = pickNextIndex(folder);
      showImage(folder, nextIndex);
    }
    scheduleNext(folder);
  }, delay);
}

async function initQuad(folder) {
  const section = document.querySelector(`.quad[data-folder="${folder}"]`);
  folderState[folder] = {
    section,
    images: [],
    currentIndex: -1,
    timer: null,
  };

  await refreshFolder(folder);
  scheduleNext(folder);
}

function init() {
  folders.forEach((folder) => initQuad(folder));
}

window.addEventListener('DOMContentLoaded', init);
