import { Separator } from "@/client/components/ui/separator";
import { api } from "@/utils/api";
import React from "react";
import UponAssignment from "./UponAssignment";
import { Overview } from "../../dashboard/intex";
import Logs from "./logs/Logs";
import { Button } from "@/client/components/ui/button";
import { Pause, Play } from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { toast } from "@/client/components/ui/use-toast";
import { RotatingLines } from "react-loader-spinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";

const DeviceDetail = ({ id }: { id: string }) => {
  const getDevice = api.device.get.useQuery({ deviceId: id });
  const getDeviceLogs = api.log.getByDevice.useQuery(
    { deviceId: id },
    { refetchInterval: 10000 }
  );
  const startDevice = api.device.start.useMutation();
  const pauseDevice = api.device.pause.useMutation();
  const deviceKey = getQueryKey(api.device.get, { deviceId: id });
  const queryClient = useQueryClient();
  return getDevice.data && getDeviceLogs.data ? (
    <div className="flex flex-col">
      <div className="flex w-full flex-col items-start gap-0 md:flex-row md:items-center md:gap-4">
        <h1>
          Device{" "}
          <span className="text-xl font-semibold text-primary">
            {getDevice.data.title}
          </span>
        </h1>
        <p className="hidden md:block">_</p>
        <h2>
          ID:{" "}
          <span className="text-lg font-semibold text-muted-foreground">
            {getDevice.data.id}.
          </span>
        </h2>

        <div className="ml-auto mr-8">
          Assigned to:{" "}
          <span
            className={`text-lg font-semibold ${
              getDevice.data.patient && getDevice.data.patient !== ""
                ? "text-green-500 dark:text-green-300"
                : "text-muted-foreground"
            }`}
          >
            {getDevice.data.patient && getDevice.data.patient !== ""
              ? getDevice.data.patient
              : "None"}
          </span>
        </div>
        {!getDevice.data.patient && <UponAssignment device={getDevice.data} />}
      </div>
      <div className="ml-4 mt-3 flex items-center gap-4 italic text-muted-foreground">
        <Button
          disabled={startDevice.isLoading}
          variant="default"
          className="flex items-center gap-2"
          onClick={() => {
            startDevice.mutate(
              { deviceId: getDevice.data.id.toString() },
              {
                onSuccess: () => {
                  toast({
                    title: "Started device!",
                  });
                  void queryClient.invalidateQueries(deviceKey);
                },
                onError: (error) => {
                  console.log(error);
                  toast({
                    title: "Command failed",
                    description: "Check console for error message",
                    variant: "destructive",
                  });
                },
              }
            );
          }}
        >
          <Play size={20} /> Start
          {startDevice.isLoading && (
            <RotatingLines strokeColor="#422006" strokeWidth="5" width="20" />
          )}
        </Button>
        <Button
          disabled={pauseDevice.isLoading}
          variant="secondary"
          className="flex items-center gap-2"
          onClick={() => {
            pauseDevice.mutate(
              { deviceId: getDevice.data.id.toString() },
              {
                onSuccess: () => {
                  toast({
                    title: "Paused device!",
                  });
                  void queryClient.invalidateQueries(deviceKey);
                },
                onError: (error) => {
                  console.log(error);
                  toast({
                    title: "Command failed",
                    description: "Check console for error message",
                    variant: "destructive",
                  });
                },
              }
            );
          }}
        >
          <Pause size={20} /> Pause
          {pauseDevice.isLoading && (
            <RotatingLines strokeColor="#422006" strokeWidth="5" width="20" />
          )}
        </Button>
        Monitoring
        <div className="ml-auto">
          {getDevice.data.active ? (
            <Badge
              variant="outline"
              className=" bg-green-500 px-6 py-2 text-sm text-green-200 dark:bg-green-600 dark:text-green-300"
            >
              Active
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className=" bg-gray-500 px-6 py-2 text-sm text-gray-200 dark:bg-gray-600 dark:text-gray-300"
            >
              Inactive
            </Badge>
          )}
        </div>
      </div>

      <Separator className="my-4" />
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="temp">Temperature</TabsTrigger>
          <TabsTrigger value="spo2">SpO2</TabsTrigger>
          <TabsTrigger value="HP">HP</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Overview
            data={{
              entries: ["Temperature", "SpO2", "Heart Pressure"],
              content: getDeviceLogs.data.slice(0, 10).map((log) => ({
                name: new Date(log.logged_at).toLocaleDateString(),
                Temperature: log.temp,
                SpO2: log.spo2,
                "Heart Pressure": log.HP,
              })),
            }}
          />
        </TabsContent>
        <TabsContent value="temp">
          <Overview
            data={{
              entries: ["", "", "Temperature"],
              content: getDeviceLogs.data.slice(0, 10).map((log) => ({
                name: new Date(log.logged_at).toLocaleDateString(),
                Temperature: log.temp,
              })),
            }}
          />
        </TabsContent>
        <TabsContent value="spo2">
          <Overview
            data={{
              entries: ["", "SpO2"],
              content: getDeviceLogs.data.slice(0, 10).map((log) => ({
                name: new Date(log.logged_at).toLocaleDateString(),
                SpO2: log.spo2,
              })),
            }}
          />
        </TabsContent>
        <TabsContent value="HP">
          <Overview
            data={{
              entries: ["Heart Pressure"],
              content: getDeviceLogs.data.slice(0, 10).map((log) => ({
                name: new Date(log.logged_at).toLocaleDateString(),
                "Heart Pressure": log.HP,
              })),
            }}
          />
        </TabsContent>
      </Tabs>

      <Logs deviceId={getDevice.data.id.toString()} />
    </div>
  ) : null;
};

export default DeviceDetail;
