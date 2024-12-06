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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function ArticlePreview({article, themes, quotes, entities}){
    console.log("article:");
    console.log(article);
    const router = useRouter();
    const [hoveredThemeId, setHoveredTheme] = useState(null);
    const [selectedSource, setSelectedSource] = useState("Victims");

    useEffect(() => {
      const handleMouseEnter = (theme_id) => {
        console.log("hovered theme_id:");
        console.log(theme_id);
        setHoveredTheme(theme_id);
      };
    
      const handleMouseLeave = () => {
        setHoveredTheme(null);
      };
    
      const themeElements = document.querySelectorAll('.accordion-trigger');
      themeElements.forEach((element, index) => {
        element.addEventListener('mouseenter', () => handleMouseEnter(themes[index].theme_id));
        element.addEventListener('mouseleave', () => handleMouseLeave());
      });
    
      return () => {
        themeElements.forEach((element) => {
          element.removeEventListener('mouseenter', () => handleMouseEnter(themes[index].theme_id));
          element.removeEventListener('mouseleave', () => handleMouseLeave());
        });
      };
    }, [themes]);
    
    const highlightText = (text, theme_id) => {
      if (!theme_id) return text;
      const themeQuotes = quotes.filter(quote => quote.theme_id === theme_id);
      console.log("themeQuotes:");
      console.log(themeQuotes);
      const regex = new RegExp(`(${themeQuotes.map(q => q.quote).join('|')})`, 'gi');
      return text.split(regex).map((part, index) =>
        regex.test(part)
          ? <mark key={index} className=" bg-slate-200 transition-all	">{part}</mark>
          : part
      );
    };
    useEffect(() => {
      let timeoutId;
      if (hoveredThemeId) {
      timeoutId = setTimeout(() => {
        const firstHighlightedElement = document.querySelector('mark');
        if (firstHighlightedElement) {
        const originalScrollPosition = window.scrollY;
        setTimeout(() => {
          firstHighlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          window.scrollTo({ top: originalScrollPosition });
        }, 300); // Adding a delay of 500ms
        }
      }, 300); // Adding a delay of 300ms
      }
      return () => clearTimeout(timeoutId);
    }, [hoveredThemeId]);

    return (
    <SidebarInset>
      <div className="p-10">
        <div className="grid grid-cols-12 gap-12">
        {/* Left Column - Article Content */}
        <ScrollArea className="col-span-7 h-[calc(100vh-4rem)] pr-8">  
          <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
          <div className="text-sm text-gray-600 mb-4">
          <span>By {article.author}</span>
          <span className="mx-2">|</span>
          <span>{article.publisher}</span>
          <span className="mx-2">|</span>
          <span>{new Date(article.date).toLocaleDateString()}</span>
          </div>
          <Separator className="mb-4" />
          <div className="prose text-sm text-justify leading-relaxed">
          {hoveredThemeId 
            ? highlightText(article.full_text, hoveredThemeId)
            : article.full_text
          }
          </div>
        </ScrollArea>

        {/* Right Column - Summary and Analysis */}
        <div className="col-span-5 h-[calc(100vh-4rem)] pr-4 flex flex-col justify-items-start pb-8">
          <Card className="mb-4 max-w-[28vw]">
          <CardHeader>
            <CardTitle className="flex items-center">
            <ClipboardList className="mr-2 h-5 w-5" /> 
            Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-light">{article.summary}</p>
          </CardContent>
          </Card>
          
          <Card className="mb-4 max-w-[28vw]">
          <CardHeader>
            <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" /> 
            Themes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" collapsible="true">
            {themes.map((theme, index) => (
              <AccordionItem 
              key={index}
              value={index + 1} 
              >
              <AccordionTrigger className="accordion-trigger">{theme.name}</AccordionTrigger>
              <AccordionContent className="font-light">{theme.reason}</AccordionContent>
              </AccordionItem>
            ))}
            </Accordion>
          </CardContent>
          </Card>
          <Card className="mb-4 max-w-[28vw]">
          <CardHeader>
            <CardTitle className="flex items-center">
            <UsersRound className="mr-2 h-5 w-5" /> 
            People & Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row flex-wrap gap-4 mb-4 max-w-[28vw]">
            {[...new Set(entities.map(entity => entity.category))].map((category, index) => (
              <span 
              key={index} 
              className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-all duration-200 ${
                selectedSource === category
                ? "bg-gray-300 text-gray-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedSource(category)}
              >
              {category}
              </span>
            ))}
            </div>
          <Accordion type="multiple" collapsible="true">
            {entities.filter(entity => entity.category === selectedSource).map((entity, index) => (
              <AccordionItem key={index} value={index + 1}>
                <AccordionTrigger className="accordion-trigger-entity">{entity.name}</AccordionTrigger>
                <AccordionContent className="font-light flex flex-col">
                  <div className="font-thin text-gray-600 mb-2">{entity.role}</div>
                  <div>{entity.description}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          </CardContent>
          </Card>
        </div>
        </div>
      </div>
      </SidebarInset>)
}