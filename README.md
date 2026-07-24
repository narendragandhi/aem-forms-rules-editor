# AEM Forms Rules Editor — Comprehensive Library

A production-ready rules library for AEM Forms — covering both **Adaptive Forms (AFv2) Core Components** and **Interactive Communication (IC) Fragments with XFA scripting**. Includes **96 client-side JavaScript functions** (53 AFv2 + 16 XFA IC + 27 Integration), **4 server-side OSGi Submit Actions**, **7 backend proxy Servlets**, and **2 Prefill Services**.

Every function contains real logic — no thin wrappers.

---

## Quick Start

### Prerequisites
- AEM as a Cloud Service (or AEM 6.5 with Forms add-on)
- Java 11+, Maven 3.3.9+

### Build & Deploy
```bash
mvn clean install
mvn clean install -PautoInstallPackage              # Deploy to local AEM (localhost:4502)
```

### Load in a Form
1. Select the **Adaptive Form Container** component
2. Add `aem-forms-rules-editor.customfunctions` to the **Client Library Category** field

---

## Function Reference

### AFv2 Functions (53)

#### Validation (`validation.js` — 7)
| Function | Input | Description |
|---|---|---|
| `validateSSN` | `string` | US SSN with SSA allocation rules |
| `validateEIN` | `string` | US Employer ID with IRS prefix ranges |
| `validateITIN` | `string` | US Individual Taxpayer ID (9XX-XX-XXXX) |
| `validateIPv6` | `string` | Full/compressed/mixed IPv6 notation |
| `validateCreditCardLuhn` | `string` | Credit card via Luhn algorithm |
| `validateCanadianSIN` | `string` | Canadian SIN via Luhn algorithm |
| `validateIBAN` | `string` | International Bank Account Number (mod-97) |

#### Formatting (`formatting.js` — 10)
| Function | Input | Description |
|---|---|---|
| `formatPhoneNumber` | `string` | US to `(XXX) XXX-XXXX` |
| `formatPhoneNumberInternational` | `string, string` | E.164 format |
| `formatSSN` | `string, boolean` | Display or mask (***) |
| `formatCreditCard` | `string` | Spaces every 4 digits |
| `maskCreditCard` | `string` | Last 4 digits visible |
| `formatCurrency` | `number, string` | `$1,234.56` |
| `formatDate` | `string, string` | Pattern-based: MM/DD/YYYY, DD/MM/YYYY, Month DD, YYYY |
| `formatDateISO` | `string` | Always YYYY-MM-DD |
| `formatZipCodePlus4` | `string` | XXXXX-XXXX |
| `formatNumberWithCommas` | `number` | 1,000,000.00 |

#### Financial (`financial.js` — 8)
| Function | Input | Description |
|---|---|---|
| `calculateMonthlyPayment` | `P, r, t` | Amortization formula |
| `calculateCompoundInterest` | `P, r, n, t` | A = P(1 + r/n)^(nt) |
| `calculateSimpleInterest` | `P, r, t` | I = Prt |
| `calculateLoanPayoffDate` | `date, P, r, payment` | ISO payoff date |
| `calculateAPR` | `loan, payment, term` | Newton's method root-finding |
| `calculateTip` | `amount, percent, split` | `{tip, total, perPerson}` |
| `calculateDiscount` | `price, discount, type` | `{finalPrice, savings}` |
| `calculateAmortization` | `P, r, t` | Full monthly schedule array |

#### Date/Time (`date-utils.js` — 11)
| Function | Input | Description |
|---|---|---|
| `isPastDate` | `string` | Before today |
| `isFutureDate` | `string` | After today |
| `isBusinessDay` | `string` | Not weekend, not US holiday |
| `addDays` | `string, number` | Add N days |
| `addMonths` | `string, number` | Add N months |
| `daysBetween` | `string, string` | Calendar days between dates |
| `businessDaysBetween` | `string, string` | Business days (excl. holidays) |
| `getLastDayOfMonth` | `string` | Last day of month |
| `formatDateRelative` | `string` | "3 days ago", "in 2 weeks" |
| `calculateAge` | `string` | Age in years from birthdate |
| `isDateInRange` | `string, string, string` | Date within range (inclusive) |

Business day calculations include US holidays (New Year's, Independence Day, Christmas, MLK Day, Presidents Day, Memorial Day, Labor Day, Thanksgiving).

#### Strings (`string-utils.js` — 3)
| Function | Input | Description |
|---|---|---|
| `slugify` | `string` | "Hello World!" → "hello-world" |
| `camelCase` | `string` | "Hello World" → "helloWorld" |
| `snakeCase` | `string` | "Hello World" → "hello_world" |

#### Data (`data-utils.js` — 5)
| Function | Input | Description |
|---|---|---|
| `generateUUID` | none | UUID v4 |
| `generateRandomString` | `number` | Alphanumeric random |
| `flattenObject` | `object` | Dot-notation flattening |
| `objectToQueryString` | `object` | Object to URL query string |
| `queryStringToObject` | `string` | Query string to object |

#### Geolocation (`geolocation.js` — 5)
| Function | Input | Description |
|---|---|---|
| `fetchLocationByZip` | `string` | External API (zippopotam.us) |
| `lookupZipCodeBackend` | `string` | AEM servlet lookup (150+ ZIP codes) |
| `calculateDistance` | `lat1, lon1, lat2, lon2` | Haversine miles |
| `validateUSStateCode` | `string` | Valid state code |
| `getStateName` | `string` | "CA" → "California" |

#### Files (`file-utils.js` — 4)
| Function | Input | Description |
|---|---|---|
| `validateFileType` | `string, string` | Extension against allowed list |
| `formatFileSize` | `number` | Bytes → "1.5 MB" |
| `isImageFile` | `string` | Check if image type |
| `isPDFFile` | `string` | Check if PDF |

---

### XFA IC Fragment Functions (16)

These functions wrap XFA APIs defensively for the IC Fragment code editor.

#### XFA Form (`xfa-form.js` — 2)
| Function | Signature | Description |
|---|---|---|
| `resolveNodes` | `(somPath)` | Resolve multiple XFA nodes, returns array |
| `getInvalidFields` | `()` | Get fields that failed validation with error messages |

#### XFA Instances (`xfa-instance.js` — 2)
| Function | Signature | Description |
|---|---|---|
| `getLastInstanceField` | `(instanceManagerSom, fieldName)` | Get field value in last instance |
| `clearAllInstances` | `(somExpression)` | Remove all instances except the first |

#### XFA Layout (`xfa-layout.js` — 2)
| Function | Signature | Description |
|---|---|---|
| `getFieldPageNumber` | `(fieldName)` | 0-based page number by walking parent chain |
| `centerFieldHorizontally` | `(fieldName)` | Center field within parent container |

#### FormCalc Utilities (`xfa-formcalc.js` — 9)
| Function | Signature | Description |
|---|---|---|
| `xfaAvg` | `(values)` | Arithmetic mean of array |
| `xfaRound` | `(value, places)` | Round to N decimal places |
| `xfaMin` | `(values)` | Smallest value in array |
| `xfaMax` | `(values)` | Largest value in array |
| `xfaSum` | `(values)` | Sum of all values |
| `xfaDateNow` | `()` | Current date as YYYYMMDD |
| `xfaTimeNow` | `()` | Current time as HHMMSS |
| `xfaDateToNum` | `(dateStr)` | Date string to day-count numeric |
| `xfaNumToDate` | `(num)` | Day-count numeric to MM/DD/YYYY |

#### Acrobat API (`xfa-acrobat.js` — 1)
| Function | Signature | Description |
|---|---|---|
| `acrobatBeep` | `(cAlertType)` | Play alert sound (with Web Audio fallback) |

---

### Integration Functions (27)

These functions call backend servlets and provide AEM-specific integrations.

#### Correspondence Management (`correspondence.js` — 9)
| Function | Signature | Description |
|---|---|---|
| `listLetterTemplates` | `()` | List all available letter templates |
| `getLetterTemplate` | `(templateId)` | Get template details by ID |
| `listDataDictionaries` | `()` | List all data dictionaries |
| `lookupDataDictionary` | `(name)` | Lookup entries in a dictionary |
| `generateCorrespondence` | `(templateId, recipientId)` | Generate a correspondence document |
| `previewCorrespondence` | `(templateId)` | Preview template before generation |
| `getCorrespondenceHistory` | `(recipientId)` | Get past correspondences for a recipient |
| `resolveTemplate` | `(templateId)` | Resolve template with merged data |
| `batchGenerateCorrespondence` | `(templateIds, recipientId)` | Generate multiple correspondences |

Backend: `CorrespondenceManagementServlet` — 8 letter templates, 4 data dictionaries (US states, currencies, salutations, countries).

#### Document of Record (`documentOfRecord.js` — 8)
| Function | Signature | Description |
|---|---|---|
| `listDoRTemplates` | `()` | List all DoR templates |
| `getDoRTemplate` | `(templateId)` | Get template details by ID |
| `generateDoR` | `(templateId, formPath, submissionId)` | Generate a PDF record |
| `getDoR` | `(dorId)` | Retrieve existing DoR by ID |
| `listDoRs` | `(formPath?)` | List all DoRs, optionally filtered |
| `regenerateDoR` | `(dorId)` | Create new version of existing DoR |
| `getDoRStatus` | `(dorId)` | Check processing status |
| `autoSelectTemplate` | `(formPath)` | Auto-select best template based on form path |
| `autoGenerateDoR` | `(formPath, submissionId?)` | Auto-select + generate in one call |

Backend: `DocumentOfRecordServlet` — 5 DoR templates (Standard, Executive, Detailed, Compliance, Customer).

#### Forms Portal (`forms-portal.js` — 10+)
| Function | Signature | Description |
|---|---|---|
| `listForms` | `(filters?)` | List forms with optional category/status filter |
| `getFormMetadata` | `(formPath)` | Get form title, description, config |
| `saveDraft` | `(formPath, userId, data)` | Save form draft for resume later |
| `getDraft` | `(formPath, userId)` | Retrieve saved draft |
| `listDrafts` | `(userId)` | List all drafts for a user |
| `deleteDraft` | `(formPath, userId)` | Delete a saved draft |
| `getPrefillData` | `(source, keys?)` | Load prefill data from external source |
| `listPrefillSources` | `()` | List available prefill sources |
| `getFormAnalytics` | `(formPath?)` | Get submission analytics |
| `prefillsFormFromMultipleSources` | `(sources[])` | Merge prefill data from multiple sources |
| `createAutoSaver` | `(formPath, userId, delayMs)` | Create debounced auto-save function |
| `searchForms` | `(query)` | Search forms by title/description |
| `hasDraft` | `(formPath, userId)` | Check if draft exists |

Backend: `FormsPortalPrefillServlet` — 10 registered forms, draft management, 4 prefill sources (user-profile, customer-data, organization, recent-transactions), form analytics.

---

## Server-Side Components

### Submit Actions
| Class | Description |
|---|---|
| `CustomRulesFormSubmitAction` | JSON/XML parsing, server-side validation, reCAPTCHA, workflow trigger |
| `SaveToDAMSubmitAction` | Store form file attachments to AEM DAM |
| `SendEmailSubmitAction` | Real JavaMail SMTP with OSGi-configurable settings |
| `AuditLogSubmitAction` | Write structured audit trail to JCR |

### Servlets
| Servlet | Endpoint | Description |
|---|---|---|
| `ZipCodeLookupServlet` | `/bin/rules-api/zip-lookup` | 150+ US ZIP codes with city/state lookup |
| `AddressValidationServlet` | `/bin/rules-api/validate-address` | All 50 states + DC with ZIP ranges |
| `CurrencyConversionServlet` | `/bin/rules-api/currency-convert` | Live API (open.er-api.com) with 30-min cache + fallback |
| `TaxCalculationServlet` | `/bin/rules-api/calculate-tax` | All 50 states + DC tax rates |
| `CorrespondenceManagementServlet` | `/bin/rules-api/correspondence` | 8 letter templates, 4 data dictionaries |
| `DocumentOfRecordServlet` | `/bin/rules-api/document-of-record` | 5 DoR templates, status tracking |
| `FormsPortalPrefillServlet` | `/bin/rules-api/forms-portal` | 10 forms, drafts, prefill, analytics |

### Prefill Services
| Service | Description |
|---|---|
| `CustomFormsPrefillService` | Dynamic prefill from backend repositories |
| `UserProfilePrefillService` | Prefill from Sling user profile |

---

## Architecture

```
aem-forms-rules-editor/
  core/src/main/java/.../
    submit/    — 4 Submit Actions
    prefill/   — 2 Prefill Services
    servlets/  — 7 Backend Servlets
  core/src/test/java/.../
    — 18 Test classes (95 tests, 0 failures)
  ui.apps/.../clientlib-custom-functions/
    js.txt     — Load order (17 JS files)
    js/
      custom-functions.js     — Namespace init
      validation.js           — 7 validators
      formatting.js           — 10 formatters
      financial.js            — 8 calculations
      date-utils.js           — 11 date functions
      string-utils.js         — 3 string utilities
      data-utils.js           — 5 data utilities
      geolocation.js          — 5 geolocation functions
      file-utils.js           — 4 file utilities
      xfa-form.js             — 2 XFA form DOM helpers
      xfa-instance.js         — 2 XFA instance management
      xfa-layout.js           — 2 XFA layout/positioning
      xfa-formcalc.js         — 9 FormCalc equivalents
      xfa-acrobat.js          — 1 Acrobat API wrapper
      correspondence.js       — 9 correspondence management
      document-of-record.js   — 8 document of record
      forms-portal.js         — 13 forms portal integration
```

---

## Demo

See [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for a complete 12-minute demo video script with copy-paste console examples.

---

## License

See [LICENSE](LICENSE).
