export interface EnsembleMember {
  id: string;
  name: string;
  role: string;
  instruments: string[];
  bio: string;
  tooltip: string;
  stageImage: string;
  portraitImage: string;
  stagePosition: {
    desktop: { left: string; top: string; width: string; zIndex: number };
    mobile: { left: string; top: string; width: string; zIndex: number };
  };
}

export interface ConcertEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  city: string;
  description: string;
  link?: string;
  imageUrl: string;
  isUpcoming: boolean;
  ticketInfo?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  duration?: string;
}

export const ASSETS = {
  logo: '/logo-pot.png',
  navLogo: 'https://olla-podrida.de/wp-content/uploads/2024/07/2024_07_15_Logo_Olla-Podrida_V1_1.png',
  logoBackground: 'https://olla-podrida.de/wp-content/uploads/2024/07/Logo-Background.png',
  menuBackgroundDesktop: 'https://olla-podrida.de/wp-content/uploads/2024/07/Menu-Background-2048x238.png',
  menuBackgroundMobile: 'https://olla-podrida.de/wp-content/uploads/2024/07/Menu-Background-768x89.png',
  heroBackgroundDesktop: 'https://olla-podrida.de/wp-content/uploads/2024/07/Hintergrund-Header-2-2-scaled.webp',
  heroBackgroundMobile: 'https://olla-podrida.de/wp-content/uploads/2024/07/Hintergrund-Header_mobile.webp',
  smokeBottom: 'https://olla-podrida.de/wp-content/uploads/2024/07/Rauch5-1.png',
  smokeAlt: 'https://olla-podrida.de/wp-content/uploads/2024/07/Rauch-neu.webp',
  footerSeal: 'https://olla-podrida.de/wp-content/uploads/2024/07/3_Zeichenflaeche-1-Kopie-10-1024x1024.png',
  ornamentBanner: 'https://olla-podrida.de/wp-content/uploads/2024/07/2024_07_22_Elemente_Olla-Podrida_Zeichenflaeche-1-1024x611.png',
  ribbonPaper: 'https://olla-podrida.de/wp-content/uploads/2024/07/SchleifePapier.webp',
  favicon: 'https://olla-podrida.de/wp-content/uploads/2024/07/Favicon2-2.png'
};

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'riu-riu-chiu',
    title: 'Riu Riu Chiu',
    subtitle: 'Live in Atter (Spanisches Renaissance-Villancico)',
    src: '/audio/riu-riu-chiu.mp3',
    duration: '2:45'
  },
  {
    id: 'pastime-with-good-company',
    title: 'Pastime with Good Company',
    subtitle: 'Live in Atter (König Heinrich VIII)',
    src: 'https://olla-podrida.de/wp-content/uploads/2024/07/Pastime-with-good-company-live-in-Atter.mp3',
    duration: '2:15'
  }
];

export const ENSEMBLE_MEMBERS: EnsembleMember[] = [
  {
    id: 'susanne',
    name: 'Susanne',
    role: 'Ensembleleitung, Flöten & Gesang',
    instruments: ['Blockflöten (Sopran bis Bass)', 'Gemshorn', 'Renaissanceflöten', 'Gesang'],
    bio: 'Susanne leitet das Ensemble mit unverwechselbarem Gespür für mittelalterliche Klangwelten und historische Phrasierung.',
    tooltip: 'Susanne spielt vergnügt auf der Flöte',
    stageImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Susanne-1.webp',
    portraitImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Susanne_klein.webp',
    stagePosition: {
      desktop: { left: '30%', top: '32%', width: '32rem', zIndex: 10 },
      mobile: { left: '8%', top: '41%', width: '63vw', zIndex: 10 }
    }
  },
  {
    id: 'ruth',
    name: 'Ruth',
    role: 'Harfe, Psalter & Gesang',
    instruments: ['Keltische Harfe', 'Psalter', 'Perkussion', 'Gesang'],
    bio: 'Ruth verzaubert mit filigranen Saitenklängen und warmen Melodiebögen, die den Stücken eine traumhafte Tiefe verleihen.',
    tooltip: 'Ruth',
    stageImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Ruth_web_5.webp',
    portraitImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Ruth_2_klein.webp',
    stagePosition: {
      desktop: { left: '47%', top: '47%', width: '22rem', zIndex: 9 },
      mobile: { left: '41%', top: '48%', width: '45vw', zIndex: 9 }
    }
  },
  {
    id: 'lutz',
    name: 'Lutz',
    role: 'Historische Trommeln, Sackpfeifen & Gesang',
    instruments: ['Landsknechtstrommel', 'Davul', 'Darabuka', 'Sackpfeifen', 'Gesang'],
    bio: 'Lutz sorgt für das rhythmische Fundament und die pulsierende Energie historischer Tänze und Marschweisen.',
    tooltip: 'Lutz',
    stageImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Lutz.webp',
    portraitImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Lutz_klein.png',
    stagePosition: {
      desktop: { left: '39%', top: '25%', width: '25rem', zIndex: 8 },
      mobile: { left: '24%', top: '33%', width: '50vw', zIndex: 8 }
    }
  },
  {
    id: 'sandra',
    name: 'Sandra',
    role: 'Gesang, Perkussion & Flöte',
    instruments: ['Gesang', 'Perkussion', 'Schellenkranz', 'Flöten'],
    bio: 'Sandra bereichert das Ensemble mit ausdrucksstarkem Gesang und dynamischen rhythmischen Akzenten.',
    tooltip: 'Sandra',
    stageImage: 'https://olla-podrida.de/wp-content/uploads/2024/10/2024_Sandra_Olla-Podrida_web_2.webp',
    portraitImage: 'https://olla-podrida.de/wp-content/uploads/2024/10/2024_Sandra_2-Ebene-2-1.webp',
    stagePosition: {
      desktop: { left: '54%', top: '24%', width: '23rem', zIndex: 7 },
      mobile: { left: '50%', top: '35%', width: '47vw', zIndex: 7 }
    }
  },
  {
    id: 'silke',
    name: 'Silke',
    role: 'Laute, Cister & Gesang',
    instruments: ['Renaissancelaute', 'Cister', 'Saiteninstrumente', 'Gesang'],
    bio: 'Silkes feines Lautenspiel verbindet Melodie und Begleitung zu einem kunstvoll gewebten harmonischen Teppich.',
    tooltip: 'Silke',
    stageImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Silke.webp',
    portraitImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Silke_2_klein.webp',
    stagePosition: {
      desktop: { left: '26%', top: '22%', width: '21rem', zIndex: 7 },
      mobile: { left: '0%', top: '32%', width: '42vw', zIndex: 7 }
    }
  },
  {
    id: 'klemens',
    name: 'Klemens',
    role: 'Krummhörner, Sackpfeifen & Gesang',
    instruments: ['Krummhörner', 'Renaissance-Sackpfeife', 'Blasinstrumente', 'Gesang'],
    bio: 'Klemens lässt die charakteristischen schneidigen und kräftigen Holzblasinstrumente der Renaissance lautstark erklingen.',
    tooltip: 'Klemens',
    stageImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Klemens.webp',
    portraitImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Klemens_3_klein.webp',
    stagePosition: {
      desktop: { left: '44%', top: '13%', width: '19rem', zIndex: 5 },
      mobile: { left: '41%', top: '19%', width: '36vw', zIndex: 5 }
    }
  },
  {
    id: 'simone',
    name: 'Simone',
    role: 'Flöten, Glockenspiel & Gesang',
    instruments: ['Blockflöten', 'Schellen', 'Glockenspiel', 'Gesang'],
    bio: 'Simone steuert mit hellen Flötenstimmen und glockenreinem Gesang heitere und festliche Klangfarben bei.',
    tooltip: 'Simone',
    stageImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Simone.webp',
    portraitImage: 'https://olla-podrida.de/wp-content/uploads/2024/07/Simone_klein.webp',
    stagePosition: {
      desktop: { left: '34%', top: '15%', width: '20rem', zIndex: 4 },
      mobile: { left: '15%', top: '24%', width: '41vw', zIndex: 4 }
    }
  }
];

export const CONCERT_EVENTS: ConcertEvent[] = [
  {
    id: 'stift-boerstel-2026',
    title: 'Konzert beim Bio-Regio-Markt im Stift Börstel',
    category: 'Konzert',
    date: '11.10.2026',
    time: '14.00 Uhr',
    location: 'Stiftskirche Börstel, Börstel 1, 49626 Berge',
    city: 'Berge',
    description: 'Eintritt frei, um eine Spende wird gebeten. Das historische Stift Börstel bietet den perfekten Rahmen für mittelalterliche und frühe neuzeitliche Klänge im Rahmen des Bio-Regio-Marktes.',
    link: 'https://www.oekomodellregion-hasetal.de/#c269',
    imageUrl: 'https://olla-podrida.de/wp-content/uploads/2026/09/Biomarkt-vorne-mit-Musik.jpg',
    isUpcoming: true,
    ticketInfo: 'Eintritt frei, Spende erbeten'
  },
  {
    id: 'atter-advent-2026',
    title: 'Lebendiger Adventskalender in Atter',
    category: 'Konzert',
    date: '29.11.2026',
    time: '18.00 Uhr',
    location: 'Stadtteiltreff Atter, Karl-Barth-Straße 10, 49076 Osnabrück',
    city: 'Osnabrück',
    description: 'Winterlich-weihnachtliches Konzert zum 17. Lebendigen Adventskalender im Stadtteiltreff Atter. Beginn 18.00 Uhr. Freie Platzwahl. Wir freuen uns über Deine Spende am Ausgang. Zwischen den Musikstücken werden bei Keksen und Punsch kurze Geschichten erzählt.',
    link: 'https://www.wir-in-atter.de/',
    imageUrl: 'https://olla-podrida.de/wp-content/uploads/2024/09/Screenshot_20240929_154952_Samsung-Internet-1536x956.jpg',
    isUpcoming: true,
    ticketInfo: 'Freie Platzwahl, Spende am Ausgang'
  },
  {
    id: 'quakenbrueck-weihnachten-2026',
    title: '3. Weihnachts- und Mitsingkonzert zusammen mit dem Chorforum Quakenbrück',
    category: 'Konzert',
    date: '30.12.2026',
    time: '16.00 Uhr',
    location: 'St. Marienkirche Quakenbrück, Markt 4, 49610 Quakenbrück',
    city: 'Quakenbrück',
    description: 'Gemeinsam Weihnachten singen und Gemeinsam Weihnachten lauschen. Zusammen mit dem Chorforum Quakenbrück laden wir herzlich zu einem kleinen Mitsing-Konzert in die St. Marienkirche nach Quakenbrück ein.',
    link: 'https://www.chorforum-quakenbrueck.de/',
    imageUrl: 'https://olla-podrida.de/wp-content/uploads/2024/11/st-marienkirche-quakenbr-ck-1536x1152.jpg',
    isUpcoming: true,
    ticketInfo: 'Herzliche Einladung zum Mitsingen'
  },
  {
    id: 'fuerstenau-schlosskonzert-2025',
    title: 'Fürstenau – Schlosskonzert',
    category: 'Schlosskonzert',
    date: '2025',
    time: 'Beginn: 17 Uhr · Einlass: 16.30 Uhr',
    location: 'Schloss Fürstenau, Schlossplatz 1, 49584 Fürstenau',
    city: 'Fürstenau',
    description: 'In der Reihe „Schlosskonzerte“ gastieren wir zum 2. Mal in Fürstenau. Dieses Mal haben wir eine historisch musikalische Expedition ins Tierreich mitgebracht und spielen und singen von Fröschen und Mäusen, von Bären und Pferden und von allerlei Vögeln und anderem Getier.',
    imageUrl: 'https://olla-podrida.de/wp-content/uploads/2024/10/2024_Vorschaubild_1zu1_sRGB.webp',
    isUpcoming: false,
    ticketInfo: 'Vorverkauf 15,– € | Konzertkasse 18,– €'
  },
  {
    id: 'kulturverein-lift',
    title: 'Olla Podrida beim Kulturverein LIFT',
    category: 'Theater & Musik',
    date: '15.08.2025',
    time: 'Sommerabend',
    location: 'Kulturverein LI.F.T. e.V., Restrup bei Bippen',
    city: 'Bippen',
    description: 'Der Kulturverein LI.F.T. (Literatur, Film und Theater auf dem Land) im kleinen Restrup bei Bippen ist die Heimat von Willi Lieverscheidt und der Compagnia Buffo. Auf einem alten Bauernhof mit ganz besonderer Aura lassen wir noch einmal unsere historisch musikalische Expedition ins Tierreich erklingen. Freie Platzwahl und Hutkasse am Ende.',
    imageUrl: 'https://olla-podrida.de/wp-content/uploads/2025/08/tumblr_meyqp0UGV01rqxd5ko1_1280.jpg',
    isUpcoming: false,
    ticketInfo: 'Freie Platzwahl & Hutkasse'
  },
  {
    id: 'loeningen-neues-jahr',
    title: 'Konzert im neuen Jahr aus alten Zeiten',
    category: 'Konzert',
    date: 'Januar',
    time: '19.30 Uhr',
    location: 'Gemeindehaus Trinitatiskirche Löningen',
    city: 'Löningen',
    description: 'Eine akustische Reise in eine vergangene Welt: Noch mit weihnachtlichen Klängen im jungen neuen Jahr verzaubern wir das Gemeindehaus der Trinitatiskirche Löningen.',
    link: 'https://www.trinitatiskirche-loeningen.de',
    imageUrl: 'https://olla-podrida.de/wp-content/uploads/2024/11/Screenshot_20241126_203847_Samsung-Internet.jpg',
    isUpcoming: false,
    ticketInfo: 'Eintritt: 10,– €'
  },
  {
    id: 'bad-rothenfelde',
    title: 'Olla Podrida zu Gast in Bad Rothenfelde',
    category: 'Konzert',
    date: 'Archiv',
    time: 'Festgottesdienst & Konzert',
    location: 'Jesus Christus Kirche, Bad Rothenfelde',
    city: 'Bad Rothenfelde',
    description: 'Auf Einladung des Kirchenchores Bad Rothenfelde unter der Leitung von Holger Dolkemeyer erklingen unsere Töne im facettenreichen musikalischen Dialog mit dem Chor in der Jesus Christus Kirche.',
    imageUrl: 'https://olla-podrida.de/wp-content/uploads/2024/07/Logo1.jpg',
    isUpcoming: false,
    ticketInfo: 'Konzert im Kirchenraum'
  }
];
