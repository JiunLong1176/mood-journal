'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useTranslation } from '@/components/providers/LanguageProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F7F2EA', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div className="font-display" style={{
          fontSize: 38, fontWeight: 500, letterSpacing: -1, color: '#2A241E',
          marginBottom: 6, lineHeight: 1.1,
        }}>
          <span style={{ fontStyle: 'italic' }}>Beans</span> Journal
        </div>
        <p style={{ fontSize: 15, color: '#6B5F52', marginBottom: 36 }}>
          {t.login.tagline}
        </p>

        {sent ? (
          <div style={{
            background: '#fff', border: '1px solid rgba(42,36,30,0.08)',
            borderRadius: 16, padding: 24, textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#2A241E', marginBottom: 6 }}>
              {t.login.checkEmailTitle}
            </div>
            <div style={{ fontSize: 14, color: '#6B5F52' }}>
              {t.login.checkEmailBody(email)}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder={t.login.emailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                padding: '14px 16px', borderRadius: 14, fontSize: 16,
                border: '1px solid rgba(42,36,30,0.12)',
                background: '#fff', color: '#2A241E', outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              disabled={loading || !email}
              style={{
                padding: '14px 16px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                background: loading || !email ? '#E0D8CE' : '#D97757',
                color: loading || !email ? '#A89B8B' : '#fff',
                border: 'none', cursor: loading || !email ? 'default' : 'pointer',
                fontFamily: 'inherit', transition: 'background .15s',
              }}
            >
              {loading ? t.login.sendingButton : t.login.sendButton}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
