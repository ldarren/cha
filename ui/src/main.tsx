import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  LoaderFunction,
  RouterProvider,
  redirect,
} from "react-router-dom"
import {getChats, getChat, createChat, updateChat, deleteChat} from './mock/chats'
import App from './App.tsx'
import ErrorPage from "./pages/Error"
import IndexPane from "./panes/Index"
import MessengerPage from "./pages/Messenger"
import ChatPane from "./panes/Chat"
import ChatEditPane from "./panes/ChatEdit"
import './index.css'

const list: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams.get("q")
  const chats = await getChats(q)
  return {q, chats}
}

const read: LoaderFunction = async ({ params }) => {
  const chat = await getChat(params.chatId)
  if (!chat) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return chat
}

async function createAction() {
	const chat = await createChat()
  return redirect(`/chats/${chat.id}/edit`)
}

async function updateAction({request, params}) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateChat(params.chatId, updates);
  return redirect(`/chats/${params.chatId}`)
}

async function favoriteAction({ request, params }) {
  const formData = await request.formData();
  return updateChat(params.chatId, {
    favorite: formData.get("favorite") === "true",
  });
}

async function deleteAction({ params }) {
  await deleteChat(params.chatId)
  return redirect("/chats")
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
        loader: list,
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
                loader: read,
                action: favoriteAction,
              },
              {
                path: ":chatId/edit",
                element: <ChatEditPane/>,
                errorElement: <ErrorPage />,
                loader: read,
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
    <RouterProvider router={router} />
  </React.StrictMode>,
)