"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"

export default function DragAndDropUpload() {
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer.files
    // Filter dropped files to only allow CSV
    const validFiles = Array.from(droppedFiles).filter(file => file.type === "text/csv");
    setFiles((prevFiles) => [...prevFiles, ...validFiles])
  }

  const handleRemove = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    // Filter selected files to only allow CSV
    const validFiles = Array.from(selectedFiles).filter(file => file.type === "text/csv");
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV Files</CardTitle>
          <CardDescription>Drag and drop your CSV files or click the button to select them.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center space-y-4 py-12 px-6 border-2 border-gray-300 border-dashed rounded-md transition-colors hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleClick}
          >
            <UploadIcon className="h-12 w-12 text-gray-400" />
            <div className="font-medium text-gray-900 dark:text-gray-50">Drop files here or click to upload</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">CSV files only</p>
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
        <CardFooter>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Upload</Button>
          </div>
        </CardFooter>
      </Card>

      {/* Display the uploaded files */}
      <div className="grid grid-cols-2 gap-4">
        {files.map((file, index) => (
          <Card key={index}>
            <CardContent>
              <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt={file.name}
                  width={300}
                  height={400}
                  className="w-full h-full object-contain"
                  style={{ aspectRatio: "300/400", objectFit: "cover" }}
                />
              </div>
              <div className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-50">{file.name}</div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={() => handleRemove(index)}>
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}

