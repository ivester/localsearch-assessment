export interface Business {
  id: string;
  name: string;
  where: string;
  openingHours?: openingHour[];
  url?: string;
  urlFormatted?: string;
  phone?: string;
  phoneFormatted?: string;
}

export interface openingHour {
  id: number;
  day: Day;
  hours: Hour[];
}

export type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface Hour {
  start: string;
  end: string;
}

// --- Raw data from fake API ---
export interface BusinessRaw {
  local_entry_id: string;
  displayed_what: string;
  displayed_where: string;
  opening_hours?: OpeningHoursRaw;
  addresses?: AddressRaw[];
}

export interface OpeningHoursRaw {
  days: DaysRaw;
}

export interface DaysRaw {
  monday?: DayRaw[];
  tuesday?: DayRaw[];
  wednesday?: DayRaw[];
  thursday?: DayRaw[];
  friday?: DayRaw[];
  saturday?: DayRaw[];
  sunday?: DayRaw[];
}

export interface DayRaw {
  start: string;
  end: string;
}

export interface AddressRaw {
  contacts: ContactRaw[];
}

export interface ContactRaw {
  contact_type: ContactType;
  formatted_service_code: string;
  url?: string;
  phone_number?: string;
}

export type ContactType = 'url' | 'phone';
