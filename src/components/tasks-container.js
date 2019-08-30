import AbstractComponent from '../components/abstract-component.js';

export default class TasksContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="board__tasks">
    </div>`;
  }
}
