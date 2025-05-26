"use client";

import { TabsProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TabNavigation({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="border-b mb-6">
      <div className="flex space-x-8">
        <button
          id="tab-prediction"
          onClick={() => setActiveTab("prediction")}
          className={cn(
            "px-1 py-4 font-medium text-sm border-b-2 focus:outline-none",
            activeTab === "prediction" 
              ? "border-primary dark:border-white text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Manual Prediction
        </button>
        <button
          id="tab-location"
          onClick={() => setActiveTab("location")}
          className={cn(
            "px-1 py-4 font-medium text-sm border-b-2 focus:outline-none",
            activeTab === "location" 
              ? "border-primary dark:border-white text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Location-based
        </button>
        <button
          id="tab-history"
          onClick={() => setActiveTab("history")}
          className={cn(
            "px-1 py-4 font-medium text-sm border-b-2 focus:outline-none",
            activeTab === "history" 
              ? "border-primary dark:border-white text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          History
        </button>
      </div>
    </div>
  );
}