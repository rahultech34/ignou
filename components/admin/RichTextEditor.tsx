"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Eye,
  FileText,
  Minus,
  RemoveFormatting,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function cleanPastedHtml(html: string): string {
  if (!html) return "";
  try {
    return html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/class="[^"]*"/gi, "")
      .replace(/style="[^"]*"/gi, "")
      .replace(/&nbsp;/gi, " ");
  } catch {
    return html;
  }
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write detailed content, syllabus, guidelines, or FAQ...",
}: RichTextEditorProps) {
  const [viewMode, setViewMode] = useState<"visual" | "html">("visual");
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync value into contentEditable when it changes externally
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [onChange]);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    if (html) {
      const cleaned = cleanPastedHtml(html);
      document.execCommand("insertHTML", false, cleaned);
    } else {
      document.execCommand("insertText", false, text);
    }
    handleInput();
  };

  const exec = (cmd: string, val: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(cmd, false, val);
    handleInput();
  };

  const insertLink = () => {
    const url = prompt("Enter hyperlink URL (https://...):");
    if (url) {
      exec("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL (https://... or /uploads/...):");
    if (url) {
      exec("insertImage", url);
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-[#009FE3] focus-within:ring-2 focus-within:ring-[#009FE3]/10 transition-all">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-1">
        <div className="flex flex-wrap items-center gap-0.5">
          <button
            type="button"
            onClick={() => exec("undo")}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 transition-colors"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("redo")}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 transition-colors"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => exec("bold")}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 font-bold"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("italic")}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 italic"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("underline")}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 underline"
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("strikeThrough")}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 line-through"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => exec("formatBlock", "<h2>")}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/70 flex items-center gap-1"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
            <span>H2</span>
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "<h3>")}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/70 flex items-center gap-1"
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
            <span>H3</span>
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "<h4>")}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/70 flex items-center gap-1"
            title="Heading 4"
          >
            <Heading4 className="w-3.5 h-3.5" />
            <span>H4</span>
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "<p>")}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/70"
            title="Paragraph"
          >
            P
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => exec("insertUnorderedList")}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("insertOrderedList")}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "<blockquote>")}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70"
            title="Quote Block"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("insertHorizontalRule")}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70"
            title="Divider"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={insertLink}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70"
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("removeFormat")}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Visual vs Raw HTML Toggle */}
        <div className="flex items-center gap-1 border border-slate-200 bg-white rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("visual")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
              viewMode === "visual"
                ? "bg-[#009FE3] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("html")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
              viewMode === "html"
                ? "bg-[#009FE3] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code className="w-3 h-3" />
            <span>HTML</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {viewMode === "visual" ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          className="p-4 sm:p-5 min-h-[300px] max-h-[600px] overflow-y-auto outline-none prose prose-slate max-w-none text-slate-900 text-sm leading-relaxed"
          data-placeholder={placeholder}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={14}
          placeholder="<div>Raw HTML here...</div>"
          className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 min-h-[300px] outline-none"
        />
      )}
    </div>
  );
}
