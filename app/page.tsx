import Image from 'next/image';

export default function Home() {
	return (
		<div className="min-h-screen flex justify-center px-6 pt-32">
			<div className="max-w-3xl">
				<Image
					src="/pfp.png"
					width={140}
					height={140}
					alt="Shekhar Jha"
					className="mb-6"
				/>

				<p className="text-[14px] text-gray-700 mb-6 leading-relaxed">
					I work at{' '}
					<a
						href="https://peakenergy.com"
						className="font-medium hover:text-orange-600"
					>
						Peak Energy
					</a>{' '}
					where I build software for manufacturing.
				</p>

				<div className="flex items-center gap-4 text-sm">
					<a
						href="https://github.com/jhashekhar"
						className="text-gray-700 hover:text-gray-500 underline underline-offset-2"
					>
						Github
					</a>
					<a
						href="https://in.linkedin.com/in/jshekhar"
						className="text-gray-700 hover:text-gray-500 underline underline-offset-2"
					>
						LinkedIn
					</a>
					<a
						href="mailto:sj@shekharjha.com"
						className="text-gray-700 hover:text-gray-500 underline underline-offset-2"
					>
						Email
					</a>
				</div>
			</div>
		</div>
	);
}
