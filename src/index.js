import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let searchQuery;
let pageNumber = 1;
const countImg = 40;

loadMore.setAttribute('hidden', true);

form.addEventListener('submit', onSubmitForm);

function onSubmitForm(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  console.log(searchQuery);
  pageNumber = 1;
  getUser();
  loadMore.removeAttribute('hidden');
}

async function getUser() {
  try {
    const resp = await axios.get(
      `https://pixabay.com/api/?key=31643149-fa666e9d7417fd7b721c14976`,
      {
        params: {
          q: `${searchQuery}`,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: `${countImg}`,
          page: `${pageNumber}`,
        },
      }
    );
    const totalHits = resp.data.totalHits;

    onMarkup(resp.data.hits);
    if (pageNumber === 1 && resp.data.hits.length) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    if (!resp.data.hits.length) {
      loadMore.setAttribute('hidden', true);
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (totalHits <= pageNumber * countImg) {
      loadMore.setAttribute('hidden', true);
      return Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    loadMore.addEventListener('click', onLoadMoreBtn);

    return;
  } catch (err) {
    console.error(err);
  }
}

function onMarkup(arr) {
  const {
    likes,
    views,
    comments,
    downloads,
    webformatURL,
    largeImageURL,
    tags,
  } = arr;
  const markup = arr
    .map(item => {
      return `<div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.tags}" width="340" height="225" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${item.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.innerHTML = markup;
}
function onLoadMoreBtn() {
  pageNumber += 1;
  getUser();
}
