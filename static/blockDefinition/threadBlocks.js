export const blockDefinitions = [
  {
    type: "run_thread",
    message0: "Run in %1 threads %2 do %3 save %4 in %5",
    args0: [
      {
        type: "input_value",
        name: "thread_count",
        check: "Number",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "thread_statements",
      },
      {
        type: "input_value",
        name: "return_value",
      },
      {
        type: "field_variable",
        name: "output_array",
        variable: "result",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 389,
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "run_thread_limited",
    message0: "Run in %1 threads limited to %2 do %3 save %4 in %5",
    args0: [
      {
        type: "input_value",
        name: "thread_count",
        check: "Number",
      },
      {
        type: "input_value",
        name: "thread_limit",
        check: "Number",
      },
      {
        type: "input_statement",
        name: "thread_statements",
      },
      {
        type: "input_value",
        name: "return_value",
      },
      {
        type: "field_variable",
        name: "output_array",
        variable: "result",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 389,
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "thread_num",
    message0: "Thread ID",
    inputsInline: true,
    output: "Number",
    colour: 389,
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "thread_hardware_concurrency",
    message0: "Hardware Concurrency",
    inputsInline: true,
    output: "Number",
    colour: 389,
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "thread_import_variable",
    message0: "import %1 into thread",
    args0: [
      {
        type: "field_variable",
        name: "input",
      },
    ],
    inputInLine: true,
    previousStatement: ["ThreadImport", "ThreadStart"],
    nextStatement: ["ThreadImport"],
    colour: 389,
  },

  {
    type: "fibonacci",
    message0: "Calculate Fibonacci of %1",
    args0: [
      {
        type: "input_value",
        name: "fib_number",
        check: "Number",
      },
    ],
    inputsInline: true,
    output: null,
    colour: 389,
    tooltip: "",
    helpUrl: "",
  },
];
