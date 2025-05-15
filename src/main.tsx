import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { Provider } from "react-redux"
import "@ant-design/v5-patch-for-react-19"

import { App } from "./App"
import { store } from "./app/store"
import "./index.css"
import { ConfigProvider, theme } from "antd"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <StrictMode>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </ConfigProvider>
      </Provider>
    </StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
