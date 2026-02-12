// Types for the doctor search results that map directly to the mock JSON structure

export interface DoctorSearchProvider {
    name: string;
    providerId: string;
    brighterProfileImageThumbNailURL?: string;
    degrees?: string[];
    specialties?: Array<{ code: string; description: string }>;
    yearsOfExperience?: string;
    location: DoctorSearchLocation;
}

export interface DoctorSearchLocation {
    facilityName?: string;
    streetName?: string;
    city?: string;
    stateCode?: string;
    zipCode?: string;
    locationDistance?: string;
    phones?: string[];
    acceptingNewPatientIndicator?: string;
    networkName?: string;
    networkTierCode?: string;
    formattedAddressResults?: string;
    specialties?: Array<{ code: string; description: string }>;
    brighterMatch?: {
        brighterOverallScore?: { score?: string };
        brighterAffordabilityScore?: { score?: string; description?: string };
        brighterProfessionalHistoryScore?: { score?: string; description?: string };
        brighterPatientExperienceScore?: { score?: string; description?: string };
    };
}

export interface DoctorSearchResult {
    doctors: DoctorSearchProvider[];
    totalCount: string;
    searchRadius: number;
}
