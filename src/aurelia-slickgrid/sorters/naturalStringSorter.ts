import { Sorter, SortDirectionNumber } from './../models/index';

export const naturalStringSorter: Sorter = (value1: any, value2: any, sortDirection: number | SortDirectionNumber) => {

  // tslint:disable-next-line:only-arrow-functions
  const naturalSort = function (a, b) {
    // tslint:disable-next-line:one-variable-per-declaration
    const re = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi,
      sre = /(^[ ]*|[ ]*$)/g,
      dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
      hre = /^0x[0-9a-f]+$/i,
      ore = /^0/,
      // tslint:disable-next-line:only-arrow-functions
      i = function (s) { return (naturalSort as any).insensitive && ('' + s).toLowerCase() || '' + s; },
      // convert all to strings strip whitespace
      x: any = i(a).replace(sre, '') || '',
      y: any = i(b).replace(sre, '') || '',
      // chunk/tokenize
      xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
      yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
      // numeric, hex or date detection
      xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && x.match(dre) && Date.parse(x)),
      yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null;
    // tslint:disable-next-line:one-variable-per-declaration
    let oFxNcL, oFyNcL;
    // first try and sort Hex codes or Dates
    if (yD) {
      if (xD < yD) { return -1; } else if (xD > yD) { return 1; }
    }
    // natural sorting through split numeric strings and default strings
    for (let cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
      // find floats not starting with '0', string or 0 if not defined (Clint Priest)
      oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
      oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
      // handle numeric vs string comparison - number < string - (Kyle Adams)
      if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; } else if (typeof oFxNcL !== typeof oFyNcL) {
        oFxNcL += '';
        oFyNcL += '';
      }
      if (oFxNcL < oFyNcL) { return -1; }
      if (oFxNcL > oFyNcL) { return 1; }
    }
    return 0;
  };

  if (sortDirection === undefined || sortDirection === null) {
    sortDirection = SortDirectionNumber.neutral;
  }
  const position = naturalSort(value1, value2);
  return sortDirection * position;
};
