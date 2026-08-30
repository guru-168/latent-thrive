// Local deterministic recommendation simulation engine for the LATENT experience.
// Behaves like an AI recommendation model that responds in real-time.

export interface UserProfile {
  curiosity: number;      // 0 to 1
  anger: number;          // 0 to 1
  novelty: number;        // 0 to 1
  familiarity: number;    // 0 to 1
  shortFormDwell: number; // 0 to 1
}

export interface FeedItem {
  id: string;
  category: string;
  headline: string;
  body: string;
  engagementMetric: string;
  emotionalIntensity: number; // 0 to 1
  novelty: number;            // 0 to 1
  relevance: number;          // 0 to 1
  predictedDwell: number;     // seconds
  predictedEngagement: number; // percentage
  clickProbability: number;   // percentage
  shares: number;
  type: 'neutral' | 'outrage' | 'lifestyle' | 'tech' | 'politics' | 'novelty';
}

export type PersonaType = 'CURIOUS' | 'NEWS_ADDICT' | 'ENTERTAINMENT' | 'SPORTS' | 'POLITICS' | 'TECH' | 'CASUAL';

export const PERSONAS: Record<PersonaType, UserProfile> = {
  CURIOUS: { curiosity: 0.85, anger: 0.2, novelty: 0.9, familiarity: 0.3, shortFormDwell: 0.5 },
  NEWS_ADDICT: { curiosity: 0.7, anger: 0.8, novelty: 0.6, familiarity: 0.4, shortFormDwell: 0.75 },
  ENTERTAINMENT: { curiosity: 0.5, anger: 0.3, novelty: 0.8, familiarity: 0.7, shortFormDwell: 0.85 },
  SPORTS: { curiosity: 0.4, anger: 0.2, novelty: 0.4, familiarity: 0.9, shortFormDwell: 0.6 },
  POLITICS: { curiosity: 0.4, anger: 0.9, novelty: 0.3, familiarity: 0.5, shortFormDwell: 0.8 },
  TECH: { curiosity: 0.9, anger: 0.15, novelty: 0.95, familiarity: 0.3, shortFormDwell: 0.4 },
  CASUAL: { curiosity: 0.5, anger: 0.5, novelty: 0.5, familiarity: 0.5, shortFormDwell: 0.5 },
};

// Realistic mock data content
export const SEED_POSTS: FeedItem[] = [
  {
    id: 'post-1',
    category: 'ENVIRONMENT / ANGER',
    headline: 'Subdivision HOA votes to ban food gardens: "Too untidy for property values"',
    body: 'Local residents are expressing outrage after a neighborhood board passed a strict ban on home vegetable plots, threatening fines up to $500 for anyone growing lettuce or tomatoes in view of the street. Supporters claim it keeps aesthetics uniform.',
    engagementMetric: '42.1k angry reactions',
    emotionalIntensity: 0.85,
    novelty: 0.25,
    relevance: 0.6,
    predictedDwell: 14.5,
    predictedEngagement: 78,
    clickProbability: 82,
    shares: 1290,
    type: 'outrage'
  },
  {
    id: 'post-2',
    category: 'SCIENCE / EXPLORATION',
    headline: 'Deep ocean drone captures footage of undocumented bioluminescent organism',
    body: 'At a depth of 4,200 meters, researchers operating a remote submersible filmed a floating radial creature emitting synchronized pulses of cyan and amber light. Marine biologists believe the organism represents an entirely new taxonomic family.',
    engagementMetric: '88.5k shares',
    emotionalIntensity: 0.4,
    novelty: 0.95,
    relevance: 0.7,
    predictedDwell: 22.8,
    predictedEngagement: 65,
    clickProbability: 61,
    shares: 8900,
    type: 'novelty'
  },
  {
    id: 'post-3',
    category: 'DESIGN / LIFESTYLE',
    headline: 'The physics of the silent mechanical keyboard',
    body: 'An analysis of acoustic dampening sheets and custom silicone o-rings that absorb impact resonance. Exploring how tactile switches are manufactured to reduce decibel output while maintaining distinct mechanical haptics.',
    engagementMetric: '12.4k bookmarks',
    emotionalIntensity: 0.15,
    novelty: 0.5,
    relevance: 0.8,
    predictedDwell: 18.2,
    predictedEngagement: 42,
    clickProbability: 49,
    shares: 450,
    type: 'lifestyle'
  },
  {
    id: 'post-4',
    category: 'LOCAL NEWS / NEUTRAL',
    headline: 'Main Street library expansion project enters final approval phase',
    body: 'The municipal council will review structural schematics next Thursday for the new children\'s pavilion and study wing. The project will add 4,000 square feet of public space and is slated for completion in autumn next year.',
    engagementMetric: '1.2k likes',
    emotionalIntensity: 0.1,
    novelty: 0.15,
    relevance: 0.9,
    predictedDwell: 6.4,
    predictedEngagement: 12,
    clickProbability: 18,
    shares: 24,
    type: 'neutral'
  },
  {
    id: 'post-5',
    category: 'TECHNOLOGY / FUTURE',
    headline: 'Graphene vapor-chamber pilot enters production for high-density processors',
    body: 'Silicon engineers have successfully integrated thin-film graphene thermal conduits directly into the packaging layer. Lab testing suggests a 30% reduction in thermal throttle events under heavy generative compute workloads.',
    engagementMetric: '31.2k reads',
    emotionalIntensity: 0.35,
    novelty: 0.85,
    relevance: 0.75,
    predictedDwell: 16.9,
    predictedEngagement: 54,
    clickProbability: 57,
    shares: 1100,
    type: 'tech'
  },
  {
    id: 'post-6',
    category: 'CIVICS / CONTROVERSY',
    headline: 'Automated speed cameras face coordinate hacks: Fines mistakenly issued to park benches',
    body: 'A database error in the traffic monitoring network mapping software caused latitude/longitude registers to shift. Over 400 speeding citations were automatically generated and mailed to the municipal park department for inactive benches.',
    engagementMetric: '52.7k laughs',
    emotionalIntensity: 0.7,
    novelty: 0.8,
    relevance: 0.5,
    predictedDwell: 13.1,
    predictedEngagement: 72,
    clickProbability: 79,
    shares: 3400,
    type: 'politics'
  },
  {
    id: 'post-7',
    category: 'SOCIETY / OUTRAGE',
    headline: 'Restaurant chain implements dynamic seat-pricing during weekend rush hours',
    body: 'Patrons report a national dining franchise has started charging up to 25% extra for tables reserved during peak evening slots. An automatic "urgency fee" is computed and appended if the table wait time exceeds 20 minutes.',
    engagementMetric: '92.1k angry comments',
    emotionalIntensity: 0.9,
    novelty: 0.45,
    relevance: 0.85,
    predictedDwell: 15.6,
    predictedEngagement: 85,
    clickProbability: 89,
    shares: 4100,
    type: 'outrage'
  },
  {
    id: 'post-8',
    category: 'MINDFULNESS / LIFE',
    headline: 'The neural architecture of the 15-minute afternoon nap',
    body: 'How brief rest intervals allow the prefrontal cortex to flush metabolic waste and consolidate motor skills. Research shows sleeping longer than 20 minutes triggers sleep inertia, rendering the cognitive benefits null.',
    engagementMetric: '28.9k bookmarks',
    emotionalIntensity: 0.2,
    novelty: 0.6,
    relevance: 0.75,
    predictedDwell: 11.2,
    predictedEngagement: 48,
    clickProbability: 52,
    shares: 980,
    type: 'lifestyle'
  }
];

export class SimulationEngine {
  public profile: UserProfile;

  constructor(initialPersona: PersonaType = 'CASUAL') {
    this.profile = { ...PERSONAS[initialPersona] };
  }

  // Set current profile to predefined persona
  public setPersona(persona: PersonaType) {
    this.profile = { ...PERSONAS[persona] };
  }

  // Update user profile based on a specific action (click or dwell)
  // For example, clicking an outrage post increases 'anger' and 'shortFormDwell'
  public recordInteraction(item: FeedItem, action: 'click' | 'dwell') {
    const learningRate = action === 'click' ? 0.15 : 0.05;

    // Outrage content feeds anger and short form attention
    if (item.type === 'outrage') {
      this.profile.anger = Math.min(1.0, this.profile.anger + learningRate * 1.2);
      this.profile.shortFormDwell = Math.min(1.0, this.profile.shortFormDwell + learningRate * 0.6);
      this.profile.familiarity = Math.max(0.0, this.profile.familiarity - learningRate * 0.4);
    } 
    // Novelty content feeds curiosity and novelty values
    else if (item.type === 'novelty') {
      this.profile.novelty = Math.min(1.0, this.profile.novelty + learningRate * 1.2);
      this.profile.curiosity = Math.min(1.0, this.profile.curiosity + learningRate * 0.8);
      this.profile.anger = Math.max(0.0, this.profile.anger - learningRate * 0.5);
    } 
    // Tech content feeds curiosity and novelty
    else if (item.type === 'tech') {
      this.profile.curiosity = Math.min(1.0, this.profile.curiosity + learningRate * 1.0);
      this.profile.novelty = Math.min(1.0, this.profile.novelty + learningRate * 0.6);
    }
    // Neutral content reduces overall anger and short form focus, increases familiarity
    else if (item.type === 'neutral') {
      this.profile.anger = Math.max(0.0, this.profile.anger - learningRate * 1.0);
      this.profile.shortFormDwell = Math.max(0.0, this.profile.shortFormDwell - learningRate * 0.8);
      this.profile.familiarity = Math.min(1.0, this.profile.familiarity + learningRate * 0.8);
    } 
    // Lifestyle content feeds familiarity
    else if (item.type === 'lifestyle') {
      this.profile.familiarity = Math.min(1.0, this.profile.familiarity + learningRate * 1.0);
      this.profile.shortFormDwell = Math.min(1.0, this.profile.shortFormDwell + learningRate * 0.3);
    }
    // Political controversial content increases anger and curiosity
    else if (item.type === 'politics') {
      this.profile.anger = Math.min(1.0, this.profile.anger + learningRate * 1.0);
      this.profile.curiosity = Math.min(1.0, this.profile.curiosity + learningRate * 0.5);
    }
  }

  // Calculate live values for a specific item based on the user's current profile
  public calculateMetrics(item: FeedItem): { predictedDwell: number; predictedEngagement: number; clickProbability: number } {
    let score = 0;

    // Weight formulas matching user traits with post styles
    if (item.type === 'outrage') {
      score += this.profile.anger * 0.5 + this.profile.shortFormDwell * 0.3 + 0.2;
    } else if (item.type === 'novelty') {
      score += this.profile.novelty * 0.5 + this.profile.curiosity * 0.4 + 0.1;
    } else if (item.type === 'tech') {
      score += this.profile.curiosity * 0.5 + this.profile.novelty * 0.3 + 0.2;
    } else if (item.type === 'lifestyle') {
      score += this.profile.familiarity * 0.6 + this.profile.shortFormDwell * 0.2 + 0.2;
    } else if (item.type === 'neutral') {
      score += this.profile.familiarity * 0.7 - this.profile.shortFormDwell * 0.3 + 0.3;
    } else if (item.type === 'politics') {
      score += this.profile.anger * 0.6 + this.profile.curiosity * 0.3 + 0.1;
    }

    // Clamp score
    score = Math.max(0.05, Math.min(0.98, score));

    // Calculate details
    const clickProbability = Math.round(score * 100);
    const predictedEngagement = Math.round((score * 0.8 + item.emotionalIntensity * 0.2) * 100);
    
    // Dwell time: neutral is low, novelty/tech is high, outrage is short but intense
    let dwellBase = 12;
    if (item.type === 'neutral') dwellBase = 6;
    if (item.type === 'novelty') dwellBase = 22;
    if (item.type === 'tech') dwellBase = 16;
    if (item.type === 'outrage') dwellBase = 13;

    const predictedDwell = Math.round((dwellBase * (score * 0.7 + 0.3)) * 10) / 10;

    return {
      predictedDwell,
      predictedEngagement,
      clickProbability
    };
  }

  // Get ranked feeds
  public getRankedFeed(items: FeedItem[]): FeedItem[] {
    return items.map(item => {
      const metrics = this.calculateMetrics(item);
      return {
        ...item,
        ...metrics
      };
    }).sort((a, b) => b.clickProbability - a.clickProbability);
  }

  // Generates counterfactual recommendations based on alternate profile directions
  // e.g. What if the user chose the neutral path vs the outrage path?
  public getCounterfactualFeed(items: FeedItem[], altProfile: UserProfile): FeedItem[] {
    const tempEngine = new SimulationEngine();
    tempEngine.profile = { ...altProfile };
    return tempEngine.getRankedFeed(items);
  }
}
