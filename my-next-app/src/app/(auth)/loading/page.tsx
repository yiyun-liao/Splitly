import { Suspense } from 'react';
import LoadingDataPage from './LoadingClient';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export default function LoadingPage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <LoadingDataPage />
        </Suspense>
    );
}

