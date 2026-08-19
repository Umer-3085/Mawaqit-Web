import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { ZakatCalculatorClient } from '@/components/zakat/ZakatCalculatorClient';

export const metadata: Metadata = {
  title: 'Zakat Calculator — Mawaqit مواقيت',
  description:
    'Calculate your Zakat with the Mawaqit Zakat calculator. Estimate Nisab and your due Zakat on cash, gold, silver and other assets.',
};

export default function ZakatPage() {
  return (
    <PageContainer>
      <ZakatCalculatorClient />
    </PageContainer>
  );
}