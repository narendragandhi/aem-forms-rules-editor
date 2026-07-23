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
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Backend proxy servlet for currency conversion.
 * Fetches live exchange rates from a free public API with in-memory caching.
 *
 * Rate-limited free API: open.er-api.com (no key required, 1000 req/month)
 * Fallback: hardcoded rates if API is unreachable.
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.paths=/bin/rules-api/currency-convert",
        "sling.servlet.methods=GET"
    }
)
@ServiceDescription("Live Currency Conversion Servlet for AEM Forms Rules Editor")
public class CurrencyConversionServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(CurrencyConversionServlet.class);

    private static final String API_URL = "https://open.er-api.com/v6/latest/USD";
    private static final int CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

    // Cache
    private static final ConcurrentHashMap<String, Double> liveRates = new ConcurrentHashMap<>();
    private static volatile long lastFetchTime = 0;

    // Fallback rates (used if API is unreachable)
    private static final Map<String, Double> FALLBACK_RATES = new HashMap<>();
    static {
        FALLBACK_RATES.put("USD", 1.0);
        FALLBACK_RATES.put("EUR", 0.92);
        FALLBACK_RATES.put("GBP", 0.79);
        FALLBACK_RATES.put("JPY", 149.50);
        FALLBACK_RATES.put("CAD", 1.36);
        FALLBACK_RATES.put("AUD", 1.53);
        FALLBACK_RATES.put("CHF", 0.88);
        FALLBACK_RATES.put("CNY", 7.24);
        FALLBACK_RATES.put("INR", 83.12);
        FALLBACK_RATES.put("MXN", 17.15);
        FALLBACK_RATES.put("BRL", 4.97);
        FALLBACK_RATES.put("KRW", 1325.0);
        FALLBACK_RATES.put("SGD", 1.34);
        FALLBACK_RATES.put("HKD", 7.82);
        FALLBACK_RATES.put("SEK", 10.45);
        FALLBACK_RATES.put("NOK", 10.68);
        FALLBACK_RATES.put("DKK", 6.87);
        FALLBACK_RATES.put("PLN", 4.02);
       FALLBACK_RATES.put("THB", 35.2);
        FALLBACK_RATES.put("ZAR", 18.65);
    }

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String amountStr = request.getParameter("amount");
        String fromCurrency = request.getParameter("from");
        String toCurrency = request.getParameter("to");

        LOG.info("CurrencyConvert: {} {} to {}", sanitize(amountStr), sanitize(fromCurrency), sanitize(toCurrency));

        // Validate parameters
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

        // Fetch live rates (cached)
        Map<String, Double> rates = getExchangeRates();

        if (!rates.containsKey(from) || !rates.containsKey(to)) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Unsupported currency: " + sanitize(to) + ". Supported: " + rates.keySet() + "\", \"valid\": false}");
            return;
        }

        double inUSD = amount / rates.get(from);
        double converted = inUSD * rates.get(to);
        double rate = rates.get(to) / rates.get(from);

        boolean liveData = !liveRates.isEmpty();
        String source = liveData ? "live" : "fallback";

        String result = String.format(
            "{\"originalAmount\": %.2f, \"fromCurrency\": \"%s\", \"convertedAmount\": %.2f, \"toCurrency\": \"%s\", \"exchangeRate\": %.6f, \"source\": \"%s\", \"valid\": true}",
            amount, from, converted, to, rate, source
        );

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(result);
    }

    private Map<String, Double> getExchangeRates() {
        long now = System.currentTimeMillis();

        // Return cache if fresh
        if (!liveRates.isEmpty() && (now - lastFetchTime) < CACHE_TTL_MS) {
            return liveRates;
        }

        try {
            URL url = new URL(API_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);
            conn.setRequestProperty("User-Agent", "AEM-Forms-Rules-Editor/1.0");

            int status = conn.getResponseCode();
            if (status == 200) {
                StringBuilder response = new StringBuilder();
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                }
                String json = response.toString();
                Map<String, Double> parsed = parseRatesFromJson(json);
                if (!parsed.isEmpty()) {
                    liveRates.clear();
                    liveRates.putAll(parsed);
                    lastFetchTime = now;
                    LOG.info("Fetched live exchange rates: {} currencies", parsed.size());
                    return liveRates;
                }
            } else {
                LOG.warn("Exchange rate API returned status: {}", status);
            }
        } catch (Exception e) {
            LOG.warn("Failed to fetch live exchange rates, using fallback: {}", e.getMessage());
        }

        return FALLBACK_RATES;
    }

    /**
     * Simple JSON parser for {"rates":{"USD":1,"EUR":0.92,...}} format.
     * Avoids pulling in a JSON library.
     */
    private Map<String, Double> parseRatesFromJson(String json) {
        Map<String, Double> rates = new HashMap<>();
        try {
            int ratesIdx = json.indexOf("\"rates\"");
            if (ratesIdx == -1) return rates;

            String ratesSection = json.substring(ratesIdx);
            // Find the closing brace of the rates object
            int braceCount = 0;
            int start = ratesSection.indexOf('{');
            int end = start;
            for (int i = start; i < ratesSection.length(); i++) {
                char c = ratesSection.charAt(i);
                if (c == '{') braceCount++;
                if (c == '}') braceCount--;
                if (braceCount == 0) { end = i; break; }
            }

            String ratesStr = ratesSection.substring(start + 1, end);
            // Parse "KEY": VALUE pairs
            String[] pairs = ratesStr.split(",");
            for (String pair : pairs) {
                String[] kv = pair.split(":");
                if (kv.length == 2) {
                    String key = kv[0].trim().replace("\"", "");
                    double value = Double.parseDouble(kv[1].trim());
                    rates.put(key, value);
                }
            }
        } catch (Exception e) {
            LOG.warn("Failed to parse exchange rates JSON: {}", e.getMessage());
        }
        return rates;
    }

    private String sanitize(String input) {
        if (input == null) return "null";
        return input.replaceAll("[^a-zA-Z0-9 .-]", "");
    }
}
