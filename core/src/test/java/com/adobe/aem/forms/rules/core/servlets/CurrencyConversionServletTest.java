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
class CurrencyConversionServletTest {

    private final AemContext context = new AemContext();
    private CurrencyConversionServlet servlet;

    @BeforeEach
    void setUp() {
        servlet = new CurrencyConversionServlet();
    }

    @Test
    void testConvertUSDToEUR() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", "100");
        params.put("from", "USD");
        params.put("to", "EUR");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        assertTrue(response.getOutputAsString().contains("\"valid\": true"));
        assertTrue(response.getOutputAsString().contains("EUR"));
    }

    @Test
    void testConvertGBPToINR() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", "50");
        params.put("from", "GBP");
        params.put("to", "INR");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        assertTrue(response.getOutputAsString().contains("\"valid\": true"));
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
    void testInvalidAmount() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", "abc");
        params.put("from", "USD");
        params.put("to", "EUR");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Invalid amount"));
    }

    @Test
    void testUnsupportedCurrency() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", "100");
        params.put("from", "XYZ");
        params.put("to", "EUR");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Unsupported"));
    }
}
