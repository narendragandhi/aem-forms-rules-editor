/**
 * Geolocation and geography rules for AEM Forms Rules Editor.
 * Location lookup, distance calculation, and state utilities.
 */

(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};

    var US_STATES = {
        "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
        "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
        "DC": "District of Columbia", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii",
        "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
        "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine",
        "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota",
        "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska",
        "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico",
        "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
        "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island",
        "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas",
        "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington",
        "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
        "AS": "American Samoa", "GU": "Guam", "MP": "Northern Mariana Islands",
        "PR": "Puerto Rico", "VI": "US Virgin Islands"
    };

    /**
     * Fetch City and State by ZIP Code from external API.
     * @name fetchLocationByZip
     * @function
     * @param {string} zipCode The 5-digit or 9-digit zip code.
     * @return {promise} Promise resolving to "City, ST" or error message.
     */
    window.CustomFormRules.fetchLocationByZip = function (zipCode) {
        if (!zipCode) return Promise.resolve("Invalid Zip Code");
        var cleanZip = zipCode.trim().replace(/[-\s]/g, "");
        if (cleanZip.length !== 5 && cleanZip.length !== 9) return Promise.resolve("Invalid Zip Code format");

        var lookupZip = cleanZip.substring(0, 5);
        if (!/^\d{5}$/.test(lookupZip)) return Promise.resolve("Invalid Zip Code characters");

        return fetch("https://api.zippopotam.us/us/" + lookupZip)
            .then(function (response) {
                if (!response.ok) throw new Error("Zip code not found");
                return response.json();
            })
            .then(function (data) {
                if (data && data.places && data.places.length > 0) {
                    var place = data.places[0];
                    return place["place name"] + ", " + place["state abbreviation"];
                }
                return "Location details empty";
            })
            .catch(function () {
                return "Location not found";
            });
    };

    /**
     * Fetch City and State by ZIP Code from AEM backend database.
     * @name lookupZipCodeBackend
     * @function
     * @param {string} zipCode The 5-digit or 9-digit zip code.
     * @return {promise} Promise resolving to "City, ST" or error message.
     */
    window.CustomFormRules.lookupZipCodeBackend = function (zipCode) {
        if (!zipCode) return Promise.resolve("Invalid Zip Code");
        var cleanZip = zipCode.trim().replace(/[-\s]/g, "");
        if (cleanZip.length !== 5 && cleanZip.length !== 9) return Promise.resolve("Invalid Zip Code format");

        var lookupZip = cleanZip.substring(0, 5);
        if (!/^\d{5}$/.test(lookupZip)) return Promise.resolve("Invalid Zip Code characters");

        return fetch("/bin/rules-api/zip-lookup?zip=" + encodeURIComponent(lookupZip))
            .then(function (response) {
                if (!response.ok) throw new Error("Zip code not found in AEM database");
                return response.json();
            })
            .then(function (data) {
                if (data && data.city && data.state) return data.city + ", " + data.state;
                return "Location details not found in database response";
            })
            .catch(function () {
                return "Location not found in AEM database";
            });
    };

    /**
     * Calculate distance between two coordinates using the Haversine formula.
     * @name calculateDistance
     * @function
     * @param {number} lat1 Latitude of first point.
     * @param {number} lon1 Longitude of first point.
     * @param {number} lat2 Latitude of second point.
     * @param {number} lon2 Longitude of second point.
     * @return {number} Distance in miles.
     */
    window.CustomFormRules.calculateDistance = function (lat1, lon1, lat2, lon2) {
        var R = 3959; // Earth radius in miles
        var dLat = (Number(lat2) - Number(lat1)) * Math.PI / 180;
        var dLon = (Number(lon2) - Number(lon1)) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Number(lat1) * Math.PI / 180) * Math.cos(Number(lat2) * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseFloat((R * c).toFixed(2));
    };

    /**
     * Validate a US state abbreviation.
     * @name validateUSStateCode
     * @function
     * @param {string} state The 2-letter state code.
     * @return {boolean} True if valid US state/territory code.
     */
    window.CustomFormRules.validateUSStateCode = function (state) {
        if (!state) return false;
        return US_STATES.hasOwnProperty(state.trim().toUpperCase());
    };

    /**
     * Get full state name from 2-letter abbreviation.
     * @name getStateName
     * @function
     * @param {string} stateCode The 2-letter state code.
     * @return {string} Full state name, or empty string if invalid.
     */
    window.CustomFormRules.getStateName = function (stateCode) {
        if (!stateCode) return "";
        return US_STATES[stateCode.trim().toUpperCase()] || "";
    };

})(window);
