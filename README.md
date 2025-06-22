# 心情點唱機 (Mood Jukebox) 🎶💖

「心情點唱機」是一個充滿可愛風格的中文聊天機器人，它會根據您分享的心情，溫暖地推薦三首合適的歌曲，希望能療癒您的心靈，點亮您的音樂宇宙！

✨ *建議您在此處放一張應用程式的截圖或 GIF 動畫，展示可愛的 UI 和互動效果。* ✨

## 功能特色

*   **心情點歌**：用自然語言描述您的心情（例如：「我今天有點憂鬱」、「想聽點開心的音樂」）。
*   **智能推薦**：透過 Google Gemini API 分析您的情緒，推薦 3 首最符合的中文歌曲。
*   **歌曲資訊**：每首推薦歌曲包含歌名、歌手、簡短描述。
*   **一鍵聆聽**：提供 YouTube 搜尋連結，方便您快速找到並播放歌曲。
*   **可愛風格 UI**：
    *   粉色系主題、圓角設計、療癒的視覺風格。
    *   可愛的兔子角色 🐰 會根據情境（開心、難過、思考中）變換表情和動畫。
    *   使用 Emoji 增添對話的親切感。
*   **溫暖互動**：聊天機器人的回應親切、具有情感溫度。
*   **持續對話**：鼓勵使用者在每次推薦後繼續分享心情。
*   **響應式設計**：支援桌面及行動裝置瀏覽。
*   **金鑰提示**：若 API Key 未設定或無效，會提供清晰的提示。

## 技術棧

*   **前端框架**：React 19 (透過 esm.sh 動態載入)
*   **語言**：TypeScript
*   **樣式**：Tailwind CSS (透過 CDN)
*   **AI 模型**：Google Gemini API (`gemini-2.5-flash-preview-04-17`)
*   **Gemini API 客戶端**: `@google/genai` SDK (透過 esm.sh)

## 環境準備

在開始之前，請確保您的開發環境中已安裝：

*   [Node.js](https://nodejs.org/) (建議 LTS 版本，主要用於 `npx` 指令)
*   [npm](https://www.npmjs.com/) (通常隨 Node.js 一起安裝)

## 環境變數設定

本應用程式**必須**使用 Google Gemini API 金鑰才能運作。應用程式的程式碼設計為從執行環境的 `process.env.API_KEY` 變數中讀取此金鑰。

1.  **取得 API 金鑰**：
    *   請至 [Google AI Studio](https://aistudio.google.com/app/apikey) 取得您的 API Key。

2.  **設定 `API_KEY` 環境變數**：
    *   **本地開發**：
        *   此專案的程式碼 (`services/geminiService.ts` 和 `App.tsx`) 會直接嘗試讀取 `process.env.API_KEY`。對於本地純前端開發，瀏覽器本身無法直接存取您作業系統的環境變數。
        *   **重要**：為了讓本地開發時 `process.env.API_KEY` 能被讀取，您需要在啟動本地伺服器之前，於您使用的**終端機/命令提示字元環境**中設定此變數。這樣，如果您使用的開發工具或伺服器腳本支援將其注入到前端，才有可能成功。然而，對於如 `npx serve .` 這樣的簡單靜態伺服器，它通常不會主動將終端機的環境變數注入到客戶端 JavaScript 的 `process.env` 中。
        *   **如果直接使用 `npx serve .` 或 Python HTTP 伺服器，`process.env.API_KEY` 在前端程式碼中很可能會是 `undefined`**，導致應用程式內出現 API 金鑰遺失的提示。
        *   **一個更可靠的本地測試方法 (但仍需謹慎處理金鑰)**：若要確保本地測試時金鑰可用，您可能需要暫時修改程式碼（例如，在 `index.html` 中用一個 `<script>` 標籤定義 `window.process = { env: { API_KEY: "你的金鑰" } };`），**但切勿將此修改提交到版本控制中**。或者，使用更進階的開發伺服器 (如 Vite, Next.js 開發伺服器) 通常有內建機制處理環境變數。由於目前專案結構簡潔，並未包含這類開發伺服器。
        *   **最佳實踐建議**：對於需要在客戶端使用的 API 金鑰，更安全的方式是透過後端代理，而不是直接在前端程式碼中暴露或依賴 `process.env`。但依照目前專案結構和 Gemini SDK 的指引，我們假設 `process.env.API_KEY` 能在執行時被存取。
    *   **Vercel 部署**：
        *   部署到 Vercel 時，您需要在 Vercel 專案的設定中新增一個名為 `API_KEY` 的環境變數，並將您的金鑰填入其值。Vercel 的平台應該能讓這個環境變數在應用程式執行時被存取到。詳細步驟請參考下方的「部署到 Vercel」章節。

    ⚠️ **安全警告**：請務必妥善保管您的 API 金鑰。**不要將 API 金鑰直接寫在程式碼中並提交到公開的程式碼倉庫 (例如 GitHub)。** 雖然應用程式設計為從 `process.env.API_KEY` 讀取，確保此變數在部署環境中安全設定是您的責任。

## 本地開發與執行

1.  **複製專案** (如果您尚未複製)：
    ```bash
    git clone https://github.com/你的GitHub用戶名/你的專案庫名.git
    cd 你的專案庫名
    ```

2.  **設定 API_KEY 環境變數 (本地測試的挑戰)**：
    如「環境變數設定」章節所述，讓 `process.env.API_KEY` 在純靜態伺服器環境下的客戶端 JavaScript 中可用是個挑戰。如果應用程式啟動後顯示 API Key 遺失，請參考該章節的說明。

3.  **啟動本地伺服器**：
    此專案由一個 `index.html` 檔案和透過 `esm.sh` CDN 載入的 ES Modules 組成（包括 React, @google/genai, 以及您的 `.tsx` 檔案）。您需要一個簡單的 HTTP 伺服器來提供這些檔案。
    *   **使用 `npx serve`** (推薦。如果您的系統中沒有 `serve`，`npx` 會提示您臨時下載並執行它)：
        ```bash
        npx serve .
        ```
        此指令會在當前目錄 (`.`) 啟動一個靜態檔案伺服器。
    *   **或使用 Python 的內建 HTTP 伺服器** (如果您的環境中安裝了 Python)：
        *   Python 3:
            ```bash
            python -m http.server
            ```
        *   Python 2 (較舊版本):
            ```bash
            python -m SimpleHTTPServer
            ```
    *   或者，您也可以使用 VS Code 的 "Live Server" 擴充功能，它能提供一個本地開發伺服器。

4.  **開啟應用程式**：
    伺服器啟動後，通常會在終端機顯示其運行的本地網址 (例如 `http://localhost:3000` for `npx serve`, 或 `http://localhost:8000` for Python's server)。在您的網頁瀏覽器中開啟此網址。

    如果 `API_KEY` 未能成功被應用程式讀取，介面上將會顯示相關的錯誤或提示訊息。

## 部署到 Vercel

您可以輕鬆地將此純靜態資源的應用程式部署到 [Vercel](https://vercel.com/)。

1.  **準備 GitHub 倉庫**：
    *   確保您的專案程式碼已經初始化為 Git 倉庫，並且已推送到一個 GitHub 倉庫。

2.  **在 Vercel 上新增專案**：
    *   登入您的 Vercel 帳戶。
    *   點擊 "Add New..." -> "Project"。
    *   選擇 "Import Git Repository"，然後連接並選擇您在 GitHub 上對應的專案倉庫。

3.  **專案設定**：
    *   **Framework Preset**: Vercel 通常能自動偵測。對於此類型的專案（基於 `index.html` 的靜態網站），如果 Vercel 未能自動識別，您可以選擇 "Other"。
    *   **Build and Output Settings**:
        *   **Build Command**: 此專案沒有傳統的建置步驟 (因為 `esm.sh` 在瀏覽器端處理模組和 TSX/TS 的轉換)。您可以嘗試將此欄位**留空**。如果 Vercel 強制要求一個建置指令，您可以輸入 `echo "No build required."`。
        *   **Output Directory**: 由於您的 `index.html` 位於專案的根目錄，並且所有資源都是相對引用的，此設定通常可以**留空** (Vercel 會預設使用根目錄作為靜態資源的輸出目錄)。
        *   **Install Command**: 可以**留空**，因為目前專案沒有 `package.json` 檔案來定義依賴項的安裝。

4.  **設定環境變數 (關鍵步驟)**：
    *   在 Vercel 專案的儀表板中，導航至 "Settings" -> "Environment Variables"。
    *   新增一個環境變數：
        *   **Name**: `API_KEY`
        *   **Value**: 貼上您從 Google AI Studio 取得的 Gemini API 金鑰。
    *   確保此環境變數可用於所有預期的部署環境 (Production, Preview, Development)。

5.  **部署**：
    *   點擊 "Deploy" 按鈕。Vercel 將會從您的 GitHub 倉庫拉取程式碼，並根據您的設定部署應用程式。
    *   部署完成後，Vercel 會提供您一個公開的應用程式網址。

    部署後，應用程式應該能夠透過 Vercel 注入的環境變數存取到 `API_KEY`，從而正常運作。如果在 Vercel 上遇到 API 金鑰相關的錯誤，請仔細檢查 Vercel 專案設定中的環境變數名稱 (`API_KEY`) 和其值是否正確無誤。

## 檔案結構概覽

```
.
├── components/                 # React UI 元件
│   ├── ChatBubble.tsx          # 聊天氣泡元件
│   ├── InputBar.tsx            # 使用者文字輸入框元件
│   ├── LoadingSpinner.tsx      # 載入中指示動畫元件
│   ├── MoodCharacter.tsx       # 心情角色 (兔子) SVG 動畫元件
│   └── SongCard.tsx            # 推薦歌曲卡片元件
├── services/                   # 服務邏輯 (例如 API 呼叫)
│   └── geminiService.ts        # 封裝與 Google Gemini API 互動的邏輯
├── App.tsx                     # React 應用程式的主要根元件
├── index.html                  # 應用程式的 HTML 入口檔案
├── index.tsx                   # React 應用程式的進入點 (掛載 App 元件)
├── metadata.json               # 應用程式的元數據 (名稱、描述等)
├── types.ts                    # TypeScript 型別定義 (介面、枚舉)
└── README.md                   # 本說明檔案
```

## 未來可能的改進方向

*   **使用 `package.json`**: 新增 `package.json` 檔案來明確管理依賴項 (如 React, @google/genai) 版本，並定義開發/建置腳本。
*   **整合建置工具**: 引入像 [Vite](https://vitejs.dev/) 或 [Parcel](https://parceljs.org/) 這樣的現代前端建置工具。這能提供更佳的開發體驗 (HMR, 更快的冷啟動)、優化後的生產版本打包，以及更標準化、更可靠的環境變數處理機制。
*   **API 金鑰安全**: 為了進一步提升 API 金鑰的安全性，可以考慮建立一個簡單的後端代理 (例如使用 Vercel Serverless Functions)。前端不直接呼叫 Gemini API，而是呼叫您的代理，由代理在後端安全地使用 API 金鑰並轉發請求至 Gemini API。
*   **豐富角色動畫**: 設計更多樣、更流暢的角色 SVG 動畫或甚至引入小型動畫庫。
*   **聊天歷史儲存**: 使用瀏覽器的 LocalStorage 或 SessionStorage 讓使用者在重新整理頁面後仍能看到先前的對話記錄。
*   **錯誤處理增強**: 更細緻地處理 API 錯誤，並提供更友善的使用者提示。

---

希望這份指南能幫助您順利地執行、部署和進一步開發「心情點唱機」專案！祝您玩得開心！😊
