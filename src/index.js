import Notiflix from 'notiflix';
// import SimpleLightbox from "simplelightbox";  
// import "simplelightbox/dist/simple-lightbox.min.css";

const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36038958-32844999b4809bb8b9f23e519';
let USER_SEARCH = '';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const img = document.querySelector('.img-small')
let page = 1;

const loadMoreBTN = document.createElement('button');
loadMoreBTN.type = 'button';
loadMoreBTN.class = 'load-more';
loadMoreBTN.textContent = 'Load more';

function onSubmit(evt) {
  evt.preventDefault();
  USER_SEARCH = form[0].value;
  gallery.innerHTML = '';
  getImage();
}

form.addEventListener('submit', onSubmit);

function createMarkup(arr) {
  
  return arr.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
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
    ).join('');
      
}



async function getImage() {
  try {
    const URL = `${BASE_URL}?key=${API_KEY}&q=${USER_SEARCH}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    const response = await axios.get(URL);
    const data = response.data.hits;
    if (data.length > 0) {
      gallery.insertAdjacentHTML('beforeend', createMarkup(data)); 
      gallery.append(loadMoreBTN);
      return;
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
  }
  
}

loadMoreBTN.addEventListener('click', onClick);

function onClick() {
  page += 1;
  getImage();
}


// const lightbox = new SimpleLightbox('.galleryf', { 
//   captionsData: 'alt', 
//   captionDelay: 250,
// });

// console.log(lightbox)