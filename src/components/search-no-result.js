import AbstractComponent from '../components/abstract-component.js';

export default class SearchNoResult extends AbstractComponent {
  getTemplate() {
    return `<p class="result__empty">no matches found...</p>`;
  }
}
