import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportFile = async ({
  data,
  fileName = "Report",
  sheetName = "Sheet1",
  type = "xlsx",
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  if (data?.length > 0) {
    worksheet.columns = Object.keys(data[0]).map((key) => ({
      header: key,
      key,
      width: 20,
    }));

    worksheet.addRows(data);
    worksheet.getRow(1).font = { bold: true };
  }

  if (type === "csv") {
    const buffer = await workbook.csv.writeBuffer();

    saveAs(
      new Blob([buffer], { type: "text/csv;charset=utf-8;" }),
      `${fileName}.csv`
    );
  } else {
    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${fileName}.xlsx`
    );
  }
};

export const exportToPDF = ({
  title = "Report",
  fileName = "Report",
  columns = [],
  data = [],
  orientation = "landscape",
}) => {
  const doc = new jsPDF(orientation);

  // Heading
  doc.setFontSize(18);
  doc.text(title, 14, 15);

  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 25,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [13, 110, 253],
    },
    theme: "grid",
  });

  doc.save(`${fileName}.pdf`);
};