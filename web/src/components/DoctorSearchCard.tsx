import type { DoctorSearchProvider } from '../types/doctor-search.types';

interface DoctorSearchCardProps {
    doctor: DoctorSearchProvider;
}

export function DoctorSearchCard({ doctor }: DoctorSearchCardProps) {
    const loc = doctor.location;
    const specialties = (loc.specialties || doctor.specialties || [])
        .map((s) => s.description)
        .join(', ');

    const match = loc.brighterMatch;
    const patientExp = match?.brighterPatientExperienceScore;
    const reviewCount = patientExp?.description?.match(/\d+/)?.[0];

    return (
        <>
            <style>{`
                .doctor-card {
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 20px;
                    background: #ffffff;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                }
                .doctor-card__header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 6px;
                }
                .doctor-card__name {
                    font-size: 17px;
                    font-weight: 600;
                    color: #0369a1;
                    text-decoration: underline;
                    cursor: pointer;
                    line-height: 1.3;
                }
                .doctor-card__distance {
                    font-size: 14px;
                    color: #6b7280;
                    white-space: nowrap;
                    margin-left: 12px;
                    flex-shrink: 0;
                }
                .doctor-card__details {
                    font-size: 13px;
                    color: #374151;
                    margin-bottom: 4px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    align-items: center;
                }
                .doctor-card__separator {
                    color: #d1d5db;
                }
                .doctor-card__specialties {
                    font-size: 13px;
                    color: #374151;
                    margin-bottom: 14px;
                }
                .doctor-card__specialties-label {
                    font-weight: 600;
                    font-style: italic;
                }
                .doctor-card__specialties-value {
                    font-style: italic;
                }
                /* Row 4: image + ratings + plan info — horizontal on desktop */
                .doctor-card__body {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                }
                .doctor-card__avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                    object-fit: cover;
                    flex-shrink: 0;
                    background-color: #f3f4f6;
                }
                .doctor-card__ratings {
                    flex: 1;
                    min-width: 0;
                }
                .doctor-card__ratings-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 6px;
                }
                .doctor-card__ratings-list {
                    margin: 0;
                    padding-left: 20px;
                    font-size: 13px;
                    color: #374151;
                    line-height: 1.8;
                }
                .doctor-card__review-link {
                    color: #0369a1;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .doctor-card__plan {
                    min-width: 180px;
                    flex-shrink: 0;
                }
                .doctor-card__plan-title {
                    font-size: 13px;
                    color: #6b7280;
                    margin-bottom: 8px;
                }
                .doctor-card__badge-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    color: #374151;
                    margin-bottom: 4px;
                }
                .doctor-card__badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background-color: #16a34a;
                    color: white;
                    font-size: 11px;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                /* ——— Mobile-responsive overrides ——— */
                @media (max-width: 600px) {
                    .doctor-card {
                        padding: 14px;
                        border-radius: 10px;
                    }
                    .doctor-card__name {
                        font-size: 15px;
                    }
                    .doctor-card__body {
                        flex-direction: column;
                        gap: 12px;
                    }
                    .doctor-card__avatar {
                        width: 60px;
                        height: 60px;
                        border-radius: 6px;
                    }
                    .doctor-card__plan {
                        min-width: unset;
                        width: 100%;
                        border-top: 1px solid #f3f4f6;
                        padding-top: 10px;
                        margin-top: 2px;
                    }
                }
            `}</style>

            <div className="doctor-card">
                {/* Row 1: Name + Distance */}
                <div className="doctor-card__header">
                    <span className="doctor-card__name">{doctor.name}</span>
                    {loc.locationDistance && (
                        <span className="doctor-card__distance">
                            {loc.locationDistance} mi
                        </span>
                    )}
                </div>

                {/* Row 2: Facility | Address | Phone */}
                <div className="doctor-card__details">
                    {loc.facilityName && (
                        <>
                            <span>{loc.facilityName}</span>
                            <span className="doctor-card__separator">|</span>
                        </>
                    )}
                    {loc.formattedAddressResults && (
                        <span>{loc.formattedAddressResults}</span>
                    )}
                    {loc.phones?.[0] && (
                        <>
                            <span className="doctor-card__separator">|</span>
                            <span>{loc.phones[0]}</span>
                        </>
                    )}
                </div>

                {/* Row 3: Specialties */}
                {specialties && (
                    <div className="doctor-card__specialties">
                        <span className="doctor-card__specialties-label">
                            Specialties
                        </span>
                        <span className="doctor-card__specialties-value">
                            {' '}
                            : {specialties}
                        </span>
                    </div>
                )}

                {/* Row 4: Image + Ratings + Plan Info */}
                <div className="doctor-card__body">
                    {/* Profile Image */}
                    {doctor.brighterProfileImageThumbNailURL && (
                        <img
                            src={doctor.brighterProfileImageThumbNailURL}
                            alt={doctor.name}
                            className="doctor-card__avatar"
                        />
                    )}

                    {/* Ratings section */}
                    <div className="doctor-card__ratings">
                        <div className="doctor-card__ratings-title">
                            Log in to see ratings for:
                        </div>
                        <ul className="doctor-card__ratings-list">
                            <li>Professional History</li>
                            <li>
                                Patient Experience
                                {reviewCount && (
                                    <>
                                        {' - '}
                                        <span className="doctor-card__review-link">
                                            {reviewCount} Reviews
                                        </span>
                                    </>
                                )}
                            </li>
                            <li>Affordability</li>
                        </ul>
                    </div>

                    {/* Plan info */}
                    <div className="doctor-card__plan">
                        <div className="doctor-card__plan-title">
                            With selected plan...
                        </div>
                        {loc.networkName && (
                            <div className="doctor-card__badge-row">
                                <span className="doctor-card__badge">✓</span>
                                <span>
                                    {loc.networkName} – Higher benefit level
                                </span>
                            </div>
                        )}
                        {loc.acceptingNewPatientIndicator === 'Y' && (
                            <div className="doctor-card__badge-row">
                                <span className="doctor-card__badge">✓</span>
                                <span>Accepting new patients</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
