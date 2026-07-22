(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * @name getFieldBounds
     * @function
     * @description Returns the bounding box {x, y, w, h} of a field in points.
     * @param {string} fieldName - The name of the field as resolved in XFA.
     * @return {object|null} An object with x, y, w, h properties, or null on failure.
     * @example
     * // In the XFA code editor, retrieve bounds of a text field:
     * var bounds = xfa.getFieldBounds("subform1.field1");
     * if (bounds) {
     *     xfa.host.messageBox("x: " + bounds.x + ", y: " + bounds.y +
     *                         ", w: " + bounds.w + ", h: " + bounds.h);
     * }
     */
    window.CustomFormRules.xfa.getFieldBounds = function (fieldName) {
        try {
            var field = xfa.resolveNode(fieldName);
            if (!field) {
                return null;
            }
            var bounds = field.boundaryBox;
            if (!bounds) {
                return null;
            }
            return {
                x: bounds.x,
                y: bounds.y,
                w: bounds.w,
                h: bounds.h
            };
        } catch (e) {
            return null;
        }
    };

    /**
     * @name setFieldBounds
     * @function
     * @description Positions and sizes a field by setting its boundaryBox.
     * @param {string} fieldName - The name of the field as resolved in XFA.
     * @param {number} x - The x coordinate in points.
     * @param {number} y - The y coordinate in points.
     * @param {number} w - The width in points.
     * @param {number} h - The height in points.
     * @return {boolean} True if the bounds were set successfully, false otherwise.
     * @example
     * // In the XFA code editor, move a field to a specific position:
     * var moved = xfa.setFieldBounds("subform1.field1", 72, 144, 200, 30);
     * if (moved) {
     *     xfa.host.messageBox("Field repositioned successfully.");
     * } else {
     *     xfa.host.messageBox("Failed to reposition field.");
     * }
     */
    window.CustomFormRules.xfa.setFieldBounds = function (fieldName, x, y, w, h) {
        try {
            var field = xfa.resolveNode(fieldName);
            if (!field) {
                return false;
            }
            var bounds = field.boundaryBox;
            if (!bounds) {
                return false;
            }
            bounds.x = x;
            bounds.y = y;
            bounds.w = w;
            bounds.h = h;
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * @name getLayoutPageCount
     * @function
     * @description Returns the total number of pages in the form by querying the $layout object.
     * @return {number} The total page count, or 0 on failure.
     * @example
     * // In the XFA code editor, get the total number of pages:
     * var pageCount = xfa.getLayoutPageCount();
     * xfa.host.messageBox("This form has " + pageCount + " page(s).");
     */
    window.CustomFormRules.xfa.getLayoutPageCount = function () {
        try {
            var layout = this.$layout || this.$form.$layout;
            if (!layout) {
                return 0;
            }
            return layout.pageCount;
        } catch (e) {
            try {
                var form = xfa.form;
                if (form && form.layout) {
                    return form.layout.pageCount;
                }
            } catch (e2) {
                // silent
            }
            return 0;
        }
    };

    /**
     * @name getFieldPageNumber
     * @function
     * @description Returns the 0-based page number that a field resides on.
     * @param {string} fieldName - The name of the field as resolved in XFA.
     * @return {number} The 0-based page index, or -1 if the field cannot be located.
     * @example
     * // In the XFA code editor, determine which page a field is on:
     * var pageNum = xfa.getFieldPageNumber("subform1.signatureField1");
     * if (pageNum >= 0) {
     *     xfa.host.messageBox("The field is on page " + (pageNum + 1) + ".");
     * } else {
     *     xfa.host.messageBox("Could not determine the page for this field.");
     * }
     */
    window.CustomFormRules.xfa.getFieldPageNumber = function (fieldName) {
        try {
            var field = xfa.resolveNode(fieldName);
            if (!field) {
                return -1;
            }
            var parent = field.parent;
            var pageIndex = 0;
            while (parent) {
                if (parent.className === "subform") {
                    var pageRef = parent.page;
                    if (pageRef && typeof pageRef.index === "number") {
                        return pageRef.index;
                    }
                }
                parent = parent.parent;
            }
            return -1;
        } catch (e) {
            return -1;
        }
    };

    /**
     * @name isFieldOnPage
     * @function
     * @description Checks whether a field is located on a specific page (0-based index).
     * @param {string} fieldName - The name of the field as resolved in XFA.
     * @param {number} pageIndex - The 0-based page index to check against.
     * @return {boolean} True if the field is on the specified page, false otherwise.
     * @example
     * // In the XFA code editor, check if a field is on the first page:
     * var isOnFirstPage = xfa.isFieldOnPage("subform1.accountNumber", 0);
     * if (isOnFirstPage) {
     *     xfa.host.messageBox("The field is on the first page.");
     * } else {
     *     xfa.host.messageBox("The field is NOT on the first page.");
     * }
     */
    window.CustomFormRules.xfa.isFieldOnPage = function (fieldName, pageIndex) {
        try {
            var actualPage = this.getFieldPageNumber(fieldName);
            if (actualPage === -1) {
                return false;
            }
            return actualPage === pageIndex;
        } catch (e) {
            return false;
        }
    };

    /**
     * @name centerFieldHorizontally
     * @function
     * @description Centers a field horizontally within its parent subform or container.
     * @param {string} fieldName - The name of the field as resolved in XFA.
     * @return {boolean} True if the field was centered successfully, false otherwise.
     * @example
     * // In the XFA code editor, horizontally center a button within its parent:
     * var centered = xfa.centerFieldHorizontally("subform1.submitButton");
     * if (centered) {
     *     xfa.host.messageBox("Button centered on its parent.");
     * } else {
     *     xfa.host.messageBox("Unable to center the button.");
     * }
     */
    window.CustomFormRules.xfa.centerFieldHorizontally = function (fieldName) {
        try {
            var field = xfa.resolveNode(fieldName);
            if (!field) {
                return false;
            }
            var bounds = field.boundaryBox;
            if (!bounds) {
                return false;
            }
            var parent = field.parent;
            if (!parent) {
                return false;
            }
            var parentBounds = parent.boundaryBox;
            if (!parentBounds) {
                return false;
            }
            var centerX = (parentBounds.w - bounds.w) / 2;
            bounds.x = centerX;
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * @name getFieldDimensions
     * @function
     * @description Returns the width and height {w, h} of a field in points.
     * @param {string} fieldName - The name of the field as resolved in XFA.
     * @return {object|null} An object with w and h properties, or null on failure.
     * @example
     * // In the XFA code editor, get dimensions of a date field:
     * var dims = xfa.getFieldDimensions("subform1.dateOfBirth");
     * if (dims) {
     *     xfa.host.messageBox("Width: " + dims.w + ", Height: " + dims.h);
     * }
     */
    window.CustomFormRules.xfa.getFieldDimensions = function (fieldName) {
        try {
            var field = xfa.resolveNode(fieldName);
            if (!field) {
                return null;
            }
            var bounds = field.boundaryBox;
            if (!bounds) {
                return null;
            }
            return {
                w: bounds.w,
                h: bounds.h
            };
        } catch (e) {
            return null;
        }
    };

})(window);
