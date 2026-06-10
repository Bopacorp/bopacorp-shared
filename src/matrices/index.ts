export { MatrixStateSchema } from './enums.js';
export type { MatrixState } from './enums.js';

export {
  CreateOfferMatrixRequestSchema,
  UpdateOfferMatrixRequestSchema,
  ListOfferMatricesQuerySchema,
  ChangeMatrixStateRequestSchema,
  CreateMatrixLineItemRequestSchema,
  UpdateMatrixLineItemRequestSchema,
  ListMatrixLineItemsQuerySchema,
  CreateMatrixAttachmentRequestSchema,
  ListMatrixAttachmentsQuerySchema,
  ListMatrixStateHistoryQuerySchema,
} from './request.js';

export type {
  CreateOfferMatrixRequest,
  UpdateOfferMatrixRequest,
  ListOfferMatricesQuery,
  ChangeMatrixStateRequest,
  CreateMatrixLineItemRequest,
  UpdateMatrixLineItemRequest,
  ListMatrixLineItemsQuery,
  CreateMatrixAttachmentRequest,
  ListMatrixAttachmentsQuery,
  ListMatrixStateHistoryQuery,
} from './request.js';

export {
  OfferMatrixResponseSchema,
  OfferMatrixListItemResponseSchema,
  MatrixLineItemResponseSchema,
  MatrixLineItemListItemResponseSchema,
  MatrixAttachmentResponseSchema,
  MatrixStateHistoryResponseSchema,
} from './response.js';

export type {
  OfferMatrixResponse,
  OfferMatrixListItemResponse,
  MatrixLineItemResponse,
  MatrixLineItemListItemResponse,
  MatrixAttachmentResponse,
  MatrixStateHistoryResponse,
} from './response.js';
