export interface SchoolProgramDto {
  id?: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  level?: string;
  active: boolean;
  image?: string;
  startDate?: string;
}
