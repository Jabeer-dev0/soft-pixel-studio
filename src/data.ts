export type GameStatus = 'Released' | 'Upcoming' | 'In Development' | 'Early Access';
export type GamePrice = 'Free' | 'Paid';

export interface Game {
  slug: string;
  title: string;
  eyebrow: string;
  tagline: string;
  description: string;
  status: GameStatus;
  price: GamePrice;
  priceLabel?: string;
  genre: string[];
  platforms: string[];
  mode: string;
  accent: string;
  cover: string;
  hero: string;
  gallery: string[];
  featured?: boolean;
  release: string;
  note: string;
  features: string[];
}

export const imageAssets = {
  castle: 'https://images.pexels.com/photos/9968434/pexels-photo-9968434.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  warrior: 'https://images.pexels.com/photos/10068853/pexels-photo-10068853.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  horror: 'https://images.pexels.com/photos/19949819/pexels-photo-19949819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  forest: 'https://images.pexels.com/photos/14648586/pexels-photo-14648586.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  lake: 'https://images.pexels.com/photos/1095817/pexels-photo-1095817.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  desert: 'https://images.pexels.com/photos/10854151/pexels-photo-10854151.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  dunes: 'https://images.pexels.com/photos/943534/pexels-photo-943534.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  mountain: 'https://images.pexels.com/photos/39965289/pexels-photo-39965289.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

export const games: Game[] = [
  {
    slug: 'locked-in',
    title: 'Locked In',
    eyebrow: 'A Soft Pixel Studio original',
    tagline: 'When the lights go out, something wakes up.',
    description: 'A psychological horror experience about isolation, memory, and the places that should never be found. Explore a house that changes when you stop looking at it.',
    status: 'Released',
    price: 'Free',
    genre: ['Horror', 'Narrative'],
    platforms: ['Windows', 'macOS'],
    mode: 'Single-player',
    accent: '#db3f52',
    cover: imageAssets.horror,
    hero: imageAssets.forest,
    gallery: [imageAssets.horror, imageAssets.forest, imageAssets.castle],
    featured: true,
    release: 'Available now',
    note: 'A free playable experience. Download access is represented as a demo action until release hosting is connected.',
    features: ['Reactive sound design', 'Shifting environments', 'Multiple endings'],
  },
  {
    slug: 'war-of-survival',
    title: 'War of Survival',
    eyebrow: 'Coming from Soft Pixel Studio',
    tagline: 'Build your shelter. Trust no one.',
    description: 'A grounded survival sandbox where every shelter tells a story. Gather, build, and make impossible decisions in a world reclaiming what was lost.',
    status: 'Upcoming',
    price: 'Paid',
    priceLabel: 'Sample price · $29.99',
    genre: ['Survival', 'Sandbox'],
    platforms: ['Windows', 'Linux'],
    mode: 'Single-player · Co-op planned',
    accent: '#8ba56d',
    cover: imageAssets.lake,
    hero: imageAssets.mountain,
    gallery: [imageAssets.mountain, imageAssets.lake, imageAssets.dunes],
    release: 'To be announced',
    note: 'Sample pricing only. Purchase and payment processing will be connected in a future backend phase.',
    features: ['Weather-driven survival', 'Base building', 'Living wilderness'],
  },
  {
    slug: 'the-last-one',
    title: 'The Last One',
    eyebrow: 'In development',
    tagline: 'The final circle is only the beginning.',
    description: 'A tense last-player-standing experience built around improvisation, sharp movement, and the pressure of a world that keeps closing in.',
    status: 'In Development',
    price: 'Free',
    genre: ['Action', 'Multiplayer'],
    platforms: ['Windows', 'Web'],
    mode: 'Multiplayer',
    accent: '#d18a58',
    cover: imageAssets.desert,
    hero: imageAssets.dunes,
    gallery: [imageAssets.dunes, imageAssets.desert, imageAssets.warrior],
    release: 'To be announced',
    note: 'The project is in active development. Registration is a local demo and does not send real communications.',
    features: ['Tactical movement', 'Dynamic arenas', 'Squad-ready encounters'],
  },
  {
    slug: 'onu',
    title: 'Onu',
    eyebrow: 'A quiet world is taking shape',
    tagline: 'Find the signal beneath the silence.',
    description: 'An atmospheric exploration project about distance, discovery, and the strange beauty of a world left behind.',
    status: 'Upcoming',
    price: 'Paid',
    priceLabel: 'Sample price · TBA',
    genre: ['Adventure', 'Exploration'],
    platforms: ['Windows'],
    mode: 'Single-player',
    accent: '#7198c7',
    cover: imageAssets.castle,
    hero: imageAssets.castle,
    gallery: [imageAssets.castle, imageAssets.mountain, imageAssets.horror],
    release: 'To be announced',
    note: 'Editable sample content for the studio showcase.',
    features: ['Environmental storytelling', 'Open-ended exploration', 'Original score'],
  },
  {
    slug: 'shogi',
    title: 'Shogi',
    eyebrow: 'A strategy project',
    tagline: 'Every move leaves a mark.',
    description: 'A modern strategy game with old-world patience at its center. Read the board, read the room, and make your next move count.',
    status: 'Upcoming',
    price: 'Paid',
    genre: ['Strategy', 'Competitive'],
    platforms: ['Web', 'Windows'],
    mode: 'Single-player · Multiplayer',
    accent: '#c9a66b',
    cover: imageAssets.warrior,
    hero: imageAssets.warrior,
    gallery: [imageAssets.warrior, imageAssets.castle, imageAssets.desert],
    release: 'To be announced',
    note: 'Editable sample content for the studio showcase.',
    features: ['Deep tactical systems', 'Competitive play', 'Readable board states'],
  },
  {
    slug: 'anicraft',
    title: 'Anicraft',
    eyebrow: 'A world to make your own',
    tagline: 'Collect. Create. Wander further.',
    description: 'A warm sandbox for curious players who prefer to leave a place better than they found it. Build a home, discover new materials, and shape your own rhythm.',
    status: 'Upcoming',
    price: 'Free',
    genre: ['Sandbox', 'Crafting'],
    platforms: ['Windows', 'Web'],
    mode: 'Single-player · Co-op planned',
    accent: '#d19b63',
    cover: imageAssets.lake,
    hero: imageAssets.lake,
    gallery: [imageAssets.lake, imageAssets.mountain, imageAssets.forest],
    release: 'To be announced',
    note: 'Editable sample content for the studio showcase.',
    features: ['Creative building', 'Resource discovery', 'A world with seasons'],
  },
];

export const newsItems = [
  { category: 'Studio journal', title: 'Building worlds with room to breathe', date: 'Demo editorial · 06.18.26', image: imageAssets.mountain },
  { category: 'Development log', title: 'The sound of a door left open', date: 'Demo editorial · 05.30.26', image: imageAssets.horror },
  { category: 'Behind the scenes', title: 'What makes a place feel lived in?', date: 'Demo editorial · 04.12.26', image: imageAssets.castle },
];

export function getGame(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}
