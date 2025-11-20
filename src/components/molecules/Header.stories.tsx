import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";

const meta: Meta<typeof Header> = {
  title: "Molecules/Header",
  component: Header,
  args: {
    title: "Dashboard",
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    title: "Dashboard",
  },
};
