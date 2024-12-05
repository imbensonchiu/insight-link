"use client"

import * as React from "react"
import {
  Database,
  Newspaper,
  Settings2,
  ChartBar,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "News Article Analysis",
      logo: Newspaper,
      plan: "Research",
    }
  ],
  navMain: [
    {
      title: "Articles & Themes",
      url: "/articles",
      icon: Database,
      isActive: true,
      items: [
        {
          title: "All Articles",
          url: "/",
        },
        {
          title: "All Themes",
          url: "/themes",
        },
        {
          title: "Upload Article",
          url: "/articles/upload",
        },
      ],
    },
    {
      title: "Data Visualization",
      url: "#",
      icon: ChartBar,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/analytics/visualization",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
