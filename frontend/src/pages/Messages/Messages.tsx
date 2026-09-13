import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import messageService from "../../services/messageService";
import type { Message as MsgType } from "../../types/message";
import "./Messages.css";

interface ConversationUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Conversation {
  user: ConversationUser;
  last_message?: MsgType;
  unread_count: number;
}

const Messages: React.FC = () => {
  const { user } = useAuth();

  // =========================
  // STATES
  // =========================

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeUser, setActiveUser] =
    useState<ConversationUser | null>(null);

  const [messages, setMessages] = useState<MsgType[]>([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] =
    useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Search
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<
    ConversationUser[]
  >([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // =========================
  // HELPERS
  // =========================

  const getFullName = (person: ConversationUser) =>
    `${person.firstName} ${person.lastName}`.trim();

  const getInitials = (person: ConversationUser) => {
    const first = person.firstName?.charAt(0) || "";
    const last = person.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase() || "?";
  };

  const getRoleLabel = (role: string) => {
    const normalized = role.toLowerCase();

    if (normalized === "freelancer") return "Freelancer";
    if (normalized === "client") return "Client";

    return role;
  };

  // =========================
  // SCROLL TO LAST MESSAGE
  // =========================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================
  // SEARCH USERS
  // =========================

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setSearchingUsers(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingUsers(true);

      try {
        const results = await messageService.searchUsers(query);

        setSearchResults(results);
      } catch (err) {
        console.error("Unable to search users:", err);
        setSearchResults([]);
      } finally {
        setSearchingUsers(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================
  // LOAD CONVERSATIONS
  // =========================

  useEffect(() => {
    const loadConversations = async () => {
      setLoadingConversations(true);
      setError(null);

      try {
        const data = await messageService.getConversations();

        setConversations(data);
      } catch (err: any) {
        setError(
          err?.message || "Unable to load your conversations."
        );
      } finally {
        setLoadingConversations(false);
      }
    };

    if (user) {
      loadConversations();
    }
  }, [user]);

  // =========================
  // LOAD SELECTED CONVERSATION
  // =========================


  const loadConversation = async (person: ConversationUser) => {
  setActiveUser(person);
  setLoading(true);
  setError(null);
  setMessages([]);

  try {
    // Charger les messages
    const data = await messageService.getConversation(
      String(person.id)
    );

    setMessages(data);

    // Marquer les messages reçus comme lus dans la base de données
    await messageService.markConversationAsRead(
      String(person.id)
    );

    // Mettre le compteur à zéro dans l'interface
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.user.id === person.id
          ? {
              ...conversation,
              unread_count: 0,
            }
          : conversation
      )
    );
  } catch (err: any) {
    setError(
      err?.message || "Unable to load this conversation."
    );
  } finally {
    setLoading(false);
  }
 };


  // =========================
  // SEND MESSAGE
  // =========================

  const handleSend = async () => {
    const messageText = text.trim();

    if (!activeUser) {
      setError("Please select a conversation first.");
      return;
    }

    if (!messageText) return;

    setSending(true);
    setError(null);

    try {
      const msg = await messageService.sendMessage(
        String(activeUser.id),
        messageText
      );

      // Add message to current conversation
      setMessages((prev) => [...prev, msg]);

      // Clear textarea
      setText("");

      // Update conversation preview
      setConversations((prev) => {
        const existingConversation = prev.find(
          (conversation) =>
            conversation.user.id === activeUser.id
        );

        if (existingConversation) {
          return prev.map((conversation) =>
            conversation.user.id === activeUser.id
              ? {
                  ...conversation,
                  last_message: msg,
                  unread_count: 0,
                }
              : conversation
          );
        }

        // If this is a new conversation,
        // add it to the beginning of the list.
        return [
          {
            user: activeUser,
            last_message: msg,
            unread_count: 0,
          },
          ...prev,
        ];
      });
    } catch (err: any) {
      setError(
        err?.message || "Unable to send the message."
      );
    } finally {
      setSending(false);
    }
  };

  // =========================
  // ENTER TO SEND
  // =========================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // =========================
  // CLOSE CONVERSATION
  // =========================

  const handleCloseConversation = () => {
    setActiveUser(null);
    setMessages([]);
    setText("");
    setError(null);
  };

  // =========================
  // FILTER CONVERSATIONS
  // =========================

  const filteredConversations = conversations.filter(
    (conversation) => {
      const name = getFullName(
        conversation.user
      ).toLowerCase();

      const role =
        conversation.user.role.toLowerCase();

      const query = search.toLowerCase();

      return (
        name.includes(query) ||
        role.includes(query)
      );
    }
  );

  // =========================
  // LOGIN CHECK
  // =========================

  if (!user) {
    return (
      <div className="messages-page">
        <div className="messages-login-state">
          <div className="messages-login-icon">🔒</div>

          <h2>Please log in</h2>

          <p>
            You need to be logged in to access your messages.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="messages-page">
      <div className="messages-container">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="messages-page-header">
          <div>
            <span className="messages-label">
              COMMUNICATION
            </span>

            <h1>Messages</h1>

            <p>
              Stay connected with clients and freelancers.
            </p>
          </div>
        </div>

        {/* =========================
            MESSAGES CARD
        ========================= */}

        <div className="messages-card">

          {/* =========================
              SIDEBAR
          ========================= */}

          <aside className="messages-sidebar">

            {/* SIDEBAR HEADER */}

            <div className="messages-sidebar-header">
              <div>
                <h2>Conversations</h2>

                <span>
                  {activeUser
                    ? "Active conversation"
                    : "Your recent conversations"}
                </span>
              </div>
            </div>

            {/* =========================
                SEARCH
            ========================= */}

            <div className="messages-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search clients or freelancers..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            {/* =========================
                SEARCH RESULTS
            ========================= */}

            {search.trim().length >= 2 && (
              <div className="user-search-results">

                {searchingUsers ? (
                  <div className="user-search-status">
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="user-search-status">
                    No users found.
                  </div>
                ) : (
                  <>
                    <div className="search-results-title">
                      People
                    </div>

                    {searchResults.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        className="user-search-item"
                        onClick={() => {
                          setSearch("");
                          setSearchResults([]);

                          loadConversation(person);
                        }}
                      >
                        <div className="conversation-avatar">
                          {getInitials(person)}
                        </div>

                        <div className="conversation-info">
                          <strong>
                            {getFullName(person)}
                          </strong>

                          <span>
                            {getRoleLabel(person.role)}
                          </span>
                        </div>

                        <span className="user-search-action">
                          Message
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* =========================
                CONVERSATIONS LIST
            ========================= */}

            <div className="conversations-list">

              {loadingConversations ? (
                <div className="empty-conversations">
                  <p>Loading conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="empty-conversations">

                  <div className="empty-conversations-icon">
                    💬
                  </div>

                  <h3>No conversations yet</h3>

                  <p>
                    Your conversations with clients and
                    freelancers will appear here.
                  </p>

                </div>
              ) : (
                filteredConversations.map(
                  (conversation) => {
                    const person =
                      conversation.user;

                    const isActive =
                      activeUser?.id === person.id;

                    return (
                      <button
                        key={person.id}
                        type="button"
                        className={`conversation-item ${
                          isActive ? "active" : ""
                        }`}
                        onClick={() =>
                          loadConversation(person)
                        }
                      >

                        {/* AVATAR */}

                        <div className="conversation-avatar">
                          {getInitials(person)}
                        </div>

                        {/* USER INFO */}

                        <div className="conversation-info">

                          <strong>
                            {getFullName(person)}
                          </strong>

                          <span>
                            {getRoleLabel(person.role)}
                          </span>

                          {conversation.last_message && (
                            <small>
                              {
                                conversation
                                  .last_message
                                  .content
                              }
                            </small>
                          )}

                        </div>

                        {/* UNREAD COUNT */}

                        {conversation.unread_count > 0 && (
                          <span className="conversation-unread">
                            {conversation.unread_count}
                          </span>
                        )}

                        {/* ARROW */}

                        <span className="conversation-arrow">
                          →
                        </span>

                      </button>
                    );
                  }
                )
              )}

            </div>
          </aside>

          {/* =========================
              CHAT AREA
          ========================= */}

          <section className="chat-area">

            {!activeUser ? (

              /* EMPTY CHAT */

              <div className="chat-empty">

                <div className="chat-empty-icon">
                  💬
                </div>

                <h2>
                  Select a conversation
                </h2>

                <p>
                  Choose a client or freelancer from your
                  conversations to start messaging.
                </p>

              </div>

            ) : (

              /* ACTIVE CHAT */

              <>

                {/* =========================
                    CHAT HEADER
                ========================= */}

                <div className="chat-header">

                  <div className="chat-user">

                    <div className="chat-avatar">
                      {getInitials(activeUser)}
                    </div>

                    <div>

                      <strong>
                        {getFullName(activeUser)}
                      </strong>

                      <span>
                        {getRoleLabel(
                          activeUser.role
                        )}
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="close-conversation"
                    onClick={handleCloseConversation}
                    aria-label="Close conversation"
                  >
                    ×
                  </button>

                </div>

                {/* =========================
                    ERROR
                ========================= */}

                {error && (
                  <div className="message-error">

                    <span>!</span>

                    {error}

                  </div>
                )}

                {/* =========================
                    MESSAGES
                ========================= */}

                <div className="chat-messages">

                  {loading ? (

                    <div className="chat-loading">

                      <div className="loading-spinner" />

                      <span>
                        Loading conversation...
                      </span>

                    </div>

                  ) : messages.length === 0 ? (

                    <div className="no-messages">

                      <div className="no-messages-icon">
                        ✉
                      </div>

                      <h3>
                        No messages yet
                      </h3>

                      <p>
                        Start the conversation by sending
                        a message below.
                      </p>

                    </div>

                  ) : (

                    messages.map((message) => {

                      const isMine =
                        String(message.senderId) ===
                        String(user.id);

                      return (
                        <div
                          key={message.id}
                          className={`message-row ${
                            isMine
                              ? "message-row-mine"
                              : "message-row-theirs"
                          }`}
                        >

                          {!isMine && (
                            <div className="message-avatar">
                              {getInitials(
                                activeUser
                              )}
                            </div>
                          )}

                          <div
                            className={`message-bubble ${
                              isMine
                                ? "message-bubble-mine"
                                : "message-bubble-theirs"
                            }`}
                          >

                            <p>
                              {message.content}
                            </p>

                            <span>
                              {new Date(
                                message.createdAt
                              ).toLocaleString([], {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </span>

                          </div>

                        </div>
                      );
                    })
                  )}

                  <div ref={messagesEndRef} />

                </div>

                {/* =========================
                    MESSAGE COMPOSER
                ========================= */}

                <div className="message-composer">

                  <textarea
                    value={text}
                    onChange={(event) =>
                      setText(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message..."
                    rows={1}
                    disabled={sending}
                  />

                  <button
                    type="button"
                    className="send-message-button"
                    onClick={handleSend}
                    disabled={
                      sending ||
                      !text.trim()
                    }
                  >
                    {sending ? (
                      <span className="send-loading">
                        ...
                      </span>
                    ) : (
                      <>
                        <span>Send</span>
                        <span>➤</span>
                      </>
                    )}
                  </button>

                </div>

                {/* HINT */}

                <div className="composer-hint">
                  Press Enter to send · Shift + Enter for
                  a new line
                </div>

              </>
            )}

          </section>
        </div>
      </div>
    </div>
  );
};

export default Messages;
