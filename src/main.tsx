import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import "@ant-design/v5-patch-for-react-19"

import { persistor, store } from "./app/store"
import { App } from "./App"
import AppLayout from "./components/AppLayout"
import AppConfigProvider from "./components/ConfigProvider"
import UserList from "./features/users/UserList"

import "./index.css"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppConfigProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/products" element={<App />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="*" element={<Navigate to="/products" />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AppConfigProvider>
        </PersistGate>
      </Provider>
    </StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
