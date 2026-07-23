/**
 * File utility rules for AEM Forms Rules Editor.
 * File type validation and size formatting.
 */

(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};

    var IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico"];

    /**
     * Validate file extension against an allowed list.
     * @name validateFileType
     * @function
     * @param {string} fileName The file name or path.
     * @param {string} allowedExtensions Comma-separated list of allowed extensions.
     * @return {boolean} True if file extension is in the allowed list.
     */
    window.CustomFormRules.validateFileType = function (fileName, allowedExtensions) {
        if (!fileName || !allowedExtensions) return false;
        var ext = fileName.split(".").pop().toLowerCase();
        var allowed = allowedExtensions.toLowerCase().split(",").map(function (s) { return s.trim(); });
        return allowed.indexOf(ext) !== -1;
    };

    /**
     * Format file size in bytes to human-readable string.
     * @name formatFileSize
     * @function
     * @param {number} bytes The file size in bytes.
     * @return {string} Human-readable size (e.g., "1.5 MB").
     */
    window.CustomFormRules.formatFileSize = function (bytes) {
        var b = Number(bytes);
        if (isNaN(b) || b < 0) return "0 B";
        if (b === 0) return "0 B";

        var units = ["B", "KB", "MB", "GB", "TB"];
        var i = Math.floor(Math.log(b) / Math.log(1024));
        if (i >= units.length) i = units.length - 1;
        var size = b / Math.pow(1024, i);
        return size.toFixed(i === 0 ? 0 : 1) + " " + units[i];
    };

    /**
     * Check if a file is an image based on its extension.
     * @name isImageFile
     * @function
     * @param {string} fileName The file name.
     * @return {boolean} True if the file is an image type.
     */
    window.CustomFormRules.isImageFile = function (fileName) {
        if (!fileName) return false;
        var ext = fileName.split(".").pop().toLowerCase();
        return IMAGE_EXTENSIONS.indexOf(ext) !== -1;
    };

    /**
     * Check if a file is a PDF.
     * @name isPDFFile
     * @function
     * @param {string} fileName The file name.
     * @return {boolean} True if the file is a PDF.
     */
    window.CustomFormRules.isPDFFile = function (fileName) {
        if (!fileName) return false;
        return fileName.split(".").pop().toLowerCase() === "pdf";
    };

})(window);
