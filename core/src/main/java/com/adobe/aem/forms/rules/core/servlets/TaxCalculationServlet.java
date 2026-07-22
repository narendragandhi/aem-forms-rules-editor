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
 * Backend proxy servlet for US sales tax calculation by state.
 * Returns the combined state + average local tax rate for demonstration.
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.paths=/bin/rules-api/calculate-tax",
        "sling.servlet.methods=GET"
    }
)
@ServiceDescription("Tax Calculation Servlet for AEM Forms Rules Editor")
public class TaxCalculationServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(TaxCalculationServlet.class);

    private static final Map<String, Double> STATE_TAX_RATES = new HashMap<>();

    static {
        STATE_TAX_RATES.put("AL", 0.0922); STATE_TAX_RATES.put("AK", 0.0176);
        STATE_TAX_RATES.put("AZ", 0.0840); STATE_TAX_RATES.put("AR", 0.0951);
        STATE_TAX_RATES.put("CA", 0.0868); STATE_TAX_RATES.put("CO", 0.0777);
        STATE_TAX_RATES.put("CT", 0.0635); STATE_TAX_RATES.put("DE", 0.0000);
        STATE_TAX_RATES.put("DC", 0.0600); STATE_TAX_RATES.put("FL", 0.0708);
        STATE_TAX_RATES.put("GA", 0.0735); STATE_TAX_RATES.put("HI", 0.0444);
        STATE_TAX_RATES.put("ID", 0.0603); STATE_TAX_RATES.put("IL", 0.0882);
        STATE_TAX_RATES.put("IN", 0.0700); STATE_TAX_RATES.put("IA", 0.0694);
        STATE_TAX_RATES.put("KS", 0.0871); STATE_TAX_RATES.put("KY", 0.0600);
        STATE_TAX_RATES.put("LA", 0.0955); STATE_TAX_RATES.put("ME", 0.0550);
        STATE_TAX_RATES.put("MD", 0.0600); STATE_TAX_RATES.put("MA", 0.0625);
        STATE_TAX_RATES.put("MI", 0.0600); STATE_TAX_RATES.put("MN", 0.0749);
        STATE_TAX_RATES.put("MS", 0.0707); STATE_TAX_RATES.put("MO", 0.0825);
        STATE_TAX_RATES.put("MT", 0.0000); STATE_TAX_RATES.put("NE", 0.0698);
        STATE_TAX_RATES.put("NV", 0.0823); STATE_TAX_RATES.put("NH", 0.0000);
        STATE_TAX_RATES.put("NJ", 0.0660); STATE_TAX_RATES.put("NM", 0.0763);
        STATE_TAX_RATES.put("NY", 0.0852); STATE_TAX_RATES.put("NC", 0.0698);
        STATE_TAX_RATES.put("ND", 0.0696); STATE_TAX_RATES.put("OH", 0.0724);
        STATE_TAX_RATES.put("OK", 0.0895); STATE_TAX_RATES.put("OR", 0.0000);
        STATE_TAX_RATES.put("PA", 0.0634); STATE_TAX_RATES.put("RI", 0.0700);
        STATE_TAX_RATES.put("SC", 0.0746); STATE_TAX_RATES.put("SD", 0.0640);
        STATE_TAX_RATES.put("TN", 0.0955); STATE_TAX_RATES.put("TX", 0.0820);
        STATE_TAX_RATES.put("UT", 0.0719); STATE_TAX_RATES.put("VT", 0.0624);
        STATE_TAX_RATES.put("VA", 0.0575); STATE_TAX_RATES.put("WA", 0.1025);
        STATE_TAX_RATES.put("WV", 0.0651); STATE_TAX_RATES.put("WI", 0.0543);
        STATE_TAX_RATES.put("WY", 0.0536);
    }

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String amountStr = request.getParameter("amount");
        String stateCode = request.getParameter("state");

        LOG.info("TaxCalculationServlet: Calculating tax for {} in {}", sanitize(amountStr), sanitize(stateCode));

        if (amountStr == null || stateCode == null) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Required parameters: amount, state\", \"valid\": false}");
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

        String state = stateCode.trim().toUpperCase();
        Double taxRate = STATE_TAX_RATES.get(state);

        if (taxRate == null) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid or unsupported state code.\", \"valid\": false}");
            return;
        }

        double taxAmount = amount * taxRate;
        double totalWithTax = amount + taxAmount;

        String result = String.format(
            "{\"amount\": %.2f, \"state\": \"%s\", \"taxRate\": %.4f, \"taxRatePercent\": %.2f, \"taxAmount\": %.2f, \"totalWithTax\": %.2f, \"valid\": true}",
            amount, state, taxRate, taxRate * 100, taxAmount, totalWithTax
        );

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(result);
    }

    private String sanitize(String input) {
        if (input == null) return "null";
        return input.replaceAll("[^a-zA-Z0-9 .-]", "");
    }
}
