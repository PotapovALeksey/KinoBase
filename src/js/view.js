import EventEmitter from "./event-emiter";
import createCards from "./templates/cards.hbs";
import createFavorites from "./templates/favorite-cards.hbs";
import createSearch from "./templates/search-cards.hbs";
import cardContent from "./templates/card-content.hbs";
import createSliderActors from "./templates/slider-actors.hbs";
import createSliderCadrs from "./templates/slider-cadrs.hbs";
import $ from "jquery";
import "slick-carousel";
import * as storage from "./storage";

export default class View extends EventEmitter {
  constructor() {
    super();
    this.localStorageFavorites = storage.get() || [];
    this.content = document.querySelector("#content");
    this.filmLink = document.querySelector('a[data-category="movie"]');
    this.serialLink = document.querySelector('a[data-category="tv"]');
    this.favoriteLink = document.querySelector('a[data-category="favorite"]');
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
    this.category = document.querySelector(
      'input[type="radio"]:checked'
    ).dataset.category;

    const value = this.formInput.value;
    const options = { category: this.category, value };
    this.form.reset();

    this.emit("search", options);
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
    if (!target.classList.contains("js-list__item-overlay")) {
      return;
    }

    const item = target.closest("li[data-actions='card']");
    this.category = item.dataset.category;
    const id = item.dataset.id;

    const options = { category: this.category, id };
    this.emit("loadDetailFilm", options);
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

    const item = target.closest("[data-actions='card']");
    const button = item.querySelector(".js-list__item-button");
    const id = item.dataset.id;
    const title = item.querySelector(".js-list__item-title").textContent;
    const img = item.querySelector(".js-list__item-img").src;

    const card = {
      id,
      title,
      img,
      category: this.category
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
    this.checkFavoritesCard(storage.get());
    this.addCardsAtrCategory(this.category);
  }

  createFavoriteCards(data) {
    let markup =
      data.length > 0 ? createFavorites(data) : this.createAboutFavoriteText();

    this.content.innerHTML = markup;
    this.toHidePagination();
  }

  createSearchCards(data) {
    let markup =
      data.length > 0 ? createSearch(data) : this.createAboutSearch();

    this.content.innerHTML = markup;
    this.addCardsAtrCategory(this.category);
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
    const cardInfo = cardContent(data[0]);

    this.content.innerHTML = cardInfo;
    this.toHidePagination();

    this.createSliderActors(data[1]);
    this.createSliderCadrs(data[2]);
  }

  createSliderActors(data) {
    const markupSliderActors = createSliderActors(data);

    const sliderActorsWrap = document.querySelector(
      ".js-content__slider-actors-wrap"
    );

    sliderActorsWrap.innerHTML = markupSliderActors;
    const sliderList = document.querySelector(".js-content__slider-actors");

    this.sliderActors(sliderList);
  }

  createSliderCadrs(data) {
    const markupSliderCadr = createSliderCadrs(data);
    const sliderCadrsWrap = document.querySelector(
      ".js-content__slider-cadrs-wrap"
    );
    sliderCadrsWrap.innerHTML = markupSliderCadr;
    const sliderList = document.querySelector(".js-content__slider-cadrs");
    console.log(sliderList);
    this.slideCadrs(sliderList);
  }

  addCardsAtrCategory(category) {
    const cards = document.querySelectorAll("li[data-actions='card']");

    cards.forEach(item => item.setAttribute("data-category", category));
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
    if (!arr) {
      return;
    }

    const idArr = arr.map(el => el.id);

    const items = [...document.querySelectorAll(".js-cards-list__item")];
    const favoritesItems = items.filter(el => idArr.includes(el.dataset.id));

    let button;
    favoritesItems.forEach(el => {
      el.classList.add('isFavorites')
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

  sliderActors(elem) {
    $(elem).slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      prevArrow:
        '<button type="button" class=" icon-left-open slider-prev slider-button"></button>',
      nextArrow:
        '<button type="button" class=" icon-right-open slider-next slider-button"></button>'
    });
  }

  slideCadrs(elem) {
    $(elem).slick({
      infinite: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 1000,
      fade: true,
      cssEase: "linear",
      prevArrow:
        '<button type="button" class=" icon-left-circle slider-prev slider-button"></button>',
      nextArrow:
        '<button type="button" class=" icon-right-circle slider-next slider-button"></button>'
    });
  }
}
