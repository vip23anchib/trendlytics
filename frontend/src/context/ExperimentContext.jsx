import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackEvent } from '../utils/telemetry';

const ExperimentContext = createContext();

export function ExperimentProvider({ children }) {
  const [variant, setVariant] = useState(() => {
    return localStorage.getItem('tl_experiment_variant') || 'treatment_ai_search';
  });

  const toggleVariant = () => {
    const next = variant === 'treatment_ai_search' ? 'control_keyword' : 'treatment_ai_search';
    setVariant(next);
    localStorage.setItem('tl_experiment_variant', next);
    trackEvent('experiment_variant_toggled', { metadata: { new_variant: next } });
  };

  const setExplicitVariant = (newVariant) => {
    setVariant(newVariant);
    localStorage.setItem('tl_experiment_variant', newVariant);
  };

  return (
    <ExperimentContext.Provider value={{ variant, isTreatment: variant === 'treatment_ai_search', toggleVariant, setExplicitVariant }}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  return useContext(ExperimentContext);
}
