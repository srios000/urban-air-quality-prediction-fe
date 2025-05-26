'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { toast } from 'sonner'
import { HistoryData, PredictionEntry } from '@/lib/types'

const categoryColors = {
  'Good': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  'Moderate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  'Unhealthy for Sensitive Groups': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  'Unhealthy': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  'Very Unhealthy': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  'Hazardous': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
}

const ITEMS_PER_PAGE = 10;
const PAGE_NEIGHBOURS = 1;

export default function HistoryDisplay() {
  const [historyData, setHistoryData] = useState<PredictionEntry[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isLastPageManuallySet, setIsLastPageManuallySet] = useState(false);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const isEffectivelyLastPage = totalItems > 0 ? currentPage >= totalPages : isLastPageManuallySet;


  const fetchHistory = useCallback(async (page: number) => {
    setIsLoading(true);
    const skip = (page - 1) * ITEMS_PER_PAGE;
    try {
      const response = await fetch(`/api/be/v1/predictions/history?limit=${ITEMS_PER_PAGE}&skip=${skip}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok (status: ${response.status})`);
      }
      const data: HistoryData = await response.json();

      const predictions = data.predictions || [];
      setHistoryData(predictions);

      if (data.total_count !== undefined && data.total_count !== null) {
        setTotalItems(data.total_count);
        setIsLastPageManuallySet(false);
      } else {
        if (predictions.length < ITEMS_PER_PAGE) {
          setTotalItems(skip + predictions.length);
          setIsLastPageManuallySet(true);
        } else {
          setIsLastPageManuallySet(false);
        }
      }

      if (predictions.length === 0 && page > 1 && totalItems > 0 && page > totalPages) {
        setCurrentPage(totalPages > 0 ? totalPages : 1);
      } else if (predictions.length === 0 && page > 1 && !data.total_count) {
        setCurrentPage(page - 1);
      }

    } catch (error: unknown) {
      console.error('Error fetching history:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to load history: ' + errorMessage);
      setHistoryData(null);
      setTotalItems(0);
      setIsLastPageManuallySet(true);
    } finally {
      setIsLoading(false);
    }
  }, [totalItems, totalPages]);

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage, fetchHistory]); 

  const handleRefresh = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchHistory(1);
    }
    if (!totalItems && isLastPageManuallySet) {
        setIsLastPageManuallySet(false);
    }
  }

  const handleNextPage = () => {
    if (!isEffectivelyLastPage) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(1, prevPage - 1))
  }

  const handleFirstPage = () => {
    setCurrentPage(1);
  }

  const handleLastPage = () => {
    if (totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }
  
  const handleGoToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  }

  const getPaginationItems = () => {
    const items: (number | string)[] = [];
    if (totalPages <= 0) return [];
    if (totalPages <= 1) return [1];


    items.push(1);

    const startPage = Math.max(2, currentPage - PAGE_NEIGHBOURS);
    const endPage = Math.min(totalPages - 1, currentPage + PAGE_NEIGHBOURS);

    if (startPage > 2) {
      items.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    if (endPage < totalPages - 1) {
      items.push('...');
    }

    if (totalPages > 1) {
        items.push(totalPages);
    }
    
    return [...new Set(items)];
  }

  const paginationItems = getPaginationItems();

  if (isLoading && historyData === null) {
    return (
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Prediction History</CardTitle>
          <CardDescription>Your recent air quality predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-3 text-blue-500" />
            <span className="text-lg">Loading history...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isLoading && (!historyData || historyData.length === 0) && currentPage === 1 && totalItems === 0) {
    return (
      <Card className="w-full mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Prediction History</CardTitle>
              <CardDescription>Your recent air quality predictions</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              {isLoading && currentPage === 1 ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No prediction history found.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Prediction History</CardTitle>
            <CardDescription>Your recent air quality predictions</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading && historyData && historyData.length > 0 ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {isLoading && historyData && historyData.length > 0 && (
          <div className="absolute inset-0 flex justify-center items-center z-10 rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        {historyData && historyData.length > 0 ? (
          <div className={`space-y-4 ${isLoading ? 'opacity-50' : ''}`}>
            {historyData.map((prediction, index) => {
              const colorClass = categoryColors[prediction.predicted_category as keyof typeof categoryColors] ||
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
              const loggedTimestamp = new Date(prediction.timestamp).toLocaleString()
              const predictionForDate = new Date(prediction.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

              return (
                <Card key={prediction.prediction_id || `prediction-${currentPage}-${index}`} className="hover:shadow-lg transition-shadow duration-200 ease-in-out">
                  <CardContent className="pt-6 pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
                      <div className="mb-2 sm:mb-0">
                        <Badge className={`${colorClass} text-sm px-3 py-1 rounded-full`}>
                          {prediction.predicted_category}
                        </Badge>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Predicted for: <span className="font-semibold">{predictionForDate}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Location: {prediction.input_data.loc}, {prediction.input_data.country}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-right">
                        <div>ID: <span className="font-mono">{prediction.prediction_id || 'N/A'}</span></div>
                        <div>Logged: {loggedTimestamp}</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 my-3 leading-relaxed">
                      {prediction.summary}
                    </p>
                    
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 pt-3">
                      {prediction.input_data.pm25 !== undefined && (
                        <div><span className="font-medium text-gray-800 dark:text-gray-200">PM2.5:</span> {prediction.input_data.pm25} µg/m³</div>
                      )}
                      {prediction.input_data.pm10 !== undefined && (
                        <div><span className="font-medium text-gray-800 dark:text-gray-200">PM10:</span> {prediction.input_data.pm10} µg/m³</div>
                      )}
                      {prediction.input_data.o3 !== undefined && (
                        <div><span className="font-medium text-gray-800 dark:text-gray-200">O₃:</span> {prediction.input_data.o3} µg/m³</div>
                      )}
                      {prediction.input_data.no2 !== undefined && (
                        <div><span className="font-medium text-gray-800 dark:text-gray-200">NO₂:</span> {prediction.input_data.no2} µg/m³</div>
                      )}
                      {prediction.input_data.so2 !== undefined && (
                        <div><span className="font-medium text-gray-800 dark:text-gray-200">SO₂:</span> {prediction.input_data.so2} µg/m³</div>
                      )}
                      {prediction.input_data.co !== undefined && (
                        <div><span className="font-medium text-gray-800 dark:text-gray-200">CO:</span> {prediction.input_data.co} µg/m³</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          !isLoading && <div className="text-center py-8 text-gray-500 dark:text-gray-400">No more predictions found for this page.</div>
        )}

        { totalPages > 0 && (historyData && historyData.length > 0 || currentPage > 1) && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t dark:border-gray-700 space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFirstPage}
                    disabled={currentPage === 1 || isLoading}
                    className="disabled:opacity-50 hidden sm:inline-flex"
                    aria-label="Go to first page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || isLoading}
                    className="disabled:opacity-50"
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Prev</span>
                </Button>
            </div>

            <div className="flex items-center space-x-1">
                {paginationItems.map((item, index) =>
                    typeof item === 'number' ? (
                        <Button
                            key={`page-${item}`}
                            variant={item === currentPage ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleGoToPage(item)}
                            disabled={isLoading}
                            className={`disabled:opacity-50 w-9 h-9 p-0 ${item === currentPage ? 'font-bold' : ''}`}
                            aria-label={`Go to page ${item}`}
                            aria-current={item === currentPage ? 'page' : undefined}
                        >
                            {item}
                        </Button>
                    ) : (
                        <span key={`dots-${index}`} className="text-gray-500 dark:text-gray-400 px-1 sm:px-2 py-1 select-none">
                            ...
                        </span>
                    )
                )}
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={
                      isEffectivelyLastPage ||
                      isLoading ||
                      (historyData === null ? false : (historyData.length === 0 && !isEffectivelyLastPage))
                    }
                    className="disabled:opacity-50"
                    aria-label="Go to next page"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4 sm:ml-1" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLastPage}
                    disabled={isEffectivelyLastPage || isLoading || totalPages === 0}
                    className="disabled:opacity-50 hidden sm:inline-flex"
                    aria-label="Go to last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
          </div>
        )}
         <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
            Page {currentPage}
            {totalPages > 0 && ` of ${totalPages}`}
            {totalItems > 0 && <span className="ml-2 text-xs">({totalItems} total predictions)</span>}
        </div>
      </CardContent>
    </Card>
  )
}