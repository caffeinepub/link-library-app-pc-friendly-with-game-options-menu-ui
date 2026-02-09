import { useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useUserProfile';
import GameMenuLayout from './components/layout/GameMenuLayout';
import AuthControls from './components/auth/AuthControls';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import LinkLibraryPanel from './components/link-library/LinkLibraryPanel';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Force dark mode permanently
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <GameMenuLayout>
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-8 py-4">
          <div className="flex items-center gap-4">
            <img
              src="/assets/generated/app-emblem.dim_512x512.png"
              alt="Link Library"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Link Library</h1>
              <p className="text-sm text-foreground">Your personal link collection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{userProfile.name}</p>
                <p className="text-xs text-foreground">Signed in</p>
              </div>
            )}
            <AuthControls />
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {!isAuthenticated ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    Welcome to Link Library
                  </h2>
                  <p className="text-foreground">
                    Sign in to save and organize your links in a personal library accessible from anywhere.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-6">
                  <p className="mb-4 text-sm text-foreground">
                    Get started by signing in with Internet Identity
                  </p>
                  <AuthControls />
                </div>
              </div>
            </div>
          ) : (
            <LinkLibraryPanel />
          )}
        </main>

        <footer className="border-t border-border bg-background px-8 py-4 text-center text-sm text-foreground">
          © 2026. Built with love using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>

      {showProfileSetup && <ProfileSetupDialog />}
    </GameMenuLayout>
  );
}
