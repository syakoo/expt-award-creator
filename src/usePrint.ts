import { useRef, useCallback } from "react";
import html2canvas from "html2canvas";

export function usePrint<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const handlePrint = useCallback(async () => {
    if (!ref.current) return;

    const canvas = await html2canvas(ref.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imageUrl = canvas.toDataURL("image/png");

    // 非表示のiframeを作成して印刷
    const iframe = document.createElement("iframe");
    iframe.hidden = true;
    document.body.appendChild(iframe);

    // 印刷ダイアログが閉じた後にiframeを削除
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "printComplete") {
        document.body.removeChild(iframe);
        window.removeEventListener("message", handleMessage);
      }
    };
    window.addEventListener("message", handleMessage);

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @page { margin: 0; }
            body { margin: 0; }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" style="width:100%;" onload="window.print()" />
          <script>
            window.onafterprint = () => {
              window.parent.postMessage("printComplete", "*");
            };
          </script>
        </body>
      </html>
    `;
  }, []);

  return { ref, handlePrint };
}

