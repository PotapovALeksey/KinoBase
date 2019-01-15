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
      console.log(response.data.results);
      return response.data.results;
    });
  }

  getDetailFilm(id) {
    const url = `https://api.themoviedb.org/3/movie/297802?api_key=${
      this.APIKEY
    }&language=ru&id=${id}&append_to_response=videos,images;
    `;

    return axios(url).then(response => {
      console.log(response);

      return response;
    });
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
