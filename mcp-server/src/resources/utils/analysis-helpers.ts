export function getFrequentDoctors(appointments: any[]) {
  const doctorCounts = appointments.reduce((acc: any, apt: any) => {
    const doctorName = apt.doctor_name || `Doctor ${apt.doctor_id}`;
    acc[doctorName] = (acc[doctorName] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(doctorCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([name, count]) => ({ name: name, appointments: count }));
}

export function getAppointmentTypes(appointments: any[]) {
  const typeCounts = appointments.reduce((acc: any, apt: any) => {
    const type = apt.type || 'consultation';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(typeCounts)
    .map(([type, count]) => ({ type: type, count: count }));
}

export function calculateAverageInterval(appointments: any[]) {
  if (appointments.length < 2) return null;

  let totalDays = 0;
  let intervals = 0;

  for (let i = 0; i < appointments.length - 1; i++) {
    const current = new Date(appointments[i].date);
    const next = new Date(appointments[i + 1].date);
    const daysDiff = Math.abs((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
    totalDays += daysDiff;
    intervals++;
  }

  return intervals > 0 ? Math.round(totalDays / intervals) : null;
}

export function getBusiestDay(appointments: any[]) {
  const dayCounts: { [key: string]: number } = {};
  
  appointments.forEach((apt: any) => {
    if (apt.date) {
      const date = new Date(apt.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    }
  });
  
  const busiestDay = Object.entries(dayCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0];
    
  return busiestDay ? { day: busiestDay[0], appointments: busiestDay[1] } : { day: 'N/A', appointments: 0 };
}