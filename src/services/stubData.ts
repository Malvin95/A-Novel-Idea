import { Claim, Project } from "@/shared/interfaces";
import { status } from "@/shared/enums";

export const mockProjects: Project[] = [
    { id: "1", dateCreated: "2024-01-01T00:00:00.000Z", projectName: "Project Alpha" },
    { id: "2", dateCreated: "2024-02-01T00:00:00.000Z", projectName: "Project Beta" }
];

export const mockClaims: Claim[] = [
    {
        id: "1",
        companyName: "NovaTech Solutions",
        claimPeriod: "2024-01",
        amount: 12500,
        associatedProject: "Project Atlas",
        status: status.DRAFT
    },
    {
        id: "2",
        companyName: "GreenLeaf Analytics",
        claimPeriod: "2024-02",
        amount: 18900,
        associatedProject: "EcoSphere Dashboard",
        status: status.SUBMITTED
    },
    {
        id: "3",
        companyName: "SkyBridge Innovations",
        claimPeriod: "2024-03",
        amount: 9400,
        associatedProject: "AeroLink Platform",
        status: status.DRAFT
    },
    {
        id: "4",
        companyName: "BlueWave Digital",
        claimPeriod: "2024-04",
        amount: 15250,
        associatedProject: "TideTracker App",
        status: status.DRAFT
    },
    {
        id: "5",
        companyName: "QuantumWorks Labs",
        claimPeriod: "2024-05",
        amount: 21000,
        associatedProject: "Q-Compute Engine",
        status: status.APPROVED
    },
    {
        id: "6",
        companyName: "CrestCore Systems",
        claimPeriod: "2024-06",
        amount: 8700,
        associatedProject: "CorePulse CRM",
        status: status.SUBMITTED
    },
    {
        id: "7",
        companyName: "BrightPath Technologies",
        claimPeriod: "2024-07",
        amount: 13350,
        associatedProject: "PathFinder AI",
        status: status.DRAFT
    },
    {
        id: "8",
        companyName: "HorizonEdge Limited",
        claimPeriod: "2024-08",
        amount: 17800,
        associatedProject: "EdgeVision Suite",
        status: status.APPROVED
    },
    {
        id: "9",
        companyName: "SilverPeak Engineering",
        claimPeriod: "2024-09",
        amount: 9600,
        associatedProject: "PeakFlow Monitor",
        status: status.DRAFT
    },
    {
        id: "10",
        companyName: "UrbanGrid Systems",
        claimPeriod: "2024-10",
        amount: 14750,
        associatedProject: "CityGrid Optimizer",
        status: status.SUBMITTED
    }
]
