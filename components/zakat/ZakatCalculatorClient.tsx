'use client';

import { useMemo, useState } from 'react';
import { Banknote, Coins, Gem, Scale, Wallet, FileText, HandCoins, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/components/ui/utils';

const ZAKAT_RATE = 0.025;

interface Currency {
  code: string;
  label: string;
  symbol: string;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', label: 'US Dollar (USD)', symbol: '$' },
  { code: 'EUR', label: 'Euro (EUR)', symbol: '€' },
  { code: 'GBP', label: 'British Pound (GBP)', symbol: '£' },
  { code: 'PKR', label: 'Pakistani Rupee (PKR)', symbol: '₨' },
  { code: 'SAR', label: 'Saudi Riyal (SAR)', symbol: '﷼' },
  { code: 'AED', label: 'UAE Dirham (AED)', symbol: 'د.إ' },
  { code: 'INR', label: 'Indian Rupee (INR)', symbol: '₹' },
  { code: 'CAD', label: 'Canadian Dollar (CAD)', symbol: '$' },
  { code: 'AUD', label: 'Australian Dollar (AUD)', symbol: '$' },
];

const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;

const GOLD_DEFAULT_PRICE = 62.5; // USD per gram
const SILVER_DEFAULT_PRICE = 0.75; // USD per gram

function parseNum(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function formatMoney(value: number, symbol: string): string {
  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function ZakatCalculatorClient() {
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [nisabBasis, setNisabBasis] = useState<'silver' | 'gold' | 'custom'>('silver');
  const [goldPrice, setGoldPrice] = useState(String(GOLD_DEFAULT_PRICE));
  const [silverPrice, setSilverPrice] = useState(String(SILVER_DEFAULT_PRICE));
  const [customNisab, setCustomNisab] = useState('');

  const [cash, setCash] = useState('');
  const [goldGrams, setGoldGrams] = useState('');
  const [silverGrams, setSilverGrams] = useState('');
  const [investments, setInvestments] = useState('');
  const [business, setBusiness] = useState('');
  const [receivables, setReceivables] = useState('');
  const [debts, setDebts] = useState('');

  const currency: Currency =
    CURRENCIES.find((c) => c.code === currencyCode) ?? {
      code: 'USD',
      label: 'US Dollar (USD)',
      symbol: '$',
    };

  const nisab = useMemo(() => {
    if (nisabBasis === 'custom') {
      return parseNum(customNisab);
    }
    if (nisabBasis === 'gold') {
      return GOLD_NISAB_GRAMS * parseNum(goldPrice);
    }
    return SILVER_NISAB_GRAMS * parseNum(silverPrice);
  }, [nisabBasis, goldPrice, silverPrice, customNisab]);

  const breakdown = useMemo(
    () => [
      { label: 'Cash & bank balance', value: parseNum(cash), icon: Banknote },
      {
        label: `Gold (${goldGrams || 0} g)`,
        value: parseNum(goldGrams) * parseNum(goldPrice),
        icon: Gem,
      },
      {
        label: `Silver (${silverGrams || 0} g)`,
        value: parseNum(silverGrams) * parseNum(silverPrice),
        icon: Coins,
      },
      { label: 'Investments & stocks', value: parseNum(investments), icon: Scale },
      { label: 'Business inventory & goods', value: parseNum(business), icon: Wallet },
      { label: 'Money owed to you', value: parseNum(receivables), icon: FileText },
    ],
    [cash, goldGrams, goldPrice, silverGrams, silverPrice, investments, business, receivables]
  );

  const totalAssets = useMemo(() => breakdown.reduce((sum, item) => sum + item.value, 0), [breakdown]);
  const deductibleDebts = parseNum(debts);
  const netZakatable = Math.max(0, totalAssets - deductibleDebts);
  const isAboveNisab = nisab > 0 && netZakatable >= nisab;
  const zakatDue = isAboveNisab ? netZakatable * ZAKAT_RATE : 0;

  const nisabLabel =
    nisabBasis === 'gold'
      ? `${GOLD_NISAB_GRAMS}g gold`
      : nisabBasis === 'silver'
        ? `${SILVER_NISAB_GRAMS}g silver`
        : 'custom value';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-3">
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
              Zakat Calculator
            </span>
            <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
              الزكاة
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Estimate your due Zakat at 2.5% on wealth above the Nisab threshold.
          </p>
        </div>
      </div>

      {/* Nisab banner */}
      <Card
        className={cn(
          'border-2 transition-colors duration-200',
          isAboveNisab ? 'border-lime/30 bg-lime/5' : 'border-border/40 bg-surface-elevated'
        )}
      >
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border',
              isAboveNisab
                ? 'bg-lime/10 text-lime border-lime/25'
                : 'bg-primary/10 text-primary border-primary/20'
            )}
          >
            <Scale className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Nisab threshold ({nisabLabel})
            </p>
            <p className="text-2xl font-bold text-text tabular-nums">
              {formatMoney(nisab, currency.symbol)}
            </p>
          </div>
          <div className="flex-1 sm:max-w-xs min-w-0 text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Net Zakatable wealth
            </p>
            <p className={cn('text-2xl font-bold tabular-nums', isAboveNisab ? 'text-lime' : 'text-text')}>
              {formatMoney(netZakatable, currency.symbol)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Currency + Nisab basis */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Currency"
          options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
          value={currencyCode}
          onChange={(v) => setCurrencyCode(v as string)}
        />
        <Select
          label="Nisab basis"
          options={[
            { value: 'silver', label: 'Silver (595g)' },
            { value: 'gold', label: 'Gold (85g)' },
            { value: 'custom', label: 'Custom value' },
          ]}
          value={nisabBasis}
          onChange={(v) => setNisabBasis(v as 'silver' | 'gold' | 'custom')}
        />
        {nisabBasis === 'custom' ? (
          <Input
            label="Custom Nisab value"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={customNisab}
            onChange={(e) => setCustomNisab(e.target.value)}
            placeholder="0.00"
          />
        ) : (
          <div className="text-sm text-text-muted pt-6 hidden sm:block">
            Prices are entered below and used to compute the Nisab automatically.
          </div>
        )}
      </div>

      {/* Metal prices */}
      {(nisabBasis === 'gold' || nisabBasis === 'silver') && (
        <Card className="bg-surface-elevated border border-border/40 shadow-sm">
          <CardHeader className="border-b border-border/40">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Metal prices (per gram, {currency.code})
            </h2>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Gold price per gram"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={goldPrice}
              onChange={(e) => setGoldPrice(e.target.value)}
              helperText="Used for both Nisab and your gold holdings."
            />
            <Input
              label="Silver price per gram"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={silverPrice}
              onChange={(e) => setSilverPrice(e.target.value)}
              helperText="Used for both Nisab and your silver holdings."
            />
          </CardContent>
        </Card>
      )}

      {/* Assets */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <HandCoins className="w-4 h-4" />
            Your Zakatable wealth
          </h2>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Cash & bank balance"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            placeholder="0.00"
            helperText="Cash on hand, bank and savings accounts."
          />
          <Input
            label="Gold (grams)"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={goldGrams}
            onChange={(e) => setGoldGrams(e.target.value)}
            placeholder="0"
            helperText="Jewellery and gold held for savings."
          />
          <Input
            label="Silver (grams)"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={silverGrams}
            onChange={(e) => setSilverGrams(e.target.value)}
            placeholder="0"
            helperText="Silver jewellery and holdings."
          />
          <Input
            label="Investments & stocks"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={investments}
            onChange={(e) => setInvestments(e.target.value)}
            placeholder="0.00"
            helperText="Current market value of shares, funds, crypto."
          />
          <Input
            label="Business inventory & goods"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="0.00"
            helperText="Trading goods and merchandise."
          />
          <Input
            label="Money owed to you"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={receivables}
            onChange={(e) => setReceivables(e.target.value)}
            placeholder="0.00"
            helperText="Loans you gave that are likely to be repaid."
          />
        </CardContent>
      </Card>

      {/* Debts */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40">
          <h2 className="text-sm font-bold uppercase tracking-wider text-secondary flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Deductible debts
          </h2>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Debts you owe"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={debts}
            onChange={(e) => setDebts(e.target.value)}
            placeholder="0.00"
            helperText="Immediate liabilities — subtracted before Zakat is calculated."
          />
          <div className="sm:pt-6 text-sm text-text-muted">
            Net Zakatable = total assets − debts.
          </div>
        </CardContent>
      </Card>

      {/* Breakdown + result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-surface-elevated border border-border/40 shadow-sm">
          <CardHeader className="border-b border-border/40">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
              Wealth breakdown
            </h2>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <item.icon className="w-4 h-4 text-primary shrink-0" />
                  <span>{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-text tabular-nums">
                  {formatMoney(item.value, currency.symbol)}
                </span>
              </div>
            ))}
            <div className="border-t border-border/40 pt-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-text">Total assets</span>
              <span className="text-base font-bold text-text tabular-nums">
                {formatMoney(totalAssets, currency.symbol)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-text">− Debts</span>
              <span className="text-sm font-semibold text-text-muted tabular-nums">
                {formatMoney(deductibleDebts, currency.symbol)}
              </span>
            </div>
            <div className="border-t border-border/40 pt-3 flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-text">Net Zakatable</span>
              <span className="text-base font-bold text-text tabular-nums">
                {formatMoney(netZakatable, currency.symbol)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'border-2 transition-colors duration-200',
            isAboveNisab ? 'border-lime/30 bg-lime/5' : 'border-border/40 bg-surface-elevated'
          )}
        >
          <CardHeader className="border-b border-border/40">
            <h2 className="text-sm font-bold uppercase tracking-wider text-lime">
              Your Zakat due
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-4xl sm:text-5xl font-bold text-text tabular-nums">
              {formatMoney(zakatDue, currency.symbol)}
            </p>
            <p className="text-sm text-text-muted mt-2">
              {isAboveNisab
                ? `2.5% of ${formatMoney(netZakatable, currency.symbol)} — your wealth exceeds the Nisab of ${formatMoney(nisab, currency.symbol)}.`
                : `You are below the Nisab of ${formatMoney(nisab, currency.symbol)}, so no Zakat is currently due.`}
            </p>
            {isAboveNisab && (
              <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-secondary/10 border border-secondary/20 px-3.5 py-3 text-xs text-secondary">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  This is an estimate. Zakat is due once wealth has been held above the Nisab
                  for a full lunar year (hawl). Please verify with a trusted scholar or authority.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}