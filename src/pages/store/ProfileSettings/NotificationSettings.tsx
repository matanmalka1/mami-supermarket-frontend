import React from "react";
import { Bell } from "lucide-react";

type NotificationSettingsProps = {
  notificationSettings: {
    orderUpdates: boolean;
    weeklyDeals: boolean;
    freshArrivals: boolean;
  };
  toggleNotification: (
    key: keyof NotificationSettingsProps["notificationSettings"],
  ) => void;
};

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notificationSettings,
  toggleNotification,
}) => (
  <div className="bg-orange-50 border border-orange-100 p-10 rounded-[3rem] space-y-6">
    <div className="flex items-center gap-3 text-orange-600 uppercase text-xs tracking-widest border-b border-orange-200 pb-6">
      <Bell size={16} /> Notifications
    </div>
    <div className="space-y-4 font-bold text-gray-700">
      {[
        { id: "orderUpdates", label: "Order updates" },
        { id: "weeklyDeals", label: "Weekly deals" },
        { id: "freshArrivals", label: "Fresh arrivals" },
      ].map((item) => (
        <label
          key={item.id}
          className="flex items-center justify-between cursor-pointer group"
        >
          <span className="group-hover:text-gray-900 transition-colors">
            {item.label}
          </span>
          <div
            onClick={() =>
              toggleNotification(
                item.id as keyof NotificationSettingsProps["notificationSettings"],
              )
            }
            className={`w-12 h-6 rounded-full p-1 transition-colors ${notificationSettings[item.id as keyof NotificationSettingsProps["notificationSettings"]] ? "bg-orange-500" : "bg-gray-200"}`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${notificationSettings[item.id as keyof NotificationSettingsProps["notificationSettings"]] ? "translate-x-6" : "translate-x-0"}`}
            />
          </div>
        </label>
      ))}
    </div>
  </div>
);

export default NotificationSettings;
