export interface WaitlistFormData {
  email: string;
  projectDescription?: string;
}

export interface WaitlistEntry extends WaitlistFormData {
  id: string;
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
}

export interface SquadAgent {
  name: string;
  codename: string;
  emoji: string;
  role: string;
  icon: string;
}

export interface DomainVertical {
  name: string;
  icon: string;
}
