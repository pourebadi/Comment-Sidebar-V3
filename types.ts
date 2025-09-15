export interface Reaction {
  emoji: string;
  user: string;
}

export interface CommentType {
  id: number;
  author: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  createdAt: Date;
  text: string;
  reactions: Reaction[];
  parentId?: number | null;
  attachment?: {
    url: string;
    type: 'image';
  };
  resolved?: boolean;
  isEdited?: boolean;
}