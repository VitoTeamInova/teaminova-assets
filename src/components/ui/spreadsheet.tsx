import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Textarea } from './textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Plus, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface SpreadsheetProps {
  className?: string;
  data?: string[][];
  onChange?: (data: string[][]) => void;
  maxRows?: number;
  maxCols?: number;
}

export const Spreadsheet: React.FC<SpreadsheetProps> = ({
  className,
  data: initialData,
  onChange,
  maxRows = 10,
  maxCols = 6
}) => {
  const [data, setData] = useState<string[][]>(() => {
    if (initialData) return initialData;
    return Array(maxRows).fill(null).map(() => Array(maxCols).fill(''));
  });
  const [pasteText, setPasteText] = useState('');
  const [showPasteDialog, setShowPasteDialog] = useState(false);

  const handleCellChange = (row: number, col: number, value: string) => {
    const newData = [...data];
    newData[row][col] = value;
    setData(newData);
    onChange?.(newData);
  };

  const handlePasteExcel = () => {
    if (!pasteText.trim()) return;
    
    try {
      // Parse tab-separated values (Excel format)
      const rows = pasteText.trim().split('\n');
      const parsedData = rows.map(row => 
        row.split('\t').slice(0, maxCols)
      );
      
      // Ensure we don't exceed maxRows
      const limitedData = parsedData.slice(0, maxRows);
      
      // Pad with empty cells if needed
      const paddedData = Array(maxRows).fill(null).map((_, rowIndex) => {
        const row = limitedData[rowIndex] || [];
        return Array(maxCols).fill(null).map((_, colIndex) => row[colIndex] || '');
      });
      
      setData(paddedData);
      onChange?.(paddedData);
      setPasteText('');
      setShowPasteDialog(false);
      toast.success('Excel data pasted successfully!');
    } catch (error) {
      toast.error('Failed to parse Excel data. Please check the format.');
    }
  };

  const exportToCSV = () => {
    const csvContent = data
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Spreadsheet exported as CSV!');
  };

  const clearAll = () => {
    const emptyData = Array(maxRows).fill(null).map(() => Array(maxCols).fill(''));
    setData(emptyData);
    onChange?.(emptyData);
    toast.success('Spreadsheet cleared!');
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2 flex-wrap">
        <Dialog open={showPasteDialog} onOpenChange={setShowPasteDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Paste Excel Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Paste Excel Data</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Copy cells from Excel and paste them here. The data should be tab-separated.
              </p>
              <Textarea
                placeholder="Paste your Excel data here..."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={10}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPasteDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePasteExcel}>
                  Import Data
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        
        <Button variant="outline" size="sm" onClick={clearAll}>
          Clear All
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              {Array(maxCols).fill(null).map((_, index) => (
                <TableHead key={index} className="text-center min-w-[120px]">
                  {String.fromCharCode(65 + index)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className="text-center font-medium bg-muted/50">
                  {rowIndex + 1}
                </TableCell>
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex} className="p-0">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className="w-full h-full px-3 py-2 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                      placeholder=""
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};