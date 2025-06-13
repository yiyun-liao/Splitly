import { Suspense } from 'react';
import LandingClient from './LandingClient';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export default function HomePage() {
    return (
        <Suspense fallback={<LoadingScreen text="載入中…" />}>
            <LandingClient />
        </Suspense>
    );
}

