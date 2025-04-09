import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import {Toaster} from "@/components/ui/sonner.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {UserProvider} from "@/context/UserContext.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <StrictMode>
            <UserProvider>
                <ThemeProvider defaultTheme="dark">
                    <App />
                    <Toaster/>
                </ThemeProvider>
            </UserProvider>
        </StrictMode>
    </BrowserRouter>

)
