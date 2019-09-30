import Filter from '../components/filter.js';

import {getFilters} from '../data.js';
import {renderElement} from '../util.js';

export default class FilterController {
  constructor(container) {
    this._container = container;
  }

  _renderFilters(filters) {
    this._container.innerHTML = ``;
    filters.forEach((filter) => this._renderFilter(filter));
  }

  _renderFilter(filter) {
    renderElement(this._container, new Filter(filter).getElement());
  }

  _updateFilters(tasks) {
    const currentFilter = Array.from(this._container.querySelectorAll(`.filter__input`)).find((filter) => filter.checked).id;
    const newFilters = getFilters(tasks);

    this._renderFilters(newFilters);
    this._container.querySelector(`#${currentFilter}`).checked = true;
  }
}
