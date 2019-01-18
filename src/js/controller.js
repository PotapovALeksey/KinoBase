export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on("loadMovies", this.createCardsMovies.bind(this));
    view.on("search", this.createCardsSearch.bind(this));
    view.on("loadDetailFilm", this.createFilmDetail.bind(this));
    view.on("loadFavorites", this.createCardsFavorites.bind(this));
    view.on("openMenu", this.openSideBar.bind(this));
    view.on("closeMenu", this.closeSidebar.bind(this));
    view.on("hideFilmMenu", this.toggleFilmMenu.bind(this));
    view.on("hideSerialMenu", this.toggleSerialMenu.bind(this));
    view.on("addFavorites", this.addToFavorites.bind(this));
    view.on("deleteFavorites", this.deleteFavorites.bind(this));
  }

  createCardsMovies(value) {
    this.model.getMovies(value).then(data => this.view.createMarkupCards(data));
  }

  createCardsFavorites() {
    this.model
      .getFavoritesCards()
      .then(data => this.view.createFavoriteCards(data));
  }

  createFilmDetail(value) {
    this.model
      .getDetailMovies(value)
      .then(data => this.view.createCardFilm(data));
  }

  createCardsSearch(value) {
    this.model
      .getMoviesSearch(value)
      .then(data => this.view.createSearchCards(data));
  }

  addToFavorites(card) {
    this.model.addFavoritesCard(card);
  }

  deleteFavorites(item) {
    this.model.deleteFavoritesCard(item);
    this.view.deleteCard(item);
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
