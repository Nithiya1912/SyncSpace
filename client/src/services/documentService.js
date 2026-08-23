import { apiRequest } from "./api";

export async function fetchDocuments() {
  const data = await apiRequest("/documents");
  return data.documents;
}

export async function fetchDocument(id) {
  const data = await apiRequest(`/documents/${id}`);
  return data.document;
}

export async function createDocument() {
  const data = await apiRequest("/documents", { method: "POST" });
  return data.document;
}

export async function updateDocument(id, updates) {
  const data = await apiRequest(`/documents/${id}`, { method: "PUT", body: updates });
  return data.document;
}

export async function deleteDocument(id) {
  await apiRequest(`/documents/${id}`, { method: "DELETE" });
}

export async function shareDocument(id, email, role) {
  const data = await apiRequest(`/documents/${id}/share`, {
    method: "POST",
    body: { email, role },
  });
  return data;
}