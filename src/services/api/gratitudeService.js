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

export const getCurrentStreak = async () => {
  await delay(250);
  const sortedEntries = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    const daysDiff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};