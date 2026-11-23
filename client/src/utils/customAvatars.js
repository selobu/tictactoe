export const AVATARS = [
  { id: 'plumber-01', name: 'Plumber 01', group: 'Plumbers' },
  { id: 'plumber-02', name: 'Plumber 02', group: 'Plumbers' },
  { id: 'plumber-03', name: 'Plumber 03', group: 'Plumbers' },
  { id: 'plumber-04', name: 'Plumber 04', group: 'Plumbers' },
  { id: 'plumber-05', name: 'Plumber 05', group: 'Plumbers' },
  { id: 'plumber-06', name: 'Plumber 06', group: 'Plumbers' },
  { id: 'plumber-07', name: 'Plumber 07', group: 'Plumbers' },
  { id: 'plumber-08', name: 'Plumber 08', group: 'Plumbers' },
  { id: 'plumber-09', name: 'Plumber 09', group: 'Plumbers' },
  { id: 'plumber-10', name: 'Plumber 10', group: 'Plumbers' },
  { id: 'plumber-11', name: 'Plumber 11', group: 'Plumbers' },
  { id: 'plumber-12', name: 'Plumber 12', group: 'Plumbers' },
  { id: 'flower-01', name: 'Flower Person', group: 'Whimsical' },
  { id: 'pine-01', name: 'Pine Tree', group: 'Whimsical' },
  { id: 'cloud-01', name: 'Smiling Cloud', group: 'Whimsical' },
  { id: 'rocket-01', name: 'Rocket', group: 'Whimsical' },
  { id: 'mushroom-01', name: 'Mushroom', group: 'Whimsical' },
  { id: 'cactus-01', name: 'Cactus', group: 'Whimsical' },
  { id: 'planet-01', name: 'Ringed Planet', group: 'Whimsical' },
  { id: 'robot-01', name: 'Robot', group: 'Whimsical' },
  { id: 'coffee-01', name: 'Coffee Bean', group: 'Special' },
  { id: 'eagle-01', name: 'Bald Eagle', group: 'Special' },
  { id: 'axolotl-01', name: 'Axolotl', group: 'Special' },
  { id: 'house-01', name: 'Smiling House', group: 'Special' },
  { id: 'catrina-01', name: 'Catrina', group: 'Special' },
];

export const AVATAR_GROUPS = ['Plumbers', 'Whimsical', 'Special'].map((label) => ({
  label,
  items: AVATARS.filter((avatar) => avatar.group === label),
}));

export const AVATAR_COUNT = AVATARS.length;

export const CUSTOM_AVATAR_KEYS = new Set(AVATARS.map((avatar) => avatar.id));
