export type NotificationStatusType = "success" | "error" | "info" | "warning";

export interface INotification {
  title: string;
  message: string;
  status: NotificationStatusType;
}
