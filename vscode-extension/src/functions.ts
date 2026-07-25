export interface ParamDef {
    name: string;
    type: string;
    optional: boolean;
    description: string;
}

export interface FunctionDef {
    name: string;
    namespace: string;
    category: string;
    params: ParamDef[];
    returns: string;
    description: string;
    example: string;
    isAsync: boolean;
}

export const FUNCTIONS: FunctionDef[] = [
    // ── Validation (7) ──────────────────────────────────────────────
    {
        name: "validateSSN", namespace: "CustomFormRules.validateSSN", category: "Validation",
        params: [{ name: "ssn", type: "string", optional: false, description: "SSN with or without dashes" }],
        returns: "boolean", description: "Validate US Social Security Number (SSN) with full SSA allocation rules.",
        example: 'CustomFormRules.validateSSN("123-45-6789")', isAsync: false
    },
    {
        name: "validateEIN", namespace: "CustomFormRules.validateEIN", category: "Validation",
        params: [{ name: "ein", type: "string", optional: false, description: "EIN with or without dash" }],
        returns: "boolean", description: "Validate US Employer Identification Number (EIN).",
        example: 'CustomFormRules.validateEIN("12-3456789")', isAsync: false
    },
    {
        name: "validateITIN", namespace: "CustomFormRules.validateITIN", category: "Validation",
        params: [{ name: "itin", type: "string", optional: false, description: "ITIN with or without dashes" }],
        returns: "boolean", description: "Validate US Individual Taxpayer Identification Number (ITIN).",
        example: 'CustomFormRules.validateITIN("912-70-1234")', isAsync: false
    },
    {
        name: "validateIPv6", namespace: "CustomFormRules.validateIPv6", category: "Validation",
        params: [{ name: "ip", type: "string", optional: false, description: "IPv6 address string" }],
        returns: "boolean", description: "Validate IPv6 address (full, compressed, and mixed notation).",
        example: 'CustomFormRules.validateIPv6("2001:0db8:85a3::8a2e:0370:7334")', isAsync: false
    },
    {
        name: "validateCreditCardLuhn", namespace: "CustomFormRules.validateCreditCardLuhn", category: "Validation",
        params: [{ name: "cardNumber", type: "string", optional: false, description: "Credit card number (digits only)" }],
        returns: "boolean", description: "Validate credit card number using the Luhn algorithm.",
        example: 'CustomFormRules.validateCreditCardLuhn("4111111111111111")', isAsync: false
    },
    {
        name: "validateCanadianSIN", namespace: "CustomFormRules.validateCanadianSIN", category: "Validation",
        params: [{ name: "sin", type: "string", optional: false, description: "9-digit Canadian SIN" }],
        returns: "boolean", description: "Validate Canadian Social Insurance Number (SIN) using Luhn algorithm.",
        example: 'CustomFormRules.validateCanadianSIN("123456789")', isAsync: false
    },
    {
        name: "validateIBAN", namespace: "CustomFormRules.validateIBAN", category: "Validation",
        params: [{ name: "iban", type: "string", optional: false, description: "International Bank Account Number" }],
        returns: "boolean", description: "Validate IBAN with mod-97 checksum.",
        example: 'CustomFormRules.validateIBAN("DE89370400440532013000")', isAsync: false
    },

    // ── Formatting (10) ────────────────────────────────────────────
    {
        name: "formatPhoneNumber", namespace: "CustomFormRules.formatPhoneNumber", category: "Formatting",
        params: [{ name: "phone", type: "string", optional: false, description: "10-digit US phone number" }],
        returns: "string", description: "Format US phone number to (XXX) XXX-XXXX.",
        example: 'CustomFormRules.formatPhoneNumber("5551234567")', isAsync: false
    },
    {
        name: "formatPhoneNumberInternational", namespace: "CustomFormRules.formatPhoneNumberInternational", category: "Formatting",
        params: [
            { name: "phone", type: "string", optional: false, description: "Phone number digits" },
            { name: "countryCode", type: "string", optional: false, description: "Country code (e.g. US, GB)" }
        ],
        returns: "string", description: "Format phone number to E.164 international format.",
        example: 'CustomFormRules.formatPhoneNumberInternational("5551234567", "US")', isAsync: false
    },
    {
        name: "formatSSN", namespace: "CustomFormRules.formatSSN", category: "Formatting",
        params: [
            { name: "ssn", type: "string", optional: false, description: "SSN digits" },
            { name: "mask", type: "boolean", optional: false, description: "true to show ***-**-XXXX" }
        ],
        returns: "string", description: "Format or mask SSN.",
        example: 'CustomFormRules.formatSSN("123456789", true)', isAsync: false
    },
    {
        name: "formatCreditCard", namespace: "CustomFormRules.formatCreditCard", category: "Formatting",
        params: [{ name: "cardNumber", type: "string", optional: false, description: "Credit card digits" }],
        returns: "string", description: "Format credit card with spaces every 4 digits.",
        example: 'CustomFormRules.formatCreditCard("4111111111111111")', isAsync: false
    },
    {
        name: "maskCreditCard", namespace: "CustomFormRules.maskCreditCard", category: "Formatting",
        params: [{ name: "cardNumber", type: "string", optional: false, description: "Credit card digits" }],
        returns: "string", description: "Mask credit card to show only last 4 digits.",
        example: 'CustomFormRules.maskCreditCard("4111111111111111")', isAsync: false
    },
    {
        name: "formatCurrency", namespace: "CustomFormRules.formatCurrency", category: "Formatting",
        params: [
            { name: "amount", type: "number", optional: false, description: "Numeric amount" },
            { name: "currencyCode", type: "string", optional: false, description: "ISO currency code (USD, EUR, etc.)" }
        ],
        returns: "string", description: "Format number as currency string.",
        example: 'CustomFormRules.formatCurrency(1234.56, "USD")', isAsync: false
    },
    {
        name: "formatDate", namespace: "CustomFormRules.formatDate", category: "Formatting",
        params: [
            { name: "dateString", type: "string", optional: false, description: "ISO date string" },
            { name: "pattern", type: "string", optional: false, description: "Output pattern (MM/DD/YYYY, DD/MM/YYYY, Month DD, YYYY)" }
        ],
        returns: "string", description: "Format ISO date string to specified pattern.",
        example: 'CustomFormRules.formatDate("2024-01-15", "MM/DD/YYYY")', isAsync: false
    },
    {
        name: "formatDateISO", namespace: "CustomFormRules.formatDateISO", category: "Formatting",
        params: [{ name: "dateString", type: "string", optional: false, description: "Any date string" }],
        returns: "string", description: "Format date to ISO 8601 (YYYY-MM-DD).",
        example: 'CustomFormRules.formatDateISO("01/15/2024")', isAsync: false
    },
    {
        name: "formatZipCodePlus4", namespace: "CustomFormRules.formatZipCodePlus4", category: "Formatting",
        params: [{ name: "zip", type: "string", optional: false, description: "ZIP code (5 or 9 digits)" }],
        returns: "string", description: "Format US ZIP code with optional +4 suffix.",
        example: 'CustomFormRules.formatZipCodePlus4("123456789")', isAsync: false
    },
    {
        name: "formatNumberWithCommas", namespace: "CustomFormRules.formatNumberWithCommas", category: "Formatting",
        params: [{ name: "num", type: "number", optional: false, description: "Numeric value" }],
        returns: "string", description: "Format number with commas as thousand separators.",
        example: 'CustomFormRules.formatNumberWithCommas(1234567)', isAsync: false
    },

    // ── Financial (8) ──────────────────────────────────────────────
    {
        name: "calculateMonthlyPayment", namespace: "CustomFormRules.calculateMonthlyPayment", category: "Financial",
        params: [
            { name: "principal", type: "number", optional: false, description: "Loan principal amount" },
            { name: "annualInterestRate", type: "number", optional: false, description: "Annual interest rate (e.g. 6.5 for 6.5%)" },
            { name: "termMonths", type: "number", optional: false, description: "Loan term in months" }
        ],
        returns: "number", description: "Calculate monthly loan payment (amortization formula).",
        example: "CustomFormRules.calculateMonthlyPayment(300000, 6.5, 360)", isAsync: false
    },
    {
        name: "calculateCompoundInterest", namespace: "CustomFormRules.calculateCompoundInterest", category: "Financial",
        params: [
            { name: "principal", type: "number", optional: false, description: "Initial investment" },
            { name: "annualRate", type: "number", optional: false, description: "Annual rate (e.g. 5 for 5%)" },
            { name: "compoundsPerYear", type: "number", optional: false, description: "Compounding frequency per year" },
            { name: "years", type: "number", optional: false, description: "Investment duration in years" }
        ],
        returns: "number", description: "Calculate compound interest: A = P(1 + r/n)^(nt).",
        example: "CustomFormRules.calculateCompoundInterest(10000, 5, 12, 10)", isAsync: false
    },
    {
        name: "calculateSimpleInterest", namespace: "CustomFormRules.calculateSimpleInterest", category: "Financial",
        params: [
            { name: "principal", type: "number", optional: false, description: "Principal amount" },
            { name: "annualRate", type: "number", optional: false, description: "Annual rate" },
            { name: "years", type: "number", optional: false, description: "Duration in years" }
        ],
        returns: "number", description: "Calculate simple interest: I = P * r * t.",
        example: "CustomFormRules.calculateSimpleInterest(10000, 5, 10)", isAsync: false
    },
    {
        name: "calculateLoanPayoffDate", namespace: "CustomFormRules.calculateLoanPayoffDate", category: "Financial",
        params: [
            { name: "startDate", type: "string", optional: false, description: "Loan start date (ISO)" },
            { name: "principal", type: "number", optional: false, description: "Loan principal" },
            { name: "annualRate", type: "number", optional: false, description: "Annual interest rate" },
            { name: "monthlyPayment", type: "number", optional: false, description: "Monthly payment amount" }
        ],
        returns: "string", description: "Calculate loan payoff date from start date, principal, rate, and payment.",
        example: 'CustomFormRules.calculateLoanPayoffDate("2024-01-01", 300000, 6.5, 1896)', isAsync: false
    },
    {
        name: "calculateAPR", namespace: "CustomFormRules.calculateAPR", category: "Financial",
        params: [
            { name: "loanAmount", type: "number", optional: false, description: "Total loan amount" },
            { name: "monthlyPayment", type: "number", optional: false, description: "Monthly payment" },
            { name: "termMonths", type: "number", optional: false, description: "Term in months" }
        ],
        returns: "number", description: "Calculate APR from loan details using Newton's method.",
        example: "CustomFormRules.calculateAPR(300000, 1896, 360)", isAsync: false
    },
    {
        name: "calculateTip", namespace: "CustomFormRules.calculateTip", category: "Financial",
        params: [
            { name: "amount", type: "number", optional: false, description: "Bill amount" },
            { name: "tipPercent", type: "number", optional: false, description: "Tip percentage" },
            { name: "splitAmong", type: "number", optional: false, description: "Number of people to split" }
        ],
        returns: "object", description: "Calculate tip amount and total with optional split.",
        example: "CustomFormRules.calculateTip(85.50, 20, 1)", isAsync: false
    },
    {
        name: "calculateDiscount", namespace: "CustomFormRules.calculateDiscount", category: "Financial",
        params: [
            { name: "price", type: "number", optional: false, description: "Original price" },
            { name: "discount", type: "number", optional: false, description: "Discount value" },
            { name: "type", type: "string", optional: false, description: '"percentage" or "fixed"' }
        ],
        returns: "object", description: "Calculate discount (percentage or fixed amount).",
        example: 'CustomFormRules.calculateDiscount(100, 15, "percentage")', isAsync: false
    },
    {
        name: "calculateAmortization", namespace: "CustomFormRules.calculateAmortization", category: "Financial",
        params: [
            { name: "principal", type: "number", optional: false, description: "Loan principal" },
            { name: "annualRate", type: "number", optional: false, description: "Annual rate" },
            { name: "termMonths", type: "number", optional: false, description: "Term in months" }
        ],
        returns: "array", description: "Generate simplified amortization schedule.",
        example: "CustomFormRules.calculateAmortization(300000, 6.5, 360)", isAsync: false
    },

    // ── Date Utils (11) ────────────────────────────────────────────
    {
        name: "isPastDate", namespace: "CustomFormRules.isPastDate", category: "Date Utils",
        params: [{ name: "dateString", type: "string", optional: false, description: "ISO date string" }],
        returns: "boolean", description: "Check if date is in the past.",
        example: 'CustomFormRules.isPastDate("2020-01-01")', isAsync: false
    },
    {
        name: "isFutureDate", namespace: "CustomFormRules.isFutureDate", category: "Date Utils",
        params: [{ name: "dateString", type: "string", optional: false, description: "ISO date string" }],
        returns: "boolean", description: "Check if date is in the future.",
        example: 'CustomFormRules.isFutureDate("2030-01-01")', isAsync: false
    },
    {
        name: "isBusinessDay", namespace: "CustomFormRules.isBusinessDay", category: "Date Utils",
        params: [{ name: "dateString", type: "string", optional: false, description: "ISO date string" }],
        returns: "boolean", description: "Check if date is a business day (not weekend, not US holiday).",
        example: 'CustomFormRules.isBusinessDay("2024-07-04")', isAsync: false
    },
    {
        name: "addDays", namespace: "CustomFormRules.addDays", category: "Date Utils",
        params: [
            { name: "dateString", type: "string", optional: false, description: "ISO date string" },
            { name: "days", type: "number", optional: false, description: "Number of days to add" }
        ],
        returns: "string", description: "Add days to a date.",
        example: 'CustomFormRules.addDays("2024-01-01", 30)', isAsync: false
    },
    {
        name: "addMonths", namespace: "CustomFormRules.addMonths", category: "Date Utils",
        params: [
            { name: "dateString", type: "string", optional: false, description: "ISO date string" },
            { name: "months", type: "number", optional: false, description: "Number of months to add" }
        ],
        returns: "string", description: "Add months to a date.",
        example: 'CustomFormRules.addMonths("2024-01-01", 6)', isAsync: false
    },
    {
        name: "daysBetween", namespace: "CustomFormRules.daysBetween", category: "Date Utils",
        params: [
            { name: "startDate", type: "string", optional: false, description: "Start date (ISO)" },
            { name: "endDate", type: "string", optional: false, description: "End date (ISO)" }
        ],
        returns: "number", description: "Calculate calendar days between two dates.",
        example: 'CustomFormRules.daysBetween("2024-01-01", "2024-12-31")', isAsync: false
    },
    {
        name: "businessDaysBetween", namespace: "CustomFormRules.businessDaysBetween", category: "Date Utils",
        params: [
            { name: "startDate", type: "string", optional: false, description: "Start date (ISO)" },
            { name: "endDate", type: "string", optional: false, description: "End date (ISO)" }
        ],
        returns: "number", description: "Calculate business days between two dates (excludes weekends and US holidays).",
        example: 'CustomFormRules.businessDaysBetween("2024-01-01", "2024-01-31")', isAsync: false
    },
    {
        name: "getLastDayOfMonth", namespace: "CustomFormRules.getLastDayOfMonth", category: "Date Utils",
        params: [{ name: "dateString", type: "string", optional: false, description: "ISO date string" }],
        returns: "string", description: "Get the last day of the month for a given date.",
        example: 'CustomFormRules.getLastDayOfMonth("2024-02-01")', isAsync: false
    },
    {
        name: "formatDateRelative", namespace: "CustomFormRules.formatDateRelative", category: "Date Utils",
        params: [{ name: "dateString", type: "string", optional: false, description: "ISO date string" }],
        returns: "string", description: "Format date as relative time string.",
        example: 'CustomFormRules.formatDateRelative("2024-01-01")', isAsync: false
    },
    {
        name: "calculateAge", namespace: "CustomFormRules.calculateAge", category: "Date Utils",
        params: [{ name: "birthDateString", type: "string", optional: false, description: "Birthdate (ISO)" }],
        returns: "number", description: "Calculate age in years from a birthdate.",
        example: 'CustomFormRules.calculateAge("1990-05-15")', isAsync: false
    },
    {
        name: "isDateInRange", namespace: "CustomFormRules.isDateInRange", category: "Date Utils",
        params: [
            { name: "dateString", type: "string", optional: false, description: "Date to check (ISO)" },
            { name: "rangeStart", type: "string", optional: false, description: "Range start (ISO)" },
            { name: "rangeEnd", type: "string", optional: false, description: "Range end (ISO)" }
        ],
        returns: "boolean", description: "Check if a date falls within a range.",
        example: 'CustomFormRules.isDateInRange("2024-06-15", "2024-01-01", "2024-12-31")', isAsync: false
    },

    // ── String Utils (3) ───────────────────────────────────────────
    {
        name: "slugify", namespace: "CustomFormRules.slugify", category: "String Utils",
        params: [{ name: "text", type: "string", optional: false, description: "Input string" }],
        returns: "string", description: "Convert string to URL-safe slug.",
        example: 'CustomFormRules.slugify("Hello World!")', isAsync: false
    },
    {
        name: "camelCase", namespace: "CustomFormRules.camelCase", category: "String Utils",
        params: [{ name: "text", type: "string", optional: false, description: "Input string" }],
        returns: "string", description: "Convert string to camelCase.",
        example: 'CustomFormRules.camelCase("Hello World")', isAsync: false
    },
    {
        name: "snakeCase", namespace: "CustomFormRules.snakeCase", category: "String Utils",
        params: [{ name: "text", type: "string", optional: false, description: "Input string" }],
        returns: "string", description: "Convert string to snake_case.",
        example: 'CustomFormRules.snakeCase("Hello World")', isAsync: false
    },

    // ── Data Utils (5) ─────────────────────────────────────────────
    {
        name: "generateUUID", namespace: "CustomFormRules.generateUUID", category: "Data Utils",
        params: [], returns: "string", description: "Generate a UUID v4.",
        example: "CustomFormRules.generateUUID()", isAsync: false
    },
    {
        name: "generateRandomString", namespace: "CustomFormRules.generateRandomString", category: "Data Utils",
        params: [{ name: "length", type: "number", optional: false, description: "Desired string length" }],
        returns: "string", description: "Generate a random alphanumeric string of specified length.",
        example: "CustomFormRules.generateRandomString(16)", isAsync: false
    },
    {
        name: "flattenObject", namespace: "CustomFormRules.flattenObject", category: "Data Utils",
        params: [
            { name: "obj", type: "object", optional: false, description: "Nested object" },
            { name: "prefix", type: "string", optional: false, description: "Key prefix" }
        ],
        returns: "object", description: "Flatten a nested object into dot-notation keys.",
        example: 'CustomFormRules.flattenObject({a: {b: 1}}, "")', isAsync: false
    },
    {
        name: "objectToQueryString", namespace: "CustomFormRules.objectToQueryString", category: "Data Utils",
        params: [{ name: "obj", type: "object", optional: false, description: "Key-value object" }],
        returns: "string", description: "Convert an object to a URL query string.",
        example: 'CustomFormRules.objectToQueryString({foo: "bar", baz: 1})', isAsync: false
    },
    {
        name: "queryStringToObject", namespace: "CustomFormRules.queryStringToObject", category: "Data Utils",
        params: [{ name: "queryString", type: "string", optional: false, description: "URL query string" }],
        returns: "object", description: "Parse a URL query string into an object.",
        example: 'CustomFormRules.queryStringToObject("foo=bar&baz=1")', isAsync: false
    },

    // ── Geolocation (5) ────────────────────────────────────────────
    {
        name: "fetchLocationByZip", namespace: "CustomFormRules.fetchLocationByZip", category: "Geolocation",
        params: [{ name: "zipCode", type: "string", optional: false, description: "US ZIP code" }],
        returns: "Promise", description: "Fetch City and State by ZIP Code from external API.",
        example: 'CustomFormRules.fetchLocationByZip("90210")', isAsync: true
    },
    {
        name: "lookupZipCodeBackend", namespace: "CustomFormRules.lookupZipCodeBackend", category: "Geolocation",
        params: [{ name: "zipCode", type: "string", optional: false, description: "US ZIP code" }],
        returns: "Promise", description: "Fetch City and State by ZIP Code from AEM backend database.",
        example: 'CustomFormRules.lookupZipCodeBackend("90210")', isAsync: true
    },
    {
        name: "calculateDistance", namespace: "CustomFormRules.calculateDistance", category: "Geolocation",
        params: [
            { name: "lat1", type: "number", optional: false, description: "Latitude of point 1" },
            { name: "lon1", type: "number", optional: false, description: "Longitude of point 1" },
            { name: "lat2", type: "number", optional: false, description: "Latitude of point 2" },
            { name: "lon2", type: "number", optional: false, description: "Longitude of point 2" }
        ],
        returns: "number", description: "Calculate distance between two coordinates using the Haversine formula (miles).",
        example: "CustomFormRules.calculateDistance(40.7128, -74.0060, 34.0522, -118.2437)", isAsync: false
    },
    {
        name: "validateUSStateCode", namespace: "CustomFormRules.validateUSStateCode", category: "Geolocation",
        params: [{ name: "state", type: "string", optional: false, description: "2-letter state code" }],
        returns: "boolean", description: "Validate a US state abbreviation.",
        example: 'CustomFormRules.validateUSStateCode("CA")', isAsync: false
    },
    {
        name: "getStateName", namespace: "CustomFormRules.getStateName", category: "Geolocation",
        params: [{ name: "stateCode", type: "string", optional: false, description: "2-letter state code" }],
        returns: "string", description: "Get full state name from 2-letter abbreviation.",
        example: 'CustomFormRules.getStateName("CA")', isAsync: false
    },

    // ── File Utils (4) ─────────────────────────────────────────────
    {
        name: "validateFileType", namespace: "CustomFormRules.validateFileType", category: "File Utils",
        params: [
            { name: "fileName", type: "string", optional: false, description: "File name with extension" },
            { name: "allowedExtensions", type: "string", optional: false, description: "Comma-separated allowed extensions" }
        ],
        returns: "boolean", description: "Validate file extension against an allowed list.",
        example: 'CustomFormRules.validateFileType("doc.pdf", "pdf,doc,docx")', isAsync: false
    },
    {
        name: "formatFileSize", namespace: "CustomFormRules.formatFileSize", category: "File Utils",
        params: [{ name: "bytes", type: "number", optional: false, description: "File size in bytes" }],
        returns: "string", description: "Format file size in bytes to human-readable string.",
        example: "CustomFormRules.formatFileSize(1536000)", isAsync: false
    },
    {
        name: "isImageFile", namespace: "CustomFormRules.isImageFile", category: "File Utils",
        params: [{ name: "fileName", type: "string", optional: false, description: "File name" }],
        returns: "boolean", description: "Check if a file is an image based on its extension.",
        example: 'CustomFormRules.isImageFile("photo.jpg")', isAsync: false
    },
    {
        name: "isPDFFile", namespace: "CustomFormRules.isPDFFile", category: "File Utils",
        params: [{ name: "fileName", type: "string", optional: false, description: "File name" }],
        returns: "boolean", description: "Check if a file is a PDF.",
        example: 'CustomFormRules.isPDFFile("document.pdf")', isAsync: false
    },

    // ── Forms Portal (13) ──────────────────────────────────────────
    {
        name: "listForms", namespace: "CustomFormRules.formsPortal.listForms", category: "Forms Portal",
        params: [{ name: "filters", type: "object", optional: true, description: "Optional: { category?: string, status?: string }" }],
        returns: "Promise<Array>", description: "List all available forms from the Forms Portal.",
        example: 'CustomFormRules.formsPortal.listForms({ category: "financial" })', isAsync: true
    },
    {
        name: "getFormMetadata", namespace: "CustomFormRules.formsPortal.getFormMetadata", category: "Forms Portal",
        params: [{ name: "formPath", type: "string", optional: false, description: "AEM form container path" }],
        returns: "Promise<Object>", description: "Get metadata for a specific form.",
        example: 'CustomFormRules.formsPortal.getFormMetadata("/content/forms/af/loan")', isAsync: true
    },
    {
        name: "saveDraft", namespace: "CustomFormRules.formsPortal.saveDraft", category: "Forms Portal",
        params: [
            { name: "formPath", type: "string", optional: false, description: "AEM form container path" },
            { name: "userId", type: "string", optional: false, description: "User identifier" },
            { name: "data", type: "string", optional: false, description: "Form data (JSON string)" }
        ],
        returns: "Promise<Object>", description: "Save a form draft for a specific user.",
        example: 'CustomFormRules.formsPortal.saveDraft("/content/forms/af/loan", "user123", \'{"name":"John"}\')', isAsync: true
    },
    {
        name: "getDraft", namespace: "CustomFormRules.formsPortal.getDraft", category: "Forms Portal",
        params: [
            { name: "formPath", type: "string", optional: false, description: "AEM form container path" },
            { name: "userId", type: "string", optional: false, description: "User identifier" }
        ],
        returns: "Promise<Object>", description: "Retrieve a saved form draft.",
        example: 'CustomFormRules.formsPortal.getDraft("/content/forms/af/loan", "user123")', isAsync: true
    },
    {
        name: "listDrafts", namespace: "CustomFormRules.formsPortal.listDrafts", category: "Forms Portal",
        params: [{ name: "userId", type: "string", optional: false, description: "User identifier" }],
        returns: "Promise<Array>", description: "List all drafts for a specific user across all forms.",
        example: 'CustomFormRules.formsPortal.listDrafts("user123")', isAsync: true
    },
    {
        name: "deleteDraft", namespace: "CustomFormRules.formsPortal.deleteDraft", category: "Forms Portal",
        params: [
            { name: "formPath", type: "string", optional: false, description: "AEM form container path" },
            { name: "userId", type: "string", optional: false, description: "User identifier" }
        ],
        returns: "Promise<Object>", description: "Delete a saved form draft.",
        example: 'CustomFormRules.formsPortal.deleteDraft("/content/forms/af/loan", "user123")', isAsync: true
    },
    {
        name: "getPrefillData", namespace: "CustomFormRules.formsPortal.getPrefillData", category: "Forms Portal",
        params: [
            { name: "source", type: "string", optional: false, description: "Prefill source name (e.g. user-profile)" },
            { name: "keys", type: "string", optional: true, description: "Comma-separated keys to retrieve" }
        ],
        returns: "Promise<Object>", description: "Get prefill data from a named data source.",
        example: 'CustomFormRules.formsPortal.getPrefillData("user-profile", "email,phone")', isAsync: true
    },
    {
        name: "listPrefillSources", namespace: "CustomFormRules.formsPortal.listPrefillSources", category: "Forms Portal",
        params: [], returns: "Promise<Array>", description: "List all available prefill data sources.",
        example: "CustomFormRules.formsPortal.listPrefillSources()", isAsync: true
    },
    {
        name: "getFormAnalytics", namespace: "CustomFormRules.formsPortal.getFormAnalytics", category: "Forms Portal",
        params: [{ name: "formPath", type: "string", optional: true, description: "Optional form path" }],
        returns: "Promise<Object>", description: "Get submission analytics for a specific form or all forms.",
        example: "CustomFormRules.formsPortal.getFormAnalytics()", isAsync: true
    },
    {
        name: "prefillsFormFromMultipleSources", namespace: "CustomFormRules.formsPortal.prefillsFormFromMultipleSources", category: "Forms Portal",
        params: [{ name: "sources", type: "Array<string>", optional: false, description: "Array of source names" }],
        returns: "Promise<Object>", description: "Prefill a form by combining data from multiple sources.",
        example: 'CustomFormRules.formsPortal.prefillsFormFromMultipleSources(["user-profile", "customer-data"])', isAsync: true
    },
    {
        name: "createAutoSaver", namespace: "CustomFormRules.formsPortal.createAutoSaver", category: "Forms Portal",
        params: [
            { name: "formPath", type: "string", optional: false, description: "AEM form container path" },
            { name: "userId", type: "string", optional: false, description: "User identifier" },
            { name: "delayMs", type: "number", optional: true, description: "Debounce delay in ms (default 30000)" }
        ],
        returns: "Function", description: "Auto-save form data with debouncing. Returns a function to trigger save.",
        example: 'var save = CustomFormRules.formsPortal.createAutoSaver("/path", "user", 5000)', isAsync: false
    },
    {
        name: "searchForms", namespace: "CustomFormRules.formsPortal.searchForms", category: "Forms Portal",
        params: [{ name: "query", type: "string", optional: false, description: "Search query" }],
        returns: "Promise<Array>", description: "Search forms by title or description.",
        example: 'CustomFormRules.formsPortal.searchForms("loan")', isAsync: true
    },
    {
        name: "hasDraft", namespace: "CustomFormRules.formsPortal.hasDraft", category: "Forms Portal",
        params: [
            { name: "formPath", type: "string", optional: false, description: "AEM form container path" },
            { name: "userId", type: "string", optional: false, description: "User identifier" }
        ],
        returns: "Promise<boolean>", description: "Check if a form has a saved draft for a specific user.",
        example: 'CustomFormRules.formsPortal.hasDraft("/content/forms/af/loan", "user123")', isAsync: true
    },

    // ── Document of Record (9) ─────────────────────────────────────
    {
        name: "listDoRTemplates", namespace: "CustomFormRules.documentOfRecord.listDoRTemplates", category: "Document of Record",
        params: [], returns: "Promise<Array>", description: "List all available Document of Record templates.",
        example: "CustomFormRules.documentOfRecord.listDoRTemplates()", isAsync: true
    },
    {
        name: "getDoRTemplate", namespace: "CustomFormRules.documentOfRecord.getDoRTemplate", category: "Document of Record",
        params: [{ name: "templateId", type: "string", optional: false, description: "Template ID (e.g. DOR-STD-001)" }],
        returns: "Promise<Object>", description: "Get a specific DoR template by ID.",
        example: 'CustomFormRules.documentOfRecord.getDoRTemplate("DOR-STD-001")', isAsync: true
    },
    {
        name: "generateDoR", namespace: "CustomFormRules.documentOfRecord.generateDoR", category: "Document of Record",
        params: [
            { name: "templateId", type: "string", optional: false, description: "DoR template ID" },
            { name: "formPath", type: "string", optional: false, description: "AEM form container path" },
            { name: "submissionId", type: "string", optional: true, description: "Submission identifier" }
        ],
        returns: "Promise<Object>", description: "Generate a Document of Record from a form submission.",
        example: 'CustomFormRules.documentOfRecord.generateDoR("DOR-STD-001", "/content/forms/af/loan", "SUB-001")', isAsync: true
    },
    {
        name: "getDoR", namespace: "CustomFormRules.documentOfRecord.getDoR", category: "Document of Record",
        params: [{ name: "dorId", type: "string", optional: false, description: "DoR identifier" }],
        returns: "Promise<Object>", description: "Retrieve an existing Document of Record by ID.",
        example: 'CustomFormRules.documentOfRecord.getDoR("DOR-1234567890")', isAsync: true
    },
    {
        name: "listDoRs", namespace: "CustomFormRules.documentOfRecord.listDoRs", category: "Document of Record",
        params: [{ name: "formPath", type: "string", optional: true, description: "Optional form path filter" }],
        returns: "Promise<Object>", description: "List all generated Documents of Record, optionally filtered.",
        example: "CustomFormRules.documentOfRecord.listDoRs()", isAsync: true
    },
    {
        name: "regenerateDoR", namespace: "CustomFormRules.documentOfRecord.regenerateDoR", category: "Document of Record",
        params: [{ name: "dorId", type: "string", optional: false, description: "DoR identifier to regenerate" }],
        returns: "Promise<Object>", description: "Regenerate an existing Document of Record.",
        example: 'CustomFormRules.documentOfRecord.regenerateDoR("DOR-1234567890")', isAsync: true
    },
    {
        name: "getDoRStatus", namespace: "CustomFormRules.documentOfRecord.getDoRStatus", category: "Document of Record",
        params: [{ name: "dorId", type: "string", optional: false, description: "DoR identifier" }],
        returns: "Promise<Object>", description: "Check the processing status of a Document of Record.",
        example: 'CustomFormRules.documentOfRecord.getDoRStatus("DOR-1234567890")', isAsync: true
    },
    {
        name: "autoSelectTemplate", namespace: "CustomFormRules.documentOfRecord.autoSelectTemplate", category: "Document of Record",
        params: [{ name: "formPath", type: "string", optional: false, description: "AEM form container path" }],
        returns: "Promise<string>", description: "Auto-select the best DoR template for a given form path.",
        example: 'CustomFormRules.documentOfRecord.autoSelectTemplate("/content/forms/af/tax-form")', isAsync: true
    },
    {
        name: "autoGenerateDoR", namespace: "CustomFormRules.documentOfRecord.autoGenerateDoR", category: "Document of Record",
        params: [
            { name: "formPath", type: "string", optional: false, description: "AEM form container path" },
            { name: "submissionId", type: "string", optional: true, description: "Submission identifier" }
        ],
        returns: "Promise<Object>", description: "Generate a DoR using the auto-selected template for a form path.",
        example: 'CustomFormRules.documentOfRecord.autoGenerateDoR("/content/forms/af/tax-form", "SUB-001")', isAsync: true
    },

    // ── Correspondence Management (10) ─────────────────────────────
    {
        name: "listLetterTemplates", namespace: "CustomFormRules.correspondence.listLetterTemplates", category: "Correspondence Management",
        params: [], returns: "Promise<Array>", description: "List all available letter templates.",
        example: "CustomFormRules.correspondence.listLetterTemplates()", isAsync: true
    },
    {
        name: "getLetterTemplate", namespace: "CustomFormRules.correspondence.getLetterTemplate", category: "Correspondence Management",
        params: [{ name: "templateId", type: "string", optional: false, description: "Template ID" }],
        returns: "Promise<Object>", description: "Get a specific letter template by ID.",
        example: 'CustomFormRules.correspondence.getLetterTemplate("LTR-US-001")', isAsync: true
    },
    {
        name: "listDataDictionaries", namespace: "CustomFormRules.correspondence.listDataDictionaries", category: "Correspondence Management",
        params: [], returns: "Promise<Array>", description: "List all available data dictionaries.",
        example: "CustomFormRules.correspondence.listDataDictionaries()", isAsync: true
    },
    {
        name: "lookupDataDictionary", namespace: "CustomFormRules.correspondence.lookupDataDictionary", category: "Correspondence Management",
        params: [
            { name: "dictionaryName", type: "string", optional: false, description: "Dictionary name (e.g. us-states)" },
            { name: "key", type: "string", optional: true, description: "Optional specific key" }
        ],
        returns: "Promise<Object>", description: "Look up a value in a data dictionary.",
        example: 'CustomFormRules.correspondence.lookupDataDictionary("us-states")', isAsync: true
    },
    {
        name: "generateCorrespondence", namespace: "CustomFormRules.correspondence.generateCorrespondence", category: "Correspondence Management",
        params: [
            { name: "templateId", type: "string", optional: false, description: "Letter template ID" },
            { name: "recipientId", type: "string", optional: true, description: "Recipient identifier" }
        ],
        returns: "Promise<Object>", description: "Generate a correspondence from a letter template.",
        example: 'CustomFormRules.correspondence.generateCorrespondence("LTR-US-001", "CUST-123")', isAsync: true
    },
    {
        name: "previewCorrespondence", namespace: "CustomFormRules.correspondence.previewCorrespondence", category: "Correspondence Management",
        params: [{ name: "templateId", type: "string", optional: false, description: "Letter template ID" }],
        returns: "Promise<Object>", description: "Preview a letter template with placeholder data.",
        example: 'CustomFormRules.correspondence.previewCorrespondence("LTR-US-001")', isAsync: true
    },
    {
        name: "getCorrespondenceHistory", namespace: "CustomFormRules.correspondence.getCorrespondenceHistory", category: "Correspondence Management",
        params: [{ name: "recipientId", type: "string", optional: false, description: "Recipient identifier" }],
        returns: "Promise<Object>", description: "Get correspondence history for a specific recipient.",
        example: 'CustomFormRules.correspondence.getCorrespondenceHistory("CUST-123")', isAsync: true
    },
    {
        name: "resolveTemplate", namespace: "CustomFormRules.correspondence.resolveTemplate", category: "Correspondence Management",
        params: [
            { name: "templateString", type: "string", optional: false, description: "Template with {{placeholders}}" },
            { name: "data", type: "object", optional: false, description: "Data object for placeholders" }
        ],
        returns: "string", description: "Resolve template placeholders with actual data values.",
        example: 'CustomFormRules.correspondence.resolveTemplate("Hello {{name}}", { name: "John" })', isAsync: false
    },
    {
        name: "batchGenerateCorrespondence", namespace: "CustomFormRules.correspondence.batchGenerateCorrespondence", category: "Correspondence Management",
        params: [
            { name: "templateId", type: "string", optional: false, description: "Letter template ID" },
            { name: "recipientIds", type: "Array<string>", optional: false, description: "Array of recipient IDs" }
        ],
        returns: "Promise<Array>", description: "Batch generate correspondences for multiple recipients.",
        example: 'CustomFormRules.correspondence.batchGenerateCorrespondence("LTR-US-001", ["CUST-001", "CUST-002"])', isAsync: true
    },
    {
        name: "getTemplateCategories", namespace: "CustomFormRules.correspondence.getTemplateCategories", category: "Correspondence Management",
        params: [], returns: "Promise<Array<string>>", description: "Get template categories.",
        example: "CustomFormRules.correspondence.getTemplateCategories()", isAsync: true
    },

    // ── XFA FormCalc (9) ───────────────────────────────────────────
    {
        name: "xfaAvg", namespace: "CustomFormRules.xfa.xfaAvg", category: "XFA FormCalc",
        params: [{ name: "values", type: "Array<number|string>", optional: false, description: "Array of numeric values" }],
        returns: "number", description: "Returns the arithmetic mean of a list of numeric values.",
        example: "CustomFormRules.xfa.xfaAvg([10, 20, 30])", isAsync: false
    },
    {
        name: "xfaRound", namespace: "CustomFormRules.xfa.xfaRound", category: "XFA FormCalc",
        params: [
            { name: "value", type: "number", optional: false, description: "Number to round" },
            { name: "places", type: "number", optional: true, description: "Decimal places (default 0)" }
        ],
        returns: "number", description: "Rounds a number to a specified number of decimal places (half-up).",
        example: "CustomFormRules.xfa.xfaRound(3.14159, 2)", isAsync: false
    },
    {
        name: "xfaMin", namespace: "CustomFormRules.xfa.xfaMin", category: "XFA FormCalc",
        params: [{ name: "values", type: "Array<number|string>", optional: false, description: "Array of values" }],
        returns: "number", description: "Returns the smallest value from an array.",
        example: "CustomFormRules.xfa.xfaMin([5, 3, 8, 1])", isAsync: false
    },
    {
        name: "xfaMax", namespace: "CustomFormRules.xfa.xfaMax", category: "XFA FormCalc",
        params: [{ name: "values", type: "Array<number|string>", optional: false, description: "Array of values" }],
        returns: "number", description: "Returns the largest value from an array.",
        example: "CustomFormRules.xfa.xfaMax([5, 3, 8, 1])", isAsync: false
    },
    {
        name: "xfaSum", namespace: "CustomFormRules.xfa.xfaSum", category: "XFA FormCalc",
        params: [{ name: "values", type: "Array<number|string>", optional: false, description: "Array of values" }],
        returns: "number", description: "Returns the sum of all values in an array.",
        example: "CustomFormRules.xfa.xfaSum([10, 20, 30])", isAsync: false
    },
    {
        name: "xfaDateNow", namespace: "CustomFormRules.xfa.xfaDateNow", category: "XFA FormCalc",
        params: [], returns: "string", description: "Returns the current date as YYYYMMDD.",
        example: "CustomFormRules.xfa.xfaDateNow()", isAsync: false
    },
    {
        name: "xfaTimeNow", namespace: "CustomFormRules.xfa.xfaTimeNow", category: "XFA FormCalc",
        params: [], returns: "string", description: "Returns the current time as HHMMSS (24-hour).",
        example: "CustomFormRules.xfa.xfaTimeNow()", isAsync: false
    },
    {
        name: "xfaDateToNum", namespace: "CustomFormRules.xfa.xfaDateToNum", category: "XFA FormCalc",
        params: [{ name: "dateStr", type: "string", optional: false, description: "Date string (MM/DD/YYYY)" }],
        returns: "number", description: "Converts date string to numeric day-count since FormCalc epoch (Dec 30, 1899).",
        example: 'CustomFormRules.xfa.xfaDateToNum("01/15/2024")', isAsync: false
    },
    {
        name: "xfaNumToDate", namespace: "CustomFormRules.xfa.xfaNumToDate", category: "XFA FormCalc",
        params: [{ name: "num", type: "number", optional: false, description: "Day-count numeric value" }],
        returns: "string", description: "Converts numeric day-count back to MM/DD/YYYY.",
        example: "CustomFormRules.xfa.xfaNumToDate(45307)", isAsync: false
    },

    // ── XFA Acrobat (1) ────────────────────────────────────────────
    {
        name: "acrobatBeep", namespace: "CustomFormRules.xfa.acrobatBeep", category: "XFA Acrobat",
        params: [{ name: "cAlertType", type: "number", optional: true, description: "0=Default, 1=Stop, 2=Question, 3=Exclamation, 4=Information" }],
        returns: "boolean", description: "Plays a system alert sound. Falls back to Web Audio API in HTML5.",
        example: "CustomFormRules.xfa.acrobatBeep(0)", isAsync: false
    },

    // ── XFA Layout (2) ─────────────────────────────────────────────
    {
        name: "getFieldPageNumber", namespace: "CustomFormRules.xfa.getFieldPageNumber", category: "XFA Layout",
        params: [{ name: "fieldName", type: "string", optional: false, description: "SOM path to field" }],
        returns: "number", description: "Returns the 0-based page number that a field resides on.",
        example: 'CustomFormRules.xfa.getFieldPageNumber("form1.page1.field1")', isAsync: false
    },
    {
        name: "centerFieldHorizontally", namespace: "CustomFormRules.xfa.centerFieldHorizontally", category: "XFA Layout",
        params: [{ name: "fieldName", type: "string", optional: false, description: "SOM path to field" }],
        returns: "boolean", description: "Centers a field horizontally within its parent container.",
        example: 'CustomFormRules.xfa.centerFieldHorizontally("form1.page1.field1")', isAsync: false
    },

    // ── XFA Instance (2) ───────────────────────────────────────────
    {
        name: "getLastInstanceField", namespace: "CustomFormRules.xfa.getLastInstanceField", category: "XFA Instance",
        params: [
            { name: "instanceManagerSom", type: "string", optional: false, description: "SOM path to instance manager" },
            { name: "fieldName", type: "string", optional: false, description: "Field name within instance" }
        ],
        returns: "string | null", description: "Retrieve the value of a field within the last instance of a repeated element.",
        example: 'CustomFormRules.xfa.getLastInstanceField("form1.table1", "col1")', isAsync: false
    },
    {
        name: "clearAllInstances", namespace: "CustomFormRules.xfa.clearAllInstances", category: "XFA Instance",
        params: [{ name: "somExpression", type: "string", optional: false, description: "SOM path to repeated element" }],
        returns: "boolean", description: "Remove all instances except the first one.",
        example: 'CustomFormRules.xfa.clearAllInstances("form1.table1.row")', isAsync: false
    },

    // ── XFA Form (2) ───────────────────────────────────────────────
    {
        name: "resolveNodes", namespace: "CustomFormRules.xfa.resolveNodes", category: "XFA Form",
        params: [{ name: "somPath", type: "string", optional: false, description: "SOM path expression" }],
        returns: "Array", description: "Safely resolves multiple XFA nodes by SOM path, returning an array.",
        example: 'CustomFormRules.xfa.resolveNodes("form1.#subform[*]")', isAsync: false
    },
    {
        name: "getInvalidFields", namespace: "CustomFormRules.xfa.getInvalidFields", category: "XFA Form",
        params: [], returns: "Array<object>", description: "Returns a list of fields that failed validation with SOM paths and error messages.",
        example: "CustomFormRules.xfa.getInvalidFields()", isAsync: false
    }
];

export const CATEGORIES = [
    "Validation", "Formatting", "Financial", "Date Utils", "String Utils",
    "Data Utils", "Geolocation", "File Utils", "Forms Portal",
    "Document of Record", "Correspondence Management",
    "XFA FormCalc", "XFA Acrobat", "XFA Layout", "XFA Instance", "XFA Form"
];

export function getFunctionsByCategory(category: string): FunctionDef[] {
    return FUNCTIONS.filter(f => f.category === category);
}

export function findFunction(name: string): FunctionDef | undefined {
    return FUNCTIONS.find(f => f.name === name || f.namespace === name);
}

export function getNamespaceRoots(): string[] {
    return ["CustomFormRules", "CustomFormRules.xfa", "CustomFormRules.formsPortal", "CustomFormRules.documentOfRecord", "CustomFormRules.correspondence"];
}
