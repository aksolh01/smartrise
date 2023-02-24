export interface InfoDialogData {
  title: string;
  content: string | string[] | { title: string; list: string[] }[];
  dismissButtonLabel: string;
  showDismissButton?: boolean;
  messageIfEmpty?: string;
  showAsBulltes?: boolean;
}
