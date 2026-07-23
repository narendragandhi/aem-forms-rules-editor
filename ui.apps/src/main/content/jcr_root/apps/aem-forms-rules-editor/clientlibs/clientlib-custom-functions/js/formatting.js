/**
 * Formatting rules for AEM Forms Rules Editor.
 * Transform and format data for display.
 */

(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};

    /**
     * Format US phone number to (XXX) XXX-XXXX.
     * @name formatPhoneNumber
     * @function
     * @param {string} phone The raw phone number string.
     * @return {string} Formatted phone number.
     */
    window.CustomFormRules.formatPhoneNumber = function (phone) {
        if (!phone) return "";
        var digits = phone.replace(/\D/g, "");
        if (digits.length === 11 && digits.charAt(0) === "1") digits = digits.substring(1);
        if (digits.length !== 10) return phone;
        return "(" + digits.substring(0, 3) + ") " + digits.substring(3, 6) + "-" + digits.substring(6);
    };

    /**
     * Format phone number to E.164 international format (+XXXXXXXXXXX).
     * @name formatPhoneNumberInternational
     * @function
     * @param {string} phone The phone number string.
     * @param {string} countryCode The default country code without + (default "1" for US).
     * @return {string} E.164 formatted phone number.
     */
    window.CustomFormRules.formatPhoneNumberInternational = function (phone, countryCode) {
        if (!phone) return "";
        var cc = countryCode || "1";
        var digits = phone.replace(/\D/g, "");
        if (digits.length === 10) return "+" + cc + digits;
        if (digits.length === 11 && digits.charAt(0) === "1") return "+" + digits;
        if (digits.startsWith(cc)) return "+" + digits;
        return "+" + cc + digits;
    };

    /**
     * Format or mask SSN.
     * @name formatSSN
     * @function
     * @param {string} ssn The SSN string.
     * @param {boolean} mask If true, shows only last 4 digits.
     * @return {string} Formatted SSN.
     */
    window.CustomFormRules.formatSSN = function (ssn, mask) {
        if (!ssn) return "";
        var digits = ssn.replace(/\D/g, "");
        if (digits.length !== 9) return ssn;
        if (mask) return "***-**-" + digits.substring(5);
        return digits.substring(0, 3) + "-" + digits.substring(3, 5) + "-" + digits.substring(5);
    };

    /**
     * Format credit card with spaces every 4 digits.
     * @name formatCreditCard
     * @function
     * @param {string} cardNumber The credit card number.
     * @return {string} Formatted card number.
     */
    window.CustomFormRules.formatCreditCard = function (cardNumber) {
        if (!cardNumber) return "";
        var digits = cardNumber.replace(/\D/g, "");
        var parts = [];
        for (var i = 0; i < digits.length; i += 4) {
            parts.push(digits.substring(i, i + 4));
        }
        return parts.join(" ");
    };

    /**
     * Mask credit card to show only last 4 digits.
     * @name maskCreditCard
     * @function
     * @param {string} cardNumber The credit card number.
     * @return {string} Masked card number.
     */
    window.CustomFormRules.maskCreditCard = function (cardNumber) {
        if (!cardNumber) return "";
        var digits = cardNumber.replace(/\D/g, "");
        var len = digits.length;
        if (len < 13 || len > 19) return cardNumber;
        var lastFour = digits.slice(-4);
        if (len === 16) return "XXXX-XXXX-XXXX-" + lastFour;
        if (len === 15) return "XXXX-XXXXXX-X" + lastFour;
        return Array(len - 3).join("X") + lastFour;
    };

    /**
     * Format number as currency string.
     * @name formatCurrency
     * @function
     * @param {number} amount The numeric amount.
     * @param {string} currencyCode The currency symbol or code (default "$").
     * @return {string} Formatted currency string.
     */
    window.CustomFormRules.formatCurrency = function (amount, currencyCode) {
        var num = Number(amount);
        if (isNaN(num)) return "0.00";
        var symbol = currencyCode || "$";
        var formatted = Math.abs(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return (num < 0 ? "-" : "") + symbol + formatted;
    };

    /**
     * Format ISO date string to specified pattern.
     * @name formatDate
     * @function
     * @param {string} dateString The ISO date string (YYYY-MM-DD).
     * @param {string} pattern The output pattern.
     * @return {string} Formatted date string.
     */
    window.CustomFormRules.formatDate = function (dateString, pattern) {
        if (!dateString) return "";
        var parts = dateString.split("-");
        if (parts.length !== 3) return dateString;
        var year = parts[0];
        var month = parts[1];
        var day = parts[2];
        var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        var monthNum = parseInt(month, 10) - 1;
        var p = pattern || "MM/DD/YYYY";

        switch (p) {
            case "MM/DD/YYYY": return month + "/" + day + "/" + year;
            case "DD/MM/YYYY": return day + "/" + month + "/" + year;
            case "YYYY-MM-DD": return dateString;
            case "DD-MM-YYYY": return day + "-" + month + "-" + year;
            case "Month DD, YYYY": return months[monthNum] + " " + parseInt(day, 10) + ", " + year;
            case "DD Month YYYY": return parseInt(day, 10) + " " + months[monthNum] + " " + year;
            default: return month + "/" + day + "/" + year;
        }
    };

    /**
     * Format date to ISO 8601 (YYYY-MM-DD).
     * @name formatDateISO
     * @function
     * @param {string} dateString Any date string parseable by Date().
     * @return {string} ISO formatted date.
     */
    window.CustomFormRules.formatDateISO = function (dateString) {
        if (!dateString) return "";
        var d = new Date(dateString);
        if (isNaN(d.getTime())) return "";
        var y = d.getFullYear();
        var m = ("0" + (d.getMonth() + 1)).slice(-2);
        var day = ("0" + d.getDate()).slice(-2);
        return y + "-" + m + "-" + day;
    };

    /**
     * Format US ZIP code with optional +4 suffix.
     * @name formatZipCodePlus4
     * @function
     * @param {string} zip The ZIP code (5 or 9 digits).
     * @return {string} Formatted as XXXXX-XXXX.
     */
    window.CustomFormRules.formatZipCodePlus4 = function (zip) {
        if (!zip) return "";
        var digits = zip.replace(/\D/g, "");
        if (digits.length === 9) return digits.substring(0, 5) + "-" + digits.substring(5);
        if (digits.length === 5) return digits;
        return zip;
    };

    /**
     * Format number with commas as thousand separators.
     * @name formatNumberWithCommas
     * @function
     * @param {number} num The number to format.
     * @return {string} Formatted number string.
     */
    window.CustomFormRules.formatNumberWithCommas = function (num) {
        var n = Number(num);
        if (isNaN(n)) return "0";
        var parts = n.toFixed(2).split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

})(window);
