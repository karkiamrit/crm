'use client'
import React, { useEffect } from 'react';
import useAuth from './hooks/useAuth';
import AuthForm from '@/components/auth/Form';
import {Dashboard} from '@/components/Dashboard';
import useVerticalDashboard from '@/store/dashboardStore';
import LeadsPage from '@/components/leads/Leads';
import { LocalStore } from '@/store/localstore';
import OrganizationsPage from '@/components/organizations/Organization';
import Agents from '@/components/agents/Agents';
import useBlurStore from '@/store/useBlurStore';
import { cn } from '@/lib/utils';

const Home = () => {

  const { loggedIn, loading } = useAuth();
  const selectedLink = useVerticalDashboard((state) => state.selectedSection);
  const setSelectedLink = useVerticalDashboard((state) => state.setSelectedSection);
  const {isMobileMenuOpen,setMobileMenuOpen} = useBlurStore();
  
  useEffect(() => {
    // Set the selected section to '/dashboard' when the component mounts

    setSelectedLink(LocalStore.getVerticalNavBarState()?.toString() || '/dashboard');
  }, [setSelectedLink]);
  return (
    <div 
    className={cn(`blur-none`,isMobileMenuOpen && `blur-sm h-screen` )}
    >
      
      {!loggedIn && !loading && (<AuthForm/>)}

      {loggedIn && selectedLink === '/dashboard' && (<div><Dashboard/></div>)}
      {loggedIn && selectedLink === '/leads' && (<div><LeadsPage/></div>)}
      {loggedIn && selectedLink === '/organizations' && (<div><OrganizationsPage/></div>)}
      {loggedIn && selectedLink === '/agents' && (<div><Agents/></div>)}
      
    </div>
  )
}

export default Home;