import React, { useState } from 'react';
import { Upload, X, CheckCircle, Activity, ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';

interface UploadScreenProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export function UploadScreen({ onBack, onNavigate }: UploadScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Activity className="w-8 h-8 text-[#9333EA]" />
            <span className="text-xl font-bold text-gray-900">Tawhida</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Test</h1>
        <p className="text-gray-600 mb-8">
          Upload pathology images for AI-powered breast cancer detection analysis
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Image Upload</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center hover:border-[#9333EA] hover:bg-purple-50 transition-all cursor-pointer"
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/jpeg,image/png,image/tiff"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-xl">
                    Drag & Drop or Click to Upload
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Supported formats: JPEG, PNG, TIFF (Max 10MB)
                  </p>
                  <Button variant="primary" type="button">
                    Select File
                  </Button>
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Preview */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-8 h-8 text-[#9333EA]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {!uploading && !uploadComplete && (
                      <button
                        onClick={handleRemoveFile}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Uploading...</span>
                      <span className="font-medium text-gray-900">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} color="purple" />
                  </div>
                )}

                {/* Upload Complete */}
                {uploadComplete && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Upload Successful</p>
                        <p className="text-sm text-green-700">
                          Your image has been uploaded and is being analyzed
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!uploadComplete && (
                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      onClick={handleRemoveFile}
                      disabled={uploading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleUpload}
                      disabled={uploading}
                      className="flex-1"
                    >
                      {uploading ? 'Uploading...' : 'Submit for Analysis'}
                    </Button>
                  </div>
                )}

                {uploadComplete && (
                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      onClick={onBack}
                      className="flex-1"
                    >
                      Back to Dashboard
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleRemoveFile}
                      className="flex-1"
                    >
                      Upload Another
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Advanced machine learning models analyze your pathology images
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Review</h3>
              <p className="text-sm text-gray-600">
                Results are reviewed by board-certified specialists
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">
                HIPAA-compliant encryption protects your data
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}