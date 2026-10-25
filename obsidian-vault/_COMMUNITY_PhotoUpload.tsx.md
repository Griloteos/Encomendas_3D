---
type: community
cohesion: 0.24
members: 11
---

# PhotoUpload.tsx

**Cohesion:** 0.24 - loosely connected
**Members:** 11 nodes

## Members
- [[PhotoThumb()]] - code - src/components/PhotoUpload.tsx
- [[PhotoUpload()]] - code - src/components/PhotoUpload.tsx
- [[PhotoUpload.tsx]] - code - src/components/PhotoUpload.tsx
- [[PhotoUploadProps]] - code - src/components/PhotoUpload.tsx
- [[browser-image-compression]] - concept - package.json
- [[deletePhoto()]] - code - src/lib/storage.ts
- [[getSignedPhotoUrl()]] - code - src/lib/storage.ts
- [[handleFileChange()]] - code - src/components/PhotoUpload.tsx
- [[handleRemove()]] - code - src/components/PhotoUpload.tsx
- [[loadOrder()]] - code - src/pages/OrderDetail.tsx
- [[uploadPhoto()]] - code - src/lib/storage.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/PhotoUploadtsx
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_storage.ts]]
- 3 edges to [[_COMMUNITY_OrderForm.tsx]]
- 2 edges to [[_COMMUNITY_OrderDetail.tsx]]
- 1 edge to [[_COMMUNITY_App.tsx]]
- 1 edge to [[_COMMUNITY_package.json_1]]

## Top bridge nodes
- [[PhotoUpload.tsx]] - degree 10, connects to 3 communities
- [[getSignedPhotoUrl()]] - degree 5, connects to 2 communities
- [[loadOrder()]] - degree 3, connects to 2 communities
- [[PhotoUpload()]] - degree 4, connects to 1 community
- [[deletePhoto()]] - degree 3, connects to 1 community