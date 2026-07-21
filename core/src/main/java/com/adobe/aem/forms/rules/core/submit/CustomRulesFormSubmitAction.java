package com.adobe.aem.forms.rules.core.submit;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.FormSubmitActionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.StringReader;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * A secure, production-ready custom submit action for AEM Adaptive Forms Core Components.
 * Handles both JSON and XML form submissions, applying strict server-side validation,
 * sanitization, and defensive XML parsing to prevent XXE (XML External Entity) injections.
 */
@Component(
    service = FormSubmitActionService.class,
    immediate = true
)
public class CustomRulesFormSubmitAction implements FormSubmitActionService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomRulesFormSubmitAction.class);
    private static final String SERVICE_NAME = "Custom Rules Editor Submit Action";

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");
    private static final Pattern SSN_PATTERN = Pattern.compile("^\\d{3}-\\d{2}-\\d{4}$");
    private static final Pattern ZIP_PATTERN = Pattern.compile("^\\d{5}(-\\d{4})?$");
    private static final Pattern CREDIT_CARD_PATTERN = Pattern.compile("^\\d{13,19}$");

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String getServiceName() {
        return SERVICE_NAME;
    }

    @Override
    public Map<String, Object> submit(FormSubmitInfo formSubmitInfo) {
        LOG.info("Starting Custom Rules Form Submission handler...");

        String data = formSubmitInfo.getData();
        if (data == null || data.trim().isEmpty()) {
            LOG.warn("Submission failed: Empty or null form data received.");
            return createErrorResponse("Form data is empty.");
        }

        try {
            boolean isValid = processAndValidateData(data.trim());
            if (isValid) {
                LOG.info("Form submission validation succeeded.");
                return createSuccessResponse("Form processed and validated successfully.");
            } else {
                LOG.warn("Form submission failed server-side validation checks.");
                return createErrorResponse("Server-side validation failed. Check input formats.");
            }
        } catch (ParserConfigurationException e) {
            LOG.error("XML Parser configuration mismatch, potential security threat or system misconfiguration.", e);
            return createErrorResponse("Secure processing error.");
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while processing form submission.", e);
            return createErrorResponse("An internal error occurred while processing your request.");
        }
    }

    private Map<String, Object> createSuccessResponse(String msg) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        result.put("message", msg);
        return result;
    }

    private Map<String, Object> createErrorResponse(String msg) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "error");
        result.put("message", msg);
        return result;
    }

    private boolean processAndValidateData(String data) throws Exception {
        if (data.startsWith("{") || data.startsWith("[")) {
            return processJsonData(data);
        } else if (data.startsWith("<")) {
            return processXmlData(data);
        } else {
            LOG.warn("Unsupported data format received. Payload is neither valid JSON nor XML.");
            return false;
        }
    }

    private boolean processJsonData(String jsonData) {
        try {
            JsonNode rootNode = objectMapper.readTree(jsonData);
            LOG.info("Parsing submitted JSON payload.");

            // Extract and validate standard fields (simulating form data model structure)
            String email = getJsonStringValue(rootNode, "email");
            String ssn = getJsonStringValue(rootNode, "ssn");
            String zip = getJsonStringValue(rootNode, "zip");
            String creditCard = getJsonStringValue(rootNode, "creditCard");

            return validateFields(email, ssn, zip, creditCard);
        } catch (Exception e) {
            LOG.error("Failed to parse JSON payload.", e);
            return false;
        }
    }

    private String getJsonStringValue(JsonNode rootNode, String key) {
        if (rootNode.has(key) && !rootNode.get(key).isNull()) {
            return rootNode.get(key).asText();
        }
        // Check for nested afData/afBoundData structure standard in AEM Forms
        if (rootNode.has("afData")) {
            JsonNode afData = rootNode.get("afData");
            if (afData.has("afBoundData")) {
                JsonNode afBoundData = afData.get("afBoundData");
                if (afBoundData.has("data")) {
                    JsonNode innerData = afBoundData.get("data");
                    if (innerData.has(key) && !innerData.get(key).isNull()) {
                        return innerData.get(key).asText();
                    }
                }
            }
        }
        return null;
    }

    private boolean processXmlData(String xmlData) throws Exception {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        
        // Disable XML External Entity (XXE) processing to prevent security vulnerabilities
        dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
        dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        dbf.setXIncludeAware(false);
        dbf.setExpandEntityReferences(false);
        
        // Additional constraints
        dbf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
        dbf.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");

        DocumentBuilder db = dbf.newDocumentBuilder();
        Document doc = db.parse(new InputSource(new StringReader(xmlData)));
        doc.getDocumentElement().normalize();

        LOG.info("Parsing submitted XML payload securely.");

        String email = getXmlNodeValue(doc, "email");
        String ssn = getXmlNodeValue(doc, "ssn");
        String zip = getXmlNodeValue(doc, "zip");
        String creditCard = getXmlNodeValue(doc, "creditCard");

        return validateFields(email, ssn, zip, creditCard);
    }

    private String getXmlNodeValue(Document doc, String tagName) {
        NodeList nodeList = doc.getElementsByTagName(tagName);
        if (nodeList != null && nodeList.getLength() > 0) {
            Node node = nodeList.item(0);
            if (node != null && node.getTextContent() != null) {
                return node.getTextContent().trim();
            }
        }
        return null;
    }

    private boolean validateFields(String email, String ssn, String zip, String creditCard) {
        // Validate email if present
        if (email != null && !email.isEmpty() && !EMAIL_PATTERN.matcher(email).matches()) {
            LOG.warn("Server-side Validation Failed: Invalid email format: {}", sanitizeForLog(email));
            return false;
        }

        // Validate SSN if present
        if (ssn != null && !ssn.isEmpty()) {
            String sanitizedSsn = ssn.replaceAll("\\s+", "");
            if (!SSN_PATTERN.matcher(sanitizedSsn).matches() || isDummySsn(sanitizedSsn)) {
                LOG.warn("Server-side Validation Failed: Invalid SSN format.");
                return false;
            }
        }

        // Validate ZIP if present
        if (zip != null && !zip.isEmpty() && !ZIP_PATTERN.matcher(zip).matches()) {
            LOG.warn("Server-side Validation Failed: Invalid ZIP code format: {}", sanitizeForLog(zip));
            return false;
        }

        // Validate Credit Card if present (validate digits length matches 13 to 19 digits)
        if (creditCard != null && !creditCard.isEmpty()) {
            String digitsOnly = creditCard.replaceAll("\\D", "");
            if (!digitsOnly.isEmpty() && !CREDIT_CARD_PATTERN.matcher(digitsOnly).matches()) {
                LOG.warn("Server-side Validation Failed: Invalid Credit Card length.");
                return false;
            }
        }

        return true;
    }

    private boolean isDummySsn(String ssn) {
        // US SSN allocation rules:
        // Area number (first 3 digits) cannot be '000', '666', or in the range '900'-'999'
        // Group number (middle 2 digits) cannot be '00'
        // Serial number (last 4 digits) cannot be '0000'
        String clean = ssn.replace("-", "");
        if (clean.length() != 9) return true;
        
        String g1 = clean.substring(0, 3);
        String g2 = clean.substring(3, 5);
        String g3 = clean.substring(5, 9);

        if ("000".equals(g1) || "666".equals(g1) || g1.compareTo("900") >= 0) {
            return true;
        }
        if ("00".equals(g2)) {
            return true;
        }
        if ("0000".equals(g3)) {
            return true;
        }
        return false;
    }

    private String sanitizeForLog(String input) {
        if (input == null) return "";
        // Prevent log injection by removing newlines and carriage returns, and keeping only safe characters
        return input.replace('\n', '_').replace('\r', '_').replaceAll("[^a-zA-Z0-9@._-]", "");
    }
}
