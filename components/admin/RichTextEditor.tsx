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
  FileCode,
  Eye,
  FileText,
  Minus,
  RemoveFormatting,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  HelpCircle,
} from "lucide-react";
import { sanitizePastedHtml, sanitizeSafeUrl } from "@/lib/sanitize";
import { MediaLibraryModal } from "./MediaLibraryModal";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ALIGNABLE_BLOCKS = new Set(["P", "H1", "H2", "H3", "H4", "H5", "H6", "DIV", "BLOCKQUOTE", "LI"]);
const ALIGN_CLASSES = ["text-left", "text-center", "text-right"] as const;

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write detailed content, syllabus, guidelines, or FAQ...",
}: RichTextEditorProps) {
  const [viewMode, setViewMode] = useState<"visual" | "html">("visual");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [tablePopoverOpen, setTablePopoverOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(2);

  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmittedHtmlRef = useRef<string>(value || "");
  const savedRangeRef = useRef<Range | null>(null);

  // Sync value into contentEditable when it changes externally or when switching back to visual mode
  useEffect(() => {
    if (viewMode === "visual" && editorRef.current) {
      const nextHtml = value || "";
      if (
        editorRef.current.innerHTML !== nextHtml &&
        (nextHtml !== lastEmittedHtmlRef.current || editorRef.current.innerHTML === "")
      ) {
        editorRef.current.innerHTML = nextHtml;
        lastEmittedHtmlRef.current = nextHtml;
      }
    }
  }, [value, viewMode]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    // Normalize browser-inserted empty <br> so placeholder shows cleanly when empty
    if (html === "<br>" || html === "<p><br></p>") {
      editorRef.current.innerHTML = "";
      html = "";
    }
    lastEmittedHtmlRef.current = html;
    onChange(html);
  }, [onChange]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      const range = sel.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
        return;
      }
    }
    savedRangeRef.current = null;
  };

  const restoreSelection = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const insertHtmlAtCursor = (html: string) => {
    if (!editorRef.current) return;
    if (viewMode !== "visual") {
      onChange(`${value || ""}\n${html}`);
      return;
    }

    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const template = document.createElement("template");
      template.innerHTML = html;
      const frag = template.content;
      const lastNode = frag.lastChild;
      range.insertNode(frag);
      if (lastNode) {
        const nextRange = document.createRange();
        nextRange.setStartAfter(lastNode);
        nextRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(nextRange);
      }
    } else {
      editorRef.current.insertAdjacentHTML("beforeend", html);
    }
    savedRangeRef.current = null;
    handleInput();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    if (html) {
      const cleaned = sanitizePastedHtml(html);
      insertHtmlAtCursor(cleaned);
    } else if (text) {
      const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\r?\n/g, "<br>");
      insertHtmlAtCursor(escaped);
    }
  };

  const exec = (cmd: string, val: string | undefined = undefined) => {
    if (viewMode !== "visual" || !editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    handleInput();
  };

  const applyAlignment = (alignClass: (typeof ALIGN_CLASSES)[number]) => {
    if (viewMode !== "visual" || !editorRef.current) return;
    editorRef.current.focus();
    const sel = window.getSelection();
    let node: Node | null = sel?.anchorNode || null;
    while (node && node !== editorRef.current) {
      if (node instanceof HTMLElement && ALIGNABLE_BLOCKS.has(node.tagName)) {
        node.classList.remove(...ALIGN_CLASSES);
        if (alignClass !== "text-left") {
          node.classList.add(alignClass);
        }
        handleInput();
        return;
      }
      node = node.parentNode;
    }
  };

  const openLinkPopover = () => {
    if (viewMode !== "visual") return;
    saveSelection();
    const selectedText = window.getSelection()?.toString() || "";
    setLinkText(selectedText);
    setLinkUrl("");
    setLinkError(null);
    setTablePopoverOpen(false);
    setLinkPopoverOpen((prev) => !prev);
  };

  const handleInsertLink = () => {
    const safeUrl = sanitizeSafeUrl(linkUrl, { allowMailtoTel: true, allowHash: true });
    if (!safeUrl) {
      setLinkError("Invalid URL. Only http://, https://, /, #, mailto:, and tel: links are allowed.");
      return;
    }
    const label = linkText.trim() || safeUrl;
    const escapedLabel = label
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const escapedHref = safeUrl.replace(/"/g, "&quot;");
    const isExternal = safeUrl.startsWith("http");
    const relAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    insertHtmlAtCursor(`<a href="${escapedHref}"${relAttrs}>${escapedLabel}</a>`);
    setLinkPopoverOpen(false);
    setLinkUrl("");
    setLinkText("");
    setLinkError(null);
  };

  const handleOpenMediaModal = () => {
    saveSelection();
    setLinkPopoverOpen(false);
    setTablePopoverOpen(false);
    setMediaOpen(true);
  };

  const handleInsertImageFromModal = (url: string) => {
    const safeUrl = sanitizeSafeUrl(url);
    if (!safeUrl) return;
    const escapedSrc = safeUrl.replace(/"/g, "&quot;");
    insertHtmlAtCursor(
      `<p><img src="${escapedSrc}" alt="Article illustration" class="rounded-xl max-w-full h-auto my-3" /></p>`
    );
  };

  const handleInsertTable = () => {
    const cols = Math.min(Math.max(Number(tableCols) || 2, 1), 6);
    const rows = Math.min(Math.max(Number(tableRows) || 2, 1), 12);

    const headerCells = Array.from({ length: cols })
      .map((_, i) => `<th class="p-3 border border-slate-200">Column ${i + 1}</th>`)
      .join("");
    const bodyRows = Array.from({ length: rows })
      .map(
        () =>
          `<tr class="hover:bg-slate-50">${Array.from({ length: cols })
            .map(() => `<td class="p-3 border border-slate-200">Cell</td>`)
            .join("")}</tr>`
      )
      .join("");

    const tableHtml = `<div class="overflow-x-auto my-4"><table class="w-full text-left border-collapse border border-slate-200 text-sm"><thead><tr class="bg-slate-100 text-slate-800 font-bold">${headerCells}</tr></thead><tbody class="divide-y divide-slate-200">${bodyRows}</tbody></table></div><p></p>`;
    insertHtmlAtCursor(tableHtml);
    setTablePopoverOpen(false);
  };

  const insertCodeBlock = () => {
    saveSelection();
    insertHtmlAtCursor(
      `<pre><code>// Enter code or portal steps here</code></pre><p></p>`
    );
  };

  const insertCalloutBlock = () => {
    saveSelection();
    insertHtmlAtCursor(
      `<div class="p-4 rounded-xl bg-sky-50 border border-sky-200 text-slate-800 text-sm my-4"><p><strong>Important Note:</strong> Add key admission guidelines, deadlines, or instructions here.</p></div><p></p>`
    );
  };

  const insertFaqBlock = () => {
    saveSelection();
    insertHtmlAtCursor(
      `<div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 my-3"><h3>Frequently Asked Question?</h3><p>Write a clear, concise answer for students here.</p></div><p></p>`
    );
  };

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-[#009FE3] focus-within:ring-2 focus-within:ring-[#009FE3]/10 transition-all">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-0.5">
          <button
            type="button"
            onClick={() => exec("undo")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("redo")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => exec("bold")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 font-bold disabled:opacity-40 cursor-pointer"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("italic")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 italic disabled:opacity-40 cursor-pointer"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("underline")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 underline disabled:opacity-40 cursor-pointer"
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("strikeThrough")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 line-through disabled:opacity-40 cursor-pointer"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => exec("formatBlock", "<h2>")}
            disabled={viewMode !== "visual"}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/70 flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
            <span>H2</span>
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "<h3>")}
            disabled={viewMode !== "visual"}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/70 flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
            <span>H3</span>
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "<h4>")}
            disabled={viewMode !== "visual"}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/70 flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            title="Heading 4"
          >
            <Heading4 className="w-3.5 h-3.5" />
            <span>H4</span>
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "<p>")}
            disabled={viewMode !== "visual"}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/70 disabled:opacity-40 cursor-pointer"
            title="Paragraph"
          >
            P
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => applyAlignment("text-left")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 disabled:opacity-40 cursor-pointer"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyAlignment("text-center")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 disabled:opacity-40 cursor-pointer"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyAlignment("text-right")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 disabled:opacity-40 cursor-pointer"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => exec("insertUnorderedList")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 disabled:opacity-40 cursor-pointer"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("insertOrderedList")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 disabled:opacity-40 cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "<blockquote>")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 disabled:opacity-40 cursor-pointer"
            title="Quote Block"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("insertHorizontalRule")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 disabled:opacity-40 cursor-pointer"
            title="Divider"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={openLinkPopover}
            disabled={viewMode !== "visual"}
            className={`p-1.5 rounded-lg hover:bg-slate-200/70 disabled:opacity-40 cursor-pointer ${
              linkPopoverOpen ? "bg-sky-100 text-[#009FE3]" : "text-slate-700"
            }`}
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleOpenMediaModal}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 cursor-pointer"
            title="Insert or Upload Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              saveSelection();
              setLinkPopoverOpen(false);
              setTablePopoverOpen((prev) => !prev);
            }}
            className={`p-1.5 rounded-lg hover:bg-slate-200/70 cursor-pointer ${
              tablePopoverOpen ? "bg-sky-100 text-[#009FE3]" : "text-slate-700"
            }`}
            title="Insert Table"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertCodeBlock}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 cursor-pointer"
            title="Insert Code Block"
          >
            <FileCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertCalloutBlock}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/70 flex items-center gap-1 cursor-pointer"
            title="Insert Callout Box"
          >
            <FileText className="w-3.5 h-3.5 text-[#009FE3]" />
            <span className="hidden sm:inline">Callout</span>
          </button>
          <button
            type="button"
            onClick={insertFaqBlock}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/70 flex items-center gap-1 cursor-pointer"
            title="Insert FAQ Item"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">FAQ</span>
          </button>
          <button
            type="button"
            onClick={() => exec("removeFormat")}
            disabled={viewMode !== "visual"}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 disabled:opacity-40 cursor-pointer"
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
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
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
            onClick={() => {
              setLinkPopoverOpen(false);
              setTablePopoverOpen(false);
              setViewMode("html");
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
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

      {/* Inline Link Insertion Popover */}
      {linkPopoverOpen && viewMode === "visual" && (
        <div className="bg-sky-50/70 border-b border-sky-200 px-3 py-2.5 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Link text (optional)"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 outline-none focus:border-[#009FE3] w-40 sm:w-48"
          />
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => {
              setLinkUrl(e.target.value);
              setLinkError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleInsertLink();
              }
            }}
            placeholder="https://... or /ignou-admission"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 outline-none focus:border-[#009FE3] flex-1 min-w-[180px]"
          />
          <button
            type="button"
            onClick={handleInsertLink}
            className="px-3 py-1.5 rounded-lg bg-[#009FE3] text-white text-xs font-bold cursor-pointer hover:bg-[#0086bf]"
          >
            Insert Link
          </button>
          <button
            type="button"
            onClick={() => setLinkPopoverOpen(false)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-50"
          >
            Cancel
          </button>
          {linkError && <p className="w-full text-[11px] text-rose-600 font-medium">{linkError}</p>}
        </div>
      )}

      {/* Inline Table Insertion Popover */}
      {tablePopoverOpen && (
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2.5 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-slate-700">Insert Table:</span>
          <label className="flex items-center gap-1.5 text-slate-600">
            <span>Rows</span>
            <input
              type="number"
              min={1}
              max={12}
              value={tableRows}
              onChange={(e) => setTableRows(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-900"
            />
          </label>
          <label className="flex items-center gap-1.5 text-slate-600">
            <span>Columns</span>
            <input
              type="number"
              min={1}
              max={6}
              value={tableCols}
              onChange={(e) => setTableCols(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-900"
            />
          </label>
          <button
            type="button"
            onClick={handleInsertTable}
            className="px-3 py-1.5 rounded-lg bg-[#009FE3] text-white font-bold cursor-pointer hover:bg-[#0086bf]"
          >
            Insert Table
          </button>
          <button
            type="button"
            onClick={() => setTablePopoverOpen(false)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-semibold cursor-pointer hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor Body */}
      {viewMode === "visual" ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          className="p-4 sm:p-5 min-h-[300px] max-h-[600px] overflow-y-auto outline-none prose prose-slate max-w-none text-slate-900 text-sm leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-[#009FE3] [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-200 [&_th]:p-2 [&_td]:border [&_td]:border-slate-200 [&_td]:p-2"
          data-placeholder={placeholder}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={14}
          placeholder="<div>Raw HTML here...</div>"
          className="w-full p-4 font-mono text-xs bg-slate-900 text-slate-100 min-h-[300px] outline-none"
        />
      )}

      <MediaLibraryModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={handleInsertImageFromModal}
        title="Insert Image into Article"
      />
    </div>
  );
}
