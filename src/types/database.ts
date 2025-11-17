export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  target_date: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface GoalUpdate {
  id: string;
  goal_id: string;
  amount: number;
  note: string | null;
  created_at: string;
}

export interface GoalWithProgress extends Goal {
  completion_percentage: number;
  days_remaining: number;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  target_amount: number;
  target_date: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  target_amount?: number;
  current_amount?: number;
  target_date?: string;
}

export interface CreateGoalUpdateInput {
  goal_id: string;
  amount: number;
  note?: string;
}
