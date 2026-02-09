import { type ReactNode } from 'react';

interface GameMenuLayoutProps {
  children: ReactNode;
}

export default function GameMenuLayout({ children }: GameMenuLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background image with solid overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/generated/menu-bg.dim_1920x1080.png)',
        }}
      >
        <div className="absolute inset-0 bg-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
}
