"use client"

import { useState, useRef } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Loader2, CheckCircle2, File as FileIcon, Trash2 } from "lucide-react"

export default function Component() {
  const [activeTab, setActiveTab] = useState("upload")
  const [files, setFiles] = useState([])
  const [fileContent, setFileContent] = useState(null)
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState({
    loading: false,
    completed: false,
    error: null,
    fileName: null
  })
  const [columnMappings, setColumnMappings] = useState({})

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer.files
    const validFiles = Array.from(droppedFiles).filter(file => file.type === "text/csv");
    
    if (validFiles.length > 0) {
      setUploadStatus({ 
        loading: true, 
        completed: false, 
        error: null,
        fileName: validFiles[0].name 
      });
      setFiles(validFiles);
      readCSVFile(validFiles[0]);
    }
  }

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const validFiles = Array.from(selectedFiles).filter(file => file.type === "text/csv");
    
    if (validFiles.length > 0) {
      setUploadStatus({ 
        loading: true, 
        completed: false, 
        error: null,
        fileName: validFiles[0].name 
      });
      setFiles(validFiles);
      readCSVFile(validFiles[0]);
    }
  }

  const readCSVFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const rows = content.split("\n").map(row => row.split(","));
        
        // Simulate a delay to show loading state
        setTimeout(() => {
          setFileContent(rows);
          setUploadStatus({ 
            loading: false, 
            completed: true, 
            error: null,
            fileName: file.name 
          });
          setActiveTab("map");
        }, 1000);
      } catch (error) {
        setUploadStatus({ 
          loading: false, 
          completed: false, 
          error: error.message,
          fileName: null 
        });
      }
    };

    reader.onerror = (error) => {
      setUploadStatus({ 
        loading: false, 
        completed: false, 
        error: "Error reading file",
        fileName: null 
      });
    };

    reader.readAsText(file);
  }

  const handleRemoveFile = () => {
    setFiles([]);
    setFileContent(null);
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

  const handleColumnMapping = (csvColumn, mappedField) => {
    setColumnMappings(prev => ({
      ...prev,
      [csvColumn]: mappedField || csvColumn 
    }));
  }

  const handleTabNavigation = (direction) => {
    const tabs = ["upload", "map", "preview"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (direction === 'next' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (direction === 'previous' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  }

  const handleUpload = () => {
    // Implement your upload logic here
    console.log("Uploading file with mappings:", {
      file: files[0],
      columnMappings,
      fileContent
    });
    alert("File uploaded successfully!");
  }
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
      <TabsList className="border-b">
        <TabsTrigger value="upload">Upload CSV</TabsTrigger>
        <TabsTrigger value="map">Map Columns</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Import CSV File</CardTitle>
            <CardDescription>
              Select or drag and drop a CSV file to upload. We'll preview the data before you import it.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div 
              className="grid gap-2 items-center justify-center border-2 border-dashed border-muted rounded-md p-12"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={handleClick}
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
                  {/* <div className="flex items-center mt-2">
                    <FileIcon className="w-6 h-6 mr-2 text-gray-500" />
                    <span className="text-gray-700">{uploadStatus.fileName}</span>
                  </div> */}
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

      <TabsContent value="map">
        <Card>
          <CardHeader>
            <CardTitle>Map CSV Columns</CardTitle>
            <CardDescription>Map the CSV columns to the corresponding fields in our system.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CSV Column</TableHead>
                    <TableHead>Map To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileContent && fileContent[0].map((header, index) => (
                    <TableRow key={index}>
                      <TableCell>{header}</TableCell>
                      <TableCell>
                        <Select 
                          onValueChange={(value) => handleColumnMapping(header, value)}
                          value={columnMappings[header] || ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="title">title</SelectItem>
                            <SelectItem value="publisher">publisher</SelectItem>
                            <SelectItem value="author">author</SelectItem>
                            <SelectItem value="date">date</SelectItem>
                            <SelectItem value="text">text</SelectItem>
                            <SelectItem value="length">length</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
              onClick={() => handleTabNavigation('next')}
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Review the data before you import it.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {fileContent ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {fileContent[0].map((header, index) => (
                      <TableHead key={index}>
                        {columnMappings[header] || header} 
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileContent.slice(1).map((row, index) => (
                    <TableRow key={index}>
                      {row.map((cell, idx) => (
                        <TableCell key={idx}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No data to preview.</p>
            )}
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