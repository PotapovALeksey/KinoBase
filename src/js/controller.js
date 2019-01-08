export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on("loadContent", this.createCardsFilm.bind(this));
    view.on("loadFilm", this.createCardsFilm.bind(this));
    view.on("loadSerial", this.createCardsSerial.bind(this));
    // view.on("loadPageNum", this.createCardsFilm.bind(this));
  }

  createCardsFilm(value) {
    this.model.getFilms(value).then(data => this.view.createMarkupCards(data));
  }
  createCardsSerial(value) {
    this.model.getSerial(value).then(data => this.view.createMarkupCards(data));
  }
}
