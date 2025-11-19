import React from "react";
import Button from "./Button";

export default { title: "Atoms/Button", component: Button };

export const Default = (args: any) => <Button {...args} />;
Default.args = { children: "Click me" };

export const WithClass = (args: any) => <Button {...args} />;
WithClass.args = { children: "Primary", className: "rounded bg-zinc-900 px-3 py-1 text-white" };
