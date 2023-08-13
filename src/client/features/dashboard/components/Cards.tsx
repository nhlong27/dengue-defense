import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { TabsContent } from "@/client/components/ui/tabs";
import React from "react";
import {
  Accessibility,
  MonitorSmartphone,
  Stethoscope,
  Ungroup,
} from "lucide-react";
import { api } from "@/utils/api";
import Overview from "./Overview";
import { Logs } from "../../device";

const Cards = () => {
  const getAllUsers = api.user.getAll.useQuery();
  const getAllDevices = api.device.getAll.useQuery();
  const getAllGroups = api.group.getAll.useQuery();
  const getAllLogs = api.log.getByDevice.useQuery({ deviceId: null});
  return getAllUsers.data &&
    getAllDevices.data &&
    getAllGroups.data &&
    getAllLogs.data ? (
    <TabsContent value="overview" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer bg-gradient-to-tr from-transparent to-primary/10 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total patients
            </CardTitle>
            <Accessibility className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAllUsers.data.filter((user) => user.role === "USER").length}{" "}
              <span className="text-base font-normal   text-muted-foreground">
                patients
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              +{getAllUsers.data.filter((user) => user.role === "USER").length}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer bg-gradient-to-tr from-transparent to-primary/10 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctors</CardTitle>
            <Stethoscope className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAllUsers.data.filter((user) => user.role === "ADMIN").length}{" "}
              <span className="text-base font-normal   text-muted-foreground">
                doctors
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              +{getAllUsers.data.filter((user) => user.role === "ADMIN").length}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer bg-gradient-to-tr from-transparent to-primary/10 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices</CardTitle>
            <MonitorSmartphone className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAllDevices.data.length}{" "}
              <span className="text-base font-normal   text-muted-foreground">
                devices
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              +{getAllDevices.data.length} from last month
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer bg-gradient-to-tr from-transparent to-primary/10 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Groups created
            </CardTitle>
            <Ungroup className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAllGroups.data.length}{" "}
              <span className="text-base font-normal   text-muted-foreground">
                groups
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              +{getAllGroups.data.length} since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-primary">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview
              data={{
                entries: ["doctors", "patients", "devices", "groups"],
                content: [
                  {
                    name: "February",
                    doctors: 0,
                    patients: 0,
                    devices: 0,
                    groups: 0,
                  },
                  {
                    name: "March",
                    doctors: 1,
                    patients: 2,
                    devices: 1,

                    groups: 2,
                  },
                  {
                    name: "April",
                    doctors: 2,
                    patients: 3,
                    devices: 5,

                    groups: 6,
                  },
                  {
                    name: "May",
                    doctors: 2,
                    patients: 4,
                    devices: 4,

                    groups: 4,
                  },
                  {
                    name: "June",
                    doctors: 3,
                    patients: 5,
                    devices: 6,

                    groups: 5,
                  },
                  {
                    name: "July",
                    doctors: 3,
                    patients: 6,
                    devices: 7,

                    groups: 5,
                  },
                  {
                    name: "August",
                    doctors: getAllUsers.data.filter(
                      (user) => user.role === "ADMIN"
                    ).length,
                    patients: getAllUsers.data.filter(
                      (user) => user.role === "USER"
                    ).length,
                    devices: getAllDevices.data.length,
                    groups: getAllGroups.data.length,
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-primary">Recent Logs</CardTitle>
            <CardDescription>
              There are a total of {getAllLogs.data.length} logs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Logs deviceId={null} />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  ) : null;
};

export default Cards;
