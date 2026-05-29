import React from "react";
import {
  BsFiletypeXls,
  BsFiletypeCsv,
  BsFiletypePdf,
} from "react-icons/bs";

const ExportModal = ({
  show,
  onClose,
  onExport,
  activeTab,
  setActiveTab,
  selectedRange,
  setSelectedRange,
  totalRecords,
  currentRecords,
}) => {
  if (!show) return null;

  const formats = [
    { key: "excel", label: "Excel", icon: <BsFiletypeXls size={20} /> },
    { key: "csv", label: "CSV", icon: <BsFiletypeCsv size={20} /> },
    { key: "pdf", label: "PDF", icon: <BsFiletypePdf size={20} /> },
  ];

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className="modal show d-block">
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Export Data</h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <h6 className="fw-bold text-start">Select Format</h6>

              <div className="row mb-4">
                {formats.map((format) => (
                  <div className="col-md-4" key={format.key}>
                    <div
                      className={`format-card text-center p-3 rounded-3 ${
                        activeTab === format.key ? "active-format" : ""
                      }`}
                      onClick={() => setActiveTab(format.key)}
                    >
                      {format.icon}

                      <p
                        className={`fw-semibold mb-0 mt-1 ${
                          activeTab === format.key
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        {format.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <h6 className="fw-bold text-start">Data Range</h6>

              <div
                className={`range-card d-flex justify-content-between align-items-center mb-3 ${
                  selectedRange === "all" ? "active-range" : ""
                }`}
              >
                <div className="d-flex align-items-center gap-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={selectedRange === "all"}
                    onChange={() => setSelectedRange("all")}
                  />
                  <h6 className="fw-bold mt-1">All Data</h6>
                </div>

                <h6 className="text-muted mt-1">
                  {totalRecords} records
                </h6>
              </div>

              <div
                className={`range-card d-flex justify-content-between align-items-center mb-3 ${
                  selectedRange === "search" ? "active-range" : ""
                }`}
              >
                <div className="d-flex align-items-center gap-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={selectedRange === "search"}
                    onChange={() => setSelectedRange("search")}
                  />
                  <h6 className="fw-bold mt-1">
                    Current Search Results
                  </h6>
                </div>

                <h6 className="text-muted mt-1">
                  {currentRecords} records
                </h6>
              </div>

              <div
                className={`range-card d-flex align-items-center gap-3 ${
                  selectedRange === "custom" ? "active-range" : ""
                }`}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  checked={selectedRange === "custom"}
                  onChange={() => setSelectedRange("custom")}
                />

                <h6 className="fw-bold mt-1">
                  Custom Date Range
                </h6>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="btn btn-sm btn-primary"
                onClick={onExport}
              >
                <i className="bi bi-download me-2"></i>
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportModal;