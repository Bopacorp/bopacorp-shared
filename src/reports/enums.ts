import { z } from 'zod';

export const ReportTypeSchema = z.enum([
  'COMMERCIAL_PERFORMANCE',
  'OPERATIONAL',
  'ADVISOR_DASHBOARD',
]);
export type ReportType = z.infer<typeof ReportTypeSchema>;
