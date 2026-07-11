package com.adobe.aem.forms.rules.core.submit;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.FormSubmitActionService;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * A custom submit action for AEM Adaptive Forms Core Components.
 * This submit action is selectable in the form container properties.
 */
@Component(
    service = FormSubmitActionService.class,
    immediate = true
)
public class CustomRulesFormSubmitAction implements FormSubmitActionService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomRulesFormSubmitAction.class);
    private static final String SERVICE_NAME = "Custom Rules Editor Submit Action";

    @Override
    public String getServiceName() {
        return SERVICE_NAME;
    }

    @Override
    public Map<String, Object> submit(FormSubmitInfo formSubmitInfo) {
        LOG.info("Starting Custom Rules Form Submission handler...");

        // Retrieve submitted metadata and form data
        String data = formSubmitInfo.getData();
        LOG.info("Submitted Data XML/JSON: {}", data);

        // Custom backend logic goes here (e.g. sending to database, calling external service)
        boolean processedSuccessfully = processFormData(data);

        Map<String, Object> result = new HashMap<>();
        if (processedSuccessfully) {
            result.put("status", "success");
            result.put("message", "Form processed successfully via OSGi Custom submit action.");
        } else {
            result.put("status", "error");
            result.put("message", "Failed to process form data.");
        }

        return result;
    }

    private boolean processFormData(String data) {
        // Business-specific verification / processing
        if (data == null || data.isEmpty()) {
            return false;
        }
        // In a real application, parse XML/JSON and trigger workflows or API calls
        LOG.info("Successfully validated and routed form payload of length: {}", data.length());
        return true;
    }
}
