import { describe, it, expect } from 'vitest';
import { INITIAL_DATA } from '../../constants';
import type { ResumeData } from '../../types';

// Mirror the scoring logic from CVScore component
const calcScore = (data: ResumeData): number => {
  const criteria = [
    data.name.trim().split(' ').length >= 2,
    data.title.trim().length > 0,
    data.summary.trim().length >= 80,
    data.contact.email.trim().length > 0,
    data.contact.phone.trim().length > 0,
    !!(data.contact.linkedin && data.contact.linkedin.trim().length > 0),
    data.experience.filter(e => !e.hidden && e.role.trim()).length >= 2,
    data.experience.some(e => !e.hidden && e.tasks.filter(t => t.trim()).length >= 3),
    data.education.filter(e => !e.hidden && e.degree.trim()).length >= 1,
    data.skills.filter(s => s.trim()).length >= 5,
    data.languages.filter(l => l.language.trim()).length >= 1,
    !!(data.profileImage && !data.hideProfileImage),
  ];
  const points = [5, 5, 10, 8, 5, 7, 15, 10, 10, 8, 7, 10];
  const total = points.reduce((a, b) => a + b, 0);
  const earned = criteria.reduce((acc, met, i) => acc + (met ? points[i] : 0), 0);
  return Math.round((earned / total) * 100);
};

describe('CV Score', () => {
  it('INITIAL_DATA scores above 50', () => {
    expect(calcScore(INITIAL_DATA)).toBeGreaterThan(50);
  });

  it('empty CV scores 0', () => {
    const empty: ResumeData = {
      ...INITIAL_DATA,
      name: '',
      title: '',
      summary: '',
      contact: { email: '', phone: '', location: '' },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      profileImage: undefined,
    };
    expect(calcScore(empty)).toBe(0);
  });

  it('scores higher with LinkedIn', () => {
    const withLinkedIn: ResumeData = {
      ...INITIAL_DATA,
      contact: { ...INITIAL_DATA.contact, linkedin: 'linkedin.com/in/test' },
    };
    expect(calcScore(withLinkedIn)).toBeGreaterThan(calcScore(INITIAL_DATA));
  });

  it('scores lower without enough experience', () => {
    const oneExp: ResumeData = {
      ...INITIAL_DATA,
      experience: [INITIAL_DATA.experience[0]],
    };
    expect(calcScore(oneExp)).toBeLessThan(calcScore(INITIAL_DATA));
  });
});
