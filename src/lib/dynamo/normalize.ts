import { Claim, Project } from "@/shared/interfaces";

// Helpers to normalize DynamoDB AttributeValue shapes and responses into plain JS objects
type AttrValue = any;

function isAttributeValue(v: any): boolean {
  if (v == null || typeof v !== "object") return false;
  // common Dynamo AttributeValue keys
  const keys = Object.keys(v);
  return keys.some((k) => ["S", "N", "BOOL", "M", "L", "NULL", "SS", "NS", "BS"].includes(k));
}

export function normalizeAttributeValue(av: AttrValue): any {
  if (av == null) return av;
  if (typeof av !== "object") return av;
  if ("S" in av) return av.S;
  if ("N" in av) {
    const n = Number(av.N);
    return Number.isNaN(n) ? av.N : n;
  }
  if ("BOOL" in av) return av.BOOL;
  if ("NULL" in av) return null;
  if ("SS" in av) return av.SS;
  if ("NS" in av) return (av.NS || []).map((x: string) => { const n = Number(x); return Number.isNaN(n) ? x : n; });
  if ("M" in av) {
    const out: any = {};
    for (const k of Object.keys(av.M || {})) out[k] = normalizeAttributeValue(av.M[k]);
    return out;
  }
  if ("L" in av) return (av.L || []).map(normalizeAttributeValue);
  // fallback: unknown wrapper
  const keys = Object.keys(av);
  if (keys.length === 0) return av;
  // If the object looks like an attribute map (values are attr values), normalize each entry
  const maybeAttrMap = keys.every((k) => isAttributeValue(av[k]));
  if (maybeAttrMap) {
    const out: any = {};
    for (const k of keys) out[k] = normalizeAttributeValue(av[k]);
    return out;
  }
  return av;
}

export function normalizeItem(item: any): Project | Claim {
  if (item == null) return item;
  // Dynamo responses sometimes return { Attributes: { name: {S: 'x'} } }
  if (item.Attributes && typeof item.Attributes === "object") {
    const out: any = {};
    for (const k of Object.keys(item.Attributes)) out[k] = normalizeAttributeValue(item.Attributes[k]);
    return out;
  }

  // If item values are attribute-value wrappers, normalize them
  const keys = Object.keys(item);
  if (keys.length > 0 && keys.every((k) => isAttributeValue(item[k]))) {
    const out: any = {};
    for (const k of keys) out[k] = normalizeAttributeValue(item[k]);
    return out;
  }

  // Already plain object (Dynamo DocumentClient may already unmarshall)
  return item;
}

export function normalizeItemsResponse(resp: any): any {
  if (!resp) return resp;
  if (Array.isArray(resp)) return resp.map(normalizeItem);
  if (resp.Items) return { ...resp, Items: Array.isArray(resp.Items) ? resp.Items.map(normalizeItem) : resp.Items };
  if (resp.Item) return { ...resp, Item: normalizeItem(resp.Item) };
  return resp;
}

export default { normalizeAttributeValue, normalizeItem, normalizeItemsResponse };
