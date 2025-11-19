import React, { useState } from "react";
import Input from "./Input";

export default { title: "Atoms/Input", component: Input };

export const Default = () => {
  const [value, setValue] = useState("");
  return <Input label="Name" value={value} onChange={setValue} placeholder="Enter name" />;
};

export const WithValue = () => {
  const [value, setValue] = useState("hello@example.com");
  return <Input label="Email" value={value} onChange={setValue} placeholder="you@example.com" />;
};
