import gratitudeData from '../mockData/gratitude.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...gratitudeData];

export const getAll = async () => {
  await delay(300);
  return [...data];
};

export const getById = async (id) => {
  await delay(200);
  const item = data.find(entry => entry.id === id);
  return item ? { ...item } : null;
};

export const create = async (entry) => {
  await delay(400);
  const newEntry = {
    ...entry,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  data.push(newEntry);
  return { ...newEntry };
};

export const update = async (id, updates) => {
  await delay(350);
  const index = data.findIndex(entry => entry.id === id);
  if (index === -1) throw new Error('Entry not found');
  
  data[index] = { ...data[index], ...updates };
  return { ...data[index] };
};

export const delete_ = async (id) => {
  await delay(250);
  const index = data.findIndex(entry => entry.id === id);
  if (index === -1) throw new Error('Entry not found');
  
  const deleted = data.splice(index, 1)[0];
  return { ...deleted };
};

export const getTodaysEntry = async () => {
  await delay(200);
  const today = new Date().toISOString().split('T')[0];
  const entry = data.find(entry => entry.date === today);
  return entry ? { ...entry } : null;
};

// Optimized streak calculation with caching
let streakCache = null;
let streakCacheLength = 0;

export const getCurrentStreak = async () => {
  await delay(250);
  
  // Return cached result if data hasn't changed
  if (streakCache !== null && streakCacheLength === data.length) {
    return streakCache;
  }
  
  if (data.length === 0) {
    streakCache = 0;
    streakCacheLength = 0;
    return 0;
  }
  
  const sortedEntries = data
    .map(entry => ({ ...entry, dateTime: new Date(entry.date).getTime() }))
    .sort((a, b) => b.dateTime - a.dateTime);
  
  let streak = 0;
  let currentTime = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  for (const entry of sortedEntries) {
    const daysDiff = Math.floor((currentTime - entry.dateTime) / oneDayMs);
    
    if (daysDiff === streak) {
      streak++;
      currentTime -= oneDayMs;
    } else {
      break;
    }
  }
  
  streakCache = streak;
  streakCacheLength = data.length;
  
  return streak;
};