import therapyData from '../mockData/therapy.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...therapyData];

export const getAll = async () => {
  await delay(300);
  return [...data];
};

export const getById = async (id) => {
  await delay(200);
  const item = data.find(session => session.id === id);
  return item ? { ...item } : null;
};

export const create = async (session) => {
  await delay(400);
  const newSession = {
    ...session,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  data.push(newSession);
  return { ...newSession };
};

export const update = async (id, updates) => {
  await delay(350);
  const index = data.findIndex(session => session.id === id);
  if (index === -1) throw new Error('Session not found');
  
  data[index] = { ...data[index], ...updates };
  return { ...data[index] };
};

export const delete_ = async (id) => {
  await delay(250);
  const index = data.findIndex(session => session.id === id);
  if (index === -1) throw new Error('Session not found');
  
  const deleted = data.splice(index, 1)[0];
  return { ...deleted };
};

export const getRecentSessions = async (limit = 5) => {
  await delay(250);
  const recent = [...data]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
  return recent.map(session => ({ ...session }));
};

// Memoized topic frequency with caching
let topicFrequencyCache = null;
let topicCacheLength = 0;

export const getTopicFrequency = async () => {
  await delay(300);
  
  // Return cached result if data hasn't changed
  if (topicFrequencyCache && topicCacheLength === data.length) {
    return { ...topicFrequencyCache };
  }
  
  const topicCount = {};
  
  for (const session of data) {
    if (session.topics?.length) {
      for (const topic of session.topics) {
        topicCount[topic] = (topicCount[topic] || 0) + 1;
      }
    }
  }
  
  topicFrequencyCache = topicCount;
  topicCacheLength = data.length;
  
  return { ...topicCount };
};