export interface LogDto {
  id?: string;
  level: string;
  message: string;
  timestamp: string;
  userId?: string;
  metadata?: any;
}
