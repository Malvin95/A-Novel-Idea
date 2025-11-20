import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ClaimsPanel from "./ClaimsPanel";

// Mock fetch for Storybook
if (typeof global !== "undefined") {
  (global as any).fetch = () =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          Items: [
            { id: { S: "1" }, reference: { S: "CLAIM-001" } },
            { id: { S: "2" }, reference: { S: "CLAIM-002" } },
          ],
        }),
    });
}

const meta: Meta<typeof ClaimsPanel> = {
  title: "Organisms/ClaimsPanel",
  component: ClaimsPanel,
};
export default meta;

type Story = StoryObj<typeof ClaimsPanel>;

export const Default: Story = {};
