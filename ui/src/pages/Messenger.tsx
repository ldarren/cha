import { Outlet, NavLink, Form, useLoaderData, useNavigation, useSubmit } from "react-router-dom"
import './Messenger.css'


export default function MessengerPage() {
  const {q, chats} = useLoaderData()
	const navigate = useNavigation()
	const submitFunc = useSubmit()
  const searching = window.location && !(new URLSearchParams(window.location.search).get("q"))

  return (
    <>
      <div id="sidebar">
        <h1>Chat Histories</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
							className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
							defaultValue={q}
							onChange={(e) => {
								const isFirstSearch = q == null
								submitFunc(e.currentTarget.form, {
									replace: !isFirstSearch
								})
							}}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
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
      <div
				id="detail"
				className={navigate.state === 'loading' ? 'loading' : undefined}
			>
        <Outlet />
      </div>
    </>
  );
}

