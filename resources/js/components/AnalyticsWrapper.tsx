import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';
import { useSectionTracking } from '@/hooks/use-section-tracking';
import { useDwellTime } from '@/hooks/use-dwell-time';

export default function AnalyticsWrapper() {
    const { trackVisit } = useAnalytics();
    useScrollTracking();
    useDwellTime();
    useSectionTracking();

    useEffect(() => {
        trackVisit();
    }, [trackVisit]);

    return null;
}
