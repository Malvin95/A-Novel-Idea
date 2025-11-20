import { Project } from "@/shared/interfaces";
import { ddbDocClient } from "@/lib/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DeleteItemCommand, GetItemCommand, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { EAVtype } from "../claims/claims.service";
import { v7 as uuidv7 } from "uuid";

const TABLE_NAME = "a-novel-project-table-v2";

export async function getProjects() {
    const res = await ddbDocClient.send(
        new ScanCommand({
            TableName: TABLE_NAME,
        })
    );
    return res;
}

export async function getProject(projectId: string, dateCreated: string) {
    const res = await ddbDocClient.send(
        new GetItemCommand({
            TableName: TABLE_NAME,
            Key: { 
                id: { S: projectId },
                dateCreated: { S: dateCreated }
            }
        })
    );
    return res;
}

export async function createProject(data: Project) {
    const res = await ddbDocClient.send(
        new PutItemCommand({
            TableName: TABLE_NAME,
            Item: {
                id: { S: uuidv7() },
                dateCreated: { S: new Date().toISOString() },
                projectName: { S: data.projectName }
            }
        })
    )

    return res;
}

export async function updateProject(projectId: string, dateCreated: string, data: Project) {
    const setFragments: string[] = []; // Used for the Update Expression, holds the dynamically determined columns that would be updated.
    const expressionAttributeValues: EAVtype = {}; // Used for the fields that have been filled in that the user wishes to update.
    const expressionAttributeNames: Record<string, string> = {}; // The names of the column/ fields that the user would be updating.

    // A data cleaner that modifies both the expressionAttributeValues Obj and the expressionAttributeNames 
    // so that they are formatted and ready for use when querying the dynamoDB
    // NOTE: Key attributes (id, dateCreated) cannot be updated - they must be excluded
    const addSetter = (field: keyof Project, value: Project[keyof Project]) => {
        if (value === undefined) return;
        // Skip key attributes - they cannot be updated in DynamoDB
        if (field === "id" || field === "dateCreated") return;
        const nameKey = `#${field}`;
        const valueKey = `:${field}`;
        expressionAttributeNames[nameKey] = field;
        (expressionAttributeValues as any)[valueKey] = typeof value === "number" 
            ? { N: String(value) } 
            : { S: value as string };
        setFragments.push(`${nameKey} = ${valueKey}`);
    };

    // Add updatable fields (excluding key attributes)
    addSetter("projectName", data.projectName);

    if (!setFragments.length) {
        throw new Error("No updatable fields were provided");
    }

    const res = await ddbDocClient.send(
        new UpdateItemCommand({
            TableName: TABLE_NAME,
            Key: { 
                id: { S: projectId },
                dateCreated: { S: dateCreated }
            },
            UpdateExpression: `SET ${setFragments.join(", ")}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames
        })
    );
    return res;
}

export async function deleteProject(projectId: string, dateCreated: string) {
    const res = await ddbDocClient.send(
        new DeleteItemCommand({
            TableName: TABLE_NAME,
            Key: { 
                id: {S: projectId},
                dateCreated: { S: dateCreated }
            }
        })
    );
    return res;
}
  
