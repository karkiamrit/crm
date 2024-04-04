// import React from "react";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

// interface LeadDocumentsProps {
//   documents: string[];
// }

// export const LeadDocuments: React.FC<LeadDocumentsProps> = ({ documents }) => {
//   const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}`; // Replace with your server's base URL
//   const docs = documents.map((document) => ({ uri: baseUrl + document }));
//   console.log(docs);
//   return (
//     <div className="w-full h-full">
//       {" "}
//       <DocViewer
//         documents={docs}
//         initialActiveDocument={docs[0]}
//         pluginRenderers={DocViewerRenderers}
//         className="object-contain w-full h-full"
//       />
//     </div>
//   );
// };
import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import Image from "next/image";

interface LeadDocumentsProps {
  documents: string[];
}

export const LeadDocuments: React.FC<LeadDocumentsProps> = ({ documents }) => {
  const baseUrl = "http://localhost:8006/"; // Replace with your server's base URL
  const docs = documents.map((document) => ({ uri: baseUrl + document }));

  const images = docs.filter((doc) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(doc.uri.split('.').pop()?.toLowerCase() || ''));
  const otherDocs = docs.filter((doc) => !images.includes(doc));

  return (
    <div className="w-full h-full">
      <div className="grid grid-rows-3 grid-cols-3 gap-2">
        {images.map((img, index) => (
          <div key={index}>
            <Image src={img.uri} alt="Document" className="w-full h-full" width={300} height={100} />
          </div>
        ))}
      </div>
      <div>
        {otherDocs.map((doc, index) => (
          <div key={index}>
            <DocViewer
              documents={[doc]}
              initialActiveDocument={doc}
              pluginRenderers={DocViewerRenderers}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};