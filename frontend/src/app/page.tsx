'use client'
import React, { useEffect } from 'react';
import useAuth from './hooks/useAuth';
import AuthForm from '@/components/auth/Form';
import {Dashboard} from '@/components/Dashboard';
import useVerticalDashboard from '@/store/dashboardStore';
import LeadsPage from '@/components/leads/Leads';
import { LocalStore } from '@/store/localstore';

const Home = () => {

  const { loggedIn, loading } = useAuth();
  const selectedLink = useVerticalDashboard((state) => state.selectedSection);
  const setSelectedLink = useVerticalDashboard((state) => state.setSelectedSection);
  

  useEffect(() => {
    // Set the selected section to '/dashboard' when the component mounts

    setSelectedLink(LocalStore.getVerticalNavBarState()?.toString() || '/dashboard');
  }, []);
  return (
    <div>
      {!loggedIn && !loading && (<AuthForm/>)}

      {loggedIn && selectedLink === '/dashboard' && (<div><Dashboard/></div>)}
      {loggedIn && selectedLink === '/leads' && (<div><LeadsPage/></div>)}
    </div>
  )
}

export default Home