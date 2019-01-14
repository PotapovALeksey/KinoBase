export const set = value => {
  localStorage.setItem("movies", JSON.stringify(value));
};

export const get = () => {
  const data = localStorage.getItem("movies");
  return data ? JSON.parse(data) : null;
};
