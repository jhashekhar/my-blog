'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { uploadPaperPDF } from '@/lib/actions/papers';
import { Upload, FileText, X } from 'lucide-react';

interface PdfUploadProps {
	paperId: string;
	onUploadComplete?: () => void;
}

export function PdfUpload({ paperId, onUploadComplete }: PdfUploadProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (file.type !== 'application/pdf') {
			setError('Please select a PDF file');
			return;
		}

		// Validate file size (max 50MB)
		const maxSize = 50 * 1024 * 1024;
		if (file.size > maxSize) {
			setError('File size must be less than 50MB');
			return;
		}

		setError(null);
		setIsUploading(true);
		setUploadProgress(0);

		try {
			// Simulate progress (InstantDB upload doesn't provide progress events)
			const progressInterval = setInterval(() => {
				setUploadProgress((prev) => Math.min(prev + 10, 90));
			}, 200);

			await uploadPaperPDF(file, paperId);

			clearInterval(progressInterval);
			setUploadProgress(100);

			// Call callback if provided
			if (onUploadComplete) {
				onUploadComplete();
			}

			// Reset after success
			setTimeout(() => {
				setIsUploading(false);
				setUploadProgress(0);
			}, 1000);
		} catch (err) {
			console.error('Upload error:', err);
			setError('Failed to upload PDF. Please try again.');
			setIsUploading(false);
			setUploadProgress(0);
		}

		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<div className="space-y-4">
			<input
				ref={fileInputRef}
				type="file"
				accept=".pdf"
				onChange={handleFileSelect}
				className="hidden"
			/>

			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col items-center justify-center space-y-4">
						<div className="rounded-full bg-gray-100 p-4">
							{isUploading ? (
								<Upload className="h-8 w-8 text-gray-600 animate-pulse" />
							) : (
								<FileText className="h-8 w-8 text-gray-600" />
							)}
						</div>

						{!isUploading ? (
							<>
								<div className="text-center">
									<p className="text-sm font-medium">Upload PDF</p>
									<p className="text-xs text-gray-500 mt-1">
										PDF files up to 50MB
									</p>
								</div>
								<Button onClick={() => fileInputRef.current?.click()}>
									<Upload className="mr-2 h-4 w-4" />
									Select PDF File
								</Button>
							</>
						) : (
							<div className="w-full space-y-2">
								<div className="text-center">
									<p className="text-sm font-medium">Uploading...</p>
									<p className="text-xs text-gray-500 mt-1">
										{uploadProgress}%
									</p>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-blue-600 h-2 rounded-full transition-all duration-300"
										style={{ width: `${uploadProgress}%` }}
									/>
								</div>
							</div>
						)}

						{error && (
							<div className="flex items-center gap-2 text-sm text-red-600">
								<X className="h-4 w-4" />
								{error}
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
