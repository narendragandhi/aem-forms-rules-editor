(function (window) {
    "use strict";
    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * @name getEventTarget
     * @function
     * @memberof module:xfa
     * @description Returns the XFA event target object safely. Provides access to
     *              the form element that triggered the current event.
     * @return {Object|null} The xfa.event.target object, or null if unavailable.
     * @example
     * // Use in the code editor to reference the field that fired the event:
     * var target = xfa.event.target; // direct access
     * // or via helper:
     * var target = xfa_event.getEventTarget();
     * if (target) {
     *     xfa.host.messageBox("Event fired on: " + target.name);
     * }
     */
    function getEventTarget() {
        try {
            if (typeof xfa !== "undefined" && xfa.event && xfa.event.target) {
                return xfa.event.target;
            }
        } catch (e) {
            // xfa or xfa.event is not available in this context
        }
        return null;
    }

    /**
     * @name getEventTargetName
     * @function
     * @memberof module:xfa
     * @description Returns the fully-qualified SOM name of the element that
     *              triggered the current event. Useful for debugging and
     *              logging which field originated the event.
     * @return {String} The SOM name of the event target, or an empty string
     *                   if unavailable.
     * @example
     * // Log which field the user interacted with:
     * var fieldName = xfa_event.getEventTargetName();
     * if (fieldName) {
     *     xfa.host.messageBox("Field: " + fieldName);
     * }
     */
    function getEventTargetName() {
        try {
            var target = getEventTarget();
            if (target && target.SOM) {
                return target.SOM;
            }
            if (target && target.name) {
                return target.name;
            }
        } catch (e) {
            // target SOM access failed
        }
        return "";
    }

    /**
     * @name getNewText
     * @function
     * @memberof module:xfa
     * @description Returns the new text content of a field after a user change.
     *              This is the value that will be committed if the user
     *              confirms the edit (e.g., by pressing Enter or Tab).
     * @return {String} The new text content, or an empty string if unavailable.
     * @example
     * // Validate the new text before it is committed:
     * var newText = xfa_event.getNewText();
     * if (newText && newText.length > 100) {
     *     xfa.host.messageBox("Input is too long. Maximum 100 characters.");
     *     xfa.event.rc = false; // reject the change
     * }
     */
    function getNewText() {
        try {
            if (typeof xfa !== "undefined" && xfa.event && xfa.event.newText) {
                return xfa.event.newText;
            }
        } catch (e) {
            // xfa.event.newText is not available
        }
        return "";
    }

    /**
     * @name getPrevText
     * @function
     * @memberof module:xfa
     * @description Returns the previous text content of a field before a user
     *              change. Useful for comparing old and new values to detect
     *              what was modified.
     * @return {String} The previous text content, or an empty string if
     *                   unavailable.
     * @example
     * // Compare old and new values to detect changes:
     * var oldVal = xfa_event.getPrevText();
     * var newVal = xfa_event.getNewText();
     * if (oldVal !== newVal) {
     *     xfa.host.messageBox("Value changed from '" + oldVal + "' to '" + newVal + "'");
     * }
     */
    function getPrevText() {
        try {
            if (typeof xfa !== "undefined" && xfa.event && xfa.event.prevText) {
                return xfa.event.prevText;
            }
        } catch (e) {
            // xfa.event.prevText is not available
        }
        return "";
    }

    /**
     * @name isCommitKey
     * @function
     * @memberof module:xfa
     * @description Checks whether the key pressed by the user is a commit key.
     *              A commit key is either Enter (key code 0) or Tab (key code 1).
     *              Commit keys cause the field value to be finalized.
     * @param  {Number} [key] - Optional key code to test. If omitted, uses
     *                          xfa.event.key.
     * @return {Boolean} True if the key is Enter (0) or Tab (1).
     * @example
     * // Only validate on commit (Enter or Tab), not on every keystroke:
     * if (xfa_event.isCommitKey()) {
     *     var val = xfa_event.getNewText();
     *     if (!val || val === "") {
     *         xfa.host.messageBox("This field is required.");
     *         xfa.event.rc = false;
     *     }
     * }
     */
    function isCommitKey(key) {
        try {
            var keyCode = (typeof key !== "undefined") ? key : null;
            if (keyCode === null) {
                if (typeof xfa !== "undefined" && xfa.event) {
                    keyCode = xfa.event.key;
                }
            }
            // Enter = 0, Tab = 1 in XFA event key codes
            return (keyCode === 0 || keyCode === 1);
        } catch (e) {
            // key access failed
        }
        return false;
    }

    /**
     * @name getCommitKey
     * @function
     * @memberof module:xfa
     * @description Returns the raw commit key value from the event. In XFA,
     *              Enter is represented as 0 and Tab as 1. Returns -1 if no
     *              commit key was pressed or the value is unavailable.
     * @return {Number} The commit key code (0 for Enter, 1 for Tab), or -1
     *                   if not a commit key or unavailable.
     * @example
     * // Determine which commit key was used:
     * if (xfa_event.isCommitKey()) {
     *     var key = xfa_event.getCommitKey();
     *     if (key === 0) {
     *         xfa.host.messageBox("User pressed Enter.");
     *     } else if (key === 1) {
     *         xfa.host.messageBox("User pressed Tab.");
     *     }
     * }
     */
    function getCommitKey() {
        try {
            if (typeof xfa !== "undefined" && xfa.event) {
                var key = xfa.event.key;
                if (key === 0 || key === 1) {
                    return key;
                }
            }
        } catch (e) {
            // xfa.event.key is not available
        }
        return -1;
    }

    /**
     * @name isShiftPressed
     * @function
     * @memberof module:xfa
     * @description Checks whether the Shift modifier key was held down when
     *              the event was triggered. Useful for detecting Shift+Enter
     *              or Shift+Tab combinations.
     * @return {Boolean} True if the Shift key was held down.
     * @example
     * // Detect Shift+Enter to allow multi-line input:
     * if (xfa_event.isCommitKey() && xfa_event.isShiftPressed()) {
     *     // Allow the newline and do not commit
     *     xfa.event.rc = false;
     * } else if (xfa_event.isCommitKey()) {
     *     // Commit the value on plain Enter
     *     xfa.event.rc = true;
     * }
     */
    function isShiftPressed() {
        try {
            if (typeof xfa !== "undefined" && xfa.event) {
                // shiftPressed is a boolean property on xfa.event
                return (xfa.event.shiftPressed === true);
            }
        } catch (e) {
            // xfa.event.shiftPressed is not available
        }
        return false;
    }

    /**
     * @name getChangeValue
     * @function
     * @memberof module:xfa
     * @description Returns xfa.event.change, which contains the typed or pasted
     *              value that the user entered. This differs from newText in
     *              that it represents only the delta/change, not the full
     *              resulting text.
     * @return {String} The change value, or an empty string if unavailable.
     * @example
     * // Inspect exactly what the user typed or pasted:
     * var change = xfa_event.getChangeValue();
     * if (change && change.indexOf("@") === -1) {
     *     xfa.host.messageBox("Please enter a valid email address.");
     *     xfa.event.rc = false;
     * }
     */
    function getChangeValue() {
        try {
            if (typeof xfa !== "undefined" && xfa.event && xfa.event.change) {
                return xfa.event.change;
            }
        } catch (e) {
            // xfa.event.change is not available
        }
        return "";
    }

    /**
     * @name isFieldEmptyAfterChange
     * @function
     * @memberof module:xfa
     * @description Checks whether the field will be empty after the user's
     *              change is applied. Uses the newText value and trims
     *              whitespace before checking.
     * @return {Boolean} True if the field will be empty (or whitespace-only)
     *                   after the change.
     * @example
     * // Require a non-empty value on commit:
     * if (xfa_event.isCommitKey()) {
     *     if (xfa_event.isFieldEmptyAfterChange()) {
     *         xfa.host.messageBox("This field cannot be left blank.");
     *         xfa.event.rc = false;
     *     }
     * }
     */
    function isFieldEmptyAfterChange() {
        try {
            var newText = getNewText();
            if (typeof newText === "string") {
                return (newText.replace(/\s+/g, "") === "");
            }
        } catch (e) {
            // comparison failed
        }
        return true;
    }

    /**
     * @name getFieldFromEvent
     * @function
     * @memberof module:xfa
     * @description Shorthand helper that retrieves the event target and
     *              returns it as a field reference. Returns null if the
     *              target is not a valid field object.
     * @return {Object|null} The field object from the event target, or null
     *                        if unavailable.
     * @example
     * // Get the field reference and modify its properties:
     * var field = xfa_event.getFieldFromEvent();
     * if (field) {
     *     field.borderColor = "0,0,0";
     *     xfa.host.messageBox("Field: " + field.name);
     * }
     */
    function getFieldFromEvent() {
        try {
            var target = getEventTarget();
            if (target && typeof target === "object") {
                // Verify it looks like a field by checking for common properties
                if (typeof target.name !== "undefined" || typeof target.SOM !== "undefined") {
                    return target;
                }
            }
        } catch (e) {
            // target field access failed
        }
        return null;
    }

    // Attach all functions to the namespace
    window.CustomFormRules.xfa.getEventTarget = getEventTarget;
    window.CustomFormRules.xfa.getEventTargetName = getEventTargetName;
    window.CustomFormRules.xfa.getNewText = getNewText;
    window.CustomFormRules.xfa.getPrevText = getPrevText;
    window.CustomFormRules.xfa.isCommitKey = isCommitKey;
    window.CustomFormRules.xfa.getCommitKey = getCommitKey;
    window.CustomFormRules.xfa.isShiftPressed = isShiftPressed;
    window.CustomFormRules.xfa.getChangeValue = getChangeValue;
    window.CustomFormRules.xfa.isFieldEmptyAfterChange = isFieldEmptyAfterChange;
    window.CustomFormRules.xfa.getFieldFromEvent = getFieldFromEvent;

})(window);
