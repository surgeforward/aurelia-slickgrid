"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../models/index");
var filterUtilities_1 = require("./filterUtilities");
var utilities_1 = require("./../services/utilities");
var moment = require("moment");
var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateIso);
exports.dateIsoFilterCondition = function (options) {
    if (!moment(options.cellValue, FORMAT, true).isValid() || !moment(options.searchTerm, FORMAT, true).isValid()) {
        return true;
    }
    var dateCell = moment(options.cellValue, FORMAT, true);
    var dateSearch = moment(options.searchTerm, FORMAT, true);
    // run the filter condition with date in Unix Timestamp format
    return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
//# sourceMappingURL=dateIsoFilterCondition.js.map