'use client';

import { type Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Bold,
	Italic,
	Strikethrough,
	Code,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Quote,
	Undo,
	Redo,
	Link as LinkIcon,
} from 'lucide-react';

interface EditorToolbarProps {
	editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
	const setLink = () => {
		const url = window.prompt('Enter URL:');
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		}
	};

	return (
		<div className="border-b p-2 flex flex-wrap items-center gap-1 bg-gray-50">
			{/* Text formatting */}
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={editor.isActive('bold') ? 'bg-gray-200' : ''}
				title="Bold (Cmd+B)"
			>
				<Bold className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={editor.isActive('italic') ? 'bg-gray-200' : ''}
				title="Italic (Cmd+I)"
			>
				<Italic className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={editor.isActive('strike') ? 'bg-gray-200' : ''}
				title="Strikethrough"
			>
				<Strikethrough className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleCode().run()}
				className={editor.isActive('code') ? 'bg-gray-200' : ''}
				title="Inline Code"
			>
				<Code className="h-4 w-4" />
			</Button>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* Headings */}
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				className={
					editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
				}
				title="Heading 1"
			>
				<Heading1 className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className={
					editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
				}
				title="Heading 2"
			>
				<Heading2 className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				className={
					editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
				}
				title="Heading 3"
			>
				<Heading3 className="h-4 w-4" />
			</Button>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* Lists */}
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
				title="Bullet List"
			>
				<List className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={
					editor.isActive('orderedList') ? 'bg-gray-200' : ''
				}
				title="Numbered List"
			>
				<ListOrdered className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={
					editor.isActive('blockquote') ? 'bg-gray-200' : ''
				}
				title="Quote"
			>
				<Quote className="h-4 w-4" />
			</Button>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* Link */}
			<Button variant="ghost" size="sm" onClick={setLink} title="Add Link">
				<LinkIcon className="h-4 w-4" />
			</Button>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* Undo/Redo */}
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().undo()}
				title="Undo (Cmd+Z)"
			>
				<Undo className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().redo()}
				title="Redo (Cmd+Shift+Z)"
			>
				<Redo className="h-4 w-4" />
			</Button>

			<div className="ml-auto text-xs text-gray-500">
				<span className="hidden sm:inline">
					Tip: Use [[note-title]] to link notes • $math$ for inline LaTeX • $$math$$ for
					block
				</span>
			</div>
		</div>
	);
}
