import Feedback from "../models/feedbackModel.js";

export async function submitFeedback(req, res) {
  try {
    const { name, email, feedback } = req.body;

    if (!feedback || feedback.trim() === "") {
      return res.status(400).json({ error: "Feedback cannot be empty" });
    }

    await Feedback.create({
      name,
      email,
      feedback,
    });

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
}
