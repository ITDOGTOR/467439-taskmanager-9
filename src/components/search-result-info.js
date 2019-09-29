import AbstractComponent from '../components/abstract-component.js';

export default class SearchResultInfo extends AbstractComponent {
  constructor({title, count}) {
    super();
    this._title = title;
    this._count = count;
  }

  _updateCount(count) {
    this.getElement().querySelector(`.result__count`).textContent = count;
  }

  getTemplate() {
    return `<h2 class="result__title">
      ${!this._title ? `ALL` : this._title}<span class="result__count">${!this._count ? `0` : this._count}</span>
    </h2>`;
  }
}
