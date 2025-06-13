import { Suspense } from 'react';
import LoadingDataPage from './LoadingClient';

export default function LoadingPage() {
    return (
        // <Suspense fallback={<p>載入中中中...</p>}>
            <LoadingDataPage />
        // </Suspense>
    );
}

