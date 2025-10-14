export type Profile = {
  userId: string;
  timezone: string;
  createdAt: string;
};

export type ExerciseType = 'pullups' | 'pushups' | 'squats';

export type Exercise = {
  id: string;
  userId: string;
  type: ExerciseType;
  goal: number;
  createdAt: string;
};

export type SetRecord = {
  id: string;
  exerciseId: string;
  reps: number;
  createdAt: string;
  note?: string | null;
  source: 'manual' | 'quickbutton';
  deletedAt?: string | null;
};

export type ApiError = {
  code:
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'RATE_LIMITED'
    | 'INTERNAL_ERROR';
  message: string;
};
