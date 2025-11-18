import { Claim } from "@/shared/interfaces";
import { ddbDocClient } from "@/pages/api/lib/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DeleteItemCommand, GetItemCommand, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const TABLE_NAME = "a-novel-claim-table";

type EAVtype= {
    ':claimPeriod'?: { S: string },
    ':amount'?: { N: string },
    ':associatedProject'?: { S: string },
    ':status'?: { S: string }
}

export async function getClaims() {
    const res = await ddbDocClient.send(
        new ScanCommand({
            TableName: TABLE_NAME,
        })
    );
    return res;
}

export async function getClaim(claimId: string, companyName: string) {
    const res = await ddbDocClient.send(
        new GetItemCommand({
            TableName: TABLE_NAME,
            Key: { 
                id: { S: claimId },
                companyName: { S: companyName }
            }
        })
    );
    return res;
}

export async function createClaim(data: Claim) {
    const res = await ddbDocClient.send(
        new PutItemCommand({
            TableName: TABLE_NAME,
            Item: {
                id: { S: Date.now().toString() },
                companyName: { S: data.companyName },
                claimPeriod: { S: data.claimPeriod },
                amount: { N: data.amount.toString() },
                associatedProject: { S: data.associatedProject },
                status: { S: data.status }
            }
        })
    )

    return res;
}

export async function updateClaim(claimId: string, companyName: string, data: Partial<Claim>) {
    const setFragments: string[] = []; // Used for the Update Expression, holds the dynamically determined columns that would be updated.
    const expressionAttributeValues: EAVtype = {}; // Used for the fields that have been filled in that the user wishes to update.
    const expressionAttributeNames: Record<string, string> = {}; // The names of the column/ fields that the user would be updating.

    // A data cleaner that modifies both the expressionAttributeValues Obj and the expressionAttributeNames 
    // so that they are formatted and ready for use when querying the dynamoDB
    const addSetter = (field: keyof Claim, value: Claim[keyof Claim]) => {
        if (value === undefined) return;
        const nameKey = `#${field}`;
        const valueKey = `:${field}`;
        expressionAttributeNames[nameKey] = field;
        expressionAttributeValues[valueKey] = typeof value === "number" ? { N: value.toString() } : { S: value };
        setFragments.push(`${nameKey} = ${valueKey}`);
    };

    addSetter("claimPeriod", data.claimPeriod);
    addSetter("amount", data.amount);
    addSetter("associatedProject", data.associatedProject);
    addSetter("status", data.status);

    if (!setFragments.length) {
        throw new Error("No updatable fields were provided");
    }

    const res = await ddbDocClient.send(
        new UpdateItemCommand({
            TableName: TABLE_NAME,
            Key: { 
                id: { S: claimId },
                companyName: { S: companyName }
            },
            UpdateExpression: `SET ${setFragments.join(", ")}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames
        })
    );
    return res;
}

export async function deleteClaim(claimId: string, companyName: string) {
    const res = await ddbDocClient.send(
        new DeleteItemCommand({
            TableName: TABLE_NAME,
            Key: { 
                id: {S: claimId},
                companyName: { S: companyName }
            }
        })
    )
    return res;
}