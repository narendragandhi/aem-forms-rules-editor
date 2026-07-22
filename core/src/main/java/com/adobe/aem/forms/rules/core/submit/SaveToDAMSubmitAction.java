package com.adobe.aem.forms.rules.core.submit;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.FormSubmitActionService;
import com.adobe.forms.common.service.FileAttachmentWrapper;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Session;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Submit action that stores form file attachments into AEM DAM.
 * Creates asset nodes under a configurable DAM path with metadata.
 */
@Component(
    service = FormSubmitActionService.class,
    immediate = true
)
public class SaveToDAMSubmitAction implements FormSubmitActionService {

    private static final Logger LOG = LoggerFactory.getLogger(SaveToDAMSubmitAction.class);
    private static final String SERVICE_NAME = "Save to DAM Submit Action";
    private static final String DEFAULT_DAM_PATH = "/content/dam/form-submissions";

    @Override
    public String getServiceName() {
        return SERVICE_NAME;
    }

    @Override
    public Map<String, Object> submit(FormSubmitInfo formSubmitInfo) {
        LOG.info("SaveToDAMSubmitAction: Starting submission processing...");

        List<FileAttachmentWrapper> attachments = formSubmitInfo.getFileAttachments();
        if (attachments == null || attachments.isEmpty()) {
            LOG.info("No file attachments to save to DAM.");
            return createSuccessResponse("No attachments to save. Form data received.");
        }

        ResourceResolver resolver = formSubmitInfo.getFormContainerResource().getResourceResolver();
        try {
            Session session = resolver.adaptTo(Session.class);
            AssetManager assetManager = resolver.adaptTo(AssetManager.class);

            if (assetManager == null) {
                LOG.error("AssetManager not available.");
                return createErrorResponse("DAM service unavailable.");
            }

            int savedCount = 0;
            for (FileAttachmentWrapper attachment : attachments) {
                String fileName = attachment.getFileName();
                String contentType = attachment.getContentType();

                if (fileName == null || fileName.isEmpty()) {
                    fileName = "attachment-" + UUID.randomUUID().toString();
                }

                String formPath = formSubmitInfo.getFormContainerPath();
                String safeFormPath = formPath.replaceAll("[^a-zA-Z0-9/-]", "_");
                String assetPath = DEFAULT_DAM_PATH + "/" + safeFormPath + "/" + fileName;

                InputStream inputStream = attachment.getInputStream();
                if (inputStream == null) {
                    LOG.warn("Skipping attachment with null input stream: {}", fileName);
                    continue;
                }

                Asset asset = assetManager.createAsset(assetPath, inputStream, contentType, true);
                if (asset != null) {
                    Node assetNode = asset.adaptTo(Node.class);
                    if (assetNode != null) {
                        assetNode.setProperty("formSubmission/FormContainerPath", formPath);
                        assetNode.setProperty("formSubmission/OriginalFileName", fileName);
                        assetNode.setProperty("formSubmission/ContentType", contentType);
                        session.save();
                    }
                    savedCount++;
                    LOG.info("Successfully saved attachment to DAM: {}", assetPath);
                }
            }

            LOG.info("SaveToDAMSubmitAction: Saved {} attachment(s) to DAM.", savedCount);
            return createSuccessResponse("Saved " + savedCount + " attachment(s) to DAM.");

        } catch (Exception e) {
            LOG.error("Error saving attachments to DAM.", e);
            return createErrorResponse("Failed to save attachments to DAM: " + e.getMessage());
        }
    }

    private Map<String, Object> createSuccessResponse(String msg) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        result.put("message", msg);
        return result;
    }

    private Map<String, Object> createErrorResponse(String msg) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "error");
        result.put("message", msg);
        return result;
    }
}
