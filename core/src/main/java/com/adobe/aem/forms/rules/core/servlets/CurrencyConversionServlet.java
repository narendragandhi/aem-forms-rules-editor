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
 * Backend proxy servlet for currency conversion.
 * Provides mock exchange rates for demonstration; replace with a real API in production.
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.paths=/bin/rules-api/currency-convert",
        "sling.servlet.methods=GET"
    }
)
@ServiceDescription("Currency Conversion Servlet for AEM Forms Rules Editor")
public class CurrencyConversionServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(CurrencyConversionServlet.class);

    private static final Map<String, Double> RATES = new HashMap<>();

    static {
        RATES.put("USD", 1.0);
        RATES.put("EUR", 0.92);
        RATES.put("GBP", 0.79);
        RATES.put("JPY", 149.50);
        RATES.put("CAD", 1.36);
        RATES.put("AUD", 1.53);
        RATES.put("CHF", 0.88);
        RATES.put("CNY", 7.24);
        RATES.put("INR", 83.12);
        RATES.put("MXN", 17.15);
    }

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String amountStr = request.getParameter("amount");
        String fromCurrency = request.getParameter("from");
        String toCurrency = request.getParameter("to");

        LOG.info("CurrencyConversionServlet: Converting {} {} to {}", sanitize(amountStr), sanitize(fromCurrency), sanitize(toCurrency));

        if (amountStr == null || fromCurrency == null || toCurrency == null) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Required parameters: amount, from, to\", \"valid\": false}");
            return;
        }

        double amount;
        try {
            amount = Double.parseDouble(amountStr.trim());
        } catch (NumberFormatException e) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid amount parameter.\", \"valid\": false}");
            return;
        }

        String from = fromCurrency.trim().toUpperCase();
        String to = toCurrency.trim().toUpperCase();

        if (!RATES.containsKey(from) || !RATES.containsKey(to)) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Unsupported currency code. Supported: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN\", \"valid\": false}");
            return;
        }

        double inUSD = amount / RATES.get(from);
        double converted = inUSD * RATES.get(to);
        double rate = RATES.get(to) / RATES.get(from);

        String result = String.format(
            "{\"originalAmount\": %.2f, \"fromCurrency\": \"%s\", \"convertedAmount\": %.2f, \"toCurrency\": \"%s\", \"exchangeRate\": %.6f, \"valid\": true}",
            amount, from, converted, to, rate
        );

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(result);
    }

    private String sanitize(String input) {
        if (input == null) return "null";
        return input.replaceAll("[^a-zA-Z0-9 .-]", "");
    }
}
