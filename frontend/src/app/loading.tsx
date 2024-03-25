"use client"
import { useEffect, useState } from 'react';

export default function Loading() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This code runs after the component is mounted, indicating client-side rendering
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Optionally, return null or a minimal placeholder for server-side rendering
        return null;
    }

    // Your loading UI, which will only be rendered client-side
    return (
        <div>
            Hello World
        </div>
    );
}
