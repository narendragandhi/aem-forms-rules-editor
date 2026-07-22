/**
 * @fileoverview JavaScript equivalents of FormCalc built-in functions for the
 * XFA IC fragment code editor. Each function mirrors the behaviour of its
 * FormCalc counterpart and is exposed under the
 * {@link window.CustomFormRules.xfa} namespace so that fragments can call
 * e.g. `CustomFormRules.xfa.xfaAbs(-42)` inside the XFA code editor.
 *
 * @license Apache-2.0
 */
(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    var xfa = window.CustomFormRules.xfa;

    // ---------------------------------------------------------------------------
    // 1. xfaAbs - Absolute value (FormCalc Abs())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaAbs
     * @function
     * @description Returns the absolute (non-negative) value of a number.
     * Equivalent to the FormCalc {@code Abs()} function.
     * @param {number} value - The number whose absolute value is returned.
     * @return {number} The absolute value of {@link value}, or NaN when the
     *   input cannot be interpreted as a number.
     * @example
     * // In the XFA code editor:
     * var result = CustomFormRules.xfa.xfaAbs(-42);   // 42
     * var result2 = CustomFormRules.xfa.xfaAbs(3.7);  // 3.7
     * var result3 = CustomFormRules.xfa.xfaAbs(0);    // 0
     */
    xfa.xfaAbs = function xfaAbs(value) {
        try {
            var num = Number(value);
            if (isNaN(num)) {
                return NaN;
            }
            return Math.abs(num);
        } catch (e) {
            return NaN;
        }
    };

    // ---------------------------------------------------------------------------
    // 2. xfaAvg - Average of array (FormCalc Avg())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaAvg
     * @function
     * @description Returns the arithmetic mean of a list of numeric values.
     * Equivalent to the FormCalc {@code Avg()} function. Non-numeric entries
     * are coerced to numbers; entries that become NaN are silently skipped.
     * @param {Array<number|string>} values - An array of numbers (or
     *   coercible strings) to average.
     * @return {number} The average of the valid numeric entries, or NaN if no
     *   valid entries exist.
     * @example
     * // In the XFA code editor:
     * var avg = CustomFormRules.xfa.xfaAvg([10, 20, 30]);       // 20
     * var avg2 = CustomFormRules.xfa.xfaAvg(["1", "2", "3"]);   // 2
     * var avg3 = CustomFormRules.xfa.xfaAvg([100, null, 50]);   // 75
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

    // ---------------------------------------------------------------------------
    // 3. xfaCeil - Ceiling (FormCalc Ceil())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaCeil
     * @function
     * @description Rounds a number up (toward positive infinity) to the
     * nearest integer. Equivalent to the FormCalc {@code Ceil()} function.
     * @param {number} value - The number to round up.
     * @return {number} The smallest integer greater than or equal to
     *   {@link value}, or NaN when the input cannot be interpreted as a number.
     * @example
     * // In the XFA code editor:
     * var result = CustomFormRules.xfa.xfaCeil(2.1);   // 3
     * var result2 = CustomFormRules.xfa.xfaCeil(-2.1); // -2
     * var result3 = CustomFormRules.xfa.xfaCeil(5);    // 5
     */
    xfa.xfaCeil = function xfaCeil(value) {
        try {
            var num = Number(value);
            if (isNaN(num)) {
                return NaN;
            }
            return Math.ceil(num);
        } catch (e) {
            return NaN;
        }
    };

    // ---------------------------------------------------------------------------
    // 4. xfaFloor - Floor (FormCalc Floor())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaFloor
     * @function
     * @description Rounds a number down (toward negative infinity) to the
     * nearest integer. Equivalent to the FormCalc {@code Floor()} function.
     * @param {number} value - The number to round down.
     * @return {number} The largest integer less than or equal to
     *   {@link value}, or NaN when the input cannot be interpreted as a number.
     * @example
     * // In the XFA code editor:
     * var result = CustomFormRules.xfa.xfaFloor(2.9);   // 2
     * var result2 = CustomFormRules.xfa.xfaFloor(-2.9); // -3
     * var result3 = CustomFormRules.xfa.xfaFloor(5);    // 5
     */
    xfa.xfaFloor = function xfaFloor(value) {
        try {
            var num = Number(value);
            if (isNaN(num)) {
                return NaN;
            }
            return Math.floor(num);
        } catch (e) {
            return NaN;
        }
    };

    // ---------------------------------------------------------------------------
    // 5. xfaRound - Round to places (FormCalc Round())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaRound
     * @function
     * @description Rounds a number to a specified number of decimal places.
     * Uses standard rounding (half-up). Equivalent to the FormCalc
     * {@code Round()} function.
     * @param {number} value - The number to round.
     * @param {number} [places=0] - The number of decimal places to round to.
     *   Use 0 to round to the nearest integer.
     * @return {number} The rounded value, or NaN when the input cannot be
     *   interpreted as a number.
     * @example
     * // In the XFA code editor:
     * var r1 = CustomFormRules.xfa.xfaRound(2.675, 2);  // 2.68
     * var r2 = CustomFormRules.xfa.xfaRound(2.5);        // 3
     * var r3 = CustomFormRules.xfa.xfaRound(1234.56, -1); // 1230
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

    // ---------------------------------------------------------------------------
    // 6. xfaMin - Minimum of array (FormCalc Min())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaMin
     * @function
     * @description Returns the smallest value from an array of numbers.
     * Equivalent to the FormCalc {@code Min()} function. Non-numeric entries
     * are coerced; entries that become NaN are skipped.
     * @param {Array<number|string>} values - An array of numbers (or
     *   coercible strings) from which to find the minimum.
     * @return {number} The minimum valid numeric value, or NaN if no valid
     *   entries exist.
     * @example
     * // In the XFA code editor:
     * var m = CustomFormRules.xfa.xfaMin([5, 3, 8, 1]);    // 1
     * var m2 = CustomFormRules.xfa.xfaMin([100, 50, 75]);  // 50
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

    // ---------------------------------------------------------------------------
    // 7. xfaMax - Maximum of array (FormCalc Max())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaMax
     * @function
     * @description Returns the largest value from an array of numbers.
     * Equivalent to the FormCalc {@code Max()} function. Non-numeric entries
     * are coerced; entries that become NaN are skipped.
     * @param {Array<number|string>} values - An array of numbers (or
     *   coercible strings) from which to find the maximum.
     * @return {number} The maximum valid numeric value, or NaN if no valid
     *   entries exist.
     * @example
     * // In the XFA code editor:
     * var m = CustomFormRules.xfa.xfaMax([5, 3, 8, 1]);    // 8
     * var m2 = CustomFormRules.xfa.xfaMax([100, 50, 75]);  // 100
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

    // ---------------------------------------------------------------------------
    // 8. xfaSum - Sum of array (FormCalc Sum())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaSum
     * @function
     * @description Returns the sum of all values in an array. Equivalent to
     * the FormCalc {@code Sum()} function. Non-numeric entries are coerced;
     * entries that become NaN are silently skipped.
     * @param {Array<number|string>} values - An array of numbers (or
     *   coercible strings) to sum.
     * @return {number} The total of all valid numeric entries, or 0 if the
     *   array is empty or contains no valid numbers.
     * @example
     * // In the XFA code editor:
     * var s = CustomFormRules.xfa.xfaSum([1, 2, 3, 4]);      // 10
     * var s2 = CustomFormRules.xfa.xfaSum([100, 200, 300]);  // 600
     * var s3 = CustomFormRules.xfa.xfaSum([]);               // 0
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

    // ---------------------------------------------------------------------------
    // 9. xfaWithin - Check if value is within range (FormCalc Within())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaWithin
     * @function
     * @description Returns true when {@link value} lies within the inclusive
     * range [{@link low}, {@link high}]. Equivalent to the FormCalc
     * {@code Within()} function.
     * @param {number} value - The value to test.
     * @param {number} low - The lower bound of the range (inclusive).
     * @param {number} high - The upper bound of the range (inclusive).
     * @return {boolean} True if {@link low} &lt;= {@link value} &lt;= {@link high},
     *   false otherwise.
     * @example
     * // In the XFA code editor:
     * var ok = CustomFormRules.xfa.xfaWithin(50, 1, 100);   // true
     * var no = CustomFormRules.xfa.xfaWithin(150, 1, 100);  // false
     * var edge = CustomFormRules.xfa.xfaWithin(1, 1, 100);  // true
     */
    xfa.xfaWithin = function xfaWithin(value, low, high) {
        try {
            var v = Number(value);
            var lo = Number(low);
            var hi = Number(high);
            if (isNaN(v) || isNaN(lo) || isNaN(hi)) {
                return false;
            }
            return v >= lo && v <= hi;
        } catch (e) {
            return false;
        }
    };

    // ---------------------------------------------------------------------------
    // 10. xfaHasValue - Check if field has non-null value (FormCalc HasValue())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaHasValue
     * @function
     * @description Returns true when the supplied value is not null,
     * undefined, or an empty string. Mirrors the FormCalc {@code HasValue()}
     * function, which is commonly used to guard expressions against empty
     * fields in XFA fragments.
     * @param {*} value - The value to inspect.
     * @return {boolean} True when the value is non-null, non-undefined, and
     *   not an empty string.
     * @example
     * // In the XFA code editor:
     * var has = CustomFormRules.xfa.xfaHasValue("hello");  // true
     * var has2 = CustomFormRules.xfa.xfaHasValue("");      // false
     * var has3 = CustomFormRules.xfa.xfaHasValue(null);    // false
     * var has4 = CustomFormRules.xfa.xfaHasValue(0);       // true
     */
    xfa.xfaHasValue = function xfaHasValue(value) {
        try {
            if (value === null || value === undefined) {
                return false;
            }
            if (typeof value === "string" && value.length === 0) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    };

    // ---------------------------------------------------------------------------
    // 11. xfaIsNull - Check if value is null/undefined/empty (FormCalc IsNull())
    // ---------------------------------------------------------------------------

    /**
     * @name xfaIsNull
     * @function
     * @description Returns true when the supplied value is null, undefined,
     * or an empty string. This is the logical inverse of {@link xfaHasValue}
     * and mirrors the FormCalc {@code IsNull()} function.
     * @param {*} value - The value to inspect.
     * @return {boolean} True when the value is null, undefined, or an empty
     *   string.
     * @example
     * // In the XFA code editor:
     * var n = CustomFormRules.xfa.xfaIsNull(null);     // true
     * var n2 = CustomFormRules.xfa.xfaIsNull("");      // true
     * var n3 = CustomFormRules.xfa.xfaIsNull(undefined); // true
     * var n4 = CustomFormRules.xfa.xfaIsNull(0);       // false
     */
    xfa.xfaIsNull = function xfaIsNull(value) {
        try {
            if (value === null || value === undefined) {
                return true;
            }
            if (typeof value === "string" && value.length === 0) {
                return true;
            }
            return false;
        } catch (e) {
            return true;
        }
    };

    // ---------------------------------------------------------------------------
    // 12. xfaDateNow - Get current date string (FormCalc Date)
    // ---------------------------------------------------------------------------

    /**
     * @name xfaDateNow
     * @function
     * @description Returns the current date as a string in
     * {@code YYYYMMDD} format, matching the FormCalc {@code Date} token.
     * @return {string} Today's date in {@code YYYYMMDD} format, or an empty
     *   string on error.
     * @example
     * // In the XFA code editor:
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

    // ---------------------------------------------------------------------------
    // 13. xfaTimeNow - Get current time string (FormCalc Time)
    // ---------------------------------------------------------------------------

    /**
     * @name xfaTimeNow
     * @function
     * @description Returns the current time as a string in {@code HHMMSS}
     * (24-hour) format, matching the FormCalc {@code Time} token.
     * @return {string} The current time in {@code HHMMSS} format, or an empty
     *   string on error.
     * @example
     * // In the XFA code editor:
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

    // ---------------------------------------------------------------------------
    // 14. xfaDateToNum - Convert date to numeric (FormCalc Date2Num)
    // ---------------------------------------------------------------------------

    /**
     * @name xfaDateToNum
     * @function
     * @description Converts a date string to a numeric value representing
     * the number of days since December 30, 1899 (the FormCalc epoch).
     * Equivalent to the FormCalc {@code Date2Num()} function.
     *
     * The input date string may use either {@code MM/DD/YYYY} or
     * {@code YYYYMMDD} format (the parser accepts both).
     *
     * @param {string} dateStr - A date string in {@code MM/DD/YYYY} or
     *   {@code YYYYMMDD} format.
     * @return {number} The number of days since the FormCalc epoch, or NaN
     *   when the date cannot be parsed.
     * @example
     * // In the XFA code editor:
     * var n = CustomFormRules.xfa.xfaDateToNum("12/25/2024"); // 45654
     * var n2 = CustomFormRules.xfa.xfaDateToNum("20241225");  // 45654
     * var n3 = CustomFormRules.xfa.xfaDateToNum("01/01/1900"); // 1
     */
    xfa.xfaDateToNum = function xfaDateToNum(dateStr) {
        try {
            if (typeof dateStr !== "string" || dateStr.length === 0) {
                return NaN;
            }

            var date;

            if (/^\d{8}$/.test(dateStr)) {
                // YYYYMMDD
                var y = parseInt(dateStr.substring(0, 4), 10);
                var m = parseInt(dateStr.substring(4, 6), 10) - 1;
                var d = parseInt(dateStr.substring(6, 8), 10);
                date = new Date(y, m, d);
            } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
                // MM/DD/YYYY
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

            // FormCalc epoch is Dec 30, 1899.
            var epoch = new Date(1899, 11, 30);
            var diffMs = date.getTime() - epoch.getTime();
            var diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch (e) {
            return NaN;
        }
    };

    // ---------------------------------------------------------------------------
    // 15. xfaNumToDate - Convert numeric to date (FormCalc Num2Date)
    // ---------------------------------------------------------------------------

    /**
     * @name xfaNumToDate
     * @function
     * @description Converts a numeric day-count (days since FormCalc epoch
     * Dec 30, 1899) back to a date string in {@code MM/DD/YYYY} format.
     * Equivalent to the FormCalc {@code Num2Date()} function.
     * @param {number} num - The number of days since the FormCalc epoch.
     * @return {string} The corresponding date in {@code MM/DD/YYYY} format,
     *   or an empty string when the input cannot be converted.
     * @example
     * // In the XFA code editor:
     * var d = CustomFormRules.xfa.xfaNumToDate(45654);   // "12/25/2024"
     * var d2 = CustomFormRules.xfa.xfaNumToDate(1);       // "01/01/1900"
     * var d3 = CustomFormRules.xfa.xfaNumToDate(0);       // "12/30/1899"
     */
    xfa.xfaNumToDate = function xfaNumToDate(num) {
        try {
            var n = Number(num);
            if (isNaN(n)) {
                return "";
            }

            // FormCalc epoch is Dec 30, 1899.
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
