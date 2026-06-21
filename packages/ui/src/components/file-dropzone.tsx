"use client";

import { UploadCloud } from "lucide-react";
import {
  type DragEvent,
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

export interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export const FileDropzone = forwardRef<HTMLDivElement, FileDropzoneProps>(
  ({ onFiles, accept, multiple = false, disabled = false, className, children }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const emit = (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      onFiles(Array.from(fileList));
    };

    const openPicker = () => {
      if (disabled) return;
      inputRef.current?.click();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPicker();
      }
    };

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      setDragging(true);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      setDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragging(false);
      if (disabled) return;
      emit(event.dataTransfer.files);
    };

    return (
      // biome-ignore lint/a11y/useSemanticElements: a native <button> can't host the nested file input + full drag-and-drop affordance; role=button with keyboard handlers gives equivalent semantics.
      <div
        ref={ref}
        data-slot="file-dropzone"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        data-dragging={dragging}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-inset px-6 py-10 text-center text-sm text-fg-secondary transition-colors hover:border-border-strong data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5 disabled:opacity-50 disabled:pointer-events-none",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            emit(event.target.files);
            event.target.value = "";
          }}
        />
        {children ?? (
          <>
            <UploadCloud className="size-6 text-fg-muted" aria-hidden />
            <span>
              Drag &amp; drop or <span className="font-medium text-fg">browse</span>
            </span>
          </>
        )}
      </div>
    );
  },
);
FileDropzone.displayName = "FileDropzone";
