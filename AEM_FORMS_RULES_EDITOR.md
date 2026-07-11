# AEM Forms Rules Editor & Custom Integrations Guide

This repository contains a reference implementation for **AEM Forms Rules Editor** features, showcasing how to extend Adaptive Forms Core Components using client-side JavaScript Custom Functions and backend OSGi Custom Submit Actions.

---

## Architecture Overview

AEM Forms Adaptive Forms (AFv2) based on Core Components allows form designers to visually build complex validation and calculation rules. As a developer, you can extend these rules through two main entry points:

1. **Client-Side: Custom Functions** — Custom JavaScript functions registered via Client Libraries (`clientlibs`) and exposed to the Rules Editor UI using specific JSDoc annotations.
2. **Server-Side: Custom Submit Actions** — OSGi services implementing the `FormSubmitActionService` interface that process forms data securely on submission.

```
                    ┌───────────────────────────────┐
                    │     AEM Forms Rules Editor    │
                    │      (Visual Rule Builder)     │
                    └───────────────┬───────────────┘
                                    │ Parses JSDoc annotations
                                    ▼
┌───────────────────────────────────┐       ┌───────────────────────────────────┐
│     Client-Side Extensions        │       │      Server-Side Extensions       │
│   (Custom JS Functions ClientLib) │       │   (Custom OSGi Submit Services)   │
│   e.g., validateSSN(),            │       │   e.g., CustomRulesFormSubmit...  │
│   calculateMonthlyPayment()       │       │                                   │
└───────────────────────────────────┘       └───────────────────────────────────┘
```

---

## 1. Client-Side: Custom Functions

Custom functions are exposed to the visual Rule Editor dropdowns by wrapping standard JavaScript inside a Client Library with JSDoc metadata.

### Client Library Location
*   **Path:** `[ui.apps/src/main/content/jcr_root/apps/aem-forms-rules-editor/clientlibs/clientlib-custom-functions](file:///Users/sonamgandhi/narendra/docker-sandbox/aem-forms-rules-editor/ui.apps/src/main/content/jcr_root/apps/aem-forms-rules-editor/clientlibs/clientlib-custom-functions)`
*   **Categories:** `aem-forms-rules-editor.customfunctions`
*   **Properties:** `allowProxy = true`

### Implementation
The JavaScript implementation is located in:
`[custom-functions.js](file:///Users/sonamgandhi/narendra/docker-sandbox/aem-forms-rules-editor/ui.apps/src/main/content/jcr_root/apps/aem-forms-rules-editor/clientlibs/clientlib-custom-functions/js/custom-functions.js)`

Here are the custom functions defined for the Rules Editor:

#### A. Social Security Number (SSN) Validation
Validates formatted inputs (`XXX-XX-XXXX`).
```javascript
/**
 * Validate if the input is a valid Social Security Number (SSN) in format XXX-XX-XXXX.
 * @name validateSSN
 * @function
 * @param {string} ssn The SSN string to validate.
 * @return {boolean} True if valid, false otherwise.
 */
window.CustomFormRules.validateSSN = function (ssn) { ... }
```

#### B. Monthly Payment Calculator
Performs loan calculations client-side based on loan principal, annual interest rate, and term.
```javascript
/**
 * Calculate the monthly payment for a loan/installment.
 * @name calculateMonthlyPayment
 * @function
 * @param {number} principal The principal loan amount.
 * @param {number} annualInterestRate The annual interest rate in percent.
 * @param {number} termMonths The term of the loan in months.
 * @return {number} The calculated monthly payment amount.
 */
window.CustomFormRules.calculateMonthlyPayment = function (principal, annualInterestRate, termMonths) { ... }
```

#### C. Credit Card Masking
Masks a 16-digit card number to display only the last 4 digits.
```javascript
/**
 * Mask a credit card number to show only the last 4 digits.
 * @name maskCreditCard
 * @function
 * @param {string} cardNumber The 16-digit credit card number.
 * @return {string} The masked credit card number (e.g. XXXX-XXXX-XXXX-1234).
 */
window.CustomFormRules.maskCreditCard = function (cardNumber) { ... }
```

#### D. Past Date Validator
Checks if a given date is in the past. Useful for birthdates or reservation dates.
```javascript
/**
 * Check if the given date is in the past.
 * @name isPastDate
 * @function
 * @param {string} dateString The ISO date string (YYYY-MM-DD).
 * @return {boolean} True if the date is in the past, false otherwise.
 */
window.CustomFormRules.isPastDate = function (dateString) { ... }
```

#### E. Async ZIP Code lookup (External API Fetch)
Asynchronously fetches location data using a public zip code endpoint.
```javascript
/**
 * Fetch City and State by ZIP Code asynchronously.
 * @name fetchLocationByZip
 * @function
 * @param {string} zipCode The 5-digit zip code.
 * @return {promise} Promise resolving to location string (e.g., "San Jose, CA") or error message.
 */
window.CustomFormRules.fetchLocationByZip = function (zipCode) { ... }
```

### Loading in Adaptive Forms Container
To make these functions available in your Adaptive Form:
1. Open the form in the Authoring editor.
2. Select the **Adaptive Form Container** component.
3. Open the properties panel.
4. Add `aem-forms-rules-editor.customfunctions` to the **Client Library Category** field.

---

## 2. Server-Side: OSGi Custom Submit Action

When standard submit actions (like submitting to REST endpoints, Mail, or Forms Portal) are not enough, you can write a Java OSGi service to handle submissions.

### OSGi Service Location
*   **Path:** `[CustomRulesFormSubmitAction.java](file:///Users/sonamgandhi/narendra/docker-sandbox/aem-forms-rules-editor/core/src/main/java/com/adobe/aem/forms/rules/core/submit/CustomRulesFormSubmitAction.java)`
*   **Service Interface:** `com.adobe.aemds.guide.service.FormSubmitActionService`

### Usage
Once compiled and deployed, a submit action option named **"Custom Rules Editor Submit Action"** will be selectable in the form's submission settings. When the user submits the form, the `submit()` method is called:

```java
@Component(
    service = FormSubmitActionService.class,
    immediate = true
)
public class CustomRulesFormSubmitAction implements FormSubmitActionService {
    @Override
    public String getServiceName() {
        return "Custom Rules Editor Submit Action";
    }

    @Override
    public Map<String, Object> submit(FormSubmitInfo formSubmitInfo) {
        String data = formSubmitInfo.getData();
        // Parse and process form data (JSON/XML) securely
        ...
        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        return result;
    }
}
```

---

## How to Build and Deploy

To compile and package the application:
```bash
# Compile and run unit tests
mvn clean test

# Build and deploy package to a local AEM author instance (port 4502)
mvn clean install -PautoInstallSinglePackage
```
