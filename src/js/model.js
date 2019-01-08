import * as storage from "./storage";
import axios from "axios";

export default class Model {
  constructor() {
    this.APIKEY = "fe18199fa91ee3037cc04bdedf00704c";
  }

  getFilms(page) {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${
      this.APIKEY
    }&language=ru&page=${page}`;

    return axios(url).then(response => {
      console.log(response.data.results);

      return response.data.results;
    });
  }

  getSerial(page) {
    const url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${
      this.APIKEY
    }&language=ru&page=${page}`;

    return axios(url).then(response => {
      console.log(response.data.results);

      return response.data.results;
    });
  }
}
