# AEM Forms Rules Editor - Demo Video Script

**Duration:** ~12 minutes  
**Setup:** AEM running at localhost:4502, browser open to AEM Shell

---

## Scene 1: Introduction (30s)

**Narration:**
> "This is the AEM Forms Rules Editor — a production-ready library of 56+ custom JavaScript functions designed for Adobe Experience Manager's Adaptive Form and XFA IC fragment rules editor. Every function is annotated with JSDoc `@name` tags so the AEM Rules Editor UI can parse and display them directly."

**Show:** Terminal — run `ls` on the project, show `js.txt` listing all 17 JS files.

---

## Scene 2: Validation Functions (1 min)

**Narration:**
> "Let's start with validation. These functions go far beyond basic required-field checks."

**Browser Console — type and run:**

```js
// SSN validation with area/group/serial number rules
CustomFormRules.validateSSN("123-45-6789")   // true
CustomFormRules.validateSSN("000-12-3456")   // false (area number can't be 000)
CustomFormRules.validateSSN("987-65-4320")   // true

// EIN validation (employer identification)
CustomFormRules.validateEIN("12-3456789")    // true
CustomFormRules.validateEIN("91-1111111")    // false (invalid prefix)

// Credit card validation with Luhn algorithm
CustomFormRules.validateCreditCardLuhn("4111111111111111")  // true (Visa test number)
CustomFormRules.validateCreditCardLuhn("5500000000000004")  // true (Mastercard test number)

// IBAN validation
CustomFormRules.validateIBAN("DE89370400440532013000")     // true (Germany)
CustomFormRules.validateIBAN("GB29NWBK60161331926819")     // true (UK)
```

**Show:** Each result appearing in the console.

---

## Scene 3: Formatting Functions (1 min)

**Narration:**
> "Formatting functions ensure consistent data presentation across forms."

**Browser Console:**

```js
// Phone number formatting (auto-detects US 10-digit)
CustomFormRules.formatPhoneNumber("5551234567")        // "(555) 123-4567"
CustomFormRules.formatPhoneNumber("5551234567890")     // "+1 (555) 123-4567"

// SSN masking for display
CustomFormRules.formatSSN("123456789")                 // "***-**-6789"

// Credit card masking
CustomFormRules.maskCreditCard("4111111111111111")     // "****-****-****-1111"

// Currency formatting
CustomFormRules.formatCurrency(1234567.89, "USD")      // "$1,234,567.89"
CustomFormRules.formatCurrency(1234567.89, "EUR")      // "€1,234,567.89"

// ZIP+4 formatting
CustomFormRules.formatZipCodePlus4("123456789")        // "12345-6789"

// Number formatting with commas
CustomFormRules.formatNumberWithCommas(1234567890)     // "1,234,567,890"
```

---

## Scene 4: Financial Functions (1 min)

**Narration:**
> "The financial module contains real algorithms — not thin wrappers."

**Browser Console:**

```js
// Monthly mortgage payment (principal + interest)
// $300K loan, 6.5% APR, 30-year fixed
CustomFormRules.calculateMonthlyPayment(300000, 6.5, 360)
// → "$1,896.20"

// Compound interest calculation
// $10K at 5% for 10 years, compounded monthly
CustomFormRules.calculateCompoundInterest(10000, 5, 10, 12)
// → "$16,470.09"

// Loan payoff date
CustomFormRules.calculateLoanPayoffDate(300000, 6.5, 360)
// → "2054-07-23" (30 years from now)

// Amortization schedule (first 3 entries)
CustomFormRules.calculateAmortization(300000, 6.5, 360)
// → [{month: 1, payment: 1896.20, principal: 299.20, interest: 1597.00, balance: 299700.80}, ...]

// Tip calculator
CustomFormRules.calculateTip(85.50, 20)                // "$17.10"

// APR calculation
CustomFormRules.calculateAPR(300000, 5400, 360, 3000) // → effective APR
```

---

## Scene 5: Date Utilities (45s)

**Narration:**
> "Date functions handle business logic that AEM doesn't provide out of the box."

**Browser Console:**

```js
// Business day detection
CustomFormRules.isBusinessDay(new Date("2024-07-04"))  // false (July 4th)
CustomFormRules.isBusinessDay(new Date("2024-07-03"))  // true

// Business days between dates (excludes weekends + holidays)
CustomFormRules.businessDaysBetween("2024-01-01", "2024-01-31") // ~21

// Add business days
CustomFormRules.addDays(new Date(), 30)                // 30 days from now

// Age calculation
CustomFormRules.calculateAge("1990-05-15")             // 34

// Relative date formatting
CustomFormRules.formatDateRelative(new Date(Date.now() - 3600000))  // "1 hour ago"
```

---

## Scene 6: Backend Servlet — Currency Conversion (1 min)

**Narration:**
> "The servlets connect to real external APIs with caching and fallback."

**Browser Console:**

```js
// Live exchange rate via open.er-api.com (30-min cache)
// First call hits the API, subsequent calls use cache
CustomFormRules.financial.convertCurrency(100, "USD", "EUR")
// → { amount: 100, from: "USD", to: "EUR", rate: 0.9234, result: 92.34, ... }

// Built-in fallback rates if API is down
CustomFormRules.financial.convertCurrency(100, "USD", "JPY")
// → Uses cached/fallback rate, returns ¥15,500
```

**Show:** Open DevTools Network tab, show the API call to open.er-api.com, then show the cached response on second call.

---

## Scene 7: Backend Servlet — Address Validation (45s)

**Narration:**
> "Address validation covers all 50 US states plus DC with proper ZIP code ranges and address standardization."

**Browser Console:**

```js
// Validate a complete US address
CustomFormRules.data.validateAddress({
    street: "1600 Pennsylvania Ave NW",
    city: "Washington",
    state: "DC",
    zipCode: "20500"
})
// → { valid: true, standardized: { street: "1600 PENNSYLVANIA AVE NW", ... }, scores: { overall: 95 } }

// Validate with auto-correction
CustomFormRules.data.validateAddress({
    street: "123 main st",
    city: "new york",
    state: "NY",
    zipCode: "10001"
})
// → Standardizes to uppercase, corrects "st" → "STREET"

// Invalid state code
CustomFormRules.data.validateAddress({
    street: "123 Main St",
    city: "Portland",
    state: "XX",
    zipCode: "97201"
})
// → { valid: false, error: "Invalid state code: XX" }
```

---

## Scene 8: Correspondence Management (1 min)

**Narration:**
> "The Correspondence Management integration provides letter template browsing, data dictionary lookups, and correspondence generation — all from within the Rules Editor."

**Browser Console:**

```js
// List available letter templates
CustomFormRules.correspondence.listLetterTemplates()
// → [{ id: "LETTER-001", name: "Welcome Letter", category: "customer-onboarding" }, ...]

// Look up data from a dictionary (e.g., US states)
CustomFormRules.correspondence.lookupDataDictionary("us-states")
// → { name: "us-states", entries: { "AL": "Alabama", "AK": "Alaska", ... }, totalEntries: 51 }

// Generate a correspondence
CustomFormRules.correspondence.generateCorrespondence("LETTER-001", "/content/forms/af/customer")
// → { correspondenceId: "CORR-...", templateName: "Welcome Letter", status: "generated" }

// Preview before sending
CustomFormRules.correspondence.previewCorrespondence("LETTER-002")
// → Template details with previewMode: true

// Get correspondence history
CustomFormRules.correspondence.getCorrespondenceHistory("CUST-12345")
// → Array of previously generated correspondences for this recipient
```

---

## Scene 9: Document of Record (1 min)

**Narration:**
> "Document of Record generates PDF snapshots of form submissions for archival and compliance. Five built-in templates handle different document styles."

**Browser Console:**

```js
// List available DoR templates
CustomFormRules.documentOfRecord.listDoRTemplates()
// → [{ id: "DOR-STD-001", name: "Standard Form Summary", style: "default" }, ...]
// Styles: default, executive, detailed, compliance, customer

// Generate a standard DoR
CustomFormRules.documentOfRecord.generateDoR("DOR-STD-001", "/content/forms/af/loan", "SUB-001")
// → { dorId: "DOR-...", pdfUrl: "/content/dam/.../DOR-xxx.pdf", pageCount: "2" }

// Auto-select the best template based on form path
CustomFormRules.documentOfRecord.autoSelectTemplate("/content/forms/af/tax-compliance-form")
// → "DOR-STD-004" (compliance template, detected from "tax" + "compliance" keywords)

// One-call generate with auto-selection
CustomFormRules.documentOfRecord.autoGenerateDoR("/content/forms/af/tax-form", "SUB-TAX-001")
// → Auto-picks compliance template, generates PDF

// Regenerate (creates new version, preserves dorId)
CustomFormRules.documentOfRecord.regenerateDoR("DOR-xxx")
// → { status: "regenerated", regenerationId: "REGEN-..." }

// Check status
CustomFormRules.documentOfRecord.getDoRStatus("DOR-xxx")
// → { status: "generated", lastUpdated: "2024-..." }
```

---

## Scene 10: Forms Portal Prefill (1 min)

**Narration:**
> "Forms Portal integration enables draft save/resume, prefill from external data sources, and form analytics."

**Browser Console:**

```js
// List available forms
CustomFormRules.formsPortal.listForms()
// → [{ path: "/content/forms/af/loan-application", title: "Loan Application Form", category: "financial" }, ...]

// Filter by category
CustomFormRules.formsPortal.listForms({ category: "hr" })
// → HR forms only (Employee Onboarding, Leave Request)

// Save a draft (persists form data for resume later)
CustomFormRules.formsPortal.saveDraft("/content/forms/af/loan", "user123", '{"income":75000}')
// → { savedDate: "2024-...", status: "draft" }

// Retrieve the draft
CustomFormRules.formsPortal.getDraft("/content/forms/af/loan", "user123")
// → { data: '{"income":75000}', savedDate: "..." }

// Check if draft exists
CustomFormRules.formsPortal.hasDraft("/content/forms/af/loan", "user123")  // true

// Delete draft
CustomFormRules.formsPortal.deleteDraft("/content/forms/af/loan", "user123")
// → { status: "deleted" }

// Prefill from external source
CustomFormRules.formsPortal.getPrefillData("user-profile", ["email", "phone"])
// → { data: { email: "john.doe@example.com", phone: "+1-555-0123" } }

// Multi-source merge
CustomFormRules.formsPortal.prefillsFormFromMultipleSources(["user-profile", "customer-data"])
// → { data: { firstName: "John", lastName: "Doe", customerId: "CUST-12345", ... } }

// Search forms
CustomFormRules.formsPortal.searchForms("loan")
// → [{ path: "/content/forms/af/loan-application", ... }]

// Auto-save with debouncing (30s default)
var autoSave = CustomFormRules.formsPortal.createAutoSaver(
    "/content/forms/af/loan", "user123", 5000
);
autoSave('{"name":"updated"}');  // Debounced save after 5 seconds
```

---

## Scene 11: Composing Rules in AEM (1 min)

**Narration:**
> "The real power is composing these functions in the AEM Rules Editor UI."

**Show:** Open an Adaptive Form in AEM, navigate to the Rules Editor, create a new rule:

**Example Rule 1 — Auto-format phone on blur:**
```
WHEN Phone field loses focus
THEN Set Phone = CustomFormRules.formatPhoneNumber(Phone)
```

**Example Rule 2 — Auto-fill from multiple sources:**
```
WHEN Form loads
THEN Set prefillData = CustomFormRules.formsPortal.prefillsFormFromMultipleSources(["user-profile", "customer-data"])
     Set FirstName = prefillData.data.firstName
     Set Email = prefillData.data.email
```

**Example Rule 3 — Auto-save draft:**
```
WHEN Form loads
THEN Set autoSave = CustomFormRules.formsPortal.createAutoSaver(FormPath, CurrentUserId, 30000)

WHEN Any field changes
THEN Call autoSave(Form.getData())
```

**Example Rule 4 — Generate DoR on submit:**
```
WHEN Submit button clicked AND Form is valid
THEN Call CustomFormRules.documentOfRecord.autoGenerateDoR(FormPath, SubmissionId)
     Call CustomFormRules.correspondence.generateCorrespondence("LTR-US-001", FormPath)
```

---

## Scene 12: Architecture Overview (30s)

**Narration:**
> "Under the hood: 17 JS files with 56+ functions, 7 OSGi servlets for backend operations, 95 unit tests, all packaged as a standard AEM content package."

**Show:** Project structure in terminal:
```
core/src/main/java/.../servlets/
├── CurrencyConversionServlet.java      (live API + cache + fallback)
├── AddressValidationServlet.java       (50 states + DC)
├── ZipCodeLookupServlet.java           (150+ ZIP codes)
├── TaxCalculationServlet.java          (50 states + DC)
├── CorrespondenceManagementServlet.java (8 templates, 4 dictionaries)
├── DocumentOfRecordServlet.java         (5 templates, status tracking)
└── FormsPortalPrefillServlet.java       (10 forms, drafts, prefill, analytics)
```

**Show:** `mvn test` output — "95 tests, 0 failures"

---

## Closing (15s)

**Narration:**
> "56 production-ready functions. Real backends. Full test coverage. Drop it into any AEM Forms project and start building rules immediately."

**End card:** GitHub URL + project name

---

## Recording Checklist

- [ ] AEM running at localhost:4502 with admin:admin
- [ ] Browser with DevTools open
- [ ] Screen recording software running
- [ ] Clear console between scenes
- [ ] Zoom in on console output for readability
- [ ] Use dark theme for better contrast
