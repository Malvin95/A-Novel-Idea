import React from "react";
import NavLink from "./NavLink";

export default { title: "Atoms/NavLink", component: NavLink };

export const Default = () => <NavLink href="/">Home</NavLink>;

export const Projects = () => <NavLink href="/dashboard/projects">Projects</NavLink>;
