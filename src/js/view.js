import EventEmitter from "./event-emiter";
import createCards from "./templates/cards.hbs";
import createFavorites from "./templates/favorite-cards.hbs";
import cardContent from "./templates/card-content.hbs";
import * as storage from "./storage";

export default class View extends EventEmitter {
  constructor() {
    super();
    this.localStorageFavorites = storage.get() || [];
    this.content = document.querySelector("#content");
    this.filmLink = document.querySelector('[data-category="movie"]');
    this.serialLink = document.querySelector('[data-category="tv"]');
    this.favoriteLink = document.querySelector('[data-category="favorite"]');
    this.form = document.querySelector(".js-header-form");
    this.formInput = document.querySelector(".js-header-form__input");
    this.pagination = document.querySelector(".js-pagination");
    this.paginationLinks = [
      ...document.querySelectorAll(".js-pagination__link")
    ];
    this.navLinks = [...document.querySelectorAll(".js-nav-list__link")];
    this.content = document.querySelector(".js-content");
    this.menuBtn = document.querySelector(".js-header-actions__icon-menu");
    this.sidebar = document.querySelector(".js-sidebar");
    this.sidebarContent = document.querySelector(".js-sidebar-content");
    this.closeSidebarBtn = document.querySelector(
      ".js-sidebar-content__icon-cancel"
    );
    this.titleFilmSidebar = document.querySelector('[data-title="film"]');
    this.titleSerialSidebar = document.querySelector('[data-title="serial"]');
    this.titleFavoritesSidebar = document.querySelector(
      '[data-title="favorite"]'
    );
    this.menuFilmSidebar = document.querySelector('[data-menu="film"]');
    this.menuSerialSidebar = document.querySelector('[data-menu="serial"]');
    this.page = 1;
    this.category = "movie";
    this.type = "now_playing";

    document.addEventListener(
      "DOMContentLoaded",
      this.handleLoadFilm.bind(this)
    );
    this.form.addEventListener("submit", this.handleClickSubmit.bind(this));

    this.pagination.addEventListener(
      "click",
      this.handleClickPagination.bind(this)
    );

    this.filmLink.addEventListener("click", this.handleClickMovies.bind(this));

    this.serialLink.addEventListener(
      "click",
      this.handleClickMovies.bind(this)
    );
    this.favoriteLink.addEventListener(
      "click",
      this.handleClickFavoritesLink.bind(this)
    );

    this.titleFavoritesSidebar.addEventListener(
      "click",
      this.handleClickFavoritesTitle.bind(this)
    );
    this.content.addEventListener("click", this.handleClickCard.bind(this));

    this.menuBtn.addEventListener("click", this.handleClickOpenMenu.bind(this));
    this.sidebar.addEventListener(
      "click",
      this.handleClickCloseMenu.bind(this)
    );

    this.titleFilmSidebar.addEventListener(
      "click",
      this.handleClickTitleSidebar.bind(this)
    );
    this.titleSerialSidebar.addEventListener(
      "click",
      this.handleClickTitleSidebar.bind(this)
    );

    this.menuFilmSidebar.addEventListener(
      "click",
      this.handleClickSidebarMenu.bind(this)
    );
    this.menuSerialSidebar.addEventListener(
      "click",
      this.handleClickSidebarMenu.bind(this)
    );
    this.content.addEventListener(
      "click",
      this.handleClickFavorites.bind(this)
    );
    this.content.addEventListener(
      "click",
      this.handleClickDeleteFavorites.bind(this)
    );
  }

  handleLoadFilm() {
    const options = {
      category: this.category,
      type: this.type,
      page: this.page
    };
    this.emit("loadMovies", options);
  }

  handleClickSubmit(e) {
    e.preventDefault();
    const value = this.formInput.value;
    this.form.reset();
    this.emit("search", value);
  }

  handleClickMovies({ target }) {
    this.page = 1;

    this.category = target.dataset.category;
    this.type = target.dataset.type;
    const options = {
      category: this.category,
      type: this.type,
      page: this.page
    };

    this.changeColorLinkNav(this.navLinks, "current", this.category);
    this.changeColorLinkPag(this.paginationLinks, "current", Number(this.page));

    this.emit("loadMovies", options);
  }

  handleClickFavoritesLink({ target }) {
    const category = target.dataset.category;
    this.changeColorLinkNav(this.navLinks, "current", category);
    this.emit("loadFavorites");
  }

  handleClickFavoritesTitle({ target }) {
    const category = target.closest(".sidebar-content__title").dataset.title;
    this.changeColorLinkNav(this.navLinks, "current", category);
    this.emit("loadFavorites");
  }

  handleClickPagination({ target }) {
    if (!target.classList.contains("pagination__link")) {
      return;
    }

    this.page = target.textContent;
    this.changeColorLinkPag(this.paginationLinks, "current", Number(this.page));

    const options = {
      category: this.category,
      type: this.type,
      page: this.page
    };

    this.emit("loadMovies", options);
  }

  handleClickSidebarMenu({ target }) {
    if (!(target.nodeName === "LI")) {
      return;
    }
    this.page = 1;
    this.category = target.dataset.category;
    this.type = target.dataset.type;

    this.changeColorLinkNav(this.navLinks, "current", this.category);
    this.changeColorLinkPag(this.paginationLinks, "current", this.page);

    const options = {
      category: this.category,
      type: this.type,
      page: this.page
    };

    this.emit("loadMovies", options);
  }

  handleClickCard({ target }) {
    if (!target.classList.contains("js-cards-list__item-overlay")) {
      return;
    }

    const item = target.closest(".js-cards-list__item");
    const id = item.dataset.id;
    this.emit("loadDetailFilm", id);
  }

  handleClickOpenMenu() {
    this.emit("openMenu");
  }

  handleClickCloseMenu(e) {
    if (e.target.classList.contains("js-sidebar")) {
      this.emit("closeMenu");
    }

    if (e.target.classList.contains("js-sidebar-content__icon-cancel")) {
      this.emit("closeMenu");
    }
  }

  handleClickTitleSidebar(e) {
    const istitleFilm = e.target.closest('[data-title="film"]');
    const istitleSerial = e.target.closest('[data-title="serial"]');

    if (istitleFilm) {
      this.emit("hideFilmMenu");
    }
    if (istitleSerial) {
      this.emit("hideSerialMenu");
    }
  }

  handleClickFavorites({ target }) {
    if (!target.classList.contains("js-icon-star")) {
      return;
    }
    const item = target.closest(".js-cards-list__item");
    const button = item.querySelector(".cards-list__item-button");
    const id = item.dataset.id;
    const title = item.querySelector(".cards-list__item-title").textContent;
    const img = item.querySelector(".cards-list__item-img").src;
    const card = {
      id,
      title,
      img
    };
    this.paintFavoritesBtn(button);
    this.emit("addFavorites", card);
  }
  handleClickDeleteFavorites({ target }) {
    if (!(target.dataset.actions === "delete")) {
      return;
    }
    const item = target.closest(".js-favorites-list__item");

    this.emit("deleteFavorites", item);
  }

  createMarkupCards(data) {
    const markup = createCards(data);

    this.content.innerHTML = markup;
    this.toShowPagination();
    this.checkFavoritesCard(this.localStorageFavorites);
  }

  createFavoriteCards(data) {
    let markup =
      data.length > 0 ? createFavorites(data) : this.createAboutFavoriteText();

    this.content.innerHTML = markup;
    this.toHidePagination();
  }

  createSearchCards(data) {
    let markup = data.length > 0 ? createCards(data) : this.createAboutSearch();

    this.content.innerHTML = markup;
    this.toHidePagination();
  }

  createAboutSearch() {
    const markup =
      '<p class="search-about">По вашему запросу ничего не найдено!</p>';
    return markup;
  }

  createAboutFavoriteText() {
    const markup = '<p class="favorites-about">Ваш список избранного пуст!</p>';
    return markup;
  }

  createCardFilm(data) {
    const cardInfo = cardContent(data);

    this.content.innerHTML = cardInfo;
    this.toHidePagination();
  }

  deleteCard(item) {
    item.remove();
  }

  changeColorLinkPag(elements, className, index) {
    elements.forEach(element => {
      element.classList.remove(className);
    });

    elements[index - 1].classList.add(className);
  }
  changeColorLinkNav(elements, className, category) {
    let current;
    elements.forEach(element => {
      element.parentNode.classList.remove(className);
    });

    current = elements.find(element => element.dataset.category === category);

    current.parentNode.classList.add(className);
  }

  checkFavoritesCard(arr) {
    if (!arr.length > 0) {
      return;
    }

    const idArr = arr.map(el => el.id);

    const items = [...document.querySelectorAll(".js-cards-list__item")];
    const favoritesItems = items.filter(el => idArr.includes(el.dataset.id));

    let button;
    favoritesItems.forEach(el => {
      button = el.querySelector(".cards-list__item-button");
      this.paintFavoritesBtn(button);
    });
  }

  paintFavoritesBtn(elements) {
    elements.style.color = "#fa7305";
  }

  toHidePagination() {
    this.pagination.classList.add("hide");
  }
  toShowPagination() {
    this.pagination.classList.remove("hide");
  }

  openSidebar() {
    this.sidebar.classList.add("open");

    setTimeout(() => {
      this.sidebarContent.classList.add("sidebar-open");
    });
  }

  closeSidebar(event) {
    this.sidebarContent.classList.remove("sidebar-open");
    setTimeout(() => {
      this.sidebar.classList.remove("open");
    }, 150);
  }

  hideFilmMenu() {
    this.menuFilmSidebar.classList.toggle("hidden");
  }
  hideSerialMenu() {
    this.menuSerialSidebar.classList.toggle("hidden");
  }
}
