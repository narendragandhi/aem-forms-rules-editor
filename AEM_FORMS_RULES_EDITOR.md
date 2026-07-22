# AEM Forms Rules Editor — Comprehensive Library Guide

This repository is a **production-ready, comprehensive rules library** for AEM Forms Adaptive Forms (AFv2) Core Components. It provides **90+ client-side JavaScript functions** across 8 categories, **6 server-side OSGi Submit Actions**, **6 backend proxy Servlets**, and **2 Prefill Services** — all designed for the AEM Forms Rules Editor.

---

## Architecture Overview

```
                    ┌───────────────────────────────┐
                    │     AEM Forms Rules Editor    │
                    │      (Visual Rule Builder)     │
                    └───────────────┬───────────────┘
                                    │ JSDoc annotations
                                    ▼
┌───────────────────────────────────┐       ┌───────────────────────────────────┐
│     Client-Side: 90+ Functions    │       │      Server-Side Extensions       │
│   Organized in 8 category files   │       │                                   │
│                                    │       │   • 4 Submit Actions              │
│   • validation.js    (25 funcs)   │       │   • 6 Backend Servlets            │
│   • formatting.js    (15 funcs)   │       │   • 2 Prefill Services            │
│   • financial.js     (12 funcs)   │       │                                   │
│   • date-utils.js    (12 funcs)   │       │                                   │
│   • string-utils.js  (10 funcs)   │       │                                   │
│   • data-utils.js     (8 funcs)   │       │                                   │
│   • geolocation.js    (5 funcs)   │       │                                   │
│   • file-utils.js     (5 funcs)   │       │                                   │
└───────────────────────────────────┘       └───────────────────────────────────┘
```

---

## 1. Client-Side JavaScript Functions

### Loading in an Adaptive Form

1. Open the form in the Authoring editor
2. Select the **Adaptive Form Container** component
3. Add `aem-forms-rules-editor.customfunctions` to the **Client Library Category** field
4. All functions appear in the Rules Editor dropdown, categorized by JSDoc `@name`

### Category Files

Functions are loaded via `js.txt`:
```
#base=js
validation.js
formatting.js
financial.js
date-utils.js
string-utils.js
data-utils.js
geolocation.js
file-utils.js
```

---

### 1.1 Validation Functions (`validation.js` — 25 functions)

#### US Identity Validators

**`validateSSN(ssn)`** — US Social Security Number
- Normalizes input (strips spaces/dashes)
- Rejects area 000, 666, 900+
- Rejects group 00, serial 0000

**`validateEIN(ein)`** — US Employer Identification Number
- Format: XX-XXXXXXX
- Validates prefix ranges per IRS rules

**`validateITIN(itin)`** — US Individual Taxpayer ID
- Format: 9XX-XX-XXXX
- Validates middle digit ranges (70-88, 90-92, 94-99)

**`validateUSPassport(passport)`** — US passport number
- 9 digits or 1 letter + 8 digits

**`validateDriverLicense(dl)`** — Basic US driver's license
- 6-14 alphanumeric characters

#### US Contact Validators

**`validateEmail(email)`** — Email format validation

**`validateUSPhone(phone)`** — 10-digit US phone
- Handles optional +1 country code
- Rejects area codes below 200

**`validateUSZip(zip)`** — 5-digit or ZIP+4

**`validateUSState(state)`** — 2-letter state code
- All 50 states + DC + territories

#### Network Validators

**`validateURL(url)`** — URL with http/https protocol

**`validateIPv4(ip)`** — IPv4 (0-255 per octet)

**`validateIPv6(ip)`** — Full and compressed notation

**`validateMACAddress(mac)`** — XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX

#### Format Validators

**`validateCreditCardLuhn(cardNumber)`** — Luhn algorithm check

**`validateStrongPassword(password)`** — 8+ chars, upper, lower, digit, special

**`validateJSON(jsonStr)`** — Valid JSON

**`validateRegexPattern(value, pattern)`** — Generic regex match

#### International Validators

**`validateUKPostCode(postcode)`** — SW1A 1AA format

**`validateUKPhone(phone)`** — +44 and 0 prefix formats

**`validateCanadianSIN(sin)`** — Luhn algorithm check

**`validateCanadianPostalCode(postalCode)`** — A1A 1A1 format

**`validateIBAN(iban)`** — Mod-97 checksum validation

**`validateEUPhone(phone)`** — 7-15 digits

**`validateAustralianPhone(phone)`** — Australian format

**`validateAustralianPostCode(postcode)`** — 4-digit (200-9999)

---

### 1.2 Formatting Functions (`formatting.js` — 15 functions)

**`formatPhoneNumber(phone)`** — `(XXX) XXX-XXXX`
**`formatPhoneNumberInternational(phone, countryCode)`** — E.164 format
**`formatSSN(ssn, mask)`** — Display or mask (***)SS-SSSS
**`formatCreditCard(cardNumber)`** — Spaces every 4 digits
**`maskCreditCard(cardNumber)`** — Last 4 digits visible
**`formatCurrency(amount, symbol)`** — $1,234.56
**`formatDate(dateString, pattern)`** — MM/DD/YYYY, DD/MM/YYYY, Month DD, YYYY, etc.
**`formatDateISO(dateString)`** — Always YYYY-MM-DD
**`formatNameTitleCase(text)`** — "john doe" -> "John Doe"
**`formatNameUpperCase(text)`** — "john doe" -> "JOHN DOE"
**`formatZipCodePlus4(zip)`** — XXXXX-XXXX
**`formatCanadianSIN(sin)`** — XXX-XXX-XXX
**`formatIBAN(iban)`** — Spaces every 4 chars
**`formatNumberWithCommas(num)`** — 1,000,000.00
**`formatDecimalPlaces(num, places)`** — N decimal places

---

### 1.3 Financial Functions (`financial.js` — 12 functions)

**`calculateMonthlyPayment(principal, annualRate, termMonths)`** — Amortization formula
**`calculateCompoundInterest(P, r, n, t)`** — A = P(1 + r/n)^(nt)
**`calculateSimpleInterest(P, r, t)`** — I = Prt
**`calculateTotalCost(principal, payment, term)`** — Total payment
**`calculateLoanPayoffDate(startDate, P, r, payment)`** — ISO payoff date
**`calculateAPR(loan, payment, term)`** — Newton's method APR calculation
**`calculateTip(amount, percent, split)`** — `{tip, total, perPerson}`
**`calculateSalesTax(amount, rate)`** — Tax amount
**`calculateDiscount(price, discount, type)`** — `{finalPrice, savings, discountAmount}`
**`calculateROI(gain, cost)`** — ROI percentage
**`calculateDepreciation(cost, salvage, life)`** — Annual straight-line
**`calculateAmortization(P, r, t)`** — Full monthly schedule array

---

### 1.4 Date/Time Functions (`date-utils.js` — 12 functions)

**`isPastDate(dateString)`** / **`isFutureDate(dateString)`**
**`isWeekend(dateString)`** / **`isBusinessDay(dateString)`**
**`addDays(dateString, n)`** / **`addMonths(dateString, n)`**
**`daysBetween(start, end)`** / **`businessDaysBetween(start, end)`**
**`getFirstDayOfMonth(dateString)`** / **`getLastDayOfMonth(dateString)`**
**`formatDateRelative(dateString)`** — "3 days ago", "in 2 weeks"
**`calculateAge(birthDateString)`** — Age in years

Business day calculations include US holidays (New Year's, Independence Day, Christmas, MLK Day, Presidents Day, Memorial Day, Labor Day, Thanksgiving).

---

### 1.5 String Utilities (`string-utils.js` — 10 functions)

**`slugify(text)`** — URL-safe slug
**`truncateText(text, max, suffix)`** — Truncate with ellipsis
**`capitalize(text)`** / **`titleCase(text)`** / **`camelCase(text)`** / **`snakeCase(text)`**
**`stripHTML(html)`** — Remove all tags
**`countWords(text)`** — Word count
**`removeExtraWhitespace(text)`** — Normalize spaces
**`extractNumbers(text)`** — Extract digits

---

### 1.6 Data Utilities (`data-utils.js` — 8 functions)

**`toBase64(text)`** / **`fromBase64(encoded)`**
**`generateUUID()`** — UUID v4
**`generateRandomString(length)`**
**`deepCloneObject(obj)`** / **`flattenObject(obj)`**
**`objectToQueryString(obj)`** / **`queryStringToObject(qs)`**

---

### 1.7 Geolocation (`geolocation.js` — 5 functions)

**`fetchLocationByZip(zip)`** — External API (zippopotam.us)
**`lookupZipCodeBackend(zip)`** — AEM servlet lookup
**`calculateDistance(lat1, lon1, lat2, lon2)`** — Haversine miles
**`validateUSStateCode(state)`** / **`getStateName(code)`** — Full state database

---

### 1.8 File Utilities (`file-utils.js` — 5 functions)

**`validateFileType(fileName, allowed)`** — Extension against allowed list
**`getFileExtension(fileName)`** — Extract extension
**`formatFileSize(bytes)`** — "1.5 MB"
**`isImageFile(fileName)`** / **`isPDFFile(fileName)`**

---

## 2. Server-Side Submit Actions

### 2.1 CustomRulesFormSubmitAction
- **Path:** `core/.../submit/CustomRulesFormSubmitAction.java`
- JSON + XML parsing (AFv2 nested data support)
- Server-side field validation (email, SSN, ZIP, credit card)
- Dummy SSN detection, XXE prevention, reCAPTCHA stub
- File attachment processing, Granite Workflow trigger
- Log injection prevention

### 2.2 SaveToDAMSubmitAction
- **Path:** `core/.../submit/SaveToDAMSubmitAction.java`
- Stores form file attachments to AEM DAM
- Creates asset nodes with form metadata
- Configurable DAM path

### 2.3 SendEmailSubmitAction
- **Path:** `core/.../submit/SendEmailSubmitAction.java`
- Email notification on form submission
- Uses AEM GenericMessage pattern

### 2.4 AuditLogSubmitAction
- **Path:** `core/.../submit/AuditLogSubmitAction.java`
- Structured audit trail under `/content/audit/form-submissions`
- Stores form path, timestamp, data preview, attachment count

---

## 3. Server-Side Servlets

| Servlet | Endpoint | Features |
|---|---|---|
| `ZipCodeLookupServlet` | `/bin/rules-api/zip-lookup` | Mock DB, ZIP+4, validation |
| `AddressValidationServlet` | `/bin/rules-api/validate-address` | State/ZIP range validation, standardization |
| `CurrencyConversionServlet` | `/bin/rules-api/currency-convert` | 10 currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN) |
| `TaxCalculationServlet` | `/bin/rules-api/calculate-tax` | 50 states + DC, combined state+local rates |

---

## 4. Server-Side Prefill Services

**`CustomFormsPrefillService`** — Dynamic prefill from backend repositories
**`UserProfilePrefillService`** — Prefill from Sling user profile (givenName, familyName, email, etc.)

---

## 5. Testing

### Unit Tests
```bash
mvn clean test
```

| Test Class | Tests |
|---|---|
| `CustomRulesFormSubmitActionTest` | 12 tests: JSON, XML, AFv2, validation, XXE |
| `SaveToDAMSubmitActionTest` | 3 tests: no attachments, empty, service name |
| `SendEmailSubmitActionTest` | 4 tests: empty, null, success, service name |
| `AuditLogSubmitActionTest` | 2 tests: service name, missing resolver |
| `AddressValidationServletTest` | 4 tests: valid, missing fields, invalid state, invalid ZIP |
| `CurrencyConversionServletTest` | 5 tests: USD-EUR, GBP-INR, missing, invalid, unsupported |
| `TaxCalculationServletTest` | 5 tests: CA, TX, OR (no tax), missing, invalid state |
| `CustomFormsPrefillServiceTest` | 3 tests: metadata, default user, custom user |
| `UserProfilePrefillServiceTest` | 3 tests: metadata, default user, with extras |
| `ZipCodeLookupServletTest` | 6 tests: 5-digit, ZIP+4, invalid, too short, not found, null |

---

## 6. Build & Deploy

```bash
# Full build + unit tests
mvn clean install

# Deploy to local AEM author
mvn clean install -PautoInstallSinglePackage

# Deploy to publish
mvn clean install -PautoInstallSinglePackagePublish

# Deploy bundle only
mvn clean install -PautoInstallBundle
```

---

## License

See [LICENSE](LICENSE).
