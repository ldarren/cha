import { Form, useLoaderData, useNavigate } from "react-router-dom";

export default function EditChat() {
  const chat = useLoaderData()
  const navigateFunc = useNavigate()

  return (
    <Form method="post" id="chat-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={chat.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={chat.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={chat.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={chat.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={chat.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
            type="button"
            onClick={() => navigateFunc(-1)}
        >
            Cancel
        </button>
      </p>
    </Form>
  );
}