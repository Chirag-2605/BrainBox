export const DEFAULT_CARDS = [
  // BACKLOG
  { title: "Look into render bug in dashboard", card_id: "1", column_id: 1 },
  { title: "SOX compliance checklist", card_id: "2", column_id: 1 },
  { title: "[SPIKE] Migrate to Azure", card_id: "3", column_id: 1 },
  { title: "Document Notifications service", card_id: "4", column_id: 1 },
  // TODO
  {
    title: "Research DB options for new microservice",
    card_id: "5",
    column_id: 2,
  },
  { title: "Postmortem for outage", card_id: "6", column_id: 2 },
  { title: "Sync with product on Q3 roadmap", card_id: "7", column_id: 2 },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    card_id: "8",
    column_id: 3,
  },
  { title: "Add logging to daily CRON", card_id: "9", column_id: 3 },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    card_id: "10",
    column_id: 4,
  }
];