export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on("loadMovies", this.createCardsMovies.bind(this));
    view.on("loadDetailFilm", this.createFilmDetail.bind(this));
    view.on("openMenu", this.openSideBar.bind(this));
    view.on("closeMenu", this.closeSidebar.bind(this));
    view.on("hideFilmMenu", this.toggleFilmMenu.bind(this));
    view.on("hideSerialMenu", this.toggleSerialMenu.bind(this));
  }

  createCardsMovies(value) {
    this.model.getMovies(value).then(data => this.view.createMarkupCards(data));
  }

  createFilmDetail(value) {
    this.model
      .getDetailFilm(value)
      .then(data => this.view.createCardFilm(data));
  }

  openSideBar() {
    this.view.openSidebar();
  }

  closeSidebar() {
    this.view.closeSidebar();
  }

  toggleFilmMenu() {
    this.view.hideFilmMenu();
  }
  toggleSerialMenu() {
    this.view.hideSerialMenu();
  }
}
