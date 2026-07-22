package com.adobe.aem.forms.rules.core.servlets;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
class TaxCalculationServletTest {

    private final AemContext context = new AemContext();
    private TaxCalculationServlet servlet;

    @BeforeEach
    void setUp() {
        servlet = new TaxCalculationServlet();
    }

    @Test
    void testCalculateTaxCalifornia() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", "100");
        params.put("state", "CA");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String output = response.getOutputAsString();
        assertTrue(output.contains("\"valid\": true"));
        assertTrue(output.contains("\"state\": \"CA\""));
        assertTrue(output.contains("taxRate"));
        assertTrue(output.contains("taxAmount"));
    }

    @Test
    void testCalculateTaxTexas() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", "200");
        params.put("state", "TX");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        assertTrue(response.getOutputAsString().contains("\"state\": \"TX\""));
    }

    @Test
    void testNoSalesTaxStates() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", "100");
        params.put("state", "OR");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        assertTrue(response.getOutputAsString().contains("\"taxRate\": 0.0000"));
    }

    @Test
    void testMissingParameters() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Required parameters"));
    }

    @Test
    void testInvalidState() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", "100");
        params.put("state", "ZZ");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Invalid"));
    }
}
