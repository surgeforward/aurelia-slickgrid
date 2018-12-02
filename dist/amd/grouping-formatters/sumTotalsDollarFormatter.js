define(["require", "exports", "./../services/utilities"], function (require, exports, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sumTotalsDollarFormatter = function (totals, columnDef, grid) {
        var field = columnDef.field || '';
        var val = totals.sum && totals.sum[field];
        var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
        var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
        if (val != null) {
            return prefix + '$' + utilities_1.decimalFormatted(val, 2, 2) + suffix;
        }
        return '';
    };
});
//# sourceMappingURL=sumTotalsDollarFormatter.js.map