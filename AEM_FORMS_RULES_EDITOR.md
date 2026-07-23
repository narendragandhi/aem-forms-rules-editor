# AEM Forms Rules Editor — Library Guide

A production-ready rules library for AEM Forms — covering both **Adaptive Forms (AFv2) Core Components** and **Interactive Communication (IC) Fragments with XFA scripting**. **69 client-side JavaScript functions** (53 AFv2 + 16 XFA IC), **4 Submit Actions**, **4 Servlets**, and **2 Prefill Services**.

Every function contains real logic — no thin wrappers.

---

## Architecture

```
                    ┌───────────────────────────────┐
                    │     AEM Forms Rules Editor    │
                    └───────────────┬───────────────┘
                                    │ JSDoc @name annotations
                                    ▼
┌───────────────────────────────────┐       ┌───────────────────────────────────┐
│   Client-Side: 69 Functions       │       │      Server-Side Extensions       │
│                                    │       │   • 4 Submit Actions              │
│   AFv2 (53):                      │       │   • 4 Backend Servlets            │
│   • validation.js     (7)         │       │   • 2 Prefill Services            │
│   • formatting.js    (10)         │       │                                   │
│   • financial.js      (8)         │       │                                   │
│   • date-utils.js    (11)         │       │                                   │
│   • string-utils.js   (3)         │       │                                   │
│   • data-utils.js     (5)         │       │                                   │
│   • geolocation.js    (5)         │       │                                   │
│   • file-utils.js     (4)         │       │                                   │
│                                    │       │                                   │
│   XFA IC (16):                    │       │                                   │
│   • xfa-form.js       (2)         │       │                                   │
│   • xfa-instance.js   (2)         │       │                                   │
│   • xfa-layout.js     (2)         │       │                                   │
│   • xfa-formcalc.js   (9)         │       │                                   │
│   • xfa-acrobat.js    (1)         │       │                                   │
└───────────────────────────────────┘       └───────────────────────────────────┘
```

---

## 1. AFv2 Client-Side Functions

### Loading
1. Select the **Adaptive Form Container** component
2. Add `aem-forms-rules-editor.customfunctions` to **Client Library Category**
3. All 53 functions appear in the Rules Editor dropdown

### 1.1 Validation (`validation.js` — 7)

**`validateSSN(ssn)`** — SSA allocation rules (rejects 000, 666, 900+, group 00, serial 0000)
**`validateEIN(ein)`** — IRS prefix ranges
**`validateITIN(itin)`** — Middle digit ranges (70-88, 90-92, 94-99)
**`validateIPv6(ip)`** — 9 regex patterns covering full, compressed, and mixed notation
**`validateCreditCardLuhn(cardNumber)`** — Full Luhn algorithm
**`validateCanadianSIN(sin)`** — Luhn algorithm for Canadian SIN
**`validateIBAN(iban)`** — Format validation + mod-97 checksum with letter→number conversion

### 1.2 Formatting (`formatting.js` — 10)

**`formatPhoneNumber(phone)`** — `(XXX) XXX-XXXX`
**`formatPhoneNumberInternational(phone, countryCode)`** — E.164 format
**`formatSSN(ssn, mask)`** — Display or mask (***)SS-SSSS
**`formatCreditCard(cardNumber)`** — Spaces every 4 digits
**`maskCreditCard(cardNumber)`** — Last 4 digits visible
**`formatCurrency(amount, symbol)`** — $1,234.56
**`formatDate(dateString, pattern)`** — MM/DD/YYYY, DD/MM/YYYY, Month DD, YYYY, etc.
**`formatDateISO(dateString)`** — Always YYYY-MM-DD
**`formatZipCodePlus4(zip)`** — XXXXX-XXXX
**`formatNumberWithCommas(num)`** — 1,000,000.00

### 1.3 Financial (`financial.js` — 8)

**`calculateMonthlyPayment(P, r, t)`** — Amortization formula: P*r/(1-(1+r)^-n)
**`calculateCompoundInterest(P, r, n, t)`** — A = P(1 + r/n)^(nt)
**`calculateSimpleInterest(P, r, t)`** — I = Prt
**`calculateLoanPayoffDate(startDate, P, r, payment)`** — Iterative amortization loop with 50-year cap
**`calculateAPR(loan, payment, term)`** — Newton's method / bisection root-finding
**`calculateTip(amount, percent, split)`** — `{tip, total, perPerson}`
**`calculateDiscount(price, discount, type)`** — Percent vs fixed branching
**`calculateAmortization(P, r, t)`** — Full monthly payment schedule array

### 1.4 Date/Time (`date-utils.js` — 11)

**`isPastDate`** / **`isFutureDate`** — ISO date comparison
**`isBusinessDay`** — Weekend + US holiday check (8 holidays including computed ones: MLK, Presidents, Memorial, Thanksgiving)
**`addDays`** / **`addMonths`** — Date arithmetic with ISO reformatting
**`daysBetween`** / **`businessDaysBetween`** — Calendar and business day counts
**`getLastDayOfMonth`** — `Date(year, month+1, 0)` trick
**`formatDateRelative`** — "3 days ago", "in 2 weeks", "yesterday"
**`calculateAge`** — Year/month/day difference logic
**`isDateInRange`** — Range comparison with parseDate on 3 args

### 1.5 Strings (`string-utils.js` — 3)

**`slugify(text)`** — Multi-pass regex slug transformation
**`camelCase(text)`** — Non-word-boundary regex transformation
**`snakeCase(text)`** — camelCase→snake_case transform

### 1.6 Data (`data-utils.js` — 5)

**`generateUUID()`** — UUID v4 with bit manipulation
**`generateRandomString(length)`** — Configurable length
**`flattenObject(obj)`** — Recursive nested-object flattening to dot notation
**`objectToQueryString(obj)`** / **`queryStringToObject(qs)`** — URL encoding/decoding

### 1.7 Geolocation (`geolocation.js` — 5)

**`fetchLocationByZip(zip)`** — Real external API (zippopotam.us)
**`lookupZipCodeBackend(zip)`** — AEM servlet call
**`calculateDistance(lat1, lon1, lat2, lon2)`** — Full Haversine formula
**`validateUSStateCode(state)`** / **`getStateName(code)`** — 58-entry US states database

### 1.8 Files (`file-utils.js` — 4)

**`validateFileType(fileName, allowed)`** — Extension against allowed list
**`formatFileSize(bytes)`** — Logarithmic unit-scaled formatting
**`isImageFile(fileName)`** — 9 image extensions
**`isPDFFile(fileName)`** — PDF check

---

## 2. XFA IC Fragment Functions (16)

These functions are for the **IC Fragment code editor** and wrap XFA APIs defensively. Use them in XFA script blocks, not in the AFv2 Rules Editor.

### 2.1 XFA Form (`xfa-form.js` — 2)

**`resolveNodes(somPath)`** — Converts XFA `XMLNodesCollection` to a real JavaScript array via iteration. Essential for looping over multiple fields.
**`getInvalidFields()`** — Iterates all fields, calls `.validate()`, collects SOM path, name, and error message for each failing field.

### 2.2 XFA Instances (`xfa-instance.js` — 2)

**`getLastInstanceField(instanceManagerSom, fieldName)`** — Resolves the last instance via `count-1`, then resolves a nested field within it. Useful for reading the most recently added row.
**`clearAllInstances(somExpression)`** — Reverse loop removing instances from end to 1. Resets a repeated element to a single instance while preserving the template.

### 2.3 XFA Layout (`xfa-layout.js` — 2)

**`getFieldPageNumber(fieldName)`** — Walks the parent chain looking for `parent.page.index`. Returns 0-based page number.
**`centerFieldHorizontally(fieldName)`** — Geometry calculation: `(parentBounds.w - fieldBounds.w) / 2`. Sets `bounds.x` to center the field within its parent.

### 2.4 FormCalc Utilities (`xfa-formcalc.js` — 9)

**`xfaAvg(values)`** — Array iteration with NaN-skip coercion
**`xfaRound(value, places)`** — Handles negative places, factor math
**`xfaMin(values)`** / **`xfaMax(values)`** — Array iteration with NaN filtering and Infinity seed
**`xfaSum(values)`** — Array iteration with NaN-skip accumulation
**`xfaDateNow()`** — Manual YYYYMMDD formatting (no Intl API)
**`xfaTimeNow()`** — Manual HHMMSS formatting
**`xfaDateToNum(dateStr)`** — Dual-format parser (MM/DD/YYYY or YYYYMMDD) + FormCalc epoch math
**`xfaNumToDate(num)`** — Epoch reversal + MM/DD/YYYY formatting

### 2.5 Acrobat API (`xfa-acrobat.js` — 1)

**`acrobatBeep(cAlertType)`** — Wraps `app.beep()` with a full Web Audio API fallback for HTML5 environments.

---

## 3. Server-Side Submit Actions

- **CustomRulesFormSubmitAction** — JSON + XML parsing, server-side validation (email, SSN, ZIP, credit card), dummy SSN detection, XXE prevention, reCAPTCHA stub, Granite Workflow trigger
- **SaveToDAMSubmitAction** — Stores form attachments to AEM DAM with metadata
- **SendEmailSubmitAction** — Email notification on submission (AEM GenericMessage pattern)
- **AuditLogSubmitAction** — Structured audit trail under `/content/audit/form-submissions`

## 4. Server-Side Servlets

| Servlet | Endpoint | Features |
|---|---|---|
| `ZipCodeLookupServlet` | `/bin/rules-api/zip-lookup` | Mock DB, ZIP+4, validation |
| `AddressValidationServlet` | `/bin/rules-api/validate-address` | State/ZIP range validation |
| `CurrencyConversionServlet` | `/bin/rules-api/currency-convert` | 10 currencies |
| `TaxCalculationServlet` | `/bin/rules-api/calculate-tax` | 50 states + DC |

## 5. Prefill Services

**`CustomFormsPrefillService`** — Dynamic prefill from backend repositories
**`UserProfilePrefillService`** — Prefill from Sling user profile

## 6. Testing

```bash
mvn clean test
```

10 test classes covering all server-side components.

## 7. Build & Deploy

```bash
mvn clean install
mvn clean install -PautoInstallSinglePackage
mvn clean install -PautoInstallSinglePackagePublish
```

---

## License

See [LICENSE](LICENSE).
