/**
 * Custom JavaScript functions for AEM Forms Rules Editor.
 * These functions are parsed by the Rule Editor using JSDoc annotations.
 */

(function (window) {
    "use strict";

    // Namespace container for our custom rules functions
    window.CustomFormRules = window.CustomFormRules || {};

    /**
     * Validate if the input is a valid US Social Security Number (SSN).
     * Disallows invalid sequences (e.g., starting with 000, 666, or 900+, or all zeros in any segment).
     * @name validateSSN
     * @function
     * @param {string} ssn The SSN string to validate.
     * @return {boolean} True if valid, false otherwise.
     */
    window.CustomFormRules.validateSSN = function (ssn) {
        if (!ssn) return false;
        
        // Normalize formatting: remove spaces/dashes
        var normalized = ssn.replace(/[\s-]/g, "");
        
        // Check general format (exactly 9 digits)
        var ssnPattern = /^\d{9}$/;
        if (!ssnPattern.test(normalized)) {
            return false;
        }

        var area = normalized.substring(0, 3);
        var group = normalized.substring(3, 5);
        var serial = normalized.substring(5, 9);

        // SSN allocation rules:
        // Area number cannot be '000', '666', or in the range '900'-'999'
        if (area === "000" || area === "666" || parseInt(area, 10) >= 900) {
            return false;
        }
        // Group number cannot be '00'
        if (group === "00") {
            return false;
        }
        // Serial number cannot be '0000'
        if (serial === "0000") {
            return false;
        }

        return true;
    };

    /**
     * Calculate the monthly payment for a loan/installment.
     * Checks principal, rate, and term for valid positive numbers.
     * @name calculateMonthlyPayment
     * @function
     * @param {number} principal The principal loan amount.
     * @param {number} annualInterestRate The annual interest rate in percent (e.g., 5 for 5%).
     * @param {number} termMonths The term of the loan in months.
     * @return {number} The calculated monthly payment amount.
     */
    window.CustomFormRules.calculateMonthlyPayment = function (principal, annualInterestRate, termMonths) {
        var p = Number(principal);
        var r = Number(annualInterestRate);
        var t = Number(termMonths);

        if (isNaN(p) || isNaN(r) || isNaN(t)) return 0;
        if (p <= 0 || t <= 0 || r < 0) return 0;

        var monthlyRate = (r / 100) / 12;
        if (monthlyRate === 0) {
            return parseFloat((p / t).toFixed(2));
        }

        var monthlyPayment = (p * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -t));
        
        if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) {
            return 0;
        }
        return parseFloat(monthlyPayment.toFixed(2));
    };

    /**
     * Mask a credit card number to show only the last 4 digits.
     * Accepts inputs of lengths between 13 and 19 digits.
     * @name maskCreditCard
     * @function
     * @param {string} cardNumber The credit card number string.
     * @return {string} The masked credit card number (e.g. XXXX-XXXX-XXXX-1234 or XXXXXXXXXXXX1234).
     */
    window.CustomFormRules.maskCreditCard = function (cardNumber) {
        if (!cardNumber) return "";
        var digitsOnly = cardNumber.replace(/\D/g, "");
        var len = digitsOnly.length;
        if (len < 13 || len > 19) {
            return cardNumber; // Return original if not standard credit card length
        }
        var maskedSection = Array(len - 3).join("X");
        var lastFour = digitsOnly.slice(-4);
        
        // Return structured format if exactly 16 digits, otherwise plain masked string
        if (len === 16) {
            return "XXXX-XXXX-XXXX-" + lastFour;
        } else if (len === 15) { // Amex formatting
            return "XXXX-XXXXXX-X" + lastFour;
        }
        return maskedSection + lastFour;
    };

    /**
     * Check if the given date is in the past.
     * Assumes UTC context or normalizes to date boundaries.
     * @name isPastDate
     * @function
     * @param {string} dateString The ISO date string (YYYY-MM-DD).
     * @return {boolean} True if the date is in the past, false otherwise.
     */
    window.CustomFormRules.isPastDate = function (dateString) {
        if (!dateString) return false;
        
        var parts = dateString.split("-");
        if (parts.length !== 3) return false;

        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1; // JS months are 0-15
        var day = parseInt(parts[2], 10);

        if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

        var inputDate = new Date(year, month, day);
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        return inputDate.getTime() < today.getTime();
    };

    /**
     * Fetch City and State by ZIP Code asynchronously from public API.
     * Normalizes inputs and handles promise rejection gracefully.
     * @name fetchLocationByZip
     * @function
     * @param {string} zipCode The 5-digit or 9-digit zip code.
     * @return {promise} Promise resolving to location string (e.g., "San Jose, CA") or error message.
     */
    window.CustomFormRules.fetchLocationByZip = function (zipCode) {
        if (!zipCode) {
            return Promise.resolve("Invalid Zip Code");
        }
        var cleanZip = zipCode.trim().replace(/[-\s]/g, "");
        if (cleanZip.length !== 5 && cleanZip.length !== 9) {
            return Promise.resolve("Invalid Zip Code format");
        }
        
        // Extract 5-digit base for API lookup
        var lookupZip = cleanZip.substring(0, 5);
        if (!/^\d{5}$/.test(lookupZip)) {
            return Promise.resolve("Invalid Zip Code characters");
        }

        return fetch("https://api.zippopotam.us/us/" + lookupZip)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Zip code not found");
                }
                return response.json();
            })
            .then(function (data) {
                if (data && data.places && data.places.length > 0) {
                    var place = data.places[0];
                    return place["place name"] + ", " + place["state abbreviation"];
                }
                return "Location details empty";
            })
            .catch(function (error) {
                return "Location not found";
            });
    };

    /**
     * Fetch City and State by ZIP Code from AEM backend database.
     * Normalizes zip format and validates parameters.
     * @name lookupZipCodeBackend
     * @function
     * @param {string} zipCode The 5-digit or 9-digit zip code.
     * @return {promise} Promise resolving to location string (e.g., "San Jose, CA") or error message.
     */
    window.CustomFormRules.lookupZipCodeBackend = function (zipCode) {
        if (!zipCode) {
            return Promise.resolve("Invalid Zip Code");
        }
        var cleanZip = zipCode.trim().replace(/[-\s]/g, "");
        if (cleanZip.length !== 5 && cleanZip.length !== 9) {
            return Promise.resolve("Invalid Zip Code format");
        }
        
        var lookupZip = cleanZip.substring(0, 5);
        if (!/^\d{5}$/.test(lookupZip)) {
            return Promise.resolve("Invalid Zip Code characters");
        }

        return fetch("/bin/rules-api/zip-lookup?zip=" + encodeURIComponent(lookupZip))
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Zip code not found in AEM database");
                }
                return response.json();
            })
            .then(function (data) {
                if (data && data.city && data.state) {
                    return data.city + ", " + data.state;
                }
                return "Location details not found in database response";
            })
            .catch(function (error) {
                return "Location not found in AEM database";
            });
    };

    /**
     * Validate if the input is a valid email address format.
     * @name validateEmail
     * @function
     * @param {string} email The email address to validate.
     * @return {boolean} True if valid, false otherwise.
     */
    window.CustomFormRules.validateEmail = function (email) {
        if (!email) return false;
        var cleanEmail = email.trim();
        var emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
        return emailPattern.test(cleanEmail);
    };

    /**
     * Format a 10-digit US phone number to (XXX) XXX-XXXX format.
     * @name formatPhoneNumber
     * @function
     * @param {string} phone The raw phone number string.
     * @return {string} The formatted phone number, or the original string if invalid.
     */
    window.CustomFormRules.formatPhoneNumber = function (phone) {
        if (!phone) return "";
        var digitsOnly = phone.replace(/\D/g, "");
        if (digitsOnly.length !== 10) {
            return phone; // Return as-is if it's not a standard 10-digit number
        }
        return "(" + digitsOnly.substring(0, 3) + ") " + digitsOnly.substring(3, 6) + "-" + digitsOnly.substring(6);
    };

    /**
     * Calculate age in years based on a birthdate string (YYYY-MM-DD).
     * Returns -1 if date is invalid, or if the birthdate is in the future.
     * @name calculateAge
     * @function
     * @param {string} birthDateString The birthdate ISO string.
     * @return {number} The age in years, or -1 if invalid.
     */
    window.CustomFormRules.calculateAge = function (birthDateString) {
        if (!birthDateString) return -1;
        var parts = birthDateString.split("-");
        if (parts.length !== 3) return -1;

        var birthYear = parseInt(parts[0], 10);
        var birthMonth = parseInt(parts[1], 10) - 1;
        var birthDay = parseInt(parts[2], 10);

        if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) return -1;

        var birthDate = new Date(birthYear, birthMonth, birthDay);
        var today = new Date();
        
        if (birthDate.getTime() > today.getTime()) {
            return -1; // Born in the future
        }

        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDifference = today.getMonth() - birthDate.getMonth();
        
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

})(window);
