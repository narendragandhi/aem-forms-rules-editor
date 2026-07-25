# AEM Forms Rules Editor — VS Code Extension

Autocomplete, hover documentation, and signature help for **101 AEM Forms custom functions**.

## Features

### Autocomplete
Type `CustomFormRules.` and get instant access to all 101 functions, organized by category:
- **Validation** (7) — SSN, EIN, ITIN, credit card, IBAN, SIN, IPv6
- **Formatting** (10) — Phone, SSN, credit card, currency, date, ZIP, numbers
- **Financial** (8) — Mortgage, interest, APR, tip, discount, amortization
- **Date Utils** (11) — Business days, relative dates, age, ranges
- **String Utils** (3) — Slug, camelCase, snakeCase
- **Data Utils** (5) — UUID, flatten, query string
- **Geolocation** (5) — ZIP lookup, distance, state codes
- **File Utils** (4) — File type, size, image/PDF detection
- **Forms Portal** (13) — Drafts, prefill, analytics, search
- **Document of Record** (9) — Templates, generate, regenerate, status
- **Correspondence Management** (10) — Templates, dictionaries, generate, batch
- **XFA Functions** (16) — FormCalc equivalents, layout, instance, form DOM

Sub-namespaces auto-complete too:
- `CustomFormRules.xfa.` → 16 XFA functions
- `CustomFormRules.formsPortal.` → 13 Forms Portal functions
- `CustomFormRules.documentOfRecord.` → 9 DoR functions
- `CustomFormRules.correspondence.` → 10 CM functions

### Hover Documentation
Hover any function to see:
- Full function signature
- Category badge
- Description
- Parameters table (name, type, optional, description)
- Return type
- Code example

### Signature Help
Inside function parentheses, get parameter hints with types and descriptions.

### Snippets
| Prefix | Description |
|--------|-------------|
| `cfrule` | AEM Forms Rule template |
| `cfvalidate` | Call a validation function |
| `cfformat` | Call a formatting function |
| `cfasync` | Async function with Promise handling |
| `cfprefill` | Multi-source prefill pattern |
| `cfdraft` | Auto-save draft setup |
| `cfdor` | Auto-generate Document of Record |
| `cfcorr` | Generate correspondence from template |

## Installation

### From Source
```bash
cd vscode-extension
npm install
npm run compile
npm run package
```

Then install the `.vsix` file:
```
code --install-extension aem-forms-rules-editor-1.0.0.vsix
```

### Development
1. Open the `vscode-extension` folder in VS Code
2. Press F5 to launch Extension Development Host
3. Open a `.js` file and type `CustomFormRules.` to see autocomplete

## Requirements

- VS Code 1.74.0 or later
- Works in JavaScript and TypeScript files

## License

Apache-2.0
