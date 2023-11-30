import { Outlet, NavLink, useLoaderData, Form } from "react-router-dom"
import './Messenger.css'


export default function MessengerPage() {
  const chats = useLoaderData() as Array

  return (
    <>
      <div id="sidebar">
        <h1>Chat Histories</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {chats && chats.length ? (
						<ul>
              {chats.map((chat) => (
                <li key={chat.id}>
                  <NavLink to={`/chats/${chat.id}`} className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""}>
                    {chat.first || chat.last ? (
                      <>
                        {chat.first} {chat.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {chat.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
						</ul>
          ) : (
            <p>
              <i>No Chats</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

