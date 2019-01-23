import * as storage from "./storage";
import axios from "axios";

export default class Model {
  constructor() {
    this.APIKEY = "fe18199fa91ee3037cc04bdedf00704c";
    this.localStorageFavorites = storage.get() || [];
  }

  getMovies({ category, type, page }) {
    const url = `https://api.themoviedb.org/3/${category}/${type}?api_key=${
      this.APIKEY
    }&language=ru&page=${page}`;

    return axios(url).then(response => {
      return response.data.results;
    });
  }

  getMoviesSearch({ category, value }) {
    const url = `https://api.themoviedb.org/3/search/${category}?api_key=fe18199fa91ee3037cc04bdedf00704c&language=ru&query=${value}&page=1&include_adult=false&total_pages=20&page=1`;

    return axios(url).then(response => {
      return response.data.results;
    });
  }

  getDetailMovies({ category, id }) {
    const url = `https://api.themoviedb.org/3/${category}/${id}?api_key=${
      this.APIKEY
    }&language=ru&in_production=true&append_to_response=videos,images;
    `;
    return axios(url).then(response => {
      return response.data;
    });
  }

  getCreditsMovie({ category, id }) {
    const url = `https://api.themoviedb.org/3/${category}/${id}/credits?api_key=fe18199fa91ee3037cc04bdedf00704c`;

    return axios(url).then(response => {
      return response.data;
    });
  }

  getCadrsMovie({ category, id }) {
    const url = `https://api.themoviedb.org/3/${category}/${id}/images?api_key=fe18199fa91ee3037cc04bdedf00704c`;

    return axios(url).then(response => response.data);
  }

  getFavoritesCards() {
    this.localStorageFavorites = storage.get();
    return Promise.resolve(this.localStorageFavorites);
  }

  addFavoritesCard(card) {
    const isValid = this.localStorageFavorites.some(el => el.id === card.id);

    if (!isValid) {
      this.localStorageFavorites = [card, ...this.localStorageFavorites];
      storage.set(this.localStorageFavorites);
    }
  }

  deleteFavoritesCard(item) {
    const id = item.dataset.id;
    this.localStorageFavorites = this.localStorageFavorites.filter(
      el => el.id !== id
    );
    storage.set(this.localStorageFavorites);
  }
}
