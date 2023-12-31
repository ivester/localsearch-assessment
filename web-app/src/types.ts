// if the application grew bigger than I would move and split this file to a separate folder and files
// but for this size of the application it is fine to keep it in one file

export interface Business {
  id: string;
  name: string;
  where: string;
  url?: string;
  urlFormatted?: string;
  phone?: string;
  phoneFormatted?: string;
  openingHours?: OpeningHour[];
}

export interface OpeningHour {
  id: number;
  day: Day;
  hours: Hour[];
}

export interface OpeningHourGrouped {
  id: number;
  days: Day[];
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

export interface OpeningHourFormatted {
  id: number;
  days: string;
  hours: string[];
}
