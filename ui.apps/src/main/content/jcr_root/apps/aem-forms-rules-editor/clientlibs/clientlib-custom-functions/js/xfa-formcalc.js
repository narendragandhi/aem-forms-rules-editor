/**
 * @fileoverview JavaScript equivalents of FormCalc built-in functions for the
 * XFA IC fragment code editor. Only non-trivial utilities are included.
 * Exposed under {@link window.CustomFormRules.xfa}.
 */
(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    var xfa = window.CustomFormRules.xfa;

    /**
     * Returns the arithmetic mean of a list of numeric values.
     * @name xfaAvg
     * @function
     * @param {Array<number|string>} values - An array of numbers or coercible strings.
     * @return {number} The average of valid entries, or NaN if none valid.
     * @example
     * var avg = CustomFormRules.xfa.xfaAvg([10, 20, 30]);       // 20
     * var avg2 = CustomFormRules.xfa.xfaAvg(["1", "2", "3"]);   // 2
     */
    xfa.xfaAvg = function xfaAvg(values) {
        try {
            if (!Array.isArray(values)) {
                return NaN;
            }
            var sum = 0;
            var count = 0;
            for (var i = 0; i < values.length; i++) {
                var num = Number(values[i]);
                if (!isNaN(num)) {
                    sum += num;
                    count += 1;
                }
            }
            if (count === 0) {
                return NaN;
            }
            return sum / count;
        } catch (e) {
            return NaN;
        }
    };

    /**
     * Rounds a number to a specified number of decimal places (half-up).
     * @name xfaRound
     * @function
     * @param {number} value - The number to round.
     * @param {number} [places=0] - Decimal places.
     * @return {number} The rounded value.
     * @example
     * var r1 = CustomFormRules.xfa.xfaRound(2.675, 2);   // 2.68
     * var r2 = CustomFormRules.xfa.xfaRound(2.5);         // 3
     */
    xfa.xfaRound = function xfaRound(value, places) {
        try {
            var num = Number(value);
            var p = places === undefined ? 0 : Number(places);
            if (isNaN(num)) {
                return NaN;
            }
            if (isNaN(p)) {
                p = 0;
            }
            var factor = Math.pow(10, p);
            return Math.round(num * factor) / factor;
        } catch (e) {
            return NaN;
        }
    };

    /**
     * Returns the smallest value from an array of numbers.
     * @name xfaMin
     * @function
     * @param {Array<number|string>} values - Array of numbers.
     * @return {number} The minimum valid value, or NaN if none.
     * @example
     * var m = CustomFormRules.xfa.xfaMin([5, 3, 8, 1]);   // 1
     */
    xfa.xfaMin = function xfaMin(values) {
        try {
            if (!Array.isArray(values) || values.length === 0) {
                return NaN;
            }
            var min = Infinity;
            var found = false;
            for (var i = 0; i < values.length; i++) {
                var num = Number(values[i]);
                if (!isNaN(num)) {
                    if (num < min) {
                        min = num;
                    }
                    found = true;
                }
            }
            if (!found) {
                return NaN;
            }
            return min;
        } catch (e) {
            return NaN;
        }
    };

    /**
     * Returns the largest value from an array of numbers.
     * @name xfaMax
     * @function
     * @param {Array<number|string>} values - Array of numbers.
     * @return {number} The maximum valid value, or NaN if none.
     * @example
     * var m = CustomFormRules.xfa.xfaMax([5, 3, 8, 1]);   // 8
     */
    xfa.xfaMax = function xfaMax(values) {
        try {
            if (!Array.isArray(values) || values.length === 0) {
                return NaN;
            }
            var max = -Infinity;
            var found = false;
            for (var i = 0; i < values.length; i++) {
                var num = Number(values[i]);
                if (!isNaN(num)) {
                    if (num > max) {
                        max = num;
                    }
                    found = true;
                }
            }
            if (!found) {
                return NaN;
            }
            return max;
        } catch (e) {
            return NaN;
        }
    };

    /**
     * Returns the sum of all values in an array.
     * @name xfaSum
     * @function
     * @param {Array<number|string>} values - Array of numbers.
     * @return {number} The total of all valid entries.
     * @example
     * var s = CustomFormRules.xfa.xfaSum([1, 2, 3, 4]);   // 10
     */
    xfa.xfaSum = function xfaSum(values) {
        try {
            if (!Array.isArray(values)) {
                return 0;
            }
            var sum = 0;
            for (var i = 0; i < values.length; i++) {
                var num = Number(values[i]);
                if (!isNaN(num)) {
                    sum += num;
                }
            }
            return sum;
        } catch (e) {
            return 0;
        }
    };

    /**
     * Returns the current date as a string in YYYYMMDD format.
     * @name xfaDateNow
     * @function
     * @return {string} Today's date in YYYYMMDD format.
     * @example
     * var today = CustomFormRules.xfa.xfaDateNow(); // e.g. "20260722"
     */
    xfa.xfaDateNow = function xfaDateNow() {
        try {
            var now = new Date();
            var y = String(now.getFullYear());
            var m = String(now.getMonth() + 1);
            var d = String(now.getDate());
            while (m.length < 2) { m = "0" + m; }
            while (d.length < 2) { d = "0" + d; }
            return y + m + d;
        } catch (e) {
            return "";
        }
    };

    /**
     * Returns the current time as a string in HHMMSS (24-hour) format.
     * @name xfaTimeNow
     * @function
     * @return {string} The current time in HHMMSS format.
     * @example
     * var now = CustomFormRules.xfa.xfaTimeNow(); // e.g. "143059"
     */
    xfa.xfaTimeNow = function xfaTimeNow() {
        try {
            var now = new Date();
            var h = String(now.getHours());
            var m = String(now.getMinutes());
            var s = String(now.getSeconds());
            while (h.length < 2) { h = "0" + h; }
            while (m.length < 2) { m = "0" + m; }
            while (s.length < 2) { s = "0" + s; }
            return h + m + s;
        } catch (e) {
            return "";
        }
    };

    /**
     * Converts a date string to a numeric value (days since FormCalc epoch Dec 30, 1899).
     * Accepts MM/DD/YYYY or YYYYMMDD format.
     * @name xfaDateToNum
     * @function
     * @param {string} dateStr - A date string.
     * @return {number} The number of days since the FormCalc epoch.
     * @example
     * var n = CustomFormRules.xfa.xfaDateToNum("12/25/2024"); // 45654
     */
    xfa.xfaDateToNum = function xfaDateToNum(dateStr) {
        try {
            if (typeof dateStr !== "string" || dateStr.length === 0) {
                return NaN;
            }
            var date;
            if (/^\d{8}$/.test(dateStr)) {
                var y = parseInt(dateStr.substring(0, 4), 10);
                var m = parseInt(dateStr.substring(4, 6), 10) - 1;
                var d = parseInt(dateStr.substring(6, 8), 10);
                date = new Date(y, m, d);
            } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
                var parts = dateStr.split("/");
                var m2 = parseInt(parts[0], 10) - 1;
                var d2 = parseInt(parts[1], 10);
                var y2 = parseInt(parts[2], 10);
                date = new Date(y2, m2, d2);
            } else {
                return NaN;
            }
            if (isNaN(date.getTime())) {
                return NaN;
            }
            var epoch = new Date(1899, 11, 30);
            var diffMs = date.getTime() - epoch.getTime();
            return Math.round(diffMs / (1000 * 60 * 60 * 24));
        } catch (e) {
            return NaN;
        }
    };

    /**
     * Converts a numeric day-count (days since FormCalc epoch) back to MM/DD/YYYY.
     * @name xfaNumToDate
     * @function
     * @param {number} num - The number of days since the FormCalc epoch.
     * @return {string} The corresponding date in MM/DD/YYYY format.
     * @example
     * var d = CustomFormRules.xfa.xfaNumToDate(45654); // "12/25/2024"
     */
    xfa.xfaNumToDate = function xfaNumToDate(num) {
        try {
            var n = Number(num);
            if (isNaN(n)) {
                return "";
            }
            var epoch = new Date(1899, 11, 30);
            epoch.setDate(epoch.getDate() + Math.round(n));
            var mm = String(epoch.getMonth() + 1);
            var dd = String(epoch.getDate());
            var yyyy = String(epoch.getFullYear());
            while (mm.length < 2) { mm = "0" + mm; }
            while (dd.length < 2) { dd = "0" + dd; }
            return mm + "/" + dd + "/" + yyyy;
        } catch (e) {
            return "";
        }
    };

})(window);
