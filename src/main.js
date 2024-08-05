import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import * as allFetch from './js/pixabay-api.js';
import { renderImages } from './js/render-functions.js';

const form = document.querySelector('.form');
const input = document.querySelector('.form-input');
const loader = document.querySelector('.loader');
const imageList = document.querySelector('.image-list');
const btnMore = document.querySelector('.btn-more');

const params = {
  page: 1,
  per_page: 15,
  q: '',
};

let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();

  params.q = input.value.trim();

  if (params.q === '') {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term.',
    });
    form.reset();
    return;
  }

  params.page = 1;
  btnMore.classList.add('hidden');
  loader.style.display = 'block';
  imageList.innerHTML = '';

  try {
    const { hits, totalHits: newTotalHits } = await allFetch.fetchImages(
      params
    );
    totalHits = newTotalHits;

    if (hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      renderImages(hits);
      if (totalHits > params.page * params.per_page) {
        btnMore.classList.remove('hidden');
      }
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
    });
  } finally {
    loader.style.display = 'none';
    btnMore.classList.remove('disabled');
  }
});

btnMore.addEventListener('click', async () => {
  params.page += 1;

  btnMore.classList.add('disabled');
  loader.style.display = 'block';

  try {
    const { hits } = await allFetch.fetchImages(params);
    renderImages(hits);

    const galleryItem = document.querySelector('.gallery-item');
    const { height } = galleryItem.getBoundingClientRect();

    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });

    if (params.page * params.per_page >= totalHits) {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
      btnMore.classList.add('hidden');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
    });
  } finally {
    loader.style.display = 'none';
    btnMore.classList.remove('disabled');
  }
});
