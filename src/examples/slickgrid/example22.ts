import {
  Column,
  FieldType,
  Formatter,
  Formatters,
  GridOption,
  AureliaGridInstance,
  Filters,
} from '../../aurelia-slickgrid';
import * as $ from 'jquery';

const taskNameFormatter: Formatter = (row, cell, value, columnDef, dataContext, grid) => {
  if (value == null || value == undefined || dataContext === undefined) { return ''; }
  const dataView = grid.getData();
  const data = dataView.getItems();

  value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const spacer = `<span style="display:inline-block;height:1px;width:${(15 * dataContext['__indent'])}px"></span>`;
  const idx = dataView.getIdxById(dataContext.id);
  if (data[idx + 1] && data[idx + 1].__indent > data[idx].__indent) {
    if (dataContext.__collapsed) {
      return `${spacer} <span class='slick-group-toggle collapsed'></span>&nbsp;${value}`;
    } else {
      return `${spacer} <span class='slick-group-toggle expanded'></span>&nbsp;${value}`;
    }
  } else {
    return `${spacer} <span class='slick-group-toggle'></span>&nbsp;${value}`;
  }
};

function myFilter(dataView, item) {
  const data = dataView.getItems();
  if (item.__parent !== null) {
    let parent = data[item.__parent];
    while (parent) {
      if (parent.__collapsed) {
        return false;
      }
      parent = data[parent.__parent];
    }
  }
  return true;
}

export class Example2 {
  title = 'Example 22: Tree View';
  subTitle = ``;

  aureliaGrid: AureliaGridInstance;
  gridOptions: GridOption;
  columnDefinitions: Column[];
  dataset: any[];

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
    const grid = aureliaGrid.slickGrid;
    const dataView = aureliaGrid.dataView;
    // wire up model events to drive the grid
    // dataView.onRowCountChanged.subscribe((e, args) => {
    //   grid.updateRowCount();
    //   grid.render();
    // });
    // dataView.onRowsChanged.subscribe((e, args) => {
    //   grid.invalidateRows(args.rows);
    //   grid.render();
    // });
    // grid.onCellChange.subscribe((e, args) => {
    //   dataView.updateItem(args.item.id, args.item);
    // });
    // dataView.setFilter(myFilter.bind(this, dataView));
  }

  onCellClicked(e, args) {
    if ($(e.target).hasClass('slick-group-toggle')) {
      const item = this.aureliaGrid.dataView.getItem(args.row);
      if (item) {
        if (!item.__collapsed) {
          item.__collapsed = true;
        } else {
          item.__collapsed = false;
        }
        this.aureliaGrid.dataView.updateItem(item.id, item);
      }
      e.stopImmediatePropagation();
    }
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', filterable: true, sortable: true, type: FieldType.string, width: 150, formatter: taskNameFormatter },
      { id: 'duration', name: 'Duration (days)', field: 'duration', filterable: true, formatter: Formatters.decimal, params: { minDecimalPlaces: 1, maxDecimalPlaces: 2 }, sortable: true, type: FieldType.number, minWidth: 90, exportWithFormatter: true },
      { id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, sortable: true, minWidth: 100, filterable: true, filter: { model: Filters.slider, operator: '>' } },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate } },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate } },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven',
        minWidth: 100,
        formatter: Formatters.checkmark, type: FieldType.boolean,
        filterable: true, sortable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableCellNavigation: true,
      enableFiltering: true,
      enableExcelCopyBuffer: true,
      enableTreeView: true
    };
  }

  getData() {
    // mock a dataset
    let indent = 0;
    this.dataset = [];
    const parents = [];

    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);
      if (Math.random() > 0.8 && i > 0) {
        indent++;
        parents.push(i - 1);
      } else if (Math.random() < 0.3 && indent > 0) {
        indent--;
        parents.pop();
      }

      let parent;
      if (parents.length > 0) {
        parent = parents[parents.length - 1];
      } else {
        parent = null;
      }

      this.dataset[i] = {
        id: i,
        __indent: indent,
        __parent: parent,
        title: 'Task ' + i,
        duration: (i % 33 === 0) ? null : Math.random() * 100 + '',
        percentComplete: randomPercent,
        percentComplete2: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      };
    }
  }
}
