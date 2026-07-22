# AEM Forms Rules Editor — Comprehensive Library Guide

This repository is a **production-ready, comprehensive rules library** for AEM Forms — covering both **Adaptive Forms (AFv2) Core Components** and **Interactive Communication (IC) Fragments with XFA scripting**. It provides **176 client-side JavaScript functions** (94 AFv2 + 82 XFA IC), **4 server-side OSGi Submit Actions**, **4 backend proxy Servlets**, and **2 Prefill Services** — all designed for the AEM Forms Rules Editor.

---

## Architecture Overview

```
                    ┌───────────────────────────────┐
                    │     AEM Forms Rules Editor    │
                    │      (Visual Rule Builder)     │
                    └───────────────┬───────────────┘
                                    │ JSDoc @name annotations
                                    ▼
┌───────────────────────────────────┐       ┌───────────────────────────────────┐
│   Client-Side: 176 Functions      │       │      Server-Side Extensions       │
│  Organized in 16 category files   │       │                                   │
│                                    │       │   • 4 Submit Actions              │
│   AFv2 (94):                      │       │   • 4 Backend Servlets            │
│   • validation.js    (25)         │       │   • 2 Prefill Services            │
│   • formatting.js    (15)         │       │                                   │
│   • financial.js     (12)         │       │                                   │
│   • date-utils.js    (14)         │       │                                   │
│   • string-utils.js  (10)         │       │                                   │
│   • data-utils.js     (8)         │       │                                   │
│   • geolocation.js    (5)         │       │                                   │
│   • file-utils.js     (5)         │       │                                   │
│                                    │       │                                   │
│   XFA IC (82):                    │       │                                   │
│   • xfa-host.js       (12)        │       │                                   │
│   • xfa-event.js      (10)        │       │                                   │
│   • xfa-form.js       (10)        │       │                                   │
│   • xfa-field.js      (12)        │       │                                   │
│   • xfa-instance.js    (8)        │       │                                   │
│   • xfa-layout.js      (7)        │       │                                   │
│   • xfa-formcalc.js   (15)        │       │                                   │
│   • xfa-acrobat.js     (8)        │       │                                   │
└───────────────────────────────────┘       └───────────────────────────────────┘
```

---

## 1. Client-Side JavaScript Functions

### Loading in an Adaptive Form

1. Open the form in the Authoring editor
2. Select the **Adaptive Form Container** component
3. Add `aem-forms-rules-editor.customfunctions` to the **Client Library Category** field
4. All 176 functions appear in the Rules Editor dropdown, categorized by JSDoc `@name`

### Loading in an IC Fragment

IC Fragments use XFA scripting directly. The XFA functions (`xfa-host.js`, `xfa-event.js`, etc.) are designed for the **IC Fragment code editor** and use `xfa.*` objects rather than `guideBridge`.

### Category Files

Functions are loaded via `js.txt`:
```
#base=js
custom-functions.js          # Namespace initialization (must load first)
validation.js                # 25 AFv2 validation
formatting.js                # 15 AFv2 formatting
financial.js                 # 12 AFv2 financial
date-utils.js                # 14 AFv2 date/time
string-utils.js              # 10 AFv2 strings
data-utils.js                 # 8 AFv2 data
geolocation.js               # 5 AFv2 geolocation
file-utils.js                # 5 AFv2 files
xfa-host.js                  # 12 XFA host
xfa-event.js                 # 10 XFA events
xfa-form.js                  # 10 XFA form DOM
xfa-field.js                 # 12 XFA field ops
xfa-instance.js              # 8 XFA instance mgmt
xfa-layout.js                # 7 XFA layout/positioning
xfa-formcalc.js              # 15 FormCalc equivalents
xfa-acrobat.js               # 8 Acrobat API wrappers
```

---

### 1.1 AFv2 Validation Functions (`validation.js` — 25 functions)

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

### 1.2 AFv2 Formatting Functions (`formatting.js` — 15 functions)

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

### 1.3 AFv2 Financial Functions (`financial.js` — 12 functions)

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

### 1.4 AFv2 Date/Time Functions (`date-utils.js` — 14 functions)

**`isPastDate(dateString)`** / **`isFutureDate(dateString)`**
**`isWeekend(dateString)`** / **`isBusinessDay(dateString)`**
**`addDays(dateString, n)`** / **`addMonths(dateString, n)`**
**`daysBetween(start, end)`** / **`businessDaysBetween(start, end)`**
**`getFirstDayOfMonth(dateString)`** / **`getLastDayOfMonth(dateString)`**
**`formatDateRelative(dateString)`** — "3 days ago", "in 2 weeks"
**`calculateAge(birthDateString)`** — Age in years
**`isLeapYear(dateString)`** — Check if year is a leap year
**`isDateRangeValid(start, end)`** — End date is after start date

Business day calculations include US holidays (New Year's, Independence Day, Christmas, MLK Day, Presidents Day, Memorial Day, Labor Day, Thanksgiving).

---

### 1.5 AFv2 String Utilities (`string-utils.js` — 10 functions)

**`slugify(text)`** — URL-safe slug
**`truncateText(text, max, suffix)`** — Truncate with ellipsis
**`capitalize(text)`** / **`titleCase(text)`** / **`camelCase(text)`** / **`snakeCase(text)`**
**`stripHTML(html)`** — Remove all tags
**`countWords(text)`** — Word count
**`removeExtraWhitespace(text)`** — Normalize spaces
**`extractNumbers(text)`** — Extract digits

---

### 1.6 AFv2 Data Utilities (`data-utils.js` — 8 functions)

**`toBase64(text)`** / **`fromBase64(encoded)`**
**`generateUUID()`** — UUID v4
**`generateRandomString(length)`**
**`deepCloneObject(obj)`** / **`flattenObject(obj)`**
**`objectToQueryString(obj)`** / **`queryStringToObject(qs)`**

---

### 1.7 AFv2 Geolocation (`geolocation.js` — 5 functions)

**`fetchLocationByZip(zip)`** — External API (zippopotam.us)
**`lookupZipCodeBackend(zip)`** — AEM servlet lookup
**`calculateDistance(lat1, lon1, lat2, lon2)`** — Haversine miles
**`validateUSStateCode(state)`** / **`getStateName(code)`** — Full state database

---

### 1.8 AFv2 File Utilities (`file-utils.js` — 5 functions)

**`validateFileType(fileName, allowed)`** — Extension against allowed list
**`getFileExtension(fileName)`** — Extract extension
**`formatFileSize(bytes)`** — "1.5 MB"
**`isImageFile(fileName)`** / **`isPDFFile(fileName)`**

---

## 2. XFA IC Fragment Functions (82 functions)

These functions are designed for the **Interactive Communication (IC) Fragment code editor** and use XFA scripting (`xfa.*` objects) rather than the AFv2 `guideBridge` API. Each function wraps XFA APIs defensively with try/catch error handling.

### 2.1 XFA Host (`xfa-host.js` — 12 functions)

| Function | Signature | Description |
|---|---|---|
| `xfaAlert` | `(message, title, type)` | Modal XFA alert dialog via `xfa.host.messageBox()` |
| `xfaSetFocus` | `(fieldRef)` | Set focus by SOM path or field object |
| `xfaPageUp` | `()` | Navigate to previous page |
| `xfaPageDown` | `()` | Navigate to next page |
| `xfaGotoPage` | `(pageNumber)` | Navigate to specific page (0-based) |
| `xfaResetForm` | `()` | Reset all fields to defaults |
| `xfaGetCurrentPage` | `()` | Get current page number (0-based) |
| `xfaGetPageCount` | `()` | Get total page count |
| `xfaGetHostName` | `()` | Get host application name |
| `xfaGetAppType` | `()` | Get runtime environment type |
| `xfaIsHTML5` | `()` | True if running in HTML5 viewer |
| `xfaIsAcrobat` | `()` | True if running in Acrobat |

**Example (IC Fragment):**
```
// Show alert when form loads
if (xfaIsHTML5()) {
    xfaAlert("Welcome to the application", "Welcome", 0);
}
```

### 2.2 XFA Events (`xfa-event.js` — 10 functions)

| Function | Signature | Description |
|---|---|---|
| `getEventTarget` | `()` | Get the XFA event target object |
| `getEventTargetName` | `()` | Get SOM name of event-triggering element |
| `getNewText` | `()` | Get field text after user change |
| `getPrevText` | `()` | Get field text before user change |
| `isCommitKey` | `(key)` | Check if key is a commit key |
| `getCommitKey` | `()` | Get the raw commit key value |
| `isShiftPressed` | `()` | Check if Shift was held during event |
| `getChangeValue` | `()` | Get `xfa.event.change` value |
| `isFieldEmptyAfterChange` | `()` | Check if field is empty after user input |
| `getFieldFromEvent` | `()` | Get event target as a field reference |

**Example (IC Fragment — validate on keystroke):**
```
// Validate field as user types
var newText = getNewText();
if (newText && newText.length > 10) {
    xfaAlert("Maximum 10 characters allowed", "Validation", 0);
    xfa.event.change = "";
}
```

### 2.3 XFA Form (`xfa-form.js` — 10 functions)

| Function | Signature | Description |
|---|---|---|
| `resolveNode` | `(somPath)` | Safely resolve an XFA node by SOM path |
| `resolveNodes` | `(somPath)` | Resolve multiple XFA nodes, returns array |
| `getNodeText` | `(somPath)` | Get rawValue of a node by SOM path |
| `setNodeText` | `(somPath, value)` | Set rawValue of a node by SOM path |
| `getNodeProperty` | `(somPath, propertyName)` | Read any property from an XFA node |
| `setNodeProperty` | `(somPath, propertyName, value)` | Set any property on an XFA node |
| `execFormCalculate` | `()` | Trigger form-wide recalculation |
| `execFormValidate` | `()` | Trigger form-wide validation |
| `getInvalidFields` | `()` | Get list of fields that failed validation |
| `getNodeClassName` | `(somPath)` | Get the XFA class name of a node |

**Example (IC Fragment — validate form):**
```
// Trigger validation and show errors
execFormValidate();
var errors = getInvalidFields();
if (errors.length > 0) {
    var msg = "Please fix " + errors.length + " field(s)";
    xfaAlert(msg, "Validation Error", 0);
    xfaSetFocus(errors[0].somPath);
}
```

### 2.4 XFA Fields (`xfa-field.js` — 12 functions)

| Function | Signature | Description |
|---|---|---|
| `getFieldValue` | `(somPath)` | Safe rawValue read with null handling |
| `setFieldValue` | `(somPath, value)` | Safe rawValue write with null handling |
| `setFieldPresence` | `(somPath, presence)` | Set field visibility/hidden state |
| `setFieldAccess` | `(somPath, access)` | Set field access (open/readOnly/protected) |
| `setFieldMandatory` | `(somPath, mandatory)` | Set mandatory/nullTest property |
| `clearField` | `(somPath)` | Clear field value to empty string |
| `fieldExists` | `(somPath)` | Check if a field exists at the SOM path |
| `copyFieldValue` | `(source, target)` | Copy rawValue from one field to another |
| `isFieldVisible` | `(somPath)` | Check if field presence is "visible" |
| `isFieldReadOnly` | `(somPath)` | Check if field is readOnly or protected |
| `getFieldClassName` | `(somPath)` | Get the className of a field object |
| `setFieldHighlight` | `(somPath, fillColor)` | Change fill color to highlight a field |

**Example (IC Fragment — conditional field):**
```
// Hide field if value is empty
if (getFieldValue("form1.page1.socialSecurity") === "") {
    setFieldPresence("form1.page1.ssnConfirm", "hidden");
} else {
    setFieldPresence("form1.page1.ssnConfirm", "visible");
}
```

### 2.5 XFA Instances (`xfa-instance.js` — 8 functions)

| Function | Signature | Description |
|---|---|---|
| `addInstance` | `(somExpression)` | Add new instance to end of repeated element |
| `removeInstance` | `(somExpression, index)` | Remove instance at given 0-based index |
| `insertInstance` | `(somExpression, index)` | Insert new instance before given index |
| `getInstanceCount` | `(somExpression)` | Get current instance count |
| `setInstanceCount` | `(somExpression, targetCount)` | Set exact instance count |
| `getLastInstanceField` | `(instanceManagerSom, fieldName)` | Get field value in last instance |
| `clearAllInstances` | `(somExpression)` | Remove all instances except the first |
| `getInstanceManager` | `(somExpression)` | Resolve an instanceManager from SOM path |

**Example (IC Fragment — add row to table):**
```
// Add a new row to a line-item table
var count = getInstanceCount("form1.page1.lineItems");
addInstance("form1.page1.lineItems");
setFieldValue("form1.page1.lineItems[" + count + "].description", "");
setFieldValue("form1.page1.lineItems[" + count + "].quantity", "1");
```

### 2.6 XFA Layout (`xfa-layout.js` — 7 functions)

| Function | Signature | Description |
|---|---|---|
| `getFieldBounds` | `(fieldName)` | Get bounding box `{x, y, w, h}` in points |
| `setFieldBounds` | `(fieldName, x, y, w, h)` | Position and size a field |
| `getLayoutPageCount` | `()` | Get total pages via `$layout` object |
| `getFieldPageNumber` | `(fieldName)` | Get 0-based page number of field |
| `isFieldOnPage` | `(fieldName, pageIndex)` | Check if field is on specific page |
| `centerFieldHorizontally` | `(fieldName)` | Center field horizontally in container |
| `getFieldDimensions` | `(fieldName)` | Get width and height `{w, h}` in points |

**Example (IC Fragment — center a field):**
```
// Center the signature field horizontally
centerFieldHorizontally("form1.page1.signature");

// Get field dimensions
var dims = getFieldDimensions("form1.page1.logo");
xfaAlert("Logo size: " + dims.w + " x " + dims.h + " pts", "Info", 0);
```

### 2.7 FormCalc Utilities (`xfa-formcalc.js` — 15 functions)

| Function | Signature | Description |
|---|---|---|
| `xfaAbs` | `(value)` | Absolute value |
| `xfaAvg` | `(values)` | Arithmetic mean of array |
| `xfaCeil` | `(value)` | Round up to nearest integer |
| `xfaFloor` | `(value)` | Round down to nearest integer |
| `xfaRound` | `(value, places)` | Round to N decimal places |
| `xfaMin` | `(values)` | Smallest value in array |
| `xfaMax` | `(values)` | Largest value in array |
| `xfaSum` | `(values)` | Sum of all values |
| `xfaWithin` | `(value, low, high)` | True if value is in [low, high] |
| `xfaHasValue` | `(value)` | True if not null/undefined/empty |
| `xfaIsNull` | `(value)` | True if null, undefined, or empty |
| `xfaDateNow` | `()` | Current date as YYYYMMDD |
| `xfaTimeNow` | `()` | Current time as HHMMSS |
| `xfaDateToNum` | `(dateStr)` | Date string to day-count numeric |
| `xfaNumToDate` | `(num)` | Day-count numeric to MM/DD/YYYY |

**Example (IC Fragment — calculations):**
```
// Sum a list of values
var values = [100, 200, 300, 400];
var total = xfaSum(values);    // 1000
var avg = xfaAvg(values);      // 250

// Round to 2 decimal places
var price = xfaRound(19.995, 2);  // 20.00

// Check if value is within range
if (xfaWithin(total, 500, 1500)) {
    xfaAlert("Total is within acceptable range", "OK", 0);
}
```

### 2.8 Acrobat API (`xfa-acrobat.js` — 8 functions)

| Function | Signature | Description |
|---|---|---|
| `acrobatAlert` | `(message, type, timeout)` | `app.alert()` wrapper |
| `acrobatSetTimeout` | `(func, delay)` | `app.setTimeOut()` wrapper |
| `acrobatClearTimeout` | `(timeoutId)` | `app.clearTimeOut()` wrapper |
| `acrobatSetInterval` | `(func, interval)` | `app.setInterval()` wrapper |
| `acrobatClearInterval` | `(intervalId)` | `app.clearInterval()` wrapper |
| `acrobatLaunchURL` | `(url, newWindow)` | `app.launchURL()` wrapper |
| `acrobatBeep` | `(cAlertType)` | `app.beep()` wrapper |
| `acrobatConsolePrint` | `(message)` | `console.println()` wrapper |

**Example (IC Fragment — timed operations):**
```
// Show a brief notification then auto-close
acrobatAlert("Processing your submission...", 0, 0);
acrobatSetTimeout(function() {
    xfaAlert("Done!", "Complete", 0);
}, 3000);

// Open a URL in the browser
acrobatLaunchURL("https://help.example.com", true);
```

---

## 3. Server-Side Submit Actions

### 3.1 CustomRulesFormSubmitAction
- **Path:** `core/.../submit/CustomRulesFormSubmitAction.java`
- JSON + XML parsing (AFv2 nested data support)
- Server-side field validation (email, SSN, ZIP, credit card)
- Dummy SSN detection, XXE prevention, reCAPTCHA stub
- File attachment processing, Granite Workflow trigger
- Log injection prevention

### 3.2 SaveToDAMSubmitAction
- **Path:** `core/.../submit/SaveToDAMSubmitAction.java`
- Stores form file attachments to AEM DAM
- Creates asset nodes with form metadata
- Configurable DAM path

### 3.3 SendEmailSubmitAction
- **Path:** `core/.../submit/SendEmailSubmitAction.java`
- Email notification on form submission
- Uses AEM GenericMessage pattern

### 3.4 AuditLogSubmitAction
- **Path:** `core/.../submit/AuditLogSubmitAction.java`
- Structured audit trail under `/content/audit/form-submissions`
- Stores form path, timestamp, data preview, attachment count

---

## 4. Server-Side Servlets

| Servlet | Endpoint | Features |
|---|---|---|
| `ZipCodeLookupServlet` | `/bin/rules-api/zip-lookup` | Mock DB, ZIP+4, validation |
| `AddressValidationServlet` | `/bin/rules-api/validate-address` | State/ZIP range validation, standardization |
| `CurrencyConversionServlet` | `/bin/rules-api/currency-convert` | 10 currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN) |
| `TaxCalculationServlet` | `/bin/rules-api/calculate-tax` | 50 states + DC, combined state+local rates |

---

## 5. Server-Side Prefill Services

**`CustomFormsPrefillService`** — Dynamic prefill from backend repositories
**`UserProfilePrefillService`** — Prefill from Sling user profile (givenName, familyName, email, etc.)

---

## 6. Testing

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

## 7. Build & Deploy

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
