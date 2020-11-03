export interface Episode {
	track: string;
	title: string;
	duration: number;
	description: string;
	date: Date;
	open: boolean;
	progress?: number;
	image: string;
	downloaded: boolean;
}