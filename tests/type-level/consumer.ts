import { en, es } from '@bopacorp/shared/i18n';
import type { ListPublicCatalogQuery } from '@bopacorp/shared';
import type { LoginRequest, MessageResponse } from '@bopacorp/shared/auth';
import type { PaginationMeta } from '@bopacorp/shared/common';
import type { DepartmentResponse } from '@bopacorp/shared/core';
import type { CreateVisitRequest } from '@bopacorp/shared/crm';
import type { CreateCategoryRequest } from '@bopacorp/shared/catalog';
import type { UploadDocumentResponse } from '@bopacorp/shared/document-uploads';
import type { DocumentTypeResponse } from '@bopacorp/shared/documents';
import type { ApplyJobVacancyRequest, CreateJobVacancyRequest } from '@bopacorp/shared/employability';
import type { OfferMatrixResponse } from '@bopacorp/shared/matrices';
import type { NotificationListItemResponse } from '@bopacorp/shared/notifications';
import type { ListAdvisorMetricsQuery } from '@bopacorp/shared/reports';
import type { LocaleMessages } from '@bopacorp/shared/i18n';

const id = '550e8400-e29b-41d4-a716-446655440000';
const timestamp = '2026-08-15T00:00:00.000Z';

const catalogQuery: ListPublicCatalogQuery = {
  categorySlug: 'business',
  minPrice: 10,
};

const loginRequest: LoginRequest = {
  email: 'user@bopacorp.com',
  password: 'Password1!',
};

const messageResponse: MessageResponse = { message: 'Operation completed' };

const paginationMeta: PaginationMeta = {
  page: 1,
  limit: 20,
  totalItems: 1,
  totalPages: 1,
};

const departmentResponse: DepartmentResponse = {
  id,
  code: 'SALES',
  name: 'Sales',
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp,
};

const visitRequest: CreateVisitRequest = {
  clientId: id,
  advisorId: id,
  visitTypeId: id,
  visitDate: timestamp,
  observations: 'Customer visit',
};

const categoryRequest: CreateCategoryRequest = {
  name: 'Business',
  slug: 'business',
  sortOrder: 1,
  isActive: true,
};

const uploadResponse: UploadDocumentResponse = {
  storagePath: 'documents/proposal.pdf',
  filename: 'proposal.pdf',
  fileExtension: 'pdf',
  fileSizeMb: 1.25,
  mimeType: 'application/pdf',
  encryptionMetadata: { iv: 'iv', authTag: 'auth-tag' },
};

const documentTypeResponse: DocumentTypeResponse = {
  id,
  code: 'SIGNED_CONTRACT',
  name: 'Signed contract',
  description: null,
  isMandatory: true,
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp,
};

const vacancyRequest: CreateJobVacancyRequest = {
  title: 'Sales advisor',
  description: 'Supports customers.',
  requirements: 'Customer service experience.',
  isActive: true,
  isPublished: false,
};

const applicationRequest: ApplyJobVacancyRequest = {
  candidate: {
    nationalId: '0912345678',
    firstName: 'Alex',
    lastName: 'Candidate',
    email: 'candidate@example.com',
    phone: '0991234567',
  },
  vacancyId: id,
};

const matrixResponse: OfferMatrixResponse = {
  id,
  observations: null,
  negotiation: {
    id,
    client: { id, businessName: 'Example Client' },
  },
  creator: {
    id,
    username: 'advisor',
    email: 'advisor@bopacorp.com',
    profile: { firstName: 'Alex', lastName: 'Advisor' },
  },
  createdAt: timestamp,
  updatedAt: timestamp,
};

const notificationResponse: NotificationListItemResponse = {
  id,
  title: 'New notification',
  message: 'A new event is available.',
  isRead: false,
  readAt: null,
  createdAt: timestamp,
  recipient: { id, username: 'user' },
};

const metricsQuery: ListAdvisorMetricsQuery = { advisorId: id };
const selectedLocale: LocaleMessages = es;
const fallbackLocale: LocaleMessages = en;

void catalogQuery;
void loginRequest;
void messageResponse;
void paginationMeta;
void departmentResponse;
void visitRequest;
void categoryRequest;
void uploadResponse;
void documentTypeResponse;
void vacancyRequest;
void applicationRequest;
void matrixResponse;
void notificationResponse;
void metricsQuery;
void selectedLocale;
void fallbackLocale;
