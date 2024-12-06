"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, File as FileIcon, Trash2 } from "lucide-react"
import OpenAI from "openai"
import pdfToText from "react-pdftotext";
import { neon } from '@neondatabase/serverless';
import ArticlePreview from "@/components/article-preview";

export default function Component() {
  const [activeTab, setActiveTab] = useState("upload")
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState({
    loading: false,
    completed: false,
    error: null,
    fileName: null
  })

  const baseArticle = {
    title: "Test Article Title",
    author: "Test Author",
    publisher: "Test Publisher",
    date: "2023-01-01",
    summary: "This is a summary of the test article.",
    full_text: "This is the full content of the test article.",
    media_type: "mainstream",
    status: "finished",
    themes: [],
    entities: [],
  }

  const [curArticle, setCurArticle] = useState(baseArticle);

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer.files
    const validFiles = Array.from(droppedFiles).filter(file => file.type === "application/pdf");

    if (validFiles.length > 0) {
      setUploadStatus({
        loading: true,
        completed: false,
        error: null,
        fileName: validFiles[0].name
      });
      setFiles(validFiles);
      parsePDFFile(validFiles[0]);
    }
  }

  const handleRemoveFile = () => {
    setCurArticle(baseArticle);
    setFiles([]);
    setUploadStatus({
      loading: false,
      completed: false,
      error: null,
      fileName: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const validFiles = Array.from(selectedFiles).filter(file => file.type === "application/pdf");

    if (validFiles.length > 0) {
      setUploadStatus({
        loading: true,
        completed: false,
        error: null,
        fileName: validFiles[0].name
      });
      setFiles(validFiles);
      parsePDFFile(validFiles[0]);
    }
  }

  const parsePDFFile = async (file) => {
    const client = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

    const handleLLM = async (prompt, client, promptFilePath = "") => {
      if (promptFilePath !== "") {
        const res = await fetch(promptFilePath)
        prompt = await res.text() + prompt;
      }

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
            ],
          },
        ],
        response_format: { "type": "json_object" }
      });

      console.log(JSON.parse(completion.choices[0].message.content));

      return JSON.parse(completion.choices[0].message.content);
    }

    // info
    const text = await pdfToText(file);
    const infoObj = await handleLLM(text, client, '/prompt/pdf_extraction.txt')

    // entities
    const entityObj = await handleLLM(infoObj.full_text, client, '/prompt/entity_extraction.txt')

    // themes
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
    const themes = await sql`
      SELECT *
      FROM themes 
    `;
    const themeObj = await handleLLM(`${themes}` + infoObj.full_text, client, '/prompt/theme_extraction.txt')

    setCurArticle({
      ...curArticle,
      ...infoObj,
      ...entityObj,
      ...themeObj,
    });

    setTimeout(() => {
      setUploadStatus({
        loading: false,
        completed: true,
        error: null,
        fileName: file.name
      });
    }, 1000);
  }

  const handleTabNavigation = (direction) => {
    const tabs = ["upload", "preview", "confirm"];
    const currentIndex = tabs.indexOf(activeTab);

    if (direction === 'next' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (direction === 'previous' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  }

  async function handleUpload() {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
    const article = (await sql`
    INSERT INTO articles (title, author, publisher, date, summary, full_text, media_type, status)
    VALUES (${curArticle.title}, ${curArticle.author}, ${curArticle.publisher}, ${curArticle.date}, ${curArticle.summary}, ${curArticle.full_text}, ${curArticle.media_type}, ${curArticle.status})
    returning id
    `)[0];

    for (const entity of curArticle.entities) {
      await sql`
      INSERT INTO entities (article_id, name, role, category, description)
      VALUES (${article.id}, ${"TEST" + entity.name}, ${entity.role}, ${entity.category}, ${entity.description})
      `;
    }

    for (const theme of curArticle.themes) {
      const contain = (await sql`
      INSERT INTO contains (article_id, theme_id, reason)
      VALUES (${article.id}, ${theme.theme_id}, ${"TEST" + theme.reason})
      returning id
      `)[0];

      for (const quote of theme.quotes) {
        await sql`
        INSERT INTO quotes (contain_id, quote)
        VALUES (${contain.id}, ${"TEST" + quote})
        `;
      }
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mx-auto">
      <TabsList className="border-b">
        <TabsTrigger value="upload">Upload CSV</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="confirm">Confirm</TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Import CSV File</CardTitle>
            <CardDescription>
              Select or drag and drop a CSV file to upload. We will preview the data before you import it.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div
              className="grid gap-2 items-center justify-center border-2 border-dashed border-muted rounded-md p-12"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
            >
              {uploadStatus.loading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-blue-500 mt-2">Uploading CSV...</p>
                </div>
              ) : uploadStatus.completed ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                  <p className="text-green-500 mt-2">CSV Uploaded Successfully</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FileIcon className="w-10 h-10 text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">Select or drag and drop your CSV file here to upload</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept=".csv"
              multiple
              className="sr-only"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleRemoveFile}
              disabled={!uploadStatus.completed}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Remove
            </Button>
            <Button
              type="submit"
              onClick={() => handleTabNavigation('next')}
              disabled={!uploadStatus.completed}
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <ArticlePreview article={{ ...curArticle, id: 1 }} themes={curArticle.themes} quotes={[]} entities={curArticle.entities} />
      </TabsContent>

      <TabsContent value="confirm">
        <Card>
          <CardHeader>
            <CardTitle>Get PDF Info</CardTitle>
            <CardDescription>Use LLM to get the info</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {
              curArticle && Object.keys(curArticle).map((key) => (
                key !== "full_text" && key !== "themes" && key !== "entities" && (
                  <div key={key} className="flex flex-col p-4 border rounded-lg bg-white">
                    <p className="font-semibold text-lg">{key}</p>
                    <p className="text-gray-700">{curArticle[key]}</p>
                  </div>
                )
              ))
            }
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => handleTabNavigation('previous')}
            >
              Previous
            </Button>
            <Button
              type="submit"
              onClick={handleUpload}
            >
              Upload
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

    </Tabs>
  )
}