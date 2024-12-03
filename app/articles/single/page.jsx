"use client";


import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, ClipboardList, UsersRound } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// Fake shared article data
const articles = [
  {
    id: "1",
    title: "Racism is the other virus sweeping America during this pandemic",
    author: "Morita, Julie",
    publisher: "Chicago Tribune",
    date: "2020/4/21",
    status: "completed",
    content: `In the midst of the COVID-19 pandemic, another insidious virus is spreading across America: racism. As the coronavirus continues to impact communities worldwide, Asian Americans have been facing increased discrimination, xenophobia, and hate crimes. This article explores the social and psychological toll of racism during a global health crisis.
The pandemic has exposed deep-seated racial tensions and systemic inequalities. Asian Americans have reported feeling marginalized, feared, and blamed for the spread of the virus, despite having no connection to its origin beyond shared ethnicity. This misdirected anger and fear have led to verbal harassment, physical attacks, and a pervasive sense of alienation.
Local community organizations and advocacy groups have been working tirelessly to combat these racist narratives, providing support to affected individuals and raising awareness about the importance of unity during challenging times. By sharing personal stories and experiences, these groups hope to foster empathy, understanding, and solidarity among diverse communities.`,
    themes: ["Racism", "COVID-19", "Asian Americans", "Discrimination", "Xenophobia"],
    sources: ["Victims", "Organizations"],
    summary: `The article provides a critical examination of the intersectionality of public health and racial discrimination during the COVID-19 pandemic. By highlighting the experiences of Asian Americans, it exposes the underlying social tensions that emerge during global crises.
The narrative underscores the importance of combating misinformation and racial stereotyping, emphasizing that pandemics do not justify discriminatory behavior. The piece serves as a powerful reminder of the need for empathy, understanding, and collective social responsibility.`
  }
];

// Theme color mapping with highlight colors
const themeColors = {
  "Racism": {
    tag: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    highlight: "bg-red-100",
    words: ["In the midst of the COVID-19 pandemic, another insidious virus is spreading across America: racism.", "Local community organizations and advocacy groups have been working tirelessly to combat these racist narratives, providing support to affected individuals and raising awareness about the importance of unity during challenging times."]
  },
  "COVID-19": {
    tag: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    highlight: "bg-blue-100",
    words: ["In the midst of the COVID-19 pandemic, another insidious virus is spreading across America: racism.", "The pandemic has exposed deep-seated racial tensions and systemic inequalities."]
  },
  "Asian Americans": {
    tag: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    highlight: "bg-green-100",
    words: ["As the coronavirus continues to impact communities worldwide, Asian Americans have been facing increased discrimination, xenophobia, and hate crimes.",
      "Asian Americans have reported feeling marginalized, feared, and blamed for the spread of the virus, despite having no connection to its origin beyond shared ethnicity."
    ]
  },
  "Discrimination": {
    tag: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    highlight: "bg-yellow-100",
    words: ["Asian Americans have been facing increased discrimination, xenophobia, and hate crimes. "]
  },
  "Xenophobia": {
    tag: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
    highlight: "bg-purple-100",
    words: ["As the coronavirus continues to impact communities worldwide, Asian Americans have been facing increased discrimination, xenophobia, and hate crimes."]
  }
};

// Source (entity) data for the article
const sources = {
  "Victims": [
    {
      name: "David Kim",
      description: "Local community organizations and advocacy groups have been working tirelessly to combat these racist narratives, providing support to affected individuals and raising awareness about the importance of unity during challenging times."
    },
    {
      name: "Alice Chen",
      description: "Local community organizations and advocacy groups have been working tirelessly to combat these racist narratives, providing support to affected individuals and raising awareness about the importance of unity during challenging times."
    },
  ],
  "Organizations": [
    {
      name: "Stop AAPI Hate",
      description: "Local community organizations and advocacy groups have been working tirelessly to combat these racist narratives, providing support to affected individuals and raising awareness about the importance of unity during challenging times."
    },
  ],
};

export default function SingleArticlePage() {
  const article = articles[0];
  const router = useRouter();
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [selectedSource, setSelectedSource] = useState("Victims");

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
  };

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
                <BreadcrumbLink href="#">Articles</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>All Article</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Single Article</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Article Content */}
            <div>
              <Button 
                variant="outline" 
                className="mb-4" 
                onClick={() => router.push(`/articles`)}
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
              <div className="prose">
                {hoveredTheme 
                  ? highlightText(article.content, hoveredTheme)
                  : article.content
                }
              </div>
            </div>

            {/* Right Column - Summary and Analysis */}
            <div>
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
                    {article.themes.map((theme, index) => (
                      <span 
                        key={index} 
                        className={`
                          px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-200
                          ${themeColors[theme].tag}
                        `}
                        onMouseEnter={() => setHoveredTheme(theme)}
                        onMouseLeave={() => setHoveredTheme(null)}
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}