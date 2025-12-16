"use client";

import React, { useEffect } from "react";
import { useWindowAnalytics, useWindowState } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WindowTracker() {
  const { windowStats } = useWindowAnalytics();
  const { windowCount, openWindows, activeWindow } = useWindowState();
  const [showDetails, setShowDetails] = React.useState(false);

  // Log window changes for debugging
  useEffect(() => {
    console.log("Window stats updated:", windowStats);
  }, [windowStats]);

  return (
    <Card className="bg-background/25 backdrop-blur-sm w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Window Tracker</CardTitle>
        <CardDescription>Real-time window monitoring and analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Windows</span>
              <span className="text-2xl font-bold">{windowStats.totalWindows}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Open Windows</span>
              <span className="text-2xl font-bold">{windowStats.openCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Minimized</span>
              <span className="text-2xl font-bold">{windowStats.minimizedCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Maximized</span>
              <span className="text-2xl font-bold">{windowStats.maximizedCount}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Active Window</span>
              {activeWindow ? (
                <span className="text-sm text-muted-foreground">
                  {activeWindow.title} ({activeWindow.type})
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>

            {showDetails && (
              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <strong>Window Types:</strong>
                  <div className="ml-4">
                    {/* @ts-ignore */}
                    {Object.entries(windowStats.windowTypes).map(([type, count]) => (
                      <div key={type}>
                        {/* @ts-ignore */}
                        {type}: {count}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <strong>Open Windows:</strong>
                  {openWindows.length > 0 ? (
                    <ul className="ml-4 list-disc">
                      {openWindows.map((window: any) => (
                        <li key={window.id}>
                          {window.title} ({window.type}) - {window.state}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="ml-4 text-muted-foreground">No open windows</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
