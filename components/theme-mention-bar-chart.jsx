"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    mention_count: {
      label: "Mentions",
      color: "hsl(var(--chart-5))",
    },
}

export function ThemeMentionBarChart({ chartData }) {
  return (
    <Card className="my-4 col-span-1">
      <CardHeader>
        <CardTitle className="font-medium text-lg">Mentions</CardTitle>
        <CardDescription>Mentions of the theme across time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
            <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                />
                <Bar dataKey="mention_count" fill="var(--color-mention_count)" radius={1} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
