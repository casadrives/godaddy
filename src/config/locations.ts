export interface LuxembourgLocation {
  id: string;
  name: {
    en: string;
    fr: string;
    de: string;
    lb: string;
  };
  type: 'city' | 'district' | 'landmark' | 'station' | 'business' | 'residential';
  coordinates: {
    lat: number;
    lng: number;
  };
  popularTimes?: Record<string, number[]>; // Hour-by-hour popularity (0-100)
  crossBorder?: {
    country: 'FR' | 'BE' | 'DE';
    distance: number; // km to border
  };
}

export interface LuxembourgRegion {
  id: string;
  name: {
    en: string;
    fr: string;
    de: string;
    lb: string;
  };
  districts: string[];
  demandMultiplier: number; // Base fare multiplier for high-demand areas
  specialRules?: {
    minimumFare?: number;
    waitingAllowed: boolean;
    restrictions?: string[];
  };
}

export const LUXEMBOURG_LOCATIONS: LuxembourgLocation[] = [
  // Major Transport Hubs
  {
    id: 'lux_airport',
    name: {
      en: 'Luxembourg Airport',
      fr: 'Aéroport de Luxembourg',
      de: 'Flughafen Luxemburg',
      lb: 'Fluchhafen Lëtzebuerg',
    },
    type: 'station',
    coordinates: { lat: 49.6233, lng: 6.2044 },
    popularTimes: {
      weekday: [20, 15, 10, 5, 5, 15, 35, 65, 80, 70, 60, 55, 50, 45, 40, 45, 60, 75, 70, 55, 45, 35, 30, 25],
      weekend: [15, 10, 5, 5, 5, 10, 25, 45, 60, 65, 60, 55, 50, 45, 50, 55, 60, 65, 60, 50, 40, 30, 25, 20],
    },
  },
  {
    id: 'central_station',
    name: {
      en: 'Luxembourg Central Station',
      fr: 'Gare de Luxembourg',
      de: 'Luxemburg Hauptbahnhof',
      lb: 'Gare Lëtzebuerg',
    },
    type: 'station',
    coordinates: { lat: 49.6000, lng: 6.1333 },
    popularTimes: {
      weekday: [15, 10, 5, 5, 10, 35, 80, 95, 75, 60, 55, 60, 65, 60, 55, 60, 85, 90, 70, 50, 40, 35, 30, 20],
      weekend: [10, 5, 5, 5, 5, 15, 30, 45, 55, 60, 55, 50, 45, 45, 50, 55, 60, 55, 45, 35, 30, 25, 20, 15],
    },
  },

  // Business Districts
  {
    id: 'kirchberg',
    name: {
      en: 'Kirchberg',
      fr: 'Kirchberg',
      de: 'Kirchberg',
      lb: 'Kierchbierg',
    },
    type: 'business',
    coordinates: { lat: 49.6289, lng: 6.1556 },
    popularTimes: {
      weekday: [5, 5, 5, 5, 10, 25, 45, 80, 90, 75, 65, 70, 75, 70, 65, 70, 75, 65, 40, 25, 20, 15, 10, 5],
      weekend: [5, 5, 5, 5, 5, 5, 10, 15, 25, 35, 40, 45, 40, 35, 30, 25, 20, 15, 10, 10, 10, 5, 5, 5],
    },
  },
  {
    id: 'cloche_dor',
    name: {
      en: 'Cloche d\'Or',
      fr: 'Cloche d\'Or',
      de: 'Cloche d\'Or',
      lb: 'Cloche d\'Or',
    },
    type: 'business',
    coordinates: { lat: 49.5783, lng: 6.1231 },
    popularTimes: {
      weekday: [5, 5, 5, 5, 10, 20, 40, 70, 85, 75, 65, 70, 75, 70, 65, 60, 65, 55, 35, 25, 20, 15, 10, 5],
      weekend: [5, 5, 5, 5, 5, 5, 10, 25, 45, 65, 80, 85, 80, 75, 70, 65, 55, 45, 35, 25, 20, 15, 10, 5],
    },
  },

  // Cross-Border Areas
  {
    id: 'thionville_border',
    name: {
      en: 'Thionville Border',
      fr: 'Frontière Thionville',
      de: 'Grenze Thionville',
      lb: 'Grenz Diddenuewen',
    },
    type: 'landmark',
    coordinates: { lat: 49.4617, lng: 6.1367 },
    crossBorder: {
      country: 'FR',
      distance: 0.1,
    },
  },
  {
    id: 'trier_border',
    name: {
      en: 'Trier Border',
      fr: 'Frontière Trèves',
      de: 'Grenze Trier',
      lb: 'Grenz Tréier',
    },
    type: 'landmark',
    coordinates: { lat: 49.7275, lng: 6.6428 },
    crossBorder: {
      country: 'DE',
      distance: 0.1,
    },
  },

  // Popular Areas
  {
    id: 'grund',
    name: {
      en: 'Grund',
      fr: 'Grund',
      de: 'Grund',
      lb: 'Gronn',
    },
    type: 'district',
    coordinates: { lat: 49.6117, lng: 6.1319 },
    popularTimes: {
      weekday: [5, 5, 5, 5, 5, 10, 20, 30, 40, 45, 50, 55, 60, 55, 50, 55, 65, 75, 80, 75, 65, 50, 30, 15],
      weekend: [10, 5, 5, 5, 5, 5, 10, 25, 45, 60, 70, 75, 70, 65, 70, 75, 80, 85, 90, 85, 75, 60, 40, 25],
    },
  },
];

export const LUXEMBOURG_REGIONS: LuxembourgRegion[] = [
  {
    id: 'city_center',
    name: {
      en: 'City Center',
      fr: 'Centre-Ville',
      de: 'Stadtzentrum',
      lb: 'Stadzentrum',
    },
    districts: ['ville_haute', 'gare', 'grund', 'clausen'],
    demandMultiplier: 1.2,
    specialRules: {
      minimumFare: 8,
      waitingAllowed: true,
      restrictions: ['pedestrian_zones_restricted'],
    },
  },
  {
    id: 'kirchberg_plateau',
    name: {
      en: 'Kirchberg Plateau',
      fr: 'Plateau du Kirchberg',
      de: 'Kirchberg-Plateau',
      lb: 'Kierchbierg-Plateau',
    },
    districts: ['kirchberg', 'kiem', 'weimershof'],
    demandMultiplier: 1.15,
    specialRules: {
      minimumFare: 7,
      waitingAllowed: true,
    },
  },
  {
    id: 'airport_region',
    name: {
      en: 'Airport Region',
      fr: 'Région Aéroport',
      de: 'Flughafen-Region',
      lb: 'Fluchhafen-Regioun',
    },
    districts: ['findel', 'hamm', 'sandweiler'],
    demandMultiplier: 1.1,
    specialRules: {
      minimumFare: 15,
      waitingAllowed: true,
      restrictions: ['designated_pickup_zones_only'],
    },
  },
  {
    id: 'south_business',
    name: {
      en: 'Southern Business District',
      fr: 'Quartier d\'Affaires Sud',
      de: 'Südliches Geschäftsviertel',
      lb: 'Südlech Geschäftsvéierel',
    },
    districts: ['cloche_dor', 'gasperich', 'howald'],
    demandMultiplier: 1.1,
    specialRules: {
      minimumFare: 7,
      waitingAllowed: true,
    },
  },
];

// Popular pickup/dropoff points within each region
export const POPULAR_POINTS: Record<string, LuxembourgLocation[]> = {
  city_center: [
    {
      id: 'place_darmes',
      name: {
        en: 'Place d\'Armes',
        fr: 'Place d\'Armes',
        de: 'Place d\'Armes',
        lb: 'Plëss',
      },
      type: 'landmark',
      coordinates: { lat: 49.6111, lng: 6.1313 },
    },
    {
      id: 'grand_ducal',
      name: {
        en: 'Grand Ducal Palace',
        fr: 'Palais grand-ducal',
        de: 'Großherzoglicher Palast',
        lb: 'Groussherzogleche Palais',
      },
      type: 'landmark',
      coordinates: { lat: 49.6117, lng: 6.1300 },
    },
  ],
  kirchberg_plateau: [
    {
      id: 'auchan_kirchberg',
      name: {
        en: 'Auchan Kirchberg',
        fr: 'Auchan Kirchberg',
        de: 'Auchan Kirchberg',
        lb: 'Auchan Kierchbierg',
      },
      type: 'landmark',
      coordinates: { lat: 49.6261, lng: 6.1569 },
    },
    {
      id: 'philharmonie',
      name: {
        en: 'Philharmonie',
        fr: 'Philharmonie',
        de: 'Philharmonie',
        lb: 'Philharmonie',
      },
      type: 'landmark',
      coordinates: { lat: 49.6206, lng: 6.1419 },
    },
  ],
};

// Special event locations that affect demand
export const SPECIAL_EVENT_LOCATIONS: LuxembourgLocation[] = [
  {
    id: 'luxexpo',
    name: {
      en: 'Luxexpo The Box',
      fr: 'Luxexpo The Box',
      de: 'Luxexpo The Box',
      lb: 'Luxexpo The Box',
    },
    type: 'landmark',
    coordinates: { lat: 49.6283, lng: 6.1614 },
  },
  {
    id: 'rockhal',
    name: {
      en: 'Rockhal',
      fr: 'Rockhal',
      de: 'Rockhal',
      lb: 'Rockhal',
    },
    type: 'landmark',
    coordinates: { lat: 49.5017, lng: 6.0089 },
  },
];
