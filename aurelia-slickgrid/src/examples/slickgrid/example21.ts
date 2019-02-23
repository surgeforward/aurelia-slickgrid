import { EventAggregator } from 'aurelia-event-aggregator';
import { AureliaUtilService } from './../../aurelia-slickgrid/services/aureliaUtilService';
import { autoinject, PLATFORM } from 'aurelia-framework';
import { HttpClient as FetchClient } from 'aurelia-fetch-client';
import { HttpClient } from 'aurelia-http-client';
import { I18N } from 'aurelia-i18n';
import {
  AureliaGridInstance,
  Column,
  Editors,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  OnEventArgs,
  OperatorType,
} from '../../aurelia-slickgrid';
import { CustomAureliaViewModelEditor } from './custom-aureliaViewModelEditor';

// using external non-typed js libraries
declare var Slick: any;

const NB_ITEMS = 100;

@autoinject()
export class Example21 {
  title = 'Example 21: Use of Angular Components';
  subTitle = `
  <h4>Filters, Editors, AsyncPostRender with Angular Components</h4>
  <ul>
    <li>Support of Angular Component as Custom Editor (click on "Assignee" column)</li>
    <li>The column "Assignee" shown below uses <a href="https://github.com/ng-select/ng-select" target="_blank">ng-select</a> as a custom editor with Angular Component
    <li>Increased rowHeight to 45 so that the "ng-select" fits in the cell. Ideally it would be better to override the ng-select component styling to change it's max height</li>
  </ul>
  `;
  private _commandQueue = [];
  aureliaGrid: AureliaGridInstance;
  gridObj: any;
  gridOptions: GridOption;
  columnDefinitions: Column[];
  dataset: any[];
  updatedObject: any;
  isAutoEdit: boolean = true;
  alertWarning: any;
  selectedLanguage: string;
  assignees = [
    { id: '1', name: 'John' },
    { id: '2', name: 'Pierre' },
    { id: '3', name: 'Paul' },
  ];
  selectedItem: any;
  selectedId: string;

  constructor(private aureliaUtilService: AureliaUtilService, private ea: EventAggregator, private http: HttpClient, private httpFetch: FetchClient, private i18n: I18N) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.selectedLanguage = this.i18n.getLocale();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.dataset = this.mockData(NB_ITEMS);
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
    this.gridObj = aureliaGrid && aureliaGrid.slickGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        filterable: true,
        sortable: true,
        type: FieldType.string,
        editor: {
          model: Editors.longText
        },
        minWidth: 100,
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args);
          this.alertWarning = `Updated Title: ${args.dataContext.title}`;
        }
      }, {
        id: 'assignee',
        name: 'Assignee',
        field: 'assignee',
        minWidth: 100,
        filterable: true,
        sortable: true,
        type: FieldType.string,
        formatter: Formatters.complexObject,
        params: {
          complexField: 'assignee.name'
        },
        exportWithFormatter: true,
        editor: {
          model: CustomAureliaViewModelEditor,
          collection: this.assignees,
          params: {
            aureliaUtilService: this.aureliaUtilService,
            eventAggregator: this.ea,
            component: PLATFORM.moduleName('examples/slickgrid/editor-abs-select') // EditorAbsSelect,
          }
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args);
          this.alertWarning = `Updated Title: ${args.dataContext.title}`;
        }
      }, {
        id: 'duration',
        name: 'Duration (days)',
        field: 'duration',
        filterable: true,
        minWidth: 100,
        sortable: true,
        type: FieldType.number,
        filter: { model: Filters.slider, params: { hideSliderNumber: false } },
        editor: {
          model: Editors.slider,
          minValue: 0,
          maxValue: 100,
          // params: { hideSliderNumber: true },
        },
        /*
        editor: {
          // default is 0 decimals, if no decimals is passed it will accept 0 or more decimals
          // however if you pass the "decimalPlaces", it will validate with that maximum
          model: Editors.float,
          minValue: 0,
          maxValue: 365,
          // the default validation error message is in English but you can override it by using "errorMessage"
          // errorMessage: this.i18n.tr('INVALID_FLOAT', { maxDecimal: 2 }),
          params: { decimalPlaces: 2 },
        },
        */
      }, {
        id: 'complete',
        name: '% Complete',
        field: 'percentComplete',
        filterable: true,
        formatter: Formatters.multiple,
        type: FieldType.number,
        editor: {
          // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
          enableRenderHtml: true,
          collection: Array.from(Array(101).keys()).map(k => ({ value: k, label: k, symbol: '<i class="fa fa-percent" style="color:cadetblue"></i>' })),
          customStructure: {
            value: 'value',
            label: 'label',
            labelSuffix: 'symbol'
          },
          collectionSortBy: {
            property: 'label',
            sortDesc: true
          },
          collectionFilterBy: {
            property: 'value',
            value: 0,
            operator: OperatorType.notEqual
          },
          model: Editors.singleSelect,
        },
        minWidth: 100,
        params: {
          formatters: [Formatters.collectionEditor, Formatters.percentCompleteBar],
        }
      }, {
        id: 'start',
        name: 'Start',
        field: 'start',
        filterable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
        sortable: true,
        minWidth: 100,
        type: FieldType.date,
        editor: {
          model: Editors.date
        },
      }, {
        id: 'finish',
        name: 'Finish',
        field: 'finish',
        filterable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
        sortable: true,
        minWidth: 100,
        type: FieldType.date,
        editor: {
          model: Editors.date
        },
      }
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      autoEdit: this.isAutoEdit,
      autoCommitEdit: false,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      rowHeight: 45, // increase row height so that the ng-select fits in the cell
      editable: true,
      enableCellNavigation: true,
      enableColumnPicker: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      editCommandHandler: (item, column, editCommand) => {
        this._commandQueue.push(editCommand);
        editCommand.execute();
      },
      i18n: this.i18n,
    };
  }

  mockData(itemCount, startingIndex = 0) {
    // mock a dataset
    const tempDataset = [];
    for (let i = startingIndex; i < (startingIndex + itemCount); i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      tempDataset.push({
        id: i,
        title: 'Task ' + i,
        assignee: i % 3 ? this.assignees[2] : i % 2 ? this.assignees[1] : this.assignees[0],
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0),
      });
    }
    return tempDataset;
  }

  onCellChanged(e, args) {
    console.log('onCellChange', args);
    this.updatedObject = { ...args.item };
  }

  onCellClicked(e, args) {
    const metadata = this.aureliaGrid.gridService.getColumnFromEventArguments(args);
    console.log(metadata);

    if (metadata.columnDef.id === 'edit') {
      this.alertWarning = `open a modal window to edit: ${metadata.dataContext.title}`;

      // highlight the row, to customize the color, you can change the SASS variable $row-highlight-background-color
      this.aureliaGrid.gridService.highlightRow(args.row, 1500);

      // you could also select the row, when using "enableCellNavigation: true", it automatically selects the row
      // this.aureliaGrid.gridService.setSelectedRow(args.row);
    } else if (metadata.columnDef.id === 'delete') {
      if (confirm('Are you sure?')) {
        this.aureliaGrid.gridService.deleteDataGridItemById(metadata.dataContext.id);
        this.alertWarning = `Deleted: ${metadata.dataContext.title}`;
      }
    }
  }

  onCellValidation(e, args) {
    alert(args.validationResults.msg);
  }

  changeAutoCommit() {
    this.gridOptions.autoCommitEdit = !this.gridOptions.autoCommitEdit;
    this.gridObj.setOptions({
      autoCommitEdit: this.gridOptions.autoCommitEdit
    });
    return true;
  }

  setAutoEdit(isAutoEdit) {
    this.isAutoEdit = isAutoEdit;
    this.gridObj.setOptions({
      autoEdit: isAutoEdit
    });
    return true;
  }

  switchLanguage() {
    this.selectedLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.setLocale(this.selectedLanguage);
  }

  undo() {
    const command = this._commandQueue.pop();
    if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
      command.undo();
      this.gridObj.gotoCell(command.row, command.cell, false);
    }
  }
}
