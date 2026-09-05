import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import AppShell from "../../components/common/AppShell";
import { fetchDocument, updateDocument, shareDocument } from "../../services/documentService";
import { getSocket } from "../../services/socket";

const AVATAR_COLORS = ["#2563eb", "#db2777", "#059669", "#d97706", "#7c3aed"];

export default function Editor() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const isTypingRef = useRef(false);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [error, setError] = useState("");
  const saveTimer = useRef(null);

  const [showShare, setShowShare] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState("editor");
  const [shareMsg, setShareMsg] = useState("");
  const [sharing, setSharing] = useState(false);

  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (docId === "new") {
      navigate("/dashboard");
      return;
    }
    fetchDocument(docId)
      .then((doc) => {
        setTitle(doc.title);
        if (editorRef.current) editorRef.current.innerHTML = doc.content || "";
      })
      .catch((err) => setError(err.message || "Failed to load document"))
      .finally(() => setLoading(false));
  }, [docId, navigate]);

  useEffect(() => {
    if (docId === "new") return;
    const socket = getSocket();
    socket.emit("join-document", docId);

    function handleRemoteChange({ title: remoteTitle, content: remoteContent }) {
      if (remoteTitle !== undefined) setTitle(remoteTitle);
      // Don't overwrite the editor while the local user is actively typing —
      // that would jump their cursor around mid-keystroke.
      if (remoteContent !== undefined && !isTypingRef.current && editorRef.current) {
        editorRef.current.innerHTML = remoteContent;
      }
    }

    function handlePresence(users) {
      setActiveUsers(users);
    }

    socket.on("document-change", handleRemoteChange);
    socket.on("presence-update", handlePresence);

    return () => {
      socket.emit("leave-document", docId);
      socket.off("document-change", handleRemoteChange);
      socket.off("presence-update", handlePresence);
    };
  }, [docId]);

  const scheduleSave = useCallback(
    (nextTitle, nextContent) => {
      setSaveStatus("saving");
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await updateDocument(docId, { title: nextTitle, content: nextContent });
          setSaveStatus("saved");
        } catch (err) {
          setError(err.message || "Failed to save");
          setSaveStatus("");
        } finally {
          isTypingRef.current = false;
        }
      }, 800);
    },
    [docId]
  );

  function handleTitleChange(e) {
    const value = e.target.value;
    setTitle(value);
    getSocket().emit("document-change", { docId, title: value });
    scheduleSave(value, editorRef.current?.innerHTML || "");
  }

  function handleEditorInput() {
    isTypingRef.current = true;
    const html = editorRef.current.innerHTML;
    getSocket().emit("document-change", { docId, content: html });
    scheduleSave(title, html);
  }

  // Formatting commands — execCommand is deprecated but still the simplest,
  // widely-supported way to do rich text formatting without a heavy library.
  function format(command, value = null) {
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  }

  async function handleShare(e) {
    e.preventDefault();
    setShareMsg("");
    if (!shareEmail.trim()) return;

    setSharing(true);
    try {
      await shareDocument(docId, shareEmail.trim(), shareRole);
      setShareMsg(`Shared with ${shareEmail} as ${shareRole}`);
      setShareEmail("");
    } catch (err) {
      setShareMsg(err.message || "Failed to share");
    } finally {
      setSharing(false);
    }
  }

  function initials(name) {
    return (name || "?")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  const toolbarBtn = {
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 8,
    width: 34,
    height: 34,
    cursor: "pointer",
    fontSize: 14,
    color: "#0f172a",
  };

  if (loading) {
    return (
      <AppShell title="Loading…">
        <p className="text-muted">Loading document…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="">
      {error && <div style={{ color: "#b91c1c", marginBottom: 12, fontSize: 14 }}>{error}</div>}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 12 }}>
        <input
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled document"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            fontSize: 20,
            fontWeight: 600,
            outline: "none",
            flex: 1,
            background: "#f8fafc",
            padding: "10px 14px",
            color: "#0f172a",
          }}
        />
        <button onClick={() => setShowShare((s) => !s)} className="app-btn app-btn-outline" style={{ whiteSpace: "nowrap" }}>
          Share
        </button>
        <span className="text-muted" style={{ whiteSpace: "nowrap" }}>
          {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : ""}
        </span>
      </div>

      {activeUsers.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span className="text-muted" style={{ fontSize: 13 }}>Currently viewing:</span>
          <div style={{ display: "flex" }}>
            {activeUsers.map((u, i) => (
              <div
                key={u.id + i}
                title={u.name}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, border: "2px solid #fff", marginLeft: i === 0 ? 0 : -8,
                }}
              >
                {initials(u.name)}
              </div>
            ))}
          </div>
        </div>
      )}

      {showShare && (
        <form
          onSubmit={handleShare}
          style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, padding: 14, background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12, flexWrap: "wrap" }}
        >
          <input
            type="email"
            placeholder="Person's email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: "8px 12px", border: "1px solid #dbe3ef", borderRadius: 8, color: "#0f172a" }}
          />
          <select value={shareRole} onChange={(e) => setShareRole(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #dbe3ef", borderRadius: 8 }}>
            <option value="editor">Can edit</option>
            <option value="viewer">Can view</option>
          </select>
          <button type="submit" className="app-btn app-btn-primary" disabled={sharing}>
            {sharing ? "Sharing…" : "Share"}
          </button>
          {shareMsg && <span className="text-muted" style={{ width: "100%" }}>{shareMsg}</span>}
        </form>
      )}

      {/* Formatting toolbar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <button type="button" style={{ ...toolbarBtn, fontWeight: 700 }} onClick={() => format("bold")} title="Bold">B</button>
        <button type="button" style={{ ...toolbarBtn, fontStyle: "italic" }} onClick={() => format("italic")} title="Italic">I</button>
        <button type="button" style={{ ...toolbarBtn, textDecoration: "underline" }} onClick={() => format("underline")} title="Underline">U</button>
        <button type="button" style={toolbarBtn} onClick={() => format("formatBlock", "H1")} title="Heading 1">H1</button>
        <button type="button" style={toolbarBtn} onClick={() => format("formatBlock", "H2")} title="Heading 2">H2</button>
        <button type="button" style={toolbarBtn} onClick={() => format("formatBlock", "P")} title="Paragraph">¶</button>
        <button type="button" style={toolbarBtn} onClick={() => format("insertUnorderedList")} title="Bullet list">• List</button>
        <button type="button" style={toolbarBtn} onClick={() => format("insertOrderedList")} title="Numbered list">1. List</button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleEditorInput}
        onBlur={() => { isTypingRef.current = false; }}
        suppressContentEditableWarning
        style={{
          width: "100%",
          minHeight: "60vh",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 20,
          fontSize: 15,
          lineHeight: 1.6,
          color: "#0f172a",
          background: "#fff",
          outline: "none",
        }}
      />
    </AppShell>
  );
}