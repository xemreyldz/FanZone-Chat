export interface Group {
  GroupID: number;
  GroupName: string;
  GroupImageUrl: string;
  Description: string;
  Members?: { id: number; name: string }[];
  SharedFiles?: { id: number; name: string; size: string }[];
  LastMessage?: string | null;
  LastMessageTime?: string | null;
  Username?: string | null;
}
