import { Suspense } from 'react';
import LandingClient from './LandingClient';

export default function HomePage() {
    return (
        // <Suspense fallback={<p>載入中中中...</p>}>
            <LandingClient />
        // </Suspense>
    );
}

