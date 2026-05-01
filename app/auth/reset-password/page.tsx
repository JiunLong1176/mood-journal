'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { useTranslation } from '@/components/providers/LanguageProvider';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { t } = useTranslation();

  const canSubmit = password && confirm && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(t.resetPassword.errorMismatch);
      return;
    }
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(t.resetPassword.errorGeneric);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/today'), 1500);
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
          {t.resetPassword.title}
        </p>

        {success ? (
          <p style={{ fontSize: 15, color: '#5A7A5A' }}>{t.resetPassword.successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="password"
              placeholder={t.resetPassword.newPassword}
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
            <input
              type="password"
              placeholder={t.resetPassword.confirmPassword}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
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
              {loading ? t.resetPassword.submittingButton : t.resetPassword.submitButton}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
