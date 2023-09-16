import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import Prism from 'prismjs';
// import 'prismjs/components/prism-javascript';
import withAuth from '../ts/withAuth.jsx';
import matter from 'gray-matter';
import Link from 'next/link';

const renderer = new marked.Renderer();
renderer.paragraph = (text) => {
	return `<p class="text-base">${text}</p>`;
};

renderer.heading = (text, level) => {
	const tailwindClass =
		level <= 2 ? 'text-3xl' : level === 3 ? 'text-2xl' : 'text-xl';
	return `<h${level} class="${tailwindClass} pb-4 pt-6">${text}</h${level}>\n`;
};

/*
renderer.code = function (code, language) {
	const highlightedCode = Prism.highlight(
		code,
		Prism.languages[language],
		language
	);
	return `<pre class="language-${language}"><code class="language-${language}">${highlightedCode}</code></pre>\n`;
};
*/

renderer.list = function (body, ordered) {
	const type = ordered ? 'ol' : 'ul';
	const listStyleType = ordered ? 'list-decimal' : 'list-disc';
	return `<${type} class="mx-2 my-4 ${listStyleType} list-inside">${body}</${type}>\n`;
};

marked.setOptions({ renderer });

export async function getPosts() {
	/*
	const filePath = path.join(process.cwd(), 'posts_md', 'test.md');
	const markdown = fs.readFileSync(filePath, 'utf-8');
	const html = marked.parse(markdown);
  */
	const filespath = path.join(process.cwd(), 'tulsi_emails');
	const filenames = fs.readdirSync(filespath);
	const titles = filenames.map((filename) => {
		const temp = path.join(process.cwd(), 'tulsi_emails', `${filename}`);
		const markdown = fs.readFileSync(temp, 'utf-8');
		const { data } = matter(markdown);
		console.log('Data', data);
		return data;
	});

	return {
		titles,
		filenames,
	};
}

export function LinksOfPosts({ titles }: { titles: any[] }) {
	return (
		<>
			<div className="mt-12 mb-6">
				<span className="text"> Other posts</span>
			</div>
			<ul>
				{titles.map((title, idx) => {
					return (
						<li key={idx} className="py-1 tracking-wide text-sm">
							-{' '}
							<Link className="hover:underline" href={`/tulsi/${title.date}`}>
								{title.title}
							</Link>
						</li>
					);
				})}
			</ul>
		</>
	);
}

async function LettersForTulsi() {
	const { titles } = await getPosts();
	return (
		<div className="mt-48 mx-auto flex flex-col justify-center items-center">
			<div>
				<span className="font-bold text-lg text-purple-400">Writings</span>
			</div>
			<div className="ml-1 flex items-left">
				<LinksOfPosts titles={titles} />
			</div>
		</div>
	);
}

export default LettersForTulsi;
