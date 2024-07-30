'use client';
import * as pdfjsLib from 'pdfjs-dist';
import { extractTextFromPdf } from "@/lib/pdfUtils";
import { ChangeEvent, useEffect, useState } from "react";
import { callToAiApi } from '@/lib/apiCall';
import { usePDF } from 'react-to-pdf';

export default function Home() {
  const [pdfFile, setPdfFile] = useState<null | File>(null);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');
  const { toPDF, targetRef } = usePDF({ filename: 'note.pdf' })
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  };

  const sliceText = (text: string, size: number) => {
    const slices = [];
    for (let i = 0; i < text.length; i += size) {
      slices.push(text.slice(i, i + size));
    }
    return slices;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!pdfFile) return;
    const text = await extractTextFromPdf(URL.createObjectURL(pdfFile));
    const textSlices = sliceText(text, 1000);
    const initialPrompt = "I am about to share a long document with you in several parts. Please generate concise and coherent notes for each part, ensuring key points and important details are highlighted.";
    await callToAiApi(initialPrompt);
    const responses = await Promise.all(textSlices.map(async (slice) => {
      const response = await callToAiApi(slice);
      return response;
    }));
    const combinedResponse = responses.join('\n');
    setResponseText(combinedResponse);
    setLoading(false);
  };



  return (
    <div>
      <h1>PDF Text Extractor</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={!pdfFile || loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
      {responseText && (
        <>
          <button onClick={() => toPDF()}>Download PDF</button>
          <div ref={targetRef} className='text-red-500'>{responseText}</div>
        </>
      )}
    </div>
  );
}
