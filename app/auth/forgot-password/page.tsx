'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { useTranslation } from '@/components/providers/LanguageProvider';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  const canSubmit = email && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (err) {
      setError(t.forgotPasswordPage.errorGeneric);
      setLoading(false);
      return;
    }

    setSuccess(true);
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
          {t.forgotPasswordPage.title}
        </p>

        {success ? (
          <p style={{ fontSize: 15, color: '#5A7A5A' }}>{t.forgotPasswordPage.successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 14, color: '#6B5F52', margin: 0 }}>
              {t.forgotPasswordPage.subtitle}
            </p>
            <input
              type="email"
              placeholder={t.forgotPasswordPage.emailPlaceholder}
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
              {loading ? t.forgotPasswordPage.submittingButton : t.forgotPasswordPage.submitButton}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B5F52' }}>
          <button
            onClick={() => router.push('/login')}
            style={{
              background: 'none', border: 'none', color: '#D97757',
              cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', padding: 0,
            }}
          >
            {t.forgotPasswordPage.backToSignIn}
          </button>
        </p>
      </div>
    </div>
  );
}
