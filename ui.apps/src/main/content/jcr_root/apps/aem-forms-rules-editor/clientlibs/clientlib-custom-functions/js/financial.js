/**
 * Financial calculation rules for AEM Forms Rules Editor.
 * Loan, interest, tax, discount, and payment calculations.
 */

(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};

    /**
     * Calculate monthly loan payment (amortization formula).
     * @name calculateMonthlyPayment
     * @function
     * @param {number} principal The principal loan amount.
     * @param {number} annualInterestRate The annual interest rate in percent.
     * @param {number} termMonths The term of the loan in months.
     * @return {number} Monthly payment amount.
     */
    window.CustomFormRules.calculateMonthlyPayment = function (principal, annualInterestRate, termMonths) {
        var p = Number(principal);
        var r = Number(annualInterestRate);
        var t = Number(termMonths);
        if (isNaN(p) || isNaN(r) || isNaN(t)) return 0;
        if (p <= 0 || t <= 0 || r < 0) return 0;

        var monthlyRate = (r / 100) / 12;
        if (monthlyRate === 0) return parseFloat((p / t).toFixed(2));

        var payment = (p * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -t));
        if (isNaN(payment) || !isFinite(payment)) return 0;
        return parseFloat(payment.toFixed(2));
    };

    /**
     * Calculate compound interest: A = P(1 + r/n)^(nt).
     * @name calculateCompoundInterest
     * @function
     * @param {number} principal The initial principal.
     * @param {number} annualRate Annual interest rate in percent.
     * @param {number} compoundsPerYear Times interest compounds per year.
     * @param {number} years Number of years.
     * @return {number} Total amount after interest.
     */
    window.CustomFormRules.calculateCompoundInterest = function (principal, annualRate, compoundsPerYear, years) {
        var P = Number(principal);
        var r = Number(annualRate) / 100;
        var n = Number(compoundsPerYear);
        var t = Number(years);
        if (isNaN(P) || isNaN(r) || isNaN(n) || isNaN(t)) return 0;
        if (P <= 0 || n <= 0 || t < 0) return 0;

        var amount = P * Math.pow(1 + r / n, n * t);
        return parseFloat(amount.toFixed(2));
    };

    /**
     * Calculate simple interest: I = P * r * t.
     * @name calculateSimpleInterest
     * @function
     * @param {number} principal The principal amount.
     * @param {number} annualRate Annual interest rate in percent.
     * @param {number} years Number of years.
     * @return {number} Interest earned.
     */
    window.CustomFormRules.calculateSimpleInterest = function (principal, annualRate, years) {
        var P = Number(principal);
        var r = Number(annualRate) / 100;
        var t = Number(years);
        if (isNaN(P) || isNaN(r) || isNaN(t)) return 0;
        return parseFloat((P * r * t).toFixed(2));
    };

    /**
     * Calculate loan payoff date from start date, principal, rate, and payment.
     * @name calculateLoanPayoffDate
     * @function
     * @param {string} startDate The start date (YYYY-MM-DD).
     * @param {number} principal The principal loan amount.
     * @param {number} annualRate Annual interest rate in percent.
     * @param {number} monthlyPayment The monthly payment amount.
     * @return {string} Payoff date (YYYY-MM-DD), or "N/A" if payment won't cover interest.
     */
    window.CustomFormRules.calculateLoanPayoffDate = function (startDate, principal, annualRate, monthlyPayment) {
        var balance = Number(principal);
        var monthlyRate = Number(annualRate) / 100 / 12;
        var payment = Number(monthlyPayment);
        if (isNaN(balance) || isNaN(monthlyRate) || isNaN(payment) || balance <= 0 || payment <= 0) return "N/A";

        var minPayment = balance * monthlyRate;
        if (payment <= minPayment) return "N/A";

        var months = 0;
        var maxMonths = 600;
        while (balance > 0 && months < maxMonths) {
            var interest = balance * monthlyRate;
            balance = balance + interest - payment;
            months++;
        }
        if (months >= maxMonths) return "N/A";

        var d = new Date(startDate || Date.now());
        d.setMonth(d.getMonth() + months);
        var y = d.getFullYear();
        var m = ("0" + (d.getMonth() + 1)).slice(-2);
        var day = ("0" + d.getDate()).slice(-2);
        return y + "-" + m + "-" + day;
    };

    /**
     * Calculate APR from loan details using Newton's method / bisection.
     * @name calculateAPR
     * @function
     * @param {number} loanAmount The loan amount.
     * @param {number} monthlyPayment The monthly payment.
     * @param {number} termMonths The term in months.
     * @return {number} APR in percent.
     */
    window.CustomFormRules.calculateAPR = function (loanAmount, monthlyPayment, termMonths) {
        var loan = Number(loanAmount);
        var payment = Number(monthlyPayment);
        var months = Number(termMonths);
        if (isNaN(loan) || isNaN(payment) || isNaN(months) || loan <= 0 || payment <= 0 || months <= 0) return 0;
        if (payment * months <= loan) return 0;

        var low = 0;
        var high = 10;
        for (var i = 0; i < 100; i++) {
            var mid = (low + high) / 2;
            var pv = payment * (1 - Math.pow(1 + mid, -months)) / mid;
            if (Math.abs(pv - loan) < 0.001) break;
            if (pv > loan) low = mid;
            else high = mid;
        }
        return parseFloat(((low + high) / 2 * 12 * 100).toFixed(2));
    };

    /**
     * Calculate tip amount and total with optional split.
     * @name calculateTip
     * @function
     * @param {number} amount The bill amount.
     * @param {number} tipPercent The tip percentage (e.g., 20 for 20%).
     * @param {number} splitAmong Number of people to split (optional, default 1).
     * @return {object} {tip, total, perPerson}
     */
    window.CustomFormRules.calculateTip = function (amount, tipPercent, splitAmong) {
        var a = Number(amount);
        var tp = Number(tipPercent);
        var split = Number(splitAmong) || 1;
        if (isNaN(a) || isNaN(tp) || a < 0 || tp < 0) return { tip: 0, total: 0, perPerson: 0 };

        var tip = parseFloat((a * tp / 100).toFixed(2));
        var total = parseFloat((a + tip).toFixed(2));
        var perPerson = parseFloat((total / split).toFixed(2));
        return { tip: tip, total: total, perPerson: perPerson };
    };

    /**
     * Calculate discount (percentage or fixed amount).
     * @name calculateDiscount
     * @function
     * @param {number} price The original price.
     * @param {number} discount The discount value.
     * @param {string} type "percent" or "fixed" (default "percent").
     * @return {object} {finalPrice, savings, discountAmount}
     */
    window.CustomFormRules.calculateDiscount = function (price, discount, type) {
        var p = Number(price);
        var d = Number(discount);
        if (isNaN(p) || isNaN(d) || p < 0) return { finalPrice: 0, savings: 0, discountAmount: 0 };

        var savings = 0;
        if ((type || "percent") === "percent") {
            savings = parseFloat((p * d / 100).toFixed(2));
        } else {
            savings = Math.min(d, p);
        }
        return {
            finalPrice: parseFloat((p - savings).toFixed(2)),
            savings: savings,
            discountAmount: savings
        };
    };

    /**
     * Generate simplified amortization schedule.
     * @name calculateAmortization
     * @function
     * @param {number} principal The loan principal.
     * @param {number} annualRate Annual interest rate in percent.
     * @param {number} termMonths The term in months.
     * @return {array} Array of {month, payment, principal, interest, balance} objects.
     */
    window.CustomFormRules.calculateAmortization = function (principal, annualRate, termMonths) {
        var p = Number(principal);
        var r = Number(annualRate) / 100 / 12;
        var t = Number(termMonths);
        if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || t <= 0) return [];

        var payment = (r === 0) ? p / t : (p * r) / (1 - Math.pow(1 + r, -t));
        var balance = p;
        var schedule = [];

        for (var m = 1; m <= t; m++) {
            var interestPayment = balance * r;
            var principalPayment = payment - interestPayment;
            balance -= principalPayment;
            if (balance < 0) balance = 0;

            schedule.push({
                month: m,
                payment: parseFloat(payment.toFixed(2)),
                principal: parseFloat(principalPayment.toFixed(2)),
                interest: parseFloat(interestPayment.toFixed(2)),
                balance: parseFloat(balance.toFixed(2))
            });
        }
        return schedule;
    };

})(window);
