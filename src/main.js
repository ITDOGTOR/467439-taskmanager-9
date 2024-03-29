import Menu from '../src/components/menu.js';
import Search from '../src/components/search.js';
import FiltersContainer from '../src/components/filters-container.js';
import Filter from '../src/components/filter.js';
import Statistics from '../src/components/statistics.js';
import BoardController from '../src/controllers/board-controller.js';
import SearchController from '../src/controllers/search-controller.js';

import {taskMocks, filtersList} from '../src/data.js';
import {renderElement} from '../src/util.js';

const IdValues = {
  TASKS: `control__task`,
  STATISTICS: `control__statistic`,
  ADD_NEW_TASKS: `control__new-task`,
};
const {TASKS, STATISTICS, ADD_NEW_TASKS} = IdValues;

const renderFilter = (filter) => {
  const filterElement = new Filter(filter);
  const filtersContainer = document.querySelector(`.main__filter`);

  renderElement(filtersContainer, filterElement.getElement());
};
const renderFilters = (filters) => filters.forEach((filter) => renderFilter(filter));

const onDataChange = (tasks) => {
  copyTasks = tasks;
};
let copyTasks = taskMocks;

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

const menu = new Menu();
const search = new Search();
const filtersContainer = new FiltersContainer();
const statistics = new Statistics();

statistics.getElement().classList.add(`visually-hidden`); // Скрывает контейнер со статистикой при отрисовке страницы

renderElement(menuContainer, menu.getElement());
renderElement(mainContainer, search.getElement());
renderElement(mainContainer, filtersContainer.getElement());
renderFilters(filtersList);
renderElement(mainContainer, statistics.getElement());

const onSearchBackButtonClick = () => {
  statistics.getElement().classList.add(`visually-hidden`);
  searchController._hide();
  boardController._show(copyTasks);
};

const boardController = new BoardController(mainContainer, onDataChange);
const searchController = new SearchController(mainContainer, search, onSearchBackButtonClick, onDataChange);

boardController._show(copyTasks);

menu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `INPUT`) {
    return;
  }

  switch (evt.target.id) {
    case TASKS:
      statistics.getElement().classList.add(`visually-hidden`);
      boardController._show(copyTasks);
      break;
    case STATISTICS:
      boardController._hide();
      statistics.getElement().classList.remove(`visually-hidden`);
      break;
    case ADD_NEW_TASKS:
      boardController._renderNewTask();
      menu.getElement().querySelector(`#${TASKS}`).checked = true; // Возвращает состояние checked TASKS
      break;
  }
});

search.getElement().addEventListener(`click`, () => {
  statistics.getElement().classList.add(`visually-hidden`);
  boardController._hide();
  searchController._show(copyTasks);
});
