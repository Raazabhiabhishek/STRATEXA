const { spawn } = require("child_process");
const path = require("path");

exports.analyzeDecision = (req, res) => {
  const pythonPath = "python";
  const scriptPath = path.join(
    __dirname,
    "../../ai-engine/ai_model.py"
  );

  const inputData = JSON.stringify(req.body);

  const pythonProcess = spawn(pythonPath, [scriptPath, inputData]);

  let result = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python Error:", data.toString());
  });

  pythonProcess.on("close", () => {
    try {
      const aiResponse = JSON.parse(result);
      res.json({
        success: true,
        source: "Python AI Engine",
        input: req.body,
        output: aiResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "AI processing failed",
      });
    }
  });
};
