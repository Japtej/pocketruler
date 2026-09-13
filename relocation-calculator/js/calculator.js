/**
 * RelocateTrue - Pure Mathematical Calculator Engine
 * Handles tax brackets, standard deductions, living expenses multipliers,
 * Purchasing Power Parity (PPP), Arbitrage metrics, and Visa eligibility.
 */

/**
 * Calculates total estimated income taxes, deductions, and social contributions for a given city and gross annual salary.
 * @param {number} grossAnnualUSD 
 * @param {object} city 
 * @returns {object} Tax breakdown
 */
function calculateIncomeTax(grossAnnualUSD, city) {
  if (!city || grossAnnualUSD <= 0) {
    return {
      grossAnnualUSD: 0,
      totalTaxAnnual: 0,
      totalTaxMonthly: 0,
      effectiveTaxRate: 0,
      baseTaxAnnual: 0,
      stateTaxAnnual: 0,
      socialContributionAnnual: 0
    };
  }

  let baseTax = 0;
  const standardDeduction = city.standardDeductionUSD || 0;
  const taxableIncome = Math.max(0, grossAnnualUSD - standardDeduction);

  if (city.isFlatTax) {
    baseTax = taxableIncome * (city.flatTaxRate || 0);
  } else if (city.incomeTaxBrackets && city.incomeTaxBrackets.length > 0) {
    let prevBracketLimit = 0;
    for (const bracket of city.incomeTaxBrackets) {
      if (taxableIncome > prevBracketLimit) {
        const taxableAmountInBracket = Math.min(taxableIncome, bracket.upTo) - prevBracketLimit;
        baseTax += taxableAmountInBracket * bracket.rate;
        prevBracketLimit = bracket.upTo;
      }
      if (taxableIncome <= bracket.upTo) break;
    }
  }

  // State or municipal taxes if applicable
  const stateTaxRate = city.stateTaxRateEst || 0;
  const stateTax = grossAnnualUSD * stateTaxRate;

  // Social security / national insurance / healthcare contributions
  const socialRate = city.socialSecurityRate || 0;
  // Social security usually capped at reasonable salary ceilings (~$168k in US), apply cap
  const socialCappedIncome = Math.min(grossAnnualUSD, 170000);
  const socialContribution = socialCappedIncome * socialRate;

  const totalTaxAnnual = Math.round(baseTax + stateTax + socialContribution);
  const totalTaxMonthly = Math.round(totalTaxAnnual / 12);
  const effectiveTaxRate = grossAnnualUSD > 0 ? (totalTaxAnnual / grossAnnualUSD) : 0;

  return {
    grossAnnualUSD,
    taxableIncome,
    baseTaxAnnual: Math.round(baseTax),
    stateTaxAnnual: Math.round(stateTax),
    socialContributionAnnual: Math.round(socialContribution),
    totalTaxAnnual,
    totalTaxMonthly,
    effectiveTaxRate: Math.min(0.65, Math.max(0, effectiveTaxRate))
  };
}

/**
 * Calculates estimated monthly living expenses based on housing tier and lifestyle preference.
 * @param {object} city 
 * @param {string} housingOption - 'center' | 'outside' | 'coliving'
 * @param {string} lifestyleOption - 'frugal' | 'moderate' | 'luxury'
 * @returns {object} Categorized expense breakdown
 */
function calculateLivingExpenses(city, housingOption = 'center', lifestyleOption = 'moderate') {
  if (!city) {
    return {
      rent: 0, utilities: 0, groceries: 0, dining: 0, transport: 0,
      coworking: 0, totalMonthly: 0, totalAnnual: 0
    };
  }

  // Housing cost calculation
  let rent = city.avgRent1BedCenterUSD;
  if (housingOption === 'outside') {
    rent = city.avgRent1BedOutsideUSD;
  } else if (housingOption === 'coliving') {
    // Shared apartment or coliving space is typically ~65% of outside 1-bed
    rent = Math.round(city.avgRent1BedOutsideUSD * 0.65);
  }

  // Lifestyle multipliers
  let lifestyleMultiplier = 1.0;
  let diningMultiplier = 1.0;
  let utilityMultiplier = 1.0;

  if (lifestyleOption === 'frugal') {
    lifestyleMultiplier = 0.75;
    diningMultiplier = 0.55; // Cook more at home
    utilityMultiplier = 0.90;
  } else if (lifestyleOption === 'luxury') {
    lifestyleMultiplier = 1.45;
    diningMultiplier = 1.85; // Fine dining, nightlife, delivery
    utilityMultiplier = 1.25; // Air conditioning / heating without limit
  }

  const utilities = Math.round(city.avgMonthlyUtilitiesUSD * utilityMultiplier);
  const groceries = Math.round(city.avgMonthlyGroceriesUSD * lifestyleMultiplier);
  const dining = Math.round(city.avgDiningEntertainmentUSD * diningMultiplier);
  const transport = Math.round(city.avgLocalTransportUSD * (lifestyleOption === 'luxury' ? 1.6 : 1.0));
  const coworking = city.coworkingMonthlyUSD || 0;

  const totalMonthly = Math.round(rent + utilities + groceries + dining + transport);
  const totalAnnual = totalMonthly * 12;

  return {
    rent,
    utilities,
    groceries,
    dining,
    transport,
    coworking,
    totalMonthly,
    totalAnnual
  };
}

/**
 * Computes side-by-side Arbitrage metrics comparing Origin and Destination hubs.
 * @param {number} grossAnnualUSD 
 * @param {object} originCity 
 * @param {object} destCity 
 * @param {string} housingOption 
 * @param {string} lifestyleOption 
 * @returns {object} Comprehensive arbitrage report
 */
function calculateArbitrage(grossAnnualUSD, originCity, destCity, housingOption = 'center', lifestyleOption = 'moderate') {
  // 1. Origin Tax & Living Calculations
  const originTax = calculateIncomeTax(grossAnnualUSD, originCity);
  const originNetAnnual = Math.max(0, grossAnnualUSD - originTax.totalTaxAnnual);
  const originNetMonthly = Math.round(originNetAnnual / 12);
  const originExpenses = calculateLivingExpenses(originCity, housingOption, lifestyleOption);
  const originDiscretionaryMonthly = Math.round(originNetMonthly - originExpenses.totalMonthly);
  const originDiscretionaryAnnual = originDiscretionaryMonthly * 12;

  // 2. Destination Tax & Living Calculations
  const destTax = calculateIncomeTax(grossAnnualUSD, destCity);
  const destNetAnnual = Math.max(0, grossAnnualUSD - destTax.totalTaxAnnual);
  const destNetMonthly = Math.round(destNetAnnual / 12);
  const destExpenses = calculateLivingExpenses(destCity, housingOption, lifestyleOption);
  const destDiscretionaryMonthly = Math.round(destNetMonthly - destExpenses.totalMonthly);
  const destDiscretionaryAnnual = destDiscretionaryMonthly * 12;

  // 3. The Arbitrage Differences
  const monthlyDiscretionarySurplus = destDiscretionaryMonthly - originDiscretionaryMonthly;
  const annualDiscretionarySurplus = monthlyDiscretionarySurplus * 12;
  const monthlyExpenseDifference = destExpenses.totalMonthly - originExpenses.totalMonthly;
  const annualExpenseDifference = monthlyExpenseDifference * 12;
  const annualTaxSavings = originTax.totalTaxAnnual - destTax.totalTaxAnnual;

  // Percentage cost difference
  const costOfLivingDiffPct = originExpenses.totalMonthly > 0
    ? Math.round(((destExpenses.totalMonthly - originExpenses.totalMonthly) / originExpenses.totalMonthly) * 100)
    : 0;

  // Purchasing Power Multiplier: how much further $1 goes in destination
  const purchasingPowerMultiplier = destExpenses.totalMonthly > 0
    ? Number((originExpenses.totalMonthly / destExpenses.totalMonthly).toFixed(2))
    : 1.0;

  // Runway Multiplier: How many months of living in Destination are funded by 1 year of Relocation Savings (or Destination surplus)
  const destAnnualSavings = Math.max(0, destDiscretionaryAnnual);
  const runwayMonths = destExpenses.totalMonthly > 0
    ? Number((destAnnualSavings / destExpenses.totalMonthly).toFixed(1))
    : 0;

  // Destination equivalent gross salary: what gross salary in Destination gives the same discretionary surplus as Origin?
  const targetMonthlyTotalNeeded = originDiscretionaryMonthly + destExpenses.totalMonthly;
  const destEffectiveTax = Math.min(0.55, destTax.effectiveTaxRate);
  const equivalentGrossAnnualUSD = Math.max(
    20000,
    Math.round((targetMonthlyTotalNeeded * 12) / (1 - destEffectiveTax))
  );

  return {
    grossAnnualUSD,
    origin: {
      city: originCity,
      tax: originTax,
      netAnnual: originNetAnnual,
      netMonthly: originNetMonthly,
      expenses: originExpenses,
      discretionaryMonthly: originDiscretionaryMonthly,
      discretionaryAnnual: originDiscretionaryAnnual
    },
    destination: {
      city: destCity,
      tax: destTax,
      netAnnual: destNetAnnual,
      netMonthly: destNetMonthly,
      expenses: destExpenses,
      discretionaryMonthly: destDiscretionaryMonthly,
      discretionaryAnnual: destDiscretionaryAnnual
    },
    arbitrage: {
      monthlyDiscretionarySurplus,
      annualDiscretionarySurplus,
      monthlyExpenseDifference,
      annualExpenseDifference,
      annualTaxSavings,
      costOfLivingDiffPct,
      purchasingPowerMultiplier,
      runwayMonths,
      equivalentGrossAnnualUSD
    }
  };
}

/**
 * Checks digital nomad visa eligibility based on entered monthly gross salary.
 * @param {number} grossAnnualUSD 
 * @param {object} city 
 * @returns {object} Eligibility status and metadata
 */
function checkNomadVisaEligibility(grossAnnualUSD, city) {
  if (!city || !city.digitalNomadVisa) {
    return {
      available: false,
      eligible: false,
      userMonthlyGross: 0,
      minMonthlyIncomeUSD: 0,
      differenceMonthly: 0,
      path: 'No visa data available'
    };
  }

  const visa = city.digitalNomadVisa;
  const userMonthlyGross = Math.round(grossAnnualUSD / 12);
  const minRequired = visa.minMonthlyIncomeUSD || 0;

  if (!visa.available) {
    return {
      available: false,
      eligible: false,
      userMonthlyGross,
      minMonthlyIncomeUSD: 0,
      differenceMonthly: 0,
      name: visa.name,
      path: visa.path,
      taxIncentive: visa.taxIncentive,
      officialUrl: visa.officialUrl
    };
  }

  const eligible = userMonthlyGross >= minRequired;
  const differenceMonthly = userMonthlyGross - minRequired;

  return {
    available: true,
    eligible,
    userMonthlyGross,
    minMonthlyIncomeUSD: minRequired,
    differenceMonthly,
    shortfall: Math.max(0, -differenceMonthly),
    surplus: Math.max(0, differenceMonthly),
    name: visa.name,
    path: visa.path,
    durationMonths: visa.durationMonths,
    taxIncentive: visa.taxIncentive,
    applicationFeeUSD: visa.applicationFeeUSD,
    officialUrl: visa.officialUrl
  };
}

/**
 * Formats a number as a clean USD currency string.
 * @param {number} num 
 * @param {boolean} showDecimals 
 * @returns {string} e.g. "$12,450"
 */
function formatUSD(num, showDecimals = false) {
  if (isNaN(num)) return '$0';
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  }).format(absNum);

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats a number in the city's local currency.
 * @param {number} amountUSD 
 * @param {object} city 
 * @returns {string} e.g. "€1,200" or "฿45,000"
 */
function formatLocalCurrency(amountUSD, city) {
  if (!city || isNaN(amountUSD)) return '$0';
  const localAmount = Math.round(amountUSD * (city.exchangeRateToUSD || 1.0));
  const symbol = city.currencySymbol || '$';
  return `${symbol} ${new Intl.NumberFormat('en-US').format(localAmount)}`;
}

// Export for Node.js tests or script inclusion
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateIncomeTax,
    calculateLivingExpenses,
    calculateArbitrage,
    checkNomadVisaEligibility,
    formatUSD,
    formatLocalCurrency
  };
}
