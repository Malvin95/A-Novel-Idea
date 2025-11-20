## API Overview

- **Base URL (dev)**: `http://localhost:3000/api`
- The API layer is implemented with Next.js API routes in `src/pages/api`.
- Data is served from in-memory mock collections defined in `src/services/stubData.ts`; no external database is used.
- Requests and responses are JSON.

---

## Projects API (`/projects`)

| Method | Path | Description | Service Function |
| --- | --- | --- | --- |
| `GET` | `/projects` | List all projects. | `getProjects()` |
| `POST` | `/projects` | Create a project. Body must match `Project` shape. | `createProject(data)` |
| `GET` | `/projects/{id}` | Retrieve a project by ID. | `getProject(id)` |
| `PATCH` | `/projects/{id}` | Update fields on an existing project. | `updateProject(id, data)` |
| `DELETE` | `/projects/{id}` | Remove a project. | `deleteProject(id)` |

### Example

**Request**
```
GET http://localhost:3000/api/projects/1
```

**Response**
```json
{
  "id": "1",
  "name": "Project Alpha"
}
```

---

## Claims API (`/claims`)

| Method | Path | Description | Service Function |
| --- | --- | --- | --- |
| `GET` | `/claims` | List all claims. | `getClaims()` |
| `POST` | `/claims` | Create a claim. Body must match `Claim` shape. | `createClaim(data)` |
| `GET` | `/claims/{id}` | Retrieve a claim by ID. | `getClaim(id)` |
| `PATCH` | `/claims/{id}` | Update selected fields on a claim. | `updateClaim(id, data)` |
| `DELETE` | `/claims/{id}` | Remove a claim. | `deleteClaim(id)` |

### Example

**Request**
```
PATCH http://localhost:3000/api/claims/2
```
PATCH http://localhost:3000/api/claims/2
Content-Type: application/json

{
  "status": "APPROVED"
}
```

**Response**
```json
{
  "id": "2",
  "companyName": "GreenLeaf Analytics",
  "claimPeriod": "2024-02",
  "amount": 18900,
  "associatedProject": "EcoSphere Dashboard",
  "status": "APPROVED"
}
```

---

## Service Layer

Located under `src/services/`.

| File | Responsibility | Notes |
| --- | --- | --- |
| `projects.services.ts` | CRUD helpers for projects. | All methods are async wrappers over `mockProjects`. |
| `claims.service.ts` | CRUD helpers for claims. | Uses `mockClaims`. PATCH-style updates merge payload fields. |
| `stubData.ts` | Mock datasets shared by both services. | Seeds both collections; IDs are strings. |

Each API route imports its corresponding service functions to keep HTTP handling separate from data manipulation.

