import React from "react";
import "./CustomTable.css";

const CustomTable = ({
  columns = [],
  children,
  loading,
  emptyMessage = "No Data Found",
  loaderSize = "md", // sm, md, lg
  loaderText = "Loading...",
}) => {
  const allChildren = React.Children.toArray(children);

  // Loader size styles
  const getLoaderSize = () => {
    switch(loaderSize) {
      case 'sm':
        return { width: '40px', height: '40px', borderWidth: '3px' };
      case 'lg':
        return { width: '80px', height: '80px', borderWidth: '5px' };
      case 'xl':
        return { width: '100px', height: '100px', borderWidth: '6px' };
      default:
        return { width: '60px', height: '60px', borderWidth: '4px' };
    }
  };

  const loaderStyle = getLoaderSize();

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
              <td colSpan={columns.length} className="py-5">
                <div className="table-loader-custom">
                  <div className="spinner-custom" style={loaderStyle}>
                    <div className="ring-custom ring-1"></div>
                    <div className="ring-custom ring-2"></div>
                    <div className="ring-custom ring-3"></div>
                    <div className="ring-custom ring-4"></div>
                  </div>
                  {loaderText && <p className="loader-text-custom">{loaderText}</p>}
                </div>
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

      {/* Inline Styles for Loader */}
      <style>
        {`
          .table-loader-custom {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
            padding: 20px;
          }

          .spinner-custom {
            position: relative;
            display: inline-block;
          }

          .ring-custom {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            animation: spinCustom 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          }

          .ring-1 {
            border: 4px solid transparent;
            border-top: 4px solid #667eea;
            border-bottom: 4px solid #667eea;
            animation-delay: 0s;
          }

          .ring-2 {
            border: 4px solid transparent;
            border-left: 4px solid #764ba2;
            border-right: 4px solid #764ba2;
            animation-delay: 0.2s;
          }

          .ring-3 {
            border: 4px solid transparent;
            border-top: 4px solid #f093fb;
            border-bottom: 4px solid #f093fb;
            animation-delay: 0.4s;
          }

          .ring-4 {
            border: 4px solid transparent;
            border-left: 4px solid #4facfe;
            border-right: 4px solid #4facfe;
            animation-delay: 0.6s;
          }

          @keyframes spinCustom {
            0% {
              transform: rotate(0deg) scale(0.8);
              opacity: 0.5;
            }
            50% {
              transform: rotate(180deg) scale(1.1);
              opacity: 1;
            }
            100% {
              transform: rotate(360deg) scale(0.8);
              opacity: 0.5;
            }
          }

          .loader-text-custom {
            margin: 0;
            font-size: 14px;
            font-weight: 500;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: pulseText 1.5s ease-in-out infinite;
          }

          @keyframes pulseText {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          /* Sizes */
          .spinner-custom.small {
            width: 40px;
            height: 40px;
          }
          .spinner-custom.small .ring-custom {
            border-width: 3px;
          }
          .spinner-custom.large {
            width: 80px;
            height: 80px;
          }
          .spinner-custom.large .ring-custom {
            border-width: 5px;
          }
          .spinner-custom.xlarge {
            width: 100px;
            height: 100px;
          }
          .spinner-custom.xlarge .ring-custom {
            border-width: 6px;
          }
        `}
      </style>
    </div>
  );
};

export default CustomTable;