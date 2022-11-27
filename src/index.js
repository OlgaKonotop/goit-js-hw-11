import axios from 'axios';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let searchQuery;

form.addEventListener('submit', onSubmitForm);

function onSubmitForm(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  console.log(searchQuery);
  getUser();
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
          per_page: 40,
        },
      }
    );
    console.log(resp.data.hits);
    onMarkup(resp.data.hits);
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
