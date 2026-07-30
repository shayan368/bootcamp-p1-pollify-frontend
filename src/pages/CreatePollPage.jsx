import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, ListChecks, Star, Image as ImageIcon, MessageSquare, Plus, X } from "lucide-react";
import * as pollsApi from "../api/polls";

const CATEGORIES = ["General", "Tech", "Sports", "Entertainment", "Lifestyle", "Other"];

const TYPES = [
  { key: "yesno", label: "Yes / No", icon: HelpCircle },
  { key: "single", label: "Single Choice", icon: ListChecks },
  { key: "rating", label: "Rating", icon: Star },
  { key: "image", label: "Image", icon: ImageIcon },
  { key: "open", label: "Open Ended", icon: MessageSquare },
];

export default function CreatePollPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("General");
  const [type, setType] = useState("yesno");
  const [options, setOptions] = useState([{ text: "" }, { text: "" }]);
  const [optionFiles, setOptionFiles] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const needsOptions = type === "single" || type === "image";

  const updateOption = (i, text) => {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, text } : o)));
  };

  const addOption = () => setOptions((prev) => [...prev, { text: "" }]);

  const removeOption = (i) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
    setOptionFiles((prev) => {
      const next = { ...prev };
      delete next[i];
      return next;
    });
  };

  const handleOptionImage = (i, file) => {
    setOptionFiles((prev) => ({ ...prev, [i]: file }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // pair each option with its original file (if any) BEFORE filtering, so removing
    // an empty option in the middle doesn't shift a later option's image onto it
    const paired = options
      .map((o, originalIndex) => ({ text: o.text.trim(), file: optionFiles[originalIndex] }))
      .filter((o) => o.text);

    if (!question.trim()) return setError("Write a question first");
    if (needsOptions) {
      if (paired.length < 2) return setError("Provide at least 2 options");
      if (type === "image" && paired.some((o) => !o.file)) {
        return setError("Add an image for every option");
      }
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("question", question.trim());
      fd.append("type", type);
      fd.append("category", category);

      if (needsOptions) {
        fd.append("options", JSON.stringify(paired.map((o) => ({ text: o.text }))));
        if (type === "image") {
          paired.forEach((o, i) => {
            if (o.file) fd.append(`option_${i}`, o.file);
          });
        }
      }

      const { data } = await pollsApi.createPoll(fd);
      navigate(`/poll/${data.poll.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't publish the poll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-5 text-2xl font-bold text-white">Create a poll</h1>

      <form onSubmit={submit} className="flex flex-col gap-5 rounded-2xl border border-neutral-900 bg-neutral-950 p-6">
        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Question
          </span>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What do you want to ask the community?"
            rows={3}
            className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Poll type
          </span>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setType(key)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition ${
                  type === key
                    ? "bg-emerald-500 text-black"
                    : "border border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {needsOptions && (
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Options</span>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={opt.text}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-emerald-500"
                />
                {type === "image" && (
                  <label className="cursor-pointer rounded-lg border border-neutral-800 px-3 py-2 text-xs text-neutral-400 hover:text-white">
                    {optionFiles[i] ? "✓ Image" : "Add image"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={(e) => handleOptionImage(i, e.target.files?.[0])}
                    />
                  </label>
                )}
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(i)} className="text-neutral-600 hover:text-red-400">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="flex w-fit items-center gap-1.5 text-xs font-medium text-emerald-400 hover:underline"
            >
              <Plus size={14} /> Add option
            </button>
          </div>
        )}

        {type === "rating" && (
          <p className="text-xs text-neutral-500">Voters will rate this from 1 to 5 stars.</p>
        )}
        {type === "open" && (
          <p className="text-xs text-neutral-500">Voters will type a free-text answer.</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish poll"}
        </button>
      </form>
    </div>
  );
}
