// pages/blog/[post].js
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import matter from 'gray-matter';
import React from 'react';
import { SinglePost } from '../Post';

function getTitle(filename: string) {
	const temp = path.join(process.cwd(), 'tulsi_emails', `${filename}`);
	const markdown = fs.readFileSync(temp, 'utf-8');
	const { data } = matter(markdown);
	return data.title;
}

let allPostData: {
	[x: string]: { title: any; date: any; description: any; html: string };
}[];

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

function getPostData() {
	const baseDir = path.join(process.cwd(), 'tulsi_emails');
	const markdownPaths = fs.readdirSync(
		path.join(process.cwd(), 'tulsi_emails')
	);

	const markdowns = markdownPaths.map((file) => path.join(baseDir, file));

	const data = markdowns.map((md) => {
		let markdown = fs.readFileSync(md, 'utf-8');
		markdown = markdown.replace(/\n(?=\n)/g, '<br/>');
		const { data, content } = matter(markdown);
		const html = marked.parse(content);
		return {
			[data.date]: {
				title: data.title,
				date: data.date,
				description: data.description,
				html,
			},
		};
	});
	// console.log('DATA: ', data);

	return data;
}

export async function generateStaticParams() {
	const filespath = path.join(process.cwd(), 'tulsi_emails');
	const filenames = fs.readdirSync(filespath);
	getPostData();

	const paths = filenames.map((filename) => {
		// console.log('FILENAMES: ', filenames);
		// console.log(path.join(filespath, filename));
		// const { data, html } = await generateHTML(path.join(filespath, filename));
		return {
			slug: filename.slice(0, -3),
			post: filename,
			// filepath: path.join(filespath, filename).toString(),

			//post: getTitle(filename),
		};
	});

	// console.log('PATHS: ', paths);

	return paths;
}

// allPostData = getPostData();

async function Post({ params }: { params: { slug: string; post: string } }) {
	const { slug, post } = params;

	return <SinglePost val={slug} />;
}

export default Post;
