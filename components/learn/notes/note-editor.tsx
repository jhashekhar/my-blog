'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Mathematics from '@tiptap/extension-mathematics';
import { WikiLink } from '@/lib/tiptap/extensions';
import { useRouter } from 'next/navigation';
import { EditorToolbar } from './editor-toolbar';

interface NoteEditorProps {
	content?: any;
	onChange?: (content: any) => void;
	placeholder?: string;
	editable?: boolean;
}

export function NoteEditor({
	content,
	onChange,
	placeholder = 'Start writing your note... Use [[note-title]] to link to other notes.',
	editable = true,
}: NoteEditorProps) {
	const router = useRouter();

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: 'text-blue-600 hover:underline',
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
			CharacterCount,
			Mathematics,
			WikiLink.configure({
				onNoteClick: (slug: string) => {
					router.push(`/learn/notes/${slug}`);
				},
			}),
		],
		content,
		editable,
		onUpdate: ({ editor }) => {
			if (onChange) {
				onChange(editor.getJSON());
			}
		},
		editorProps: {
			attributes: {
				class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] px-4 py-3',
			},
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="border rounded-lg overflow-hidden bg-white">
			{editable && <EditorToolbar editor={editor} />}
			<EditorContent editor={editor} className="min-h-[400px]" />
			{editable && (
				<div className="border-t px-4 py-2 text-xs text-gray-500 flex justify-between">
					<span>{editor.storage.characterCount.characters()} characters</span>
					<span>{editor.storage.characterCount.words()} words</span>
				</div>
			)}
		</div>
	);
}
