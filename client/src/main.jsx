//HJgYsXCoFa72CQ7E
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux"
import {appStore} from "./app/store.js"
import { Toaster } from "@/components/ui/sonner.jsx"


createRoot(document.getElementById('root')).render(
  <Provider store={appStore}>
    <App />
    <Toaster />
  </Provider>
)
