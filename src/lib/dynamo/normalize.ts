import { Claim, Project } from "@/shared/interfaces";

// Helpers to normalize DynamoDB AttributeValue shapes and responses into plain JS objects
type AttrValue = unknown;

function isAttributeValue(v: unknown): boolean {
  if (v == null || typeof v !== "object") return false;
  // common Dynamo AttributeValue keys
  const keys = Object.keys(v as Record<string, unknown>);
  return keys.some((k) => ["S", "N", "BOOL", "M", "L", "NULL", "SS", "NS", "BS"].includes(k));
}

export function normalizeAttributeValue(av: AttrValue): unknown {
  if (av == null) return av;
  if (typeof av !== "object") return av;
  const o = av as Record<string, unknown>;
  if ("S" in o) return o["S"];
  if ("N" in o) {
    const n = Number(o["N"] as unknown as string);
    return Number.isNaN(n) ? o["N"] : n;
  }
  if ("BOOL" in o) return o["BOOL"];
  if ("NULL" in o) return null;
  if ("SS" in o) return o["SS"];
  if ("NS" in o) {
    const ns = (o["NS"] as unknown) as string[] | undefined;
    return (ns || []).map((x) => { const n = Number(x); return Number.isNaN(n) ? x : n; });
  }
  if ("M" in o) {
    const map = (o["M"] as unknown) as Record<string, unknown> | undefined;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(map || {})) out[k] = normalizeAttributeValue(map![k]);
    return out;
  }
  if ("L" in o) {
    const list = (o["L"] as unknown) as unknown[] | undefined;
    return (list || []).map(normalizeAttributeValue);
  }
  // fallback: unknown wrapper
  const keys = Object.keys(o);
  if (keys.length === 0) return av;
  // If the object looks like an attribute map (values are attr values), normalize each entry
  const maybeAttrMap = keys.every((k) => isAttributeValue(o[k]));
  if (maybeAttrMap) {
    const out: Record<string, unknown> = {};
    for (const k of keys) out[k] = normalizeAttributeValue(o[k]);
    return out;
  }
  return av;
}

export function normalizeItem(item: unknown): Record<string, unknown> | unknown {
  if (item == null) return item;
  // Dynamo responses sometimes return { Attributes: { name: {S: 'x'} } }
  const obj = item as Record<string, unknown>;
  if (obj.Attributes && typeof obj.Attributes === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj.Attributes as Record<string, unknown>)) out[k] = normalizeAttributeValue((obj.Attributes as Record<string, unknown>)[k]);
    return out;
  }

  // If item values are attribute-value wrappers, normalize them
  const keys = Object.keys(obj);
  if (keys.length > 0 && keys.every((k) => isAttributeValue(obj[k]))) {
    const out: Record<string, unknown> = {};
    for (const k of keys) out[k] = normalizeAttributeValue(obj[k]);
    return out;
  }

  // Already plain object (Dynamo DocumentClient may already unmarshall)
  return item;
}

export function normalizeItemsResponse(resp: unknown): unknown {
  if (!resp) return resp;
  const r = resp as Record<string, unknown>;
  if (Array.isArray(resp)) return (resp as unknown[]).map(normalizeItem);
  if (r.Items) return { ...r, Items: Array.isArray(r.Items) ? (r.Items as unknown[]).map(normalizeItem) : r.Items };
  if (r.Item) return { ...r, Item: normalizeItem(r.Item) };
  return resp;
}

export default { normalizeAttributeValue, normalizeItem, normalizeItemsResponse };
