(function (window) {
    "use strict";
    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * Returns the 0-based page number that a field resides on by walking the parent chain.
     * @name getFieldPageNumber
     * @function
     * @param {string} fieldName - The name of the field as resolved in XFA.
     * @return {number} The 0-based page index, or -1 if the field cannot be located.
     * @example
     * var pageNum = CustomFormRules.xfa.getFieldPageNumber("subform1.signatureField1");
     * if (pageNum >= 0) {
     *     xfa.host.messageBox("The field is on page " + (pageNum + 1) + ".");
     * }
     */
    window.CustomFormRules.xfa.getFieldPageNumber = function (fieldName) {
        try {
            var field = xfa.resolveNode(fieldName);
            if (!field) {
                return -1;
            }
            var parent = field.parent;
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
     * Centers a field horizontally within its parent subform or container.
     * @name centerFieldHorizontally
     * @function
     * @param {string} fieldName - The name of the field as resolved in XFA.
     * @return {boolean} True if the field was centered successfully, false otherwise.
     * @example
     * var centered = CustomFormRules.xfa.centerFieldHorizontally("subform1.submitButton");
     * if (centered) {
     *     xfa.host.messageBox("Button centered on its parent.");
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

})(window);
