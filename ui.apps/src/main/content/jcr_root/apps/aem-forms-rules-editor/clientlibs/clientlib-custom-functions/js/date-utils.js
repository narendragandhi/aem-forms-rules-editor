/**
 * Date and time utility rules for AEM Forms Rules Editor.
 * Date validation, manipulation, and calculation functions.
 */

(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};

    // ============================================================================
    // US HOLIDAYS (basic set for business day calculations)
    // ============================================================================
    var US_HOLIDAYS = [
        { month: 0, day: 1 },    // New Year's Day
        { month: 6, day: 4 },    // Independence Day (observed)
        { month: 11, day: 25 },  // Christmas Day
        { month: 11, day: 31 }   // New Year's Eve (optional)
    ];

    function isUSHoliday(date) {
        var m = date.getMonth();
        var d = date.getDate();
        for (var i = 0; i < US_HOLIDAYS.length; i++) {
            if (US_HOLIDAYS[i].month === m && US_HOLIDAYS[i].day === d) return true;
        }
        // Approximate: MLK (3rd Mon Jan), Presidents (3rd Mon Feb), Memorial (last Mon May),
        // Labor (1st Mon Sep), Thanksgiving (4th Thu Nov)
        var y = date.getFullYear();
        var dayOfWeek = date.getDay();
        var dayOfMonth = date.getDate();

        if (m === 0 && dayOfWeek === 1 && dayOfMonth >= 15 && dayOfMonth <= 21) return true; // MLK
        if (m === 1 && dayOfWeek === 1 && dayOfMonth >= 15 && dayOfMonth <= 21) return true; // Presidents
        if (m === 8 && dayOfWeek === 1 && dayOfMonth <= 7) return true; // Labor Day
        if (m === 10 && dayOfWeek === 4 && dayOfMonth >= 22 && dayOfMonth <= 28) return true; // Thanksgiving
        // Memorial Day: last Monday of May
        if (m === 4 && dayOfWeek === 1) {
            var nextWeek = new Date(y, m, dayOfMonth + 7);
            if (nextWeek.getMonth() !== 4) return true;
        }
        return false;
    }

    function parseDate(dateString) {
        if (!dateString) return null;
        var parts = dateString.split("-");
        if (parts.length !== 3) return null;
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var day = parseInt(parts[2], 10);
        if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
        var d = new Date(year, month, day);
        if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
        return d;
    }

    // ============================================================================
    // DATE VALIDATION
    // ============================================================================

    /**
     * Check if date is in the past.
     * @name isPastDate
     * @function
     * @param {string} dateString ISO date string (YYYY-MM-DD).
     * @return {boolean} True if date is before today.
     */
    window.CustomFormRules.isPastDate = function (dateString) {
        var d = parseDate(dateString);
        if (!d) return false;
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        return d.getTime() < today.getTime();
    };

    /**
     * Check if date is in the future.
     * @name isFutureDate
     * @function
     * @param {string} dateString ISO date string (YYYY-MM-DD).
     * @return {boolean} True if date is after today.
     */
    window.CustomFormRules.isFutureDate = function (dateString) {
        var d = parseDate(dateString);
        if (!d) return false;
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        return d.getTime() > today.getTime();
    };

    /**
     * Check if date falls on a weekend (Saturday or Sunday).
     * @name isWeekend
     * @function
     * @param {string} dateString ISO date string (YYYY-MM-DD).
     * @return {boolean} True if Saturday or Sunday.
     */
    window.CustomFormRules.isWeekend = function (dateString) {
        var d = parseDate(dateString);
        if (!d) return false;
        var day = d.getDay();
        return day === 0 || day === 6;
    };

    /**
     * Check if date is a business day (not weekend, not US holiday).
     * @name isBusinessDay
     * @function
     * @param {string} dateString ISO date string (YYYY-MM-DD).
     * @return {boolean} True if business day.
     */
    window.CustomFormRules.isBusinessDay = function (dateString) {
        var d = parseDate(dateString);
        if (!d) return false;
        if (d.getDay() === 0 || d.getDay() === 6) return false;
        return !isUSHoliday(d);
    };

    // ============================================================================
    // DATE MANIPULATION
    // ============================================================================

    /**
     * Add days to a date.
     * @name addDays
     * @function
     * @param {string} dateString ISO date string (YYYY-MM-DD).
     * @param {number} days Number of days to add (negative to subtract).
     * @return {string} New ISO date string.
     */
    window.CustomFormRules.addDays = function (dateString, days) {
        var d = parseDate(dateString);
        if (!d) return "";
        d.setDate(d.getDate() + Number(days));
        var y = d.getFullYear();
        var m = ("0" + (d.getMonth() + 1)).slice(-2);
        var day = ("0" + d.getDate()).slice(-2);
        return y + "-" + m + "-" + day;
    };

    /**
     * Add months to a date.
     * @name addMonths
     * @function
     * @param {string} dateString ISO date string (YYYY-MM-DD).
     * @param {number} months Number of months to add.
     * @return {string} New ISO date string.
     */
    window.CustomFormRules.addMonths = function (dateString, months) {
        var d = parseDate(dateString);
        if (!d) return "";
        d.setMonth(d.getMonth() + Number(months));
        var y = d.getFullYear();
        var m = ("0" + (d.getMonth() + 1)).slice(-2);
        var day = ("0" + d.getDate()).slice(-2);
        return y + "-" + m + "-" + day;
    };

    // ============================================================================
    // DATE CALCULATIONS
    // ============================================================================

    /**
     * Calculate calendar days between two dates.
     * @name daysBetween
     * @function
     * @param {string} startDate ISO date string.
     * @param {string} endDate ISO date string.
     * @return {number} Number of days (negative if end < start).
     */
    window.CustomFormRules.daysBetween = function (startDate, endDate) {
        var d1 = parseDate(startDate);
        var d2 = parseDate(endDate);
        if (!d1 || !d2) return 0;
        var diff = d2.getTime() - d1.getTime();
        return Math.round(diff / (1000 * 60 * 60 * 24));
    };

    /**
     * Calculate business days between two dates (excludes weekends and US holidays).
     * @name businessDaysBetween
     * @function
     * @param {string} startDate ISO date string.
     * @param {string} endDate ISO date string.
     * @return {number} Number of business days.
     */
    window.CustomFormRules.businessDaysBetween = function (startDate, endDate) {
        var d1 = parseDate(startDate);
        var d2 = parseDate(endDate);
        if (!d1 || !d2) return 0;

        if (d1.getTime() > d2.getTime()) {
            var temp = d1; d1 = d2; d2 = temp;
        }

        var count = 0;
        var current = new Date(d1);
        while (current.getTime() <= d2.getTime()) {
            if (current.getDay() !== 0 && current.getDay() !== 6 && !isUSHoliday(current)) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        return count;
    };

    // ============================================================================
    // DATE INFORMATION
    // ============================================================================

    /**
     * Get the first day of the month for a given date.
     * @name getFirstDayOfMonth
     * @function
     * @param {string} dateString ISO date string.
     * @return {string} ISO date string of first day.
     */
    window.CustomFormRules.getFirstDayOfMonth = function (dateString) {
        var d = parseDate(dateString);
        if (!d) return "";
        var y = d.getFullYear();
        var m = ("0" + (d.getMonth() + 1)).slice(-2);
        return y + "-" + m + "-01";
    };

    /**
     * Get the last day of the month for a given date.
     * @name getLastDayOfMonth
     * @function
     * @param {string} dateString ISO date string.
     * @return {string} ISO date string of last day.
     */
    window.CustomFormRules.getLastDayOfMonth = function (dateString) {
        var d = parseDate(dateString);
        if (!d) return "";
        var lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        var y = lastDay.getFullYear();
        var m = ("0" + (lastDay.getMonth() + 1)).slice(-2);
        var day = ("0" + lastDay.getDate()).slice(-2);
        return y + "-" + m + "-" + day;
    };

    /**
     * Format date as relative time string.
     * @name formatDateRelative
     * @function
     * @param {string} dateString ISO date string.
     * @return {string} Relative string like "3 days ago" or "in 2 weeks".
     */
    window.CustomFormRules.formatDateRelative = function (dateString) {
        var d = parseDate(dateString);
        if (!d) return "";
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        var diffMs = d.getTime() - now.getTime();
        var diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "today";
        if (diffDays === 1) return "tomorrow";
        if (diffDays === -1) return "yesterday";

        var abs = Math.abs(diffDays);
        var suffix = diffDays > 0 ? "from now" : "ago";

        if (abs < 7) return abs + " day" + (abs > 1 ? "s" : "") + " " + suffix;
        if (abs < 30) {
            var weeks = Math.round(abs / 7);
            return weeks + " week" + (weeks > 1 ? "s" : "") + " " + suffix;
        }
        if (abs < 365) {
            var months = Math.round(abs / 30);
            return months + " month" + (months > 1 ? "s" : "") + " " + suffix;
        }
        var years = Math.round(abs / 365);
        return years + " year" + (years > 1 ? "s" : "") + " " + suffix;
    };

    /**
     * Calculate age in years from a birthdate.
     * @name calculateAge
     * @function
     * @param {string} birthDateString ISO date string (YYYY-MM-DD).
     * @return {number} Age in years, or -1 if invalid.
     */
    window.CustomFormRules.calculateAge = function (birthDateString) {
        var d = parseDate(birthDateString);
        if (!d) return -1;
        var today = new Date();
        if (d.getTime() > today.getTime()) return -1;
        var age = today.getFullYear() - d.getFullYear();
        var monthDiff = today.getMonth() - d.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d.getDate())) age--;
        return age;
    };

    /**
     * Check if a year is a leap year.
     * @name isLeapYear
     * @function
     * @param {number} year The year to check.
     * @return {boolean} True if leap year.
     */
    window.CustomFormRules.isLeapYear = function (year) {
        var y = Number(year);
        if (isNaN(y)) return false;
        return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    };

    /**
     * Check if a date falls within a range.
     * @name isDateInRange
     * @function
     * @param {string} dateString The date to check (YYYY-MM-DD).
     * @param {string} rangeStart The range start date (YYYY-MM-DD).
     * @param {string} rangeEnd The range end date (YYYY-MM-DD).
     * @return {boolean} True if date is within range (inclusive).
     */
    window.CustomFormRules.isDateInRange = function (dateString, rangeStart, rangeEnd) {
        var d = parseDate(dateString);
        var start = parseDate(rangeStart);
        var end = parseDate(rangeEnd);
        if (!d || !start || !end) return false;
        return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
    };

})(window);
