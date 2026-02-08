import { Mark, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface WikiLinkOptions {
	HTMLAttributes: Record<string, any>;
	onNoteClick?: (slug: string) => void;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		wikiLink: {
			/**
			 * Set a wiki link mark
			 */
			setWikiLink: (attributes: { slug: string; title: string }) => ReturnType;
			/**
			 * Unset a wiki link mark
			 */
			unsetWikiLink: () => ReturnType;
		};
	}
}

/**
 * WikiLink extension for Tiptap
 * Handles [[note-title]] syntax and renders as clickable links
 */
export const WikiLink = Mark.create<WikiLinkOptions>({
	name: 'wikiLink',

	priority: 1000,

	addOptions() {
		return {
			HTMLAttributes: {},
			onNoteClick: undefined,
		};
	},

	addAttributes() {
		return {
			slug: {
				default: null,
			},
			title: {
				default: null,
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'span[data-wiki-link]',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'span',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				'data-wiki-link': '',
				class: 'wiki-link cursor-pointer text-blue-600 hover:underline',
			}),
			0,
		];
	},

	addCommands() {
		return {
			setWikiLink:
				(attributes) =>
				({ commands }) => {
					return commands.setMark(this.name, attributes);
				},
			unsetWikiLink:
				() =>
				({ commands }) => {
					return commands.unsetMark(this.name);
				},
		};
	},

	addProseMirrorPlugins() {
		const { onNoteClick } = this.options;

		return [
			new Plugin({
				key: new PluginKey('wikiLinkHandler'),
				props: {
					handleClick(view, pos, event) {
						const target = event.target as HTMLElement;
						if (target.hasAttribute('data-wiki-link')) {
							const slug = target.getAttribute('data-slug');
							if (slug && onNoteClick) {
								onNoteClick(slug);
								return true;
							}
						}
						return false;
					},
					decorations(state) {
						const decorations: Decoration[] = [];
						const doc = state.doc;

						// Find all [[...]] patterns and decorate them
						doc.descendants((node, pos) => {
							if (node.isText && node.text) {
								const regex = /\[\[([^\]]+)\]\]/g;
								let match;

								while ((match = regex.exec(node.text)) !== null) {
									const from = pos + match.index;
									const to = from + match[0].length;
									const title = match[1];

									decorations.push(
										Decoration.inline(from, to, {
											class: 'wiki-link-decoration bg-blue-50 px-1 rounded',
											'data-wiki-title': title,
										})
									);
								}
							}
						});

						return DecorationSet.create(doc, decorations);
					},
				},
			}),
		];
	},
});
