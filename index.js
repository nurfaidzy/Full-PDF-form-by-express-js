const express = require("express");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Route to fill the PDF form
app.post("/fill-pdf", async (req, res) => {
  const { dataFill } = req.body;

  try {
    const pdfPath = "pdfFileForFill.pdf";
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Log page sizes before modification
    pdfDoc.getPages().forEach((page, idx) => {
      const { width, height } = page.getSize();
      console.log(`Page ${idx + 1} size before: ${width} x ${height}`);
    });

    const form = pdfDoc.getForm();

    // Optional: List all field names for verification
    form.getFields().forEach((field) => {
      console.log(`Field Name: ${field.getName()}`);
    });

    form.getTextField("name").setText(dataFill.name);
    
    // Log page sizes after modification
    pdfDoc.getPages().forEach((page, idx) => {
      const { width, height } = page.getSize();
      console.log(`Page ${idx + 1} size after: ${width} x ${height}`);
    });
    pdfDoc.getPages().forEach((page, idx) => {
      const { width, height } = page.getSize();
      console.log(`Page ${idx + 1} size after: ${width} x ${height}`);
    });

    // Save the PDF with compatibility options
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: false,
    });

    // Generate a filename with the current timestamp
    const timestamp = Date.now();
    const filename = `filePdf-${timestamp}.pdf`;

    // Save the PDF to the same directory
    fs.writeFileSync(filename, pdfBytes);

    // Send a success response
    res.status(200).send(`File saved as ${filename}`);
  } catch (err) {
    console.error("Error filling PDF form:", err);
    res.status(500).send("Error filling PDF form");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
