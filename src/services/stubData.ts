import { Claim, Project } from "@/shared/interfaces";
import { status } from "@/shared/enums";

export const mockProjects: Project[] = [
    { id: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6", dateCreated: "2024-01-15T09:30:00.000Z", projectName: "AI-Powered Customer Analytics Platform" },
    { id: "01939c60-1f3b-7c4d-8e5f-d2e3f4a5b6c7", dateCreated: "2024-03-22T14:15:00.000Z", projectName: "Quantum Computing Research Initiative" },
    { id: "01939c61-2g4c-7d5e-9f6g-e3f4a5b6c7d8", dateCreated: "2024-05-10T11:45:00.000Z", projectName: "Blockchain Supply Chain Tracker" },
    { id: "01939c62-3h5d-7e6f-0g7h-f4a5b6c7d8e9", dateCreated: "2024-06-18T08:20:00.000Z", projectName: "Machine Learning Medical Diagnostics" },
    { id: "01939c63-4i6e-7f7g-1h8i-a5b6c7d8e9f0", dateCreated: "2024-07-25T16:00:00.000Z", projectName: "IoT Smart City Infrastructure" },
    { id: "01939c64-5j7f-7g8h-2i9j-b6c7d8e9f0a1", dateCreated: "2024-09-03T10:30:00.000Z", projectName: "Advanced Robotics Automation System" },
    { id: "01939c65-6k8g-7h9i-3j0k-c7d8e9f0a1b2", dateCreated: "2024-10-12T13:45:00.000Z", projectName: "Green Energy Optimization Software" },
    { id: "01939c66-7l9h-7i0j-4k1l-d8e9f0a1b2c3", dateCreated: "2024-11-20T15:20:00.000Z", projectName: "Cybersecurity Threat Detection Platform" }
];

export const mockClaims: Claim[] = [
    {
        id: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f",
        dateCreated: "2024-04-15T10:30:00.000Z",
        companyName: "TechVision Solutions Ltd",
        claimPeriod: "2024-Q1",
        amount: 125000,
        associatedProject: "AI-Powered Customer Analytics Platform",
        status: status.APPROVED
    },
    {
        id: "01939c71-2b3c-7d4e-5f6g-2b3c4d5e6f7g",
        dateCreated: "2024-07-20T14:15:00.000Z",
        companyName: "Quantum Innovations Inc",
        claimPeriod: "2024-Q2",
        amount: 250000,
        associatedProject: "Quantum Computing Research Initiative",
        status: status.SUBMITTED
    },
    {
        id: "01939c72-3c4d-7e5f-6g7h-3c4d5e6f7g8h",
        dateCreated: "2024-08-05T11:45:00.000Z",
        companyName: "BlockChain Systems Corp",
        claimPeriod: "2024-Q2",
        amount: 180000,
        associatedProject: "Blockchain Supply Chain Tracker",
        status: status.APPROVED
    },
    {
        id: "01939c73-4d5e-7f6g-7h8i-4d5e6f7g8h9i",
        dateCreated: "2024-09-18T08:20:00.000Z",
        companyName: "MedTech Diagnostics Ltd",
        claimPeriod: "2024-Q3",
        amount: 320000,
        associatedProject: "Machine Learning Medical Diagnostics",
        status: status.SUBMITTED
    },
    {
        id: "01939c74-5e6f-7g7h-8i9j-5e6f7g8h9i0j",
        dateCreated: "2024-10-25T16:00:00.000Z",
        companyName: "Smart City Technologies",
        claimPeriod: "2024-Q3",
        amount: 275000,
        associatedProject: "IoT Smart City Infrastructure",
        status: status.DRAFT
    },
    {
        id: "01939c75-6f7g-7h8i-9j0k-6f7g8h9i0j1k",
        dateCreated: "2024-11-03T10:30:00.000Z",
        companyName: "Robotics Automation Group",
        claimPeriod: "2024-Q4",
        amount: 195000,
        associatedProject: "Advanced Robotics Automation System",
        status: status.DRAFT
    },
    {
        id: "01939c76-7g8h-7i9j-0k1l-7g8h9i0j1k2l",
        dateCreated: "2024-11-12T13:45:00.000Z",
        companyName: "GreenTech Energy Solutions",
        claimPeriod: "2024-Q4",
        amount: 210000,
        associatedProject: "Green Energy Optimization Software",
        status: status.APPROVED
    },
    {
        id: "01939c77-8h9i-7j0k-1l2m-8h9i0j1k2l3m",
        dateCreated: "2024-11-20T15:20:00.000Z",
        companyName: "CyberGuard Security Ltd",
        claimPeriod: "2024-Q4",
        amount: 165000,
        associatedProject: "Cybersecurity Threat Detection Platform",
        status: status.SUBMITTED
    },
    {
        id: "01939c78-9i0j-7k1l-2m3n-9i0j1k2l3m4n",
        dateCreated: "2024-10-08T09:15:00.000Z",
        companyName: "TechVision Solutions Ltd",
        claimPeriod: "2024-Q3",
        amount: 142000,
        associatedProject: "AI-Powered Customer Analytics Platform",
        status: status.APPROVED
    },
    {
        id: "01939c79-0j1k-7l2m-3n4o-0j1k2l3m4n5o",
        dateCreated: "2024-11-28T11:30:00.000Z",
        companyName: "BlockChain Systems Corp",
        claimPeriod: "2024-Q4",
        amount: 198000,
        associatedProject: "Blockchain Supply Chain Tracker",
        status: status.DRAFT
    }
]
