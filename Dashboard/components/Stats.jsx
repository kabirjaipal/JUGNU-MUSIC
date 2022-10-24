const React = require("react");
const client = require("../..");
const DefaultLayout = require("./Layout");

const Commands = () => {
  return (
    <DefaultLayout title={`${client.user.username} Stats`}>
      <div>
        <h1> {client.user.username} Stats </h1>
      </div>
    </DefaultLayout>
  );
};

module.exports = Commands;
