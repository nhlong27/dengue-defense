import { DateRangePicker } from "@/client/components/DateRangePicker";
import React from "react";
import Cards from "./Cards";
import { Tabs, TabsList, TabsTrigger } from "@/client/components/ui/tabs";
const Dashboard = () => {
  return (
    <div>
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex w-full justify-between px-0 lg:px-8 flex-col lg:flex-row gap-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger  value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger  className="hidden sm:block" value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger className="hidden sm:block" value="notifications" disabled>
              Notifications
            </TabsTrigger>
          </TabsList>
          <DateRangePicker />
        </div>
        <Cards />
      </Tabs>
    </div>
  );
};

export default Dashboard;
