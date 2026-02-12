import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { DoctorSearchCard } from '../components/DoctorSearchCard';
import { useDoctorSearchData } from '../hooks/useDoctorSearchData';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function DoctorSearchPage() {
    const searchData = useDoctorSearchData();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canGoPrev, setCanGoPrev] = useState(false);
    const [canGoNext, setCanGoNext] = useState(false);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanGoPrev(emblaApi.canScrollPrev());
        setCanGoNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    if (!searchData) {
        return <LoadingSpinner />;
    }

    const totalSlides = searchData.doctors.length;

    return (
        <div
            style={{
                maxWidth: '860px',
                margin: '0 auto',
                padding: '16px 20px',
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                backgroundColor: '#ffffff',
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    paddingBottom: '8px',
                    borderBottom: '2px solid #e5e7eb',
                }}
            >
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    Showing {searchData.doctors.length} of {searchData.totalCount}{' '}
                    results within {searchData.searchRadius} miles
                </span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    {selectedIndex + 1} / {totalSlides}
                </span>
            </div>

            {/* Carousel */}
            <div style={{ position: 'relative' }}>
                {/* Embla viewport */}
                <div
                    ref={emblaRef}
                    style={{ overflow: 'hidden', borderRadius: '12px' }}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: '0px',
                        }}
                    >
                        {searchData.doctors.map((doctor) => (
                            <div
                                key={doctor.providerId}
                                style={{
                                    flex: '0 0 100%',
                                    minWidth: 0,
                                    padding: '0 4px',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <DoctorSearchCard doctor={doctor} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prev / Next buttons */}
                {totalSlides > 1 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            disabled={!canGoPrev}
                            aria-label="Previous doctor"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '-16px',
                                transform: 'translateY(-50%)',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: '1px solid #e5e7eb',
                                backgroundColor: canGoPrev ? '#ffffff' : '#f9fafb',
                                color: canGoPrev ? '#374151' : '#d1d5db',
                                cursor: canGoPrev ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                fontWeight: 700,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s',
                                zIndex: 2,
                            }}
                        >
                            ‹
                        </button>
                        <button
                            onClick={scrollNext}
                            disabled={!canGoNext}
                            aria-label="Next doctor"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                right: '-16px',
                                transform: 'translateY(-50%)',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: '1px solid #e5e7eb',
                                backgroundColor: canGoNext ? '#ffffff' : '#f9fafb',
                                color: canGoNext ? '#374151' : '#d1d5db',
                                cursor: canGoNext ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                fontWeight: 700,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s',
                                zIndex: 2,
                            }}
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {/* Dot indicators */}
            {totalSlides > 1 && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '16px',
                    }}
                >
                    {searchData.doctors.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => emblaApi?.scrollTo(idx)}
                            aria-label={`Go to doctor ${idx + 1}`}
                            style={{
                                width: selectedIndex === idx ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor:
                                    selectedIndex === idx ? '#0369a1' : '#d1d5db',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
