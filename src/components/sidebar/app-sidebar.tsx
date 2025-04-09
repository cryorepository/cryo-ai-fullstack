import Link from 'next/link'
import { Home, SquarePen } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeTrigger } from "@/components/theme-trigger"
import { SidebarDropdown } from "@/components/sidebar/sidebar-dropdown"
import { SidebarMap } from "@/components/sidebar/sidebar-map"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex justify-between align-center flex-row mx-2 mt-2 pb-0">
        <Button variant="outline" size="icon" asChild>
          <a href="https://cryorepository.com/">
            <Home />
            <span className="sr-only">Home</span>
          </a>
        </Button>
        <ThemeTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-2">Chat Options</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-[34px]" asChild>
                    <Link className="newChatLink border border-transparent" href="/">
                      <SquarePen />
                      <span>New Chat</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>

          <SidebarGroupLabel className="mt-4">Previous Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMap />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarDropdown />
      </SidebarFooter>
    </Sidebar>
  )
}
