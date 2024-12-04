'use client';

import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, ClipboardList, UsersRound } from "lucide-react";


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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area"
  

export default function SingleArticleDetail({article, themes, quotes, entities}){
    console.log("article:");
    console.log(article);
    const router = useRouter();
    const [hoveredTheme, setHoveredTheme] = useState(null);
    const [selectedSource, setSelectedSource] = useState("Victims");
    console.log(themes[0]);
    /*
    const highlightText = (text, theme) => {
      if (!theme) return text;
      
      const themeData = themeColors[theme];
      const wordsToHighlight = themeData.words;
      
      const regex = new RegExp(`(${wordsToHighlight.join('|')})`, 'gi');
      return text.split(regex).map((part, index) => 
        regex.test(part) 
          ? <mark key={index} className={`${themeData.highlight}`}>{part}</mark>
          : part
      );
    }; */

    return (
    <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Articles</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>All Article</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
            {/* Left Column - Article Content */}
            <ScrollArea className="col-span-3">
              <Button 
                variant="outline" 
                className="mb-4" 
                onClick={() => router.push(`/`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
              </Button>
              
              <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
              <div className="text-sm text-gray-600 mb-4">
                <span>By {article.author}</span>
                <span className="mx-2">|</span>
                <span>{article.publisher}</span>
                <span className="mx-2">|</span>
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
              <Separator className="mb-4" />
              <div className="prose text-sm">
                {hoveredTheme 
                  ? highlightText(article.full_text, hoveredTheme)
                  : article.full_text
                }
              </div>
            </ScrollArea>

            {/* Right Column - Summary and Analysis */}
            <ScrollArea className="col-span-3">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="mr-2 h-5 w-5" /> 
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{article.summary}</p>
                </CardContent>
              </Card>
              
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> 
                    Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {themes.map((theme, index) => (
                      <span 
                        key={index} 
                        className={`
                          px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-200 text-gray-900
                        `}
                      >
                        {theme.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/*
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UsersRound className="mr-2 h-5 w-5" /> 
                    Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    {article.sources.map((source, index) => (
                      <span 
                        key={index} 
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-200 ${
                          selectedSource === source
                            ? "bg-gray-300 text-gray-800"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setSelectedSource(source)}
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {sources[selectedSource].map((source, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          {source.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm">{source.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                </CardContent>
              </Card>
              */}
            </ScrollArea>
          </div>
        </div>
      </SidebarInset>)
}