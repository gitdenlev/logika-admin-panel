export interface StudentProfile {
  id?: string;
  student_name: string;
  student_balance: number | 0;
  student_schedule: string | null;
  wishlist: string | null;
  student_donated_points: number | 0;
}
