import fs from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import path from 'path';
import { LinksOfPosts, getPosts } from './page';

interface PostDataType {
	title: any;
	date: any;
	description: any;
	html: string;
}
let allPostData: PostDataType[];

type ReturnAllPostFn = () => PostDataType[];

const getPostData: ReturnAllPostFn = () => {
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
			title: data.title,
			date: data.date,
			description: data.description,
			html,
		};
	});
	console.log('DATA: ', data);

	return data;
};

allPostData = getPostData();

export async function SinglePost({ val }: { val: string }) {
	const data = getPostData();
	const item = data.find((d) => d.date === val);
	const { titles } = await getPosts();
	return (
		<div className="mx-auto w-full mt-24 mb-24 grid grid-cols-5 gap-x-24 justify-items">
			<div className="col-span-2 justify-self-end">
				<p className="py-1 italic text-xs font-semibold">
					{item ? item.title : ''}
				</p>
				<p className="py-2 italic text-xs font-semibold">
					{item ? item.date : ''}
				</p>
				<LinksOfPosts titles={titles} />
			</div>
			<div className="mr-48 col-span-3">
				<div className="mb-10">
					<span className="text-xl font-bold tracking-wide text-purple-500">
						{item ? item.description : ''}
					</span>
				</div>

				{item?.html && (
					<div
						className="text-sm"
						dangerouslySetInnerHTML={{ __html: item.html }}
					/>
				)}
			</div>
		</div>
	);
}
