import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardOverview from "./dashboard/DashboardOverview";

const Home = () => {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
};

export default Home;
