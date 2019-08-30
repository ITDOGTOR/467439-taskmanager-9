import Menu from '../src/components/menu.js';
import Search from '../src/components/search.js';
import FiltersContainer from '../src/components/filters-container.js';
import Filter from '../src/components/filter.js';
import BoardController from '../src/controllers/board-controller.js';

import {taskMocks, filtersList} from '../src/data.js';
import {renderElement} from '../src/util.js';

const copyTasks = taskMocks.slice();

const renderFilter = (filter) => {
  const filterElement = new Filter(filter);
  const filtersContainer = document.querySelector(`.main__filter`);

  renderElement(filtersContainer, filterElement.getElement());
};

const renderFilters = (filters) => filters.forEach((filter) => renderFilter(filter));

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);
renderElement(menuContainer, new Menu().getElement());
renderElement(mainContainer, new Search().getElement());
renderElement(mainContainer, new FiltersContainer().getElement());
renderFilters(filtersList);
const boardController = new BoardController(mainContainer, copyTasks);
boardController.init();
