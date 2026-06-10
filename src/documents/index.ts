export { DocumentStateSchema } from './enums.js';
export type { DocumentState } from './enums.js';

export {
  CreateDocumentTypeRequestSchema,
  UpdateDocumentTypeRequestSchema,
  ListDocumentTypesQuerySchema,
  CreateNegotiationDocumentRequestSchema,
  UpdateNegotiationDocumentRequestSchema,
  ListNegotiationDocumentsQuerySchema,
  ChangeDocumentStateRequestSchema,
  ListDocumentStateHistoryQuerySchema,
} from './request.js';

export type {
  CreateDocumentTypeRequest,
  UpdateDocumentTypeRequest,
  ListDocumentTypesQuery,
  CreateNegotiationDocumentRequest,
  UpdateNegotiationDocumentRequest,
  ListNegotiationDocumentsQuery,
  ChangeDocumentStateRequest,
  ListDocumentStateHistoryQuery,
} from './request.js';

export {
  DocumentTypeResponseSchema,
  NegotiationDocumentResponseSchema,
  NegotiationDocumentListItemResponseSchema,
  DocumentStateHistoryResponseSchema,
} from './response.js';

export type {
  DocumentTypeResponse,
  NegotiationDocumentResponse,
  NegotiationDocumentListItemResponse,
  DocumentStateHistoryResponse,
} from './response.js';
