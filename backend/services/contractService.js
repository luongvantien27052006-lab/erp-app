const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const libre = require("libreoffice-convert");

exports.generateContract = async (data, templatePath, outputPath) => {
  const content = fs.readFileSync(templatePath, "binary");

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip);

  doc.setData({
    fullName: data.fullName,
    dob: data.dob,
    address: data.address,
    phone: data.phone,
    parentPhone: data.parentPhone,
    cccd: data.cccd,
    cccdIssueDate: data.cccdIssueDate,
    cccdIssuePlace: data.cccdIssuePlace,
  });

  doc.render();

  const buf = doc.getZip().generate({ type: "nodebuffer" });

  // save docx
  fs.writeFileSync(outputPath + ".docx", buf);

  // convert PDF
  return new Promise((resolve, reject) => {
    libre.convert(buf, ".pdf", undefined, (err, done) => {
      if (err) return reject(err);

      fs.writeFileSync(outputPath + ".pdf", done);
      resolve(outputPath + ".pdf");
    });
  });
};