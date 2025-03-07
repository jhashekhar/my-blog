import Image from 'next/image';

export default function Home() {
	return (
		<div className="bg-customPink">
			<div className="flex items-left mx-auto h-screen max-w-screen-md sm:pt-10 sm:text-left px-5 md:max-w-2">
				<title>Shekhar Jha </title>
				<div className="md:flex flex-col py-1 px-8">
					<Image src="/pfp.png" width={80} height={80} alt="Shekhar Jha" />
					<div className="pb-3">
						<span className="font-normal text-xs">Shekhar Jha</span>
					</div>
					<div className="flex flex-row gap-1">
						<span className="font-normal text-xs text-gray-500 text-[11px]">
							Engineering at{' '}
						</span>
						<a
							href="https://peakenergy.com"
							className="font-normal text-xs underline underline-offset-4 decoration-1 decoration-gray-300 hover:text-blue-400 hover:decoration-blue-400"
						>
							Peak Energy,
						</a>
						<a
							href="https://getminima.com"
							className="font-normal text-xs underline underline-offset-4 decoration-1 decoration-gray-300 hover:text-blue-400 hover:decoration-blue-400"
						>
							Minima
						</a>
					</div>

					<div className="mt-2 text-xs">
						<span className="text-gray-500 font-normal">My software </span>
						<a
							href="https://www.joelonsoftware.com/2009/09/23/the-duct-tape-programmer/"
							className="font-normal underline underline-offset-4 decoration-1 decoration-gray-300 hover:text-blue-400 hover:decoration-blue-400"
						>
							philosophy.
						</a>
					</div>
					<div className="flex flex-col gap-1">
						<p className="mt-4 mb-2 text-xs text-gray-500">
							Reach me at -{' '}
							<a
								href="mailto:sj@shekharjha.com"
								className="underline font-medium underline-offset-4 decoration-gray-300 text-slate-700 hover:text-blue-400 hover:decoration-blue-400"
							>
								sj [at] shekharjha.com
							</a>
						</p>
						<p className="flex flex-row items-center gap-2 pb-2 text-xs">
							<span className="text-gray-500">Socials -</span>
							<a
								href="https://github.com/jhashekhar"
								className="text-blue-400 underline underline-offset-2 decoration-gray-300 hover:underline hover:text-blue-400 hover:decoration-blue-400"
							>
								Github
							</a>
							<a
								href="https://in.linkedin.com/in/jshekhar"
								className="text-blue-400 underline underline-offset-2 decoration-gray-300 hover:underline hover:text-blue-400 hover:decoration-blue-400"
							>
								LinkedIn
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
