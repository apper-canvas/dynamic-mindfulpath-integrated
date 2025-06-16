import moodData from '../mockData/moods.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...moodData];

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

// Cache for date range calculations
const moodDateCache = new Map();

const getCachedDateRange = (type) => {
  if (moodDateCache.has(type)) {
    return moodDateCache.get(type);
  }
  
  const date = new Date();
  let timestamp;
  
  if (type === 'week') {
    date.setDate(date.getDate() - 7);
    timestamp = date.getTime();
  } else if (type === 'month') {
    date.setMonth(date.getMonth() - 1);
    timestamp = date.getTime();
  }
  
  moodDateCache.set(type, timestamp);
  // Clear cache after 1 hour
  setTimeout(() => moodDateCache.delete(type), 3600000);
  
  return timestamp;
};

export const getWeeklyTrends = async () => {
  await delay(300);
  const oneWeekAgoTime = getCachedDateRange('week');
  
  const weeklyData = data
    .filter(entry => new Date(entry.date).getTime() >= oneWeekAgoTime)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return weeklyData.map(entry => ({ ...entry }));
};

export const getMonthlyTrends = async () => {
  await delay(400);
  const oneMonthAgoTime = getCachedDateRange('month');
  
  const monthlyData = data
    .filter(entry => new Date(entry.date).getTime() >= oneMonthAgoTime)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return monthlyData.map(entry => ({ ...entry }));
};