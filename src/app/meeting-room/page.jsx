'use client';

import { Suspense } from 'react';
import { useAuth } from '@/utils/useAuth';
import MeetingRoom from './meeting-room';
import LoaderSpinner from '@/components/loader/loader';

function UserPage() {
  const authStatus = useAuth();

  if (authStatus === null) {
    return <LoaderSpinner />;
  }

  if (!authStatus) {
    return null;
  }

  return (
    <div>
      <div className="container">
        <Suspense fallback={<LoaderSpinner />}>
          <MeetingRoom />
        </Suspense>
      </div>
    </div>
  );
}

export default UserPage;