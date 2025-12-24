import { useCallback, type RefObject } from "react";
import html2canvas from "html2canvas";

export function usePrint<T extends HTMLElement>(ref: RefObject<T | null>) {
  const handlePrint = useCallback(async () => {
    if (!ref.current) return;

    console.debug("[usePrint] 印刷処理を開始");

    const canvas = await html2canvas(ref.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    console.debug("[usePrint] Canvas 生成完了");

    const imageUrl = canvas.toDataURL("image/png");
    console.debug("[usePrint] 画像URL 生成完了");

    // 非表示のiframeを作成して印刷
    const iframe = document.createElement("iframe");
    iframe.hidden = true;
    document.body.appendChild(iframe);
    console.debug("[usePrint] iframe を作成・追加");

    // 印刷ダイアログが閉じた後にiframeを削除
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "printComplete") {
        console.debug("[usePrint] 印刷ダイアログが閉じられた");
        document.body.removeChild(iframe);
        console.debug("[usePrint] iframe を削除");
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
          <img src="${imageUrl}" style="width:100%;" onload="console.debug('[usePrint] 画像読み込み完了、印刷ダイアログを表示'); window.print()" />
          <script>
            window.onafterprint = () => {
              console.debug('[usePrint] onafterprint 発火');
              window.parent.postMessage("printComplete", "*");
            };
          </script>
        </body>
      </html>
    `;
  }, [ref]);

  return { handlePrint };
}
