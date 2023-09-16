import React from 'react';
// import withAuth from './withAuth';

function Personal() {
	const [isZoomed, setIsZoomed] = React.useState(false);

	const handleClick = () => {
		setIsZoomed(!isZoomed);
	};
	return (
		<div className="mx-24 w-48 grid grid-cols-1 justify-center">
			<span className="pb-10 italic">hey, babe ❤️</span>
			{/*<div
				onClick={handleClick}
				style={{
					cursor: 'pointer',
					overflow: 'hidden',
					transform: isZoomed ? 'scale(2.0)' : 'scale(1.0)',
					transition: 'transform .5s',
				}}
			>
				<Image
					src="/sketch.jpeg"
					height={1000}
					width={800}
					alt="Tulsi sitting on the head of Shekhar!"
				/>
			</div>
			<Image
				src="/ts_sj.png"
				height={240}
				width={320}
				alt="Tulsi sitting on the head of Shekhar!"
			/>
			<span className="pt-3 text-xs underline italic">
				description: Tulsi sitting on the head of Shekhar!
			</span>
      */}
		</div>
	);
}

export default Personal;
