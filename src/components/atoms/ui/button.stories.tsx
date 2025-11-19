import React from "react";
import { Button as UIButton } from "./button";

export default { title: "Atoms/UI/Button", component: UIButton };

export const Default = () => <UIButton>Default</UIButton>;

export const Destructive = () => <UIButton variant="destructive">Delete</UIButton>;

export const Outline = () => <UIButton variant="outline">Outline</UIButton>;

export const Sizes = () => (
  <div className="flex gap-2">
    <UIButton size="sm">Small</UIButton>
    <UIButton>Default</UIButton>
    <UIButton size="lg">Large</UIButton>
    <UIButton size="icon">Icon</UIButton>
  </div>
);
