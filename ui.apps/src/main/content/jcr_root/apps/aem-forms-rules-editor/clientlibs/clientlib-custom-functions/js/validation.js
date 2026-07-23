/**
 * Validation rules for AEM Forms Rules Editor.
 * US and international identity, contact, network, and format validators.
 */

(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};

    // ============================================================================
    // US IDENTITY VALIDATORS
    // ============================================================================

    /**
     * Validate US Social Security Number (SSN) with full SSA allocation rules.
     * @name validateSSN
     * @function
     * @param {string} ssn The SSN string (XXX-XX-XXXX or XXXXXXXXX).
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateSSN = function (ssn) {
        if (!ssn) return false;
        var normalized = ssn.replace(/[\s-]/g, "");
        if (!/^\d{9}$/.test(normalized)) return false;

        var area = normalized.substring(0, 3);
        var group = normalized.substring(3, 5);
        var serial = normalized.substring(5, 9);

        if (area === "000" || area === "666" || parseInt(area, 10) >= 900) return false;
        if (group === "00") return false;
        if (serial === "0000") return false;
        return true;
    };

    /**
     * Validate US Employer Identification Number (EIN).
     * @name validateEIN
     * @function
     * @param {string} ein The EIN string.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateEIN = function (ein) {
        if (!ein) return false;
        var normalized = ein.replace(/[\s-]/g, "");
        if (!/^\d{9}$/.test(normalized)) return false;

        var prefix = parseInt(normalized.substring(0, 2), 10);
        var rangeValid = (prefix >= 1 && prefix <= 34) || (prefix >= 50 && prefix <= 65) ||
                         (prefix >= 71 && prefix <= 77) || (prefix >= 81 && prefix <= 84) ||
                         (prefix >= 85 && prefix <= 88) || (prefix >= 90 && prefix <= 92) ||
                         (prefix >= 93 && prefix <= 99);
        return rangeValid;
    };

    /**
     * Validate US Individual Taxpayer Identification Number (ITIN).
     * @name validateITIN
     * @function
     * @param {string} itin The ITIN string.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateITIN = function (itin) {
        if (!itin) return false;
        var normalized = itin.replace(/[\s-]/g, "");
        if (!/^\d{9}$/.test(normalized)) return false;
        if (normalized.substring(0, 3) !== "9") return false;

        var middle = parseInt(normalized.substring(3, 5), 10);
        var validRanges = (middle >= 70 && middle <= 88) || (middle >= 90 && middle <= 92) || (middle >= 94 && middle <= 99);
        return validRanges;
    };

    // ============================================================================
    // NETWORK VALIDATORS
    // ============================================================================

    /**
     * Validate IPv6 address (full, compressed, and mixed notation).
     * @name validateIPv6
     * @function
     * @param {string} ip The IPv6 string.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateIPv6 = function (ip) {
        if (!ip) return false;
        var cleaned = ip.trim().toLowerCase();
        if (/^[0-9a-f]{1,4}(:[0-9a-f]{1,4}){7}$/.test(cleaned)) return true;
        if (/^([0-9a-f]{1,4}:){1,7}:$/.test(cleaned)) return true;
        if (/^([0-9a-f]{1,4}:){1}(:[0-9a-f]{1,4}){1,6}$/.test(cleaned)) return true;
        if (/^([0-9a-f]{1,4}:){2}(:[0-9a-f]{1,4}){1,5}$/.test(cleaned)) return true;
        if (/^([0-9a-f]{1,4}:){3}(:[0-9a-f]{1,4}){1,4}$/.test(cleaned)) return true;
        if (/^([0-9a-f]{1,4}:){4}(:[0-9a-f]{1,4}){1,3}$/.test(cleaned)) return true;
        if (/^([0-9a-f]{1,4}:){5}(:[0-9a-f]{1,4}){1,2}$/.test(cleaned)) return true;
        if (/^([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}){1}$/.test(cleaned)) return true;
        if (/^::$/.test(cleaned)) return true;
        return false;
    };

    // ============================================================================
    // FORMAT VALIDATORS
    // ============================================================================

    /**
     * Validate credit card number using the Luhn algorithm.
     * @name validateCreditCardLuhn
     * @function
     * @param {string} cardNumber The credit card number.
     * @return {boolean} True if passes Luhn check.
     */
    window.CustomFormRules.validateCreditCardLuhn = function (cardNumber) {
        if (!cardNumber) return false;
        var digits = cardNumber.replace(/\D/g, "");
        if (digits.length < 13 || digits.length > 19) return false;

        var sum = 0;
        var alternate = false;
        for (var i = digits.length - 1; i >= 0; i--) {
            var n = parseInt(digits.charAt(i), 10);
            if (isNaN(n)) return false;
            if (alternate) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alternate = !alternate;
        }
        return sum % 10 === 0;
    };

    // ============================================================================
    // INTERNATIONAL VALIDATORS
    // ============================================================================

    /**
     * Validate Canadian Social Insurance Number (SIN) using Luhn algorithm.
     * @name validateCanadianSIN
     * @function
     * @param {string} sin The SIN string.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateCanadianSIN = function (sin) {
        if (!sin) return false;
        var digits = sin.replace(/[\s-]/g, "");
        if (!/^\d{9}$/.test(digits)) return false;

        var sum = 0;
        for (var i = 0; i < 9; i++) {
            var n = parseInt(digits.charAt(i), 10);
            if (i % 2 === 1) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
        }
        return sum % 10 === 0;
    };

    /**
     * Validate IBAN (International Bank Account Number) with mod-97 checksum.
     * @name validateIBAN
     * @function
     * @param {string} iban The IBAN string.
     * @return {boolean} True if valid (format + checksum).
     */
    window.CustomFormRules.validateIBAN = function (iban) {
        if (!iban) return false;
        var cleaned = iban.replace(/\s/g, "").toUpperCase();
        if (cleaned.length < 15 || cleaned.length > 34) return false;
        if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)) return false;

        var rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
        var numeric = "";
        for (var i = 0; i < rearranged.length; i++) {
            var ch = rearranged.charAt(i);
            if (/[0-9]/.test(ch)) {
                numeric += ch;
            } else {
                numeric += (ch.charCodeAt(0) - 55).toString();
            }
        }

        var remainder = numeric;
        while (remainder.length > 2) {
            var block = remainder.substring(0, 9);
            remainder = (parseInt(block, 10) % 97).toString() + remainder.substring(block.length);
        }
        return parseInt(remainder, 10) % 97 === 1;
    };

})(window);
