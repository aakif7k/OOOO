/**
 * =======================================================================
 * OUR METRO JOURNEY · Single Source of Truth
 * =======================================================================
 * Edit the values marked // EDIT ME to personalize your proposal site.
 * ZERO image fields — all visuals are SVG/canvas/CSS.
 */

export interface ChapterSong {
  src: string;          // EDIT ME: path to song audio file
  startAt: number;      // EDIT ME: seek start offset in seconds
  duration: number;     // EDIT ME: playback duration window in seconds (default: 30)
  fadeIn: number;       // EDIT ME: fade in duration in seconds (default: 1.2)
  fadeOut: number;      // EDIT ME: fade out duration in seconds (default: 2)
  loop?: boolean;       // EDIT ME: loop the 30s window (true for chapter 5)
}

export interface Chapter {
  id: number;
  stationNum: string;         // e.g. '01'
  titleEn: string;
  titleTa?: string;           // Optional Tamil station name
  tagline: string;
  taglineColor?: string;      // Dark or high-contrast color matching scene bg
  quoteLines: string[];       // Each string = one reveal line
  endingLine?: string;        // Large italic ending (Ch2)
  iLikeYou?: boolean;         // Triggers big cinematic reveal (Ch4)
  confessionPart2?: string;   // Post-"I LIKE YOU" line (Ch4)
  sceneId: 'dawn' | 'day' | 'golden' | 'dusk' | 'starry';
  accentColor: string;
  song: ChapterSong;          // Background song configuration
}

export interface ProposalConfig {
  question: string;
  yesMessage: string;
  yesSubtext: string;
  noStages: string[];
  gateProposal?: boolean;     // EDIT ME: gate proposal with 30s lock (default: false)
}

export interface SiteContent {
  names: {
    sender: string;    // EDIT ME
    recipient: string; // EDIT ME
    pronoun: 'she' | 'he' | 'they';
  };
  intro: {
    title: string;
    boardBtn: string;
  };
  chapters: [Chapter, Chapter, Chapter, Chapter, Chapter];
  proposal: ProposalConfig;
  sound: { defaultEnabled: boolean };
}

export const content: SiteContent = {
  /* ---- Names ---- */
  names: {
    sender:    'AK',   // EDIT ME
    recipient: 'Oviya',   // EDIT ME
    pronoun:   'she',      // EDIT ME: 'she' | 'he' | 'they'
  },

  intro: {
    title:    'Our Metro Journey',
    boardBtn: 'Board the train 🚇',
  },

  sound: { defaultEnabled: false },

  /* ================================================================
   * THE FIVE CHAPTERS  (edit copy here, never touch components)
   * ================================================================ */
  chapters: [
    /* ---- Station 01: The Beginning ---- */
    {
      id: 1,
      stationNum: '01',
      titleEn: 'The Beginning',
      titleTa: 'தொடக்கம்',
      tagline: 'Every beautiful story begins somewhere.',
      quoteLines: [
        'Ever wondered why I always choose the same metro compartment?',
        'It was never about the seat or the journey.',
        'It was because of you.',
        'Somewhere between those everyday rides and little glances, you became my favourite part of the journey.',
        "And honestly, I hope this journey doesn't end at the last station.",
        'I wish it could last a lifetime.',
      ],
      sceneId: 'dawn',
      accentColor: '#FFC8DD',
      taglineColor: '#831843',
      song: {
        src: '/music/song-2.mp3', // railin oligal
        startAt: 15,               // EDIT ME: seek start time in seconds
        duration: 30,             // EDIT ME: playback duration in seconds
        fadeIn: 1.2,              // EDIT ME: fade in in seconds
        fadeOut: 2,               // EDIT ME: fade out in seconds
      },
    },

    /* ---- Station 02: Little Things ---- */
    {
      id: 2,
      stationNum: '02',
      titleEn: 'Little Things',
      titleTa: 'சின்ன சின்ன விஷயங்கள்',
      tagline: 'Sometimes, the smallest things mean the most.',
      quoteLines: [
        'It\'s never been about grand gestures.',
        'It\'s the way you listen, your little smiles, our random conversations,',
        'and those tiny moments you might not even remember.',
        'You probably don\'t realise it, but the little things you do',
        'have made a bigger place in my heart than you could ever imagine.',
      ],
      endingLine: 'Funny how someone can become so special without even trying. ❤️',
      sceneId: 'day',
      accentColor: '#BDE0FE',
      taglineColor: '#1E3A8A',
      song: {
        src: '/music/song-5.mp3', // With Love
        startAt: 28,               // EDIT ME: seek start time in seconds
        duration: 30,             // EDIT ME: playback duration in seconds
        fadeIn: 1.2,              // EDIT ME: fade in in seconds
        fadeOut: 2,               // EDIT ME: fade out in seconds
      },
    },

    /* ---- Station 03: Our Little World ---- */
    {
      id: 3,
      stationNum: '03',
      titleEn: 'Our Little World',
      titleTa: 'நமது உலகம்',
      tagline: 'Some dreams are too beautiful to stay dreams.',
      quoteLines: [
        'If there were rent to pay for living inside my thoughts,',
        'you\'d owe more than you could ever imagine.',
        'Because I\'ve built an entire world in my imagination,',
        'and somehow, every little corner of it has you in it.',
        'A world so beautiful that even reality feels a little less magical.',
      ],
      sceneId: 'golden',
      accentColor: '#FFD27D',
      taglineColor: '#92400E',
      song: {
        src: '/music/song-3.mp3', // Vazhimuludhum varuvaiya
        startAt: 70,               // EDIT ME: seek start time in seconds
        duration: 30,             // EDIT ME: playback duration in seconds
        fadeIn: 1.2,              // EDIT ME: fade in in seconds
        fadeOut: 2,               // EDIT ME: fade out in seconds
      },
    },

    /* ---- Station 04: My Confession ---- */
    {
      id: 4,
      stationNum: '04',
      titleEn: 'My Confession',
      titleTa: 'மனம் திறந்து',
      tagline: 'Some feelings are too beautiful to keep hidden.',
      quoteLines: [
        'I don\'t know exactly when it happened',
        'or eppadi nee enakku ivlo special aana nu.',
        'But somewhere along the way,',
        'my little crush turned into something I couldn\'t hide anymore.',
        'Unkitta pesura ovvoru moment-um,',
        'unna paakura andha chinna chinna glances-um enakku romba special.',
        'Maybe I\'ve imagined a thousand ways to tell you this,',
        'but today I just want to be honest.',
      ],
      iLikeYou: true,
      confessionPart2: 'Idha sollanum nu romba naala nenachitu irundhen… finally, solliten.',
      sceneId: 'dusk',
      accentColor: '#CDB4DB',
      song: {
        src: '/music/song-1.mp3', // oru padhi kanavu
        startAt: 0,               // EDIT ME: seek start time in seconds
        duration: 30,             // EDIT ME: playback duration in seconds
        fadeIn: 1.2,              // EDIT ME: fade in in seconds
        fadeOut: 2,               // EDIT ME: fade out in seconds
      },
    },

    /* ---- Station 05: Final Stop ---- */
    {
      id: 5,
      stationNum: '05',
      titleEn: 'Final Stop',
      titleTa: 'இறுதி நிறுத்தம்',
      tagline: 'Maybe the end of this journey could be the beginning of something beautiful.',
      quoteLines: [
        'So, here we are at the final stop.',
        'I don\'t know what your answer will be,',
        'and honestly, konjam bayama dhaan irukku.',
        'But whatever it is, I\'m glad I found the courage to tell you.',
        'I don\'t just want you to be a part of my favourite metro journey.',
        'I wish to have you beside me in all the journeys life has waiting for us.',
      ],
      sceneId: 'starry',
      accentColor: '#FF5D8F',
      song: {
        src: '/music/song-4.mp3', // Venmegam Pennaga BGM
        startAt: 0,               // EDIT ME: seek start time in seconds
        duration: 30,             // EDIT ME: playback duration in seconds
        fadeIn: 1.2,              // EDIT ME: fade in in seconds
        fadeOut: 2,               // EDIT ME: fade out in seconds
        loop: true,               // EDIT ME: loop softly until proposal answered
      },
    },
  ],

  /* ================================================================
   * PROPOSAL
   * ================================================================ */
  proposal: {
    question: 'Oviya ,will you give me a chance to turn my little dream into our reality? ❤️',
    yesMessage: 'You said YES! 🎉💍',
    yesSubtext: 'Our greatest adventure together has officially begun. Next stop: a lifetime. 🚇',
    gateProposal: false, // EDIT ME: gate proposal with 30s lock (default: false)
    noStages: [
      'No 🙈',
      'Are you sure? 🥺',
      'Konjam yosichu paaru 💭',
      'Please? 🌸',
      'Chance kuduthu paaru ma! 🥹',
      'I believe in us ❤️',
    ],
  },
};
