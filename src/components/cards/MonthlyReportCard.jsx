import React from "react";

const getMonthName = (monthNumber) => {
  return new Date(0, monthNumber - 1).toLocaleString("default", {
    month: "long",
  });
};

const MonthlyReportCard = ({ report }) => {
  const expensePercentage =
    (report.totalExpense / report.totalIncome) * 100;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          {getMonthName(report.month)} {report.year}
        </h2>
        <span className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-600">
          Monthly Report
        </span>
      </div>

      {/* Income / Expense / Balance */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-xs text-slate-500">Income</p>
          <p className="text-green-600 font-semibold">
            ₹ {report.totalIncome}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Expense</p>
          <p className="text-red-500 font-semibold">
            ₹ {report.totalExpense}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Balance</p>
          <p className="text-blue-600 font-semibold">
            ₹ {report.totalBalance}
          </p>
        </div>
      </div>

      {/* Expense Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Expense Ratio</span>
          <span>{expensePercentage.toFixed(1)}%</span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full"
            style={{ width: `${expensePercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Top Expenses */}
      <p className="text-xs text-slate-500 mb-2">Top Expenses</p>
      <div className="border-t pt-3 text-sm">
        <p className="font-medium text-slate-700 mb-1">
          🥇 {report.topMostExpense} — ₹ {report.topMostExpenseAmount}
        </p>

        <p className="text-slate-600">
          🥈 {report.secondMostExpense} — ₹ {report.secondMostExpenseAmount}
        </p>
      </div>
    </div>
  );
};

export default MonthlyReportCard;