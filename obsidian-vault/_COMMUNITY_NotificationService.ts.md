---
type: community
cohesion: 0.19
members: 15
---

# NotificationService.ts

**Cohesion:** 0.19 - loosely connected
**Members:** 15 nodes

## Members
- [[NotificationChannel]] - code - src/services/NotificationService.ts
- [[NotificationReport]] - code - src/services/NotificationService.ts
- [[NotificationService.ts]] - code - src/services/NotificationService.ts
- [[PendingItem]] - code - src/services/NotificationService.ts
- [[ReportPage()]] - code - src/pages/ReportPage.tsx
- [[TODO Implementar agendamento via service worker]] - rationale - src/services/NotificationService.ts
- [[checkAndSendScheduledNotifications()]] - code - src/services/NotificationService.ts
- [[collectPendingItems()]] - code - src/services/NotificationService.ts
- [[downloadReportHTML()]] - code - src/services/NotificationService.ts
- [[generateReportHTML()]] - code - src/services/NotificationService.ts
- [[handleDownloadHTML()]] - code - src/pages/ReportPage.tsx
- [[handlePrint()]] - code - src/pages/ReportPage.tsx
- [[loadReport()]] - code - src/pages/ReportPage.tsx
- [[sendEmailReport()]] - code - src/services/NotificationService.ts
- [[sendWhatsAppReport()]] - code - src/services/NotificationService.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/NotificationServicets
SORT file.name ASC
```

## Connections to other communities
- 10 edges to [[_COMMUNITY_App.tsx]]
- 5 edges to [[_COMMUNITY_storage.ts]]
- 2 edges to [[_COMMUNITY_OrderDetail.tsx]]
- 2 edges to [[_COMMUNITY_NotificationService.js]]
- 1 edge to [[_COMMUNITY_OrderList.tsx]]

## Top bridge nodes
- [[NotificationService.ts]] - degree 20, connects to 5 communities
- [[collectPendingItems()]] - degree 6, connects to 3 communities
- [[ReportPage()]] - degree 6, connects to 2 communities
- [[downloadReportHTML()]] - degree 4, connects to 1 community
- [[generateReportHTML()]] - degree 4, connects to 1 community