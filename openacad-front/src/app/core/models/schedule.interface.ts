export interface Schedule {
  id?: number;
  weekday: number;
  weekdayName?: string;
  startTime: string;
  endTime: string;
  displayText?: string;
}
