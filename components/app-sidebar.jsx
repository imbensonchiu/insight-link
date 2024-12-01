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
      title: "Articles",
      url: "/articles",
      icon: Database,
      isActive: true,
      items: [
        {
          title: "All Articles",
          url: "/articles",
        },
        {
          title: "Upload Articles",
          url: "/articles/upload",
        },
        {
          title: "Add Tags",
          url: "/articles/tags",
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartBar,
      isActive: true,
      items: [
        {
          title: "Visualization",
          url: "/analytics/visualization",
        },
        {
          title: "Comparison",
          url: "/analytics/comparison",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
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
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
