/**
 * We need to collect all h2 and h3 headings, we will display them as a tree view in the file.
 */
declare const scrollingSidebar: Element;
declare const h2: HTMLHeadingElement[];
declare function getHeadingPositions(): {
    top: number;
    element: Element;
}[];
declare function nextUntil(elem: Element, selector: string, filter: string): HTMLElement[];
