"use client"

import * as React from "react"
import { Bar, BarChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, LabelList, CardFooter} from "recharts"
import { DatePickerWithRange } from "./date-picker-range"
import { neon } from '@neondatabase/serverless'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  articles: {
    label: "Articles",
  },
  date: {
    label: "date",
  },
  ms: {
    label: "Mainstream Media",
    color: "hsl(var(--chart-1))",
  },
  nms: {
    label: "Non-mainstream Media",
    color: "hsl(var(--chart-2))",
  },
} 

const chartConfigEntityType = {
  entity_type: {
    label: "Entity Type",
  },
  entity_count: {
    label: "Number of Articles   ",
    color: "hsl(var(--chart-4))",
  },
}

const chartConfigSources = {
  total: {
    label: "Number of Articles",
    color: "hsl(var(--chart-5))",
  },
  num_sources: {
    label: "Number of Source Types",
  },
  ms: {
    label: "Number of Articles in Mainstream Media",
    color: "hsl(var(--chart-1))",
  },
  nms: {
    label: "Number of Articles in Non-mainstream Media",
    color: "hsl(var(--chart-2))",
  },
}

const color = {
  total: "chart-4",
  ms: "chart-1",
  nms: "chart-2",
}


export function NumberOfArticlesAreaChart({chartData}) {
  const [date, setDate] = React.useState({
    from: new Date(2021, 2, 16),
    to: new Date(2021, 11, 31),
  })

  const [topThemes, setTopThemes] = React.useState([])
  const [topEntities, setTopEntities] = React.useState([])
  const [topEntityType, setTopEntityType] = React.useState([])
  const [numSourcesCount, setNumSourcesCount] = React.useState([])

  const [topThemeMediaType, setTopThemeMediaType] = React.useState("total")
  const [topEntityMediaType, setTopEntityMediaType] = React.useState("total")
  const [topEntityTypeMediaType, setTopEntityTypeMediaType] = React.useState("total")

  const [activeChart, setActiveChart] = React.useState("total")
  

  const filteredData = chartData.filter((item) => {
    // console.log("called filter")
    const item_date = new Date(item.date)
    const startDate = date?.from
    const endDate = date?.to
    // console.log(item_date, startDate, endDate)
    return item_date >= startDate && item_date <= endDate
  })

  React.useEffect(() => {
    async function getTopThemes() {
      const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
      if (date?.from && date?.to) {
        let response;
        if (topThemeMediaType === "total") {
          response = await sql`
          SELECT c.theme_id, t.name AS theme_name, 
          CAST(COUNT(*) AS INTEGER) AS theme_count,
          CAST((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM articles WHERE date BETWEEN ${date?.from} AND ${date?.to})) AS DECIMAL(5, 2)) AS percentage
          FROM contains c
          JOIN articles a ON c.article_id = a.id
          JOIN themes t ON c.theme_id = t.id
          WHERE a.date BETWEEN ${date?.from} AND ${date?.to}
          GROUP BY c.theme_id, t.name
          ORDER BY theme_count DESC
          LIMIT 10
          `;
        } else if (topThemeMediaType === "ms") {
          response = await sql`
          SELECT c.theme_id, t.name AS theme_name, 
          CAST(COUNT(*) AS INTEGER) AS theme_count,
          CAST((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM articles WHERE date BETWEEN ${date?.from} AND ${date?.to} AND media_type = 'mainstream')) AS DECIMAL(5, 2)) AS percentage
          FROM contains c
          JOIN articles a ON c.article_id = a.id
          JOIN themes t ON c.theme_id = t.id
          WHERE a.date BETWEEN ${date?.from} AND ${date?.to} AND a.media_type = 'mainstream'
          GROUP BY c.theme_id, t.name
          ORDER BY theme_count DESC
          LIMIT 10
          `;
        } else if (topThemeMediaType === "nms") {
          response = await sql`
          SELECT c.theme_id, t.name AS theme_name, 
          CAST(COUNT(*) AS INTEGER) AS theme_count,
          CAST((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM articles WHERE date BETWEEN ${date?.from} AND ${date?.to} AND media_type = 'non-mainstream')) AS DECIMAL(5, 2)) AS percentage
          FROM contains c
          JOIN articles a ON c.article_id = a.id
          JOIN themes t ON c.theme_id = t.id
          WHERE a.date BETWEEN ${date?.from} AND ${date?.to} AND a.media_type = 'non-mainstream'
          GROUP BY c.theme_id, t.name
          ORDER BY theme_count DESC
          LIMIT 10
          `;
        }
        // console.log(response)
        setTopThemes(response);
      }
    }
    async function getTopEntities(){
      const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
        let response;
        if (topEntityMediaType === "total") {
          response = await sql`
          SELECT DISTINCT e.name AS entity_name, 
          CAST(COUNT(*) AS INTEGER) AS entity_count,
          CAST((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM articles WHERE date BETWEEN ${date?.from} AND ${date?.to})) AS DECIMAL(5, 2)) AS percentage
          FROM entities e
          JOIN articles a ON e.article_id = a.id
          WHERE a.date BETWEEN ${date?.from} AND ${date?.to}
          GROUP BY e.name
          ORDER BY entity_count DESC
          LIMIT 10
          `;
        } else if (topEntityMediaType === "ms") {
          response = await sql`
          SELECT DISTINCT e.name AS entity_name, 
          CAST(COUNT(*) AS INTEGER) AS entity_count,
          CAST((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM articles WHERE date BETWEEN ${date?.from} AND ${date?.to} AND media_type = 'mainstream')) AS DECIMAL(5, 2)) AS percentage
          FROM entities e
          JOIN articles a ON e.article_id = a.id
          WHERE a.date BETWEEN ${date?.from} AND ${date?.to} AND a.media_type = 'mainstream'
          GROUP BY e.name
          ORDER BY entity_count DESC
          LIMIT 10
          `;
        } else if (topEntityMediaType === "nms") {
          response = await sql`
          SELECT DISTINCT e.name AS entity_name, 
          CAST(COUNT(*) AS INTEGER) AS entity_count,
          CAST((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM articles WHERE date BETWEEN ${date?.from} AND ${date?.to} AND media_type = 'non-mainstream')) AS DECIMAL(5, 2)) AS percentage
          FROM entities e
          JOIN articles a ON e.article_id = a.id
          WHERE a.date BETWEEN ${date?.from} AND ${date?.to} AND a.media_type = 'non-mainstream'
          GROUP BY e.name
          ORDER BY entity_count DESC
          LIMIT 10
          `;
        }
        // console.log(response)
        setTopEntities(response);
    }
    async function getTopEntitiesType(){
      const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
      let response;
      if (topEntityTypeMediaType === "total") {
        response = await sql`
        SELECT DISTINCT e.category AS entity_type, 
        CAST(COUNT(*) AS INTEGER) AS entity_count,
        CAST((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM articles WHERE date BETWEEN ${date?.from} AND ${date?.to})) AS DECIMAL(5, 2)) AS percentage
        FROM entities e
        JOIN articles a ON e.article_id = a.id
        WHERE a.date BETWEEN ${date?.from} AND ${date?.to}
        GROUP BY e.category
        ORDER BY entity_count DESC
        LIMIT 10
        `;
      } else if (topEntityTypeMediaType === "ms") {
        response = await sql`
        SELECT DISTINCT e.category AS entity_type, 
        CAST(COUNT(*) AS INTEGER) AS entity_count,
        CAST((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM articles WHERE date BETWEEN ${date?.from} AND ${date?.to} AND media_type = 'mainstream')) AS DECIMAL(5, 2)) AS percentage
        FROM entities e
        JOIN articles a ON e.article_id = a.id
        WHERE a.date BETWEEN ${date?.from} AND ${date?.to} AND a.media_type = 'mainstream'
        GROUP BY e.category
        ORDER BY entity_count DESC
        LIMIT 10
        `;
      } else if (topEntityTypeMediaType === "nms") {
        response = await sql`
        SELECT DISTINCT e.category AS entity_type, 
        CAST(COUNT(*) AS INTEGER) AS entity_count,
        CAST((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM articles WHERE date BETWEEN ${date?.from} AND ${date?.to} AND media_type = 'non-mainstream')) AS DECIMAL(5, 2)) AS percentage
        FROM entities e
        JOIN articles a ON e.article_id = a.id
        WHERE a.date BETWEEN ${date?.from} AND ${date?.to} AND a.media_type = 'non-mainstream'
        GROUP BY e.category
        ORDER BY entity_count DESC
        LIMIT 10
        `;
      }
      // console.log(response)
      setTopEntityType(response);
    }
    async function getNumSourcesCount(){
      const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
      let response = await sql`
      SELECT  
        num_sources, 
        CAST(COUNT(*) AS INT) AS total,
        CAST(SUM(CASE WHEN a.media_type = 'mainstream' THEN 1 ELSE 0 END) AS INT) AS ms,
        CAST(SUM(CASE WHEN a.media_type != 'mainstream' THEN 1 ELSE 0 END) AS INT) AS nms
      FROM (
        SELECT 
          e.article_id, 
          COUNT(DISTINCT e.category) AS num_sources
        FROM entities e
        JOIN articles a ON e.article_id = a.id
        WHERE a.date BETWEEN ${date?.from} AND ${date?.to}
        GROUP BY e.article_id
      ) AS source_counts
      JOIN articles a ON source_counts.article_id = a.id
      GROUP BY num_sources
      ORDER BY num_sources;
      `;

      setNumSourcesCount(response);
    }

    getTopThemes();
    getTopEntities();
    getTopEntitiesType();
    getNumSourcesCount();
  }, [date, topThemeMediaType, topEntityMediaType, topEntityTypeMediaType, numSourcesCount ]);
  

  // console.log(filteredData)

  return (
    <>
    <div className="flex flex-row gap-2">
    <DatePickerWithRange date={date} setDate={setDate} />
    <Tabs defaultValue="total" className="w-[400px]" onValueChange={(v) => {
      setTopThemeMediaType(v)
      setTopEntityMediaType(v)
      setTopEntityTypeMediaType(v)
      setActiveChart(v)
    }}>
      <TabsList>
        <TabsTrigger value="total" >Overall</TabsTrigger>
        <TabsTrigger value="ms">Mainstream Media</TabsTrigger>
        <TabsTrigger value="nms">Non-mainstream Media</TabsTrigger>
      </TabsList>
    </Tabs>
    </div>
      
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Number of News Articles</CardTitle>
            <CardDescription>
              Showing total number of news articles across time
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[200px] w-full"
          >
            <AreaChart data={filteredData}> 
              <defs>
                <linearGradient id="fillMs" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-ms)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-ms)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillNms" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-nms)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-nms)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 15]}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="ms"
                stroke="var(--color-ms)"
                fill="url(#fillMs)"
              />
              <Area
                type="monotone"
                dataKey="nms"
                stroke="var(--color-nms)"
                fill="url(#fillNms)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      {/*Top entity types and Sources count*/}
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
            <CardTitle>Top-10 Types of Sources</CardTitle>
            </div>
            <CardDescription>Showing the most mentioned types of sources</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigEntityType}>
              <BarChart
                accessibilityLayer
                data={topEntityType}
                layout="vertical"
                margin={{
                  right: 30,
                }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis dataKey="entity_count" type="number" hide/>
                <YAxis
                  dataKey="entity_type"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  width={180}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 30)}
                />
                
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="entity_count"
                  layout="vertical"
                  fill={`hsl(var(--${color[topEntityTypeMediaType]}))`}
                  radius={4}
                >
                  <LabelList
                    dataKey="entity_count"
                    position="right"
                    offset={8}
                    className="fill-foreground font-mono"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
            <CardTitle>The Number of Sources Types </CardTitle>
            </div>
            <CardDescription>Examine how many articles used one source, two sources, three sources, and so on... </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigSources}>
            <BarChart
              accessibilityLayer
              data={numSourcesCount}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="num_sources"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="font-mono"
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground font-mono"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
          </CardContent>
        </Card>
      </div>
      {/*Top themes and entities*/}
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
            <CardTitle>Top-10 Themes</CardTitle>
            </div>
            <CardDescription>Showing the most mentioned themes</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full divide-y divide-gray-200 transition-all	">
              <thead className="bg-gray-50">
                <tr className="grid grid-cols-12">
                  <th
                    scope="col"
                    className="col-span-8 px-6 py-1 text-left text-xs font-medium text-gray-500 tracking-wider w-100"
                  >
                    Theme Name
                  </th>
                  <th
                    scope="col"
                    className="col-span-2 px-6 py-1 text-left text-xs font-medium text-gray-500 tracking-wider max-w-15"
                  >
                    Mentions
                  </th>
                  <th
                    scope="col"
                    className="col-span-2 px-6 py-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                  >
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topThemes.map((theme) => (
                  <tr key={theme.theme_id} className="grid grid-cols-12">
                    <td className="col-span-8 px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 w-100 text-wrap">
                      <a href={`/themes/${theme.theme_id}`}>{theme.theme_name}</a>
                    </td>
                    <td className="col-span-2 px-6 py-2 whitespace-nowrap text-sm text-gray-500 font-mono  max-w-15">
                      {theme.theme_count}
                    </td>
                    <td className="col-span-2 px-6 py-2 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {theme.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <CardTitle>Top-10 People & Organization</CardTitle>
            </div>
            <CardDescription>Showing the most mentioned people or organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full divide-y divide-gray-200 transition-opacity">
              <thead className="bg-gray-50">
                <tr className="grid grid-cols-12">
                  <th
                    scope="col"
                    className="col-span-8 px-6 py-1 text-left text-xs font-medium text-gray-500 tracking-wider w-[400px]"
                  >
                    Entity Name
                  </th>
                  <th
                    scope="col"
                    className="col-span-2 px-6 py-1 text-left text-xs font-medium text-gray-500 tracking-wider  max-w-15"
                  >
                    Mentions
                  </th>
                  <th
                    scope="col"
                    className="col-span-2 px-6 py-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                  >
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topEntities.map((entity) => (
                  <tr key={entity.entity_name} className="grid grid-cols-12">
                    <td className="col-span-8 px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 w-100 text-wrap">
                      {entity.entity_name}
                    </td>
                    <td className="col-span-2 px-6 py-2 whitespace-nowrap text-sm text-gray-500 font-mono  max-w-15">
                      {entity.entity_count}
                    </td>
                    <td className="col-span-2 px-6 py-2 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {entity.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card> 
      </div>
    </>
  )
}
