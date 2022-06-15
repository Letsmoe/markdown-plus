const TypographyConfig = {
    include: ["+-", "-+", "==", "===", "=>", "<=", "==>", "<==", "!=", "!=="],
    exclude: [],
    _replace: [
        [/\+-/g, "&plusmn;"],
        [/-\+/g, "&minus;"],
        [/==/g, "&equals;"],
        [/===/g, "&#x2261;"],
        [/=>/g, "&rarr;"],
        [/<=/g, "&larr;"],
        [/==>/g, "&rArr;"],
        [/<==/g, "&lArr;"],
        [/!=/g, "&ne;"],
        [/!==/g, "&#x2260;"],
    ],
};
export default TypographyConfig;
