'use client'
import * as pdfjsLib from 'pdfjs-dist';

import { extractTextFromPdf } from "@/lib/pdfUtils";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [pdfFile, setPdfFile] = useState<null | File>(null);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');

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

  function sliceText(text: string, size: number) {
    const slices = [];
    for (let i = 0; i < text.length; i += size) {
      slices.push(text.slice(i, i + size));
    }
    return slices;
  }

  const handleSubmit = async () => {
    setLoading(true);
    if (!pdfFile) return;
    const text = await extractTextFromPdf(URL.createObjectURL(pdfFile));
    const textSlices = sliceText(text, 1000); // Adjust slice size as needed
    const responses = await Promise.all(textSlices.map(async (slice) => {
      //api call to an ai 
    }));
    const combinedResponse = responses.join('\n');
    setResponseText(combinedResponse);
    //generating pdf
    setLoading(false);
  }

  return (
    <div>
      <h1>PDF Text Extractor</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={!pdfFile || loading}>{loading ? 'Proceesing...' : 'Submit'}</button>
      <div>{responseText}</div>
    </div>
  );
}
