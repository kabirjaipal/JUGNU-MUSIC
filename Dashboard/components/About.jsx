const React = require("react");
const client = require("../..");
const DefaultLayout = require("./Layout");

const About = () => {
  return (
    <DefaultLayout title={`${client.user.username} About`}>
      <div>
        <h1> {client.user.username} About </h1>
      </div>
    </DefaultLayout>
  );
};

module.exports = About;
