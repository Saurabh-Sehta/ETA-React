import React, { useEffect, useState } from 'react'
import CustomBarChart from '../charts/CustomBarChart'
import { prepareSummaryBarChartData } from '../../utils/helper';
import CustomSummaryBarChart from '../charts/CustomSummaryBarChart';

const SummaryOverview = ({ summaryData }) => {

    const [ chartData, setChartData ] = useState([]);

    useEffect(() => {
        // prepare chart data here
        const result = prepareSummaryBarChartData(summaryData);
        setChartData(result);
        return () => {}
    }, [summaryData]);

  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <div className=''>
                <h5 className='text-lg'>Monthly Overview</h5>
                <p className='text-xs text-gray-400 mt-0.5'>
                    Track your earnings over months and analyze your financial trends.
                </p>
            </div>
        </div>

        <div className='mt-10'>
            <CustomSummaryBarChart data={chartData}/>
        </div>
    </div>
  )
}

export default SummaryOverview
