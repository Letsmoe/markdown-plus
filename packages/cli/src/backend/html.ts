import { marked } from "marked";

export default function(options: any) {
	return function(content: string) {
		return marked.parse(content);
	}
}