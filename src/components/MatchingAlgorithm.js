import { getExperienceLevel } from '../types';

const experienceLevelScore = {
  'entry': 1,
  'junior': 2,
  'intermediate': 3,
  'midlevel': 4,
  'senior': 5,
  'expert': 6
};

export const calculateMatchScore = (consultant, firm) => {
  let score = 0;

  console.log("Consultant:", consultant);
  console.log("Firm:", firm);
  console.log("Firm Required Skills:", firm.requiredSkills);

  if (!firm.requiredSkills || !Array.isArray(firm.requiredSkills)) {
    console.error("Firm required skills is not an array:", firm.requiredSkills);
    return score+=0;
  }

  // Category match (25%)
  if (consultant.category === firm.category) {
    score += 25;
  }

  // Skills and experience match (35%)
  let skillScore = 0;
  let matchedSkills = 0;

  firm.requiredSkills.forEach(requirement => {
    const consultantSkill = consultant.expertise.find(s => s.skill === requirement.skill);
    if (consultantSkill) {
      const consultantLevel = getExperienceLevel(consultantSkill.yearsOfExperience) || 'entry';
      const consultantLevelScore = experienceLevelScore[consultantLevel] || 1;
      const requiredLevelScore = experienceLevelScore[requirement.minimumExperience] || 1;

      if (consultantLevelScore >= requiredLevelScore) {
        skillScore += (consultantLevelScore / experienceLevelScore.expert);
      }
      matchedSkills++;
    }
  });

  if (matchedSkills > 0) {
    score += (skillScore / matchedSkills) * 35;
  }

  // Location compatibility (15%)
  if (consultant.location === firm.location) {
    score += 15;
  } else if (consultant.location === 'Remote' && firm.location === 'Hybrid') {
    score += 10;
  }

  // Rate compatibility (25%)
  if (consultant.hourlyRate >= firm.minimumHourlyRate) {
    const maxAcceptableRate = firm.minimumHourlyRate * 1.5;
    if (consultant.hourlyRate <= maxAcceptableRate) {
      const rateScore = 1 - ((consultant.hourlyRate - firm.minimumHourlyRate) / (maxAcceptableRate - firm.minimumHourlyRate));
      score += rateScore * 25;
    }
  }

  return Math.min(score, 100);
};
