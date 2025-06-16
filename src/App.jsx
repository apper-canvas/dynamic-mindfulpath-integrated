import { BrowserRouter, Routes, Route, lazy, Suspense } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { memo, useMemo } from 'react';
import Layout from './Layout';
import { routes } from './config/routes';

// Lazy load components for code splitting
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage'));

// Memoized route components to prevent unnecessary re-renders
const MemoizedRoutes = memo(() => {
  const routeElements = useMemo(() => 
    Object.values(routes).map((route) => (
      <Route 
        key={route.id} 
        path={route.path} 
        element={<route.component />} 
      />
    )), []);

  return (
    <>
      {routeElements}
      <Route path="*" element={
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <NotFoundPage />
        </Suspense>
      } />
    </>
  );
});

MemoizedRoutes.displayName = 'MemoizedRoutes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <MemoizedRoutes />
</Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
          className="z-[9999]"
          toastClassName="bg-white border border-gray-200 shadow-lg"
          progressClassName="bg-primary"
          limit={5}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;