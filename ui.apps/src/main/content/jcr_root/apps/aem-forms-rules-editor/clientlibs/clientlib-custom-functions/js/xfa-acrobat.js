(function (window) {
    "use strict";
    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * @name acrobatAlert
     * @function
     * @description Wrapper for app.alert() with type parameter.
     * @param {string} message - The message to display in the alert.
     * @param {number} [type=0] - Alert type. 0 = OK, 1 = OK/Cancel, 2 = Yes/No, 3 = Yes/No/Cancel.
     * @param {number} [timeout=0] - Timeout in seconds before the alert closes automatically. 0 = no timeout.
     * @return {number} - Return value from the alert dialog. 1 = OK/Yes, 2 = No, 3 = Cancel, 4 = Timeout.
     * @example
     * // Show a simple OK alert
     * var result = CustomFormRules.xfa.acrobatAlert("Form saved successfully.");
     *
     * @example
     * // Show a Yes/No confirmation dialog
     * var response = CustomFormRules.xfa.acrobatAlert("Do you want to submit?", 2);
     * if (response === 1) {
     *     // User clicked Yes
     *     xfa.host.submitForm("http://example.com/submit");
     * }
     *
     * @example
     * // Show a timed warning
     * CustomFormRules.xfa.acrobatAlert("Session expires in 30 seconds.", 0, 30);
     */
    window.CustomFormRules.xfa.acrobatAlert = function (message, type, timeout) {
        try {
            var alertType = (typeof type === "number") ? type : 0;
            var alertTimeout = (typeof timeout === "number") ? timeout : 0;
            return app.alert(message, alertType, alertTimeout);
        } catch (e) {
            console.error("[CustomFormRules.xfa.acrobatAlert] Error: " + e.message);
            return -1;
        }
    };

    /**
     * @name acrobatSetTimeout
     * @function
     * @description Wrapper for app.setTimeOut(). Schedules a function to execute after a specified delay.
     * @param {Function} func - The function to execute after the delay.
     * @param {number} delay - The delay in milliseconds before the function is executed.
     * @return {number} - The timeout ID that can be used with acrobatClearTimeout to cancel.
     * @example
     * // Show a message after 3 seconds
     * var timeoutId = CustomFormRules.xfa.acrobatSetTimeout(function () {
     *     CustomFormRules.xfa.acrobatAlert("3 seconds have passed.");
     * }, 3000);
     *
     * @example
     * // Auto-validate a field after user stops typing
     * var validateTimer = CustomFormRules.xfa.acrobatSetTimeout(function () {
     *     var field = xfa.form.resolveNode("form1.page1.textField1");
     *     if (field) {
     *         field.validate();
     *     }
 *     }, 1500);
     *
     * @note HTML5 forms may not support app.setTimeOut(). Consider using window.setTimeout() as a fallback.
     */
    window.CustomFormRules.xfa.acrobatSetTimeout = function (func, delay) {
        try {
            if (typeof func !== "function") {
                console.error("[CustomFormRules.xfa.acrobatSetTimeout] First argument must be a function.");
                return -1;
            }
            if (typeof delay !== "number" || delay < 0) {
                console.error("[CustomFormRules.xfa.acrobatSetTimeout] Delay must be a non-negative number.");
                return -1;
            }
            return app.setTimeOut(func, delay);
        } catch (e) {
            console.error("[CustomFormRules.xfa.acrobatSetTimeout] Error: " + e.message);
            return -1;
        }
    };

    /**
     * @name acrobatClearTimeout
     * @function
     * @description Wrapper for app.clearTimeOut(). Cancels a timeout previously set with acrobatSetTimeout.
     * @param {number} timeoutId - The timeout ID returned by acrobatSetTimeout.
     * @return {boolean} - True if the timeout was successfully cleared, false otherwise.
     * @example
     * // Cancel a pending timeout
     * var myTimer = CustomFormRules.xfa.acrobatSetTimeout(function () {
     *     CustomFormRules.xfa.acrobatAlert("This will never show.");
     * }, 5000);
     *
     * // Cancel before it fires
     * var cleared = CustomFormRules.xfa.acrobatClearTimeout(myTimer);
     * // cleared === true
     *
     * @example
     * // Cancel a timeout inside another callback
     * var delayId = CustomFormRules.xfa.acrobatSetTimeout(function () {
     *     xfa.host.messageBox("Delayed message");
     * }, 2000);
     *
     * // On form save, cancel the pending message
     * CustomFormRules.xfa.acrobatClearTimeout(delayId);
     *
     * @note HTML5 forms may not support app.clearTimeOut(). Consider using window.clearTimeout() as a fallback.
     */
    window.CustomFormRules.xfa.acrobatClearTimeout = function (timeoutId) {
        try {
            if (typeof timeoutId !== "number") {
                console.error("[CustomFormRules.xfa.acrobatClearTimeout] timeoutId must be a number.");
                return false;
            }
            app.clearTimeOut(timeoutId);
            return true;
        } catch (e) {
            console.error("[CustomFormRules.xfa.acrobatClearTimeout] Error: " + e.message);
            return false;
        }
    };

    /**
     * @name acrobatSetInterval
     * @function
     * @description Wrapper for app.setInterval(). Repeatedly executes a function at fixed time intervals.
     * @param {Function} func - The function to execute at each interval.
     * @param {number} interval - The interval in milliseconds between each execution.
     * @return {number} - The interval ID that can be used with acrobatClearInterval to stop.
     * @example
     * // Check form validity every 5 seconds
     * var intervalId = CustomFormRules.xfa.acrobatSetInterval(function () {
     *     var statusField = xfa.form.resolveNode("form1.page1.statusField");
     *     if (statusField) {
     *         statusField.value = "Last check: " + new Date().toLocaleTimeString();
     *     }
     * }, 5000);
     *
     * @example
     * // Auto-save form data every 30 seconds
     * var autoSaveId = CustomFormRules.xfa.acrobatSetInterval(function () {
     *     try {
     *         xfa.form.saveDataXFA();
     *     } catch (err) {
     *         CustomFormRules.xfa.acrobatClearInterval(autoSaveId);
     *     }
     * }, 30000);
     *
     * @note HTML5 forms may not support app.setInterval(). Consider using window.setInterval() as a fallback.
     */
    window.CustomFormRules.xfa.acrobatSetInterval = function (func, interval) {
        try {
            if (typeof func !== "function") {
                console.error("[CustomFormRules.xfa.acrobatSetInterval] First argument must be a function.");
                return -1;
            }
            if (typeof interval !== "number" || interval < 0) {
                console.error("[CustomFormRules.xfa.acrobatSetInterval] Interval must be a non-negative number.");
                return -1;
            }
            return app.setInterval(func, interval);
        } catch (e) {
            console.error("[CustomFormRules.xfa.acrobatSetInterval] Error: " + e.message);
            return -1;
        }
    };

    /**
     * @name acrobatClearInterval
     * @function
     * @description Wrapper for app.clearInterval(). Stops an interval previously set with acrobatSetInterval.
     * @param {number} intervalId - The interval ID returned by acrobatSetInterval.
     * @return {boolean} - True if the interval was successfully cleared, false otherwise.
     * @example
     * // Start a recurring check and stop it later
     * var checkId = CustomFormRules.xfa.acrobatSetInterval(function () {
     *     var field = xfa.form.resolveNode("form1.page1.textField1");
     *     if (field && field.value !== "") {
     *         CustomFormRules.xfa.acrobatClearInterval(checkId);
     *         xfa.host.messageBox("Input detected, polling stopped.");
     *     }
     * }, 1000);
     *
     * @example
     * // Clear all intervals on form close
     * var monitorId = CustomFormRules.xfa.acrobatSetInterval(function () {
     *     app.updateUI();
     * }, 1000);
     *
     * // When the form closes, stop the monitor
     * CustomFormRules.xfa.acrobatClearInterval(monitorId);
     *
     * @note HTML5 forms may not support app.clearInterval(). Consider using window.clearInterval() as a fallback.
     */
    window.CustomFormRules.xfa.acrobatClearInterval = function (intervalId) {
        try {
            if (typeof intervalId !== "number") {
                console.error("[CustomFormRules.xfa.acrobatClearInterval] intervalId must be a number.");
                return false;
            }
            app.clearInterval(intervalId);
            return true;
        } catch (e) {
            console.error("[CustomFormRules.xfa.acrobatClearInterval] Error: " + e.message);
            return false;
        }
    };

    /**
     * @name acrobatLaunchURL
     * @function
     * @description Safe wrapper for app.launchURL(). Opens a URL in the default browser.
     * @param {string} url - The URL to open.
     * @param {boolean} [newWindow=false] - If true, opens the URL in a new window. If false, opens in the current window.
     * @return {boolean} - True if the URL was launched successfully, false otherwise.
     * @example
     * // Open a help page in the default browser
     * CustomFormRules.xfa.acrobatLaunchURL("https://example.com/help", true);
     *
     * @example
     * // Open a URL in the same window
     * var policyUrl = "https://example.com/policy";
     * var launched = CustomFormRules.xfa.acrobatLaunchURL(policyUrl, false);
     * if (!launched) {
     *     CustomFormRules.xfa.acrobatAlert("Unable to open the policy page.");
     * }
     *
     * @note HTML5 forms may not support app.launchURL(). Ensure the URL uses HTTPS.
     * @note The URL parameter must be a valid URL string.
     */
    window.CustomFormRules.xfa.acrobatLaunchURL = function (url, newWindow) {
        try {
            if (typeof url !== "string" || url.length === 0) {
                console.error("[CustomFormRules.xfa.acrobatLaunchURL] url must be a non-empty string.");
                return false;
            }
            var openInNewWindow = (typeof newWindow === "boolean") ? newWindow : false;
            app.launchURL(url, openInNewWindow);
            return true;
        } catch (e) {
            console.error("[CustomFormRules.xfa.acrobatLaunchURL] Error: " + e.message);
            return false;
        }
    };

    /**
     * @name acrobatBeep
     * @function
     * @description Wrapper for app.beep(). Plays a system alert sound.
     * @param {number} [cAlertType=0] - The alert type that determines the sound. 0 = default beep, 1 = warning, 2 = error.
     * @return {boolean} - True if the beep was played successfully, false otherwise.
     * @example
     * // Play a default beep
     * CustomFormRules.xfa.acrobatBeep();
     *
     * @example
     * // Play a warning beep when validation fails
     * var field = xfa.form.resolveNode("form1.page1.emailField");
     * if (field && field.value.indexOf("@") === -1) {
     *     CustomFormRules.xfa.acrobatBeep(1);
     *     CustomFormRules.xfa.acrobatAlert("Please enter a valid email address.", 0);
     * }
     *
     * @example
     * // Play an error beep
     * CustomFormRules.xfa.acrobatBeep(2);
     *
     * @note HTML5 forms do not support app.beep(). In HTML5 environments, this function will
     *       attempt to use the Web Audio API as a fallback. If neither is available, the
     *       function will return false silently.
     */
    window.CustomFormRules.xfa.acrobatBeep = function (cAlertType) {
        try {
            var alertType = (typeof cAlertType === "number") ? cAlertType : 0;
            app.beep(alertType);
            return true;
        } catch (e) {
            // Fallback: try Web Audio API for HTML5 forms
            try {
                var AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    var audioCtx = new AudioContext();
                    var oscillator = audioCtx.createOscillator();
                    var gainNode = audioCtx.createGain();
                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    oscillator.frequency.value = 800;
                    oscillator.type = "sine";
                    gainNode.gain.value = 0.3;
                    oscillator.start();
                    setTimeout(function () {
                        oscillator.stop();
                        audioCtx.close();
                    }, 200);
                    return true;
                }
            } catch (fallbackError) {
                // Silent fallback - beep is non-critical
            }
            console.warn("[CustomFormRules.xfa.acrobatBeep] Warning: app.beep() not available. " + e.message);
            return false;
        }
    };

    /**
     * @name acrobatConsolePrint
     * @function
     * @description Wrapper for console.println(). Prints a message to the Acrobat console.
     * @param {string} message - The message to print to the console.
     * @return {boolean} - True if the message was printed successfully, false otherwise.
     * @example
     * // Print a simple debug message
     * CustomFormRules.xfa.acrobatConsolePrint("Form initialization complete.");
     *
     * @example
     * // Log field values for debugging
     * var nameField = xfa.form.resolveNode("form1.page1.nameField");
     * var emailField = xfa.form.resolveNode("form1.page1.emailField");
     * if (nameField && emailField) {
     *     CustomFormRules.xfa.acrobatConsolePrint("Name: " + nameField.value);
     *     CustomFormRules.xfa.acrobatConsolePrint("Email: " + emailField.value);
     * }
     *
     * @example
     * // Log form submission details
     * var timestamp = new Date().toISOString();
     * CustomFormRules.xfa.acrobatConsolePrint("[" + timestamp + "] Submitting form data...");
     *
     * @note In HTML5 forms, console.println() may not be available. This wrapper
     *       falls back to console.log() if console.println() is not supported.
     */
    window.CustomFormRules.xfa.acrobatConsolePrint = function (message) {
        try {
            if (typeof message !== "string") {
                message = String(message);
            }
            if (typeof console.println === "function") {
                console.println(message);
            } else {
                // Fallback for HTML5 environments
                console.log("[XFA Console] " + message);
            }
            return true;
        } catch (e) {
            console.error("[CustomFormRules.xfa.acrobatConsolePrint] Error: " + e.message);
            return false;
        }
    };

})(window);
