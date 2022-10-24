const React = require("react");
const client = require("../..");
const DefaultLayout = require("./Layout");

const Commands = () => {
  return (
    <DefaultLayout title={`${client.user.username} Commands`}>
      <div>
        <h1> {client.user.username} Commands </h1>
        <table>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
          </tr>
          {client.mcommands.map((cmd, index) => (
            <tr key={index}>
              <td>{cmd.name}</td>
              <td> {cmd.description} </td>
              <td> {cmd.category} </td>
            </tr>
          ))}
        </table>
      </div>
    </DefaultLayout>
  );
};

module.exports = Commands;
