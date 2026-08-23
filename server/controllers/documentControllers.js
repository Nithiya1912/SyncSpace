import Document from "../models/Document.js";
import User from "../models/User.js";

// A document is visible to its owner AND anyone listed as a collaborator.
function accessFilter(userId) {
  return { $or: [{ owner: userId }, { "collaborators.user": userId }] };
}

export async function getDocuments(req, res) {
  try {
    const docs = await Document.find(accessFilter(req.user._id))
      .populate("owner", "name email")
      .sort({ updatedAt: -1 });
    res.json({ documents: docs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents", error: err.message });
  }
}

export async function getDocument(req, res) {
  try {
    const doc = await Document.findOne({ _id: req.params.id, ...accessFilter(req.user._id) })
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ document: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch document", error: err.message });
  }
}

export async function createDocument(req, res) {
  try {
    const doc = await Document.create({
      title: "Untitled document",
      content: "",
      owner: req.user._id,
    });
    res.status(201).json({ document: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to create document", error: err.message });
  }
}

export async function updateDocument(req, res) {
  try {
    const { title, content } = req.body;
    const doc = await Document.findOneAndUpdate(
      { _id: req.params.id, ...accessFilter(req.user._id) },
      { ...(title !== undefined && { title }), ...(content !== undefined && { content }) },
      { new: true }
    );
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ document: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to update document", error: err.message });
  }
}

export async function deleteDocument(req, res) {
  try {
    // Only the owner can delete — collaborators can't remove someone else's doc.
    const doc = await Document.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete document", error: err.message });
  }
}

export async function shareDocument(req, res) {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const doc = await Document.findOne({ _id: req.params.id, owner: req.user._id });
    if (!doc) {
      return res.status(404).json({ message: "Document not found, or you're not the owner" });
    }

    const targetUser = await User.findOne({ email: email.toLowerCase() });
    if (!targetUser) {
      return res.status(404).json({ message: "No account found with that email" });
    }

    if (String(targetUser._id) === String(req.user._id)) {
      return res.status(400).json({ message: "You already own this document" });
    }

    const alreadyShared = doc.collaborators.some(
      (c) => String(c.user) === String(targetUser._id)
    );
    if (alreadyShared) {
      return res.status(409).json({ message: "Already shared with this person" });
    }

    doc.collaborators.push({ user: targetUser._id, role: role === "viewer" ? "viewer" : "editor" });
    await doc.save();

    res.json({ message: "Shared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to share document", error: err.message });
  }
}