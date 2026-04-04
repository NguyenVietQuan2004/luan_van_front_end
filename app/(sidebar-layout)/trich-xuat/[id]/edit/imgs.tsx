// "use client";

// import { useEffect, useRef, useState } from "react";
// import mammoth from "mammoth";
// import html2canvas from "html2canvas";
// import { Document, Page, pdfjs } from "react-pdf";

// // FIX worker cho Next.js (không dùng CDN nữa)
// // pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();
// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// interface FilePreviewProps {
//   url: string;
// }

// type FileType = "docx" | "pdf" | "img" | "unknown";

// export default function FilePreview({ url }: FilePreviewProps) {
//   const iframeRef = useRef<HTMLIFrameElement | null>(null);

//   const [type, setType] = useState<FileType>("unknown");
//   const [images, setImages] = useState<string[]>([]);
//   const [numPages, setNumPages] = useState<number>(0);

//   useEffect(() => {
//     const lower = url.toLowerCase();

//     if (lower.match(/\.(png|jpg|jpeg|webp)$/)) setType("img");
//     else if (lower.match(/\.pdf$/)) setType("pdf");
//     else if (lower.match(/\.docx$/)) setType("docx");
//     else setType("unknown");
//   }, [url]);

//   useEffect(() => {
//     if (type !== "docx") return;

//     const loadWord = async () => {
//       try {
//         const res = await fetch(url);
//         const arrayBuffer = await res.arrayBuffer();

//         const result = await mammoth.convertToHtml({ arrayBuffer });

//         if (!iframeRef.current) return;

//         const iframe = iframeRef.current;
//         const doc = iframe.contentDocument || iframe.contentWindow?.document;

//         if (!doc) return;

//         doc.open();

//         doc.write(`
//           <html>
//           <head>
//             <style>
//               body{
//                 background:white;
//                 color:black;
//                 font-family:Arial;
//                 padding:40px;
//               }
//             </style>
//           </head>
//           <body>
//             ${result.value}
//           </body>
//           </html>
//         `);

//         doc.close();

//         const canvas = await html2canvas(doc.body, {
//           backgroundColor: "#ffffff",
//         });

//         const img = canvas.toDataURL("image/png");

//         setImages([img]);
//       } catch (err) {
//         console.error("Word preview error:", err);
//       }
//     };

//     loadWord();
//   }, [type, url]);

//   return (
//     <div className="w-full">
//       {/* IMAGE */}
//       {type === "img" && <img src={url} className="w-full border rounded" />}

//       {/* PDF */}
//       {/* {type === "pdf" && (
//         <Document file={url} onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}>
//           {Array.from(new Array(numPages), (_, i) => (
//             <Page key={i} pageNumber={i + 1} width={800} />
//           ))}
//         </Document>
//       )} */}

//       {type === "pdf" && <iframe src={url} style={{ width: "100%", height: "90vh" }} title="PDF Preview" />}

//       {/* DOCX */}
//       {type === "docx" && (
//         <>
//           <iframe
//             ref={iframeRef}
//             style={{
//               position: "absolute",
//               left: "-9999px",
//               width: "800px",
//             }}
//           />

//           {images.map((src, i) => (
//             <img key={i} src={src} className="w-full border mb-4 rounded" />
//           ))}
//         </>
//       )}

//       {/* UNKNOWN */}
//       {type === "unknown" && (
//         <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//           Mở file
//         </a>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import mammoth from "mammoth";
import html2canvas from "html2canvas";

interface FilePreviewProps {
  url: string;
}

type FileType = "docx" | "pdf" | "img" | "unknown";

export default function FilePreview({ url }: FilePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [type, setType] = useState<FileType>("unknown");
  const [images, setImages] = useState<string[]>([]);

  // Xác định loại file
  useEffect(() => {
    const lower = url.toLowerCase();
    if (lower.match(/\.(png|jpg|jpeg|webp)$/)) setType("img");
    else if (lower.match(/\.pdf$/)) setType("pdf");
    else if (lower.match(/\.docx$/)) setType("docx");
    else setType("unknown");
  }, [url]);

  // Xử lý DOCX
  useEffect(() => {
    if (type !== "docx") return;

    const loadWord = async () => {
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });

        if (!iframeRef.current) return;
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        doc.open();
        doc.write(`
          <html>
          <head>
            <style>
              body {
                background:white;
                color:black;
                font-family:Arial;
                padding:40px;
              }
            </style>
          </head>
          <body>
            ${result.value}
          </body>
          </html>
        `);
        doc.close();

        const canvas = await html2canvas(doc.body, { backgroundColor: "#ffffff" });
        const img = canvas.toDataURL("image/png");
        setImages([img]);
      } catch (err) {
        console.error("Word preview error:", err);
      }
    };

    loadWord();
  }, [type, url]);

  return (
    <div className="w-full">
      {/* IMAGE */}
      {type === "img" && <img src={url} className="w-full border rounded" />}

      {/* PDF */}
      {type === "pdf" && <iframe src={url} style={{ width: "100%", height: "90vh" }} title="PDF Preview" />}

      {/* DOCX */}
      {type === "docx" && (
        <>
          <iframe
            ref={iframeRef}
            style={{
              position: "absolute",
              left: "-9999px",
              width: "800px",
            }}
          />
          {images.map((src, i) => (
            <img key={i} src={src} className="w-full border mb-4 rounded" />
          ))}
        </>
      )}

      {/* UNKNOWN */}
      {type === "unknown" && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Mở file
        </a>
      )}
    </div>
  );
}
