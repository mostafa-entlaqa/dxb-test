import { File } from "lucide-react"

interface DocumentsProps {
  isUnlocked: boolean
  presentation_file: string
  financials_file: string
}

export default function Documents({ isUnlocked, presentation_file, financials_file }: DocumentsProps) {
  console.log('Debug values:', { presentation_file, financials_file, isUnlocked })

  // Helper function to extract filename from URL
  const getFileName = (url: string) => {
    if (!url) return '';
    // Remove any quotes if they exist
    url = url.replace(/['"]/g, '');
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

  // Handle download
  const handleDownload = async (url: string, filename: string) => {
    if (!isUnlocked) return;
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  // Add debug rendering to see if the component is rendering at all
  if (!presentation_file && !financials_file) {
    return <div>No documents available</div>
  }

  return (
    <div className={isUnlocked ? "" : "filter blur-sm"}>
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Documents</h2>
      <div className="space-y-4">
        {presentation_file && (
          <div 
            className="bg-blue-50 p-4 rounded-lg flex items-center cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => handleDownload(presentation_file, getFileName(presentation_file))}
          >
            <File className="mr-4 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-700">{getFileName(presentation_file)}</p>
              <p className="text-sm text-gray-500">Business overview and strategy</p>
            </div>
          </div>
        )}
        
        {financials_file && (
          <div 
            className="bg-blue-50 p-4 rounded-lg flex items-center cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => handleDownload(financials_file, getFileName(financials_file))}
          >
            <File className="mr-4 text-green-600" />
            <div>
              <p className="font-semibold text-gray-700">{getFileName(financials_file)}</p>
              <p className="text-sm text-gray-500">Detailed financial records</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

