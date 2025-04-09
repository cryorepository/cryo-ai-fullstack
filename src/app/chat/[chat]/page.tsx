/*import type { Metadata } from 'next'
import { ChatHandler } from '@/components/chat/chat-handler'
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Exsisting Chat - CryoRepository AI',
  description: 'Your source of information on cryoprotective agents.',
  alternates: {
    canonical: 'https://ai.cryorepository.com',
  },
  openGraph: {
    siteName: 'CryoRepository',
    title: 'Exsisting Chat - CryoRepository AI',
    description: 'Your source of information on cryoprotective agents.',
    url: 'https://ai.cryorepository.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exsisting Chat - CryoRepository AI',
    description: 'Your source of information on cryoprotective agents.',
    images: [
      '/favicon.png',
    ],
  },
};

interface ChatParams {
  chat: string;
}

// Define the expected shape of your article data (adjust according to your actual data structure)
interface ArticleData {
  [key: string]: any; // Replace with specific fields if known
}

async function getChatData(chatID: string): Promise<ArticleData | null> {
  const res = await fetch(`http://localhost:3001/fetchChat/${chatID}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!res.ok) return null
  return res.json() as Promise<ArticleData>
}

export default async function Chat({ params }: { params: ChatParams }) {
  const data = await getChatData(params.chat);
  if (data === null) {
    notFound(); // This will render the 404 page
  }

  return (
    <div className="chatPage">
      <ChatHandler messages={data?.chatHistory} chatId={params?.chat} />
    </div>
  );
}*/

import type { Metadata } from 'next';
import { ChatHandler } from '@/components/chat/chat-handler';

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Existing Chat - CryoRepository AI', // Fixed typo: "Exsisting" -> "Existing"
  description: 'Your source of information on cryoprotective agents.',
  alternates: {
    canonical: 'https://ai.cryorepository.com',
  },
  openGraph: {
    siteName: 'CryoRepository',
    title: 'Existing Chat - CryoRepository AI',
    description: 'Your source of information on cryoprotective agents.',
    url: 'https://ai.cryorepository.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Existing Chat - CryoRepository AI',
    description: 'Your source of information on cryoprotective agents.',
    images: ['/favicon.png'],
  },
};

// Define route params interface
interface ChatParams {
  chat: string;
}

export default async function Chat({ params: paramsPromise }: { params: Promise<ChatParams> }) {
  const params = await paramsPromise; // Await the params Promise

  return (
    <div className="chatPage">
      <ChatHandler chatId={params.chat} />
    </div>
  );
}