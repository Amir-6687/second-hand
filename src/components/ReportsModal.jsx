import React, { useState, useEffect } from "react";
import {
  FaDownload,
  FaTimes,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaCalendarAlt,
} from "react-icons/fa";

const colors = {
  lightPink: "#EDDCD9",
  offWhite: "#F2EBE9",
  brightPink: "#DE5499",
  darkTeal: "#264143",
  orange: "#E9944C",
};

export default function ReportsModal({ isOpen, onClose, data }) {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState("30");
  const [chartType, setChartType] = useState("bar");

  if (!isOpen) return null;

  const generateReport = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;

    // Draw report content
    ctx.fillStyle = colors.offWhite;
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = colors.darkTeal;
    ctx.font = "bold 24px Arial";
    ctx.fillText("Sales Report", 50, 50);

    ctx.font = "16px Arial";
    ctx.fillText(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);

    // Add more report content here...

    return canvas.toDataURL();
  };

  const downloadReport = () => {
    const dataUrl = generateReport();
    const link = document.createElement("a");
    link.download = `report-${reportType}-${
      new Date().toISOString().split("T")[0]
    }.png`;
    link.href = dataUrl;
    link.click();
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportType === "revenue") {
      csvContent += "Month,Revenue\n";
      data.monthlyRevenue?.forEach((item) => {
        csvContent += `${item.month},${item.revenue}\n`;
      });
    } else if (reportType === "orders") {
      csvContent += "Status,Count\n";
      Object.entries(data.orderStatuses || {}).forEach(([status, count]) => {
        csvContent += `${status},${count}\n`;
      });
    }

    const link = document.createElement("a");
    link.download = `report-${reportType}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.href = encodeURI(csvContent);
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        {/* <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: colors.darkTeal }}>
            Generate Reports
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors ml-10"
          >
            <FaTimes size={24} />
          </button>
        </div> */}
        {/* Chatgpt */}
        {/* <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-row-reverse">
          <h2 className="text-2xl font-bold" style={{ color: colors.darkTeal }}>
            Generate Reports
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <FaTimes size={24} />
          </button>
        </div> */}

        <div className="p-5 border-b border-gray-200 relative">
          <h2
            className="text-2xl font-bold pr-12"
            style={{ color: colors.darkTeal }}
          >
            Generate Reports
          </h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Report Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "revenue",
                  label: "Revenue Report",
                  icon: <FaChartLine />,
                },
                { id: "orders", label: "Orders Report", icon: <FaChartBar /> },
                {
                  id: "products",
                  label: "Products Report",
                  icon: <FaChartPie />,
                },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                    reportType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-blue-500">{type.icon}</div>
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaCalendarAlt />
                <span>Custom range</span>
              </div>
            </div>
          </div>

          {/* Chart Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Type
            </label>
            <div className="flex space-x-4">
              {[
                { id: "bar", label: "Bar Chart" },
                { id: "line", label: "Line Chart" },
                { id: "pie", label: "Pie Chart" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    chartType === type.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Report Preview
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: colors.lightPink }}
                >
                  <FaChartBar size={24} style={{ color: colors.darkTeal }} />
                </div>
                <p className="text-gray-600">
                  Report preview will be generated here
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {reportType === "revenue" && "Revenue trends and analytics"}
                  {reportType === "orders" &&
                    "Order status distribution and trends"}
                  {reportType === "products" &&
                    "Product performance and sales data"}
                </p>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={downloadReport}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: colors.brightPink }}
              >
                <FaDownload size={16} />
                <span>Download PNG</span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <FaDownload size={16} />
                <span>Export CSV</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
