import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth';
import SummaryOverview from '../../components/Summary/SummaryOverview';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import MonthlyReportCard from '../../components/cards/MonthlyReportCard';

const Summary = () => {
    useUserAuth();

    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSummaryData = async () => {
        // Fetch summary data from the backend API
        // You can use axios or fetch to get the data and then set it in state
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.SUMMARY.GET_SUMMARY}`
            )
            if (response.data) {
                setSummaryData(response.data);
            }
        } catch (error) {
            console.log("Something went wrong. Please try again.", error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSummaryData();
        return () => {

        }
    }, []);
    return (
        <DashboardLayout activeMenu="Summary">
            <div className='my-5 mx-auto'>
                <div className='grid grid-cols-1 gap-6'>
                    <div className=''>
                        <SummaryOverview
                            summaryData={summaryData}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {summaryData?.map((report, index) => (
                            <MonthlyReportCard key={index} report={report} />
                        ))}
                    </div>
                    
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Summary