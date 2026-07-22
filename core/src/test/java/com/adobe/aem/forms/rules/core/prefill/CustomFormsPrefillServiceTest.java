package com.adobe.aem.forms.rules.core.prefill;

import com.adobe.forms.common.service.ContentType;
import com.adobe.forms.common.service.DataOptions;
import com.adobe.forms.common.service.PrefillData;
import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class CustomFormsPrefillServiceTest {

    private CustomFormsPrefillService prefillService;

    @BeforeEach
    void setUp() {
        prefillService = new CustomFormsPrefillService();
    }

    @Test
    void testServiceMetadata() {
        assertEquals("Custom Rules Editor Prefill Service", prefillService.getServiceName());
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
            assertTrue(content.contains("default-user@example.com"));
            assertTrue(content.contains("90210"));
        }
    }

    @Test
    void testGetPrefillDataCustomUser() throws Exception {
        DataOptions options = new DataOptions();
        Map<String, Object> extras = new HashMap<>();
        extras.put("userId", "john_doe");
        options.setExtras(extras);

        PrefillData prefillData = prefillService.getPrefillData(options);

        assertNotNull(prefillData);
        assertEquals(ContentType.JSON, prefillData.getContentType());
        
        try (InputStream is = prefillData.getInputStream()) {
            String content = IOUtils.toString(is, StandardCharsets.UTF_8);
            assertTrue(content.contains("john_doe@example.com"));
        }
    }
}
