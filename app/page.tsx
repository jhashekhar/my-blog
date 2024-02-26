import Image from 'next/image';

export default function Home() {
	return (
		<div className="bg-customPink">
			<div className="flex items-left mx-auto h-screen max-w-screen-md sm:pt-10 sm:text-left px-5 md:max-w-2">
				<title>Shekhar Jha </title>
				<div className="md:flex flex-col py-1 px-8">
					<Image src="/pfp.png" width={80} height={80} alt="Shekhar Jha" />
					<div className="pb-3">
						<span className="font-normal text-xs">Shekhar Jha, </span>
						<span className="font-normal text-xs text-gray-500">
							Engineering at{' '}
						</span>
						<a
							href="https://getminima.com"
							className="font-normal text-xs underline underline-offset-4 decoration-1 decoration-gray-300 hover:text-blue-400 hover:decoration-blue-400"
						>
							Minima
						</a>
					</div>

					<div className="text-xs">
						<span className="text-gray-500 font-normal">My software </span>
						<a
							href="https://www.joelonsoftware.com/2009/09/23/the-duct-tape-programmer/"
							className="font-normal underline underline-offset-4 decoration-1 decoration-gray-300 hover:text-blue-400 hover:decoration-blue-400"
						>
							philosophy.
						</a>
					</div>
					<div className="py-2 text-xs">
						<p className="pb-1">
							Email -{' '}
							<a
								href="mailto:sj@shekharjha.com"
								className="underline underline-offset-4 decoration-gray-300 hover:text-blue-400 hover:decoration-blue-400"
							>
								sj [at] shekharjha.com
							</a>
						</p>
						<p>
							Github -{' '}
							<a
								href="https://github.com/jhashekhar"
								className="underline underline-offset-4 decoration-gray-300 hover:underline hover:text-blue-400 hover:decoration-blue-400"
							>
								jhashekhar
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
