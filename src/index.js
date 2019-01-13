import "./scss/styles.scss";
import "@babel/polyfill";
import View from "./js/view";
import Model from "./js/model";
import Controller from "./js/controller";

const APIKEY = "fe18199fa91ee3037cc04bdedf00704c";
const url = `https://api.themoviedb.org/3/movie/550?api_key=${APIKEY}`;

const model = new Model();
const view = new View();
const controller = new Controller(model, view);



// const list = document.querySelector("#slider-actors");
// const left = document.querySelector("#left");
// const right = document.querySelector("#right");

// left.addEventListener("click", leftSlider);
// right.addEventListener("click", rightSlider);

// let leftPx = 0;
// let rightPx = 0;
// function leftSlider() {

//     leftPx = leftPx - 128;
//   list.style.left = leftPx + "px";

//   if (leftPx === -512) {
//     leftPx = 0;
//   }
// }

// function rightSlider() {
//   rightPx = rightPx - 128;
//   list.style.right = rightPx + "px";
//   if (rightPx === -512) {
//     rightPx = 0;
//   }
// }
