package com.adobe.aem.forms.rules.core.prefill;

import com.adobe.forms.common.service.ContentType;
import com.adobe.forms.common.service.DataOptions;
import com.adobe.forms.common.service.FormsException;
import com.adobe.forms.common.service.PrefillData;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * Custom prefill service that populates Adaptive Forms from Sling user profile properties.
 * Reads the current user's profile and returns matching JSON for form field population.
 */
@Component(
    service = com.adobe.forms.common.service.DataProvider.class,
    immediate = true
)
public class UserProfilePrefillService implements com.adobe.forms.common.service.DataProvider {

    private static final Logger LOG = LoggerFactory.getLogger(UserProfilePrefillService.class);
    private static final String SERVICE_NAME = "User Profile Prefill Service";
    private static final String PROFILE_PATH = "/home/users";

    @Override
    public String getServiceName() {
        return SERVICE_NAME;
    }

    @Override
    public String getServiceDescription() {
        return "Prefill Adaptive Forms from Sling user profile properties.";
    }

    @Override
    public PrefillData getPrefillData(DataOptions dataOptions) throws FormsException {
        LOG.info("UserProfilePrefillService: Initiating prefill from user profile...");

        Map<String, Object> extras = dataOptions.getExtras();
        String userId = null;
        ResourceResolver resolver = null;

        if (extras != null) {
            userId = extras.containsKey("userId") ? extras.get("userId").toString() : null;
            resolver = extras.containsKey("resourceResolver")
                ? (ResourceResolver) extras.get("resourceResolver") : null;
        }

        if (userId == null) userId = "anonymous";

        StringBuilder json = new StringBuilder("{");
        json.append("\"userId\": \"").append(userId).append("\"");

        // If we have a resolver, try to read user profile
        if (resolver != null) {
            String profilePath = PROFILE_PATH + "/" + userId + "/profile";
            Resource profileResource = resolver.getResource(profilePath);

            if (profileResource != null) {
                ValueMap properties = profileResource.getValueMap();
                LOG.info("UserProfilePrefillService: Found profile for user: {}", userId);

                // Map common profile properties to form fields
                addJsonProperty(json, "firstName", properties.get("givenName", String.class));
                addJsonProperty(json, "lastName", properties.get("familyName", String.class));
                addJsonProperty(json, "email", properties.get("email", String.class));
                addJsonProperty(json, "phone", properties.get("telephone", String.class));
                addJsonProperty(json, "address", properties.get("address", String.class));
                addJsonProperty(json, "city", properties.get("city", String.class));
                addJsonProperty(json, "state", properties.get("state", String.class));
                addJsonProperty(json, "zip", properties.get("postalCode", String.class));
            } else {
                LOG.info("UserProfilePrefillService: No profile found for user: {}", userId);
            }
        } else {
            LOG.info("UserProfilePrefillService: No ResourceResolver available, using mock data.");
            // Fallback mock data for demonstration
            json.append(", \"firstName\": \"John\"");
            json.append(", \"lastName\": \"Doe\"");
            json.append(", \"email\": \"").append(userId).append("@example.com\"");
        }

        json.append("}");

        InputStream inputStream = new ByteArrayInputStream(json.toString().getBytes(StandardCharsets.UTF_8));
        return new PrefillData(inputStream, ContentType.JSON);
    }

    private void addJsonProperty(StringBuilder json, String key, String value) {
        if (value != null && !value.isEmpty()) {
            json.append(", \"").append(key).append("\": \"").append(escapeJson(value)).append("\"");
        }
    }

    private String escapeJson(String input) {
        return input.replace("\\", "\\\\").replace("\"", "\\\"")
            .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }
}
