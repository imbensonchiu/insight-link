import * as React from "react"
import { neon } from '@neondatabase/serverless'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { NumberOfArticlesAreaChart } from "@/components/num-articles-chart"
import { ArticlesPieChart } from "@/components/pie-chart"
import { TopicBarChart } from "@/components/topic-bar-chart"


async function getNumArticlesAcrossTime(){
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`
  WITH date_series AS (
    SELECT generate_series(
      (SELECT MIN(date) FROM public.articles),
      (SELECT MAX(date) FROM public.articles),
      '1 day'::interval
    )::date AS date
  )
  SELECT 
    to_char(date_series.date, 'YYYY-MM-DD') AS date,
    COALESCE(SUM(CASE WHEN articles.media_type = 'mainstream' THEN 1 ELSE 0 END), 0) AS ms,
    COALESCE(SUM(CASE WHEN articles.media_type = 'non-mainstream' THEN 1 ELSE 0 END), 0) AS nms
  FROM 
    date_series
  LEFT JOIN 
    public.articles ON date_series.date = articles.date
  GROUP BY 
    date_series.date
  ORDER BY 
    date_series.date;
  `;
  return response;
}

export default async function Page() {
  const chartData = await getNumArticlesAcrossTime();
  return (
    (<SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Data Visualization
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <NumberOfArticlesAreaChart chartData={chartData}/>
        </div>
      </SidebarInset>
    </SidebarProvider>)
  );
}
