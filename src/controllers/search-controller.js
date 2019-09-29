import SearchResult from '../components/search-result.js';
import SearchResultGroup from '../components/search-result-group.js';
import SearchResultInfo from '../components/search-result-info.js';
import SearchNoResult from '../components/search-no-result.js';
import TaskListController from '../controllers/task-list-controller.js';

import {renderElement, Position} from '../util.js';

const {AFTERBEGIN} = Position;

export default class SearchController {
  constructor(container, search, onBackButtonClick, onDataChange) {
    this._container = container;
    this._search = search;

    this._onBackButtonClick = onBackButtonClick;
    this._onDataChangeMain = onDataChange;

    this._tasks = [];

    this._searchResult = new SearchResult();
    this._searchResultGroup = new SearchResultGroup();
    this._searchResultInfo = new SearchResultInfo({});
    this._searchNoResult = new SearchNoResult();
    this._taskListController = new TaskListController(this._searchResultGroup.getElement().querySelector(`.result__cards`), this._onDataChange.bind(this));

    this.init();
  }

  _show(tasks) {
    this._tasks = tasks;
    this._renderSearchResult(``, this._tasks);
    this._searchResult.getElement().classList.remove(`visually-hidden`);
  }

  _hide() {
    this._searchResult.getElement().classList.add(`visually-hidden`);
  }

  _renderSearchResult(text, tasks) {
    this._searchResultInfo.removeElement();

    if (!this._tasks) {
      this._searchResultGroup.getElement().querySelector(`.result__cards`).innerHTML = ``;
      renderElement(this._searchResultGroup.getElement(), this._searchNoResult.getElement(), AFTERBEGIN);
    } else {
      this._searchNoResult.removeElement();

      this._searchResultInfo = new SearchResultInfo({title: text, count: tasks.length});
      renderElement(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), AFTERBEGIN);
      this._taskListController._renderTasks(tasks, tasks.slice(tasks.length));
    }
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
    this._onDataChangeMain(tasks);
    this._taskListController._renderTasks(tasks, tasks.slice(tasks.length));
    this._searchResultInfo._updateCount(tasks.length);
  }

  init() {
    this._hide();

    renderElement(this._container, this._searchResult.getElement());
    renderElement(this._searchResult.getElement(), this._searchResultGroup.getElement());
    renderElement(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), AFTERBEGIN);

    this._searchResult.getElement().querySelector(`.result__back`).addEventListener(`click`, () => {
      this._search.getElement().querySelector(`input`).value = ``;
      this._onBackButtonClick();
    });

    this._search.getElement().querySelector(`input`).addEventListener(`keyup`, (evt) => {
      const {value} = evt.target;
      const tasks = this._tasks.filter((task) => {
        return task.description.includes(value);
      });

      this._renderSearchResult(value, tasks);
    });
  }
}
