import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext';

const ResetPassword = () => {

    const {profileData, setProfileData} = useState([]);

    const { user } = useContext(UserContext);

    useEffect(() => {
              if (user) {
                setProfileData(user);
                console.log("Profile Data:", user);
              }
        }, [user]);
  return (
    <DashboardLayout activeMenu="Settings">
        <div>ResetPassword</div>
    </DashboardLayout>
  )
}

export default ResetPassword