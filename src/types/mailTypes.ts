export interface Mail {
    id: number;
    fromName: string;
    fromEmail: string;
    toName: string;
    toEmail: string;
    cc: string | null;
    bcc: string | null;
    threadId: number;
    messageId: string;
    inReplyTo: string | null;
    references: string;
    subject: string;
    body: string;
    isRead: boolean;
    folder: string;
    uid: number;
    sentAt: string;
    archivedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }
  