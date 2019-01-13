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
      
      return response.data.results;
    });
  }

  getSerial(page) {
    const url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${
      this.APIKEY
    }&language=ru&page=${page}`;

    return axios(url).then(response => {
     
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
}
