import Image from 'next/image';

export default function Home() {
	return (
		<div className="max-w-screen-md sm:pt-10 mx-auto font-normal tracking-wide leading-relaxed sm:text-left px-5 md:max-w-2">
			<title>Shekhar Jha </title>
			<div className="md:flex flex-col py-2">
				{/* <div className="text-xl tracking-wide pb-8">About Me</div> */}
				<div className="text-sm">
					hey i&apos;m shekhar, my engineering{' '}
					<a
						href="https://www.joelonsoftware.com/2009/09/23/the-duct-tape-programmer/"
						className="font-medium hover:underline hover:text-yellow-800"
					>
						philosophy
					</a>
				</div>
				<div className="py-4 text-sm">
					<p>
						email -{' '}
						<a
							href="mailto:shekharj@protonmail.com"
							className="underline hover:text-indigo-600"
						>
							shekharj@protonmail.com
						</a>
					</p>
					<p>
						{' '}
						github -{' '}
						<a
							href="https://github.com/jhashekhar"
							className="hover:underline hover:text-red-600"
						>
							jhashekhar
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
