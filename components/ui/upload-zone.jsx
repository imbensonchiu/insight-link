"use client"

import { useState, useRef } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function Component() {
  const [activeTab, setActiveTab] = useState("upload")
  const [files, setFiles] = useState([])
  const [fileContent, setFileContent] = useState(null)
  const fileInputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer.files
    const validFiles = Array.from(droppedFiles).filter(file => file.type === "text/csv");
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    readCSVFile(validFiles[0]);  // Read the first dropped file
  }

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const validFiles = Array.from(selectedFiles).filter(file => file.type === "text/csv");
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    readCSVFile(validFiles[0]);  // Read the first selected file
  }

  const readCSVFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const rows = content.split("\n").map(row => row.split(","));
      setFileContent(rows);  // Store the CSV content for preview
    };
    reader.readAsText(file);
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
              Drag and drop a CSV file to upload. We'll preview the data before you import it.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div 
              className="grid gap-2 items-center justify-center border-2 border-dashed border-muted rounded-md p-12"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={handleClick}
            >
              <div className="w-10 h-10 text-muted-foreground" />
              <p className="text-muted-foreground">Drag and drop your CSV file here to upload</p>
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
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Next</Button>
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
                  {/* Add row mapping logic here */}
                  <TableRow>
                     <TableCell>Titile</TableCell>
                     <TableCell>
                       <Select id="column-mapping">
                         <SelectTrigger>
                           <SelectValue placeholder="Select field" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="title">Title</SelectItem>
                           <SelectItem value="publisher">Publisher</SelectItem>
                           <SelectItem value="author">Author</SelectItem>
                           <SelectItem value="date">Date</SelectItem>
                         </SelectContent>
                       </Select>
                     </TableCell>
                   </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Previous</Button>
            <Button type="submit">Next</Button>
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
                      <TableHead key={index}>{header}</TableHead>
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
            <Button variant="outline">Previous</Button>
            <Button type="submit">Upload</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
