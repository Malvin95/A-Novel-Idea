import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import DashboardPanel from "./DashboardPanel";

// Mock fetch for Storybook (for child panels)
if (typeof global !== "undefined") {
  (global as any).fetch = (url: string) => {
    if (url.includes("projects")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            Items: [
              { id: { S: "1" }, name: { S: "Project Alpha" } },
              { id: { S: "2" }, name: { S: "Project Beta" } },
            ],
          }),
      });
    }
    if (url.includes("claims")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            Items: [
              { id: { S: "1" }, reference: { S: "CLAIM-001" } },
              { id: { S: "2" }, reference: { S: "CLAIM-002" } },
            ],
          }),
      });
    }
    return Promise.resolve({ json: () => Promise.resolve({ Items: [] }) });
  };
}

const meta: Meta<typeof DashboardPanel> = {
  title: "Organisms/DashboardPanel",
  component: DashboardPanel,
};
export default meta;

type Story = StoryObj<typeof DashboardPanel>;

export const Default: Story = {};
