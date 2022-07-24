enum DependencyType {
	IMAGE,
	LINK
}

interface Dependency {
	name: string,
	data: {
		type: DependencyType,
		text: string,
		path: string
	}
}

export { DependencyType, Dependency }