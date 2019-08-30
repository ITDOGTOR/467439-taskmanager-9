import AbstractComponent from '../components/abstract-component.js';

export default class Board extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="board container">
    </section>`;
  }
}
