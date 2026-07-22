package com.adobe.aem.forms.rules.core.prefill;

import com.adobe.forms.common.service.ContentType;
import com.adobe.forms.common.service.DataOptions;
import com.adobe.forms.common.service.PrefillData;
import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

class UserProfilePrefillServiceTest {

    private UserProfilePrefillService prefillService;

    @BeforeEach
    void setUp() {
        prefillService = new UserProfilePrefillService();
    }

    @Test
    void testServiceMetadata() {
        assertEquals("User Profile Prefill Service", prefillService.getServiceName());
        assertNotNull(prefillService.getServiceDescription());
    }

    @Test
    void testGetPrefillDataDefaultUser() throws Exception {
        DataOptions options = new DataOptions();

        PrefillData prefillData = prefillService.getPrefillData(options);

        assertNotNull(prefillData);
        assertEquals(ContentType.JSON, prefillData.getContentType());

        try (InputStream is = prefillData.getInputStream()) {
            String content = IOUtils.toString(is, StandardCharsets.UTF_8);
            assertTrue(content.contains("userId"));
            assertTrue(content.contains("firstName"));
            assertTrue(content.contains("lastName"));
            assertTrue(content.contains("email"));
        }
    }

    @Test
    void testGetPrefillDataWithExtras() throws Exception {
        DataOptions options = new DataOptions();
        java.util.Map<String, Object> extras = new java.util.HashMap<>();
        extras.put("userId", "test_user");
        options.setExtras(extras);

        PrefillData prefillData = prefillService.getPrefillData(options);

        assertNotNull(prefillData);
        try (InputStream is = prefillData.getInputStream()) {
            String content = IOUtils.toString(is, StandardCharsets.UTF_8);
            assertTrue(content.contains("test_user"));
        }
    }
}
