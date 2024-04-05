"use client"
// import React, { useEffect } from 'react'
// import useAuth from '../hooks/useAuth';
// import useVerticalDashboard from '@/store/dashboardStore';
// import { LocalStore } from '@/store/localstore';
// import AuthForm from '@/components/auth/Form';
// import { Dashboard } from '@/components/Dashboard';
// import LeadsPage from '@/components/leads/Leads';
// import { LeadDocuments } from '@/components/leads/sheet/LeadDocument';
// import { useSearchParams } from 'next/navigation';

type Props = {}
function page({}: Props) {
  // const searchParams = useSearchParams()
  // // const { loggedIn, loading } = useAuth();
  // // const selectedLink = useVerticalDashboard((state) => state.selectedSection);
  // // const setSelectedLink = useVerticalDashboard((state) => state.setSelectedSection);
  
  // // useEffect(() => {
  // //   setSelectedLink(LocalStore.getVerticalNavBarState()?.toString() || '/uploads');
  // // }, []);
  
  // const documents = searchParams.get('document')?.split(',') || [];
  // console.log('documents'+ documents)
  return (
    <div>
      {/* {/* {!loggedIn && !loading && (<AuthForm/>)}
      {loggedIn && selectedLink === '/dashboard' && (<div><Dashboard/></div>)}
      {loggedIn && selectedLink === '/leads' && (<div><LeadsPage/></div>)} */}
     {/* <div><LeadDocuments documents={documents}/></div> */} 
     upload
    </div>
  )
}

export default page