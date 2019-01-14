import EventEmitter from "./event-emiter";
import createCards from "./templates/cards.hbs";

export default class View extends EventEmitter {
  constructor() {
    super();
    this.content = document.querySelector("#content");
    this.filmLink = document.querySelector('[data-category="movie"]');
    this.serialLink = document.querySelector('[data-category="tv"]');
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
      '[data-title="favorites"]'
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
    this.pagination.addEventListener(
      "click",
      this.handleClickPagination.bind(this)
    );

    this.filmLink.addEventListener("click", this.handleClickFilm.bind(this));

    this.serialLink.addEventListener(
      "click",
      this.handleClickSerial.bind(this)
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
  }

  handleLoadFilm() {
    const options = {
      category: this.category,
      type: this.type,
      page: this.page
    };
    this.emit("loadMovies", options);
  }

  handleClickFilm({ target }) {
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

  handleClickSerial({ target }) {
    this.page = 1;
    this.category = target.dataset.category;
    this.type = target.dataset.type;
    const options = {
      category: this.category,
      type: this.type,
      page: this.page
    };

    this.changeColorLinkNav(this.navLinks, "current", this.category);
    this.changeColorLinkPag(this.paginationLinks, "current", this.page);

    this.emit("loadMovies", options);
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

  createMarkupCards(data) {
    const markup = createCards(data);

    this.content.innerHTML = markup;
  }

  createCardFilm(data) {
    console.log(data);
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
