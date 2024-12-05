
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
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { neon } from '@neondatabase/serverless';
import DataTable from '@/components/data-table';
import { ThemeMentionBarChart } from "@/components/theme-mention-bar-chart";



async function getRelatedArticles(theme_id) {
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`
        SELECT DISTINCT a.id, a.title, a.publisher, a.media_type, a.author, a.date, c.reason
        FROM articles a
        JOIN contains c ON a.id = c.article_id
        JOIN themes t ON c.theme_id = t.id
        WHERE t.id = ${theme_id}
        ORDER BY a.date DESC;`;
    // console.log(response);
    return response;
}

async function getThemeDetail(theme_id){
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`
        SELECT 
            t.name AS theme_name, 
            t.definition
        FROM 
            public.themes t
        WHERE 
            t.id = ${theme_id}`;

    console.log(response);
    return response;
}

async function getMentionsForEachMonth(theme_id){
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`
        SELECT 
            TO_CHAR(DATE_TRUNC('month', a.date), 'YYYY-MM') AS month,
            COUNT(*)::INTEGER AS mention_count
        FROM 
            articles a
        JOIN 
            contains c ON a.id = c.article_id
        WHERE 
            c.theme_id = ${theme_id}
        GROUP BY 
            TO_CHAR(DATE_TRUNC('month', a.date), 'YYYY-MM')
        UNION ALL
        SELECT 
            TO_CHAR(DATE_TRUNC('month', d.date), 'YYYY-MM') AS month,
            0::INTEGER AS mention_count
        FROM 
            generate_series(
            (SELECT MIN(DATE_TRUNC('month', date)) FROM articles),
            (SELECT MAX(DATE_TRUNC('month', date)) FROM articles),
            '1 month'::interval
            ) d(date)
        LEFT JOIN 
            articles a ON DATE_TRUNC('month', a.date) = d.date
        LEFT JOIN 
            contains c ON a.id = c.article_id AND c.theme_id = ${theme_id}
        WHERE 
            a.date IS NULL
        GROUP BY 
            month
        ORDER BY 
            month;`;
    console.log(response);
    return response;
}

export default async function Page({params}) {
    const theme_id = (await params).id;
    const data = await getRelatedArticles(theme_id); 
    const themeDetail = await getThemeDetail(theme_id);
    const mentions = await getMentionsForEachMonth(theme_id);

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
                <BreadcrumbLink href="/themes">All Themes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-80 truncate">{themeDetail[0].theme_name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-4">
            <h1 className="text-3xl font-bold p-2">{themeDetail[0].theme_name}</h1>
            <div className="grid grid-cols-2 gap-4">
                <Card className="my-4 col-span-1">
                    <CardHeader>
                    <CardTitle className="flex items-center font-medium text-lg">
                        Definition
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-light">{themeDetail[0].definition}</p>
                    </CardContent>
                </Card>
                <ThemeMentionBarChart chartData={mentions}/>
            </div>
            <h2 className="text-lg p-2"> Articles related to the theme </h2>
            <DataTable data={data}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
