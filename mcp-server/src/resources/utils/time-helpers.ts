export function generateTimeSlots(
  startTime: string, 
  endTime: string, 
  lunchStart: string | null, 
  lunchEnd: string | null, 
  duration: number
): string[] {
  const slots = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const lunchStartMinutes = lunchStart ? timeToMinutes(lunchStart) : null;
  const lunchEndMinutes = lunchEnd ? timeToMinutes(lunchEnd) : null;

  for (let time = start; time < end; time += duration) {
    // Skip lunch time
    if (lunchStartMinutes && lunchEndMinutes && 
        time >= lunchStartMinutes && time < lunchEndMinutes) {
      continue;
    }
    
    slots.push(minutesToTime(time));
  }

  return slots;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}