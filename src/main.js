import Menu from '../src/components/menu.js';
import Search from '../src/components/search.js';
import FiltersContainer from '../src/components/filters-container.js';
import Filter from '../src/components/filter.js';
import Statistics from '../src/components/statistics.js';
import BoardController from '../src/controllers/board-controller.js';

import {taskMocks, filtersList} from '../src/data.js';
import {renderElement} from '../src/util.js';

const copyTasks = taskMocks.slice().filter((task) => !task.isArchive);

const renderFilter = (filter) => {
  const filterElement = new Filter(filter);
  const filtersContainer = document.querySelector(`.main__filter`);

  renderElement(filtersContainer, filterElement.getElement());
};

const renderFilters = (filters) => filters.forEach((filter) => renderFilter(filter));

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

const menu = new Menu();
const search = new Search();
const filtersContainer = new FiltersContainer();
const statistics = new Statistics();

statistics.getElement().classList.add(`visually-hidden`);

renderElement(menuContainer, menu.getElement());
renderElement(mainContainer, search.getElement());
renderElement(mainContainer, filtersContainer.getElement());
renderFilters(filtersList);
renderElement(mainContainer, statistics.getElement());
const boardController = new BoardController(mainContainer, copyTasks);
boardController.init();

menu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `INPUT`) {
    return;
  }

  switch (evt.target.id) {
    case `control__task`:
      statistics.getElement().classList.add(`visually-hidden`);
      boardController.show();
      break;
    case `control__statistic`:
      boardController.hide();
      statistics.getElement().classList.remove(`visually-hidden`);
      break;
  }
});
