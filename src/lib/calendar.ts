import { getAccessToken } from './auth';

export async function getCalendars() {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token");

  const res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) {
     if(res.status === 403 || res.status === 401) {
        return [{ id: 'primary', summary: 'Primary Calendar' }];
     }
     throw new Error("Failed to fetch calendars");
  }
  
  const data = await res.json();
  return data.items.map((c: any) => ({
    id: c.id,
    summary: c.summary,
    primary: c.primary
  }));
}

export async function createEvent(calendarId: string, event: { summary: string, description: string, start: string, end: string }) {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token");

  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.start,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: event.end,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    })
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create event: ${text}`);
  }
  
  return await res.json();
}
