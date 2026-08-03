'use client';

import { SWRConfig } from 'swr';
import type { SWRConfiguration } from 'swr';

const swrConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
};

export function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig value={swrConfig}>
            {children}
        </SWRConfig>
    );
}