export default function(options) {
	return {
		getOutput: (lexed: any) => {
			console.log(lexed[1].tokens);
			return ""
		},
		getMetadata: () => {

		},
		defaultExtension: "html",
		getLinks: () => {
			
		}
	}
}