(function (window) {
    "use strict";
    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * Safe wrapper around xfa.host.messageBox(). Shows a modal alert dialog in the XFA form.
     * @name xfaAlert
     * @function
     * @param {string} message - The message to display.
     * @param {string} [title="Alert"] - The dialog title.
     * @param {number} [type=0] - Dialog type: 0=OK, 1=OK/Cancel, 2=Yes/No.
     * @return {number} Button pressed (1=OK, 3=Cancel, 6=Yes, 7=No).
     * @example
     * // Inside XFA Code Editor (IC Fragment):
     * xfaAlert("Please fill in all required fields.", "Validation Error");
     */
    window.CustomFormRules.xfa.xfaAlert = function (message, title, type) {
        title = title || "Alert";
        type = type || 0;
        try {
            return xfa.host.messageBox(String(message), String(title), Number(type));
        } catch (e) {
            return 1;
        }
    };

    /**
     * Set focus to a XFA field using a SOM expression string or a field object reference.
     * @name xfaSetFocus
     * @function
     * @param {string|object} fieldRef - A SOM expression (e.g., "xfa.form.subform[0].TextField1") or an XFA field object.
     * @return {boolean} True if focus was set successfully, false otherwise.
     * @example
     * // Set focus to a field by SOM expression:
     * xfaSetFocus("xfa.form.subform[0].firstName");
     *
     * // Set focus to the current field's sibling:
     * xfaSetFocus(xfa.form.subform[0].lastName);
     */
    window.CustomFormRules.xfa.xfaSetFocus = function (fieldRef) {
        try {
            var targetField;
            if (typeof fieldRef === "string") {
                targetField = xfa.resolveNode(fieldRef);
            } else {
                targetField = fieldRef;
            }
            if (targetField && targetField.focus) {
                targetField.focus();
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    /**
     * Navigate to the previous page in the XFA form.
     * @name xfaPageUp
     * @function
     * @return {boolean} True if navigation occurred, false otherwise.
     * @example
     * // Bind to a "Previous" button click event:
     * xfaPageUp();
     */
    window.CustomFormRules.xfa.xfaPageUp = function () {
        try {
            xfa.host.pageUp();
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Navigate to the next page in the XFA form.
     * @name xfaPageDown
     * @function
     * @return {boolean} True if navigation occurred, false otherwise.
     * @example
     * // Bind to a "Next" button click event:
     * xfaPageDown();
     */
    window.CustomFormRules.xfa.xfaPageDown = function () {
        try {
            xfa.host.pageDown();
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Navigate to a specific page by its zero-based index.
     * @name xfaGotoPage
     * @function
     * @param {number} pageNumber - The zero-based page index to navigate to.
     * @return {boolean} True if navigation occurred, false otherwise.
     * @example
     * // Jump to the third page (index 2):
     * xfaGotoPage(2);
     *
     * // Navigate back to the first page:
     * xfaGotoPage(0);
     */
    window.CustomFormRules.xfa.xfaGotoPage = function (pageNumber) {
        try {
            var numPages = xfa.host.numPages;
            if (pageNumber >= 0 && pageNumber < numPages) {
                xfa.host.gotoPage(Number(pageNumber));
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    /**
     * Reset all fields in the XFA form to their default values.
     * @name xfaResetForm
     * @function
     * @return {boolean} True if the form was reset successfully, false otherwise.
     * @example
     * // Bind to a "Reset" button click event:
     * xfaResetForm();
     */
    window.CustomFormRules.xfa.xfaResetForm = function () {
        try {
            xfa.form.resetData();
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Get the current page number (zero-based) of the XFA form.
     * @name xfaGetCurrentPage
     * @function
     * @return {number} The zero-based index of the current page, or -1 on error.
     * @example
     * // Display the current page number in a text field:
     * var currentPage = xfaGetCurrentPage();
     * xfa.resolveNode("xfa.form.subform[0].pageIndicator").rawValue = currentPage;
     */
    window.CustomFormRules.xfa.xfaGetCurrentPage = function () {
        try {
            return xfa.host.currentPage;
        } catch (e) {
            return -1;
        }
    };

    /**
     * Get the total number of pages in the XFA form.
     * @name xfaGetPageCount
     * @function
     * @return {number} The total page count, or -1 on error.
     * @example
     * // Show "Page 1 of 5" in a text field:
     * var current = xfaGetCurrentPage() + 1;
     * var total = xfaGetPageCount();
     * xfa.resolveNode("xfa.form.subform[0].pageInfo").rawValue = "Page " + current + " of " + total;
     */
    window.CustomFormRules.xfa.xfaGetPageCount = function () {
        try {
            return xfa.host.numPages;
        } catch (e) {
            return -1;
        }
    };

    /**
     * Get the name of the host application (e.g., "Chrome", "Acrobat", "Firefox").
     * @name xfaGetHostName
     * @function
     * @return {string} The host application name, or "Unknown" on error.
     * @example
     * // Log the host name to a hidden field for debugging:
     * var hostName = xfaGetHostName();
     * xfa.resolveNode("xfa.form.subform[0].debugHost").rawValue = hostName;
     */
    window.CustomFormRules.xfa.xfaGetHostName = function () {
        try {
            return String(xfa.host.name);
        } catch (e) {
            return "Unknown";
        }
    };

    /**
     * Get the application type string identifying the runtime environment (e.g., "HTML 5", "Acrobat").
     * @name xfaGetAppType
     * @function
     * @return {string} The application type string, or "Unknown" on error.
     * @example
     * // Display runtime info for debugging:
     * var appType = xfaGetAppType();
     * xfa.resolveNode("xfa.form.subform[0].appInfo").rawValue = "Running in: " + appType;
     */
    window.CustomFormRules.xfa.xfaGetAppType = function () {
        try {
            return String(xfa.host.appType);
        } catch (e) {
            return "Unknown";
        }
    };

    /**
     * Check if the XFA form is running in an HTML5 environment (AEM Forms).
     * @name xfaIsHTML5
     * @function
     * @return {boolean} True if running in HTML5, false otherwise.
     * @example
     * // Conditionally apply HTML5-specific styling:
     * if (xfaIsHTML5()) {
     *     xfa.resolveNode("xfa.form.subform[0].statusBar").presence = "hidden";
     * }
     */
    window.CustomFormRules.xfa.xfaIsHTML5 = function () {
        try {
            var appType = String(xfa.host.appType);
            return appType === "HTML 5";
        } catch (e) {
            return false;
        }
    };

    /**
     * Check if the XFA form is running in Acrobat or another PDF viewer.
     * @name xfaIsAcrobat
     * @function
     * @return {boolean} True if running in Acrobat/PDF, false otherwise.
     * @example
     * // Show a PDF-only feature message:
     * if (xfaIsAcrobat()) {
     *     xfaAlert("Digital signatures are available in Acrobat.", "Info");
     * }
     */
    window.CustomFormRules.xfa.xfaIsAcrobat = function () {
        try {
            var appType = String(xfa.host.appType);
            return appType === "Acrobat" || appType === "PDF";
        } catch (e) {
            return false;
        }
    };

})(window);
