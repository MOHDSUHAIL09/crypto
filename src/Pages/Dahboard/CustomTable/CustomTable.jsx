import React from "react";
import "./CustomTable.css";

const CustomTable = ({
  columns = [],
  children,
  loading,
  emptyMessage = "No Data Found",
}) => {
  const allChildren = React.Children.toArray(children);

  return (
    <div className="table-responsive custom-table-wrapper">
      <table className="custom-table text-center align-middle">
        
        {/* TABLE HEADER */}
        <thead>
  <tr>
    {columns.map((col, i) => (
      <th key={i}>
        <span
          className="th-content"
          style={{ color: col === "Sl.No." ? "black" : undefined }}
        >
          {col}
        </span>
      </th>
    ))}
  </tr>
</thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-4">
                <div className="table-loader">Loading...</div>
              </td>
            </tr>
          ) : allChildren.length > 0 ? (
            allChildren.map((child, index) =>
              React.cloneElement(child, {
                key: index,
                className: `${
                  child.props.className || ""
                } custom-table-row ${
                  index % 2 === 0 ? "row-gray" : "row-white"
                }`.trim(),
              })
            )
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-4 text-muted">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;