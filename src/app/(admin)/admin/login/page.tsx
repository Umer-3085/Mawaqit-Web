'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/components/admin/AuthProvider';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/admin/dashboard';
  const { login, loading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(username, password);

    if (result.success) {
      router.push(redirect);
      router.refresh();
    } else {
      setError(result.error ?? 'Invalid credentials');
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoComplete="username"
        disabled={submitting || authLoading}
        placeholder="Enter username"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        disabled={submitting || authLoading}
        placeholder="Enter password"
      />
      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm text-center" role="alert">
          {error}
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={submitting || authLoading}
        disabled={submitting || authLoading}
      >
        Sign In
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl mx-auto mb-4">
            ☪
          </div>
          <h1 className="text-2xl font-bold text-text">Mawaqit Admin</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to manage content</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}