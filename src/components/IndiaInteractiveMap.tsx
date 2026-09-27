import React from 'react';
import { IndiaMapSection } from './IndiaMapSection/IndiaMapSection';
import { Language } from '../types';

interface IndiaInteractiveMapProps {
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
  viewMode?: 'india' | 'state' | 'others';
}

export const IndiaInteractiveMap: React.FC<IndiaInteractiveMapProps> = ({
  language,
  soundEnabled,
}) => {
  return <IndiaMapSection language={language} soundEnabled={soundEnabled} />;
};
