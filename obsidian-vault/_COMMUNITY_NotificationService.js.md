---
type: community
cohesion: 0.33
members: 10
---

# NotificationService.js

**Cohesion:** 0.33 - loosely connected
**Members:** 10 nodes

## Members
- [[NotificationService.js]] - code - src/services/NotificationService.js
- [[TODO Implementar agendamento via service worker_1]] - rationale - src/services/NotificationService.js
- [[checkAndSendScheduledNotifications()_1]] - code - src/services/NotificationService.js
- [[collectPendingItems()_1]] - code - src/services/NotificationService.js
- [[downloadReportHTML()_1]] - code - src/services/NotificationService.js
- [[generateReportHTML()_1]] - code - src/services/NotificationService.js
- [[getReminders()]] - code - src/lib/storage.ts
- [[scheduleRecurringNotification()_1]] - code - src/services/NotificationService.js
- [[sendEmailReport()_1]] - code - src/services/NotificationService.js
- [[sendWhatsAppReport()_1]] - code - src/services/NotificationService.js

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/NotificationServicejs
SORT file.name ASC
```

## Connections to other communities
- 7 edges to [[_COMMUNITY_storage.ts]]
- 2 edges to [[_COMMUNITY_NotificationService.ts]]
- 1 edge to [[_COMMUNITY_OrderList.tsx]]

## Top bridge nodes
- [[NotificationService.js]] - degree 13, connects to 2 communities
- [[getReminders()]] - degree 7, connects to 2 communities
- [[collectPendingItems()_1]] - degree 4, connects to 1 community