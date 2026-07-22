# AEM Forms Rules Editor — Comprehensive Library

A production-ready **comprehensive rules library** for AEM Forms — covering both **Adaptive Forms (AFv2) Core Components** and **Interactive Communication (IC) Fragments with XFA scripting**. Includes **176 client-side JavaScript functions** (94 AFv2 + 82 XFA IC), **6 server-side OSGi Submit Actions**, **6 backend proxy Servlets**, and **2 Prefill Services**.

---

## Library at a Glance

### Client-Side: 176 JavaScript Functions

#### AFv2 Functions (94 — 8 Categories)

| Category | File | Functions | Description |
|---|---|---|---|
| **Validation** | `validation.js` | 25 | US & international ID, contact, network, format validators |
| **Formatting** | `formatting.js` | 15 | Phone, SSN, credit card, currency, date, name formatting |
| **Financial** | `financial.js` | 12 | Loan, interest, tax, discount, amortization calculations |
| **Date/Time** | `date-utils.js` | 14 | Date validation, manipulation, business day calculations |
| **Strings** | `string-utils.js` | 10 | Text processing, case conversion, slugify, truncate |
| **Data** | `data-utils.js` | 8 | Base64, UUID, object flattening, query string utilities |
| **Geolocation** | `geolocation.js` | 5 | ZIP lookup, distance, state code validation |
| **Files** | `file-utils.js` | 5 | File type, extension, size validation and formatting |

#### XFA IC Fragment Functions (82 — 8 Categories)

| Category | File | Functions | Description |
|---|---|---|---|
| **XFA Host** | `xfa-host.js` | 12 | Alert, focus, page navigation, reset, environment detection |
| **XFA Events** | `xfa-event.js` | 10 | Event target, commit keys, text changes, modifier keys |
| **XFA Form** | `xfa-form.js` | 10 | SOM node resolution, property access, form-wide operations |
| **XFA Fields** | `xfa-field.js` | 12 | Read/write values, presence, access, visibility, highlighting |
| **XFA Instances** | `xfa-instance.js` | 8 | Repeat management, add/remove/insert/set instance counts |
| **XFA Layout** | `xfa-layout.js` | 7 | Field bounds, page positioning, centering, dimensions |
| **FormCalc** | `xfa-formcalc.js` | 15 | Math, date, comparison utilities (FormCalc API equivalents) |
| **Acrobat API** | `xfa-acrobat.js` | 8 | app.alert, timers, URL launch, console, system sounds |

### Server-Side: 4 Submit Actions

| Submit Action | Description |
|---|---|
| `CustomRulesFormSubmitAction` | JSON/XML parsing, server-side validation, reCAPTCHA, workflow trigger |
| `SaveToDAMSubmitAction` | Store form file attachments to AEM DAM with metadata |
| `SendEmailSubmitAction` | Send email notification on form submission |
| `AuditLogSubmitAction` | Write structured audit trail entries to JCR |

### Server-Side: 4 Backend Servlets

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
4. All 176 functions are now available in the Rules Editor dropdown

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

### Date/Time (`date-utils.js` — 14 functions)

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
| `isLeapYear` | `string` | `boolean` | Check if year is a leap year |
| `isDateRangeValid` | `string, string` | `boolean` | End date is after start date |

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

### XFA IC Fragment Functions

The following 82 functions are designed for **Interactive Communication (IC) Fragments** using XFA scripting. They wrap `xfa.*` objects and provide safe, defensive access to XFA APIs.

#### XFA Host (`xfa-host.js` — 12 functions)

| Function | Signature | Description |
|---|---|---|
| `xfaAlert` | `(message, title, type)` | Show a modal XFA alert dialog |
| `xfaSetFocus` | `(fieldRef)` | Set focus to a field by SOM path or object |
| `xfaPageUp` | `()` | Navigate to the previous page |
| `xfaPageDown` | `()` | Navigate to the next page |
| `xfaGotoPage` | `(pageNumber)` | Navigate to a specific page (0-based) |
| `xfaResetForm` | `()` | Reset all fields to defaults |
| `xfaGetCurrentPage` | `()` | Get current page number (0-based) |
| `xfaGetPageCount` | `()` | Get total page count |
| `xfaGetHostName` | `()` | Get host application name |
| `xfaGetAppType` | `()` | Get runtime environment type |
| `xfaIsHTML5` | `()` | True if running in HTML5 viewer |
| `xfaIsAcrobat` | `()` | True if running in Acrobat |

#### XFA Events (`xfa-event.js` — 10 functions)

| Function | Signature | Description |
|---|---|---|
| `getEventTarget` | `()` | Get the XFA event target object |
| `getEventTargetName` | `()` | Get SOM name of event-triggering element |
| `getNewText` | `()` | Get field text after user change |
| `getPrevText` | `()` | Get field text before user change |
| `isCommitKey` | `(key)` | Check if key is a commit key |
| `getCommitKey` | `()` | Get the raw commit key value |
| `isShiftPressed` | `()` | Check if Shift was held during event |
| `getChangeValue` | `()` | Get xfa.event.change value |
| `isFieldEmptyAfterChange` | `()` | Check if field is empty after user input |
| `getFieldFromEvent` | `()` | Get event target as a field reference |

#### XFA Form (`xfa-form.js` — 10 functions)

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

#### XFA Fields (`xfa-field.js` — 12 functions)

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

#### XFA Instances (`xfa-instance.js` — 8 functions)

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

#### XFA Layout (`xfa-layout.js` — 7 functions)

| Function | Signature | Description |
|---|---|---|
| `getFieldBounds` | `(fieldName)` | Get bounding box `{x, y, w, h}` in points |
| `setFieldBounds` | `(fieldName, x, y, w, h)` | Position and size a field |
| `getLayoutPageCount` | `()` | Get total pages via $layout object |
| `getFieldPageNumber` | `(fieldName)` | Get 0-based page number of field |
| `isFieldOnPage` | `(fieldName, pageIndex)` | Check if field is on specific page |
| `centerFieldHorizontally` | `(fieldName)` | Center field horizontally in container |
| `getFieldDimensions` | `(fieldName)` | Get width and height `{w, h}` in points |

#### FormCalc Utilities (`xfa-formcalc.js` — 15 functions)

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

#### Acrobat API (`xfa-acrobat.js` — 8 functions)

| Function | Signature | Description |
|---|---|---|
| `acrobatAlert` | `(message, type, timeout)` | app.alert() wrapper |
| `acrobatSetTimeout` | `(func, delay)` | app.setTimeOut() wrapper |
| `acrobatClearTimeout` | `(timeoutId)` | app.clearTimeOut() wrapper |
| `acrobatSetInterval` | `(func, interval)` | app.setInterval() wrapper |
| `acrobatClearInterval` | `(intervalId)` | app.clearInterval() wrapper |
| `acrobatLaunchURL` | `(url, newWindow)` | app.launchURL() wrapper |
| `acrobatBeep` | `(cAlertType)` | app.beep() wrapper |
| `acrobatConsolePrint` | `(message)` | console.println() wrapper |

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
    js.txt                                # Load order for all 18 JS files
    js/
      custom-functions.js                 # Namespace initialization
      validation.js                       # 25 AFv2 validation functions
      formatting.js                       # 15 AFv2 formatting functions
      financial.js                        # 12 AFv2 financial calculations
      date-utils.js                       # 14 AFv2 date/time functions
      string-utils.js                     # 10 AFv2 string utilities
      data-utils.js                       # 8 AFv2 data transformation functions
      geolocation.js                      # 5 AFv2 geolocation functions
      file-utils.js                       # 5 AFv2 file utility functions
      xfa-host.js                         # 12 XFA host wrappers
      xfa-event.js                        # 10 XFA event helpers
      xfa-form.js                         # 10 XFA form DOM traversal
      xfa-field.js                        # 12 XFA field operations
      xfa-instance.js                     # 8 XFA instance management
      xfa-layout.js                       # 7 XFA layout/positioning
      xfa-formcalc.js                     # 15 FormCalc JS equivalents
      xfa-acrobat.js                      # 8 Acrobat API wrappers
  ui.content/                             # Themes, FDMs, templates
  ui.frontend/                            # Webpack build
```

---

## Documentation

- [AEM_FORMS_RULES_EDITOR.md](AEM_FORMS_RULES_EDITOR.md) — detailed architecture and API reference
- Module-level READMEs in each subdirectory

## License

See [LICENSE](LICENSE).
