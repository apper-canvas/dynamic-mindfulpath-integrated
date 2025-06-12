import Dashboard from '../pages/Dashboard';
import MoodTracker from '../pages/MoodTracker';
import TherapyJournal from '../pages/TherapyJournal';
import AllergyLog from '../pages/AllergyLog';
import GratitudeLog from '../pages/GratitudeLog';
import ScreenTime from '../pages/ScreenTime';
import Export from '../pages/Export';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  mood: {
    id: 'mood',
    label: 'Mood Tracker',
    path: '/mood',
    icon: 'Smile',
    component: MoodTracker
  },
  therapy: {
    id: 'therapy',
    label: 'Therapy Journal',
    path: '/therapy',
    icon: 'BookOpen',
    component: TherapyJournal
  },
  allergies: {
    id: 'allergies',
    label: 'Allergy Log',
    path: '/allergies',
    icon: 'Shield',
    component: AllergyLog
  },
  gratitude: {
    id: 'gratitude',
    label: 'Gratitude Log',
    path: '/gratitude',
    icon: 'Heart',
    component: GratitudeLog
  },
  screentime: {
    id: 'screentime',
    label: 'Screen Time',
    path: '/screen-time',
    icon: 'Smartphone',
    component: ScreenTime
  },
  export: {
    id: 'export',
    label: 'Export Data',
    path: '/export',
    icon: 'Download',
    component: Export
  }
};

export const routeArray = Object.values(routes);