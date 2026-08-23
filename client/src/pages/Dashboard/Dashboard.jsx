import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/common/AppShell";
import { fetchDocuments, createDocument, deleteDocument } from "../../services/documentService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setCreating(true);
    try {
      const doc = await createDocument();
      navigate(`/editor/${doc._id}`);
    } catch (err) {
      setError(err.message || "Failed to create document");
      setCreating(false);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation(); // don't trigger the card's onClick
    if (!window.confirm("Delete this document?")) return;
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete document");
    }
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <AppShell title="Your Documents">
      {error && (
        <div style={{ color: "#b91c1c", marginBottom: 16, fontSize: 14 }}>{error}</div>
      )}

      <button className="app-btn app-btn-primary" onClick={handleCreate} disabled={creating}>
        {creating ? "Creating…" : "+ New Document"}
      </button>

      {loading ? (
        <p className="text-muted" style={{ marginTop: 20 }}>Loading documents…</p>
      ) : documents.length === 0 ? (
        <p className="text-muted" style={{ marginTop: 20 }}>
          No documents yet. Create your first one!
        </p>
      ) : (
        <div className="app-grid" style={{ marginTop: 20 }}>
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="app-card"
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => navigate(`/editor/${doc._id}`)}
            >
              <strong>{doc.title || "Untitled document"}</strong>
              <p className="text-muted" style={{ marginTop: 6 }}>
                Edited {formatDate(doc.updatedAt)}
              </p>
              <button
                onClick={(e) => handleDelete(doc._id, e)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  border: "none",
                  background: "transparent",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}