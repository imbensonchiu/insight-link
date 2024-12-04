import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { neon } from '@neondatabase/serverless';

import SingleArticleDetail from "@/components/article-detail";

// Get data from the database
async function getArticleDetail({article_id}){
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`
  SELECT id, title, author, publisher, date, full_text, summary, media_type
  FROM articles
  WHERE id = ${article_id}`;
  return response;
}

async function getThemesOfArticle({article_id}){
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`
  SELECT DISTINCT c.theme_id, t.name, t.definition, c.reason
  FROM contains c
  LEFT JOIN themes t ON c.theme_id = t.id
  WHERE c.article_id = 1
  ORDER BY c.theme_id;
  `;
  return response;
}

async function getQuotes({article_id}){
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`
  SELECT c.theme_id, q.quote
  FROM quotes q
  LEFT JOIN contains c ON q.contain_id = c.id
  WHERE c.article_id = ${article_id}
  ORDER BY c.theme_id;
  `;
  return response;
}

async function getEntities({article_id}){
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`
    SELECT id, name, role, category, description 
    FROM entities 
    WHERE article_id = ${article_id}
  `;
  return response;

}


export default async function Page({params}) {
  const id = (await params).id;
  const article = await getArticleDetail({article_id: id});
  const themes = await getThemesOfArticle({article_id: id});
  const quotes = await getQuotes({article_id: id});
  const entities = await getEntities({article_id: id});
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SingleArticleDetail article={article[0]} themes={themes} quotes={quotes} entities={entities}/>
    </SidebarProvider>
  );
}