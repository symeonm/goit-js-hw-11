import Notiflix from 'notiflix';
// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";

const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36038958-32844999b4809bb8b9f23e519';
let searchValue = '';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const search = document.querySelector('#inputId');

let page = 1;
// const loadMoreBTN = document.querySelector('.load-more');
const loadMoreBTN = document.createElement('button');
loadMoreBTN.type = 'button';
loadMoreBTN.class = 'load-more';
loadMoreBTN.textContent = 'Load more';

function onSubmit(evt) {
  evt.preventDefault();
  searchValue = search.value.trim();
  gallery.innerHTML = '';
  page = 1;
  if (searchValue === '') {
    gallery.innerHTML = '';
    return;
  }

  getImage(searchValue).then(resp => {
    if (resp.length > 0) {
      gallery.insertAdjacentHTML('beforeend', createMarkup(resp));
      // observer.observe(guard);
      gallery.append(loadMoreBTN);
      return;
    } else if (!searchValue) {
      gallery.innerHTML = '';
    } else {
      loadMoreBTN.remove();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });
}

form.addEventListener('submit', onSubmit);

function createMarkup(arr) {
  return arr
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img-small"/>
  <div class="info">
    <p class="info-item">
      <b>Likes:${likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}

async function getImage(searchValue) {
  try {
    const URL = `${BASE_URL}?key=${API_KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    const response = await axios.get(URL);
    const data = response.data.hits;
    console.log(response)
    if (response.data.hits.length < 40) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBTN.remove();
      return
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}

loadMoreBTN.addEventListener('click', onClick);

function onClick() {
  page += 1;
  getImage(searchValue).then(resp => {
    if (resp.length > 0) {
      gallery.insertAdjacentHTML('beforeend', createMarkup(resp));
      // observer.observe(guard);
      gallery.append(loadMoreBTN);
      return;
    } else if (!searchValue || '') {
      gallery.innerHTML = '';
      onSubmit();
      return;
    } else {
      loadMoreBTN.remove();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });
}

// let options = {
//   root : null,
// rootMargin : '400px',
// threshold : 0,
// }

// let observer = new IntersectionObserver(onPagination, options)

// const guard = document.querySelector('.js-guard')

// function onPagination(entries, observer){
// entries.forEach((entry) => {
//   if (entry.isIntersecting) {
//     page += 1;
//   getImage();
//   }
// });
// }

// const lightbox = new SimpleLightbox('.galleryf', {
//   captionsData: 'alt',
//   captionDelay: 250,
// });

// console.log(lightbox)
// lightbox.refresh()

///////////////////
