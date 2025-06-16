import allergyData from '../mockData/allergies.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...allergyData];

export const getAll = async () => {
  await delay(300);
  return [...data];
};

export const getById = async (id) => {
  await delay(200);
  const item = data.find(episode => episode.id === id);
  return item ? { ...item } : null;
};

export const create = async (episode) => {
  await delay(400);
  const newEpisode = {
    ...episode,
    id: Date.now().toString()
  };
  data.push(newEpisode);
  return { ...newEpisode };
};

export const update = async (id, updates) => {
  await delay(350);
  const index = data.findIndex(episode => episode.id === id);
  if (index === -1) throw new Error('Episode not found');
  
  data[index] = { ...data[index], ...updates };
  return { ...data[index] };
};

export const delete_ = async (id) => {
  await delay(250);
  const index = data.findIndex(episode => episode.id === id);
  if (index === -1) throw new Error('Episode not found');
  
  const deleted = data.splice(index, 1)[0];
  return { ...deleted };
};

export const getRecentEpisodes = async (limit = 5) => {
  await delay(250);
  const recent = [...data]
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
    .slice(0, limit);
  return recent.map(episode => ({ ...episode }));
};

// Memoized trigger frequency calculation
let triggerFrequencyCache = null;
let triggerCacheTimestamp = 0;

export const getTriggerFrequency = async () => {
  await delay(300);
  
  const now = Date.now();
  // Cache for 5 minutes or if data length changed
  if (triggerFrequencyCache && (now - triggerCacheTimestamp < 300000)) {
    return { ...triggerFrequencyCache };
  }
  
  const triggerCount = {};
  for (const episode of data) {
    const trigger = episode.trigger;
    triggerCount[trigger] = (triggerCount[trigger] || 0) + 1;
  }
  
  triggerFrequencyCache = triggerCount;
  triggerCacheTimestamp = now;
  
  return { ...triggerCount };
};