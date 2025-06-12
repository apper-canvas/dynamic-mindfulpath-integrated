import screenTimeData from '../mockData/screenTime.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...screenTimeData];

export const getAll = async () => {
  await delay(300);
  return [...data];
};

export const getById = async (id) => {
  await delay(200);
  const item = data.find(log => log.id === id);
  return item ? { ...item } : null;
};

export const create = async (log) => {
  await delay(400);
  const newLog = {
    ...log,
    id: Date.now().toString()
  };
  data.push(newLog);
  return { ...newLog };
};

export const update = async (id, updates) => {
  await delay(350);
  const index = data.findIndex(log => log.id === id);
  if (index === -1) throw new Error('Log not found');
  
  data[index] = { ...data[index], ...updates };
  return { ...data[index] };
};

export const delete_ = async (id) => {
  await delay(250);
  const index = data.findIndex(log => log.id === id);
  if (index === -1) throw new Error('Log not found');
  
  const deleted = data.splice(index, 1)[0];
  return { ...deleted };
};

export const getTodaysEntry = async () => {
  await delay(200);
  const today = new Date().toISOString().split('T')[0];
  const entry = data.find(log => log.date === today);
  return entry ? { ...entry } : null;
};

export const getWeeklyTrends = async () => {
  await delay(300);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weeklyData = data.filter(log => 
    new Date(log.date) >= oneWeekAgo
  ).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return weeklyData.map(log => ({ ...log }));
};

export const getMonthlyTrends = async () => {
  await delay(400);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const monthlyData = data.filter(log => 
    new Date(log.date) >= oneMonthAgo
  ).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return monthlyData.map(log => ({ ...log }));
};

export const getAverageScreenTime = async (days = 7) => {
  await delay(250);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentLogs = data.filter(log => new Date(log.date) >= cutoffDate);
  
  if (recentLogs.length === 0) return 0;
  
  const totalMinutes = recentLogs.reduce((sum, log) => 
    sum + (log.hours * 60) + log.minutes, 0
  );
  
  return Math.round(totalMinutes / recentLogs.length);
};