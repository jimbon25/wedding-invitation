import React, { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import LoadingScreen from './LoadingScreen';

// Lazy-loaded components
const Home = lazy(() => import('./Home'));
const OurStory = lazy(() => import('./OurStory'));
const EventDetails = lazy(() => import('./EventDetails'));
const Gallery = lazy(() => import('./Gallery'));
const RSVPForm = lazy(() => import('./RSVPForm'));
const GiftInfo = lazy(() => import('./GiftInfo'));
const GuestBook = lazy(() => import('./GuestBook'));
const HealthProtocol = lazy(() => import('./HealthProtocol'));
const AccommodationInfo = lazy(() => import('./AccommodationInfo'));
const GiftRegistry = lazy(() => import('./GiftRegistry'));

const MainContentWrapper: React.FC = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname === '/' ? (
        <Suspense fallback={<LoadingScreen />}>
          <Home />
        </Suspense>
      ) : (
        <div className="container mt-4 main-content">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/event-details" element={<EventDetails />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/rsvp" element={<RSVPForm />} />
              <Route path="/gift-info" element={<GiftInfo />} />
              <Route path="/guestbook" element={<GuestBook />} />
              <Route path="/health-protocol" element={<HealthProtocol />} />
              <Route path="/accommodation-info" element={<AccommodationInfo />} />
              <Route path="/gift-registry" element={<GiftRegistry />} />
            </Routes>
          </Suspense>
        </div>
      )}
    </>
  );
};

export default MainContentWrapper;