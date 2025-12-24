import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { usePrint } from "./usePrint";
import awardFrame from "./assets/background.png";
import "./App.css";

const DEFAULT_NAME = "山田 太郎";
const DEFAULT_AWARD_CONTENT = "あなたは○○において優秀な成績を収めました";

function App() {
  const [name, setName] = useState(DEFAULT_NAME);
  const [awardContent, setAwardContent] = useState(DEFAULT_AWARD_CONTENT);
  const certificateRef = useRef<HTMLDivElement>(null);

  // iframe 方式の印刷
  const { handlePrint: handleIframePrint } = usePrint(certificateRef);

  // react-to-print を使った印刷
  const handleReactToPrint = useReactToPrint({
    contentRef: certificateRef,
    documentTitle: "賞状",
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      body {
        margin: 0;
      }
      /* 
       * body > * を指定する理由:
       * react-to-print は contentRef の DOM を iframe にコピーするため、
       * 印刷対象の要素は body の直接の子要素になる。
       * クラス名に依存せず印刷対象を指定できる。
       *
       * scale: 元の幅 500px を用紙幅 100vw に拡大
       */
      body > * {
        transform-origin: top left;
        transform: scale(calc(100vw / 500px));
      }
    `,
    onBeforePrint: async () => {
      console.debug("[react-to-print] 印刷処理を開始");
    },
    onAfterPrint: () => {
      console.debug("[react-to-print] 印刷ダイアログが閉じられた");
    },
  });

  const isDisabled = !name || !awardContent;

  return (
    <div className="app">
      <h1 className="title">賞状作成ツール</h1>

      <div className="container">
        {/* 入力フォーム */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="name">名前</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={DEFAULT_NAME}
            />
          </div>

          <div className="form-group">
            <label htmlFor="award-content">賞の内容</label>
            <textarea
              id="award-content"
              value={awardContent}
              onChange={(e) => setAwardContent(e.target.value)}
              placeholder={DEFAULT_AWARD_CONTENT}
              rows={4}
            />
          </div>

          <div className="button-group">
            <button
              className="print-button"
              onClick={handleIframePrint}
              disabled={isDisabled}
            >
              印刷 (iframe方式)
            </button>
            <button
              className="print-button print-button-alt"
              onClick={() => handleReactToPrint()}
              disabled={isDisabled}
            >
              印刷 (react-to-print)
            </button>
          </div>
        </div>

        {/* 賞状プレビュー */}
        <div className="preview-section">
          <h2>プレビュー</h2>
          <div className="certificate-wrapper">
            <div className="certificate" ref={certificateRef}>
              <img
                src={awardFrame}
                alt="賞状フレーム"
                className="certificate-frame"
              />
              <div className="certificate-content">
                <p className="certificate-title">賞状</p>
                <p className="certificate-name">{name || "名前"}</p>
                <p className="certificate-text">殿</p>
                <p className="certificate-body">
                  {awardContent || "賞の内容がここに表示されます"}
                </p>
                <p className="certificate-date">
                  {new Date().toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
