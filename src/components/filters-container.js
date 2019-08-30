import AbstractComponent from '../components/abstract-component.js';

export default class FiltersContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="main__filter filter container">
    </section>`;
  }
}
