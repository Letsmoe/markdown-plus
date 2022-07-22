export default function render(content, options) {
    return `<!DOCTYPE html>
	<html>
		<head>
			<link rel="stylesheet" type="text/css" href="/style/main.css">
		</head>
		<body>
			<div id="sidebar" class="sidebar"></div>
			<div class="inner-body">${content}</div>
		</body>
		<script src="/scripts/docs.js"></script>
		<script src="/scripts/summary.js"></script>
	</html>`;
}
