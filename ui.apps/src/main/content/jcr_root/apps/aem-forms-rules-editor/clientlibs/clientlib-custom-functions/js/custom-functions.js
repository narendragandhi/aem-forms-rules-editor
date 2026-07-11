/**
 * Custom JavaScript functions for AEM Forms Rules Editor.
 * These functions are parsed by the Rule Editor using JSDoc annotations.
 */

(function (window) {
    "use strict";

    // Namespace container for our custom rules functions
    window.CustomFormRules = window.CustomFormRules || {};

    /**
     * Validate if the input is a valid Social Security Number (SSN) in format XXX-XX-XXXX.
     * @name validateSSN
     * @function
     * @param {string} ssn The SSN string to validate.
     * @return {boolean} True if valid, false otherwise.
     */
    window.CustomFormRules.validateSSN = function (ssn) {
        if (!ssn) return false;
        var ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
        return ssnPattern.test(ssn.trim());
    };

    /**
     * Calculate the monthly payment for a loan/installment.
     * @name calculateMonthlyPayment
     * @function
     * @param {number} principal The principal loan amount.
     * @param {number} annualInterestRate The annual interest rate in percent (e.g. 5 for 5%).
     * @param {number} termMonths The term of the loan in months.
     * @return {number} The calculated monthly payment amount.
     */
    window.CustomFormRules.calculateMonthlyPayment = function (principal, annualInterestRate, termMonths) {
        if (!principal || !termMonths || termMonths <= 0) return 0;
        var monthlyRate = (annualInterestRate / 100) / 12;
        if (monthlyRate === 0) {
            return principal / termMonths;
        }
        var monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
        return parseFloat(monthlyPayment.toFixed(2));
    };

    /**
     * Mask a credit card number to show only the last 4 digits.
     * @name maskCreditCard
     * @function
     * @param {string} cardNumber The 16-digit credit card number.
     * @return {string} The masked credit card number (e.g. XXXX-XXXX-XXXX-1234).
     */
    window.CustomFormRules.maskCreditCard = function (cardNumber) {
        if (!cardNumber) return "";
        var digitsOnly = cardNumber.replace(/\D/g, "");
        if (digitsOnly.length !== 16) return cardNumber;
        return "XXXX-XXXX-XXXX-" + digitsOnly.slice(-4);
    };

    /**
     * Check if the given date is in the past.
     * @name isPastDate
     * @function
     * @param {string} dateString The ISO date string (YYYY-MM-DD).
     * @return {boolean} True if the date is in the past, false otherwise.
     */
    window.CustomFormRules.isPastDate = function (dateString) {
        if (!dateString) return false;
        var inputDate = new Date(dateString);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);
        return inputDate.getTime() < today.getTime();
    };

    /**
     * Fetch City and State by ZIP Code asynchronously.
     * @name fetchLocationByZip
     * @function
     * @param {string} zipCode The 5-digit zip code.
     * @return {promise} Promise resolving to location string (e.g., "San Jose, CA") or error message.
     */
    window.CustomFormRules.fetchLocationByZip = function (zipCode) {
        if (!zipCode || zipCode.trim().length !== 5) {
            return Promise.resolve("Invalid Zip Code");
        }
        return fetch("https://api.zippopotam.us/us/" + zipCode)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Zip code not found");
                }
                return response.json();
            })
            .then(function (data) {
                var place = data.places[0];
                return place["place name"] + ", " + place["state abbreviation"];
            })
            .catch(function (error) {
                return "Location not found";
            });
    };

    /**
     * Fetch City and State by ZIP Code from AEM backend database.
     * @name lookupZipCodeBackend
     * @function
     * @param {string} zipCode The 5-digit zip code.
     * @return {promise} Promise resolving to location string (e.g., "San Jose, CA") or error message.
     */
    window.CustomFormRules.lookupZipCodeBackend = function (zipCode) {
        if (!zipCode || zipCode.trim().length !== 5) {
            return Promise.resolve("Invalid Zip Code");
        }
        return fetch("/bin/rules-api/zip-lookup?zip=" + encodeURIComponent(zipCode))
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Zip code not found in AEM database");
                }
                return response.json();
            })
            .then(function (data) {
                return data.city + ", " + data.state;
            })
            .catch(function (error) {
                return "Location not found in AEM database";
            });
    };

})(window);

