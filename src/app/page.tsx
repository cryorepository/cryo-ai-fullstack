import type { Metadata } from 'next'
import { ChatHandler } from '@/components/chat/chat-handler';


export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'CryoRepository AI - Discover Cryopreservation',
  description: 'Your source of information on cryoprotective agents.',
  alternates: {
    canonical: 'https://ai.cryorepository.com',
  },
  openGraph: {
    siteName: 'CryoRepository',
    title: 'CryoRepository AI - Discover Cryopreservation',
    description: 'Your source of information on cryoprotective agents.',
    url: 'https://ai.cryorepository.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryoRepository AI - Discover Cryopreservation',
    description: 'Your source of information on cryoprotective agents.',
    images: [
      '/favicon.png',
    ],
  },
};

export default function Home() {
  return (
    <div className="chatPage">
      {/*<div className="w-full h-screen flex flex-col gap-4 items-center justify-center mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-semibold">New Chat</h1>
          <h3 className="font-semibold clip-bg">CryoRepository AI</h3>
        </div>
        <PromptButtons />
      </div>
      <ChatInterface />*/}
      {/*<ChatInterface />*/}
      <ChatHandler chatId="new" />
      <style>{`
      .newChatLink{
        background-color: var(--sidebar-accent);
      }

      html.light .newChatLink {
        border: 1px solid var(--sidebar-border) !important;
      }
      `}</style>
    </div>
  );
}