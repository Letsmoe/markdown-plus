/**
 * We need to collect all h2 and h3 headings, we will display them as a tree view in the file.
 */
const scrollingSidebar = document.querySelector("#heading-sidebar");
const h2 = Array.from(document.querySelectorAll("h2"));
for (const heading of h2) {
    // Since we wouldn't know what h3 headings to display after this one, we collect them separately going forward from this node until we hit the next h2.
    const h3 = nextUntil(heading, "h2", "h3");
    const h2Link = document.createElement("a");
    h2Link.classList.add("heading");
    h2Link.innerText = heading.innerText;
    h2Link.href = "#" + heading.id;
    scrollingSidebar.appendChild(h2Link);
    for (const subHeading of h3) {
        const h3Link = document.createElement("a");
        h3Link.classList.add("subheading");
        h3Link.innerText = subHeading.innerText;
        h3Link.href = "#" + subHeading.id;
        scrollingSidebar.appendChild(h3Link);
    }
}
function getHeadingPositions() {
    return Array.from(document.querySelectorAll(".inner-body h2, .inner-body h3")).map(x => {
        return {
            top: x.getBoundingClientRect().top,
            element: x
        };
    });
}
function nextUntil(elem, selector, filter) {
    // Setup siblings array
    var siblings = [];
    // Get the next sibling element
    elem = elem.nextElementSibling;
    // As long as a sibling exists
    while (elem) {
        // If we've reached our match, bail
        if (elem.matches(selector))
            break;
        // If filtering by a selector, check if the sibling matches
        if (filter && !elem.matches(filter)) {
            elem = elem.nextElementSibling;
            continue;
        }
        // Otherwise, push it to the siblings array
        siblings.push(elem);
        // Get the next sibling element
        elem = elem.nextElementSibling;
    }
    return siblings;
}
;
window.onscroll = () => {
    const currentY = window.scrollY;
    const positions = getHeadingPositions();
    let current;
    for (const { element, top } of positions) {
        if (top < currentY) {
            current = element;
        }
    }
    if (current) {
        let id = current.id;
        let active = scrollingSidebar.querySelector(".active");
        let newActive = scrollingSidebar.querySelector(`[href='#${id}']`);
        if (active != newActive) {
            if (active)
                active.classList.remove("active");
            if (newActive)
                newActive.classList.add("active");
        }
    }
};
