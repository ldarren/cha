import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  LoaderFunction,
  RouterProvider,
} from "react-router-dom"
import App from './App.tsx'
import ErrorPage from "./pages/Error"
import IndexPane from "./panes/Index"
import MessengerPage from "./pages/Messenger"
import ChatPane from "./panes/Chat"
import './index.css'

const loader: LoaderFunction = ({ params }) => {
  return {
    first: "Your " + params.chatId,
    last: "Name",
    avatar: "https://placekitten.com/g/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <IndexPane />,
      },
      {
        path: "chats",
        element: <MessengerPage />,
        children: [
          {
            index: true,
            element: <IndexPane/>,
            errorElement: <ErrorPage />,
          },
          {
            path: ":chatId",
            element: <ChatPane/>,
            errorElement: <ErrorPage />,
            loader: loader
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)