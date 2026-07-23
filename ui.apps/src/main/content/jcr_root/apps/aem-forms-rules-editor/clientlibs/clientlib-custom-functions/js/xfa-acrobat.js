(function (window) {
    "use strict";
    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * Plays a system alert sound. Falls back to Web Audio API in HTML5 environments.
     * @name acrobatBeep
     * @function
     * @param {number} [cAlertType=0] - 0 = default, 1 = warning, 2 = error.
     * @return {boolean} True if the beep was played successfully.
     * @example
     * CustomFormRules.xfa.acrobatBeep();     // default beep
     * CustomFormRules.xfa.acrobatBeep(1);    // warning beep
     * CustomFormRules.xfa.acrobatBeep(2);    // error beep
     */
    window.CustomFormRules.xfa.acrobatBeep = function (cAlertType) {
        try {
            var alertType = (typeof cAlertType === "number") ? cAlertType : 0;
            app.beep(alertType);
            return true;
        } catch (e) {
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
                // Silent fallback
            }
            return false;
        }
    };

})(window);
