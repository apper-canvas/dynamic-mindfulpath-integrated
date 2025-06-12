import DashboardPage from '@/components/pages/DashboardPage';
import MoodTrackerPage from '@/components/pages/MoodTrackerPage';
import TherapyJournalPage from '@/components/pages/TherapyJournalPage';
import AllergyLogPage from '@/components/pages/AllergyLogPage';
import GratitudeLogPage from '@/components/pages/GratitudeLogPage';
import ScreenTimePage from '@/components/pages/ScreenTimePage';
import ExportPage from '@/components/pages/ExportPage';
import HomePage from '@/components/pages/HomePage';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
path: '/',
    icon: 'LayoutDashboard',
    component: DashboardPage
  },
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: HomePage
  },
  mood: {
    id: 'mood',
    label: 'Mood Tracker',
    path: '/mood',
    icon: 'Smile',
    component: MoodTrackerPage
  },
  therapy: {
    id: 'therapy',
    label: 'Therapy Journal',
    path: '/therapy',
    icon: 'BookOpen',
    component: TherapyJournalPage
  },
  allergies: {
    id: 'allergies',
    label: 'Allergy Log',
    path: '/allergies',
    icon: 'Shield',
    component: AllergyLogPage
  },
  gratitude: {
    id: 'gratitude',
    label: 'Gratitude Log',
    path: '/gratitude',
    icon: 'Heart',
    component: GratitudeLogPage
  },
  screentime: {
    id: 'screentime',
    label: 'Screen Time',
    path: '/screen-time',
    icon: 'Smartphone',
    component: ScreenTimePage
  },
  export: {
    id: 'export',
    label: 'Export Data',
    path: '/export',
    icon: 'Download',
    component: ExportPage
  }
};

export const routeArray = Object.values(routes);