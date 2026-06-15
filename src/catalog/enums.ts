export const ContentTypeCode = {
  TEXT: 'TEXT',
  HTML: 'HTML',
  IMAGE: 'IMAGE',
  BANNER: 'BANNER',
  VIDEO: 'VIDEO',
} as const;

export type ContentTypeCode = (typeof ContentTypeCode)[keyof typeof ContentTypeCode];
