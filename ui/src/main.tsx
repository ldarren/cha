import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  LoaderFunction,
  ActionFunction,
  RouterProvider,
  redirect,
} from "react-router-dom"
import App from './App.tsx'
import {UserSessionProvider} from "./hooks/userSession"
import Loading from './components/Loading'
import LoginPage from "./pages/Login"
import TermsPage from "./pages/Terms"
import ErrorPage from "./pages/Error"
import IndexPane from "./panes/Index"
import MessengerPage from "./pages/Messenger"
import ChatPane from "./panes/Chat"
import ChatEditPane from "./panes/ChatEdit"
import './index.css'

const origin = import.meta.env.VITE_BACKEND_ORIGIN

const listLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams.get("q") || ''
  const res = await fetch(`${origin}/api/chats?q=${q}`)
  const chats = await res.json()
  return {q, chats}
}

const readLoader: LoaderFunction = async ({ params }) => {
  const res = await fetch(`${origin}/api/chats/${params.chatId}/meta`)
  return await res.json()
}

const createAction: ActionFunction = async () => {
  const res = await fetch(`${origin}/api/chats`, {
    method: 'POST',
    body: '{}'
  })
  const chat = await res.json()
  return redirect(`/chats/${chat.id}/edit`)
}

const updateAction: ActionFunction = async ({request, params}) => {
  const formData = await request.formData()
  const updates = Object.fromEntries(formData)

  await fetch(`${origin}/api/chats/${params.chatId}/meta`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(updates)
  })
  return redirect(`/chats/${params.chatId}`)
}

const favoriteAction: ActionFunction = async ({request, params}) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData)
  await fetch(`${origin}/api/chats/${params.chatId}/favorite`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(updates)
  })
}

const deleteAction: ActionFunction = async ({ params }) => {
  await fetch(`${origin}/api/chats/${params.chatId}/meta`, {
    method: 'DELETE',
  })
  return redirect("/chats")
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage/>,
    errorElement: <ErrorPage />,
  },{
    path: "/terms",
    element: <TermsPage/>,
    errorElement: <ErrorPage />,
  },{
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
        loader: listLoader,
        action: createAction,
        children: [
          {
            errorElement: <ErrorPage />,
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
                loader: readLoader,
                action: favoriteAction,
              },
              {
                path: ":chatId/edit",
                element: <ChatEditPane/>,
                errorElement: <ErrorPage />,
                loader: readLoader,
                action: updateAction,
              },
              {
                path: ":chatId/destroy",
                action: deleteAction,
                errorElement: <div>Oops! there was an error.</div>
              },
            ]
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserSessionProvider>
      <Loading/>
      <RouterProvider router={router} />
    </UserSessionProvider>
  </React.StrictMode>,
)