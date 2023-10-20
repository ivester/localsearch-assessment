import {
  AddressRaw,
  Business,
  BusinessRaw,
  ContactRaw,
  openingHour,
} from '../src/business/business.interface';

// --- Input Data Mocks ---

export const businessOneRaw: BusinessRaw = {
  local_entry_id: 'GXvPAor1ifNfpF0U5PTG0w',
  displayed_what: 'Business name 1',
  displayed_where: 'Address 1',
};

export const businessTwoRaw: BusinessRaw = {
  local_entry_id: 'ohGSnJtMIC5nPfYRi_HTAg',
  displayed_what: 'Business name 2',
  displayed_where: 'Address 2',
};

export const contactUrlRaw: ContactRaw = {
  contact_type: 'url',
  formatted_service_code: 'formatted url 1',
  url: 'url 1',
};
export const contactPhoneRaw: ContactRaw = {
  contact_type: 'phone',
  formatted_service_code: 'formatted phone number 1',
  phone_number: 'phone number 1',
};

export const addressesOneRaw: AddressRaw[] = [
  { contacts: [contactUrlRaw, contactPhoneRaw] },
];

// --- Output Data Mocks ---

export const openingHoursAllClosed: openingHour[] = [
  { day: 'monday', hours: [], id: 0 },
  { day: 'tuesday', hours: [], id: 1 },
  { day: 'wednesday', hours: [], id: 2 },
  { day: 'thursday', hours: [], id: 3 },
  { day: 'friday', hours: [], id: 4 },
  { day: 'saturday', hours: [], id: 5 },
  { day: 'sunday', hours: [], id: 6 },
];

export const businessOne: Business = {
  id: businessOneRaw.local_entry_id,
  name: businessOneRaw.displayed_what,
  where: businessOneRaw.displayed_where,
  openingHours: openingHoursAllClosed,
};

export const businessTwo: Business = {
  id: businessTwoRaw.local_entry_id,
  name: businessTwoRaw.displayed_what,
  where: businessTwoRaw.displayed_where,
  openingHours: openingHoursAllClosed,
};

export const businessOneAddresses: Partial<Business> = {
  url: contactUrlRaw.url,
  urlFormatted: contactUrlRaw.formatted_service_code,
  phone: contactPhoneRaw.phone_number,
  phoneFormatted: contactPhoneRaw.formatted_service_code,
};
