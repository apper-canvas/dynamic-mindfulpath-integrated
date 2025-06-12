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

export const getWeeklyTrends = async () => {
  await delay(300);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weeklyData = data.filter(entry => 
    new Date(entry.date) >= oneWeekAgo
  ).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return weeklyData.map(entry => ({ ...entry }));
};

export const getMonthlyTrends = async () => {
  await delay(400);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const monthlyData = data.filter(entry => 
    new Date(entry.date) >= oneMonthAgo
  ).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return monthlyData.map(entry => ({ ...entry }));
};