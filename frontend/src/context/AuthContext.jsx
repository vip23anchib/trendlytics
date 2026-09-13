import React, { createContext, useContext, useState, useEffect } from 'react';
import { initSession, trackEvent } from '../utils/telemetry';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tl_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [personas, setPersonas] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setup() {
      const sess = await initSession();
      setSessionData(sess);
      trackEvent('session_start', { metadata: { entry_url: window.location.href } });

      // Fetch demo personas
      try {
        const res = await fetch('/api/personas/');
        if (res.ok) {
          const data = await res.json();
          setPersonas(data);
          // Default to high-intent demo persona if no user selected
          if (!localStorage.getItem('tl_user') && data.length > 0) {
            const defaultPersona = data[0];
            const defaultUser = {
              id: defaultPersona.id,
              username: defaultPersona.email.split('@')[0],
              email: defaultPersona.email,
              first_name: defaultPersona.name.split(' ')[0],
              last_name: defaultPersona.name.split(' ').slice(1).join(' '),
              profile: {
                segment: defaultPersona.segment,
                is_returning: defaultPersona.is_returning,
                preferred_device: 'desktop',
              },
              avatar: defaultPersona.avatar,
            };
            setUser(defaultUser);
            localStorage.setItem('tl_user', JSON.stringify(defaultUser));
          }
        }
      } catch (err) {
        console.error('Failed to load personas:', err);
      } finally {
        setLoading(false);
      }
    }
    setup();
  }, []);

  const switchPersona = async (persona) => {
    try {
      const res = await fetch('/api/personas/switch/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona_id: persona.id,
          email: persona.email,
          name: persona.name,
          segment: persona.segment,
        }),
      });
      const data = await res.json();
      const updatedUser = {
        ...data.user,
        avatar: persona.avatar,
        persona_description: persona.description,
      };
      setUser(updatedUser);
      localStorage.setItem('tl_user', JSON.stringify(updatedUser));
      trackEvent('persona_switched', { metadata: { persona_name: persona.name, segment: persona.segment } });
    } catch (err) {
      console.error('Persona switch failed:', err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tl_user');
  };

  return (
    <AuthContext.Provider value={{ user, personas, sessionData, switchPersona, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
