const React = require("react");


function DefaultLayout(props) {
    return (
        <html>
            <head>
                <title>{props.title}</title>
                <link rel="stylesheet" href="css/index.css" />
                <link rel="stylesheet" href="css/about.css" />
                <link rel="stylesheet" href="css/footer.css" />
                <link rel="stylesheet" href="css/commands.css" />
            </head>
            <body>{props.children}</body>
        </html>
    );
}

module.exports = DefaultLayout;
