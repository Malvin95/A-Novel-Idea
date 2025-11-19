import React from "react";
import Logo from "./Logo";

export default { title: "Atoms/Logo", component: Logo };

export const Default = () => <Logo />;

export const WithClass = () => <Logo className="text-2xl text-zinc-700" />;
