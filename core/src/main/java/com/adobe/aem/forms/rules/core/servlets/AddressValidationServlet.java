package com.adobe.aem.forms.rules.core.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Backend proxy servlet for US address validation.
 * Validates address components against a comprehensive database and returns standardized results.
 * Supports all 50 US states + DC with proper ZIP code ranges.
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.paths=/bin/rules-api/validate-address",
        "sling.servlet.methods=GET"
    }
)
@ServiceDescription("Address Validation Proxy Servlet for AEM Forms Rules Editor")
public class AddressValidationServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(AddressValidationServlet.class);

    // Comprehensive state-to-ZIP range mapping (all 50 states + DC)
    // Using String arrays to handle ZIP codes starting with 0
    private static final Map<String, String[]> STATE_ZIP_RANGES = new HashMap<>();
    static {
        STATE_ZIP_RANGES.put("AL", new String[]{"35004", "36927"}); // Alabama
        STATE_ZIP_RANGES.put("AK", new String[]{"99501", "99950"}); // Alaska
        STATE_ZIP_RANGES.put("AZ", new String[]{"85001", "86556"}); // Arizona
        STATE_ZIP_RANGES.put("AR", new String[]{"71601", "72959"}); // Arkansas
        STATE_ZIP_RANGES.put("CA", new String[]{"90001", "96162"}); // California
        STATE_ZIP_RANGES.put("CO", new String[]{"80001", "81658"}); // Colorado
        STATE_ZIP_RANGES.put("CT", new String[]{"06001", "06928"}); // Connecticut
        STATE_ZIP_RANGES.put("DE", new String[]{"19701", "19980"}); // Delaware
        STATE_ZIP_RANGES.put("DC", new String[]{"20001", "20599"}); // District of Columbia
        STATE_ZIP_RANGES.put("FL", new String[]{"32003", "34997"}); // Florida
        STATE_ZIP_RANGES.put("GA", new String[]{"30001", "31999"}); // Georgia
        STATE_ZIP_RANGES.put("HI", new String[]{"96701", "96898"}); // Hawaii
        STATE_ZIP_RANGES.put("ID", new String[]{"83201", "83876"}); // Idaho
        STATE_ZIP_RANGES.put("IL", new String[]{"60001", "62999"}); // Illinois
        STATE_ZIP_RANGES.put("IN", new String[]{"46001", "47997"}); // Indiana
        STATE_ZIP_RANGES.put("IA", new String[]{"50001", "52809"}); // Iowa
        STATE_ZIP_RANGES.put("KS", new String[]{"66002", "67954"}); // Kansas
        STATE_ZIP_RANGES.put("KY", new String[]{"40003", "42788"}); // Kentucky
        STATE_ZIP_RANGES.put("LA", new String[]{"70001", "71497"}); // Louisiana
        STATE_ZIP_RANGES.put("ME", new String[]{"03901", "04992"}); // Maine
        STATE_ZIP_RANGES.put("MD", new String[]{"20601", "21930"}); // Maryland
        STATE_ZIP_RANGES.put("MA", new String[]{"01001", "02791"}); // Massachusetts
        STATE_ZIP_RANGES.put("MI", new String[]{"48001", "49971"}); // Michigan
        STATE_ZIP_RANGES.put("MN", new String[]{"55001", "56763"}); // Minnesota
        STATE_ZIP_RANGES.put("MS", new String[]{"38601", "39776"}); // Mississippi
        STATE_ZIP_RANGES.put("MO", new String[]{"63001", "65899"}); // Missouri
        STATE_ZIP_RANGES.put("MT", new String[]{"59001", "59937"}); // Montana
        STATE_ZIP_RANGES.put("NE", new String[]{"68001", "69367"}); // Nebraska
        STATE_ZIP_RANGES.put("NV", new String[]{"88901", "89883"}); // Nevada
        STATE_ZIP_RANGES.put("NH", new String[]{"03001", "03897"}); // New Hampshire
        STATE_ZIP_RANGES.put("NJ", new String[]{"07001", "08989"}); // New Jersey
        STATE_ZIP_RANGES.put("NM", new String[]{"87001", "88439"}); // New Mexico
        STATE_ZIP_RANGES.put("NY", new String[]{"10001", "14975"}); // New York
        STATE_ZIP_RANGES.put("NC", new String[]{"27006", "28909"}); // North Carolina
        STATE_ZIP_RANGES.put("ND", new String[]{"58001", "58856"}); // North Dakota
        STATE_ZIP_RANGES.put("OH", new String[]{"43001", "45999"}); // Ohio
        STATE_ZIP_RANGES.put("OK", new String[]{"73001", "74966"}); // Oklahoma
        STATE_ZIP_RANGES.put("OR", new String[]{"97001", "97920"}); // Oregon
        STATE_ZIP_RANGES.put("PA", new String[]{"15001", "19640"}); // Pennsylvania
        STATE_ZIP_RANGES.put("RI", new String[]{"02801", "02940"}); // Rhode Island
        STATE_ZIP_RANGES.put("SC", new String[]{"29001", "29948"}); // South Carolina
        STATE_ZIP_RANGES.put("SD", new String[]{"57001", "57799"}); // South Dakota
        STATE_ZIP_RANGES.put("TN", new String[]{"37010", "38589"}); // Tennessee
        STATE_ZIP_RANGES.put("TX", new String[]{"73301", "79999"}); // Texas
        STATE_ZIP_RANGES.put("UT", new String[]{"84001", "84791"}); // Utah
        STATE_ZIP_RANGES.put("VT", new String[]{"05001", "05907"}); // Vermont
        STATE_ZIP_RANGES.put("VA", new String[]{"22001", "24658"}); // Virginia
        STATE_ZIP_RANGES.put("WA", new String[]{"98001", "99403"}); // Washington
        STATE_ZIP_RANGES.put("WV", new String[]{"24701", "26886"}); // West Virginia
        STATE_ZIP_RANGES.put("WI", new String[]{"53001", "54990"}); // Wisconsin
        STATE_ZIP_RANGES.put("WY", new String[]{"82001", "83128"}); // Wyoming
    }

    // State full names for validation
    private static final Map<String, String> STATE_FULL_NAMES = new HashMap<>();
    static {
        STATE_FULL_NAMES.put("AL", "Alabama");
        STATE_FULL_NAMES.put("AK", "Alaska");
        STATE_FULL_NAMES.put("AZ", "Arizona");
        STATE_FULL_NAMES.put("AR", "Arkansas");
        STATE_FULL_NAMES.put("CA", "California");
        STATE_FULL_NAMES.put("CO", "Colorado");
        STATE_FULL_NAMES.put("CT", "Connecticut");
        STATE_FULL_NAMES.put("DE", "Delaware");
        STATE_FULL_NAMES.put("DC", "District of Columbia");
        STATE_FULL_NAMES.put("FL", "Florida");
        STATE_FULL_NAMES.put("GA", "Georgia");
        STATE_FULL_NAMES.put("HI", "Hawaii");
        STATE_FULL_NAMES.put("ID", "Idaho");
        STATE_FULL_NAMES.put("IL", "Illinois");
        STATE_FULL_NAMES.put("IN", "Indiana");
        STATE_FULL_NAMES.put("IA", "Iowa");
        STATE_FULL_NAMES.put("KS", "Kansas");
        STATE_FULL_NAMES.put("KY", "Kentucky");
        STATE_FULL_NAMES.put("LA", "Louisiana");
        STATE_FULL_NAMES.put("ME", "Maine");
        STATE_FULL_NAMES.put("MD", "Maryland");
        STATE_FULL_NAMES.put("MA", "Massachusetts");
        STATE_FULL_NAMES.put("MI", "Michigan");
        STATE_FULL_NAMES.put("MN", "Minnesota");
        STATE_FULL_NAMES.put("MS", "Mississippi");
        STATE_FULL_NAMES.put("MO", "Missouri");
        STATE_FULL_NAMES.put("MT", "Montana");
        STATE_FULL_NAMES.put("NE", "Nebraska");
        STATE_FULL_NAMES.put("NV", "Nevada");
        STATE_FULL_NAMES.put("NH", "New Hampshire");
        STATE_FULL_NAMES.put("NJ", "New Jersey");
        STATE_FULL_NAMES.put("NM", "New Mexico");
        STATE_FULL_NAMES.put("NY", "New York");
        STATE_FULL_NAMES.put("NC", "North Carolina");
        STATE_FULL_NAMES.put("ND", "North Dakota");
        STATE_FULL_NAMES.put("OH", "Ohio");
        STATE_FULL_NAMES.put("OK", "Oklahoma");
        STATE_FULL_NAMES.put("OR", "Oregon");
        STATE_FULL_NAMES.put("PA", "Pennsylvania");
        STATE_FULL_NAMES.put("RI", "Rhode Island");
        STATE_FULL_NAMES.put("SC", "South Carolina");
        STATE_FULL_NAMES.put("SD", "South Dakota");
        STATE_FULL_NAMES.put("TN", "Tennessee");
        STATE_FULL_NAMES.put("TX", "Texas");
        STATE_FULL_NAMES.put("UT", "Utah");
        STATE_FULL_NAMES.put("VT", "Vermont");
        STATE_FULL_NAMES.put("VA", "Virginia");
        STATE_FULL_NAMES.put("WA", "Washington");
        STATE_FULL_NAMES.put("WV", "West Virginia");
        STATE_FULL_NAMES.put("WI", "Wisconsin");
        STATE_FULL_NAMES.put("WY", "Wyoming");
    }

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String street = request.getParameter("street");
        String city = request.getParameter("city");
        String state = request.getParameter("state");
        String zip = request.getParameter("zip");

        String safeLog = "street=" + sanitize(street) + ", city=" + sanitize(city)
            + ", state=" + sanitize(state) + ", zip=" + sanitize(zip);
        LOG.info("AddressValidationServlet: Validating address - {}", safeLog);

        // Validate required fields
        if (isNullOrEmpty(street) || isNullOrEmpty(city) || isNullOrEmpty(state) || isNullOrEmpty(zip)) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"All address fields (street, city, state, zip) are required.\", \"valid\": false}");
            return;
        }

        // Normalize state code
        String stateCode = normalizeStateCode(state.trim());
        if (stateCode == null) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid state code or name. Must be a valid US state abbreviation or full name.\", \"valid\": false}");
            return;
        }

        // Validate ZIP format
        if (!zip.trim().matches("^\\d{5}(-\\d{4})?$")) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid ZIP code format. Must be 5 digits or 5+4 format.\", \"valid\": false}");
            return;
        }

        // Extract 5-digit ZIP
        String zip5 = zip.trim().substring(0, 5);

        // Validate ZIP falls within state range
        String[] range = STATE_ZIP_RANGES.get(stateCode);
        boolean zipValid = range != null && zip5.compareTo(range[0]) >= 0 && zip5.compareTo(range[1]) <= 0;

        if (!zipValid) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"ZIP code " + zip5 + " is not valid for state " + stateCode + " (" + STATE_FULL_NAMES.get(stateCode) + "). Valid range: " + range[0] + "-" + range[1] + "\", \"valid\": false}");
            return;
        }

        // Standardize address
        String standardizedStreet = standardizeStreet(street.trim());
        String standardizedCity = standardizeCity(city.trim());
        String standardizedState = stateCode;

        String result = String.format(
            "{\"street\": \"%s\", \"city\": \"%s\", \"state\": \"%s\", \"zip\": \"%s\", \"stateName\": \"%s\", \"valid\": true, \"standardized\": true}",
            standardizedStreet, standardizedCity, standardizedState, zip.trim(), STATE_FULL_NAMES.get(stateCode)
        );

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(result);
    }

    private String normalizeStateCode(String input) {
        if (input == null) return null;
        String upper = input.trim().toUpperCase();
        
        // Check if it's already a valid state code
        if (STATE_ZIP_RANGES.containsKey(upper)) {
            return upper;
        }
        
        // Check if it's a full state name
        for (Map.Entry<String, String> entry : STATE_FULL_NAMES.entrySet()) {
            if (entry.getValue().equalsIgnoreCase(input.trim())) {
                return entry.getKey();
            }
        }
        
        return null;
    }

    private String standardizeStreet(String street) {
        if (street == null) return street;
        
        // Standardize common abbreviations
        String standardized = street
            .replaceAll("(?i)\\bstreet\\b", "St")
            .replaceAll("(?i)\\bavenue\\b", "Ave")
            .replaceAll("(?i)\\bboulevard\\b", "Blvd")
            .replaceAll("(?i)\\bdrive\\b", "Dr")
            .replaceAll("(?i)\\blane\\b", "Ln")
            .replaceAll("(?i)\\bcourt\\b", "Ct")
            .replaceAll("(?i)\\broad\\b", "Rd")
            .replaceAll("(?i)\\bplace\\b", "Pl")
            .replaceAll("(?i)\\bway\\b", "Way")
            .replaceAll("(?i)\\bnorth\\b", "N")
            .replaceAll("(?i)\\bsouth\\b", "S")
            .replaceAll("(?i)\\beast\\b", "E")
            .replaceAll("(?i)\\bwest\\b", "W")
            .replaceAll("(?i)\\bapartment\\b", "Apt")
            .replaceAll("(?i)\\bsuite\\b", "Ste")
            .replaceAll("(?i)\\bfloor\\b", "Fl")
            .replaceAll("(?i)\\bbuilding\\b", "Bldg")
            .replaceAll("(?i)\\broom\\b", "Rm")
            .replaceAll("(?i)\\bunit\\b", "Unit")
            .replaceAll("(?i)\\bnumber\\b", "#");
        
        return standardized;
    }

    private String standardizeCity(String city) {
        if (city == null) return city;
        
        // Capitalize first letter of each word
        String[] words = city.split("\\s+");
        StringBuilder standardized = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (i > 0) standardized.append(" ");
            if (words[i].length() > 0) {
                standardized.append(Character.toUpperCase(words[i].charAt(0)));
                if (words[i].length() > 1) {
                    standardized.append(words[i].substring(1).toLowerCase());
                }
            }
        }
        
        return standardized.toString();
    }

    private boolean isNullOrEmpty(String s) {
        return s == null || s.trim().isEmpty();
    }

    private String sanitize(String input) {
        if (input == null) return "null";
        return input.replaceAll("[^a-zA-Z0-9 .,-]", "");
    }
}