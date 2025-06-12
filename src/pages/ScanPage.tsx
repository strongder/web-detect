"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, FileText, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import GraphVisualization from "@/components/GraphVisualization";
import api, { URL } from "@/api";

export default function ScanPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [currentGraphUrl, setCurrentGraphUrl] = useState<string | null>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleMultipleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      await scanMultipleFiles(files);
    }
  };

  const scanMultipleFiles = async (files: File[]) => {
    setIsLoading(true);
    setScanResults([]);
    setShowGraph(false);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      // Sử dụng axios instance để tự động thêm token
      const response = await api.post(`/multi-predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      console.log("Scan results:", data);
      if (data.code === "200") {
        setScanResults(data.data);

        toast({
          title: "Scan completed",
          description: `${files.length} files analyzed successfully`,
        });
      } else {
        throw new Error(data.message || "Failed to scan files");
      }
    } catch (error: any) {
      console.error("Error scanning files:", error);
      toast({
        title: "Scan failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while scanning the files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultipleUploadClick = () => {
    multipleFileInputRef.current?.click();
  };

  const handleViewGraph = (imageUrl: string) => {
    setCurrentGraphUrl(`${URL}${imageUrl}`);
    setShowGraph(true);
  };

  return (
    <div className="container mx-auto text-white">
      <div className="max-w-2xl mx-auto">
        <div
          className="flex flex-col items-center justify-center p-11 border-2 border-dashed rounded-2xl cursor-pointer border-blue-500 bg-slate-900 hover:bg-slate-800 transition-colors min-h-[260px]"
          onClick={handleMultipleUploadClick}
        >
          <FileText className="w-14 h-14 mb-5 text-blue-500" />
          <h3 className="mb-2 text-xl font-semibold text-white">
            Upload APK File
          </h3>
          <p className="text-sm text-gray-400 text-center">
            Click to select or drag and drop one or more APK files
          </p>
          <input
            type="file"
            ref={multipleFileInputRef}
            onChange={handleMultipleFileUpload}
            accept=".apk"
            multiple
            className="hidden"
          />
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="flex items-center mt-6 text-sm text-gray-300">
          <File className="w-4 h-4 mr-2" />
          <span>
            Selected file{selectedFiles.length > 1 ? "s" : ""}:{" "}
            {selectedFiles.map((f) => f.name).join(", ")}
          </span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center mt-8">
          <Loader2 className="w-8 h-8 mr-2 animate-spin text-[#2563eb]" />
          <span>Scanning files...</span>
        </div>
      )}

      {scanResults.length > 0 && !isLoading && (
        <>
          <h2 className="mt-8 mb-4 text-xl font-bold">Scan Results</h2>
          <div className="overflow-hidden border rounded-lg border-[#1e293b] bg-[#0f172a]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    FILE NAME
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    Result
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {scanResults.map((result) => (
                  <tr key={result.id} className="border-b border-[#1e293b]">
                    <td className="px-4 py-3 text-sm">
                      {" "}
                      <span title={result.file_name} className="cursor-pointer">
                        {result.file_name && result.file_name.length > 30
                          ? result.file_name.slice(0, 27) + "..."
                          : result.file_name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          result.result === "An toàn"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current"></span>
                        {result.result}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {result.image_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white"
                          onClick={() => handleViewGraph(result.image_url)}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 3v3.5m8-3v3.5M3 8h18m-18 3.5v7A1.5 1.5 0 0 0 4.5 20h15a1.5 1.5 0 0 0 1.5-1.5v-7"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          View Graph
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No graph available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showGraph && currentGraphUrl && (
        <div className="mt-8">
          <GraphVisualization imageUrl={currentGraphUrl} />
        </div>
      )}
    </div>
  );
}
