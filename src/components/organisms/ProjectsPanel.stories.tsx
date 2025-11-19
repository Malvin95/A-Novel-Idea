import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ProjectsPanel from "./ProjectsPanel";

// Mock fetch for Storybook
if (typeof global !== "undefined") {
  (global as any).fetch = () =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          Items: [
            { id: { S: "1" }, name: { S: "Project Alpha" } },
            { id: { S: "2" }, name: { S: "Project Beta" } },
          ],
        }),
    });
}

const meta: Meta<typeof ProjectsPanel> = {
  title: "Organisms/ProjectsPanel",
  component: ProjectsPanel,
};
export default meta;

type Story = StoryObj<typeof ProjectsPanel>;

export const Default: Story = {};