/* eslint-disable */
import { Regex } from './constants';

export function replaceWithDefault(value: any, defaultValue: any) {
    if (defaultValue) {
        return defaultValue;
    }

    return value;
}

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0; const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function replaceAll(str: string, oldValue, newValue) {
    if (str == null) {
return '';
}

    const occuranciesCount = (str.split(oldValue)).length - 1;
    for (let index = 0; index < occuranciesCount; index++) {
        str = str.replace(oldValue, newValue);
    }

    return str;
}

export function allowOnlyNumbers(e) {
    e = e || window.event;
    const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
    const charStr = String.fromCharCode(charCode);
    if (isNaN(+charStr) || charStr === ' ') {
        e.preventDefault();
        return false;
    }
    return true;
}

export function allowInteger(e) {
    if (isNaN(+e.key) || e.key === ' ') {
        return false;
    }
    return true;
}

export function allowDecimal(e, d) {
    e = e || window.event;
    const value = e.target.value;
    const key = e.key;
    const allvalue = value + key;
    if (key === '.') {
        if (value.indexOf('.') > -1) {
            return false;
        } else {
            return true;
        }
    }

    if (allvalue.indexOf('.') > -1) {
        const afterDecimal = allvalue.split('.')[1].length;
        if (afterDecimal > d) {
            return false;
        }
    }

    if (isNaN(+key) || key === ' ') {
        return false;
    }
    return true;
}

export function allowOnlyNumbersWithDecimals(e, d) {
    e = e || window.event;
    const value = e.target.value;
    const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
    const charStr = String.fromCharCode(charCode);
    const allvalue = value + charStr;
    if (charStr === '.' && d > 0) {
        if (value.indexOf('.') > -1) {
            e.preventDefault();
            return false;
        } else {
            return true;
        }
    }

    if (allvalue.indexOf('.') > -1) {
        const afterDecimal = allvalue.split('.')[1].length;
        if (afterDecimal > d) {
            e.preventDefault();
            return false;
        }
    }

    if (isNaN(+charStr) || charStr === ' ') {
        e.preventDefault();
        return false;
    }
    return true;
}

export function replaceValueInObject(object: Object, searchValue: any, replaceValue: any) {
    const cache = [];
    function _replaceValueInObject(object: Object, searchValue: any, replaceValue: any) {
        if (!object) {
            return;
        }

        if (typeof object === 'object') {
            if (cache.indexOf(object) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(object);
        }

        for (const key of Object.keys(object)) {
            if (object[key] instanceof Object) {
                _replaceValueInObject(object[key], searchValue, replaceValue);
            } else if (object[key] instanceof Array) {
                object[key]?.forEach(i => {
                    _replaceValueInObject(i, searchValue, replaceValue);
                });
            } else if (object[key] === searchValue) {
                object[key] = replaceValue;
            }
        }
    }
    _replaceValueInObject(object, searchValue, replaceValue);
}


export function convertDates(object: Object) {
    if (!object || !(object instanceof Object)) {
        return;
    }

    for (const key of Object.keys(object)) {
        const value = object[key];

        if (typeof value === 'string' && Regex.DATE.test(value)) {
            object[key] = new Date(value);
        }
    }
}

export function stringifyObject(obj: any) {

    var cache = [];

    return JSON.stringify(obj, (key, value) => {

        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        if (value === '' || value === undefined || value === null) {
return null;
}
        return value;
    });
}
