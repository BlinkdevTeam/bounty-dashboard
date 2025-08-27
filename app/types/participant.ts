export type Participant = {
  selected_events: string[];
  email: string;
  full_name: string;
  full_name_upper: string;
  contact_number: string;
  address: string;
  company: string;
  designation: string;
  first_time: "yes" | "no"; // enforce only "yes" or "no"
  approved?: boolean;
  rejected?: boolean;
};
