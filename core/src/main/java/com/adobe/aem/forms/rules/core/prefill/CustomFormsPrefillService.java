package com.adobe.aem.forms.rules.core.prefill;

import com.adobe.forms.common.service.ContentType;
import com.adobe.forms.common.service.DataOptions;
import com.adobe.forms.common.service.DataProvider;
import com.adobe.forms.common.service.FormsException;
import com.adobe.forms.common.service.PrefillData;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * A custom prefill service implementing the AEM Forms DataProvider interface.
 * Demonstrates loading mock database profiles dynamically when a form initializes.
 */
@Component(
    service = DataProvider.class,
    immediate = true
)
public class CustomFormsPrefillService implements DataProvider {

    private static final Logger LOG = LoggerFactory.getLogger(CustomFormsPrefillService.class);
    private static final String SERVICE_NAME = "Custom Rules Editor Prefill Service";

    @Override
    public String getServiceName() {
        return SERVICE_NAME;
    }

    @Override
    public String getServiceDescription() {
        return "Custom Prefill Service to prepopulate Adaptive Forms from backend repositories.";
    }

    @Override
    public PrefillData getPrefillData(DataOptions dataOptions) throws FormsException {
        LOG.info("CustomFormsPrefillService: Initiating form prefill sequence.");

        // Read identifiers from options (such as query parameters or user profiles)
        Map<String, Object> extras = dataOptions.getExtras();
        String userId = "default-user";

        if (extras != null && extras.containsKey("userId")) {
            userId = extras.get("userId").toString();
        }
        LOG.info("CustomFormsPrefillService: Fetching profile data for userId: {}", userId);

        // Pre-fill payload in JSON matching the form structure
        String jsonPayload = "{\n" +
                "  \"email\": \"" + userId + "@example.com\",\n" +
                "  \"zip\": \"90210\"\n" +
                "}";

        InputStream inputStream = new ByteArrayInputStream(jsonPayload.getBytes(StandardCharsets.UTF_8));
        return new PrefillData(inputStream, ContentType.JSON);
    }
}
