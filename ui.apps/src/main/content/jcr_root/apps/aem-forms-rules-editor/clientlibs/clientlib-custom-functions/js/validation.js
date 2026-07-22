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
     * Format: XX-XXXXXXX where first 2 digits are in valid range.
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
        // Valid EIN prefixes: 01-34, 35-39, 40-44, 45-46, 50-65, 71-77, 81-82, 83-84, 85-86, 87-88, 90-92, 93-99
        var invalidPrefixes = [15, 20, 25, 30, 35, 40, 45, 50];
        var rangeValid = (prefix >= 1 && prefix <= 34) || (prefix >= 50 && prefix <= 65) ||
                         (prefix >= 71 && prefix <= 77) || (prefix >= 81 && prefix <= 84) ||
                         (prefix >= 85 && prefix <= 88) || (prefix >= 90 && prefix <= 92) ||
                         (prefix >= 93 && prefix <= 99);
        return rangeValid;
    };

    /**
     * Validate US Individual Taxpayer Identification Number (ITIN).
     * Format: 9XX-XX-XXXX where 4th-5th digits are 70-88, 90-92, 94-99.
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
    // CONTACT VALIDATORS
    // ============================================================================

    /**
     * Validate email address format.
     * @name validateEmail
     * @function
     * @param {string} email The email address.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateEmail = function (email) {
        if (!email) return false;
        var cleanEmail = email.trim();
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(cleanEmail);
    };

    /**
     * Validate US phone number (10 digits, optional +1 country code).
     * @name validateUSPhone
     * @function
     * @param {string} phone The phone number string.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateUSPhone = function (phone) {
        if (!phone) return false;
        var digits = phone.replace(/\D/g, "");
        if (digits.length === 11 && digits.charAt(0) === "1") {
            digits = digits.substring(1);
        }
        return digits.length === 10 && parseInt(digits.substring(0, 3), 10) >= 200;
    };

    /**
     * Validate US ZIP code (5-digit or ZIP+4).
     * @name validateUSZip
     * @function
     * @param {string} zip The ZIP code string.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateUSZip = function (zip) {
        if (!zip) return false;
        return /^\d{5}(-\d{4})?$/.test(zip.trim());
    };

    /**
     * Validate US state abbreviation (2-letter code).
     * @name validateUSState
     * @function
     * @param {string} state The state code.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateUSState = function (state) {
        if (!state) return false;
        var states = "AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|AS|GU|MP|PR|VI";
        return states.split("|").indexOf(state.trim().toUpperCase()) !== -1;
    };

    /**
     * Validate US driver's license (basic format: 6-14 alphanumeric characters).
     * @name validateDriverLicense
     * @function
     * @param {string} dl The driver's license number.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateDriverLicense = function (dl) {
        if (!dl) return false;
        var cleaned = dl.trim();
        return /^[A-Za-z0-9]{6,14}$/.test(cleaned);
    };

    /**
     * Validate US passport number (9 digits, or 1 letter + 8 digits).
     * @name validateUSPassport
     * @function
     * @param {string} passport The passport number.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateUSPassport = function (passport) {
        if (!passport) return false;
        var cleaned = passport.trim();
        return /^\d{9}$/.test(cleaned) || /^[A-Za-z]\d{8}$/.test(cleaned);
    };

    // ============================================================================
    // NETWORK VALIDATORS
    // ============================================================================

    /**
     * Validate URL format (http/https).
     * @name validateURL
     * @function
     * @param {string} url The URL string.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateURL = function (url) {
        if (!url) return false;
        try {
            var parsed = new URL(url.trim());
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch (e) {
            return false;
        }
    };

    /**
     * Validate IPv4 address.
     * @name validateIPv4
     * @function
     * @param {string} ip The IPv4 string.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateIPv4 = function (ip) {
        if (!ip) return false;
        var octets = ip.trim().split(".");
        if (octets.length !== 4) return false;
        return octets.every(function (o) {
            if (!/^\d{1,3}$/.test(o)) return false;
            var num = parseInt(o, 10);
            return num >= 0 && num <= 255;
        });
    };

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

    /**
     * Validate MAC address (XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX).
     * @name validateMACAddress
     * @function
     * @param {string} mac The MAC address string.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateMACAddress = function (mac) {
        if (!mac) return false;
        return /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/.test(mac.trim());
    };

    // ============================================================================
    // FORMAT VALIDATORS
    // ============================================================================

    /**
     * Validate credit card number using the Luhn algorithm.
     * @name validateCreditCardLuhn
     * @function
     * @param {string} cardNumber The credit card number (digits only or with spaces/dashes).
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

    /**
     * Validate strong password (min 8 chars, upper, lower, digit, special char).
     * @name validateStrongPassword
     * @function
     * @param {string} password The password string.
     * @return {boolean} True if strong.
     */
    window.CustomFormRules.validateStrongPassword = function (password) {
        if (!password) return false;
        if (password.length < 8) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/[a-z]/.test(password)) return false;
        if (!/[0-9]/.test(password)) return false;
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
        return true;
    };

    /**
     * Validate JSON string.
     * @name validateJSON
     * @function
     * @param {string} jsonStr The JSON string.
     * @return {boolean} True if valid JSON.
     */
    window.CustomFormRules.validateJSON = function (jsonStr) {
        if (!jsonStr) return false;
        try {
            JSON.parse(jsonStr);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Validate value against a custom regex pattern.
     * @name validateRegexPattern
     * @function
     * @param {string} value The value to test.
     * @param {string} pattern The regex pattern string (without slashes).
     * @return {boolean} True if matches.
     */
    window.CustomFormRules.validateRegexPattern = function (value, pattern) {
        if (!value || !pattern) return false;
        try {
            return new RegExp(pattern).test(value);
        } catch (e) {
            return false;
        }
    };

    // ============================================================================
    // INTERNATIONAL VALIDATORS
    // ============================================================================

    /**
     * Validate UK postal code.
     * @name validateUKPostCode
     * @function
     * @param {string} postcode The UK postal code.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateUKPostCode = function (postcode) {
        if (!postcode) return false;
        var cleaned = postcode.trim().toUpperCase();
        return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/.test(cleaned);
    };

    /**
     * Validate UK phone number.
     * @name validateUKPhone
     * @function
     * @param {string} phone The UK phone number.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateUKPhone = function (phone) {
        if (!phone) return false;
        var digits = phone.replace(/\D/g, "");
        return /^(?:(?:00|\+)?44|0)\d{10}$/.test(digits) || /^(?:(?:00|\+)?44|0)\d{9}$/.test(digits);
    };

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
     * Validate Canadian postal code (A1A 1A1 format).
     * @name validateCanadianPostalCode
     * @function
     * @param {string} postalCode The Canadian postal code.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateCanadianPostalCode = function (postalCode) {
        if (!postalCode) return false;
        var cleaned = postalCode.trim().toUpperCase();
        return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/.test(cleaned);
    };

    /**
     * Validate IBAN (International Bank Account Number).
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

        // Move first 4 chars to end, convert letters to numbers
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

        // Mod-97 check
        var remainder = numeric;
        while (remainder.length > 2) {
            var block = remainder.substring(0, 9);
            remainder = (parseInt(block, 10) % 97).toString() + remainder.substring(block.length);
        }
        return parseInt(remainder, 10) % 97 === 1;
    };

    /**
     * Validate EU phone number (basic check for + prefix and 7-15 digits).
     * @name validateEUPhone
     * @function
     * @param {string} phone The EU phone number.
     * @return {boolean} True if valid format.
     */
    window.CustomFormRules.validateEUPhone = function (phone) {
        if (!phone) return false;
        var digits = phone.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
    };

    /**
     * Validate Australian phone number.
     * @name validateAustralianPhone
     * @function
     * @param {string} phone The Australian phone number.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateAustralianPhone = function (phone) {
        if (!phone) return false;
        var digits = phone.replace(/\D/g, "");
        return /^(?:61|0)[2-9]\d{8}$/.test(digits);
    };

    /**
     * Validate Australian postal code (4 digits).
     * @name validateAustralianPostCode
     * @function
     * @param {string} postcode The Australian postal code.
     * @return {boolean} True if valid.
     */
    window.CustomFormRules.validateAustralianPostCode = function (postcode) {
        if (!postcode) return false;
        var num = parseInt(postcode.trim(), 10);
        return /^\d{4}$/.test(postcode.trim()) && num >= 200 && num <= 9999;
    };

})(window);
