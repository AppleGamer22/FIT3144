import * as Blockly from "blockly";
import { resetHasUnsavedChangesHandling } from "./unsavedChangesHandling";
import { workspace, getCode } from "./blocklyHandling";
import {
  saveFileBrowser as saveFile,
  copyToClipboard,
  readFile,
} from "./fileUtils";
import JSZip from "../jszip";

function copyXMLToClipboard() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  copyToClipboard(xml);
  resetHasUnsavedChangesHandling();
}

function download(text, name, type) {
  var file = new Blob([text], { type: type });
  saveFile(file, name);
  resetHasUnsavedChangesHandling();
}

function downloadWorkspace() {
  var xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
  download(xml, "algorithm.xml", "text/xml");
}

async function downloadWorkspaceAsJS() {
  // Read needed files for the project and prepare the files if necessary
  let algorithm = await prepare_algorithm();
  let message_handler = await prepare_messagerhandler();
  let csv_handler = prepare_csvhandler();
  let readme = await readFile("./export/README.md");
  let main = await readFile("./export/main.mjs");
  let logging = await prepare_logging();
  let jszip = await readFile("./scripts/jszip.js");
  let fileutils = await prepare_fileUtils();
  let plot_handler = await prepare_plotting();
  // Check if everything worked out
  if (
    ![
      algorithm,
      message_handler,
      csv_handler,
      readme,
      main,
      logging,
      plot_handler,
    ].every((f) => f != false)
  ) {
    alert("Something went wrong, please try again.");
    return;
  }
  // Zip and download the files
  let zip = new JSZip();
  zip.file("algorithm.js", algorithm);
  zip.file("MessageHandler.js", message_handler);
  zip.file("CSVHandler.mjs", csv_handler);
  zip.file("README.md", readme);
  zip.file("main.mjs", main);
  zip.file("modules/IOHAnalyzerHandler.mjs", logging);
  zip.file("jszip.js", jszip);
  zip.file("PlotHandler.mjs", plot_handler);
  zip.folder("modules");
  zip.file("modules/fileUtils.mjs", fileutils);
  let zip_file = await zip.generateAsync({ type: "blob" });
  saveFile(zip_file, "elea.zip");
}

async function prepare_messagerhandler() {
  // Add import statements for thread API
  // Add message handling of the current thread
  // Add export statement of the module
  let file;
  if (!(file = await readFile("./scripts/MessageHandler.js"))) return false;
  let code =
    `const { Worker, parentPort } = require("worker_threads");\n` +
    file +
    `// redirect messages from the parent to the message handler\n` +
    `// labels the source as having an ID of 0 - the parent's ID\n` +
    `parentPort.onmessage = function (msg) {\n` +
    `msg.data.source = Handler.PARENT_ID;\n` +
    `Handler.handleIncomingMessage(msg.data);\n` +
    `};\n` +
    `module.exports = {\n` +
    ` Message,\n` +
    ` MessageHandler,\n` +
    ` consolelog,\n` +
    ` consoleerror,\n` +
    ` save_in_csv,\n` +
    ` plot,\n` +
    ` Handler,\n` +
    ` RecvRequest,\n` +
    `};`;
  return code;
}

function prepare_algorithm() {
  // Add import statements for thread handling and needed functions from the MessageHandler
  // Setting the parent port to forward messages to the main thread
  let setup =
    `const {parentPort, Worker} = require("worker_threads");\n` +
    `const {Handler, consolelog, save_in_csv, plot, consoleerror, Message, RecvRequest} = require("./MessageHandler.js");\n` +
    `const {cpus} = require("os");\n` +
    `Handler.setParentPort(parentPort);\n`;

  let js = getCode();
  // remove "var" and add globalThis to the big variable declaration
  // at the beginning of the file
  let var_declaration = js
    .split("\n")
    .shift()
    .replace("var", "")
    .replace(";", "")
    .split(" ")
    .join(" globalThis.");
  js = js.split("\n");
  js.shift();
  js = js.join("\n");
  let tmp = setup + var_declaration + "\n" + js;
  return tmp;
}

async function prepare_csvhandler() {
  let file, lines, code;
  if (!(file = await readFile("./scripts/CSVHandler.js"))) return false;
  // remove importstatement of workspace.js
  lines = file.split("\n");
  lines.shift();
  code = lines.join("\n");
  // rename fileUtils to fileUtils.mjs
  code = code.replace("/fileUtils", "/fileUtils.mjs");
  return code;
}

async function prepare_fileUtils() {
  // Import fs for the node env
  let file;
  if (!(file = await readFile("./scripts/modules/fileUtils.js"))) return false;
  let code = `import fs from "fs";\n`;
  code += file;
  return code;
}

async function prepare_logging() {
  let file, code;
  if (!(file = await readFile("./scripts/modules/IOHAnalyzerHandler.js")))
    return false;
  // rename fileUtils to fileUtils.mjs
  code = file.replace("/fileUtils", "/fileUtils.mjs");
  return code;
}

async function prepare_plotting() {
  let file, code;
  if (!(file = await readFile("./scripts/PlotHandler.js"))) return false;
  // I will create a link to some helpfull starting points on how to plot with Python/R
  code =
    "//Plotting is currently only supported on the website. Use the CSV-generation to create CSV-files.";
  code += file;
  return code;
}

export { downloadWorkspace, copyXMLToClipboard, downloadWorkspaceAsJS };
