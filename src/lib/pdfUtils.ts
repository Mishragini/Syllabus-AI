import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';



export async function extractTextFromPdf(pdfUrl: string) {

    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .filter((item): item is TextItem => 'str' in item)
            .map(item => item.str)
            .join(' ');
        fullText += pageText + ' ';
    }
    return fullText
}