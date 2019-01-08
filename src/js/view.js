import EventEmitter from "./event-emiter";
import createCards from "./templates/cards.hbs";

export default class View extends EventEmitter {
  constructor() {
    super();
    this.content = document.querySelector("#content");
    this.filmLink = document.querySelector('[data-category="film"]');
    this.serialLink = document.querySelector('[data-category="serial"]');
    this.pagination = document.querySelector(".js-pagination");
    this.paginationLinks = [
      ...document.querySelectorAll(".js-pagination__link")
    ];
    this.navLinks = [...document.querySelectorAll(".js-nav-list__link")];
    this.page = 1;

    document.addEventListener(
      "DOMContentLoaded",
      this.handleLoadFilm.bind(this)
    );
    this.pagination.addEventListener(
      "click",
      this.handleClickPagination.bind(this)
    );

    this.filmLink.addEventListener("click", this.handleClickFilm.bind(this));

    this.serialLink.addEventListener(
      "click",
      this.handleClickSerial.bind(this)
    );
  }

  handleLoadFilm() {
    this.emit("loadContent", this.page);
  }

  handleClickFilm({ target }) {
    this.page = 1;
    const category = target.dataset.category;

    this.changeColorLinkNav(this.navLinks, "current", category);
    this.changeColorLinkPag(this.paginationLinks, "current", this.page);

    this.emit("loadFilm", this.page);
  }

  handleClickSerial({ target }) {
    this.page = 1;
    const category = target.dataset.category;

    this.changeColorLinkNav(this.navLinks, "current", category);
    this.changeColorLinkPag(this.paginationLinks, "current", this.page);

    this.emit("loadSerial", this.page);
  }

  handleClickPagination({ target }) {
    if (!target.classList.contains("pagination__link")) {
      return;
    }

    this.page = target.textContent;
    this.changeColorLink(this.paginationLinks, "current", this.page);

    this.emit("loadPageNum", this.page);
  }

  createMarkupCards(data) {
    const markup = createCards(data);

    this.content.innerHTML = markup;
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
}
