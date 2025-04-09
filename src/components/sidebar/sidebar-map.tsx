/*"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from '@/lib/AuthContext';

export function SidebarMap() {
  const { isLoggedIn, chats } = useAuth();
  const pathname = usePathname();

  return (
    <>
      {isLoggedIn && chats && chats.length > 0 ? (
        chats.map((chat) => {
          // Check if the current pathname matches this chat's route
          const isActive = pathname === `/chat/${chat.chatID}`;
          
          return (
            <SidebarMenuItem key={chat.chatID}>
              <SidebarMenuButton className="h-[34px]" asChild>
                <Link
                  href={`/chat/${chat.chatID}`}
                  className={`${
                    isActive ? 'bg-(--sidebar-accent) border-(--sidebar-border) border dark:border-transparent' : 'bg-transparent border-transparent'
                  } transition-colors duration-200 border`}
                >
                  <span>
                    {chat.chatTitle || `Chat ${chat.chatID.slice(-6)}`}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })
      ) : (
        <SidebarMenuItem>
          <SidebarMenuButton className="h-[34px]" disabled>
            <span>No previous chats</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </>
  );
}*/

"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from '@/lib/AuthContext';
import { AnimatePresence, motion } from 'framer-motion'; // Import framer-motion

export function SidebarMap() {
  const { isLoggedIn, chats } = useAuth();
  const pathname = usePathname();

  // Reverse the chats array for display (newest first)
  const reversedChats = chats ? [...chats].reverse() : [];

  return (
    <>
      <AnimatePresence>
        {isLoggedIn && reversedChats && reversedChats.length > 0 ? (
          reversedChats.map((chat) => {
            const isActive = pathname === `/chat/${chat.chatID}`;
            
            return (
              <motion.div
                key={chat.chatID}
                initial={{ opacity: 0, y: 10 }} // Start below and faded
                animate={{ opacity: 1, y: 0 }} // Slide up and fade in
                exit={{ opacity: 0, y: -10 }} // Slide down and fade out
                transition={{ duration: 0.3 }} // Animation duration
              >
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-[34px]" asChild>
                    <Link
                      href={`/chat/${chat.chatID}`}
                      className={`${
                        isActive
                          ? 'bg-[var(--sidebar-accent)] border-[var(--sidebar-border)] border dark:border-transparent'
                          : 'bg-transparent border-transparent'
                      } transition-colors duration-200 border`}
                    >
                      <span>
                        {chat.chatTitle || `Chat ${chat.chatID.slice(-6)}`}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            );
          })
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton className="h-[34px]" disabled>
              <span>No previous chats</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </AnimatePresence>
    </>
  );
}