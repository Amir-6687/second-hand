import React from "react";
import { render, screen } from "@testing-library/react";
import StatCard from "../StatCard";
import { FaUsers } from "react-icons/fa";

describe("StatCard", () => {
  const defaultProps = {
    title: "Total Users",
    value: "1,234",
    icon: <FaUsers className="text-white" size={24} />,
    trend: 12,
    color: "border-blue-500",
    bgColor: "bg-white",
  };

  it("renders with all props correctly", () => {
    render(<StatCard {...defaultProps} />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("12%")).toBeInTheDocument();
  });

  it("renders without trend when trend is not provided", () => {
    const propsWithoutTrend = { ...defaultProps };
    delete propsWithoutTrend.trend;

    render(<StatCard {...propsWithoutTrend} />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.queryByText("12%")).not.toBeInTheDocument();
  });

  it("shows positive trend with green color", () => {
    render(<StatCard {...defaultProps} trend={15} />);

    const trendElement = screen.getByText("15%");
    expect(trendElement).toHaveClass("text-green-600");
  });

  it("shows negative trend with red color", () => {
    render(<StatCard {...defaultProps} trend={-5} />);

    const trendElement = screen.getByText("5%");
    expect(trendElement).toHaveClass("text-red-600");
  });

  it("applies correct CSS classes", () => {
    render(<StatCard {...defaultProps} />);

    const card = screen.getByText("Total Users").closest("div");
    expect(card).toHaveClass("bg-white", "border-l-4", "border-blue-500");
  });
});
