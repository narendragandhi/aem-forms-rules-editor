/**
 * String manipulation rules for AEM Forms Rules Editor.
 * Text processing, case conversion, and string utilities.
 */

(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};

    /**
     * Convert string to URL-safe slug.
     * @name slugify
     * @function
     * @param {string} text The input text.
     * @return {string} URL-safe slug (e.g., "Hello World!" -> "hello-world").
     */
    window.CustomFormRules.slugify = function (text) {
        if (!text) return "";
        return text.toString().toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "");
    };

    /**
     * Truncate text to a maximum length with ellipsis.
     * @name truncateText
     * @function
     * @param {string} text The input text.
     * @param {number} maxLength Maximum number of characters.
     * @param {string} suffix The suffix to append (default "...").
     * @return {string} Truncated text.
     */
    window.CustomFormRules.truncateText = function (text, maxLength, suffix) {
        if (!text) return "";
        var max = Number(maxLength) || 100;
        var sfx = suffix !== undefined ? suffix : "...";
        if (text.length <= max) return text;
        return text.substring(0, max - sfx.length) + sfx;
    };

    /**
     * Capitalize first letter of string.
     * @name capitalize
     * @function
     * @param {string} text The input text.
     * @return {string} String with first letter capitalized.
     */
    window.CustomFormRules.capitalize = function (text) {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    /**
     * Convert string to Title Case (each word capitalized).
     * @name titleCase
     * @function
     * @param {string} text The input text.
     * @return {string} Title cased string.
     */
    window.CustomFormRules.titleCase = function (text) {
        if (!text) return "";
        return text.toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    };

    /**
     * Convert string to camelCase.
     * @name camelCase
     * @function
     * @param {string} text The input text.
     * @return {string} camelCase string (e.g., "Hello World" -> "helloWorld").
     */
    window.CustomFormRules.camelCase = function (text) {
        if (!text) return "";
        return text.toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, function (match, c) { return c.toUpperCase(); })
            .replace(/^[A-Z]/, function (c) { return c.toLowerCase(); });
    };

    /**
     * Convert string to snake_case.
     * @name snakeCase
     * @function
     * @param {string} text The input text.
     * @return {string} snake_case string (e.g., "Hello World" -> "hello_world").
     */
    window.CustomFormRules.snakeCase = function (text) {
        if (!text) return "";
        return text.replace(/([A-Z])/g, "_$1")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_/, "")
            .replace(/_$/, "");
    };

    /**
     * Strip all HTML tags from a string.
     * @name stripHTML
     * @function
     * @param {string} html The HTML string.
     * @return {string} Plain text without tags.
     */
    window.CustomFormRules.stripHTML = function (html) {
        if (!html) return "";
        return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    };

    /**
     * Count the number of words in a string.
     * @name countWords
     * @function
     * @param {string} text The input text.
     * @return {number} Word count.
     */
    window.CustomFormRules.countWords = function (text) {
        if (!text || !text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    };

    /**
     * Collapse multiple whitespace characters into single spaces.
     * @name removeExtraWhitespace
     * @function
     * @param {string} text The input text.
     * @return {string} Text with normalized whitespace.
     */
    window.CustomFormRules.removeExtraWhitespace = function (text) {
        if (!text) return "";
        return text.replace(/\s+/g, " ").trim();
    };

    /**
     * Extract all numbers from a string.
     * @name extractNumbers
     * @function
     * @param {string} text The input text.
     * @return {string} All numeric characters extracted.
     */
    window.CustomFormRules.extractNumbers = function (text) {
        if (!text) return "";
        return text.replace(/[^0-9.-]/g, "");
    };

})(window);
