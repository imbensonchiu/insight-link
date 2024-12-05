
import * as React from "react";


import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { neon } from '@neondatabase/serverless';

import DataTable from '@/components/data-table';

import DataTableThemes from "@/components/data-table-theme";

async function getThemes() {
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`
    SELECT 
        t.id AS theme_id, 
        t.name AS theme_name, 
        t.definition, 
        COUNT(c.id) AS number_of_mentions
    FROM 
        public.themes t
    LEFT JOIN 
        public.contains c ON t.id = c.theme_id
    GROUP BY 
        t.id, t.name, t.definition
    ORDER BY 
        t.id;`;
    // console.log(response);
    return response;
}
  

export default async function Page() {
    const data = await getThemes(); 
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Articles & Themes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>All Themes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-4">
            <DataTableThemes data={data}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
