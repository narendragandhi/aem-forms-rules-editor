# AEM Forms Rules Editor — Comprehensive Library

A production-ready **comprehensive rules library** for AEM Forms Adaptive Forms (AFv2) Core Components. Extends the visual Rules Editor with **90+ client-side JavaScript functions**, **6 server-side OSGi Submit Actions**, **6 backend proxy Servlets**, and **2 Prefill Services** — all organized by category for easy loading and maintenance.

---

## Library at a Glance

### Client-Side: 90+ JavaScript Functions (8 Categories)

| Category | File | Functions | Description |
|---|---|---|---|
| **Validation** | `validation.js` | 25 | US & international ID, contact, network, format validators |
| **Formatting** | `formatting.js` | 15 | Phone, SSN, credit card, currency, date, name formatting |
| **Financial** | `financial.js` | 12 | Loan, interest, tax, discount, amortization calculations |
| **Date/Time** | `date-utils.js` | 12 | Date validation, manipulation, business day calculations |
| **Strings** | `string-utils.js` | 10 | Text processing, case conversion, slugify, truncate |
| **Data** | `data-utils.js` | 8 | Base64, UUID, object flattening, query string utilities |
| **Geolocation** | `geolocation.js` | 5 | ZIP lookup, distance, state code validation |
| **Files** | `file-utils.js` | 5 | File type, extension, size validation and formatting |

### Server-Side: 6 Submit Actions

| Submit Action | Description |
|---|---|
| `CustomRulesFormSubmitAction` | JSON/XML parsing, server-side validation, reCAPTCHA, workflow trigger |
| `SaveToDAMSubmitAction` | Store form file attachments to AEM DAM with metadata |
| `SendEmailSubmitAction` | Send email notification on form submission |
| `AuditLogSubmitAction` | Write structured audit trail entries to JCR |

### Server-Side: 6 Backend Servlets

| Servlet | Endpoint | Description |
|---|---|---|
| `ZipCodeLookupServlet` | `/bin/rules-api/zip-lookup` | US ZIP code to city/state lookup |
| `AddressValidationServlet` | `/bin/rules-api/validate-address` | US address validation and standardization |
| `CurrencyConversionServlet` | `/bin/rules-api/currency-convert` | Multi-currency conversion (10 currencies) |
| `TaxCalculationServlet` | `/bin/rules-api/calculate-tax` | US state sales tax calculation (50 states + DC) |

### Server-Side: 2 Prefill Services

| Service | Description |
|---|---|
| `CustomFormsPrefillService` | Dynamic form prepopulation from backend repositories |
| `UserProfilePrefillService` | Prefill from Sling user profile properties |

---

## Quick Start

### Prerequisites
- AEM as a Cloud Service (or AEM 6.5 with Forms add-on)
- Java 11+
- Maven 3.3.9+
- Node.js v16.17+ / npm 8.15+

### Build & Deploy
```bash
mvn clean install                                    # Build + unit tests
mvn clean install -PautoInstallSinglePackage          # Deploy to author (4502)
mvn clean install -PautoInstallSinglePackagePublish   # Deploy to publish (4503)
```

### Load Custom Functions in a Form
1. Open the form in Authoring editor
2. Select the **Adaptive Form Container** component
3. Add `aem-forms-rules-editor.customfunctions` to the **Client Library Category** field
4. All 90+ functions are now available in the Rules Editor dropdown

---

## Function Reference

### Validation (`validation.js` — 25 functions)

#### US Identity
| Function | Input | Returns | Description |
|---|---|---|---|
| `validateSSN` | `string` | `boolean` | US SSN with SSA allocation rules (rejects 000, 666, 900+) |
| `validateEIN` | `string` | `boolean` | US Employer Identification Number (XX-XXXXXXX) |
| `validateITIN` | `string` | `boolean` | US Individual Taxpayer ID (9XX-XX-XXXX with valid ranges) |
| `validateUSPassport` | `string` | `boolean` | US passport number (9 digits or 1 letter + 8 digits) |
| `validateDriverLicense` | `string` | `boolean` | Basic US DL format (6-14 alphanumeric chars) |

#### US Contact
| Function | Input | Returns | Description |
|---|---|---|---|
| `validateEmail` | `string` | `boolean` | Email format validation |
| `validateUSPhone` | `string` | `boolean` | 10-digit US phone (with optional +1) |
| `validateUSZip` | `string` | `boolean` | 5-digit or ZIP+4 format |
| `validateUSState` | `string` | `boolean` | Valid 2-letter state code (50 states + DC + territories) |

#### Network
| Function | Input | Returns | Description |
|---|---|---|---|
| `validateURL` | `string` | `boolean` | URL with http/https protocol |
| `validateIPv4` | `string` | `boolean` | IPv4 address (0-255 per octet) |
| `validateIPv6` | `string` | `boolean` | IPv6 address (full and compressed notation) |
| `validateMACAddress` | `string` | `boolean` | MAC address (XX:XX:XX:XX:XX:XX) |

#### Format
| Function | Input | Returns | Description |
|---|---|---|---|
| `validateCreditCardLuhn` | `string` | `boolean` | Credit card with Luhn algorithm check |
| `validateStrongPassword` | `string` | `boolean` | 8+ chars, upper, lower, digit, special char |
| `validateJSON` | `string` | `boolean` | Valid JSON string |
| `validateRegexPattern` | `string, string` | `boolean` | Generic regex match (value, pattern) |

#### International
| Function | Input | Returns | Description |
|---|---|---|---|
| `validateUKPostCode` | `string` | `boolean` | UK postal codes (SW1A 1AA format) |
| `validateUKPhone` | `string` | `boolean` | UK phone numbers (+44 and 0 prefix) |
| `validateCanadianSIN` | `string` | `boolean` | Canadian Social Insurance Number (Luhn) |
| `validateCanadianPostalCode` | `string` | `boolean` | A1A 1A1 format |
| `validateIBAN` | `string` | `boolean` | International Bank Account Number (mod-97 check) |
| `validateEUPhone` | `string` | `boolean` | EU phone number formats (7-15 digits) |
| `validateAustralianPhone` | `string` | `boolean` | Australian phone numbers |
| `validateAustralianPostCode` | `string` | `boolean` | 4-digit Australian postal codes |

### Formatting (`formatting.js` — 15 functions)

| Function | Input | Returns | Description |
|---|---|---|---|
| `formatPhoneNumber` | `string` | `string` | US to `(XXX) XXX-XXXX` |
| `formatPhoneNumberInternational` | `string, string` | `string` | E.164 format (+1XXXXXXXXXX) |
| `formatSSN` | `string, boolean` | `string` | Display (XXX-XX-XXXX) or mask (***) |
| `formatCreditCard` | `string` | `string` | Add spaces every 4 digits |
| `maskCreditCard` | `string` | `string` | Show only last 4 digits |
| `formatCurrency` | `number, string` | `string` | `$1,234.56` (supports any currency symbol) |
| `formatDate` | `string, string` | `string` | Pattern-based: MM/DD/YYYY, DD/MM/YYYY, Month DD, YYYY |
| `formatDateISO` | `string` | `string` | Always YYYY-MM-DD |
| `formatNameTitleCase` | `string` | `string` | "john doe" -> "John Doe" |
| `formatNameUpperCase` | `string` | `string` | "john doe" -> "JOHN DOE" |
| `formatZipCodePlus4` | `string` | `string` | Format as XXXXX-XXXX |
| `formatCanadianSIN` | `string` | `string` | XXX-XXX-XXX |
| `formatIBAN` | `string` | `string` | Add spaces every 4 chars |
| `formatNumberWithCommas` | `number` | `string` | 1000000 -> "1,000,000.00" |
| `formatDecimalPlaces` | `number, number` | `string` | Round to N decimal places |

### Financial (`financial.js` — 12 functions)

| Function | Input | Returns | Description |
|---|---|---|---|
| `calculateMonthlyPayment` | `P, r, t` | `number` | Loan monthly payment (amortization formula) |
| `calculateCompoundInterest` | `P, r, n, t` | `number` | A = P(1 + r/n)^(nt) |
| `calculateSimpleInterest` | `P, r, t` | `number` | I = Prt |
| `calculateTotalCost` | `principal, payment, term` | `number` | Total payment amount |
| `calculateLoanPayoffDate` | `date, P, r, payment` | `string` | ISO date when loan is paid off |
| `calculateAPR` | `loan, payment, term` | `number` | APR from payment schedule (Newton's method) |
| `calculateTip` | `amount, percent, split` | `object` | `{tip, total, perPerson}` |
| `calculateSalesTax` | `amount, rate` | `number` | Tax amount from rate |
| `calculateDiscount` | `price, discount, type` | `object` | `{finalPrice, savings, discountAmount}` |
| `calculateROI` | `gain, cost` | `number` | ROI percentage |
| `calculateDepreciation` | `cost, salvage, life` | `number` | Annual straight-line depreciation |
| `calculateAmortization` | `P, r, t` | `array` | Monthly payment schedule array |

### Date/Time (`date-utils.js` — 12 functions)

| Function | Input | Returns | Description |
|---|---|---|---|
| `isPastDate` | `string` | `boolean` | Date is before today |
| `isFutureDate` | `string` | `boolean` | Date is after today |
| `isWeekend` | `string` | `boolean` | Saturday or Sunday |
| `isBusinessDay` | `string` | `boolean` | Not weekend, not US holiday |
| `addDays` | `string, number` | `string` | Add N days to date |
| `addMonths` | `string, number` | `string` | Add N months to date |
| `daysBetween` | `string, string` | `number` | Calendar days between dates |
| `businessDaysBetween` | `string, string` | `number` | Business days (excl. weekends + holidays) |
| `getFirstDayOfMonth` | `string` | `string` | First day of month |
| `getLastDayOfMonth` | `string` | `string` | Last day of month |
| `formatDateRelative` | `string` | `string` | "3 days ago", "in 2 weeks" |
| `calculateAge` | `string` | `number` | Age in years from birthdate |

### String Utilities (`string-utils.js` — 10 functions)

| Function | Input | Returns | Description |
|---|---|---|---|
| `slugify` | `string` | `string` | "Hello World!" -> "hello-world" |
| `truncateText` | `string, number` | `string` | Truncate with "..." ellipsis |
| `capitalize` | `string` | `string` | First letter uppercase |
| `titleCase` | `string` | `string` | Each word capitalized |
| `camelCase` | `string` | `string` | "hello world" -> "helloWorld" |
| `snakeCase` | `string` | `string` | "hello world" -> "hello_world" |
| `stripHTML` | `string` | `string` | Remove all HTML tags |
| `countWords` | `string` | `number` | Word count |
| `removeExtraWhitespace` | `string` | `string` | Collapse multiple spaces |
| `extractNumbers` | `string` | `string` | Extract all numeric characters |

### Data Utilities (`data-utils.js` — 8 functions)

| Function | Input | Returns | Description |
|---|---|---|---|
| `toBase64` | `string` | `string` | Encode to Base64 |
| `fromBase64` | `string` | `string` | Decode from Base64 |
| `generateUUID` | none | `string` | UUID v4 |
| `generateRandomString` | `number` | `string` | Alphanumeric random |
| `deepCloneObject` | `object` | `object` | Deep clone |
| `flattenObject` | `object` | `object` | Dot-notation flattening |
| `objectToQueryString` | `object` | `string` | Object to URL query string |
| `queryStringToObject` | `string` | `object` | Query string to object |

### Geolocation (`geolocation.js` — 5 functions)

| Function | Input | Returns | Description |
|---|---|---|---|
| `fetchLocationByZip` | `string` | `Promise` | External API lookup (zippopotam.us) |
| `lookupZipCodeBackend` | `string` | `Promise` | AEM servlet lookup |
| `calculateDistance` | `lat1, lon1, lat2, lon2` | `number` | Haversine distance in miles |
| `validateUSStateCode` | `string` | `boolean` | Valid state code |
| `getStateName` | `string` | `string` | "CA" -> "California" |

### File Utilities (`file-utils.js` — 5 functions)

| Function | Input | Returns | Description |
|---|---|---|---|
| `validateFileType` | `string, string` | `boolean` | File extension against allowed list |
| `getFileExtension` | `string` | `string` | Extract extension |
| `formatFileSize` | `number` | `string` | Bytes to "1.5 MB" |
| `isImageFile` | `string` | `boolean` | Check if image type |
| `isPDFFile` | `string` | `boolean` | Check if PDF |

---

## Project Structure

```
aem-forms-rules-editor/
  core/                                  # Java OSGi bundle
    src/main/java/.../
      submit/
        CustomRulesFormSubmitAction.java  # JSON/XML submit with validation
        SaveToDAMSubmitAction.java        # Store attachments to DAM
        SendEmailSubmitAction.java        # Email notification
        AuditLogSubmitAction.java         # Structured audit trail
      prefill/
        CustomFormsPrefillService.java    # Backend repository prefill
        UserProfilePrefillService.java    # User profile prefill
      servlets/
        ZipCodeLookupServlet.java         # ZIP code lookup
        AddressValidationServlet.java     # US address validation
        CurrencyConversionServlet.java    # Currency conversion
        TaxCalculationServlet.java        # US state tax calculation
    src/test/java/.../                    # Unit tests for all components
  ui.apps/.../clientlib-custom-functions/
    js.txt                                # Load order for all 8 category files
    js/
      custom-functions.js                 # Namespace initialization
      validation.js                       # 25 validation functions
      formatting.js                       # 15 formatting functions
      financial.js                        # 12 financial calculations
      date-utils.js                       # 12 date/time functions
      string-utils.js                     # 10 string utilities
      data-utils.js                       # 8 data transformation functions
      geolocation.js                      # 5 geolocation functions
      file-utils.js                       # 5 file utility functions
  ui.content/                             # Themes, FDMs, templates
  ui.frontend/                            # Webpack build
```

---

## Documentation

- [AEM_FORMS_RULES_EDITOR.md](AEM_FORMS_RULES_EDITOR.md) — detailed architecture and API reference
- Module-level READMEs in each subdirectory

## License

See [LICENSE](LICENSE).
