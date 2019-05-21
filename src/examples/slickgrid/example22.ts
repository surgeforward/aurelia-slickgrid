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

const filePathFormatter: Formatter = (row, cell, value, columnDef, dataContext, grid) => {
  if (value === null || value === undefined || dataContext === undefined) {
    return '';
  }
  const dataView = grid.getData();
  const data = dataView.getItems();
  const idx = dataView.getIdxById(dataContext.id);
  let prefix = '';
  if (value.indexOf('.pdf') > 0) {
    prefix = '<i class="text-danger fa fa-file-pdf-o"></i>';
  } else if (value.indexOf('.txt') > 0) {
    prefix = '<i class="fa fa-file-text-o"></i>';
  } else if (value.indexOf('.xls') > 0) {
    prefix = '<i class="text-success fa fa-file-excel-o"></i>';
  } else if (value.indexOf('.mp3') > 0) {
    prefix = '<i class="text-info fa fa-file-audio-o"></i>';
  }

  value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const spacer = `<span style="display:inline-block;width:${(15 * dataContext['__treeLevel'])}px"></span>`;

  if (data[idx + 1] && data[idx + 1].__treeLevel > data[idx].__treeLevel) {
    if (dataContext.__collapsed) {
      return `${spacer} <span class="slick-group-toggle collapsed" level="${dataContext['__treeLevel']}"></span>${prefix}&nbsp;${value}`;
    } else {
      return `${spacer} <span class="slick-group-toggle expanded" level="${dataContext['__treeLevel']}"></span>${prefix}&nbsp;${value}`;
    }
  } else {
    return `${spacer} <span class="slick-group-toggle" level="${dataContext['__treeLevel']}"></span>${prefix}&nbsp;${value}`;
  }
};

function myFilter(dataView, item) {
  const data = dataView.getItems();
  if (item.__parent !== null) {
    const idx = dataView.getIdxById(item.__parent);
    let parent = data[idx];
    while (parent) {
      if (parent.__collapsed) {
        return false;
      }
      parent = data[dataView.getIdxById(parent.__parent)];
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

    dataView.setFilter(myFilter.bind(this, dataView));
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
      { id: 'file', name: 'Files', field: 'file', filterable: true, sortable: true, type: FieldType.string, width: 150, formatter: filePathFormatter },
      { id: 'dateModified', name: 'Date Modified', field: 'dateModified', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate } },
      { id: 'size', name: 'Size', field: 'size', sortable: true, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate } },
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableCellNavigation: true,
      enableFiltering: false,
      enableGrouping: true,
      enableExcelCopyBuffer: true,
      enableTreeView: true
    };
  }

  getData() {
    this.dataset = [
      { id: 21, file: 'Documents', __parent: null, __treeLevel: 0 },
      { id: 2, file: 'txt', __parent: 21, __treeLevel: 1 },
      { id: 3, file: 'todo.txt', __parent: 2, __treeLevel: 2, dateModified: '2015-05-12T14:50:00', size: 0.7, },
      { id: 4, file: 'pdf', __parent: 21, __treeLevel: 1 },
      { id: 5, file: 'map.pdf', __parent: 4, __treeLevel: 2, dateModified: '2015-05-21T10:22:00', size: 3.1, },
      { id: 6, file: 'internet-bill.pdf', __parent: 4, __treeLevel: 2, dateModified: '2015-05-12T14:50:00', size: 1.4, },
      { id: 7, file: 'xls', __parent: 21, __treeLevel: 1 },
      { id: 8, file: 'compilation.xls', __parent: 7, __treeLevel: 2, dateModified: '2014-10-02T14:50:00', size: 2.3, },
      { id: 9, file: 'misc', __parent: 21, __treeLevel: 1 },
      { id: 10, file: 'something.txt', __parent: 9, __treeLevel: 2, dateModified: '2015-02-26T16:50:00', size: 0.4, },
      { id: 11, file: 'Music', __parent: null, __treeLevel: 0 },
      { id: 12, file: 'mp3', __parent: 11, __treeLevel: 1 },
      { id: 14, file: 'pop', __parent: 12, __treeLevel: 2 },
      { id: 15, file: 'theme.mp3', __parent: 14, __treeLevel: 3, dateModified: '2015-03-01T17:05:00', size: 85, },
      { id: 16, file: 'rock', __parent: 12, __treeLevel: 2 },
      { id: 17, file: 'soft.mp3', __parent: 16, __treeLevel: 3, dateModified: '2015-05-13T13:50:00', size: 98, },
      { id: 18, file: 'else.txt', __parent: null, __treeLevel: 0, dateModified: '2015-03-03T03:50:00', size: 90, },
    ];
  }
}
