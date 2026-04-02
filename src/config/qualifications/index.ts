import { kihonJohoConfig } from './it/kihon-joho';
import { ouyoJohoConfig } from './it/ouyo-joho';
import { itPassportConfig } from './it/it-passport';
import { boki2Config } from './business/boki-2';
import { boki3Config } from './business/boki-3';
import { fp2Config } from './business/fp-2';
import { fp3Config } from './business/fp-3';
import { eiken3Config } from './language/eiken-3';
import { eikenPre2Config } from './language/eiken-pre2';
import { eiken2Config } from './language/eiken-2';
import { eikenPre1Config } from './language/eiken-pre1';
import { toeicConfig } from './language/toeic';
import { kaigoFukushiConfig } from './medical/kaigo-fukushi';
import { tourokuHanbaisyaConfig } from './medical/touroku-hanbaisya';
import { takkenConfig } from './legal/takken';
import { gyoseiShoshiConfig } from './legal/gyosei-shoshi';
import { QualificationConfig } from './types';
import { QualificationGenre } from '@/types/question';

export { QualificationConfig } from './types';

export const QUALIFICATION_REGISTRY: Record<string, QualificationConfig> = {
  'kihon-joho': kihonJohoConfig,
  'ouyo-joho': ouyoJohoConfig,
  'it-passport': itPassportConfig,
  'boki-2': boki2Config,
  'boki-3': boki3Config,
  'fp-2': fp2Config,
  'fp-3': fp3Config,
  'eiken-3': eiken3Config,
  'eiken-pre2': eikenPre2Config,
  'eiken-2': eiken2Config,
  'eiken-pre1': eikenPre1Config,
  toeic: toeicConfig,
  'kaigo-fukushi': kaigoFukushiConfig,
  'touroku-hanbaisya': tourokuHanbaisyaConfig,
  takken: takkenConfig,
  'gyosei-shoshi': gyoseiShoshiConfig,
};

export function getQualificationConfig(slug: string): QualificationConfig {
  const config = QUALIFICATION_REGISTRY[slug];
  if (!config) throw new Error(`Unknown qualification: ${slug}`);
  return config;
}

export const GENRES: Record<QualificationGenre, { label: string; icon: string; color: string }> = {
  it: { label: 'IT系', icon: 'laptop-outline', color: '#4A90D9' },
  business: { label: 'ビジネス系', icon: 'briefcase-outline', color: '#27AE60' },
  language: { label: '語学系', icon: 'earth-outline', color: '#E67E22' },
  medical: { label: '医療・福祉', icon: 'heart-outline', color: '#E74C3C' },
  legal: { label: '不動産・法律', icon: 'scale-outline', color: '#8E44AD' },
};

export function getQualificationsByGenre(genre: QualificationGenre): QualificationConfig[] {
  return Object.values(QUALIFICATION_REGISTRY).filter((q) => q.genre === genre);
}

export const ALL_QUALIFICATIONS = Object.values(QUALIFICATION_REGISTRY);
