"use client"
import * as React from "react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
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

import {ArticlesAreaChart} from "@/components/area-chart"
import {ArticlesPieChart} from "@/components/pie-chart"
import { TopicBarChart } from "@/components/topic-bar-chart"
import { DatePickerWithRange } from "@/components/date-picker-range"




export default function Page() {
  const [date, setDate] = React.useState({
    from: new Date(2024, 3, 1),
    to: new Date(2024, 5, 30),
  })

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
                    Analytics
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Visualization</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <DatePickerWithRange date ={date} setDate={setDate}/>
          <ArticlesAreaChart startDate={date.from} endDate={date.to}/>
          <div className="grid gap-x-4 grid-flow-col justify-stretch ">
            <ArticlesPieChart className=""/>
            <TopicBarChart/>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>)
  );
}
