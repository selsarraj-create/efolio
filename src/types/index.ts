export interface ModelStats {
    height: string;
    bust: string;
    waist: string;
    hips: string;
    shoes: string;
    eyes: string;
    hair: string;
}

export interface PersonalInfo {
    name: string;
    email: string;
    copyrightYear: number;
    bio?: string;
}

export interface ModelImages {
    profile: string;
    hero: string;
    portfolio: string[];
}

export interface ModelConfig {
    personalInfo: PersonalInfo;
    stats: ModelStats;
    images: ModelImages;
    password?: string;
    _siteId?: string;
    _storage?: string;
}
