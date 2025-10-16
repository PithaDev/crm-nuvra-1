import type { LeadInput } from './validations';

export type Qualification = 'cold' | 'warm' | 'hot';

export interface ScoringResult {
  qualification: Qualification;
  score: number;
  reasons: string[];
}

export function scoreLead(lead: LeadInput): ScoringResult {
  let score = 0;
  const reasons: string[] = [];

  const metadata = lead.metadata || {};
  const usos = typeof metadata.usos === 'number' ? metadata.usos : 0;
  const budget = typeof metadata.budget === 'number' ? metadata.budget : 0;
  const urgency = metadata.urgency === 'high';
  const origin = lead.origin || 'direct';

  if (origin === 'referral') {
    score += 30;
    reasons.push('Referred lead (+30)');
  } else if (origin === 'website') {
    score += 20;
    reasons.push('Website lead (+20)');
  } else if (origin === 'social') {
    score += 15;
    reasons.push('Social media lead (+15)');
  } else if (origin === 'api') {
    score += 10;
    reasons.push('API lead (+10)');
  }

  if (usos >= 10) {
    score += 30;
    reasons.push(`High usage: ${usos} uses (+30)`);
  } else if (usos >= 5) {
    score += 20;
    reasons.push(`Medium usage: ${usos} uses (+20)`);
  } else if (usos >= 1) {
    score += 10;
    reasons.push(`Low usage: ${usos} uses (+10)`);
  }

  if (budget >= 10000) {
    score += 25;
    reasons.push(`Large budget: $${budget} (+25)`);
  } else if (budget >= 5000) {
    score += 15;
    reasons.push(`Medium budget: $${budget} (+15)`);
  } else if (budget >= 1000) {
    score += 5;
    reasons.push(`Small budget: $${budget} (+5)`);
  }

  if (urgency) {
    score += 15;
    reasons.push('High urgency (+15)');
  }

  if (lead.company && lead.company.length > 0) {
    score += 10;
    reasons.push('Has company info (+10)');
  }

  if (lead.phone && lead.phone.length > 0) {
    score += 5;
    reasons.push('Has phone number (+5)');
  }

  let qualification: Qualification = 'cold';
  if (score >= 70) {
    qualification = 'hot';
  } else if (score >= 40) {
    qualification = 'warm';
  }

  return {
    qualification,
    score,
    reasons,
  };
}
