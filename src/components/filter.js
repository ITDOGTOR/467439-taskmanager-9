import AbstractComponent from '../components/abstract-component.js';

export default class Filter extends AbstractComponent {
  constructor({title, count}) {
    super();
    this._title = title;
    this._count = count;
  }

  getTemplate() {
    return `<span>
      <input
        type="radio"
        id="filter__${this._title}"
        class="filter__input visually-hidden"
        name="filter"
        ${this._title === `all` ? `checked` : ``}
        ${this._count ? `` : `disabled`}
      />
      <label for="filter__${this._title}" class="filter__label">
        ${this._title} <span class="filter__${this._title}-count">${this._count}</span></label
      >
    </span>`;
  }
}
