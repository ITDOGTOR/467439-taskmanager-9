export const createFilterTemplate = ({title, count}) => {
  return `<input
    type="radio"
    id="filter__${title}"
    class="filter__input visually-hidden"
    name="filter"
    ${title === `all` ? `checked` : ``}
    ${count ? `` : `disabled`}
  />
  <label for="filter__${title}" class="filter__label">
    ${title} <span class="filter__${title}-count">${count}</span></label
  >`.trim();
};
