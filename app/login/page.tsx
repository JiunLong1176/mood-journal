'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { useTranslation } from '@/components/providers/LanguageProvider';

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      router.replace('/auth/reset-password' + hash);
    }
  }, [router]);

  const isSignUp = mode === 'signup';
  const canSubmit = email && password && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isSignUp) {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(
          err.message.toLowerCase().includes('already')
            ? t.login.errorEmailInUse
            : t.login.errorGeneric
        );
        setLoading(false);
        return;
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(
          err.message.toLowerCase().includes('invalid')
            ? t.login.errorInvalidCredentials
            : t.login.errorGeneric
        );
        setLoading(false);
        return;
      }
    }

    router.push('/today');
    router.refresh();
  }

  function switchMode() {
    setMode(isSignUp ? 'signin' : 'signup');
    setError('');
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
          <input
            type="password"
            placeholder={t.login.passwordPlaceholder}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '14px 16px', borderRadius: 14, fontSize: 16,
              border: '1px solid rgba(42,36,30,0.12)',
              background: '#fff', color: '#2A241E', outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {!isSignUp && (
            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <button
                type="button"
                onClick={() => router.push('/auth/forgot-password')}
                style={{
                  background: 'none', border: 'none', color: '#D97757',
                  cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0,
                }}
              >
                {t.login.forgotPassword}
              </button>
            </div>
          )}
          {error && (
            <p style={{ fontSize: 13, color: '#C0392B', margin: 0 }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              padding: '14px 16px', borderRadius: 14, fontSize: 15, fontWeight: 600,
              background: !canSubmit ? '#E0D8CE' : '#D97757',
              color: !canSubmit ? '#A89B8B' : '#fff',
              border: 'none', cursor: !canSubmit ? 'default' : 'pointer',
              fontFamily: 'inherit', transition: 'background .15s',
            }}
          >
            {loading
              ? (isSignUp ? t.login.signingUpButton : t.login.signingInButton)
              : (isSignUp ? t.login.signUpButton : t.login.signInButton)
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B5F52' }}>
          <button
            onClick={switchMode}
            style={{
              background: 'none', border: 'none', color: '#D97757',
              cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', padding: 0,
            }}
          >
            {isSignUp ? t.login.switchToSignIn : t.login.switchToSignUp}
          </button>
        </p>
      </div>
    </div>
  );
}
