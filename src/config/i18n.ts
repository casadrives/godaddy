export type Locale = 'en' | 'fr' | 'de' | 'lb';

export const SUPPORTED_LOCALES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  lb: 'Lëtzebuergesch',
};

export const DEFAULT_LOCALE: Locale = 'fr';

export const TRANSLATIONS = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
    },
    payment: {
      methods: {
        card: 'Credit/Debit Card',
        sepa: 'SEPA Direct Debit',
        digicash: 'Digicash',
        payconiq: 'Payconiq',
        vpay: 'V PAY',
        cash: 'Cash',
      },
      subscription: {
        title: 'Driver Subscription',
        monthlyFee: 'Monthly Fee',
        nextPayment: 'Next Payment',
        status: {
          active: 'Active',
          inactive: 'Inactive',
          pending: 'Pending',
        },
      },
      commission: {
        title: 'Commission',
        rate: 'Commission Rate',
        earnings: 'Your Earnings',
      },
    },
    onboarding: {
      steps: {
        personal: 'Personal Information',
        documents: 'Documents',
        vehicle: 'Vehicle Details',
        payment: 'Payment Setup',
        training: 'Training',
      },
      documents: {
        license: 'Driver License',
        idCard: 'ID Card',
        insurance: 'Insurance',
        registration: 'Vehicle Registration',
        criminalRecord: 'Criminal Record',
        medical: 'Medical Certificate',
      },
    },
    reports: {
      financial: {
        title: 'Financial Report',
        period: 'Period',
        earnings: 'Total Earnings',
        rides: 'Total Rides',
        commission: 'Commission Paid',
      },
      export: {
        pdf: 'Export as PDF',
        csv: 'Export as CSV',
      },
    },
  },
  fr: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      success: 'Succès',
    },
    payment: {
      methods: {
        card: 'Carte de crédit/débit',
        sepa: 'Prélèvement SEPA',
        digicash: 'Digicash',
        payconiq: 'Payconiq',
        vpay: 'V PAY',
        cash: 'Espèces',
      },
      subscription: {
        title: 'Abonnement Chauffeur',
        monthlyFee: 'Frais Mensuel',
        nextPayment: 'Prochain Paiement',
        status: {
          active: 'Actif',
          inactive: 'Inactif',
          pending: 'En attente',
        },
      },
      commission: {
        title: 'Commission',
        rate: 'Taux de Commission',
        earnings: 'Vos Gains',
      },
    },
    onboarding: {
      steps: {
        personal: 'Informations Personnelles',
        documents: 'Documents',
        vehicle: 'Détails du Véhicule',
        payment: 'Configuration du Paiement',
        training: 'Formation',
      },
      documents: {
        license: 'Permis de Conduire',
        idCard: 'Carte d\'Identité',
        insurance: 'Assurance',
        registration: 'Carte Grise',
        criminalRecord: 'Extrait de Casier Judiciaire',
        medical: 'Certificat Médical',
      },
    },
    reports: {
      financial: {
        title: 'Rapport Financier',
        period: 'Période',
        earnings: 'Gains Totaux',
        rides: 'Courses Totales',
        commission: 'Commission Payée',
      },
      export: {
        pdf: 'Exporter en PDF',
        csv: 'Exporter en CSV',
      },
    },
  },
  de: {
    // German translations...
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      loading: 'Laden...',
      error: 'Ein Fehler ist aufgetreten',
      success: 'Erfolg',
    },
    payment: {
      methods: {
        card: 'Kredit/Debitkarte',
        sepa: 'SEPA-Lastschrift',
        digicash: 'Digicash',
        payconiq: 'Payconiq',
        vpay: 'V PAY',
        cash: 'Bargeld',
      },
      subscription: {
        title: 'Fahrer-Abonnement',
        monthlyFee: 'Monatliche Gebühr',
        nextPayment: 'Nächste Zahlung',
        status: {
          active: 'Aktiv',
          inactive: 'Inaktiv',
          pending: 'Ausstehend',
        },
      },
      commission: {
        title: 'Provision',
        rate: 'Provisionssatz',
        earnings: 'Ihre Einnahmen',
      },
    },
    onboarding: {
      steps: {
        personal: 'Persönliche Informationen',
        documents: 'Dokumente',
        vehicle: 'Fahrzeugdetails',
        payment: 'Zahlungseinrichtung',
        training: 'Schulung',
      },
      documents: {
        license: 'Führerschein',
        idCard: 'Personalausweis',
        insurance: 'Versicherung',
        registration: 'Fahrzeugschein',
        criminalRecord: 'Führungszeugnis',
        medical: 'Ärztliches Attest',
      },
    },
    reports: {
      financial: {
        title: 'Finanzbericht',
        period: 'Zeitraum',
        earnings: 'Gesamteinnahmen',
        rides: 'Gesamtfahrten',
        commission: 'Gezahlte Provision',
      },
      export: {
        pdf: 'Als PDF exportieren',
        csv: 'Als CSV exportieren',
      },
    },
  },
  lb: {
    // Luxembourgish translations...
    common: {
      save: 'Späicheren',
      cancel: 'Ofbriechen',
      confirm: 'Bestätegen',
      loading: 'Lueden...',
      error: 'E Feeler ass opgetrueden',
      success: 'Erfolleg',
    },
    payment: {
      methods: {
        card: 'Kredit/Debitkaart',
        sepa: 'SEPA-Lastschrëft',
        digicash: 'Digicash',
        payconiq: 'Payconiq',
        vpay: 'V PAY',
        cash: 'Boergeld',
      },
      subscription: {
        title: 'Chauffer-Abonnement',
        monthlyFee: 'Méintlech Käschten',
        nextPayment: 'Nächst Bezuelung',
        status: {
          active: 'Aktiv',
          inactive: 'Inaktiv',
          pending: 'An der Waart',
        },
      },
      commission: {
        title: 'Kommissioun',
        rate: 'Kommissiounssaz',
        earnings: 'Är Akommes',
      },
    },
    onboarding: {
      steps: {
        personal: 'Perséinlech Informatiounen',
        documents: 'Dokumenter',
        vehicle: 'Gefierdétails',
        payment: 'Bezuelungsariichtung',
        training: 'Formation',
      },
      documents: {
        license: 'Führerschäin',
        idCard: 'Identitéitskaart',
        insurance: 'Versécherung',
        registration: 'Gefierpabeieren',
        criminalRecord: 'Casier',
        medical: 'Medezineschen Zertifikat',
      },
    },
    reports: {
      financial: {
        title: 'Finanzbericht',
        period: 'Period',
        earnings: 'Gesamtakommes',
        rides: 'Gesamtfaarten',
        commission: 'Bezuelte Kommissioun',
      },
      export: {
        pdf: 'Als PDF exportéieren',
        csv: 'Als CSV exportéieren',
      },
    },
  },
};
