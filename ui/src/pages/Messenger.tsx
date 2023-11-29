import { Outlet, NavLink } from "react-router-dom"
import './Messenger.css'

export default function MessengerPage() {
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
          <form method="post">
            <button type="submit">New</button>
          </form>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to={`/chats/1`}>Your Name</NavLink>
            </li>
            <li>
              <NavLink to={`/chats/2`}>Your Friend</NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

