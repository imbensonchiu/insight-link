import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";

export default async function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );
}