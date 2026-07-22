package com.adobe.aem.forms.rules.core.submit;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.FormSubmitActionService;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Session;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Submit action that writes a structured audit trail entry for each form submission.
 * Creates a JCR node under /content/audit/form-submissions with submission metadata.
 */
@Component(
    service = FormSubmitActionService.class,
    immediate = true
)
public class AuditLogSubmitAction implements FormSubmitActionService {

    private static final Logger LOG = LoggerFactory.getLogger(AuditLogSubmitAction.class);
    private static final String SERVICE_NAME = "Audit Log Submit Action";
    private static final String AUDIT_BASE_PATH = "/content/audit/form-submissions";

    @Override
    public String getServiceName() {
        return SERVICE_NAME;
    }

    @Override
    public Map<String, Object> submit(FormSubmitInfo formSubmitInfo) {
        LOG.info("AuditLogSubmitAction: Writing audit trail...");

        String data = formSubmitInfo.getData();

        if (formSubmitInfo.getFormContainerResource() == null) {
            LOG.warn("No form container resource available for audit logging.");
            return createErrorResponse("No form container resource available.");
        }

        ResourceResolver resolver = formSubmitInfo.getFormContainerResource().getResourceResolver();
        if (resolver == null) {
            LOG.warn("No resource resolver available for audit logging.");
            return createErrorResponse("No resource resolver available.");
        }

        try {
            Session session = resolver.adaptTo(Session.class);
            if (session == null) {
                LOG.error("Could not adapt resolver to JCR Session.");
                return createErrorResponse("JCR Session unavailable.");
            }

            String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
            String entryId = UUID.randomUUID().toString();

            // Ensure parent path exists
            if (!session.nodeExists(AUDIT_BASE_PATH)) {
                Node rootNode = session.getNode("/content");
                Node auditNode = rootNode.addNode("audit", "sling:Folder");
                auditNode.addNode("form-submissions", "sling:Folder");
                session.save();
            }

            // Create audit entry node
            Node auditEntry = session.getNode(AUDIT_BASE_PATH)
                .addNode(entryId, "nt:unstructured");

            auditEntry.setProperty("formContainerPath", formSubmitInfo.getFormContainerPath());
            auditEntry.setProperty("submissionTimestamp", timestamp);
            auditEntry.setProperty("dataPreview", data != null
                ? data.substring(0, Math.min(data.length(), 500))
                : "null");

            // Count attachments
            int attachmentCount = formSubmitInfo.getFileAttachments() != null
                ? formSubmitInfo.getFileAttachments().size()
                : 0;
            auditEntry.setProperty("attachmentCount", attachmentCount);

            // Mark as read-only audit entry
            auditEntry.setProperty("entryType", "form-submission");
            auditEntry.setProperty("status", "submitted");

            session.save();

            LOG.info("Audit entry created: {} at {}", entryId, timestamp);
            return createSuccessResponse("Audit trail recorded. Entry: " + entryId);

        } catch (Exception e) {
            LOG.error("Failed to write audit trail.", e);
            return createErrorResponse("Audit logging failed: " + e.getMessage());
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
